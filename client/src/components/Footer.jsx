import React from 'react';
import { Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full mt-12 bg-slate-50 border-t border-slate-200/80 py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 p-1.5 rounded-lg border border-blue-100">
            <Activity className="text-blue-600 w-5 h-5" />
          </div>
          <span className="font-bold text-slate-800 tracking-wide font-display">
            AI Health<span className="text-blue-600">Track</span>
          </span>
        </div>
        
        <p className="text-slate-500 text-sm text-center md:text-left">
          © {new Date().getFullYear()} AI HealthTrack. All rights reserved. Empowering healthier lives through predictive AI analysis.
        </p>

        <div className="flex gap-6 text-sm text-slate-500 font-medium">
          <a href="#privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
          <a href="#terms" className="hover:text-blue-600 transition-colors">Terms of Service</a>
          <a href="#support" className="hover:text-blue-600 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}
