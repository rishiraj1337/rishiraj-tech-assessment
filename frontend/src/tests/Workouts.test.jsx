import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Workouts, { sortWorkouts, matchesCategory } from '../pages/Workouts';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

const mockWorkouts = [
  { id: 1, activity: 'Morning 5k Run', duration: 45, valueAchieved: 5, workoutDate: '2026-08-20' },
  { id: 2, activity: 'Heavy Bench Press', duration: 60, valueAchieved: 100, workoutDate: '2026-08-18' },
  { id: 3, activity: 'HIIT Cardio Blast', duration: 30, valueAchieved: 30, workoutDate: '2026-08-19' },
  { id: 4, activity: 'Cycling Peloton Ride', duration: 50, valueAchieved: 20, workoutDate: '2026-08-21' },
];

vi.mock('../api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({
      data: [
        { id: 1, activity: 'Morning 5k Run', duration: 45, valueAchieved: 5, workoutDate: '2026-08-20' },
        { id: 2, activity: 'Heavy Bench Press', duration: 60, valueAchieved: 100, workoutDate: '2026-08-18' },
        { id: 3, activity: 'HIIT Cardio Blast', duration: 30, valueAchieved: 30, workoutDate: '2026-08-19' },
        { id: 4, activity: 'Cycling Peloton Ride', duration: 50, valueAchieved: 20, workoutDate: '2026-08-21' },
      ]
    })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
  }
}));

describe('Workouts Component - Sorting & Filtering Logic', () => {
  beforeEach(() => {
    sessionStorage.setItem('jwt', 'fake-jwt-token');
    sessionStorage.setItem('user', JSON.stringify({ id: 1, name: 'Alex Runner', email: 'alex@example.com' }));
  });

  it('correctly matches activities to categories using keyword heuristics', () => {
    expect(matchesCategory('Morning 5k Run', 'Running')).toBe(true);
    expect(matchesCategory('Heavy Bench Press', 'Weightlifting')).toBe(true);
    expect(matchesCategory('HIIT Blast', 'HIIT / Cardio')).toBe(true);
    expect(matchesCategory('Peloton Spin', 'Cycling')).toBe(true);
    expect(matchesCategory('Random Walk', 'All')).toBe(true);
    expect(matchesCategory('Morning 5k Run', 'Cycling')).toBe(false);
  });

  it('correctly sorts workouts by newest, oldest, duration, and alphabetical', () => {
    const byNewest = sortWorkouts(mockWorkouts, 'newest');
    expect(byNewest[0].workoutDate).toBe('2026-08-21');
    expect(byNewest[3].workoutDate).toBe('2026-08-18');

    const byOldest = sortWorkouts(mockWorkouts, 'oldest');
    expect(byOldest[0].workoutDate).toBe('2026-08-18');
    expect(byOldest[3].workoutDate).toBe('2026-08-21');

    const byDuration = sortWorkouts(mockWorkouts, 'duration-desc');
    expect(byDuration[0].duration).toBe(60);
    expect(byDuration[3].duration).toBe(30);

    const byAlpha = sortWorkouts(mockWorkouts, 'alpha-asc');
    expect(byAlpha[0].activity).toBe('Cycling Peloton Ride');
    expect(byAlpha[3].activity).toBe('Morning 5k Run');
  });

  it('renders workouts heading, search, and category tabs', async () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <Workouts />
        </AuthProvider>
      </ToastProvider>
    );

    expect(screen.getByRole('heading', { name: /Workout Sessions/i })).toBeTruthy();
    expect(screen.getByPlaceholderText(/Search activities by name/i)).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText(/Morning 5k Run/i)).toBeTruthy();
      expect(screen.getByText(/Heavy Bench Press/i)).toBeTruthy();
    });
  });

  it('filters workouts when clicking category tabs', async () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <Workouts />
        </AuthProvider>
      </ToastProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Morning 5k Run/i)).toBeTruthy();
    });

    const runningBtn = screen.getByRole('button', { name: /Running/i });
    fireEvent.click(runningBtn);

    expect(screen.getByText(/Morning 5k Run/i)).toBeTruthy();
    expect(screen.queryByText(/Heavy Bench Press/i)).toBeNull();
  });

  it('opens and closes workout logging modal', () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <Workouts />
        </AuthProvider>
      </ToastProvider>
    );

    const logBtn = screen.getByRole('button', { name: /Log Workout/i });
    fireEvent.click(logBtn);

    expect(screen.getByText(/Session Date/i)).toBeTruthy();
    expect(screen.getByText(/Active workout time/i)).toBeTruthy();

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);
  });
});
