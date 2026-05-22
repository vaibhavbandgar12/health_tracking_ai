import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, Bell, X, ShieldAlert, CheckCircle, Info, Heart } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, notifications } = useAuth();
  const location = useLocation();

  // Map path to page name for breadcrumb
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Health Dashboard';
      case '/reports':
        return 'Analytics & Reports';
      case '/suggestions':
        return 'AI Recommendations';
      case '/profile':
        return 'User Profile';
      case '/settings':
        return 'System Settings';
      default:
        return 'Health Track';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'danger':
        return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case 'warning':
        return <ShieldAlert className="w-5 h-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAlertBg = (type) => {
    switch (type) {
      case 'danger':
        return 'bg-rose-50 border-rose-100 text-rose-800';
      case 'warning':
        return 'bg-amber-50 border-amber-100 text-amber-800';
      case 'success':
        return 'bg-emerald-50 border-emerald-100 text-emerald-800';
      default:
        return 'bg-blue-50 border-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 flex">
      {/* Sidebar navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0 transition-all duration-300">
        
        {/* Dashboard Top Header */}
        <header className="sticky top-0 z-30 h-20 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 md:px-8 shadow-sm">
          {/* Left panel: mobile menu toggle + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 font-display">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right panel: Alerts and Profile quick view */}
          <div className="flex items-center gap-4 relative">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={`p-2.5 rounded-xl border transition-all relative ${
                  notificationsOpen 
                    ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200/60 text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 border border-white text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {notificationsOpen && (
                <>
                  {/* Backdrop closer */}
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  
                  <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl p-4 shadow-xl z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-600" />
                        <h4 className="font-semibold text-sm text-slate-800 font-display">AI Health Insights</h4>
                      </div>
                      <button 
                        onClick={() => setNotificationsOpen(false)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                      {notifications.length > 0 ? (
                        notifications.map((alert) => (
                          <div 
                            key={alert.id}
                            className={`p-3 rounded-xl border ${getAlertBg(alert.type)} flex gap-3 text-left`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {getAlertIcon(alert.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h5 className="font-semibold text-xs text-slate-800 truncate">{alert.title}</h5>
                                <span className="text-[9px] text-slate-500 font-mono shrink-0 ml-2">{alert.timestamp}</span>
                              </div>
                              <p className="text-xs text-slate-600 mt-1 leading-normal">
                                {alert.message}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-slate-500 text-sm">
                          No notifications or warnings found.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Quick Profile display */}
            {user && (
              <Link 
                to="/profile" 
                className="hidden sm:flex items-center gap-2.5 p-1 pr-3 rounded-xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white text-sm shadow-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-none">{user.name}</div>
                  <div className="text-[10px] text-slate-500 leading-none mt-1">Profile View</div>
                </div>
              </Link>
            )}
          </div>
        </header>

        {/* Content Outlet Container */}
        <main className="flex-grow p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
