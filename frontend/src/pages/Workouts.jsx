import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import {
  Plus, Search, Calendar, Clock, Trash2, Edit3, X, Dumbbell,
  AlertCircle, Activity, ChevronDown, ChevronUp, Sparkles, Copy,
  ChevronLeft, ChevronRight, Filter, ArrowUpDown, Check
} from 'lucide-react';

const QUICK_ACTIVITIES = [
  'Running',
  'Weightlifting',
  'HIIT / Cardio',
  'Cycling',
  'Crossfit',
  'Walking / Hiking'
];

const DURATION_PRESETS = [15, 30, 45, 60, 90];

const CATEGORY_TABS = [
  'All',
  'Running',
  'Weightlifting',
  'HIIT / Cardio',
  'Cycling',
  'Crossfit'
];

export default function Workouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'duration' | 'value' | 'alphabetical'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  // Modal state: null | 'create' | 'edit' | 'duplicate'
  const [modal, setModal] = useState(null);
  const [editTarget, setEditTarget] = useState(null);

  // Form fields
  const [fDate, setFDate] = useState(new Date().toISOString().split('T')[0]);
  const [fActivity, setFActivity] = useState('');
  const [fDuration, setFDuration] = useState('45');
  const [fValue, setFValue] = useState('');
  const [showCustomMetric, setShowCustomMetric] = useState(false);
  const [fError, setFError] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

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

  // Open create modal
  const openCreate = () => {
    setEditTarget(null);
    setFDate(new Date().toISOString().split('T')[0]);
    setFActivity('');
    setFDuration('45');
    setFValue('');
    setShowCustomMetric(false);
    setFError('');
    setModal('create');
  };

  // Open edit modal
  const openEdit = (w) => {
    setEditTarget(w);
    setFDate(w.workoutDate || new Date().toISOString().split('T')[0]);
    setFActivity(w.activity || '');
    setFDuration(String(w.duration || 45));
    const hasCustomVal = w.valueAchieved != null && w.valueAchieved !== w.duration;
    setFValue(hasCustomVal ? String(w.valueAchieved) : '');
    setShowCustomMetric(hasCustomVal);
    setFError('');
    setModal('edit');
  };

  // Open duplicate modal (pre-populates with today's date)
  const openDuplicate = (w) => {
    setEditTarget(w);
    setFDate(new Date().toISOString().split('T')[0]);
    setFActivity(w.activity || '');
    setFDuration(String(w.duration || 45));
    const hasCustomVal = w.valueAchieved != null && w.valueAchieved !== w.duration;
    setFValue(hasCustomVal ? String(w.valueAchieved) : '');
    setShowCustomMetric(hasCustomVal);
    setFError('');
    setModal('duplicate');
  };

  // Quick 1-click duplicate for today
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
      setActionSuccess(`Duplicated "${w.activity}" for today.`);
      setTimeout(() => setActionSuccess(''), 3000);
      await fetchWorkouts();
    } catch (err) {
      alert('Duplicate failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFError('');

    if (!fActivity.trim()) {
      setFError('Please enter or select an activity.');
      return;
    }
    const dur = parseInt(fDuration, 10);
    if (isNaN(dur) || dur <= 0) {
      setFError('Duration must be a positive number of minutes.');
      return;
    }

    let val = dur;
    if (fValue.trim()) {
      val = parseFloat(fValue);
      if (isNaN(val) || val < 0) {
        setFError('Custom metric must be zero or a positive number.');
        return;
      }
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
      if (modal === 'create' || modal === 'duplicate') {
        await api.post('/api/workouts', payload);
        setActionSuccess(modal === 'duplicate' ? 'Duplicated session saved.' : 'Workout logged successfully.');
      } else {
        await api.put(`/api/workouts/${editTarget.id}`, payload);
        setActionSuccess('Workout updated successfully.');
      }
      setTimeout(() => setActionSuccess(''), 3000);
      setModal(null);
      await fetchWorkouts();
    } catch (err) {
      setFError(err.response?.data?.message || 'Failed to save workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Delete workout
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this workout log?')) return;
    try {
      await api.delete(`/api/workouts/${id}`);
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      setActionSuccess('Workout deleted.');
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.message || err.message));
    }
  };

  // Filter & Search
  let filtered = workouts.filter((w) => {
    const matchesSearch = w.activity?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === 'All' ||
      w.activity?.toLowerCase().includes(activeCategory.toLowerCase().split(' ')[0]);
    return matchesSearch && matchesCategory;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (sortBy === 'newest') return (b.workoutDate || '').localeCompare(a.workoutDate || '');
    if (sortBy === 'oldest') return (a.workoutDate || '').localeCompare(b.workoutDate || '');
    if (sortBy === 'duration') return (b.duration || 0) - (a.duration || 0);
    if (sortBy === 'value') return (b.valueAchieved || 0) - (a.valueAchieved || 0);
    if (sortBy === 'alphabetical') return (a.activity || '').localeCompare(b.activity || '');
    return 0;
  });

  // Pagination calculation
  const totalItems = filtered.length;
  const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedWorkouts = filtered.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 font-outfit max-w-6xl mx-auto">
      {/* Action toast */}
      {actionSuccess && (
        <div className="p-4 bg-lime border-2 border-gray-900 rounded-2xl font-bold text-sm text-gray-900 shadow-brutal flex items-center justify-between animate-pulse">
          <span className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span>{actionSuccess}</span>
          </span>
          <button onClick={() => setActionSuccess('')} className="text-gray-700 font-extrabold text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime border-2 border-gray-900 shadow-brutal-sm flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-gray-900" />
            </div>
            <span>Workout Sessions</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Log, duplicate, sort, and manage your training logs.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-lime border-2 border-gray-900 rounded-xl text-gray-900 font-bold text-sm shadow-brutal hover:shadow-brutal-lg transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Log Workout</span>
        </button>
      </div>

      {/* Controls Bar: Search, Category Pills, Sort, and Page Size */}
      <div className="bg-white border-2 border-gray-900 rounded-3xl p-5 shadow-brutal space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search activities (e.g. Running, HIIT, Deadlifts)..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-11 pr-10 py-2.5 bg-sand/60 border-2 border-gray-200 rounded-xl font-medium placeholder-gray-400 focus:border-gray-900 focus:outline-none transition-all text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-9 pr-8 py-2.5 bg-sand/60 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:border-gray-900 focus:outline-none"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="duration">Sort: Longest Duration</option>
                <option value="value">Sort: Highest Score</option>
                <option value="alphabetical">Sort: Activity (A-Z)</option>
              </select>
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>

            {/* Page size selector */}
            <div className="relative">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="appearance-none pl-3 pr-7 py-2.5 bg-sand/60 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:border-gray-900 focus:outline-none"
              >
                <option value={6}>6 / page</option>
                <option value={9}>9 / page</option>
                <option value={12}>12 / page</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-1 border-t border-gray-100">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentPage(1);
              }}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border-2 transition-all ${
                activeCategory === cat
                  ? 'bg-lime text-gray-900 border-gray-900 shadow-brutal-sm'
                  : 'bg-sand/40 text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Workouts Grid */}
      {loading ? (
        <div className="text-center py-20 bg-white border-2 border-gray-200 rounded-3xl">
          <div className="w-8 h-8 border-3 border-gray-900 border-t-lime rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Loading workout sessions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-10 sm:p-16 text-center shadow-sm">
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
          <p className="text-gray-500 font-medium mb-6 max-w-sm mx-auto">
            {search
              ? `No activities matched "${search}". Try resetting your search or filter.`
              : 'Log your first workout to start tracking your time, volume, and weekly progress.'}
          </p>
          {!search && (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-lime border-2 border-gray-900 rounded-xl text-gray-900 font-bold text-sm shadow-brutal hover:shadow-brutal-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Your First Session</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Workout Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedWorkouts.map((w) => (
              <div
                key={w.id}
                className="bg-white border-2 border-gray-200 rounded-3xl p-5 hover:border-gray-900 hover:shadow-brutal transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Header: Activity Name & Score Badge */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-black text-gray-900 break-words leading-tight flex-1">
                      {w.activity}
                    </h3>
                    <span className="flex-shrink-0 bg-lime/40 border border-gray-900/30 rounded-lg px-2.5 py-1 text-xs font-bold text-gray-900">
                      {w.valueAchieved ?? w.duration} pts
                    </span>
                  </div>

                  {/* Metadata: Date and Duration */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{w.workoutDate}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{w.duration} min</span>
                    </span>
                  </div>
                </div>

                {/* Card Action Buttons: Edit, Duplicate, Delete */}
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(w)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-sand border-2 border-gray-200 rounded-xl text-gray-700 font-bold text-xs hover:border-gray-900 hover:text-gray-900 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => openDuplicate(w)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-sand border-2 border-gray-200 rounded-xl text-gray-700 font-bold text-xs hover:border-gray-900 hover:text-gray-900 transition-all"
                      title="Duplicate this workout"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Duplicate</span>
                    </button>

                    <button
                      onClick={() => handleDelete(w.id)}
                      className="flex items-center justify-center px-3 py-2 bg-sand border-2 border-gray-200 rounded-xl text-gray-400 hover:bg-coral/10 hover:border-coral hover:text-coral transition-all"
                      title="Delete workout"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 1-Click Quick Repeat Today */}
                  <button
                    onClick={() => handleQuickDuplicate(w)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-white border border-gray-300 rounded-xl text-[11px] font-bold text-gray-600 hover:border-gray-900 hover:bg-sand transition-all"
                  >
                    <Sparkles className="w-3 h-3 text-lime" />
                    <span>Quick Repeat Today</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white border-2 border-gray-900 rounded-2xl p-4 shadow-brutal flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs font-bold text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + pageSize, totalItems)} of {totalItems} workouts
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={safeCurrentPage <= 1}
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  className="p-2 rounded-xl border-2 border-gray-900 bg-sand text-gray-900 disabled:opacity-40 disabled:pointer-events-none hover:bg-lime transition-all shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page Number Chips */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-xl border-2 font-bold text-xs transition-all ${
                        pageNum === safeCurrentPage
                          ? 'bg-gray-900 text-white border-gray-900 shadow-brutal-sm'
                          : 'bg-sand text-gray-700 border-gray-200 hover:border-gray-900'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  className="p-2 rounded-xl border-2 border-gray-900 bg-sand text-gray-900 disabled:opacity-40 disabled:pointer-events-none hover:bg-lime transition-all shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit / Duplicate Modal Dialog */}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setModal(null)}
        >
          <div
            className="bg-white border-2 border-gray-900 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-brutal-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-lime" />
                <span>
                  {modal === 'create'
                    ? 'Log Workout'
                    : modal === 'duplicate'
                    ? 'Duplicate Workout'
                    : 'Edit Workout'}
                </span>
              </h2>
              <button
                onClick={() => setModal(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Feedback */}
            {fError && (
              <div className="mb-4 p-3.5 bg-coral/10 border-2 border-coral rounded-xl text-coral text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{fError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Activity input + Quick tags */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Activity
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5k Morning Run, Squats & Bench..."
                  value={fActivity}
                  onChange={(e) => setFActivity(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream border-2 border-gray-200 rounded-xl font-medium placeholder-gray-400 focus:border-gray-900 focus:outline-none mb-2"
                />

                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_ACTIVITIES.map((act) => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => setFActivity(act)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all ${
                        fActivity === act
                          ? 'bg-lime text-gray-900 border-gray-900 font-bold'
                          : 'bg-sand text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration and Presets */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Duration (Minutes)
                  </label>
                  <span className="text-xs text-gray-400 font-medium">Active workout time</span>
                </div>
                <input
                  type="number"
                  min="1"
                  required
                  value={fDuration}
                  onChange={(e) => setFDuration(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream border-2 border-gray-200 rounded-xl font-medium focus:border-gray-900 focus:outline-none mb-2"
                />

                {/* Duration presets */}
                <div className="flex gap-1.5">
                  {DURATION_PRESETS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setFDuration(String(m))}
                      className={`flex-1 py-1 rounded-lg border text-xs font-semibold transition-all ${
                        fDuration === String(m)
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-sand text-gray-600 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Session Date
                </label>
                <input
                  type="date"
                  required
                  value={fDate}
                  onChange={(e) => setFDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-cream border-2 border-gray-200 rounded-xl font-medium focus:border-gray-900 focus:outline-none"
                />
              </div>

              {/* Optional Custom Metric Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomMetric(!showCustomMetric)}
                  className="w-full flex items-center justify-between py-2 text-xs font-bold text-gray-600 hover:text-gray-900 border-t border-gray-100"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-lime" />
                    <span>Custom Distance / Weight Metric (Optional)</span>
                  </span>
                  {showCustomMetric ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {showCustomMetric ? (
                  <div className="mt-2 p-3 bg-sand/60 border-2 border-gray-200 rounded-xl space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Custom Value (km / kg / reps)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder={`Defaults to duration (${fDuration || 0}) if empty`}
                      value={fValue}
                      onChange={(e) => setFValue(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium focus:border-gray-900 focus:outline-none"
                    />
                    <p className="text-[11px] text-gray-500">
                      Leave empty to automatically use your session duration ({fDuration || 0} min).
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 mt-1">
                    Your {fDuration || 0} min duration will automatically count towards your weekly progress.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="flex-1 py-3 bg-cream border-2 border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:border-gray-900 hover:text-gray-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-gray-900 text-white border-2 border-gray-900 rounded-xl font-bold text-sm shadow-brutal-lime hover:bg-lime hover:text-gray-900 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
                >
                  {saving
                    ? 'Saving...'
                    : modal === 'create'
                    ? 'Save Workout'
                    : modal === 'duplicate'
                    ? 'Save Duplicate'
                    : 'Update Workout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
