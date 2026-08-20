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
    <div className="min-h-screen bg-cream font-outfit flex">
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-lime border-r-2 border-gray-900 flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white rounded-2xl border-2 border-gray-900 shadow-brutal flex items-center justify-center">
              <Flame className="w-7 h-7 text-gray-900" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900">Momentum</h1>
          </div>

          <div className="max-w-md">
            <h2 className="text-5xl font-black text-gray-900 leading-tight mb-6">
              Track your <br />fitness journey
            </h2>
            <p className="text-lg text-gray-800 font-medium leading-relaxed">
              Log your training sessions, set weekly targets, and follow your progress.
              Simple, reliable, and designed for consistency.
            </p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-gray-900 text-sm font-semibold text-gray-900 shadow-brutal-sm"
            >
              <Icon className="w-4 h-4 text-gray-900" />
              <span>{label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-lime rounded-xl border-2 border-gray-900 shadow-brutal-sm flex items-center justify-center">
              <Flame className="w-6 h-6 text-gray-900" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Momentum</h1>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500 font-medium mb-8">Sign in to continue tracking your fitness progress.</p>

          {/* Error alert */}
          {error && (
            <div className="mb-6 p-4 bg-coral/10 border-2 border-coral rounded-xl text-coral text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="alex.runner@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-900 rounded-xl text-gray-900 placeholder-gray-400 font-medium shadow-brutal-sm focus:shadow-brutal-lime focus:border-lime focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-900 rounded-xl text-gray-900 placeholder-gray-400 font-medium shadow-brutal-sm focus:shadow-brutal-lime focus:border-lime focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gray-900 text-white border-2 border-gray-900 rounded-xl font-bold text-base shadow-brutal-lime hover:bg-lime hover:text-gray-900 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-medium">
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
