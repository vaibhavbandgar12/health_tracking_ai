import React from 'react';
import { Bell, ShieldAlert, CheckCircle, Info, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NotificationCard() {
  const { notifications } = useAuth();

  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger':
        return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'warning':
        return <ShieldAlert className="w-5 h-5 text-amber-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertBorderClass = (type) => {
    switch (type) {
      case 'danger':
        return 'border-rose-100 bg-rose-50 text-rose-800';
      case 'warning':
        return 'border-amber-100 bg-amber-50 text-amber-800';
      case 'success':
        return 'border-emerald-100 bg-emerald-50 text-emerald-800';
      default:
        return 'border-blue-100 bg-blue-50 text-blue-800';
    }
  };

  return (
    <div className="glass p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Bell className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-slate-800 font-display">Active AI Insights</h3>
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((alert) => (
            <div 
              key={alert.id}
              className={`p-3 rounded-xl border flex gap-3 ${getAlertBorderClass(alert.type)}`}
            >
              <div className="shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-xs text-slate-800 truncate">{alert.title}</h4>
                  <span className="text-[9px] text-slate-500 font-mono shrink-0 ml-2">{alert.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-normal">
                  {alert.message}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-slate-500 text-xs">
            No warnings or critical recommendations for your current vitals.
          </div>
        )}
      </div>
    </div>
  );
}
