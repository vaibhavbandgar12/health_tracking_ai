import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, LogOut } from 'lucide-react';

export default function Navbar({ isAuthenticated, onLogout }) {
  const location = useLocation();

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 mx-4 mt-4 mb-8 flex justify-between items-center">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-primary/20 p-2 rounded-lg">
          <Activity className="text-primary w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-white tracking-wide">
          AI Health<span className="text-primary">Track</span>
        </span>
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <>
            <Link 
              to="/dashboard" 
              className={`font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Dashboard
            </Link>
            <div className="border-l border-white/10 pl-6 h-6"></div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-slate-300 hover:text-white font-medium transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="btn btn-primary px-5 py-2 rounded-lg font-medium">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
