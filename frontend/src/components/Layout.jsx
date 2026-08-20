import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Dumbbell, User, LogOut, Menu, X, Flame } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Workouts', path: '/workouts', icon: Dumbbell },
  { label: 'Profile', path: '/user', icon: User },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Reusable sidebar content for both mobile and desktop
  const SidebarContent = () => (
    <div className="flex flex-col h-full p-5">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-lime rounded-xl border-2 border-gray-900 shadow-brutal-sm flex items-center justify-center">
          <Flame className="w-6 h-6 text-gray-900" />
        </div>
        <div>
          <h1 className="font-outfit text-xl font-extrabold text-gray-900 leading-none">Momentum</h1>
          <p className="text-[11px] text-gray-400 font-medium">fitness tracker</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-2">
        {NAV_ITEMS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl border-2 font-outfit font-semibold text-[15px] transition-all ${
                isActive
                  ? 'bg-lime text-gray-900 border-gray-900 shadow-brutal'
                  : 'bg-white text-gray-600 border-transparent hover:border-gray-200 hover:bg-gray-50'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User card + Logout */}
      <div className="space-y-3 pt-4 border-t border-gray-200">
        {user && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl bg-sand border-2 border-gray-900 shadow-brutal-sm overflow-hidden flex-shrink-0">
              <img
                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(user.email || 'athlete')}&backgroundColor=bbf7d0,bfdbfe,fed7aa`}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border-2 border-gray-200 text-gray-500 font-outfit font-semibold text-sm hover:border-coral hover:text-coral hover:bg-coral/5 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream font-outfit flex">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r-2 border-gray-200 flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b-2 border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-lime rounded-lg border-2 border-gray-900 shadow-brutal-sm flex items-center justify-center">
            <Flame className="w-5 h-5 text-gray-900" />
          </div>
          <span className="font-outfit text-lg font-extrabold text-gray-900">Momentum</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl border-2 border-gray-200 hover:border-gray-900 transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <>
          <div className="md:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setSidebarOpen(false)} />
          <div className="md:hidden fixed top-0 left-0 w-72 h-full bg-white z-50 border-r-2 border-gray-200 shadow-brutal-lg">
            <SidebarContent />
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen md:p-8 p-4 pt-20 md:pt-8 max-w-6xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
