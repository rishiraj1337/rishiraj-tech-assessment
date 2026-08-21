import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../api';
import {
  User, Mail, Target, Edit3, X, CheckCircle, Dumbbell, Award,
  ShieldCheck, AlertCircle, Calendar, Flame, Activity, Sparkles, RefreshCw
} from 'lucide-react';

const GOALS = [
  { value: 'running', label: 'Running (Distance in km)', unit: 'km' },
  { value: 'strength', label: 'Strength Training (Weight in kg)', unit: 'kg' },
  { value: 'cardio', label: 'Cardio (Active minutes)', unit: 'min' },
  { value: 'cycling', label: 'Cycling (Distance in km)', unit: 'km' },
  { value: 'crossfit', label: 'Crossfit (Workouts count)', unit: 'sessions' },
];

export default function UserDetails() {
  const { user, updateUser } = useAuth();
  const { error: toastError, success: toastSuccess, formatApiError } = useToast();

  const [profile, setProfile] = useState(user);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [goalType, setGoalType] = useState(user?.goalType || 'running');
  const [targetValue, setTargetValue] = useState(String(user?.targetValue || 50));
  const [avatarSeed, setAvatarSeed] = useState(user?.email || 'athlete');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const load = async () => {
      setLoading(true);
      try {
        const [u, w] = await Promise.all([
          api.get(`/api/users/${user.id}`),
          api.get(`/api/users/${user.id}/workouts`),
        ]);
        setProfile(u.data);
        setWorkoutCount(w.data?.length || 0);
        setName(u.data.name || '');
        setGoalType(u.data.goalType || 'running');
        setTargetValue(String(u.data.targetValue || 50));
        setAvatarSeed(u.data.email || 'athlete');
      } catch (err) {
        console.error('Failed to load user profile', err);
        toastError(formatApiError(err, 'Failed to load profile.'), 'Load Error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim()) {
      const msg = 'Name is required.';
      setError(msg);
      toastError(msg, 'Validation Error');
      return;
    }
    const t = parseFloat(targetValue);
    if (isNaN(t) || t <= 0) {
      const msg = 'Target value must be a positive number.';
      setError(msg);
      toastError(msg, 'Validation Error');
      return;
    }

    setSaving(true);
    try {
      const res = await api.put(`/api/users/${user.id}`, {
        name: name.trim(),
        email: profile?.email,
        goalType,
        targetValue: t,
      });
      setProfile(res.data);
      updateUser(res.data);
      setSuccess('Profile updated successfully.');
      toastSuccess('Profile updated successfully.', 'Profile Saved');
      setTimeout(() => {
        setEditing(false);
        setSuccess('');
      }, 1000);
    } catch (err) {
      const msg = formatApiError(err, 'Failed to update profile.');
      setError(msg);
      toastError(msg, 'Update Failed');
    } finally {
      setSaving(false);
    }
  };

  const selectedGoalObj = GOALS.find((g) => g.value === profile?.goalType) || GOALS[0];
  const avatarUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(avatarSeed)}&backgroundColor=bbf7d0,bfdbfe,fed7aa,fbcfe8,fef08a`;

  return (
    <div className="space-y-8 font-outfit max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime border-2 border-gray-900 shadow-brutal-sm flex items-center justify-center">
              <User className="w-6 h-6 text-gray-900" />
            </div>
            <span>Athlete Profile</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">Manage your identity, training focus, and goals.</p>
        </div>

        <button
          onClick={() => setEditing(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-gray-900 rounded-xl text-gray-900 font-bold text-sm shadow-brutal hover:bg-lime hover:shadow-brutal-lg transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none self-start sm:self-auto"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Main Profile Hero Card */}
      <div className="bg-white border-2 border-gray-900 rounded-3xl shadow-brutal-lg overflow-hidden">
        {/* Colorful Banner */}
        <div className="h-32 sm:h-40 bg-gradient-to-r from-lime via-sky to-violet border-b-2 border-gray-900 p-6 flex justify-end items-start">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/90 backdrop-blur-sm border-2 border-gray-900 rounded-full font-bold text-xs text-gray-900 shadow-brutal-sm">
            <Sparkles className="w-3.5 h-3.5 text-lime" />
            <span>Active Member</span>
          </span>
        </div>

        <div className="px-6 sm:px-8 pb-8">
          {/* Avatar and Primary Identity */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {/* DiceBear Notionists Avatar */}
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-sand border-2 border-gray-900 shadow-brutal overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img
                  src={avatarUrl}
                  alt="Notionists Avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="pt-2">
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                  {profile?.name || 'Athlete'}
                </h2>
                <p className="text-sm font-semibold text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{profile?.email || 'athlete@example.com'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-sand border-2 border-gray-900 rounded-xl text-xs font-bold text-gray-800 uppercase tracking-wide shadow-brutal-sm">
                <Activity className="w-3.5 h-3.5 text-coral" />
                <span>{selectedGoalObj.label.split(' ')[0]}</span>
              </span>
            </div>
          </div>

          {/* Core Metric Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t-2 border-gray-100">
            {/* Total Workouts */}
            <div className="bg-sand/60 border-2 border-gray-900 rounded-2xl p-5 shadow-brutal-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Total Workouts</span>
                <div className="w-8 h-8 rounded-lg bg-lime/40 border border-gray-900/30 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4 text-gray-900" />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900">{workoutCount}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Logged sessions</p>
            </div>

            {/* Target Value */}
            <div className="bg-sky/15 border-2 border-gray-900 rounded-2xl p-5 shadow-brutal-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Weekly Target</span>
                <div className="w-8 h-8 rounded-lg bg-sky/40 border border-gray-900/30 flex items-center justify-center">
                  <Target className="w-4 h-4 text-gray-900" />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900">
                {profile?.targetValue || 0} <span className="text-sm font-semibold text-gray-600">{selectedGoalObj.unit}</span>
              </p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Target per week</p>
            </div>

            {/* Consistency & Goal */}
            <div className="bg-violet/15 border-2 border-gray-900 rounded-2xl p-5 shadow-brutal-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Primary Goal</span>
                <div className="w-8 h-8 rounded-lg bg-violet/40 border border-gray-900/30 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-gray-900" />
                </div>
              </div>
              <p className="text-2xl font-black text-gray-900 capitalize truncate">
                {profile?.goalType || 'Fitness'}
              </p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">Active routine</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details & Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Details Card */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-brutal space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gray-900" />
            <span>Account Details</span>
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">User Identifier</span>
              <span className="font-bold text-gray-900 font-mono">#{profile?.id || user?.id}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Member Since</span>
              <span className="font-semibold text-gray-900">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'August 2026'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 font-medium">Security Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>JWT Protected</span>
              </span>
            </div>
          </div>
        </div>

        {/* Training Summary Card */}
        <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 shadow-brutal space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-gray-900" />
            <span>Training Summary</span>
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Target Metric</span>
              <span className="font-semibold text-gray-900">{profile?.targetValue || 0} {selectedGoalObj.unit}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-500 font-medium">Category</span>
              <span className="font-semibold text-gray-900 capitalize">{profile?.goalType || 'General'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-500 font-medium">Profile Sync</span>
              <span className="text-gray-700 font-semibold">Automatic</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs" onClick={() => setEditing(false)}>
          <div
            className="bg-white border-2 border-gray-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-brutal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-lime" />
                <span>Edit Profile</span>
              </h2>
              <button onClick={() => setEditing(false)} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3.5 bg-coral/10 border-2 border-coral rounded-xl text-coral text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3.5 bg-lime/20 border-2 border-lime rounded-xl text-green-800 text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-cream border-2 border-gray-200 rounded-xl font-medium focus:border-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Training Focus */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Training Focus</label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream border-2 border-gray-200 rounded-xl font-medium text-sm focus:border-gray-900 focus:outline-none"
                >
                  {GOALS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              {/* Weekly Target */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Weekly Target ({selectedGoalObj.unit})</label>
                  <span className="text-xs text-gray-400 font-medium">~{(parseFloat(targetValue || 0) / 7).toFixed(1)} / day</span>
                </div>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-cream border-2 border-gray-200 rounded-xl font-medium focus:border-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 bg-cream border-2 border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:border-gray-900 hover:text-gray-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-gray-900 text-white border-2 border-gray-900 rounded-xl font-bold text-sm shadow-brutal-lime hover:bg-lime hover:text-gray-900 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
