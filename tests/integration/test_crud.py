import requests
import sys
import json
import time
from datetime import date

BASE_URL = "http://localhost:8080"

passed_count = 0
failed_count = 0

def log_step(name):
    print(f"\n[TEST] {name}")

def assert_status(response, expected_status, test_name):
    global passed_count, failed_count
    if response.status_code == expected_status:
        passed_count += 1
        print(f"  [PASS] {test_name} (Status: {response.status_code})")
        return True
    else:
        failed_count += 1
        print(f"  [FAIL] {test_name} (Expected: {expected_status}, Got: {response.status_code})")
        print(f"    Response body: {response.text}")
        return False

def main():
    print("==================================================")
    print("      MOMENTUM BACKEND CRUD INTEGRATION TEST      ")
    print("==================================================")

    # 1. Health Check
    log_step("1. Actuator Health Check")
    res = requests.get(f"{BASE_URL}/actuator/health")
    if assert_status(res, 200, "Health check endpoint is UP"):
        print(f"    Health status: {res.json().get('status')}")

    # 2. Auth: Register a new user
    log_step("2. Auth: User Registration")
    ts = int(time.time())
    test_email = f"alex_runner_{ts}@example.com"
    register_payload = {
        "email": test_email,
        "password": "secretpassword123",
        "name": "Alex Runner",
        "goalType": "running",
        "targetValue": 50.0
    }
    res = requests.post(f"{BASE_URL}/api/auth/register", json=register_payload)
    assert_status(res, 201, "Register new user via /api/auth/register")
    auth_data = res.json()
    token = auth_data.get("token")
    registered_user = auth_data.get("user")
    user_id = registered_user.get("id") if registered_user else None
    print(f"    Registered User ID: {user_id}, Name: {registered_user.get('name') if registered_user else 'N/A'}")

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Auth: Duplicate registration prevention
    log_step("3. Auth: Prevent Duplicate Email Registration")
    res = requests.post(f"{BASE_URL}/api/auth/register", json=register_payload)
    assert_status(res, 409, "Duplicate registration returns 409 Conflict")

    # 4. Auth: Login with invalid credentials
    log_step("4. Auth: Login with Invalid Password")
    invalid_login = {"email": test_email, "password": "wrongpassword"}
    res = requests.post(f"{BASE_URL}/api/auth/login", json=invalid_login)
    assert_status(res, 401, "Invalid password returns 401 Unauthorized")

    # 5. Auth: Login with valid credentials
    log_step("5. Auth: Login with Valid Credentials")
    valid_login = {"email": test_email, "password": "secretpassword123"}
    res = requests.post(f"{BASE_URL}/api/auth/login", json=valid_login)
    assert_status(res, 200, "Valid login returns 200 OK and JWT token")

    # 6. Auth Protection: Access protected endpoint without token
    log_step("6. Security: Access Protected Endpoint Without JWT")
    res = requests.get(f"{BASE_URL}/api/users")
    assert_status(res, 401, "Unauthenticated request returns 401 Unauthorized")

    # 7. User CRUD: Create User via /api/users
    log_step("7. User CRUD: Create User via POST /api/users")
    new_user_email = f"sarah_crossfit_{ts}@example.com"
    create_user_payload = {
        "email": new_user_email,
        "password": "password456",
        "name": "Sarah Crossfit",
        "goalType": "crossfit",
        "targetValue": 75.0
    }
    res = requests.post(f"{BASE_URL}/api/users", json=create_user_payload, headers=headers)
    assert_status(res, 201, "Create user via /api/users")
    sarah_user = res.json()
    sarah_id = sarah_user.get("id")
    print(f"    Created User ID: {sarah_id}, Email: {sarah_user.get('email')}")

    # 8. User CRUD: Read all users
    log_step("8. User CRUD: Read All Users")
    res = requests.get(f"{BASE_URL}/api/users", headers=headers)
    assert_status(res, 200, "Get all users via GET /api/users")
    users = res.json()
    print(f"    Total users returned: {len(users)}")

    # 9. User CRUD: Read user by ID
    log_step(f"9. User CRUD: Read User by ID ({sarah_id})")
    res = requests.get(f"{BASE_URL}/api/users/{sarah_id}", headers=headers)
    assert_status(res, 200, f"Get user by id /api/users/{sarah_id}")
    print(f"    User details: Name={res.json().get('name')}, Goal={res.json().get('goalType')}")

    # 10. User CRUD: Update user
    log_step(f"10. User CRUD: Update User ({sarah_id})")
    update_user_payload = {
        "name": "Sarah Connor",
        "email": new_user_email,
        "goalType": "powerlifting",
        "targetValue": 120.0
    }
    res = requests.put(f"{BASE_URL}/api/users/{sarah_id}", json=update_user_payload, headers=headers)
    assert_status(res, 200, f"Update user via PUT /api/users/{sarah_id}")
    updated_user = res.json()
    print(f"    Updated Goal: {updated_user.get('goalType')}, Target: {updated_user.get('targetValue')}")

    # 11. Workout CRUD: Create Workout
    log_step("11. Workout CRUD: Create Workout Log")
    create_workout_payload = {
        "workoutDate": date.today().isoformat(),
        "activity": "Morning Interval Run",
        "duration": 45,
        "valueAchieved": 10.5,
        "userId": user_id
    }
    res = requests.post(f"{BASE_URL}/api/workouts", json=create_workout_payload, headers=headers)
    assert_status(res, 201, "Create workout via POST /api/workouts")
    workout = res.json()
    workout_id = workout.get("id")
    print(f"    Created Workout ID: {workout_id}, Activity: {workout.get('activity')}, Value: {workout.get('valueAchieved')}")

    # 12. Workout Validation Test: Missing required fields
    log_step("12. Workout Validation: Reject Invalid Workout Payload")
    invalid_workout_payload = {
        "workoutDate": None,
        "activity": "",
        "duration": -10,
        "userId": user_id
    }
    res = requests.post(f"{BASE_URL}/api/workouts", json=invalid_workout_payload, headers=headers)
    assert_status(res, 400, "Invalid workout payload returns 400 Bad Request")

    # 13. Workout CRUD: Read All Workouts (Paged)
    log_step("13. Workout CRUD: Read All Workouts (Paged)")
    res = requests.get(f"{BASE_URL}/api/workouts?page=0&size=10", headers=headers)
    assert_status(res, 200, "Get workouts page via GET /api/workouts")
    page_data = res.json()
    print(f"    Total elements: {page_data.get('totalElements')}, Page size: {page_data.get('size')}")

    # 14. Workout CRUD: Read Workout by ID
    log_step(f"14. Workout CRUD: Read Workout by ID ({workout_id})")
    res = requests.get(f"{BASE_URL}/api/workouts/{workout_id}", headers=headers)
    assert_status(res, 200, f"Get workout by id /api/workouts/{workout_id}")

    # 15. Workout CRUD: Update Workout
    log_step(f"15. Workout CRUD: Update Workout ({workout_id})")
    update_workout_payload = {
        "workoutDate": date.today().isoformat(),
        "activity": "Evening Tempo Run",
        "duration": 50,
        "valueAchieved": 12.0,
        "userId": user_id
    }
    res = requests.put(f"{BASE_URL}/api/workouts/{workout_id}", json=update_workout_payload, headers=headers)
    assert_status(res, 200, f"Update workout via PUT /api/workouts/{workout_id}")
    updated_workout = res.json()
    print(f"    Updated Activity: {updated_workout.get('activity')}, Value: {updated_workout.get('valueAchieved')}")

    # 16. User-specific Workouts Endpoint
    log_step(f"16. Service Logic: Get Workouts for User ({user_id})")
    res = requests.get(f"{BASE_URL}/api/users/{user_id}/workouts", headers=headers)
    assert_status(res, 200, f"Get user workouts via GET /api/users/{user_id}/workouts")
    user_workouts = res.json()
    print(f"    User workout count: {len(user_workouts)}")

    # 17. Weekly Summary Service Logic
    log_step(f"17. Service Logic: Get Weekly Summary for User ({user_id})")
    res = requests.get(f"{BASE_URL}/api/users/{user_id}/weekly-summary", headers=headers)
    assert_status(res, 200, f"Get weekly summary via GET /api/users/{user_id}/weekly-summary")
    summary = res.json()
    print(f"    Weekly Summary: Total Workouts={summary.get('totalWorkouts')}, Value Achieved={summary.get('totalValueAchieved')}, Target={summary.get('targetValue')}, Progress={summary.get('percentage'):.1f}%")
    print(f"    Week Window: {summary.get('weekStart')} to {summary.get('weekEnd')}")

    # 17b. Weekly Summary Edge Cases: Timezone, Custom Week Start, and Reference Date
    log_step(f"17b. Service Logic: Weekly Summary with Custom Parameters & Edge Cases")
    res = requests.get(
        f"{BASE_URL}/api/users/{user_id}/weekly-summary?date=2026-08-20&timezone=America/New_York&weekStart=SUNDAY",
        headers=headers
    )
    assert_status(res, 200, "Weekly summary with timezone, custom weekStart=SUNDAY, and date")
    custom_summary = res.json()
    print(f"    Sunday-aligned Week: {custom_summary.get('weekStart')} to {custom_summary.get('weekEnd')}")

    # 17c. Weekly Summary Edge Case: Historical date with 0 workouts
    log_step(f"17c. Service Logic: Weekly Summary for Historical Date with No Workouts")
    res = requests.get(
        f"{BASE_URL}/api/users/{user_id}/weekly-summary?date=2026-01-01&timezone=UTC",
        headers=headers
    )
    assert_status(res, 200, "Historical date weekly summary returns 0 workouts")
    hist_summary = res.json()
    assert hist_summary.get("totalWorkouts") == 0
    assert hist_summary.get("percentage") == 0.0

    # 18. Workout CRUD: Delete Workout
    log_step(f"18. Workout CRUD: Delete Workout ({workout_id})")
    res = requests.delete(f"{BASE_URL}/api/workouts/{workout_id}", headers=headers)
    assert_status(res, 204, f"Delete workout via DELETE /api/workouts/{workout_id}")

    # 19. Verify Workout Deletion
    log_step(f"19. Workout CRUD: Verify Deleted Workout ({workout_id})")
    res = requests.get(f"{BASE_URL}/api/workouts/{workout_id}", headers=headers)
    assert_status(res, 404, f"Accessing deleted workout returns 404 Not Found")

    # 20. User CRUD: Delete User with Cascade check
    log_step(f"20. User CRUD & Cascade: Delete User ({sarah_id})")
    sarah_workout_payload = {
        "workoutDate": date.today().isoformat(),
        "activity": "Crossfit WOD",
        "duration": 30,
        "valueAchieved": 5.0,
        "userId": sarah_id
    }
    requests.post(f"{BASE_URL}/api/workouts", json=sarah_workout_payload, headers=headers)
    
    res = requests.delete(f"{BASE_URL}/api/users/{sarah_id}", headers=headers)
    assert_status(res, 204, f"Delete user via DELETE /api/users/{sarah_id}")

    # 21. Verify User Deletion
    log_step(f"21. User CRUD: Verify Deleted User ({sarah_id})")
    res = requests.get(f"{BASE_URL}/api/users/{sarah_id}", headers=headers)
    assert_status(res, 404, f"Accessing deleted user returns 404 Not Found")

    # Final Summary
    print("\n==================================================")
    print("                  TEST SUMMARY                    ")
    print("==================================================")
    print(f"  Total Tests Executed : {passed_count + failed_count}")
    print(f"  Passed               : {passed_count}")
    print(f"  Failed               : {failed_count}")
    print("==================================================")

    if failed_count > 0:
        sys.exit(1)
    else:
        print("\nALL CRUD AND LOGIC TESTS PASSED SUCCESSFULLY.\n")

if __name__ == "__main__":
    main()
