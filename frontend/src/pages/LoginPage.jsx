import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthIllustration from '../components/illustrations/AuthIllustration';
import { Zap, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Invalid email or password. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side: Brand Banner & Undraw Illustration */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-neon-cyan border-2 border-black flex items-center justify-center shadow-brutal">
              <Zap className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="font-mono font-black text-3xl text-neon-cyan uppercase tracking-wider">
                MOMENTUM
              </h1>
              <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                Dark Neon Fitness Tracking
              </p>
            </div>
          </div>

          <AuthIllustration className="w-full max-w-sm mx-auto" />

          <div className="bg-dark-surface p-4 border-2 border-black shadow-brutal-sm">
            <p className="font-mono text-sm text-gray-300">
              <span className="text-neon-pink font-bold">⚡ TRACK GOALS.</span> Log daily workout sessions, monitor weekly targets, and build your athletic streak.
            </p>
          </div>
        </div>

        {/* Right Side: Neobrutalist Login Form */}
        <div className="bg-dark-surface p-6 sm:p-8 border-2 border-black shadow-neon-cyan">
          
          <div className="mb-6">
            <div className="lg:hidden flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-neon-cyan border-2 border-black flex items-center justify-center shadow-brutal-sm">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="font-mono font-black text-2xl text-neon-cyan uppercase tracking-wider">
                MOMENTUM
              </span>
            </div>
            <h2 className="font-mono font-black text-2xl sm:text-3xl text-gray-100 uppercase">
              Sign In
            </h2>
            <p className="font-mono text-sm text-gray-400 mt-1">
              Enter your credentials to access your fitness dashboard.
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="mb-6 p-3 bg-neon-pink/10 border-2 border-neon-pink text-neon-pink flex items-center space-x-2 font-mono text-xs font-bold shadow-brutal-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="alex.runner@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-card border-2 border-black text-gray-100 placeholder-gray-500 font-mono text-sm shadow-brutal-sm focus:border-neon-cyan focus:outline-none focus:shadow-neon-cyan transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-card border-2 border-black text-gray-100 placeholder-gray-500 font-mono text-sm shadow-brutal-sm focus:border-neon-cyan focus:outline-none focus:shadow-neon-cyan transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-6 bg-neon-cyan border-2 border-black text-black font-mono font-bold text-base uppercase tracking-wide shadow-brutal hover:bg-white hover:shadow-neon-pink transition-all active:translate-x-1 active:translate-y-1 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register link */}
          <div className="mt-6 pt-6 border-t-2 border-dark-border text-center">
            <p className="font-mono text-xs text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-neon-cyan font-bold hover:underline hover:text-neon-pink ml-1 uppercase"
              >
                Create Account →
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
