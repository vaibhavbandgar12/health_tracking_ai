import React, { useState, useEffect } from 'react';
import { Dumbbell, Utensils, Moon, Sparkles, CheckCircle2, Circle, AlertCircle } from 'lucide-react';

export default function Recommendations({ prediction }) {
  const [completedTasks, setCompletedTasks] = useState({});

  useEffect(() => {
    // Reset checklist when prediction changes
    if (prediction) {
      setCompletedTasks({});
    }
  }, [prediction?._id]);

  if (!prediction) return null;

  // Determine priority flags based on metric thresholds
  const sleepDeficit = prediction.sleep_hours < 6.5;
  const exerciseDeficit = prediction.exercise_minutes < 30;
  const waterDeficit = (prediction.water_intake || 2.0) < 2.5;

  const toggleTask = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const tasks = [
    {
      id: 'workout',
      title: 'Daily Exercise Target',
      desc: prediction.recommendation_workout,
      icon: Dumbbell,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-100',
      tag: exerciseDeficit ? 'High Priority' : 'Optimal',
      tagBg: exerciseDeficit ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100',
      action: exerciseDeficit ? 'Aim for 30+ mins today' : 'Workout Target Met'
    },
    {
      id: 'diet',
      title: 'Nutrition & Hydration',
      desc: prediction.recommendation_diet,
      icon: Utensils,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      tag: waterDeficit ? 'Action Required' : 'Optimal',
      tagBg: waterDeficit ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100',
      action: waterDeficit ? 'Drink 2.5L - 3.0L Water' : 'Good Hydration Level'
    },
    {
      id: 'sleep',
      title: 'Sleep & Recovery',
      desc: prediction.recommendation_sleep,
      icon: Moon,
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      tag: sleepDeficit ? 'Critical Deficit' : 'Optimal',
      tagBg: sleepDeficit ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100',
      action: sleepDeficit ? 'Sleep 7-8h Tonight' : 'Sleep Target Met'
    }
  ];

  const totalTasks = tasks.length;
  const doneCount = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = Math.round((doneCount / totalTasks) * 100);

  return (
    <div className="glass p-5 space-y-4">
      {/* Header with Title and Progress */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <h3 className="font-bold text-slate-800 font-display">AI Recommended Actions</h3>
        </div>
        {totalTasks > 0 && (
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Today's Progress</span>
            <span className="text-xs font-bold text-primary">{doneCount}/{totalTasks} Checked ({progressPercent}%)</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500" 
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const Icon = task.icon;
          const isDone = !!completedTasks[task.id];
          return (
            <div 
              key={task.id} 
              onClick={() => toggleTask(task.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex gap-3.5 items-start ${
                isDone 
                  ? 'bg-slate-50/70 border-slate-200 opacity-75' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Checkbox Icon */}
              <button 
                type="button"
                className={`mt-0.5 shrink-0 transition-colors ${isDone ? 'text-emerald-500' : 'text-slate-400 hover:text-primary'}`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5 fill-current text-white stroke-emerald-500" /> : <Circle className="w-5 h-5" />}
              </button>

              <div className="flex-1 min-w-0">
                {/* Task Header */}
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-semibold font-display ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {task.title}
                  </h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${task.tagBg}`}>
                    {task.tag}
                  </span>
                </div>

                {/* Subtitle / Focus Advice */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className={`p-1 rounded-lg border ${task.iconBg}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {task.action}
                  </span>
                </div>

                {/* Recommendation Detail Text */}
                <p className={`text-xs mt-2 leading-relaxed ${isDone ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                  {task.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tip Banner */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 text-[11px] text-slate-500 leading-normal flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <span>Completing recommended targets directly improves your health risk index on subsequent checkins.</span>
      </div>
    </div>
  );
}
