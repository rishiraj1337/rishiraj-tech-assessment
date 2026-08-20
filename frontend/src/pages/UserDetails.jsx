import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { User, Mail, Target, Edit3, X, CheckCircle, Dumbbell, Award, ShieldCheck, AlertCircle } from 'lucide-react';

const GOALS = [
  { value: 'running', label: 'Running (Distance in km)' },
  { value: 'strength', label: 'Strength Training (Weight in kg)' },
  { value: 'cardio', label: 'Cardio (Active minutes)' },
  { value: 'cycling', label: 'Cycling (Distance in km)' },
  { value: 'crossfit', label: 'Crossfit (Workouts count)' },
];

export default function UserDetails() {
  const { user, updateUser } = useAuth();

  const [profile, setProfile] = useState(user);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Edit modal
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [goalType, setGoalType] = useState(user?.goalType || 'running');
  const [targetValue, setTargetValue] = useState(String(user?.targetValue || 50));
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
      } catch (err) {
        console.error('Failed to load user profile', err);
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
      setError('Name is required.');
      return;
    }
    const t = parseFloat(targetValue);
    if (isNaN(t) || t <= 0) {
      setError('Target value must be a positive number.');
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
      setTimeout(() => {
        setEditing(false);
        setSuccess('');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const initial = profile?.name?.[0]?.toUpperCase() || 'U';

  return (
    <div className="space-y-6 font-outfit max-w-3xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2.5">
          <User className="w-8 h-8 text-gray-900" />
          <span>Athlete Profile</span>
        </h1>
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-gray-900 rounded-xl text-gray-900 font-bold text-sm shadow-brutal-sm hover:bg-lime hover:shadow-brutal transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white border-2 border-gray-900 rounded-2xl shadow-brutal overflow-hidden">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-lime via-sky to-violet" />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-12 mb-4 flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white border-2 border-gray-900 shadow-brutal-sm flex items-center justify-center">
              <span className="text-3xl font-black text-gray-900">{initial}</span>
            </div>
            <div className="pb-1">
              <h2 className="text-2xl font-extrabold text-gray-900">{profile?.name || 'Athlete'}</h2>
              <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>{profile?.email}</span>
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-lime/20 border-2 border-lime rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-700 uppercase mb-1">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Total Workouts</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{workoutCount}</p>
            </div>
            <div className="bg-violet/20 border-2 border-violet rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-700 uppercase mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>Training Focus</span>
              </div>
              <p className="text-2xl font-black text-gray-900 capitalize">{profile?.goalType || 'General'}</p>
            </div>
            <div className="bg-sky/20 border-2 border-sky rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-700 uppercase mb-1">
                <Target className="w-3.5 h-3.5" />
                <span>Weekly Target</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{profile?.targetValue || 0} units</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-gray-900" />
          <span>Account Details</span>
        </h3>
        <div className="space-y-3 text-sm">
          {[
            ['User ID', `#${profile?.id || user?.id}`],
            ['Account Created', profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Not set'],
            ['Last Updated', profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'],
            ['Authentication Status', 'Active (JWT Protected)'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-500 font-medium">{label}</span>
              <span className="font-semibold text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setEditing(false)}>
          <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-brutal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-lime" />
                <span>Edit Profile</span>
              </h2>
              <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-coral/10 border-2 border-coral rounded-xl text-coral text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-lime/20 border-2 border-lime rounded-xl text-green-800 text-sm font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
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

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Training Focus</label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream border-2 border-gray-200 rounded-xl font-medium focus:border-gray-900 focus:outline-none"
                >
                  {GOALS.map((g) => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Weekly Target (Units)</label>
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
