import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  TrendingUp, Dumbbell, Clock, Flame, Target, Award, Calendar,
  BarChart3, Activity, ArrowUpRight, CheckCircle2, Sparkles, RefreshCw
} from 'lucide-react';

export default function Analytics() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const [w, s] = await Promise.all([
        api.get(`/api/users/${user.id}/workouts`),
        api.get(`/api/users/${user.id}/weekly-summary`),
      ]);
      setWorkouts(w.data || []);
      setSummary(s.data);
    } catch (err) {
      console.error('Failed to load analytics data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Aggregate stats
  const totalSessions = workouts.length;
  const totalDuration = workouts.reduce((acc, w) => acc + (w.duration || 0), 0);
  const totalValue = workouts.reduce((acc, w) => acc + (w.valueAchieved || 0), 0);
  const avgDuration = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;

  // Personal Bests / Peak Metrics
  const longestSession = workouts.reduce((max, w) => Math.max(max, w.duration || 0), 0);
  const highestScore = workouts.reduce((max, w) => Math.max(max, w.valueAchieved || 0), 0);

  // Breakdown by activity category
  const categoryCounts = workouts.reduce((acc, w) => {
    const act = (w.activity || 'Other').trim();
    acc[act] = (acc[act] || 0) + 1;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // 7-day activity distribution (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayWorkouts = workouts.filter((w) => w.workoutDate === dateStr);
    const dayMinutes = dayWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0);
    return { dateStr, dayName, count: dayWorkouts.length, minutes: dayMinutes };
  });

  const maxMinutesIn7Days = Math.max(...last7Days.map((d) => d.minutes), 60);

  return (
    <div className="space-y-8 font-outfit max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime border-2 border-gray-900 shadow-brutal-sm flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-gray-900" />
            </div>
            <span>Performance & Analytics</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Comprehensive breakdown of your training volume, records, and habits.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-900 rounded-xl text-gray-900 font-bold text-sm shadow-brutal hover:bg-lime transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Training Time', value: `${totalDuration} min`, sub: `${(totalDuration / 60).toFixed(1)} active hours`, icon: Clock, color: 'bg-sky', shadow: 'shadow-brutal-sky' },
          { label: 'Total Volume / Score', value: `${totalValue.toFixed(1)} pts`, sub: 'Cumulative achieved', icon: Award, color: 'bg-mint', shadow: 'shadow-brutal' },
          { label: 'Average Session Length', value: `${avgDuration} min`, sub: 'Per workout log', icon: Dumbbell, color: 'bg-violet', shadow: 'shadow-brutal-violet' },
          { label: 'Logged Sessions', value: totalSessions, sub: 'Lifetime count', icon: Activity, color: 'bg-lime', shadow: 'shadow-brutal-lime' },
        ].map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={`${c.color} border-2 border-gray-900 rounded-2xl p-5 ${c.shadow} transition-all hover:-translate-y-0.5`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">{c.label}</span>
                <div className="w-8 h-8 rounded-lg bg-white/60 border border-gray-900/20 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-gray-900" />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900">{c.value}</p>
              <p className="text-xs text-gray-700 font-semibold mt-1">{c.sub}</p>
            </div>
          );
        })}
      </div>

      {/* 7-Day Visual Activity Distribution */}
      <div className="bg-white border-2 border-gray-900 rounded-3xl p-6 sm:p-8 shadow-brutal space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-900" />
              <span>7-Day Training Volume</span>
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-0.5">
              Daily minutes logged over the past week.
            </p>
          </div>
          <span className="text-xs font-bold text-gray-900 bg-sand px-3 py-1.5 rounded-lg border border-gray-200 self-start sm:self-auto">
            Past 7 Days
          </span>
        </div>

        {/* Bar Chart Visualization */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 pt-4 pb-2 items-end h-56">
          {last7Days.map((day) => {
            const heightPct = Math.max(Math.round((day.minutes / maxMinutesIn7Days) * 100), 8);
            const hasWorkout = day.count > 0;
            return (
              <div key={day.dateStr} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[11px] font-bold text-gray-700 mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.minutes}m
                </span>
                <div className="w-full bg-sand rounded-xl h-full flex items-end p-1 border border-gray-200">
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-lg border-2 border-gray-900 transition-all duration-500 ${
                      hasWorkout ? 'bg-lime shadow-brutal-sm' : 'bg-gray-200'
                    }`}
                  />
                </div>
                <span className="text-xs font-bold text-gray-800 mt-2">{day.dayName}</span>
                <span className="text-[10px] text-gray-400 font-medium">
                  {day.dateStr.split('-').slice(1).join('/')}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Personal Records + Activity Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Bests Card */}
        <div className="bg-white border-2 border-gray-900 rounded-3xl p-6 sm:p-8 shadow-brutal space-y-5">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-violet" />
            <span>Personal Bests & Records</span>
          </h2>
          <div className="space-y-3 text-sm">
            <div className="p-4 bg-sand/60 border-2 border-gray-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500">Longest Single Session</p>
                <p className="text-xl font-black text-gray-900 mt-0.5">{longestSession} minutes</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-lime/40 border border-gray-900/30 flex items-center justify-center font-bold text-gray-900">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-sand/60 border-2 border-gray-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500">Highest Achieved Value</p>
                <p className="text-xl font-black text-gray-900 mt-0.5">{highestScore} units</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-sky/40 border border-gray-900/30 flex items-center justify-center font-bold text-gray-900">
                <Target className="w-5 h-5" />
              </div>
            </div>

            <div className="p-4 bg-sand/60 border-2 border-gray-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500">Weekly Target Progress</p>
                <p className="text-xl font-black text-gray-900 mt-0.5">
                  {summary?.percentage != null ? `${summary.percentage.toFixed(0)}%` : '0%'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-violet/40 border border-gray-900/30 flex items-center justify-center font-bold text-gray-900">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Top Activities Breakdown Card */}
        <div className="bg-white border-2 border-gray-900 rounded-3xl p-6 sm:p-8 shadow-brutal space-y-5">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-lime" />
            <span>Top Training Categories</span>
          </h2>

          {sortedCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400 font-medium text-sm">No activity logs recorded yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedCategories.map(([activityName, count]) => {
                const pct = totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0;
                return (
                  <div key={activityName} className="space-y-1">
                    <div className="flex justify-between items-center text-sm font-semibold text-gray-800">
                      <span className="truncate pr-2">{activityName}</span>
                      <span className="text-xs text-gray-500 font-bold">
                        {count} {count === 1 ? 'session' : 'sessions'} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-sand border border-gray-200 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${pct}%` }}
                        className="h-full bg-lime border-r border-gray-900 rounded-full transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
