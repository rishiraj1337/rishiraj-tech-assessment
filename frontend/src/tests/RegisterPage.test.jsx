import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage, { validatePassword } from '../pages/RegisterPage';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';

describe('RegisterPage Component & Password Validation', () => {
  it('validates password requirements correctly via validatePassword helper', () => {
    expect(validatePassword('')).toBe('Password must be at least 8 characters long.');
    expect(validatePassword('short1')).toBe('Password must be at least 8 characters long.');
    expect(validatePassword('12345678')).toBe('Password must contain at least one letter.');
    expect(validatePassword('abcdefgh')).toBe('Password must contain at least one number.');
    expect(validatePassword('ValidPass123')).toBeNull();
  });

  it('renders registration form elements and Target Builder', () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <RegisterPage />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    );

    expect(screen.getByText(/Create your account/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Alex Runner/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/alex.runner@example.com/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Minimum 8 characters/i)).toBeTruthy();
    expect(screen.getByText(/Custom Target Builder/i)).toBeTruthy();
    expect(screen.getByText(/Converted Weekly Target/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeTruthy();
  });

  it('shows interactive password requirement indicators when typing', () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <RegisterPage />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    );

    const passInput = screen.getByPlaceholderText(/Minimum 8 characters/i);
    fireEvent.change(passInput, { target: { value: 'Secret123' } });

    expect(screen.getByText(/8\+ chars/i)).toBeTruthy();
    expect(screen.getByText(/1\+ letter/i)).toBeTruthy();
    expect(screen.getByText(/1\+ number/i)).toBeTruthy();
  });

  it('toggles target builder info box when clicking How it works button', () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <RegisterPage />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    );

    const infoBtn = screen.getByRole('button', { name: /How it works/i });
    fireEvent.click(infoBtn);

    expect(screen.getByText(/How Momentum Targets Work/i)).toBeTruthy();
  });

  it('switches frequency mode to Sessions and updates calculation', () => {
    render(
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <RegisterPage />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    );

    const sessionsBtn = screen.getByRole('button', { name: /Sessions/i });
    fireEvent.click(sessionsBtn);

    expect(screen.getByText(/Workouts \/ Week/i)).toBeTruthy();
    expect(screen.getByText(/Minutes \/ Session/i)).toBeTruthy();
  });

  it('validates password requirements on submit', async () => {
    const { container } = render(
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <RegisterPage />
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    );

    const nameInput = screen.getByPlaceholderText(/Alex Runner/i);
    const emailInput = screen.getByPlaceholderText(/alex.runner@example.com/i);
    const passInput = screen.getByPlaceholderText(/Minimum 8 characters/i);

    fireEvent.change(nameInput, { target: { value: 'Alex' } });
    fireEvent.change(emailInput, { target: { value: 'alex.runner@example.com' } });
    fireEvent.change(passInput, { target: { value: '123' } });

    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(screen.getAllByText(/Password must be at least 8 characters long/i).length).toBeGreaterThan(0);
  });
});
