import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Scale, Flame, Moon, Activity, Calendar } from 'lucide-react';

export default function ReportCard() {
  const { history, user } = useAuth();

  if (!history || history.length === 0) {
    return (
      <div className="glass p-8 text-center text-slate-400">
        Record logs to see weekly / monthly averages.
      </div>
    );
  }

  // Calculate Averages
  const count = history.length;
  const avgWeight = (history.reduce((sum, item) => sum + item.weight, 0) / count).toFixed(1);
  const avgSleep = (history.reduce((sum, item) => sum + item.sleep_hours, 0) / count).toFixed(1);
  const avgCalories = Math.round(history.reduce((sum, item) => sum + item.calories_consumed, 0) / count);
  const avgExercise = Math.round(history.reduce((sum, item) => sum + item.exercise_minutes, 0) / count);
  const avgHeartRate = Math.round(history.reduce((sum, item) => sum + (item.heart_rate || 72), 0) / count);

  const targets = {
    calories: user?.targetCalories || 2300,
    water: user?.targetWater || 3.0,
    sleep: user?.targetSleep || 8
  };

  return (
    <div className="glass p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-slate-800 font-display">Averages & Progress</h3>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
          Based on {count} {count === 1 ? 'Log' : 'Logs'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Weight */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Avg Weight</span>
            <Scale className="w-4 h-4 text-primary" />
          </div>
          <div className="text-xl font-bold text-slate-800 mt-1.5">{avgWeight} kg</div>
          <div className="text-[10px] text-slate-500 mt-1">Starting point: {history[history.length - 1].weight} kg</div>
        </div>

        {/* Average Sleep */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Avg Sleep</span>
            <Moon className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-slate-800 mt-1.5">{avgSleep} hrs</div>
          <div className="text-[10px] text-slate-500 mt-1">
            Goal: {targets.sleep} hrs ({parseFloat(avgSleep) >= targets.sleep ? 'Met' : `${Math.max(0, (targets.sleep - avgSleep).toFixed(1))}h deficit`})
          </div>
        </div>

        {/* Average Calories */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Avg Intake</span>
            <Flame className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-slate-800 mt-1.5">{avgCalories} kcal</div>
          <div className="text-[10px] text-slate-500 mt-1">
            Goal: {targets.calories} kcal ({avgCalories > targets.calories ? `+${avgCalories - targets.calories}` : `${avgCalories - targets.calories}`} kcal diff)
          </div>
        </div>

        {/* Average Exercise */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Avg Active</span>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-800 mt-1.5">{avgExercise} mins</div>
          <div className="text-[10px] text-slate-500 mt-1">Avg Resting HR: {avgHeartRate} bpm</div>
        </div>
      </div>

      {/* Target Progress Bar Cards */}
      <div className="space-y-4 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Goal Achievements</h4>

        {/* Sleep Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-500">Sleep Duration Goal ({targets.sleep}h)</span>
            <span className="text-slate-800">{Math.round((avgSleep / targets.sleep) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
            <div 
              className="h-full bg-indigo-500 rounded-full" 
              style={{ width: `${Math.min(100, (avgSleep / targets.sleep) * 100)}%` }}
            />
          </div>
        </div>

        {/* Calories Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-500">Calorie Target Goal ({targets.calories} kcal)</span>
            <span className="text-slate-800">{Math.round((avgCalories / targets.calories) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
            <div 
              className="h-full bg-amber-500 rounded-full" 
              style={{ width: `${Math.min(100, (avgCalories / targets.calories) * 100)}%` }}
            />
          </div>
        </div>

        {/* Exercise Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-500">Daily Activity Goal (30 min)</span>
            <span className="text-slate-800">{Math.round((avgExercise / 30) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
            <div 
              className="h-full bg-emerald-500 rounded-full" 
              style={{ width: `${Math.min(100, (avgExercise / 30) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
