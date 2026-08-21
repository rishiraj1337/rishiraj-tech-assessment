import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '../context/ToastContext';

function TestConsumer() {
  const { error, success, info, formatApiError } = useToast();

  return (
    <div>
      <button onClick={() => error('Invalid email format', 'Validation Failed')}>
        Trigger Error
      </button>
      <button onClick={() => success('Workout saved successfully', 'Session Saved')}>
        Trigger Success
      </button>
      <button onClick={() => info('Weekly target updated', 'Notice')}>
        Trigger Info
      </button>
      <button
        onClick={() => {
          const fakeErr = { response: { status: 409, data: { message: 'Email already in use' } } };
          error(formatApiError(fakeErr), 'Conflict');
        }}
      >
        Trigger Api Error
      </button>
    </div>
  );
}

describe('Toast Notification System', () => {
  it('renders and displays error toast on trigger', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    const btn = screen.getByRole('button', { name: /Trigger Error/i });
    fireEvent.click(btn);

    expect(screen.getByText(/Validation Failed/i)).toBeTruthy();
    expect(screen.getByText(/Invalid email format/i)).toBeTruthy();
  });

  it('renders and displays success toast on trigger', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    const btn = screen.getByRole('button', { name: /Trigger Success/i });
    fireEvent.click(btn);

    expect(screen.getByText(/Session Saved/i)).toBeTruthy();
    expect(screen.getByText(/Workout saved successfully/i)).toBeTruthy();
  });

  it('formats API errors nicely', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    const btn = screen.getByRole('button', { name: /Trigger Api Error/i });
    fireEvent.click(btn);

    expect(screen.getByText(/Conflict/i)).toBeTruthy();
    expect(screen.getByText(/Email already in use/i)).toBeTruthy();
  });

  it('dismisses toast when close button is clicked', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    const btn = screen.getByRole('button', { name: /Trigger Info/i });
    fireEvent.click(btn);

    expect(screen.getByText(/Weekly target updated/i)).toBeTruthy();

    const closeBtn = screen.getByRole('button', { name: /Dismiss/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/Weekly target updated/i)).toBeNull();
  });
});
