import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected Route wrapper that redirects unauthenticated users to /login
export default function AuthGate({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-dark-surface p-6 border-2 border-black shadow-neon-cyan">
          <div className="w-4 h-4 rounded-full bg-neon-cyan animate-ping" />
          <span className="font-mono text-neon-cyan font-bold text-lg uppercase tracking-wider">Loading Momentum...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
