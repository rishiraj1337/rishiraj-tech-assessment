import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api';
import {
  Flame, Target, Dumbbell, TrendingUp, Plus, Calendar, Clock,
  Trophy, ArrowRight, RefreshCw, Zap, CheckCircle2, Award, Sparkles, Copy
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { error: toastError, success: toastSuccess, formatApiError } = useToast();
  const [summary, setSummary] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duplicateSuccess, setDuplicateSuccess] = useState('');

  const fetchData = async () => {
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    try {
      const [s, w] = await Promise.all([
        api.get(`/api/users/${user.id}/weekly-summary`),
        api.get(`/api/users/${user.id}/workouts`),
      ]);
      setSummary(s.data);
      setWorkouts(w.data || []);
    } catch (err) {
      console.error('Dashboard fetch failed', err);
      toastError(formatApiError(err, 'Failed to refresh dashboard stats.'), 'Dashboard Error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [user]);

  // Quick Duplicate workout for today
  const handleQuickDuplicate = async (w) => {
    try {
      const payload = {
        workoutDate: new Date().toISOString().split('T')[0],
        activity: w.activity,
        duration: w.duration,
        valueAchieved: w.valueAchieved,
        userId: user.id,
      };
      await api.post('/api/workouts', payload);
      const msg = `Logged another session of ${w.activity}!`;
      setDuplicateSuccess(msg);
      toastSuccess(msg, 'Quick Repeat');
      setTimeout(() => setDuplicateSuccess(''), 3000);
      await fetchData();
    } catch (err) {
      const msg = formatApiError(err, 'Failed to duplicate workout.');
      toastError(msg, 'Duplication Error');
    }
  };

  const total = summary?.totalWorkouts ?? 0;
  const achieved = summary?.totalValueAchieved ?? 0;
  const target = summary?.targetValue || user?.targetValue || 100;
  const goal = summary?.goalType || user?.goalType || 'fitness';
  const pct = Math.min(summary?.percentage ?? 0, 100);

  // Calculate current streak
  const uniqueDates = Array.from(new Set(workouts.map((w) => w.workoutDate))).sort().reverse();
  let currentStreak = 0;
  if (uniqueDates.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    let checkDate = uniqueDates.includes(today) ? new Date() : uniqueDates.includes(yesterday) ? new Date(Date.now() - 86400000) : null;

    if (checkDate) {
      for (const dStr of uniqueDates) {
        const expectedStr = checkDate.toISOString().split('T')[0];
        if (dStr === expectedStr) {
          currentStreak += 1;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  // 7-day tracker for current week (Mon-Sun)
  const currentWeekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => {
    // Determine date for each day of current week
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMonday = (currentDayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);

    const targetDay = new Date(monday);
    targetDay.setDate(monday.getDate() + idx);
    const dateStr = targetDay.toISOString().split('T')[0];
    const hasWorkout = workouts.some((w) => w.workoutDate === dateStr);
    const isToday = dateStr === now.toISOString().split('T')[0];

    return { dayName, dateStr, hasWorkout, isToday };
  });

  const cards = [
    { label: 'Workouts Completed', value: total, icon: Dumbbell, color: 'bg-sky', shadow: 'shadow-brutal-sky' },
    { label: 'Score Achieved', value: achieved, icon: TrendingUp, color: 'bg-mint', shadow: 'shadow-brutal' },
    { label: 'Weekly Target', value: target, icon: Target, color: 'bg-violet', shadow: 'shadow-brutal-violet' },
    { label: 'Target Progress', value: `${pct.toFixed(0)}%`, icon: pct >= 100 ? CheckCircle2 : Trophy, color: pct >= 100 ? 'bg-lime' : 'bg-coral', shadow: pct >= 100 ? 'shadow-brutal-lime' : 'shadow-brutal-coral' },
  ];

  return (
    <div className="space-y-8 font-outfit max-w-6xl mx-auto">
      {/* Alert toast for quick duplicate */}
      {duplicateSuccess && (
        <div className="p-4 bg-lime border-2 border-gray-900 rounded-2xl font-bold text-sm text-gray-900 shadow-brutal flex items-center justify-between animate-bounce">
          <span className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-gray-900" />
            <span>{duplicateSuccess}</span>
          </span>
          <button onClick={() => setDuplicateSuccess('')} className="text-gray-700 hover:text-gray-900 font-extrabold text-sm">
            Dismiss
          </button>
        </div>
      )}

      {/* Greeting Banner */}
      <div className="bg-lime border-2 border-gray-900 rounded-3xl p-6 sm:p-8 shadow-brutal-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Athlete'}
            </h1>
            <p className="text-gray-800 font-medium mt-1">
              {pct >= 100
                ? 'You have reached your weekly goal. Outstanding effort!'
                : `${(100 - pct).toFixed(0)}% remaining to hit your weekly target.`}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/workouts"
              className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white border-2 border-gray-900 rounded-xl font-bold text-sm shadow-brutal-sm hover:bg-white hover:text-gray-900 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <Plus className="w-4 h-4" />
              <span>Log Workout</span>
            </Link>
            <button
              onClick={fetchData}
              className="p-3 bg-white border-2 border-gray-900 rounded-xl shadow-brutal-sm hover:bg-gray-50 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              title="Refresh dashboard stats"
            >
              <RefreshCw className={`w-4 h-4 text-gray-900 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Streak & Weekly Activity Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Live Streak Widget */}
        <div className="bg-white border-2 border-gray-900 rounded-3xl p-6 shadow-brutal flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-coral/20 border-2 border-gray-900 shadow-brutal-sm flex items-center justify-center flex-shrink-0">
            <Flame className="w-9 h-9 text-coral animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Active Streak</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-black text-gray-900">{currentStreak}</span>
              <span className="text-sm font-bold text-gray-600">{currentStreak === 1 ? 'Day' : 'Days'}</span>
            </div>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              {currentStreak > 0 ? 'Consistent training streak' : 'Log a session to start'}
            </p>
          </div>
        </div>

        {/* 7-Day Day-by-Day Activity Tracker */}
        <div className="md:col-span-2 bg-white border-2 border-gray-900 rounded-3xl p-6 shadow-brutal space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">This Week Activity</span>
            <span className="text-xs font-bold text-gray-800 bg-sand px-2.5 py-1 rounded-lg border border-gray-200">
              {currentWeekDays.filter((d) => d.hasWorkout).length} / 7 Days Active
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-1">
            {currentWeekDays.map((d) => (
              <div
                key={d.dayName}
                className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                  d.hasWorkout
                    ? 'bg-lime border-gray-900 shadow-brutal-sm'
                    : d.isToday
                    ? 'bg-sand border-gray-900 border-dashed'
                    : 'bg-sand/40 border-gray-200 opacity-60'
                }`}
              >
                <p className="text-xs font-bold text-gray-800">{d.dayName}</p>
                <div className="w-5 h-5 mx-auto mt-1 flex items-center justify-center">
                  {d.hasWorkout ? (
                    <CheckCircle2 className="w-4 h-4 text-gray-900" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`${card.color} border-2 border-gray-900 rounded-2xl p-5 ${card.shadow} transition-all hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-white/60 border border-gray-900/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-gray-900" />
                </div>
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Metrics</span>
              </div>
              <p className="text-3xl font-black text-gray-900">{card.value}</p>
              <p className="text-sm font-semibold text-gray-700 mt-0.5">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Weekly Progress Bar */}
      <div className="bg-white border-2 border-gray-900 rounded-3xl p-6 sm:p-8 shadow-brutal">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-lime" />
              <span>Weekly Progress</span>
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              {summary?.weekStart} to {summary?.weekEnd} &bull; <span className="capitalize">{goal}</span> focus
            </p>
          </div>
          <span className="text-sm font-bold text-gray-900 bg-sand px-3 py-1.5 rounded-lg border border-gray-200 self-start sm:self-auto">
            {achieved} / {target} units
          </span>
        </div>
        <div className="w-full h-5 bg-sand border-2 border-gray-900 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              pct >= 100 ? 'bg-lime' : pct >= 60 ? 'bg-sky' : 'bg-coral'
            }`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

      {/* Recent Activity Feed with Quick Duplicate */}
      <div className="bg-white border-2 border-gray-900 rounded-3xl p-6 sm:p-8 shadow-brutal">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-coral" />
            <span>Recent Activity</span>
          </h2>
          <Link
            to="/workouts"
            className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {workouts.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-2xl bg-sand border-2 border-gray-200 flex items-center justify-center mx-auto mb-3">
              <Dumbbell className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium mb-3">No workouts logged yet this week.</p>
            <Link
              to="/workouts"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-lime border-2 border-gray-900 rounded-xl text-gray-900 font-bold text-sm shadow-brutal-sm hover:shadow-brutal transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log your first session</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {workouts.slice(0, 6).map((w) => (
              <div
                key={w.id}
                className="bg-cream border-2 border-gray-200 rounded-2xl p-4 hover:border-gray-900 hover:shadow-brutal-sm transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-gray-900 text-base truncate flex-1">{w.activity}</h3>
                    <span className="text-xs font-bold text-gray-900 bg-lime/40 px-2 py-0.5 rounded-md border border-gray-900/20">
                      {w.valueAchieved ?? w.duration} pts
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{w.workoutDate}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{w.duration}m</span>
                    </span>
                  </div>
                </div>

                {/* Quick Duplicate Button */}
                <button
                  onClick={() => handleQuickDuplicate(w)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:border-gray-900 hover:bg-sand transition-all shadow-xs"
                  title="Repeat workout today"
                >
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span>Repeat Today</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
