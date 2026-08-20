# Momentum Fitness Tracker API Documentation

Welcome to the Momentum Fitness Tracker REST API documentation. This document details all available endpoints, authentication mechanisms, request/response models, and error structures.

---

## 1. Overview & Base URL

- **Default Base URL:** `http://localhost:8080`
- **Frontend / Proxy URL:** `http://localhost:80` (routes `/api/*` to backend)
- **Interactive Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI 3.0 Spec:** `http://localhost:8080/api-docs`

---

## 2. Authentication

The API uses **JWT (JSON Web Token)** Bearer authentication.

When `APP_AUTH_ENABLED=true` (default):
- Include the token in the HTTP `Authorization` header for all protected endpoints:
  ```http
  Authorization: Bearer <your-jwt-token>
  ```
- Public endpoints (no token required):
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `/actuator/**`
  - `/swagger-ui/**`, `/swagger-ui.html`
  - `/api-docs/**`, `/v3/api-docs/**`

When `APP_AUTH_ENABLED=false` (e.g. during local dev with `make dev`):
- All endpoints are open without authentication headers.

---

## 3. Endpoints Reference

### 3.1. Authentication Endpoints

#### Register User
`POST /api/auth/register`

Creates a new user account and immediately returns an authentication token.

- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "Alex Runner",
    "goalType": "running",
    "targetValue": 50.0
  }
  ```
- **Responses:**
  - `201 Created`
    ```json
    {
      "token": "eyJhbGciOiJIUzM4NCJ9...",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "Alex Runner",
        "goalType": "running",
        "targetValue": 50.0,
        "createdAt": "2026-08-20T08:00:00",
        "updatedAt": "2026-08-20T08:00:00"
      }
    }
    ```
  - `409 Conflict`: If email is already registered.
  - `400 Bad Request`: Validation failure (e.g. password < 6 chars, invalid email).

---

#### Login User
`POST /api/auth/login`

Authenticates existing user credentials and returns a JWT token.

- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Responses:**
  - `200 OK`
    ```json
    {
      "token": "eyJhbGciOiJIUzM4NCJ9...",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "Alex Runner",
        "goalType": "running",
        "targetValue": 50.0,
        "createdAt": "2026-08-20T08:00:00",
        "updatedAt": "2026-08-20T08:00:00"
      }
    }
    ```
  - `401 Unauthorized`: Invalid email or password.

---

### 3.2. User Management Endpoints (`/api/users`)

#### Get All Users
`GET /api/users` *(Requires Auth)*

- **Responses:**
  - `200 OK`
    ```json
    [
      {
        "id": 1,
        "email": "user@example.com",
        "name": "Alex Runner",
        "goalType": "running",
        "targetValue": 50.0,
        "createdAt": "2026-08-20T08:00:00",
        "updatedAt": "2026-08-20T08:00:00"
      }
    ]
    ```

---

#### Get User by ID
`GET /api/users/{id}` *(Requires Auth)*

- **Parameters:** `id` (Long, Path)
- **Responses:**
  - `200 OK`: Returns [`UserResponse`](#userresponse).
  - `404 Not Found`: User does not exist.

---

#### Create User (Admin / CRUD)
`POST /api/users` *(Requires Auth)*

- **Request Body:**
  ```json
  {
    "email": "sarah@example.com",
    "password": "password456",
    "name": "Sarah Crossfit",
    "goalType": "crossfit",
    "targetValue": 75.0
  }
  ```
- **Responses:**
  - `201 Created`: Returns [`UserResponse`](#userresponse).
  - `409 Conflict`: Email already in use.
  - `400 Bad Request`: Validation failure.

---

#### Update User
`PUT /api/users/{id}` *(Requires Auth)*

- **Parameters:** `id` (Long, Path)
- **Request Body:**
  ```json
  {
    "name": "Sarah Connor",
    "email": "sarah@example.com",
    "goalType": "powerlifting",
    "targetValue": 120.0
  }
  ```
- **Responses:**
  - `200 OK`: Returns updated [`UserResponse`](#userresponse).
  - `404 Not Found`: User not found.
  - `409 Conflict`: New email is already used by another account.

---

#### Delete User
`DELETE /api/users/{id}` *(Requires Auth)*

Deletes a user and cascades deletion to all associated workout logs.

- **Parameters:** `id` (Long, Path)
- **Responses:**
  - `204 No Content`: Deletion successful.
  - `404 Not Found`: User not found.

---

#### Get User Workouts
`GET /api/users/{id}/workouts` *(Requires Auth)*

Retrieves all workout records belonging to the specified user.

- **Parameters:** `id` (Long, Path)
- **Responses:**
  - `200 OK`: Array of [`WorkoutResponse`](#workoutresponse).
  - `404 Not Found`: User not found.

---

#### Get Weekly Progress Summary
`GET /api/users/{id}/weekly-summary` *(Requires Auth)*

Calculates the current week's workout summary (Monday through Sunday) compared against the user's weekly target.

- **Parameters:** `id` (Long, Path)
- **Responses:**
  - `200 OK`
    ```json
    {
      "userId": 1,
      "goalType": "running",
      "targetValue": 50.0,
      "totalWorkouts": 3,
      "totalValueAchieved": 28.5,
      "percentage": 57.0,
      "weekStart": "2026-08-17",
      "weekEnd": "2026-08-23"
    }
    ```
  - `404 Not Found`: User not found.

---

### 3.3. Workout Log Endpoints (`/api/workouts`)

#### Create Workout Log
`POST /api/workouts` *(Requires Auth)*

- **Request Body:**
  ```json
  {
    "workoutDate": "2026-08-20",
    "activity": "Morning Interval Run",
    "duration": 45,
    "valueAchieved": 10.5,
    "userId": 1
  }
  ```
- **Responses:**
  - `201 Created`: Returns created [`WorkoutResponse`](#workoutresponse).
  - `400 Bad Request`: Validation failure.
  - `404 Not Found`: `userId` does not exist.

---

#### Get All Workouts (Paged)
`GET /api/workouts` *(Requires Auth)*

- **Query Parameters:**
  - `page` (int, default: 0): Zero-based page index.
  - `size` (int, default: 10): Number of records per page.
  - `sort` (string, optional): Sort criteria (e.g. `workoutDate,desc`).
- **Responses:**
  - `200 OK`: Returns [`PageWorkoutResponse`](#pageworkoutresponse).

---

#### Get Workout by ID
`GET /api/workouts/{id}` *(Requires Auth)*

- **Parameters:** `id` (Long, Path)
- **Responses:**
  - `200 OK`: Returns [`WorkoutResponse`](#workoutresponse).
  - `404 Not Found`: Workout not found.

---

#### Update Workout Log
`PUT /api/workouts/{id}` *(Requires Auth)*

- **Parameters:** `id` (Long, Path)
- **Request Body:**
  ```json
  {
    "workoutDate": "2026-08-20",
    "activity": "Evening Tempo Run",
    "duration": 50,
    "valueAchieved": 12.0,
    "userId": 1
  }
  ```
- **Responses:**
  - `200 OK`: Returns updated [`WorkoutResponse`](#workoutresponse).
  - `404 Not Found`: Workout or User not found.

---

#### Delete Workout Log
`DELETE /api/workouts/{id}` *(Requires Auth)*

- **Parameters:** `id` (Long, Path)
- **Responses:**
  - `204 No Content`: Successfully deleted.
  - `404 Not Found`: Workout not found.

---

## 4. Models & Schemas

### UserResponse
| Field | Type | Description |
|---|---|---|
| `id` | Long | Unique user identifier |
| `email` | String | User email address |
| `name` | String | User display name |
| `goalType` | String | Goal category (e.g., `running`, `strength`) |
| `targetValue` | Double | Numerical weekly target |
| `createdAt` | LocalDateTime | Entity creation timestamp |
| `updatedAt` | LocalDateTime | Entity last updated timestamp |

### WorkoutResponse
| Field | Type | Description |
|---|---|---|
| `id` | Long | Unique workout identifier |
| `workoutDate` | LocalDate | Date of the workout (`YYYY-MM-DD`) |
| `activity` | String | Activity description |
| `duration` | Integer | Duration in minutes |
| `valueAchieved` | Double | Units achieved (e.g. km, kg, reps) |
| `userId` | Long | Associated user ID |
| `createdAt` | LocalDateTime | Log creation timestamp |
| `updatedAt` | LocalDateTime | Log last updated timestamp |

### WeeklySummaryResponse
| Field | Type | Description |
|---|---|---|
| `userId` | Long | User ID |
| `goalType` | String | Active goal type |
| `targetValue` | Double | Weekly target goal |
| `totalWorkouts` | Integer | Total sessions logged in current week |
| `totalValueAchieved` | Double | Sum of `valueAchieved` in current week |
| `percentage` | Double | Completion percentage towards target |
| `weekStart` | LocalDate | Monday of current week |
| `weekEnd` | LocalDate | Sunday of current week |

---

## 5. Error Responses

Standard JSON error payloads:

```json
{
  "status": 400,
  "errors": [
    "activity: Activity is required",
    "duration: Duration must be positive"
  ]
}
```

```json
{
  "status": 404,
  "message": "User not found with id: 999"
}
```

```json
{
  "status": 409,
  "message": "Email already in use: user@example.com"
}
```

---

## 6. Included Assets

- **OpenAPI 3.0 Specification:** `api_docs/openapi.json`
- **Postman Collection (v2.1):** `api_docs/momentum_postman_collection.json`
