import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Sparkles, PlusCircle } from 'lucide-react';
import MetricsCards from '../components/MetricsCards';
import HealthInputForm from '../components/HealthInputForm';
import Recommendations from '../components/Recommendations';
import Charts from '../components/Charts';
import NotificationCard from '../components/NotificationCard';
import Loader from '../components/Loader';

export default function Dashboard() {
  const { history, currentPrediction, addRecord, user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmitRecord = async (formData) => {
    setLoading(true);
    try {
      await addRecord(formData);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to save health record. Please verify database connection.';
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Simulation Loader Overlay */}
      <Loader isVisible={loading} />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 font-display tracking-tight flex items-center gap-2">
            <LayoutDashboard className="text-primary w-8 h-8" />
            <span>Health <span className="text-gradient">Dashboard</span></span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Welcome back, <span className="text-slate-700 font-semibold">{user?.name || 'User'}</span>. Here is your real-time wellness analysis.
          </p>
        </div>

        {/* Quick Date Display */}
        <div className="text-right text-xs text-slate-500 bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl self-start sm:self-center">
          <span>Reporting Period: </span>
          <span className="text-primary font-semibold font-mono">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Primary Analytics Cards */}
      <MetricsCards prediction={currentPrediction} />

      {/* Dashboard Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form and AI Recommendations */}
        <div className="lg:col-span-5 space-y-8">
          <HealthInputForm 
            onSubmit={handleSubmitRecord} 
            loading={loading} 
            lastRecord={currentPrediction} 
          />
          
          <Recommendations prediction={currentPrediction} />
        </div>

        {/* Right Column: Graphs & Alerts */}
        <div className="lg:col-span-7 space-y-8">
          {/* Trends Charts */}
          <div className="h-[380px]">
            <Charts data={history} />
          </div>

          {/* AI Notifications Alerts */}
          <NotificationCard />
        </div>
      </div>
    </div>
  );
}
