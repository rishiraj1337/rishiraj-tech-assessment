import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail, Lock, User, Target, Dumbbell, TrendingUp, Zap, ArrowRight,
  Flame, Info, HelpCircle, Calculator, Check, Sparkles
} from 'lucide-react';

const FITNESS_ACTIVITIES = [
  { value: 'running', label: 'Running / Jogging', defaultUnit: 'km', defaultDaily: 5, defaultWeekly: 30 },
  { value: 'cardio', label: 'Cardio & HIIT', defaultUnit: 'min', defaultDaily: 30, defaultWeekly: 180 },
  { value: 'strength', label: 'Strength & Resistance', defaultUnit: 'min', defaultDaily: 45, defaultWeekly: 200 },
  { value: 'cycling', label: 'Cycling', defaultUnit: 'km', defaultDaily: 15, defaultWeekly: 80 },
  { value: 'crossfit', label: 'Crossfit & Functional', defaultUnit: 'sessions', defaultDaily: 1, defaultWeekly: 4 },
  { value: 'general', label: 'General Movement & Fitness', defaultUnit: 'min', defaultDaily: 30, defaultWeekly: 150 },
];

const UNIT_OPTIONS = [
  { value: 'min', label: 'Minutes (Active time)' },
  { value: 'km', label: 'Kilometers (Distance)' },
  { value: 'sessions', label: 'Sessions (Workouts count)' },
  { value: 'kg', label: 'Kilograms (Weight lifted)' },
  { value: 'pts', label: 'Score / Points' },
];

const HIGHLIGHTS = [
  { icon: Target, label: 'Set Flexible Goals' },
  { icon: Dumbbell, label: '1-Click Logging' },
  { icon: TrendingUp, label: 'Weekly Aggregations' },
  { icon: Zap, label: 'Streak Analytics' },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Basic info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Target Builder state
  const [activityFocus, setActivityFocus] = useState('running');
  const [frequencyMode, setFrequencyMode] = useState('daily'); // 'daily' | 'weekly' | 'sessions'
  const [targetInput, setTargetInput] = useState('30');
  const [targetUnit, setTargetUnit] = useState('min');
  const [sessionCount, setSessionCount] = useState('4');
  const [sessionMinutes, setSessionMinutes] = useState('45');

  // Info modal / panel state
  const [showInfo, setShowInfo] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Compute weekly target dynamically
  let computedWeeklyTarget = 0;
  let calculationExplanation = '';

  if (frequencyMode === 'daily') {
    const dailyVal = parseFloat(targetInput) || 0;
    computedWeeklyTarget = Math.round(dailyVal * 7 * 10) / 10;
    calculationExplanation = `${dailyVal} ${targetUnit}/day × 7 days = ${computedWeeklyTarget} ${targetUnit}/week`;
  } else if (frequencyMode === 'weekly') {
    computedWeeklyTarget = parseFloat(targetInput) || 0;
    const approxDaily = computedWeeklyTarget > 0 ? (computedWeeklyTarget / 7).toFixed(1) : '0';
    calculationExplanation = `${computedWeeklyTarget} ${targetUnit}/week (~${approxDaily} ${targetUnit}/day)`;
  } else if (frequencyMode === 'sessions') {
    const count = parseInt(sessionCount, 10) || 0;
    const mins = parseInt(sessionMinutes, 10) || 0;
    computedWeeklyTarget = count * mins;
    calculationExplanation = `${count} sessions × ${mins} min = ${computedWeeklyTarget} min/week`;
  }

  // Handle activity focus change
  const handleActivityChange = (newVal) => {
    setActivityFocus(newVal);
    const found = FITNESS_ACTIVITIES.find((a) => a.value === newVal);
    if (found) {
      setTargetUnit(found.defaultUnit);
      if (frequencyMode === 'daily') {
        setTargetInput(String(found.defaultDaily));
      } else if (frequencyMode === 'weekly') {
        setTargetInput(String(found.defaultWeekly));
      }
    }
  };

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
    if (computedWeeklyTarget <= 0) {
      setError('Please enter a target value greater than 0.');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        goalType: activityFocus,
        targetValue: computedWeeklyTarget,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream font-outfit flex">
      {/* Left decorative panel */}
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
              Set goals on your terms. Whether you think in daily minutes, weekly distance, or session counts, Momentum converts it seamlessly.
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

      {/* Right form container */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 my-auto">
        <div className="w-full max-w-lg">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-violet rounded-xl border-2 border-gray-900 shadow-brutal-sm flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Momentum</h1>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-2">Create your account</h2>
          <p className="text-gray-500 font-medium mb-6">Set up your profile and configure your training target.</p>

          {error && (
            <div className="mb-6 p-4 bg-coral/10 border-2 border-coral rounded-xl text-coral text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
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

            {/* Intuitive Target Builder Card */}
            <div className="bg-sand/60 border-2 border-gray-900 rounded-2xl p-5 shadow-brutal space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-gray-900" />
                  <span className="font-extrabold text-base text-gray-900">Custom Target Builder</span>
                </div>

                {/* (i) Info button */}
                <button
                  type="button"
                  onClick={() => setShowInfo(!showInfo)}
                  className={`p-1.5 rounded-xl border-2 transition-all flex items-center gap-1 text-xs font-bold ${
                    showInfo
                      ? 'bg-violet text-white border-gray-900'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'
                  }`}
                  title="How weekly targets work"
                >
                  <Info className="w-4 h-4" />
                  <span>How it works</span>
                </button>
              </div>

              {/* Collapsible Info Card */}
              {showInfo && (
                <div className="p-4 bg-white border-2 border-gray-900 rounded-xl text-xs space-y-2 text-gray-700 shadow-brutal-sm animate-fadeIn">
                  <p className="font-bold text-gray-900">How Momentum Targets Work:</p>
                  <p>
                    Momentum tracks your fitness on a weekly cycle (Monday through Sunday).
                  </p>
                  <p>
                    Enter your goal in whatever format is natural to you: <strong>Daily</strong> (e.g. 30 min/day), <strong>Weekly</strong> (e.g. 25 km/week), or <strong>Sessions</strong> (e.g. 4 sessions of 45 min).
                  </p>
                  <p className="text-gray-500 font-medium">
                    We automatically convert your entry into your weekly total target. You can adjust this anytime in your profile.
                  </p>
                </div>
              )}

              {/* Activity Focus Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Training Focus
                </label>
                <select
                  value={activityFocus}
                  onChange={(e) => handleActivityChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-gray-900 rounded-xl font-bold text-sm focus:outline-none"
                >
                  {FITNESS_ACTIVITIES.map((act) => (
                    <option key={act.value} value={act.value}>
                      {act.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Frequency Cadence Switcher (Daily / Weekly / Sessions) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  How would you like to set your target?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'daily', label: 'Daily' },
                    { id: 'weekly', label: 'Weekly' },
                    { id: 'sessions', label: 'Sessions' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setFrequencyMode(mode.id)}
                      className={`py-2 px-2 text-xs font-bold rounded-xl border-2 transition-all ${
                        frequencyMode === mode.id
                          ? 'bg-lime text-gray-900 border-gray-900 shadow-brutal-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input row according to frequency mode */}
              {frequencyMode === 'sessions' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Workouts / Week
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="14"
                      required
                      value={sessionCount}
                      onChange={(e) => setSessionCount(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-900 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Minutes / Session
                    </label>
                    <input
                      type="number"
                      min="5"
                      step="5"
                      required
                      value={sessionMinutes}
                      onChange={(e) => setSessionMinutes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-900 rounded-xl font-bold text-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-3">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {frequencyMode === 'daily' ? 'Daily Value' : 'Weekly Value'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      required
                      value={targetInput}
                      onChange={(e) => setTargetInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-gray-900 rounded-xl font-bold text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={targetUnit}
                      onChange={(e) => setTargetUnit(e.target.value)}
                      className="w-full px-2 py-2 bg-white border-2 border-gray-900 rounded-xl font-bold text-xs"
                    >
                      {UNIT_OPTIONS.map((u) => (
                        <option key={u.value} value={u.value}>
                          {u.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Calculated Weekly Target Preview Card */}
              <div className="p-3.5 bg-white border-2 border-gray-900 rounded-xl flex items-center justify-between shadow-brutal-sm">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 block">
                    Converted Weekly Target
                  </span>
                  <span className="text-xs font-semibold text-gray-700">
                    {calculationExplanation}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-gray-900">{computedWeeklyTarget}</span>
                  <span className="text-xs font-bold text-gray-600 block">{frequencyMode === 'sessions' ? 'min' : targetUnit}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3.5 bg-gray-900 text-white border-2 border-gray-900 rounded-xl font-bold text-base shadow-brutal-violet hover:bg-violet hover:text-white transition-all active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-500 font-medium">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-gray-900 font-bold hover:text-violet transition-colors underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
