import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, LogOut, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, logout, user } = useAuth();
  const location = useLocation();

  return (
    <nav className="glass sticky top-4 z-50 px-6 py-4 mx-4 mt-4 mb-8 flex justify-between items-center bg-white border border-slate-200/80 shadow-sm rounded-2xl">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
          <Activity className="text-blue-600 w-6 h-6 animate-pulse" />
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-wide font-display">
          AI Health<span className="text-blue-600">Track</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        {token ? (
          <>
            <Link 
              to="/dashboard" 
              className={`font-semibold flex items-center gap-1.5 transition-colors ${
                location.pathname === '/dashboard' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/profile" 
              className={`font-semibold flex items-center gap-1.5 transition-colors ${
                location.pathname === '/profile' ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-cyan-600" />
              <span>{user?.name || 'Profile'}</span>
            </Link>

            <div className="border-l border-slate-200 pl-6 h-6"></div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-slate-500 hover:text-rose-600 font-semibold transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <div className="flex items-center gap-5">
            <Link to="/login" className="text-slate-600 hover:text-slate-950 font-semibold transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="btn btn-primary px-5 py-2.5 rounded-xl font-semibold">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
