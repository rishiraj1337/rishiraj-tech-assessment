import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import { AuthProvider } from '../context/AuthContext';

describe('RegisterPage Component', () => {
  it('renders registration form elements', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </AuthProvider>
    );

    expect(screen.getByText(/Create your account/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Alex Runner/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/alex.runner@example.com/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Minimum 6 characters/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeTruthy();
  });

  it('validates password length on submit', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <RegisterPage />
        </BrowserRouter>
      </AuthProvider>
    );

    const nameInput = screen.getByPlaceholderText(/Alex Runner/i);
    const emailInput = screen.getByPlaceholderText(/alex.runner@example.com/i);
    const passInput = screen.getByPlaceholderText(/Minimum 6 characters/i);

    fireEvent.change(nameInput, { target: { value: 'Alex' } });
    fireEvent.change(emailInput, { target: { value: 'alex@example.com' } });
    fireEvent.change(passInput, { target: { value: '123' } });

    const submitBtn = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Password must be at least 6 characters long/i)).toBeTruthy();
  });
});
