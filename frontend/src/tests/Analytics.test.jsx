import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Analytics from '../pages/Analytics';
import { AuthProvider } from '../context/AuthContext';

vi.mock('../api', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({
      data: [
        { id: 1, activity: 'Morning Run', duration: 45, valueAchieved: 10, workoutDate: '2026-08-20' },
        { id: 2, activity: 'Strength', duration: 60, valueAchieved: 100, workoutDate: '2026-08-19' }
      ]
    })),
  }
}));

describe('Analytics Component', () => {
  it('renders performance analytics headings and metric sections', () => {
    render(
      <AuthProvider>
        <Analytics />
      </AuthProvider>
    );

    expect(screen.getByText(/Performance & Analytics/i)).toBeTruthy();
    expect(screen.getByText(/Total Training Time/i)).toBeTruthy();
    expect(screen.getByText(/7-Day Training Volume/i)).toBeTruthy();
    expect(screen.getByText(/Personal Bests & Records/i)).toBeTruthy();
  });
});
