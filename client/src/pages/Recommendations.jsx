import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Dumbbell, Utensils, Moon, Activity, Flame, ShieldAlert, Heart,
  CheckCircle2, Circle, AlertCircle, Play, Pause, RotateCcw, Plus, Droplet,
  Compass, HelpCircle, Check, Info, ChevronRight, X
} from 'lucide-react';

export default function Recommendations() {
  const { currentPrediction, addRecord, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Workout Timer States
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [demoSpeed, setDemoSpeed] = useState(false);

  // Sleep Adjuster Temp State
  const [tempSleepHours, setTempSleepHours] = useState(7.0);

  // Bedtime Habit checklist states (Frontend only state)
  const [bedtimeHabits, setBedtimeHabits] = useState({
    noScreens: false,
    coolRoom: false,
    meditation: false,
    noLateCaffeine: false
  });

  // Sync bedtime habits with default sleep deficit if prediction loads
  useEffect(() => {
    if (currentPrediction) {
      setTempSleepHours(currentPrediction.sleep_hours || 7.0);
    }
  }, [currentPrediction?._id]);

  // Workout Timer Interval
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + (demoSpeed ? 60 : 1));
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, demoSpeed]);

  if (!currentPrediction) {
    return (
      <div className="glass p-8 text-center text-slate-400 max-w-xl mx-auto mt-12">
        <Sparkles className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">No AI Advice Found</h3>
        <p className="text-sm">Log your vitals on the dashboard to generate your personalized wellness directives.</p>
      </div>
    );
  }

  // Quick Action updates logic
  const handleQuickLog = (field, increment) => {
    const currentVal = parseFloat(currentPrediction[field] || 0);
    let updatedVal = parseFloat((currentVal + increment).toFixed(2));
    
    // Ensure we do not log negative values
    if (updatedVal < 0) updatedVal = 0;

    const formData = {
      weight: currentPrediction.weight,
      height: currentPrediction.height,
      age: currentPrediction.age,
      sleep_hours: field === 'sleep_hours' ? updatedVal : currentPrediction.sleep_hours,
      calories_consumed: field === 'calories_consumed' ? updatedVal : currentPrediction.calories_consumed,
      exercise_minutes: field === 'exercise_minutes' ? updatedVal : currentPrediction.exercise_minutes,
      heart_rate: field === 'heart_rate' ? updatedVal : (currentPrediction.heart_rate || 72),
      water_intake: field === 'water_intake' ? updatedVal : (currentPrediction.water_intake || 2.0),
      gender: currentPrediction.gender || 'Male'
    };

    addRecord(formData);
  };

  // Heart Rate calculations
  const age = currentPrediction.age || 26;
  const maxHR = 220 - age;
  const fatBurnMin = Math.round(maxHR * 0.6);
  const fatBurnMax = Math.round(maxHR * 0.7);
  const cardioMin = Math.round(maxHR * 0.7);
  const cardioMax = Math.round(maxHR * 0.85);

  // Macro Nutrient Calculations
  const totalCalorieNeeds = currentPrediction.calorie_needs || 2300;
  const proteinGrams = Math.round((totalCalorieNeeds * 0.25) / 4);
  const carbGrams = Math.round((totalCalorieNeeds * 0.50) / 4);
  const fatGrams = Math.round((totalCalorieNeeds * 0.25) / 9);

  // Daily Habits Targets Evaluation
  const targets = {
    exercise: {
      title: 'Complete 30 mins Workout',
      current: `${currentPrediction.exercise_minutes} mins`,
      target: '30 mins',
      done: currentPrediction.exercise_minutes >= 30,
      color: 'blue',
      quickAdd: () => handleQuickLog('exercise_minutes', 10),
      label: '+10m'
    },
    hydration: {
      title: 'Drink 2.5L Water Intake',
      current: `${currentPrediction.water_intake}L`,
      target: '2.5L',
      done: currentPrediction.water_intake >= 2.5,
      color: 'emerald',
      quickAdd: () => handleQuickLog('water_intake', 0.25),
      label: '+250ml'
    },
    sleep: {
      title: 'Get 7-8h Sleep',
      current: `${currentPrediction.sleep_hours}h`,
      target: '7-8h',
      done: currentPrediction.sleep_hours >= 7 && currentPrediction.sleep_hours <= 9,
      color: 'indigo',
      quickAdd: () => handleQuickLog('sleep_hours', 0.5),
      label: '+30m'
    },
    calories: {
      title: 'Stay Within Calories Budget',
      current: `${currentPrediction.calories_consumed} kcal`,
      target: `${totalCalorieNeeds} kcal`,
      done: currentPrediction.calories_consumed <= totalCalorieNeeds && currentPrediction.calories_consumed > 1000,
      color: 'amber',
      quickAdd: () => handleQuickLog('calories_consumed', 100),
      label: '+100 kcal'
    }
  };

  const checklistItems = Object.values(targets);
  const doneCount = checklistItems.filter(t => t.done).length;
  const totalCount = checklistItems.length;
  const progressPercent = Math.round((doneCount / totalCount) * 100);

  // Format Stopwatch seconds
  const formatTimerTime = () => {
    const mins = Math.floor(timerSeconds / 60);
    const secs = timerSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Water Glass visual scale percentage
  const waterProgress = Math.min(100, Math.round(((currentPrediction.water_intake || 0) / 2.8) * 100));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 font-display tracking-tight flex items-center gap-2">
            <Sparkles className="text-primary w-8 h-8 animate-pulse" />
            <span>AI Health <span className="text-gradient">Action Planner</span></span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Dynamic routine recommendations derived from your latest biometric log on {new Date(currentPrediction.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            Health Score: <span className="text-slate-800 font-mono font-extrabold">{currentPrediction.health_risk_score}/100</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Navigation Sidebar & Quick Vitals Status */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass p-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Overview & Daily Planner</span>
            </button>
            <button
              onClick={() => setActiveTab('fitness')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'fitness'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Dumbbell className="w-4 h-4" />
              <span>Fitness & Workout</span>
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'nutrition'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Nutrition & Water</span>
            </button>
            <button
              onClick={() => setActiveTab('sleep')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sleep'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Sleep & Recovery</span>
            </button>
          </div>

          {/* Quick Metrics Reference Card */}
          <div className="glass p-5 space-y-4">
            <h4 className="text-xs uppercase font-extrabold text-slate-800 tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-primary" /> Metrics Checklist
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-500">Sleep Logged</span>
                <span className="font-semibold text-slate-700">{currentPrediction.sleep_hours} hrs</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-500">Hydration Logged</span>
                <span className="font-semibold text-slate-700">{currentPrediction.water_intake} L</span>
              </div>
              <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-2">
                <span className="text-slate-500">Active Workout</span>
                <span className="font-semibold text-slate-700">{currentPrediction.exercise_minutes} mins</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Calories Intake</span>
                <span className="font-semibold text-slate-700">{currentPrediction.calories_consumed} kcal</span>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-[10px] text-slate-500 leading-normal">
              Quick logs on this page instantly recalculate your wellness indicators.
            </div>
          </div>
        </div>

        {/* Right Side: Main Detail Panels */}
        <div className="lg:col-span-9 space-y-6">

          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* healthAI Mascot block */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-500/10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full filter blur-xl transform translate-x-8 -translate-y-8" />
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl border border-white/25">
                    <Sparkles className="w-8 h-8 text-amber-300 animate-pulse fill-amber-300/20" />
                  </div>
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-blue-200 tracking-wider">AI Medical Companion</span>
                    <h2 className="text-lg font-bold font-display">Greetings, {user?.name || 'Vaibhav'}!</h2>
                    <p className="text-xs text-blue-100 leading-relaxed font-medium">
                      Based on your latest biometrics check-in, your heart and metabolic risk index suggests checking off today's habits. Follow the guides below to improve your score.
                    </p>
                  </div>
                </div>
              </div>

              {/* Central Habits Checklist */}
              <div className="glass p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 font-display text-base">Your Daily Habit Tracker</h3>
                    <p className="text-xs text-slate-400">Log metrics or use quick actions to check off items</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Completion Rate</span>
                    <span className="text-sm font-bold text-primary">{doneCount} of {totalCount} Targets Met ({progressPercent}%)</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-indigo-500 transition-all duration-500" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Checklist Rows */}
                <div className="space-y-3 pt-2">
                  {checklistItems.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        item.done 
                          ? 'bg-slate-50/70 border-slate-200/70 opacity-80' 
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`transition-colors ${item.done ? 'text-emerald-500' : 'text-slate-300'}`}>
                          {item.done ? (
                            <CheckCircle2 className="w-5.5 h-5.5 fill-current text-white stroke-emerald-500" />
                          ) : (
                            <Circle className="w-5.5 h-5.5" />
                          )}
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold font-display ${item.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Logged: <span className="font-semibold text-slate-600">{item.current}</span> / Target: {item.target}
                          </p>
                        </div>
                      </div>

                      {/* Inline quick-log shortcut */}
                      {!item.done && (
                        <button
                          onClick={item.quickAdd}
                          className="flex items-center gap-1 text-[10px] font-extrabold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          <span>{item.label}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vitals Diagnostics & Recommendations summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Fitness Quick summary */}
                <div className="glass p-5 space-y-3 hover:border-slate-300 transition-all cursor-pointer" onClick={() => setActiveTab('fitness')}>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 font-display">Exercise Advice</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal line-clamp-3 font-medium">
                    {currentPrediction.recommendation_workout}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 mt-2">
                    <span>Manage Fitness Plan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Nutrition Quick summary */}
                <div className="glass p-5 space-y-3 hover:border-slate-300 transition-all cursor-pointer" onClick={() => setActiveTab('nutrition')}>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 font-display">Diet & Hydration</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal line-clamp-3 font-medium">
                    {currentPrediction.recommendation_diet}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 mt-2">
                    <span>Manage Diet Plan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Sleep Quick summary */}
                <div className="glass p-5 space-y-3 hover:border-slate-300 transition-all cursor-pointer" onClick={() => setActiveTab('sleep')}>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl">
                      <Moon className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 font-display">Sleep & Recovery</h4>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal line-clamp-3 font-medium">
                    {currentPrediction.recommendation_sleep}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 mt-2">
                    <span>Manage Sleep Plan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 2. FITNESS & CARDIO TAB */}
          {activeTab === 'fitness' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="glass p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Exercise Diagnostics</span>
                    <h3 className="text-base font-bold text-slate-800 font-display">Fitness Plan & Active Targets</h3>
                  </div>
                </div>

                {/* Recommendation bubble */}
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-xs text-slate-600 leading-relaxed font-medium">
                  {currentPrediction.recommendation_workout}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Active Workout Timer widget */}
                  <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 font-display">Active Workout Timer</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">
                        Stopwatch Widget
                      </span>
                    </div>

                    <div className="text-center py-4 space-y-1">
                      <div className="text-4xl font-extrabold text-slate-800 font-mono tracking-wider">
                        {formatTimerTime()}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {timerActive ? 'Workout session running...' : 'Session paused'}
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={toggleTimer}
                        className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl text-white shadow-sm transition-all ${
                          timerActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        <span>{timerActive ? 'Pause' : 'Start'}</span>
                      </button>
                      <button
                        onClick={resetTimer}
                        className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset</span>
                      </button>
                    </div>

                    {/* Quick Session Adjustments */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/50">
                      <button
                        onClick={() => handleQuickLog('exercise_minutes', 10)}
                        className="text-[10px] font-bold py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg"
                      >
                        +10 Mins Vitals
                      </button>
                      <button
                        onClick={() => handleQuickLog('exercise_minutes', 30)}
                        className="text-[10px] font-bold py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg"
                      >
                        +30 Mins Vitals
                      </button>
                    </div>

                    {/* Demo speed toggle */}
                    <div className="flex items-center gap-2 pt-2">
                      <input 
                        type="checkbox" 
                        id="demoSpeed" 
                        checked={demoSpeed} 
                        onChange={(e) => setDemoSpeed(e.target.checked)}
                        className="rounded border-slate-300 text-blue-500 focus:ring-blue-500" 
                      />
                      <label htmlFor="demoSpeed" className="text-[10px] text-slate-500 font-medium select-none cursor-pointer">
                        Run at Demo Speed (1 sec real = 1 min exercise)
                      </label>
                    </div>

                    {/* Log Session Button */}
                    {timerSeconds > 0 && (
                      <button
                        onClick={() => {
                          const elapsedMins = Math.max(1, Math.round(timerSeconds / 60));
                          handleQuickLog('exercise_minutes', elapsedMins);
                          resetTimer();
                          alert(`Successfully logged ${elapsedMins} minute(s) of exercise!`);
                        }}
                        className="w-full text-xs font-bold bg-blue-600 text-white py-2 rounded-xl shadow-md shadow-blue-600/10 hover:bg-blue-700 transition-colors"
                      >
                        Log Timer Session ({Math.max(1, Math.round(timerSeconds / 60))}m) to Dashboard
                      </button>
                    )}
                  </div>

                  {/* Heart Rate Zones widget */}
                  <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800 font-display">Target HR Zone</span>
                        <Heart className="w-4 h-4 text-rose-500 animate-pulse fill-rose-500/20" />
                      </div>
                      <div className="text-xs text-slate-500 leading-normal">
                        Based on age {age}, your maximum cardiovascular heart rate is <span className="font-bold text-slate-700">{maxHR} bpm</span>.
                      </div>
                    </div>

                    {/* Zone indicators */}
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-600">Fat Burn Zone (60-70%)</span>
                        <span className="font-bold text-emerald-600 font-mono">{fatBurnMin} - {fatBurnMax} bpm</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-600">Cardio Zone (70-85%)</span>
                        <span className="font-bold text-primary font-mono">{cardioMin} - {cardioMax} bpm</span>
                      </div>
                    </div>

                    {/* Heart Rate Simulator Slider */}
                    <div className="space-y-2 border-t border-slate-200/50 pt-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Current Logged HR:</span>
                        <span className="font-extrabold text-slate-800 font-mono">{currentPrediction.heart_rate || 72} bpm</span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="180" 
                        value={currentPrediction.heart_rate || 72} 
                        onChange={(e) => handleQuickLog('heart_rate', parseInt(e.target.value) - (currentPrediction.heart_rate || 72))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="text-[9px] text-slate-400 text-center font-medium">
                        Drag slider to simulate heart rate changes under stress.
                      </div>
                    </div>
                  </div>

                </div>

                {/* Dos & Don'ts */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Lifestyle Recommendations Guidelines</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="p-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100"><Check className="w-3 h-3" /></span>
                        <span>Recommended Actions (Do)</span>
                      </div>
                      <ul className="text-xs text-slate-500 space-y-2 list-none pl-0">
                        <li className="flex gap-1.5 items-start">
                          <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Incorporate at least 30 mins of moderate aerobic activity (e.g. brisk walking, cycling).</span>
                        </li>
                        <li className="flex gap-1.5 items-start">
                          <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Perform dynamic warm-ups for 5-10 minutes before training.</span>
                        </li>
                        <li className="flex gap-1.5 items-start">
                          <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Monitor heart rate and stay within your target zones.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="p-1 rounded bg-rose-50 text-rose-600 border border-rose-100"><X className="w-3 h-3" /></span>
                        <span>Practices to Avoid (Don't)</span>
                      </div>
                      <ul className="text-xs text-slate-500 space-y-2 list-none pl-0">
                        <li className="flex gap-1.5 items-start">
                          <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Avoid prolonged sitting; aim to stand or stretch every hour.</span>
                        </li>
                        <li className="flex gap-1.5 items-start">
                          <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Do not train through persistent sharp joint pain.</span>
                        </li>
                        <li className="flex gap-1.5 items-start">
                          <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Avoid high-intensity exercises late in the evening.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 3. NUTRITION & HYDRATION TAB */}
          {activeTab === 'nutrition' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="glass p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <Utensils className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nutrition & Hydration</span>
                    <h3 className="text-base font-bold text-slate-800 font-display">Dietary Intake & Guidelines</h3>
                  </div>
                </div>

                {/* Recommendation bubble */}
                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl text-xs text-slate-600 leading-relaxed font-medium">
                  {currentPrediction.recommendation_diet}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Interactive Water Cup Logger */}
                  <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800 font-display">Water Intake Tracker</span>
                        <Droplet className="w-4 h-4 text-blue-500 animate-bounce" />
                      </div>
                      <p className="text-[10px] text-slate-400">Keep hydration optimal for kidney function & metabolism</p>
                    </div>

                    {/* Water Cup Visual Graphic */}
                    <div className="flex justify-center py-3">
                      <div className="w-24 h-32 border-4 border-slate-300 rounded-b-2xl rounded-t-lg relative overflow-hidden bg-slate-100 shadow-inner flex items-end">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 transition-all duration-700 ease-out relative"
                          style={{ height: `${waterProgress}%` }}
                        >
                          {/* Soft white wave animation lines */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-white/20 animate-pulse" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-xs text-slate-700 bg-white/10 select-none">
                          {waterProgress}%
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-xs font-bold text-slate-700">{currentPrediction.water_intake || 0.0}L</span>
                      <span className="text-xs text-slate-400"> / 2.8L Daily Target</span>
                    </div>

                    {/* Quick Water Log Buttons */}
                    <div className="space-y-2 border-t border-slate-200/50 pt-3">
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleQuickLog('water_intake', 0.25)}
                          className="text-[10px] font-extrabold bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 border border-blue-100 rounded-lg transition-colors"
                        >
                          +250 ml
                        </button>
                        <button
                          onClick={() => handleQuickLog('water_intake', 0.50)}
                          className="text-[10px] font-extrabold bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 border border-blue-100 rounded-lg transition-colors"
                        >
                          +500 ml
                        </button>
                        <button
                          onClick={() => handleQuickLog('water_intake', 1.00)}
                          className="text-[10px] font-extrabold bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 border border-blue-100 rounded-lg transition-colors"
                        >
                          +1.0 Liter
                        </button>
                      </div>
                      <button
                        onClick={() => handleQuickLog('water_intake', -((currentPrediction.water_intake || 2.0)) + 2.0)}
                        className="w-full text-[9px] font-bold text-slate-400 hover:text-slate-600 transition-colors pt-1"
                      >
                        Reset Daily Log (Default to 2.0L)
                      </button>
                    </div>
                  </div>

                  {/* Calories consumed quick logger & Macro Splits */}
                  <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-800 font-display">Daily Calorie Intake</span>
                        <Flame className="w-4 h-4 text-amber-500" />
                      </div>
                      <p className="text-[10px] text-slate-400">Calories consumed against budget</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Logged</span>
                        <span className="text-slate-800">{currentPrediction.calories_consumed} / {totalCalorieNeeds} kcal</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 transition-all duration-500" 
                          style={{ width: `${Math.min(100, Math.round((currentPrediction.calories_consumed / totalCalorieNeeds) * 100))}%` }}
                        />
                      </div>
                    </div>

                    {/* Quick calorie log */}
                    <div className="grid grid-cols-2 gap-2 border-t border-slate-200/50 pt-3">
                      <button
                        onClick={() => handleQuickLog('calories_consumed', 100)}
                        className="text-[10px] font-bold py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg"
                      >
                        +100 kcal Snack
                      </button>
                      <button
                        onClick={() => handleQuickLog('calories_consumed', 300)}
                        className="text-[10px] font-bold py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-lg"
                      >
                        +300 kcal Meal
                      </button>
                    </div>

                    {/* Macro splits layout */}
                    <div className="space-y-2 border-t border-slate-200/50 pt-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Target Macro Ratios</span>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="bg-white p-2 rounded border border-slate-100">
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">Protein (25%)</span>
                          <span className="font-bold text-slate-700 font-mono">{proteinGrams}g</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-100">
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">Carbs (50%)</span>
                          <span className="font-bold text-slate-700 font-mono">{carbGrams}g</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-100">
                          <span className="text-[9px] text-slate-400 uppercase font-bold block">Fat (25%)</span>
                          <span className="font-bold text-slate-700 font-mono">{fatGrams}g</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Dos & Don'ts */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Lifestyle Recommendations Guidelines</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="p-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100"><Check className="w-3 h-3" /></span>
                        <span>Recommended Actions (Do)</span>
                      </div>
                      <ul className="text-xs text-slate-500 space-y-2 list-none pl-0">
                        <li className="flex gap-1.5 items-start">
                          <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Prioritize lean proteins, leafy vegetables, and complex carbohydrates.</span>
                        </li>
                        <li className="flex gap-1.5 items-start">
                          <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Aim to consume at least 2.5 to 3.0 liters of pure water daily.</span>
                        </li>
                        <li className="flex gap-1.5 items-start">
                          <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Keep a consistent window of eating (e.g. matching circadian patterns).</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="p-1 rounded bg-rose-50 text-rose-600 border border-rose-100"><X className="w-3 h-3" /></span>
                        <span>Practices to Avoid (Don't)</span>
                      </div>
                      <ul className="text-xs text-slate-500 space-y-2 list-none pl-0">
                        <li className="flex gap-1.5 items-start">
                          <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Minimize refined sugar, processed meats, and trans fats.</span>
                        </li>
                        <li className="flex gap-1.5 items-start">
                          <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Avoid sugary fruit juices and soft drinks that spike blood sugar.</span>
                        </li>
                        <li className="flex gap-1.5 items-start">
                          <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Do not consume large, heavy meals within 3 hours of sleeping.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 4. SLEEP & RECOVERY TAB */}
          {activeTab === 'sleep' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              <div className="glass p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                    <Moon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sleep Optimizations</span>
                    <h3 className="text-base font-bold text-slate-800 font-display">Circadian Rhythm & Sleep Quality</h3>
                  </div>
                </div>

                {/* Recommendation bubble */}
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl text-xs text-slate-600 leading-relaxed font-medium">
                  {currentPrediction.recommendation_sleep}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Interactive sleep adjuster */}
                  <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 space-y-4 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 font-display block">Sleep Hours Logger</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Simulate sleep logs to recalculate recovery indicators</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500">Sleep Hours Selected:</span>
                        <span className="font-extrabold text-indigo-600 font-mono text-sm">{tempSleepHours} hours</span>
                      </div>
                      <input 
                        type="range" 
                        min="4" 
                        max="10" 
                        step="0.5" 
                        value={tempSleepHours} 
                        onChange={(e) => setTempSleepHours(parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                      <div className="flex justify-between text-[9px] text-slate-400 font-medium font-mono">
                        <span>4h (Severe Deficit)</span>
                        <span>7.5h (Optimal)</span>
                        <span>10h (Hypersomnia)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleQuickLog('sleep_hours', tempSleepHours - currentPrediction.sleep_hours);
                        alert(`Successfully logged ${tempSleepHours} sleep hours. Vitals refreshed!`);
                      }}
                      className="w-full text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl shadow-md shadow-indigo-600/10 transition-colors"
                    >
                      Save Sleep Log & Recalculate
                    </button>
                  </div>

                  {/* Sleep hygiene habits checkoff */}
                  <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 space-y-4">
                    <div>
                      <span className="text-xs font-bold text-slate-800 font-display block">Bedtime Routine Checklist</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Practice positive habits for slow-wave REM sleep</p>
                    </div>

                    <div className="space-y-2 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={bedtimeHabits.noScreens} 
                          onChange={(e) => setBedtimeHabits({ ...bedtimeHabits, noScreens: e.target.checked })}
                          className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 w-4 h-4" 
                        />
                        <span className={`${bedtimeHabits.noScreens ? 'text-slate-400 line-through' : 'text-slate-600'}`}>No blue screens 1 hour before sleep</span>
                      </label>
                      
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={bedtimeHabits.coolRoom} 
                          onChange={(e) => setBedtimeHabits({ ...bedtimeHabits, coolRoom: e.target.checked })}
                          className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 w-4 h-4" 
                        />
                        <span className={`${bedtimeHabits.coolRoom ? 'text-slate-400 line-through' : 'text-slate-600'}`}>Cool ambient room temp (18-20°C)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={bedtimeHabits.meditation} 
                          onChange={(e) => setBedtimeHabits({ ...bedtimeHabits, meditation: e.target.checked })}
                          className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 w-4 h-4" 
                        />
                        <span className={`${bedtimeHabits.meditation ? 'text-slate-400 line-through' : 'text-slate-600'}`}>10 minutes reading / box breathing</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input 
                          type="checkbox" 
                          checked={bedtimeHabits.noLateCaffeine} 
                          onChange={(e) => setBedtimeHabits({ ...bedtimeHabits, noLateCaffeine: e.target.checked })}
                          className="rounded border-slate-300 text-indigo-500 focus:ring-indigo-500 w-4 h-4" 
                        />
                        <span className={`${bedtimeHabits.noLateCaffeine ? 'text-slate-400 line-through' : 'text-slate-600'}`}>No caffeine after 2:00 PM</span>
                      </label>
                    </div>
                  </div>

                </div>

                {/* Dos & Don'ts */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-wider">Lifestyle Recommendations Guidelines</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="p-1 rounded bg-emerald-50 text-emerald-600 border border-emerald-100"><Check className="w-3 h-3" /></span>
                        <span>Recommended Actions (Do)</span>
                      </div>
                      <ul className="text-xs text-slate-500 space-y-2 list-none pl-0">
                        <li className="flex gap-1.5 items-start">
                          <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Keep a regular sleep schedule, waking up at the same time daily.</span>
                        </li>
                        <li className="flex gap-1.5 items-start">
                          <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Optimize sleep hygiene: keep the room dark, silent, and cool (18-20°C).</span>
                        </li>
                        <li className="flex gap-1.5 items-start">
                          <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Expose your eyes to sunlight within 30 minutes of waking up.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2.5">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <span className="p-1 rounded bg-rose-50 text-rose-600 border border-rose-100"><X className="w-3 h-3" /></span>
                        <span>Practices to Avoid (Don't)</span>
                      </div>
                      <ul className="text-xs text-slate-500 space-y-2 list-none pl-0">
                        <li className="flex gap-1.5 items-start">
                          <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Limit caffeine consumption after 2:00 PM.</span>
                        </li>
                        <li className="flex gap-1.5 items-start">
                          <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Avoid blue light from phone or laptop screens 1 hour before bed.</span>
                        </li>
                        <li className="flex gap-1.5 items-start">
                          <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                          <span>Avoid heavy physical workouts or alcohol within 3 hours of sleep.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
