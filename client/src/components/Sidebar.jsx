import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Sparkles, 
  User, 
  Settings, 
  LogOut, 
  Activity, 
  Heart,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, currentPrediction, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Reports & History', path: '/reports', icon: FileText },
    { name: 'AI Suggestions', path: '/suggestions', icon: Sparkles },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
    if (onClose) onClose();
  };

  const score = currentPrediction?.health_risk_score || 0;
  
  // Dynamic color for health score pill in light mode
  const getScoreColorClass = (val) => {
    if (val >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (val >= 70) return 'text-amber-700 bg-amber-50 border-amber-100';
    return 'text-rose-700 bg-rose-50 border-rose-100';
  };

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
              <Activity className="text-blue-600 w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-wide font-display">
              AI Health<span className="text-blue-600">Track</span>
            </span>
          </div>
          <button 
            onClick={onClose} 
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
        </div>

        {/* User Quick Info */}
        {user && (
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white shadow-inner">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <h4 className="font-semibold text-slate-800 truncate text-sm leading-tight">{user.name}</h4>
                <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
              </div>
            </div>

            {/* Health Score Pill */}
            <div className={`flex items-center justify-between p-3 rounded-xl border ${getScoreColorClass(score)}`}>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-current animate-pulse" />
                <span className="text-xs font-semibold uppercase tracking-wider">Health Score</span>
              </div>
              <span className="text-sm font-bold">{score} / 100</span>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 border border-blue-100/50 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`
                }
              >
                <Icon className="w-5 h-5 transition-transform group-hover:scale-105" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-medium border border-transparent hover:border-rose-100"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
