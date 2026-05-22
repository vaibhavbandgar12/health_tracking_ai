import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Scale, Ruler, Clock, Flame, Heart, Activity } from 'lucide-react';

export default function HealthInputForm({ onSubmit, loading, lastRecord }) {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    sleep_hours: '',
    calories_consumed: '',
    exercise_minutes: '',
    heart_rate: '',
    water_intake: '',
    gender: 'Male'
  });

  // Prefill the form with the last log details if they exist
  useEffect(() => {
    if (lastRecord) {
      setFormData({
        weight: lastRecord.weight || '',
        height: lastRecord.height || '',
        age: lastRecord.age || '',
        sleep_hours: lastRecord.sleep_hours || '',
        calories_consumed: lastRecord.calories_consumed || '',
        exercise_minutes: lastRecord.exercise_minutes || '',
        heart_rate: lastRecord.heart_rate || '',
        water_intake: lastRecord.water_intake || '',
        gender: lastRecord.gender || 'Male'
      });
    }
  }, [lastRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (Number(formData.weight) <= 0 || Number(formData.height) <= 0 || Number(formData.age) <= 0) {
      alert('Weight, height, and age must be positive values.');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="glass p-5 space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Activity className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-slate-800 font-display">Log Daily Metrics</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Weight */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              <Scale className="w-3.5 h-3.5 text-primary" /> Weight (kg)
            </label>
            <input 
              type="number" 
              step="0.1" 
              name="weight" 
              required 
              value={formData.weight} 
              onChange={handleChange} 
              placeholder="70.5"
            />
          </div>

          {/* Height */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              <Ruler className="w-3.5 h-3.5 text-primary" /> Height (cm)
            </label>
            <input 
              type="number" 
              step="0.1" 
              name="height" 
              required 
              value={formData.height} 
              onChange={handleChange} 
              placeholder="175"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Age */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-primary" /> Age
            </label>
            <input 
              type="number" 
              name="age" 
              required 
              value={formData.age} 
              onChange={handleChange} 
              placeholder="25"
            />
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              <Activity className="w-3.5 h-3.5 text-primary" /> Gender
            </label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Sleep Hours */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-indigo-500" /> Sleep (hrs)
            </label>
            <input 
              type="number" 
              step="0.1" 
              name="sleep_hours" 
              required 
              value={formData.sleep_hours} 
              onChange={handleChange} 
              placeholder="7.5"
            />
          </div>

          {/* Water Intake */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              <Activity className="w-3.5 h-3.5 text-sky-500" /> Water (Liters)
            </label>
            <input 
              type="number" 
              step="0.1" 
              name="water_intake" 
              required 
              value={formData.water_intake} 
              onChange={handleChange} 
              placeholder="2.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Calories consumed */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Calories (kcal)
            </label>
            <input 
              type="number" 
              name="calories_consumed" 
              required 
              value={formData.calories_consumed} 
              onChange={handleChange} 
              placeholder="2200"
            />
          </div>

          {/* Exercise Minutes */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs text-slate-500">
              <Activity className="w-3.5 h-3.5 text-emerald-500" /> Exercise (min)
            </label>
            <input 
              type="number" 
              name="exercise_minutes" 
              required 
              value={formData.exercise_minutes} 
              onChange={handleChange} 
              placeholder="45"
            />
          </div>
        </div>

        {/* Heart Rate */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs text-slate-500">
            <Heart className="w-3.5 h-3.5 text-rose-500" /> Resting Heart Rate (bpm)
          </label>
          <input 
            type="number" 
            name="heart_rate" 
            value={formData.heart_rate} 
            onChange={handleChange} 
            placeholder="72 (Optional)"
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-primary w-full py-3 flex items-center justify-center gap-2 group mt-2" 
          disabled={loading}
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>{loading ? 'AI Diagnosing...' : 'Calculate AI Vitals'}</span>
        </button>
      </form>
    </div>
  );
}
