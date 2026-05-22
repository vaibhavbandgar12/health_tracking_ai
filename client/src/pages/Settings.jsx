import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { history } = useAuth();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleResetHistory = () => {
    if (window.confirm("Are you sure you want to clear your local metrics database? This will clear all historical logs and restore standard default items.")) {
      localStorage.removeItem('mock_health_history');
      setSuccessMsg('History cleared successfully. Please reload the dashboard to restore default logs.');
      
      // Auto reload after 1.5 seconds
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 font-display tracking-tight flex items-center gap-2">
          <SettingsIcon className="text-primary w-8 h-8" />
          <span>System <span className="text-gradient">Settings</span></span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Adjust notifications preferences, system overrides, and manage your local offline database.
        </p>
      </div>

      {/* Success alert message */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Preferences */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Notifications config */}
          <div className="glass p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-slate-800 font-display">Notifications Preferences</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-slate-800 block">Email Health Reports</span>
                  <span className="text-xs text-slate-500">Receive weekly summaries of averages and sleep scores.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                  style={{ width: 'auto' }}
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <span className="font-semibold text-sm text-slate-800 block">Browser Push Notifications</span>
                  <span className="text-xs text-slate-500">Trigger direct, local alerts on high heart rate warnings or dehydration.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={pushAlerts}
                  onChange={(e) => setPushAlerts(e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                  style={{ width: 'auto' }}
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <span className="font-semibold text-sm text-slate-800 block">Weekly Health Digest</span>
                  <span className="text-xs text-slate-500">Monthly breakdowns and AI recommended workout adjustments digests.</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={weeklyDigest}
                  onChange={(e) => setWeeklyDigest(e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                  style={{ width: 'auto' }}
                />
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="glass p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-slate-800 font-display">Privacy & Security</h3>
            </div>

            <div className="space-y-3 text-xs leading-normal">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="font-semibold text-sm text-slate-800 block mb-1">Local Sandboxed Mode</span>
                <p className="text-slate-500">
                  Your AI Health Tracking app is running in offline client-only mode. All demographic logs, BMI indices calculations, calorie goals, and heart rate parameters are stored strictly in your browser's local sandbox storage (`localStorage`). No information leaves your local device.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Quick operations / Clear DB */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass p-6 border border-rose-100 hover:border-rose-200 transition-all space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-rose-600 font-display">Danger Zone</h3>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-500 leading-normal">
                Resetting your history will delete all logs recorded in the browser local storage and restore default logs. This action cannot be undone.
              </p>

              <button
                onClick={handleResetHistory}
                className="w-full btn bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center gap-2 text-xs py-3"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Local Vitals DB</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
