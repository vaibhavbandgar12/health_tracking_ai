import React from 'react';
import { Heart, Flame, Scale, Activity } from 'lucide-react';

export default function MetricsCards({ prediction }) {
  if (!prediction) {
    return (
      <div className="glass p-6 text-center text-slate-400">
        Submit your first daily log metrics to view calculated biometrics cards.
      </div>
    );
  }

  // Helper to color code health risk score in light mode
  const getScoreColor = (score) => {
    if (score >= 85) return { text: 'text-emerald-600', border: 'border-emerald-100', bg: 'bg-emerald-50' };
    if (score >= 70) return { text: 'text-amber-600', border: 'border-amber-100', bg: 'bg-amber-50' };
    return { text: 'text-rose-600', border: 'border-rose-100', bg: 'bg-rose-50' };
  };

  const scoreMeta = getScoreColor(prediction.health_risk_score);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Health Risk Score Card */}
      <div className={`glass p-6 border ${scoreMeta.border} relative overflow-hidden group`}>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Health Score</span>
            <h3 className="text-3xl font-black text-slate-800 mt-1.5 font-display flex items-baseline gap-1">
              {prediction.health_risk_score}
              <span className="text-sm font-normal text-slate-400">/ 100</span>
            </h3>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${scoreMeta.bg} ${scoreMeta.text} border border-transparent`}>
            <Heart className="w-5 h-5 fill-current animate-pulse" />
          </div>
        </div>
        <div className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${scoreMeta.text} ${scoreMeta.bg} animate-pulse`} style={{ backgroundColor: 'currentColor' }} />
          <span>Status: <strong className={scoreMeta.text}>{prediction.health_risk_score >= 85 ? 'Optimal Vitals' : prediction.health_risk_score >= 70 ? 'Moderate Risks' : 'Needs Attention'}</strong></span>
        </div>
      </div>

      {/* Body Mass Index Card */}
      <div className="glass p-6 border border-slate-100 relative overflow-hidden group">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Body Mass Index</span>
            <h3 className="text-3xl font-black text-slate-800 mt-1.5 font-display flex items-baseline gap-1">
              {prediction.bmi}
              <span className="text-sm font-normal text-slate-400">kg/m²</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100/30">
            <Scale className="w-5 h-5" />
          </div>
        </div>
        <div className="text-xs text-slate-600 mt-4">
          Category: <span className="text-blue-600 font-semibold">{prediction.bmi_category}</span>
        </div>
      </div>

      {/* Calorie Needs Card */}
      <div className="glass p-6 border border-slate-100 relative overflow-hidden group">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Calorie Needs</span>
            <h3 className="text-3xl font-black text-slate-800 mt-1.5 font-display flex items-baseline gap-1">
              {prediction.calorie_needs}
              <span className="text-sm font-normal text-slate-400">kcal/day</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600 border border-amber-100/30">
            <Flame className="w-5 h-5" />
          </div>
        </div>
        <div className="text-xs text-slate-600 mt-4">
          Logged: <span className="text-amber-600 font-semibold">{prediction.calories_consumed} kcal</span> ({prediction.calories_consumed > prediction.calorie_needs ? 'Caloric Surplus' : 'Caloric Deficit'})
        </div>
      </div>

      {/* Vitals Summary Card */}
      <div className="glass p-6 border border-slate-100 relative overflow-hidden group">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">Logged Vitals</span>
            <h3 className="text-xl font-bold text-slate-800 mt-1.5 font-display">
              {prediction.sleep_hours}h <span className="text-xs font-normal text-slate-400">sleep</span> / {prediction.water_intake}L <span className="text-xs font-normal text-slate-400">water</span>
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-50 text-cyan-600 border border-cyan-100/30">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="text-xs text-slate-500 mt-4 flex justify-between">
          <span>Exercise: <strong className="text-slate-700">{prediction.exercise_minutes} min</strong></span>
          <span>Resting HR: <strong className="text-slate-700">{prediction.heart_rate} bpm</strong></span>
        </div>
      </div>
    </div>
  );
}
