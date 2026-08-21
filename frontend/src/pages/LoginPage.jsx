import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, Flame, Target, Dumbbell, TrendingUp, Zap } from 'lucide-react';

const HIGHLIGHTS = [
  { icon: Target, label: 'Weekly Goals' },
  { icon: Dumbbell, label: 'Workout Logs' },
  { icon: TrendingUp, label: 'Progress Tracking' },
  { icon: Zap, label: 'Fast and Simple' },
];

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
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-cream font-outfit flex flex-col lg:flex-row">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-lime border-r-2 border-gray-900 flex-col justify-between p-8 xl:p-12">
        <div>
          <div className="flex items-center gap-3 mb-8 xl:mb-12">
            <div className="w-10 h-10 xl:w-12 xl:h-12 bg-white rounded-2xl border-2 border-gray-900 shadow-brutal flex items-center justify-center">
              <Flame className="w-6 h-6 xl:w-7 xl:h-7 text-gray-900" />
            </div>
            <h1 className="text-2xl xl:text-3xl font-extrabold text-gray-900">Momentum</h1>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl xl:text-5xl font-black text-gray-900 leading-tight mb-4 xl:mb-6">
              Track your <br />fitness journey
            </h2>
            <p className="text-sm xl:text-base text-gray-800 font-medium leading-relaxed">
              Log your training sessions, set weekly targets, and follow your progress.
              Simple, reliable, and designed for consistency.
            </p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2.5">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border-2 border-gray-900 text-xs xl:text-sm font-semibold text-gray-900 shadow-brutal-sm"
            >
              <Icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-gray-900" />
              <span>{label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto">
        <div className="w-full max-w-sm sm:max-w-md py-4">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 bg-lime rounded-xl border-2 border-gray-900 shadow-brutal-sm flex items-center justify-center">
              <Flame className="w-5 h-5 text-gray-900" />
            </div>
            <h1 className="text-xl font-extrabold text-gray-900">Momentum</h1>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">Welcome back</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium mb-6">Sign in to continue tracking your fitness progress.</p>

          {/* Error alert */}
          {error && (
            <div className="mb-4 p-3 bg-coral/10 border-2 border-coral rounded-xl text-coral text-xs sm:text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="alex.runner@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border-2 border-gray-900 rounded-xl text-sm text-gray-900 placeholder-gray-400 font-medium shadow-brutal-sm focus:shadow-brutal-lime focus:border-lime focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-white border-2 border-gray-900 rounded-xl text-sm text-gray-900 placeholder-gray-400 font-medium shadow-brutal-sm focus:shadow-brutal-lime focus:border-lime focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-900 text-white border-2 border-gray-900 rounded-xl font-bold text-sm sm:text-base shadow-brutal-lime hover:bg-lime hover:text-gray-900 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs sm:text-sm text-gray-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-gray-900 font-bold hover:text-lime transition-colors underline underline-offset-2">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
