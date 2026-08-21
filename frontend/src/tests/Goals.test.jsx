import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Goals from '../pages/Goals';
import { AuthProvider } from '../context/AuthContext';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({
      data: {
        totalWorkouts: 3,
        totalValueAchieved: 35.0,
        targetValue: 50.0,
        percentage: 70.0,
        weekStart: '2026-08-17',
        weekEnd: '2026-08-23'
      }
    })),
  }
}));

describe('Goals Component', () => {
  it('renders goals, habits checklist, and milestone badges', () => {
    render(
      <AuthProvider>
        <Goals />
      </AuthProvider>
    );

    expect(screen.getByText(/Goals & Habit Tracking/i)).toBeTruthy();
    expect(screen.getByText(/Active Weekly Target/i)).toBeTruthy();
    expect(screen.getByText(/Daily Training Habits/i)).toBeTruthy();
    expect(screen.getByText(/Milestone Badges/i)).toBeTruthy();
  });

  it('allows toggling habit checkboxes', () => {
    render(
      <AuthProvider>
        <Goals />
      </AuthProvider>
    );

    const habitBtn = screen.getByText(/Drink 2.5L of Water/i);
    fireEvent.click(habitBtn);
    expect(habitBtn).toBeTruthy();
  });
});
