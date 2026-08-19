import { Navigate } from 'react-router-dom';

const AUTH_ENABLED = import.meta.env.VITE_AUTH_ENABLED === 'true';

export default function AuthGate({ children }) {
  if (!AUTH_ENABLED) return children;

  const authed = sessionStorage.getItem('authed') === 'true';

  if (!authed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}