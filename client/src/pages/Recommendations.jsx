import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Dumbbell, Utensils, Moon, Activity, Flame, ShieldAlert, Heart } from 'lucide-react';

export default function Recommendations() {
  const { currentPrediction, user } = useAuth();

  if (!currentPrediction) {
    return (
      <div className="glass p-8 text-center text-slate-400 max-w-xl mx-auto mt-12">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">No AI Advice Found</h3>
        <p className="text-sm">Log your vitals on the dashboard to generate your personalized wellness directives.</p>
      </div>
    );
  }

  // Calculate training heart rate zones using Karvonen formula (approximated)
  const age = currentPrediction.age || 26;
  const maxHR = 220 - age;
  const fatBurnMin = Math.round(maxHR * 0.6);
  const fatBurnMax = Math.round(maxHR * 0.7);
  const cardioMin = Math.round(maxHR * 0.7);
  const cardioMax = Math.round(maxHR * 0.85);

  // Calorie breakdown suggestions
  const totalCalorieNeeds = currentPrediction.calorie_needs || 2300;
  const proteinGrams = Math.round((totalCalorieNeeds * 0.25) / 4);
  const carbGrams = Math.round((totalCalorieNeeds * 0.50) / 4);
  const fatGrams = Math.round((totalCalorieNeeds * 0.25) / 9);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 font-display tracking-tight flex items-center gap-2">
          <Sparkles className="text-primary w-8 h-8 animate-pulse" />
          <span>AI Personalized <span className="text-gradient">Recommendations</span></span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Deep diagnostic insights compiled from your latest biometrics log on {new Date(currentPrediction.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Expanded Workout Recommendation Card */}
        <div className="glass p-6 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full filter blur-xl group-hover:bg-primary/10 transition-colors" />
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Plan Directive</span>
              <h3 className="text-lg font-bold text-slate-800 font-display">Fitness & Exercise</h3>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed font-medium">
            {currentPrediction.recommendation_workout}
          </div>

          {/* Heart Rate Training Zones */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs uppercase font-bold text-slate-500 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" /> Heart Rate Training Zones
            </h4>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-800">Fat Burn Zone (60-70%)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Optimal for steady calorie expenditure</div>
                </div>
                <div className="font-bold text-emerald-600 font-mono text-sm">{fatBurnMin} - {fatBurnMax} bpm</div>
              </div>

              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <div className="font-semibold text-slate-800">Cardiovascular Zone (70-85%)</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Aids aerobic performance & heart strength</div>
                </div>
                <div className="font-bold text-primary font-mono text-sm">{cardioMin} - {cardioMax} bpm</div>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Diet & Calorie Recommendation Card */}
        <div className="glass p-6 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full filter blur-xl group-hover:bg-amber-500/10 transition-colors" />
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50/10 text-amber-600 flex items-center justify-center">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Plan Directive</span>
              <h3 className="text-lg font-bold text-slate-800 font-display">Diet & Calorie Target</h3>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed font-medium">
            {currentPrediction.recommendation_diet}
          </div>

          {/* Macro Split Suggestions */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs uppercase font-bold text-slate-500 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Target Macro Nutrient Splits
            </h4>

            <div className="space-y-3.5 text-xs">
              {/* Protein */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-600">Proteins (25%)</span>
                  <span className="text-slate-800 font-mono">{proteinGrams}g</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              {/* Carbs */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-600">Carbohydrates (50%)</span>
                  <span className="text-slate-800 font-mono">{carbGrams}g</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                  <div className="h-full bg-primary rounded-full" style={{ width: '50%' }} />
                </div>
              </div>

              {/* Fats */}
              <div className="space-y-1">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-600">Healthy Fats (25%)</span>
                  <span className="text-slate-800 font-mono">{fatGrams}g</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                  <div className="h-full bg-rose-400 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Sleep & Recovery Recommendation Card */}
        <div className="glass p-6 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full filter blur-xl group-hover:bg-indigo-500/10 transition-colors" />
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50/15 text-indigo-600 flex items-center justify-center">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Plan Directive</span>
              <h3 className="text-lg font-bold text-slate-800 font-display">Sleep & Recovery</h3>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed font-medium">
            {currentPrediction.recommendation_sleep}
          </div>

          {/* Sleep Cycle Recommendations */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs uppercase font-bold text-slate-500 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-indigo-500" /> Circadian Rhythm Recovery Guide
            </h4>

            <div className="space-y-3.5 text-xs leading-normal">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-800 block">Sleep Cycle Multipliers</span>
                <p className="text-[10px] text-slate-500">
                  Target sleep times in 90-minute blocks (e.g. 7.5 hours or 9 hours) to avoid waking up mid-REM cycle, decreasing grogginess.
                </p>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-800 block">Hydration guidelines</span>
                <p className="text-[10px] text-slate-500">
                  Drink {user?.targetWater || '3.0'} liters daily. Dehydration increases metabolic fatigue and mimics cardiovascular exhaustion.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
