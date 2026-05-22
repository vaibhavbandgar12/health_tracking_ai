import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Invalid credentials. Please try again.';
      setError(errMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full filter blur-[80px]" />
      
      <div className="glass max-w-md w-full p-8 relative z-10 space-y-6 shadow-2xl">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20 animate-pulse">
            <Activity className="text-primary w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 font-display">Welcome Back</h2>
          <p className="text-sm text-slate-500">Log in to check your dynamic vitals and scores</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email">Email Address</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Mail className="w-4.5 h-4.5" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-11"
                placeholder="name@example.com"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password">Password</label>
              <a href="#forgot" className="text-xs text-primary hover:underline font-semibold">Forgot?</a>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                <Lock className="w-4.5 h-4.5" />
              </span>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-full py-3 flex items-center justify-center gap-2 group mt-6"
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            {!loading && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </form>

        {/* Footer Toggle links */}
        <div className="text-center text-sm pt-2">
          <span className="text-slate-500">Don't have an account? </span>
          <Link to="/signup" className="text-primary hover:underline font-semibold">
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
