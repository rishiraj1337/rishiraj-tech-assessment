import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import EmptyWorkoutsIllustration from '../components/illustrations/EmptyWorkoutsIllustration';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Trash2, 
  Edit3, 
  X, 
  AlertCircle,
  Dumbbell
} from 'lucide-react';

export default function Workouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state: null | 'create' | 'edit'
  const [modalType, setModalType] = useState(null);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  
  // Form input state
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formActivity, setFormActivity] = useState('');
  const [formDuration, setFormDuration] = useState('45');
  const [formValue, setFormValue] = useState('10');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch all user workouts
  const fetchWorkouts = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/users/${user.id}/workouts`);
      setWorkouts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch workouts', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user]);

  // Open Create Modal
  const openCreateModal = () => {
    setCurrentWorkout(null);
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormActivity('');
    setFormDuration('45');
    setFormValue('10');
    setFormError('');
    setModalType('create');
  };

  // Open Edit Modal
  const openEditModal = (workout) => {
    setCurrentWorkout(workout);
    setFormDate(workout.workoutDate || new Date().toISOString().split('T')[0]);
    setFormActivity(workout.activity || '');
    setFormDuration(String(workout.duration || '45'));
    setFormValue(String(workout.valueAchieved || '0'));
    setFormError('');
    setModalType('edit');
  };

  // Handle Form Submit (Create or Update)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formActivity.trim()) {
      setFormError('Activity description is required.');
      return;
    }

    const durationNum = parseInt(formDuration, 10);
    if (isNaN(durationNum) || durationNum <= 0) {
      setFormError('Duration must be a positive number of minutes.');
      return;
    }

    const valueNum = parseFloat(formValue);
    if (isNaN(valueNum) || valueNum < 0) {
      setFormError('Value achieved must be positive or zero.');
      return;
    }

    const payload = {
      workoutDate: formDate,
      activity: formActivity.trim(),
      duration: durationNum,
      valueAchieved: valueNum,
      userId: user.id,
    };

    setSubmitting(true);
    try {
      if (modalType === 'create') {
        await api.post('/api/workouts', payload);
      } else if (modalType === 'edit' && currentWorkout) {
        await api.put(`/api/workouts/${currentWorkout.id}`, payload);
      }
      setModalType(null);
      await fetchWorkouts();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save workout. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Workout
  const handleDelete = async (workoutId) => {
    if (!window.confirm('Are you sure you want to delete this workout log?')) {
      return;
    }
    try {
      await api.delete(`/api/workouts/${workoutId}`);
      setWorkouts((prev) => prev.filter((w) => w.id !== workoutId));
    } catch (err) {
      alert('Failed to delete workout: ' + (err.response?.data?.message || err.message));
    }
  };

  // Filtered list
  const filteredWorkouts = workouts.filter((w) =>
    w.activity?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-7 h-7 text-neon-cyan" />
            <h1 className="font-mono font-black text-3xl text-gray-100 uppercase">
              Workout Sessions
            </h1>
          </div>
          <p className="font-mono text-xs text-gray-400 mt-1">
            Log and manage your training history.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center justify-center space-x-2 px-5 py-3 bg-neon-cyan border-2 border-black text-black font-mono font-bold text-sm uppercase shadow-brutal hover:bg-white transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Log Workout</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex items-center bg-dark-surface border-2 border-black px-4 py-2 shadow-brutal-sm">
        <Search className="w-4 h-4 text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Filter workouts by activity (e.g. run, squat, HIIT)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent font-mono text-sm text-gray-100 placeholder-gray-500 focus:outline-none"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-neon-pink">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Workouts Content List */}
      {loading ? (
        <div className="p-12 text-center bg-dark-surface border-2 border-black shadow-brutal">
          <div className="w-6 h-6 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-mono text-xs text-neon-cyan uppercase">Loading workouts...</p>
        </div>
      ) : filteredWorkouts.length === 0 ? (
        <div className="bg-dark-surface border-2 border-black p-8 sm:p-12 text-center shadow-brutal space-y-4">
          <EmptyWorkoutsIllustration className="w-full max-w-xs mx-auto mb-4" />
          <h3 className="font-mono font-black text-xl text-gray-200 uppercase">
            {searchQuery ? 'No matching workouts found' : 'No Workouts Logged Yet'}
          </h3>
          <p className="font-mono text-xs text-gray-400 max-w-sm mx-auto">
            {searchQuery
              ? `No activities matched "${searchQuery}". Clear your search query to see all logs.`
              : 'Start logging your workouts to track your metrics and conquer your weekly targets.'}
          </p>
          {!searchQuery && (
            <button
              onClick={openCreateModal}
              className="mt-2 inline-flex items-center space-x-2 px-5 py-2.5 bg-neon-pink border-2 border-black text-white font-mono font-bold text-xs uppercase shadow-brutal hover:bg-white hover:text-black transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Your First Session</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkouts.map((workout) => (
            <div
              key={workout.id}
              className="bg-dark-surface p-5 border-2 border-black shadow-brutal hover:shadow-neon-cyan transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan">
                    ID #{workout.id}
                  </span>
                  <span className="font-mono font-bold text-xs px-2.5 py-1 bg-neon-pink text-white border-2 border-black shadow-brutal-sm">
                    {workout.valueAchieved ?? 0} units
                  </span>
                </div>
                <h3 className="font-mono font-black text-lg text-gray-100 break-words mb-3">
                  {workout.activity}
                </h3>
              </div>

              <div>
                <div className="pt-3 border-t border-dark-border flex items-center justify-between font-mono text-xs text-gray-400 mb-4">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 text-neon-cyan" />
                    <span>{workout.workoutDate}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-neon-yellow" />
                    <span>{workout.duration} min</span>
                  </span>
                </div>

                {/* Actions: Edit & Delete */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(workout)}
                    className="flex-1 py-1.5 px-3 bg-dark-card border-2 border-black text-gray-300 font-mono font-bold text-xs uppercase shadow-brutal-sm hover:border-neon-cyan hover:text-neon-cyan transition-all flex items-center justify-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(workout.id)}
                    className="py-1.5 px-3 bg-dark-card border-2 border-black text-neon-pink font-mono font-bold text-xs uppercase shadow-brutal-sm hover:bg-neon-pink hover:text-white transition-all flex items-center justify-center"
                    title="Delete Workout"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Workout Modal Dialog */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-dark-surface border-2 border-black p-6 sm:p-8 max-w-md w-full shadow-neon-cyan">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-mono font-black text-xl text-gray-100 uppercase">
                {modalType === 'create' ? 'Log Workout Session' : 'Edit Workout Log'}
              </h2>
              <button
                onClick={() => setModalType(null)}
                className="p-1.5 bg-dark-card border-2 border-black text-gray-400 hover:text-neon-pink shadow-brutal-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-neon-pink/10 border-2 border-neon-pink text-neon-pink font-mono text-xs font-bold flex items-center space-x-2 shadow-brutal-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              {/* Date Field */}
              <div>
                <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                  Session Date *
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-card border-2 border-black text-gray-100 font-mono text-sm shadow-brutal-sm focus:border-neon-cyan focus:outline-none"
                />
              </div>

              {/* Activity Field */}
              <div>
                <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                  Activity Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5k Interval Run, Heavy Deadlifts..."
                  value={formActivity}
                  onChange={(e) => setFormActivity(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-card border-2 border-black text-gray-100 placeholder-gray-500 font-mono text-sm shadow-brutal-sm focus:border-neon-cyan focus:outline-none"
                />
              </div>

              {/* Duration & Value Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                    Duration (Min) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-card border-2 border-black text-gray-100 font-mono text-sm shadow-brutal-sm focus:border-neon-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                    Score / Units *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    className="w-full px-3 py-2 bg-dark-card border-2 border-black text-gray-100 font-mono text-sm shadow-brutal-sm focus:border-neon-cyan focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  className="px-4 py-2 bg-dark-card border-2 border-black text-gray-400 font-mono font-bold text-xs uppercase shadow-brutal-sm hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-neon-cyan border-2 border-black text-black font-mono font-bold text-xs uppercase shadow-brutal hover:bg-white transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : modalType === 'create' ? 'Save Workout' : 'Update Workout'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
