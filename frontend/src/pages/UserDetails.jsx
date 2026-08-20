import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import ProfileIllustration from '../components/illustrations/ProfileIllustration';
import { 
  User, 
  Mail, 
  Target, 
  Calendar, 
  Edit3, 
  X, 
  CheckCircle, 
  AlertCircle,
  Flame,
  Award,
  Zap
} from 'lucide-react';

const GOAL_OPTIONS = [
  { value: 'running', label: 'Running (Distance in km)' },
  { value: 'strength', label: 'Strength / Weightlifting (kg)' },
  { value: 'cardio', label: 'Cardio (Active minutes)' },
  { value: 'cycling', label: 'Cycling (Distance in km)' },
  { value: 'crossfit', label: 'Crossfit (Workouts count)' },
];

export default function UserDetails() {
  const { user, updateUser } = useAuth();
  
  const [profileData, setProfileData] = useState(user);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Edit Profile Modal state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [goalType, setGoalType] = useState(user?.goalType || 'running');
  const [targetValue, setTargetValue] = useState(String(user?.targetValue || '50'));
  const [feedback, setFeedback] = useState({ error: '', success: '' });
  const [saving, setSaving] = useState(false);

  // Fetch full user profile & total workouts count
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const [userRes, workoutsRes] = await Promise.all([
          api.get(`/api/users/${user.id}`),
          api.get(`/api/users/${user.id}/workouts`)
        ]);
        setProfileData(userRes.data);
        setWorkoutCount(workoutsRes.data?.length || 0);
        setName(userRes.data.name || '');
        setGoalType(userRes.data.goalType || 'running');
        setTargetValue(String(userRes.data.targetValue || '50'));
      } catch (err) {
        console.error('Failed to load user details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Handle Profile Update Submission
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setFeedback({ error: '', success: '' });

    if (!name.trim()) {
      setFeedback({ error: 'Name is required.', success: '' });
      return;
    }

    const numTarget = parseFloat(targetValue);
    if (isNaN(numTarget) || numTarget <= 0) {
      setFeedback({ error: 'Weekly target must be a positive number.', success: '' });
      return;
    }

    setSaving(true);
    try {
      const res = await api.put(`/api/users/${user.id}`, {
        name: name.trim(),
        email: profileData?.email,
        goalType,
        targetValue: numTarget,
      });

      setProfileData(res.data);
      updateUser(res.data);
      setFeedback({ error: '', success: 'Profile updated successfully!' });
      setTimeout(() => {
        setIsEditing(false);
        setFeedback({ error: '', success: '' });
      }, 1000);
    } catch (err) {
      setFeedback({
        error: err.response?.data?.message || 'Failed to update profile.',
        success: '',
      });
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(profileData?.email || 'user')}`;

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <User className="w-7 h-7 text-neon-pink" />
            <h1 className="font-mono font-black text-3xl text-gray-100 uppercase">
              Athlete Profile
            </h1>
          </div>
          <p className="font-mono text-xs text-gray-400 mt-1">
            Manage your personal metrics and fitness targets.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-dark-card border-2 border-neon-cyan text-neon-cyan font-mono font-bold text-xs uppercase shadow-brutal hover:bg-neon-cyan hover:text-black transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <Edit3 className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Main Profile Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="bg-dark-surface p-6 border-2 border-black shadow-neon-pink flex flex-col items-center text-center space-y-4">
          <div className="w-28 h-28 bg-neon-pink border-2 border-black shadow-brutal overflow-hidden">
            <img
              src={avatarUrl}
              alt="Athlete Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="font-mono font-black text-2xl text-gray-100 uppercase">
              {profileData?.name || 'Athlete'}
            </h2>
            <div className="flex items-center justify-center space-x-1.5 font-mono text-xs text-neon-cyan mt-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{profileData?.email || 'N/A'}</span>
            </div>
          </div>

          <div className="w-full pt-4 border-t border-dark-border">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-neon-pink/10 border border-neon-pink text-neon-pink font-mono text-xs font-bold uppercase">
              <Flame className="w-3.5 h-3.5" />
              <span>{profileData?.goalType || 'Fitness'} Focus</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Metrics & Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Stats Overview */}
          <div className="bg-dark-surface p-6 border-2 border-black shadow-brutal space-y-4">
            <h3 className="font-mono font-black text-lg text-gray-100 uppercase flex items-center space-x-2">
              <Award className="w-5 h-5 text-neon-yellow" />
              <span>Fitness Milestones</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-dark-card p-4 border-2 border-black shadow-brutal-sm">
                <span className="font-mono text-xs text-gray-400 uppercase font-bold">Total Workouts Logged</span>
                <p className="font-mono font-black text-3xl text-neon-cyan mt-1">
                  {workoutCount}
                </p>
              </div>

              <div className="bg-dark-card p-4 border-2 border-black shadow-brutal-sm">
                <span className="font-mono text-xs text-gray-400 uppercase font-bold">Current Weekly Target</span>
                <p className="font-mono font-black text-3xl text-neon-pink mt-1">
                  {profileData?.targetValue || 0} <span className="text-xs text-gray-400 font-normal">units</span>
                </p>
              </div>
            </div>
          </div>

          {/* Account Details Box */}
          <div className="bg-dark-surface p-6 border-2 border-black shadow-brutal space-y-3 font-mono text-xs">
            <h3 className="font-black text-sm text-neon-cyan uppercase">Account Details</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between py-1.5 border-b border-dark-border">
                <span className="text-gray-500 uppercase">User ID</span>
                <span className="font-bold">#{profileData?.id || user?.id}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-dark-border">
                <span className="text-gray-500 uppercase">Member Since</span>
                <span>{profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'August 2026'}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500 uppercase">Security Token</span>
                <span className="text-neon-green font-bold">Active &bull; JWT Protected</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Undraw Illustration Banner */}
      <div className="bg-dark-surface border-2 border-black p-6 shadow-brutal flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-md">
          <div className="flex items-center space-x-2 text-neon-cyan font-mono font-bold text-xs uppercase">
            <Zap className="w-4 h-4" />
            <span>Athletic Consistency</span>
          </div>
          <h3 className="font-mono font-black text-xl text-gray-100 uppercase">
            Build Habits. Crush Targets.
          </h3>
          <p className="font-mono text-xs text-gray-400">
            Keep your profile focus up to date to see accurate weekly percentage completion on your dashboard.
          </p>
        </div>
        <div className="w-full md:w-64 flex-shrink-0">
          <ProfileIllustration className="w-full h-auto max-h-36" />
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-dark-surface border-2 border-black p-6 sm:p-8 max-w-md w-full shadow-neon-pink">
            
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-mono font-black text-xl text-gray-100 uppercase">
                Edit Profile
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 bg-dark-card border-2 border-black text-gray-400 hover:text-neon-pink shadow-brutal-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {feedback.error && (
              <div className="mb-4 p-3 bg-neon-pink/10 border-2 border-neon-pink text-neon-pink font-mono text-xs font-bold flex items-center space-x-2 shadow-brutal-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{feedback.error}</span>
              </div>
            )}

            {feedback.success && (
              <div className="mb-4 p-3 bg-neon-green/10 border-2 border-neon-green text-neon-green font-mono text-xs font-bold flex items-center space-x-2 shadow-brutal-sm">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{feedback.success}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              
              {/* Name Field */}
              <div>
                <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-card border-2 border-black text-gray-100 font-mono text-sm shadow-brutal-sm focus:border-neon-pink focus:outline-none"
                />
              </div>

              {/* Goal Type */}
              <div>
                <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                  Fitness Focus
                </label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-card border-2 border-black text-gray-100 font-mono text-xs shadow-brutal-sm focus:border-neon-pink focus:outline-none"
                >
                  {GOAL_OPTIONS.map((g) => (
                    <option key={g.value} value={g.value} className="bg-dark-card">
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Value */}
              <div>
                <label className="block font-mono text-xs font-bold uppercase text-gray-300 mb-1">
                  Weekly Target (Units) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-card border-2 border-black text-gray-100 font-mono text-sm shadow-brutal-sm focus:border-neon-pink focus:outline-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-dark-card border-2 border-black text-gray-400 font-mono font-bold text-xs uppercase shadow-brutal-sm hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-neon-pink border-2 border-black text-white font-mono font-bold text-xs uppercase shadow-brutal hover:bg-white hover:text-black transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
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
