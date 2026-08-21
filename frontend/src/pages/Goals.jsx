import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  Target, Flame, CheckCircle2, Award, Sparkles, Shield,
  Calendar, ArrowRight, Zap, CheckSquare, Square, Plus
} from 'lucide-react';

const DAILY_HABITS_KEY = 'momentum_daily_habits';

const DEFAULT_HABITS = [
  { id: 'hydrate', label: 'Drink 2.5L of Water', completed: false },
  { id: 'warmup', label: '10 Min Dynamic Warmup / Stretch', completed: false },
  { id: 'workout', label: 'Log Today’s Training Session', completed: false },
  { id: 'sleep', label: 'Get 7+ Hours Restful Sleep', completed: false },
];

export default function Goals() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [habits, setHabits] = useState(() => {
    try {
      const saved = localStorage.getItem(DAILY_HABITS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_HABITS;
    } catch {
      return DEFAULT_HABITS;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      setLoading(true);
      try {
        const [s, w] = await Promise.all([
          api.get(`/api/users/${user.id}/weekly-summary`),
          api.get(`/api/users/${user.id}/workouts`),
        ]);
        setSummary(s.data);
        setWorkouts(w.data || []);
      } catch (err) {
        console.error('Failed to load goals data', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const toggleHabit = (id) => {
    const updated = habits.map((h) => (h.id === id ? { ...h, completed: !h.completed } : h));
    setHabits(updated);
    try {
      localStorage.setItem(DAILY_HABITS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Streak calculation (days with workouts in consecutive order)
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

  const milestones = [
    { title: 'First Step', desc: 'Log your first workout session', unlocked: workouts.length >= 1, icon: Target },
    { title: 'Streak Builder', desc: 'Maintain a 3-day active streak', unlocked: currentStreak >= 3, icon: Flame },
    { title: 'Volume Athlete', desc: 'Complete 10 total workout sessions', unlocked: workouts.length >= 10, icon: Award },
    { title: 'Goal Crusher', desc: 'Reach 100% of your weekly target', unlocked: (summary?.percentage || 0) >= 100, icon: Sparkles },
  ];

  const pct = Math.min(summary?.percentage || 0, 100);

  return (
    <div className="space-y-8 font-outfit max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-lime border-2 border-gray-900 shadow-brutal-sm flex items-center justify-center">
            <Target className="w-6 h-6 text-gray-900" />
          </div>
          <span>Goals & Habit Tracking</span>
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Build consistency with daily habits, streak tracking, and milestone achievements.
        </p>
      </div>

      {/* Active Weekly Goal Overview */}
      <div className="bg-lime border-2 border-gray-900 rounded-3xl p-6 sm:p-8 shadow-brutal-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-800 bg-white/70 px-3 py-1 rounded-full border border-gray-900/30">
              Active Weekly Target
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">
              {summary?.targetValue || user?.targetValue || 50} units &bull; <span className="capitalize">{user?.goalType || 'running'}</span>
            </h2>
            <p className="text-gray-800 font-medium text-sm mt-1">
              Achieved: {summary?.totalValueAchieved || 0} units ({pct.toFixed(0)}% of goal completed)
            </p>
          </div>

          <div className="text-right self-start sm:self-auto">
            <span className="text-4xl sm:text-5xl font-black text-gray-900">{pct.toFixed(0)}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-5 bg-white border-2 border-gray-900 rounded-full overflow-hidden">
          <div
            style={{ width: `${pct}%` }}
            className="h-full bg-gray-900 rounded-full transition-all duration-700"
          />
        </div>
      </div>

      {/* Two Column Section: Daily Habits + Active Streak */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Habits Checklist */}
        <div className="bg-white border-2 border-gray-900 rounded-3xl p-6 sm:p-8 shadow-brutal space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-gray-900" />
              <span>Daily Training Habits</span>
            </h2>
            <span className="text-xs font-bold text-gray-600 bg-sand px-2.5 py-1 rounded-lg border border-gray-200">
              {habits.filter((h) => h.completed).length} / {habits.length} Done
            </span>
          </div>

          <div className="space-y-2.5">
            {habits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => toggleHabit(habit.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                  habit.completed
                    ? 'bg-lime/20 border-gray-900 text-gray-900 font-bold'
                    : 'bg-sand/40 border-gray-200 text-gray-600 hover:border-gray-400 font-medium'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${
                    habit.completed ? 'bg-lime border-gray-900' : 'bg-white border-gray-300'
                  }`}
                >
                  {habit.completed && <CheckCircle2 className="w-4 h-4 text-gray-900" />}
                </div>
                <span className="text-sm flex-1">{habit.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Streak & Consistency Card */}
        <div className="bg-white border-2 border-gray-900 rounded-3xl p-6 sm:p-8 shadow-brutal space-y-5">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Flame className="w-5 h-5 text-coral" />
            <span>Active Workout Streak</span>
          </h2>

          <div className="bg-sand/60 border-2 border-gray-900 rounded-2xl p-6 text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-coral/20 border-2 border-gray-900 shadow-brutal-sm flex items-center justify-center mx-auto mb-2">
              <Flame className="w-8 h-8 text-coral animate-pulse" />
            </div>
            <p className="text-4xl sm:text-5xl font-black text-gray-900">{currentStreak}</p>
            <p className="text-sm font-bold text-gray-700">
              {currentStreak === 1 ? 'Day Active Streak' : 'Days Active Streak'}
            </p>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              {currentStreak > 0
                ? 'Consistency is your superpower. Keep logging workouts to maintain momentum.'
                : 'Log a workout session today to ignite your workout streak.'}
            </p>
          </div>
        </div>
      </div>

      {/* Milestone Achievements */}
      <div className="bg-white border-2 border-gray-900 rounded-3xl p-6 sm:p-8 shadow-brutal space-y-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-violet" />
          <span>Milestone Badges</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {milestones.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className={`p-5 rounded-2xl border-2 transition-all ${
                  m.unlocked
                    ? 'bg-lime/20 border-gray-900 shadow-brutal-sm'
                    : 'bg-sand/40 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center ${
                      m.unlocked ? 'bg-lime border-gray-900' : 'bg-gray-200 border-gray-300 text-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      m.unlocked
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-gray-100 text-gray-400 border-gray-200'
                    }`}
                  >
                    {m.unlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>
                <h3 className="font-black text-gray-900 text-base">{m.title}</h3>
                <p className="text-xs text-gray-600 font-medium mt-1">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
