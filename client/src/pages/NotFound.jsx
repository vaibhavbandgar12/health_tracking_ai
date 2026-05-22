import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="glass max-w-md w-full p-8 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-500/5 rounded-full filter blur-[60px] pointer-events-none" />

        <div className="flex justify-center">
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-full text-rose-600 animate-pulse">
            <AlertCircle className="w-12 h-12" />
          </div>
        </div>

        <h1 className="text-5xl font-black text-gradient-rose font-display">404</h1>
        <h2 className="text-xl font-bold text-slate-800 font-display font-display">Page Not Found</h2>
        
        <p className="text-sm text-slate-500 leading-relaxed">
          The fitness metric dashboard path or diagnostic report page you are seeking does not exist.
        </p>

        <div className="flex gap-4 justify-center pt-2">
          <Link to="/" className="btn btn-outline text-xs px-5 py-2.5 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" /> Home Page
          </Link>
          <Link to="/dashboard" className="btn btn-primary text-xs px-5 py-2.5 flex items-center gap-1.5">
            <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
