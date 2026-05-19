import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="bg-primary/20 p-4 rounded-2xl mb-6">
        <Activity className="text-primary w-16 h-16" />
      </div>
      <h1 className="text-5xl md:text-6xl font-bold mb-6">
        Welcome to <span className="text-gradient">AI HealthTrack</span>
      </h1>
      <p className="text-xl text-slate-300 max-w-2xl mb-10">
        Monitor your vitals, get AI-powered health predictions, and receive personalized lifestyle recommendations based on your unique data.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/signup" className="btn btn-primary text-lg px-8 py-3">
          Get Started
        </Link>
        <Link to="/login" className="btn btn-outline text-lg px-8 py-3">
          Login
        </Link>
      </div>
    </div>
  );
}
