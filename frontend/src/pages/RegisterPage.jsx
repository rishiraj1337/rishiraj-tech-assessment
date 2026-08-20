import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthIllustration from '../components/illustrations/AuthIllustration';
import { Zap, Lock, Mail, User, Target, Activity, ArrowRight, AlertCircle } from 'lucide-react';

const GOAL_OPTIONS = [
  { value: 'running', label: 'Running (Distance in km)' },
  { value: 'strength', label: 'Strength / Weightlifting (kg)' },
  { value: 'cardio', label: 'Cardio (Active minutes)' },
  { value: 'cycling', label: 'Cycling (Distance in km)' },
  { value: 'crossfit', label: 'Crossfit (Workouts count)' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goalType, setGoalType] = useState('running');
  const [targetValue, setTargetValue] = useState('50');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const numTarget = parseFloat(targetValue);
    if (isNaN(numTarget) || numTarget <= 0) {
      setError('Target value must be a positive number.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        goalType,
        targetValue: numTarget,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try a different email.'
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
            <div className="w-12 h-12 bg-neon-pink border-2 border-black flex items-center justify-center shadow-brutal">
              <Zap className="w-8 h-8 text-black" />
            </div>
            <div>
              <h1 className="font-mono font-black text-3xl text-neon-pink uppercase tracking-wider">
                JOIN MOMENTUM
              </h1>
              <p className="font-mono text-xs text-gray-400 uppercase tracking-widest">
                Level Up Your Fitness
              </p>
            </div>
          </div>

          <AuthIllustration className="w-full max-w-sm mx-auto" />

          <div className="bg-dark-surface p-4 border-2 border-black shadow-brutal-sm">
            <p className="font-mono text-sm text-gray-300">
              <span className="text-neon-cyan font-bold">🎯 DEFINE TARGETS.</span> Set your fitness goal, log each training session, and crush your weekly metrics.
            </p>
          </div>
        </div>

        {/* Right Side: Neobrutalist Register Form */}
        <div className="bg-dark-surface p-6 sm:p-8 border-2 border-black shadow-neon-pink">
          
          <div className="mb-6">
            <h2 className="font-mono font-black text-2xl sm:text-3xl text-gray-100 uppercase">
              Create Account
            </h2>
            <p className="font-mono text-sm text-gray-400 mt-1">
              Start logging your workouts and tracking progress.
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
            
            {/* Full Name Field */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Alex Runner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-card border-2 border-black text-gray-100 placeholder-gray-500 font-mono text-sm shadow-brutal-sm focus:border-neon-pink focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                Email Address *
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
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-card border-2 border-black text-gray-100 placeholder-gray-500 font-mono text-sm shadow-brutal-sm focus:border-neon-pink focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                Password (min 6 characters) *
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
                  className="w-full pl-10 pr-4 py-2.5 bg-dark-card border-2 border-black text-gray-100 placeholder-gray-500 font-mono text-sm shadow-brutal-sm focus:border-neon-pink focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Goal Type & Target Value grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                  Fitness Focus
                </label>
                <div className="relative">
                  <select
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                    className="w-full pl-3 pr-8 py-2.5 bg-dark-card border-2 border-black text-gray-100 font-mono text-xs shadow-brutal-sm focus:border-neon-pink focus:outline-none"
                  >
                    {GOAL_OPTIONS.map((g) => (
                      <option key={g.value} value={g.value} className="bg-dark-card">
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                  Weekly Target
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Target className="w-4 h-4" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-dark-card border-2 border-black text-gray-100 font-mono text-sm shadow-brutal-sm focus:border-neon-pink focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-6 bg-neon-pink border-2 border-black text-white font-mono font-bold text-base uppercase tracking-wide shadow-brutal hover:bg-white hover:text-black transition-all active:translate-x-1 active:translate-y-1 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 pt-4 border-t-2 border-dark-border text-center">
            <p className="font-mono text-xs text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-neon-pink font-bold hover:underline hover:text-neon-cyan ml-1 uppercase"
              >
                Sign In →
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
