import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { AuthProvider } from '../context/AuthContext';

describe('LoginPage Component', () => {
  it('renders login form with email and password inputs', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByText(/Welcome back/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/alex.runner@example.com/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeTruthy();
  });

  it('validates empty inputs on submit and displays error', async () => {
    const { container } = render(
      <AuthProvider>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthProvider>
    );

    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(screen.getByText(/Please enter your email and password/i)).toBeTruthy();
  });
});
