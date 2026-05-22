import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Dumbbell, Utensils, Moon, Activity, Flame, ShieldAlert, Heart,
  CheckCircle2, Circle, Plus, Droplet, Check, X
} from 'lucide-react';

export default function Recommendations() {
  const { currentPrediction, addRecord, user } = useAuth();

  if (!currentPrediction) {
    return (
      <div className="glass p-8 text-center text-slate-400 max-w-xl mx-auto mt-12">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">No AI Advice Found</h3>
        <p className="text-sm">Log your vitals on the dashboard to generate your personalized wellness directives.</p>
      </div>
    );
  }

  // Quick Action increments
  const handleQuickLog = (field, increment) => {
    const currentVal = parseFloat(currentPrediction[field] || 0);
    let updatedVal = parseFloat((currentVal + increment).toFixed(2));
    if (updatedVal < 0) updatedVal = 0;

    const formData = {
      weight: currentPrediction.weight,
      height: currentPrediction.height,
      age: currentPrediction.age,
      sleep_hours: field === 'sleep_hours' ? updatedVal : currentPrediction.sleep_hours,
      calories_consumed: field === 'calories_consumed' ? updatedVal : currentPrediction.calories_consumed,
      exercise_minutes: field === 'exercise_minutes' ? updatedVal : currentPrediction.exercise_minutes,
      heart_rate: currentPrediction.heart_rate || 72,
      water_intake: field === 'water_intake' ? updatedVal : (currentPrediction.water_intake || 2.0),
      gender: currentPrediction.gender || 'Male'
    };

    addRecord(formData);
  };

  const totalCalorieNeeds = currentPrediction.calorie_needs || 2300;

  // Toggle checklist habits instantly in background
  const handleToggleHabit = (field, targetVal, baselineVal) => {
    const currentVal = parseFloat(currentPrediction[field] || 0);
    let updatedVal;

    if (field === 'sleep_hours') {
      const isMet = currentVal >= 7 && currentVal <= 9;
      updatedVal = isMet ? baselineVal : targetVal;
    } else if (field === 'calories_consumed') {
      const isMet = currentVal <= totalCalorieNeeds && currentVal > 1000;
      updatedVal = isMet ? totalCalorieNeeds + 500 : totalCalorieNeeds - 100;
    } else {
      const isMet = currentVal >= targetVal;
      updatedVal = isMet ? baselineVal : targetVal;
    }

    const formData = {
      weight: currentPrediction.weight,
      height: currentPrediction.height,
      age: currentPrediction.age,
      sleep_hours: field === 'sleep_hours' ? updatedVal : currentPrediction.sleep_hours,
      calories_consumed: field === 'calories_consumed' ? updatedVal : currentPrediction.calories_consumed,
      exercise_minutes: field === 'exercise_minutes' ? updatedVal : currentPrediction.exercise_minutes,
      heart_rate: currentPrediction.heart_rate || 72,
      water_intake: field === 'water_intake' ? updatedVal : (currentPrediction.water_intake || 2.0),
      gender: currentPrediction.gender || 'Male'
    };

    addRecord(formData);
  };

  // Evaluate targets
  const habitItems = [
    {
      id: 'exercise_minutes',
      title: 'Workout Target',
      desc: 'Complete 30 mins moderate exercise',
      current: `${currentPrediction.exercise_minutes} mins`,
      targetLabel: '30 mins',
      done: currentPrediction.exercise_minutes >= 30,
      icon: Dumbbell,
      colorClass: 'text-blue-600 bg-blue-50 border-blue-100',
      toggle: () => handleToggleHabit('exercise_minutes', 30, 0)
    },
    {
      id: 'water_intake',
      title: 'Hydration Target',
      desc: 'Drink at least 2.5L water today',
      current: `${currentPrediction.water_intake} L`,
      targetLabel: '2.5 L',
      done: currentPrediction.water_intake >= 2.5,
      icon: Droplet,
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      toggle: () => handleToggleHabit('water_intake', 2.5, 1.5)
    },
    {
      id: 'sleep_hours',
      title: 'Sleep Target',
      desc: 'Get between 7-8h quality sleep',
      current: `${currentPrediction.sleep_hours} hrs`,
      targetLabel: '7-8 hrs',
      done: currentPrediction.sleep_hours >= 7 && currentPrediction.sleep_hours <= 9,
      icon: Moon,
      colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      toggle: () => handleToggleHabit('sleep_hours', 8.0, 5.5)
    },
    {
      id: 'calories_consumed',
      title: 'Calories Target',
      desc: `Stay within budget (${totalCalorieNeeds} kcal)`,
      current: `${currentPrediction.calories_consumed} kcal`,
      targetLabel: `< ${totalCalorieNeeds} kcal`,
      done: currentPrediction.calories_consumed <= totalCalorieNeeds && currentPrediction.calories_consumed > 1000,
      icon: Flame,
      colorClass: 'text-amber-600 bg-amber-50 border-amber-100',
      toggle: () => handleToggleHabit('calories_consumed', totalCalorieNeeds - 100, totalCalorieNeeds + 500)
    }
  ];

  const doneCount = habitItems.filter(h => h.done).length;
  const totalCount = habitItems.length;
  const progressPercent = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Panel */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 font-display tracking-tight flex items-center gap-2">
          <Sparkles className="text-primary w-8 h-8 animate-pulse" />
          <span>AI Wellness <span className="text-gradient">Planner</span></span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Simple, interactive targets customized for your biometric profile. Click checkboxes to toggle your achievements!
        </p>
      </div>

      {/* Overview Habits & Score Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Card: Health Score Ring */}
        <div className="lg:col-span-4 glass p-6 flex flex-col justify-between items-center text-center space-y-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall Rating</span>
            <h3 className="text-base font-bold text-slate-800 font-display mt-0.5">Your Health Score</h3>
          </div>

          {/* Simple Radial Dial */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="72" cy="72" r="58" 
                className="stroke-slate-100 fill-none" 
                strokeWidth="10" 
              />
              <circle 
                cx="72" cy="72" r="58" 
                className="stroke-blue-500 fill-none transition-all duration-500" 
                strokeWidth="10" 
                strokeDasharray={364}
                strokeDashoffset={364 - (364 * currentPrediction.health_risk_score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800 font-mono">{currentPrediction.health_risk_score}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Points</span>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-[10px] text-slate-500 leading-relaxed w-full">
            Toggling tasks to green directly improves your health score instantly.
          </div>
        </div>

        {/* Right Card: Main Checklist */}
        <div className="lg:col-span-8 glass p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 font-display">Daily Wellness Checklist</h3>
              <p className="text-xs text-slate-400">Click to instantly toggle task log status</p>
            </div>
            <span className="text-xs font-bold text-primary bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
              {doneCount}/{totalCount} Targets ({progressPercent}%)
            </span>
          </div>

          {/* Smooth progress bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Grid checklist items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {habitItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  onClick={item.toggle}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    item.done 
                      ? 'bg-slate-50/70 border-slate-200/70 opacity-80' 
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <button type="button" className={`shrink-0 transition-colors ${item.done ? 'text-emerald-500' : 'text-slate-300'}`}>
                    {item.done ? <CheckCircle2 className="w-5.5 h-5.5 fill-current text-white stroke-emerald-500" /> : <Circle className="w-5.5 h-5.5" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className={`text-xs font-bold font-display ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                        {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{item.current}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Three Pillars Detailed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Fitness Card */}
        <div className="glass p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
                <Dumbbell className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 font-display text-sm">Fitness & Exercise</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100 font-medium">
              {currentPrediction.recommendation_workout}
            </p>

            {/* Dos and Don'ts */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Lifestyle Guide</span>
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex gap-1.5 items-start">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Aim for 30 mins brisk walking.</span>
                </div>
                <div className="flex gap-1.5 items-start">
                  <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>Avoid sitting more than 2 hours.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Logs */}
          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleQuickLog('exercise_minutes', 15)}
              className="flex-1 text-[10px] font-bold py-2 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
            >
              +15m Workout
            </button>
            <button
              onClick={() => handleQuickLog('exercise_minutes', 30)}
              className="flex-1 text-[10px] font-bold py-2 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
            >
              +30m Workout
            </button>
          </div>
        </div>

        {/* Nutrition Card */}
        <div className="glass p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
                <Utensils className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 font-display text-sm">Diet & Hydration</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100 font-medium">
              {currentPrediction.recommendation_diet}
            </p>

            {/* Dos and Don'ts */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Lifestyle Guide</span>
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex gap-1.5 items-start">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Choose lean proteins & greens.</span>
                </div>
                <div className="flex gap-1.5 items-start">
                  <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>Limit sugary drinks & sodas.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Logs */}
          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleQuickLog('water_intake', 0.25)}
              className="flex-1 text-[10px] font-bold py-2 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors"
            >
              +250ml Water
            </button>
            <button
              onClick={() => handleQuickLog('water_intake', 0.50)}
              className="flex-1 text-[10px] font-bold py-2 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors"
            >
              +500ml Water
            </button>
          </div>
        </div>

        {/* Sleep Card */}
        <div className="glass p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl">
                <Moon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 font-display text-sm">Sleep & Recovery</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100 font-medium">
              {currentPrediction.recommendation_sleep}
            </p>

            {/* Dos and Don'ts */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Lifestyle Guide</span>
              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex gap-1.5 items-start">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Sleep in dark, cool bedroom.</span>
                </div>
                <div className="flex gap-1.5 items-start">
                  <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>No blue screens 1 hr before bed.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Logs */}
          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <button
              onClick={() => handleQuickLog('sleep_hours', 1)}
              className="flex-1 text-[10px] font-bold py-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
            >
              +1h Sleep
            </button>
            <button
              onClick={() => handleToggleHabit('sleep_hours', 8.0, 5.5)}
              className="flex-1 text-[10px] font-bold py-2 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors"
            >
              Log 8h Sleep
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
