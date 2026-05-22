import React from 'react';
import { Dumbbell, Utensils, Moon, Sparkles } from 'lucide-react';

export default function Recommendations({ prediction }) {
  if (!prediction) return null;

  return (
    <div className="glass p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
        <h3 className="font-bold text-slate-800 font-display">AI Health Advice</h3>
      </div>

      <div className="space-y-4">
        {/* Workout Recommendation */}
        <div className="flex gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Exercise Plan</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {prediction.recommendation_workout}
            </p>
          </div>
        </div>

        {/* Diet Recommendation */}
        <div className="flex gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Dietary Directives</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {prediction.recommendation_diet}
            </p>
          </div>
        </div>

        {/* Sleep Recommendation */}
        <div className="flex gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Moon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider">Sleep & Recovery</h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {prediction.recommendation_sleep}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
