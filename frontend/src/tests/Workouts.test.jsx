import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Workouts from '../pages/Workouts';
import { AuthProvider } from '../context/AuthContext';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({
      data: [
        { id: 1, activity: 'Morning Run', duration: 45, valueAchieved: 10, workoutDate: '2026-08-20' },
        { id: 2, activity: 'Bench Press', duration: 30, valueAchieved: 80, workoutDate: '2026-08-19' }
      ]
    })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
  }
}));

describe('Workouts Component', () => {
  it('renders workouts heading and search bar', () => {
    render(
      <AuthProvider>
        <Workouts />
      </AuthProvider>
    );

    expect(screen.getByRole('heading', { name: /Workout Sessions/i })).toBeTruthy();
    expect(screen.getByPlaceholderText(/Search activities/i)).toBeTruthy();
  });

  it('opens and closes workout logging modal', () => {
    render(
      <AuthProvider>
        <Workouts />
      </AuthProvider>
    );

    const logBtn = screen.getByRole('button', { name: /Log Workout/i });
    fireEvent.click(logBtn);

    expect(screen.getByText(/Session Date/i)).toBeTruthy();
    expect(screen.getByText(/Active workout time/i)).toBeTruthy();

    const cancelBtn = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelBtn);
  });
});
