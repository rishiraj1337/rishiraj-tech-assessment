import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Dumbbell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Flame,
  Zap
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Workouts', path: '/workouts', icon: Dumbbell },
  { label: 'Profile', path: '/user', icon: User },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col md:flex-row">
      
      {/* Mobile Top Navigation Header */}
      <header className="md:hidden flex items-center justify-between bg-dark-surface p-4 border-b-2 border-black sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-neon-cyan border-2 border-black flex items-center justify-center shadow-brutal-sm">
            <Zap className="w-5 h-5 text-black" />
          </div>
          <span className="font-mono font-black text-xl tracking-wider text-neon-cyan uppercase">
            MOMENTUM
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-dark-card border-2 border-black text-neon-cyan shadow-brutal-sm active:translate-x-0.5 active:translate-y-0.5"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/80 z-40 backdrop-blur-sm"
        />
      )}

      {/* Sidebar (Desktop + Mobile Slide-out) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-dark-surface border-r-2 border-black p-5 flex flex-col justify-between z-50 transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand Logo Header */}
          <div className="flex items-center space-x-3 mb-8 pt-2">
            <div className="w-10 h-10 bg-neon-cyan border-2 border-black flex items-center justify-center shadow-brutal">
              <Flame className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="font-mono font-black text-xl tracking-wider text-neon-cyan leading-none uppercase">
                MOMENTUM
              </h1>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                Fitness Tracker
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-3">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 border-2 font-mono font-bold text-sm tracking-wide uppercase transition-all ${
                      isActive
                        ? 'bg-neon-cyan text-black border-black shadow-brutal translate-x-1'
                        : 'bg-dark-card text-gray-300 border-dark-border hover:border-neon-cyan hover:text-neon-cyan hover:shadow-brutal-sm'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout section */}
        <div className="pt-4 border-t-2 border-dark-border space-y-4">
          {user && (
            <div className="bg-dark-card p-3 border-2 border-black shadow-brutal-sm">
              <p className="font-mono text-xs text-neon-pink font-bold truncate">
                {user.name || 'User'}
              </p>
              <p className="font-mono text-[11px] text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-dark-card border-2 border-neon-pink text-neon-pink font-mono font-bold text-sm uppercase shadow-brutal-sm hover:bg-neon-pink hover:text-white transition-all active:translate-x-0.5 active:translate-y-0.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
}
