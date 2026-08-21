import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

describe('LoginPage Component', () => {
  it('renders login form with email and password inputs', () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    );

    expect(screen.getByText(/Welcome back/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/alex.runner@example.com/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeTruthy();
  });

  it('validates empty inputs on submit and displays error', async () => {
    const { container } = render(
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    );

    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(screen.getAllByText(/Please enter your email and password/i).length).toBeGreaterThan(0);
  });
});
