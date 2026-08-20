import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  Plus, Search, Calendar, Clock, Trash2, Edit3, X, Dumbbell, AlertCircle
} from 'lucide-react';

export default function Workouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal: null | 'create' | 'edit'
  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  // Form fields
  const [fDate, setFDate] = useState(new Date().toISOString().split('T')[0]);
  const [fActivity, setFActivity] = useState('');
  const [fDuration, setFDuration] = useState('45');
  const [fValue, setFValue] = useState('10');
  const [fError, setFError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchWorkouts = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/users/${user.id}/workouts`);
      setWorkouts(res.data || []);
    } catch (err) {
      console.error('Failed to load workouts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user]);

  // Open modals
  const openCreate = () => {
    setEditTarget(null);
    setFDate(new Date().toISOString().split('T')[0]);
    setFActivity('');
    setFDuration('45');
    setFValue('10');
    setFError('');
    setModal('create');
  };

  const openEdit = (w) => {
    setEditTarget(w);
    setFDate(w.workoutDate || new Date().toISOString().split('T')[0]);
    setFActivity(w.activity || '');
    setFDuration(String(w.duration || 45));
    setFValue(String(w.valueAchieved || 0));
    setFError('');
    setModal('edit');
  };

  // Submit create/update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFError('');
    if (!fActivity.trim()) {
      setFError('Activity name is required.');
      return;
    }
    const dur = parseInt(fDuration, 10);
    const val = parseFloat(fValue);
    if (isNaN(dur) || dur <= 0) {
      setFError('Duration must be a positive number of minutes.');
      return;
    }
    if (isNaN(val) || val < 0) {
      setFError('Value must be zero or a positive number.');
      return;
    }

    const payload = {
      workoutDate: fDate,
      activity: fActivity.trim(),
      duration: dur,
      valueAchieved: val,
      userId: user.id,
    };

    setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/api/workouts', payload);
      } else {
        await api.put(`/api/workouts/${editTarget.id}`, payload);
      }
      setModal(null);
      await fetchWorkouts();
    } catch (err) {
      setFError(err.response?.data?.message || 'Failed to save workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this workout log?')) return;
    try {
      await api.delete(`/api/workouts/${id}`);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const filtered = workouts.filter((w) =>
    w.activity?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-outfit">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2.5">
            <Dumbbell className="w-8 h-8 text-gray-900" />
            <span>Workouts</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">Log, manage, and review your training sessions.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-lime border-2 border-gray-900 rounded-xl text-gray-900 font-bold text-sm shadow-brutal hover:shadow-brutal-lg transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <Plus className="w-5 h-5" />
          <span>Log Workout</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by activity name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-10 py-3 bg-white border-2 border-gray-200 rounded-xl font-medium placeholder-gray-400 focus:border-gray-900 focus:outline-none transition-all"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-6 h-6 border-2 border-gray-900 border-t-lime rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Loading workouts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-10 sm:p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-sand border-2 border-gray-300 flex items-center justify-center mx-auto mb-4">
            {search ? (
              <Search className="w-8 h-8 text-gray-400" />
            ) : (
              <Dumbbell className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {search ? 'No matches found' : 'No workouts logged yet'}
          </h3>
          <p className="text-gray-500 font-medium mb-5 max-w-sm mx-auto">
            {search
              ? `Nothing matches "${search}". Try searching for another activity.`
              : 'Start building your training history by logging your first workout session.'}
          </p>
          {!search && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-lime border-2 border-gray-900 rounded-xl text-gray-900 font-bold text-sm shadow-brutal-sm hover:shadow-brutal transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log First Workout</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((w) => (
            <div
              key={w.id}
              className="bg-white border-2 border-gray-200 rounded-2xl p-5 hover:border-gray-900 hover:shadow-brutal transition-all group"
            >
              {/* Top: Activity and value badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-lg font-bold text-gray-900 break-words leading-tight flex-1">{w.activity}</h3>
                <span className="flex-shrink-0 bg-lime border-2 border-gray-900 rounded-lg px-2.5 py-1 text-sm font-bold text-gray-900 shadow-brutal-sm">
                  {w.valueAchieved ?? 0} units
                </span>
              </div>

              {/* Meta info */}
              <div className="flex items-center gap-4 text-sm text-gray-500 font-medium mb-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{w.workoutDate}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{w.duration} min</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openEdit(w)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-cream border-2 border-gray-200 rounded-lg text-gray-700 font-semibold text-sm hover:border-gray-900 hover:text-gray-900 transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(w.id)}
                  className="flex items-center justify-center px-3 py-2 bg-cream border-2 border-gray-200 rounded-lg text-gray-400 hover:bg-coral/10 hover:border-coral hover:text-coral transition-all"
                  title="Delete workout"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div
            className="bg-white border-2 border-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-brutal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-lime" />
                <span>{modal === 'create' ? 'Log Workout Session' : 'Edit Workout Log'}</span>
              </h2>
              <button onClick={() => setModal(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {fError && (
              <div className="mb-4 p-3 bg-coral/10 border-2 border-coral rounded-xl text-coral text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{fError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Session Date</label>
                <input
                  type="date"
                  required
                  value={fDate}
                  onChange={(e) => setFDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream border-2 border-gray-200 rounded-xl font-medium focus:border-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Activity Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5k Morning Run, Deadlifts..."
                  value={fActivity}
                  onChange={(e) => setFActivity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream border-2 border-gray-200 rounded-xl font-medium placeholder-gray-400 focus:border-gray-900 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={fDuration}
                    onChange={(e) => setFDuration(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream border-2 border-gray-200 rounded-xl font-medium focus:border-gray-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Value / Score</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={fValue}
                    onChange={(e) => setFValue(e.target.value)}
                    className="w-full px-4 py-2.5 bg-cream border-2 border-gray-200 rounded-xl font-medium focus:border-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex-1 py-2.5 bg-cream border-2 border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:border-gray-900 hover:text-gray-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-gray-900 text-white border-2 border-gray-900 rounded-xl font-bold text-sm shadow-brutal-lime hover:bg-lime hover:text-gray-900 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
                >
                  {saving ? 'Saving...' : modal === 'create' ? 'Save Workout' : 'Update Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
