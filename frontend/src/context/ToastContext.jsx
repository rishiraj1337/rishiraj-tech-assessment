import { createContext, useContext, useState, useCallback } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'info', message, title, duration = 4000 }) => {
    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const toast = { id, type, message, title };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const error = useCallback((message, title = 'Error') => {
    return showToast({ type: 'error', message, title });
  }, [showToast]);

  const success = useCallback((message, title = 'Success') => {
    return showToast({ type: 'success', message, title });
  }, [showToast]);

  const info = useCallback((message, title = 'Note') => {
    return showToast({ type: 'info', message, title });
  }, [showToast]);

  // Helper to extract clean user friendly error message from Axios errors
  const formatApiError = useCallback((err, fallback = 'An unexpected error occurred.') => {
    if (!err) return fallback;
    if (typeof err === 'string') return err;

    if (err.response) {
      const status = err.response.status;
      const data = err.response.data;

      // Custom backend message if provided
      if (data?.message) return data.message;
      if (typeof data === 'string' && data.length < 150) return data;

      if (status === 400) return 'Invalid request. Please check your inputs.';
      if (status === 401) return 'Invalid email or password. Please verify your credentials.';
      if (status === 403) return 'You do not have permission to perform this action.';
      if (status === 404) return 'The requested resource could not be found.';
      if (status === 409) return 'An account with this email address already exists.';
      if (status >= 500) return 'A server error occurred. Please try again shortly.';
    }

    if (err.request) {
      return 'Unable to reach the server. Please verify the backend is running.';
    }

    return err.message || fallback;
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, error, success, info, removeToast, formatApiError }}>
      {children}

      {/* Floating Toast Notification Stack */}
      <div
        className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="assertive"
      >
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isSuccess = toast.type === 'success';

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border-2 border-gray-900 shadow-brutal transition-all animate-slideIn ${
                isError
                  ? 'bg-rose-50 text-gray-900 border-gray-900'
                  : isSuccess
                  ? 'bg-lime text-gray-900 border-gray-900'
                  : 'bg-sky text-gray-900 border-gray-900'
              }`}
              role="alert"
            >
              {/* Type Icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isError && (
                  <div className="w-6 h-6 rounded-lg bg-coral/20 border border-gray-900/30 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-coral" />
                  </div>
                )}
                {isSuccess && (
                  <div className="w-6 h-6 rounded-lg bg-white/70 border border-gray-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-gray-900" />
                  </div>
                )}
                {!isError && !isSuccess && (
                  <div className="w-6 h-6 rounded-lg bg-white/70 border border-gray-900/30 flex items-center justify-center">
                    <Info className="w-4 h-4 text-gray-900" />
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className="flex-1 min-w-0">
                {toast.title && (
                  <p className="text-xs font-black uppercase tracking-wider text-gray-900 leading-tight mb-0.5">
                    {toast.title}
                  </p>
                )}
                <p className="text-xs sm:text-sm font-semibold text-gray-800 break-words leading-snug">
                  {toast.message}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 p-1 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-black/5 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
