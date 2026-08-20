import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Target, Dumbbell, TrendingUp, Zap, ArrowRight, Flame } from 'lucide-react';

const GOALS = [
  { value: 'running', label: 'Running (Distance in km)', unit: 'km' },
  { value: 'strength', label: 'Strength Training (Weight in kg)', unit: 'kg' },
  { value: 'cardio', label: 'Cardio (Active minutes)', unit: 'min' },
  { value: 'cycling', label: 'Cycling (Distance in km)', unit: 'km' },
  { value: 'crossfit', label: 'Crossfit (Workouts count)', unit: 'sessions' },
];

const HIGHLIGHTS = [
  { icon: Target, label: 'Set Goals' },
  { icon: Dumbbell, label: 'Log Sessions' },
  { icon: TrendingUp, label: 'Track Progress' },
  { icon: Zap, label: 'Stay Consistent' },
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
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    const target = parseFloat(targetValue);
    if (isNaN(target) || target <= 0) {
      setError('Please enter a positive weekly target.');
      return;
    }

    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, goalType, targetValue: target });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream font-outfit flex">
      {/* Left decorative panel - hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-violet border-r-2 border-gray-900 flex-col justify-between p-12">
        <div>
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-white rounded-2xl border-2 border-gray-900 shadow-brutal flex items-center justify-center">
              <Flame className="w-7 h-7 text-gray-900" />
            </div>
            <h1 className="text-3xl font-extrabold text-white">Momentum</h1>
          </div>

          <div className="max-w-md">
            <h2 className="text-5xl font-black text-white leading-tight mb-6">
              Start your <br />fitness journey
            </h2>
            <p className="text-lg text-white/80 font-medium leading-relaxed">
              Set up your profile, choose your training focus, and start tracking your weekly workouts.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/40 text-sm font-semibold text-white shadow-brutal-sm"
            >
              <Icon className="w-4 h-4 text-white" />
              <span>{label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-violet rounded-xl border-2 border-gray-900 shadow-brutal-sm flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Momentum</h1>
          </div>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-500 font-medium mb-8">Set up your profile and begin tracking your workouts.</p>

          {error && (
            <div className="mb-6 p-4 bg-coral/10 border-2 border-coral rounded-xl text-coral text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Alex Runner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-900 rounded-xl placeholder-gray-400 font-medium shadow-brutal-sm focus:shadow-brutal-violet focus:border-violet focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="alex.runner@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-900 rounded-xl placeholder-gray-400 font-medium shadow-brutal-sm focus:shadow-brutal-violet focus:border-violet focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-900 rounded-xl placeholder-gray-400 font-medium shadow-brutal-sm focus:shadow-brutal-violet focus:border-violet focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Goal type + target row */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Training Focus</label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  className="w-full px-3 py-3 bg-white border-2 border-gray-900 rounded-xl font-medium text-sm shadow-brutal-sm focus:outline-none focus:border-violet"
                >
                  {GOALS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Weekly Target
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="w-full pl-9 pr-3 py-3 bg-white border-2 border-gray-900 rounded-xl font-medium shadow-brutal-sm focus:outline-none focus:border-violet"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-gray-900 text-white border-2 border-gray-900 rounded-xl font-bold text-base shadow-brutal-violet hover:bg-violet hover:text-white transition-all active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-gray-900 font-bold hover:text-violet transition-colors underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
