import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import FitnessTrackerIllustration from '../components/illustrations/FitnessTrackerIllustration';
import { 
  Flame, 
  Target, 
  Dumbbell, 
  TrendingUp, 
  Plus, 
  Calendar, 
  Clock, 
  Award,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [weeklySummary, setWeeklySummary] = useState(null);
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch weekly summary and recent workouts for current user
  const fetchDashboardData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');

    try {
      // 1. Fetch Weekly Summary
      const summaryRes = await api.get(`/api/users/${user.id}/weekly-summary`);
      setWeeklySummary(summaryRes.data);

      // 2. Fetch User Workouts
      const workoutsRes = await api.get(`/api/users/${user.id}/workouts`);
      setRecentWorkouts(workoutsRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      setError('Unable to fetch live metrics. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  // Derived progress and values
  const totalWorkouts = weeklySummary?.totalWorkouts ?? 0;
  const totalValue = weeklySummary?.totalValueAchieved ?? 0;
  const targetValue = weeklySummary?.targetValue || user?.targetValue || 100;
  const goalType = weeklySummary?.goalType || user?.goalType || 'fitness';
  const progressPercent = Math.min(weeklySummary?.percentage ?? 0, 100);

  return (
    <div className="space-y-8">
      
      {/* Top Banner with Undraw Illustration */}
      <div className="bg-dark-surface border-2 border-black p-6 sm:p-8 shadow-neon-cyan relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 z-10 max-w-lg">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-neon-cyan/10 border-2 border-neon-cyan text-neon-cyan font-mono text-xs font-bold uppercase">
            <Flame className="w-4 h-4 text-neon-pink" />
            <span>Weekly Momentum Tracker</span>
          </div>
          <h1 className="font-mono font-black text-3xl sm:text-4xl text-gray-100 uppercase tracking-tight">
            Welcome Back, <span className="text-neon-cyan">{user?.name || 'Athlete'}</span>
          </h1>
          <p className="font-mono text-xs sm:text-sm text-gray-400">
            Focus: <span className="text-neon-pink font-bold uppercase">{goalType}</span> &bull; Goal: <span className="text-neon-yellow font-bold">{targetValue} units/week</span>
          </p>
          <div className="pt-2 flex items-center space-x-3">
            <Link
              to="/workouts"
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-neon-cyan border-2 border-black text-black font-mono font-bold text-xs uppercase shadow-brutal hover:bg-white transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log New Session</span>
            </Link>
            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-dark-card border-2 border-black text-gray-300 hover:text-neon-cyan shadow-brutal-sm transition-all"
              title="Refresh Stats"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="w-full md:w-72 lg:w-96 flex-shrink-0">
          <FitnessTrackerIllustration className="w-full h-auto max-h-48 drop-shadow-md" />
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Workouts this week */}
        <div className="bg-dark-surface p-5 border-2 border-black shadow-brutal hover:shadow-neon-pink transition-all">
          <div className="flex items-center justify-between text-gray-400 font-mono text-xs uppercase font-bold mb-2">
            <span>Workouts This Week</span>
            <Dumbbell className="w-4 h-4 text-neon-pink" />
          </div>
          <p className="font-mono font-black text-3xl text-neon-pink">
            {totalWorkouts}
          </p>
          <span className="text-[11px] font-mono text-gray-500">
            {weeklySummary?.weekStart} &rarr; {weeklySummary?.weekEnd}
          </span>
        </div>

        {/* Card 2: Total Value Achieved */}
        <div className="bg-dark-surface p-5 border-2 border-black shadow-brutal hover:shadow-neon-cyan transition-all">
          <div className="flex items-center justify-between text-gray-400 font-mono text-xs uppercase font-bold mb-2">
            <span>Score Achieved</span>
            <TrendingUp className="w-4 h-4 text-neon-cyan" />
          </div>
          <p className="font-mono font-black text-3xl text-neon-cyan">
            {totalValue}
          </p>
          <span className="text-[11px] font-mono text-gray-500">
            Units completed
          </span>
        </div>

        {/* Card 3: Target Goal */}
        <div className="bg-dark-surface p-5 border-2 border-black shadow-brutal hover:shadow-neon-yellow transition-all">
          <div className="flex items-center justify-between text-gray-400 font-mono text-xs uppercase font-bold mb-2">
            <span>Weekly Target</span>
            <Target className="w-4 h-4 text-neon-yellow" />
          </div>
          <p className="font-mono font-black text-3xl text-neon-yellow">
            {targetValue}
          </p>
          <span className="text-[11px] font-mono text-gray-500 capitalize">
            {goalType} target
          </span>
        </div>

        {/* Card 4: Completion Rate */}
        <div className="bg-dark-surface p-5 border-2 border-black shadow-brutal hover:shadow-neon-green transition-all">
          <div className="flex items-center justify-between text-gray-400 font-mono text-xs uppercase font-bold mb-2">
            <span>Target Progress</span>
            <Award className="w-4 h-4 text-neon-green" />
          </div>
          <p className="font-mono font-black text-3xl text-neon-green">
            {weeklySummary?.percentage != null ? `${weeklySummary.percentage.toFixed(1)}%` : '0.0%'}
          </p>
          <span className="text-[11px] font-mono text-gray-500">
            {progressPercent >= 100 ? '🎉 Goal Achieved!' : `${(100 - progressPercent).toFixed(0)}% remaining`}
          </span>
        </div>

      </div>

      {/* Weekly Progress Bar Section */}
      <div className="bg-dark-surface border-2 border-black p-6 shadow-brutal space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h2 className="font-mono font-black text-xl text-gray-100 uppercase">
              Weekly Progress Status
            </h2>
            <p className="font-mono text-xs text-gray-400">
              {weeklySummary?.weekStart} to {weeklySummary?.weekEnd}
            </p>
          </div>
          <span className="font-mono font-bold text-sm text-neon-cyan px-3 py-1 bg-dark-card border-2 border-black shadow-brutal-sm self-start sm:self-auto">
            {totalValue} / {targetValue} units ({weeklySummary?.percentage?.toFixed(1) || 0}%)
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-dark-bg border-2 border-black h-6 p-0.5 relative shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-neon-cyan via-neon-yellow to-neon-pink border-r-2 border-black transition-all duration-500"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Recent Workouts Log Table */}
      <div className="bg-dark-surface border-2 border-black p-6 shadow-brutal space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-neon-pink" />
            <h2 className="font-mono font-black text-xl text-gray-100 uppercase">
              Recent Activity Logs
            </h2>
          </div>
          <Link
            to="/workouts"
            className="font-mono text-xs font-bold text-neon-cyan hover:underline flex items-center space-x-1 uppercase"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentWorkouts.length === 0 ? (
          <div className="p-8 text-center bg-dark-card border-2 border-black">
            <Dumbbell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="font-mono text-sm text-gray-400">
              No recent workouts logged for this period.
            </p>
            <Link
              to="/workouts"
              className="mt-3 inline-block font-mono text-xs font-bold text-neon-cyan hover:underline uppercase"
            >
              + Log your first workout session
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentWorkouts.slice(0, 6).map((workout) => (
              <div
                key={workout.id}
                className="bg-dark-card p-4 border-2 border-black shadow-brutal-sm hover:border-neon-cyan transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono font-bold text-base text-gray-100 truncate">
                    {workout.activity}
                  </h3>
                  <span className="font-mono text-xs px-2 py-0.5 bg-neon-pink text-white font-bold border border-black shadow-brutal-sm">
                    {workout.valueAchieved ?? 0} units
                  </span>
                </div>
                <div className="flex items-center space-x-4 font-mono text-xs text-gray-400 mt-3">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{workout.workoutDate}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{workout.duration} min</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
