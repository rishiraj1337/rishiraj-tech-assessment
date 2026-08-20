import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

function TestConsumer() {
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? 'LOGGED_IN' : 'LOGGED_OUT'}</span>
      <span data-testid="user-name">{user?.name || 'GUEST'}</span>
      <button onClick={() => updateUser({ id: 1, name: 'Updated Athlete' })}>Update</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  it('provides initial unauthenticated guest state', () => {
    sessionStorage.clear();
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status').textContent).toBe('LOGGED_OUT');
    expect(screen.getByTestId('user-name').textContent).toBe('GUEST');
  });

  it('handles user updates', async () => {
    sessionStorage.clear();
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    const updateBtn = screen.getByRole('button', { name: /Update/i });
    await act(async () => {
      updateBtn.click();
    });

    expect(screen.getByTestId('user-name').textContent).toBe('Updated Athlete');
  });
});
