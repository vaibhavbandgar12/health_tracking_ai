import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Ruler, Scale, Flame, Droplet, Moon, Edit3, AlertCircle } from 'lucide-react';
import Modal from './Modal';

export default function ProfileCard() {
  const { user, updateProfile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: user?.age || 26,
    height: user?.height || 178,
    weight: user?.weight || 71.2,
    gender: user?.gender || 'Male',
    targetCalories: user?.targetCalories || 2300,
    targetWater: user?.targetWater || 3.0,
    targetSleep: user?.targetSleep || 8
  });

  if (!user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: ['age', 'height', 'weight', 'targetCalories', 'targetWater', 'targetSleep'].includes(name)
        ? Number(value)
        : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUpdating(true);
    try {
      await updateProfile(formData);
      setModalOpen(false);
    } catch (err) {
      const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to update profile. Please try again.';
      setError(errMsg);
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <div className="glass p-6 md:p-8 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/5 rounded-full filter blur-3xl" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center font-bold text-white text-3xl shadow-md shrink-0">
            {user.name.charAt(0)}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 font-display mb-1">{user.name}</h2>
                <p className="text-slate-500 flex items-center justify-center sm:justify-start gap-2 text-sm">
                  <Mail className="w-4 h-4 text-primary" /> {user.email}
                </p>
              </div>
              <button 
                onClick={() => {
                  setFormData({
                    name: user.name,
                    email: user.email,
                    age: user.age,
                    height: user.height,
                    weight: user.weight,
                    gender: user.gender,
                    targetCalories: user.targetCalories || 2300,
                    targetWater: user.targetWater || 3.0,
                    targetSleep: user.targetSleep || 8
                  });
                  setModalOpen(true);
                }}
                className="btn btn-outline py-2 px-4 text-xs font-semibold flex items-center gap-1.5 self-center sm:self-start"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>

            {/* Demographics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center sm:text-left">
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <Calendar className="w-3 h-3 text-primary" /> Age
                </span>
                <p className="text-lg font-bold text-slate-800 mt-1">{user.age} yrs</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center sm:text-left">
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <Ruler className="w-3 h-3 text-primary" /> Height
                </span>
                <p className="text-lg font-bold text-slate-800 mt-1">{user.height} cm</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center sm:text-left">
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <Scale className="w-3 h-3 text-primary" /> Weight
                </span>
                <p className="text-lg font-bold text-slate-800 mt-1">{user.weight} kg</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center sm:text-left">
                <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider flex items-center justify-center sm:justify-start gap-1">
                  <User className="w-3 h-3 text-primary" /> Gender
                </span>
                <p className="text-lg font-bold text-slate-800 mt-1">{user.gender}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Target Metrics Cards */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 font-display">Daily Goals & Targets</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calorie Goal */}
          <div className="glass p-5 relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-amber-500/10 group-hover:text-amber-500/20 transition-colors">
              <Flame className="w-12 h-12 stroke-[1.5]" />
            </div>
            <span className="text-xs uppercase font-bold text-amber-600 tracking-wider">Nutrition Target</span>
            <h4 className="text-2xl font-black text-slate-800 mt-2 font-display">
              {user.targetCalories} <span className="text-sm font-normal text-slate-400">kcal/day</span>
            </h4>
            <p className="text-xs text-slate-500 mt-2">Adjusted daily energy boundaries to maintain steady metabolic activity.</p>
          </div>

          {/* Water Goal */}
          <div className="glass p-5 relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-sky-500/10 group-hover:text-sky-500/20 transition-colors">
              <Droplet className="w-12 h-12 stroke-[1.5]" />
            </div>
            <span className="text-xs uppercase font-bold text-sky-600 tracking-wider">Hydration Target</span>
            <h4 className="text-2xl font-black text-slate-800 mt-2 font-display">
              {user.targetWater} <span className="text-sm font-normal text-slate-400">Liters/day</span>
            </h4>
            <p className="text-xs text-slate-500 mt-2">Essential liquid volume logs required to support tissue and core cell recovery.</p>
          </div>

          {/* Sleep Goal */}
          <div className="glass p-5 relative overflow-hidden group">
            <div className="absolute top-4 right-4 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
              <Moon className="w-12 h-12 stroke-[1.5]" />
            </div>
            <span className="text-xs uppercase font-bold text-indigo-600 tracking-wider">Sleep Target</span>
            <h4 className="text-2xl font-black text-slate-800 mt-2 font-display">
              {user.targetSleep} <span className="text-sm font-normal text-slate-400">hours/night</span>
            </h4>
            <p className="text-xs text-slate-500 mt-2">Recommended rest window to trigger cognitive consolidation & muscle recovery.</p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal Dialog */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setError(''); }} title="Modify Profile Settings">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div>
            <label>Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label>Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Age</label>
              <input type="number" name="age" required value={formData.age} onChange={handleChange} />
            </div>
            <div>
              <label>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Height (cm)</label>
              <input type="number" name="height" required value={formData.height} onChange={handleChange} />
            </div>
            <div>
              <label>Weight (kg)</label>
              <input type="number" step="0.1" name="weight" required value={formData.weight} onChange={handleChange} />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6">
            <h4 className="text-sm font-semibold text-slate-800 mb-3">Health Targets Configuration</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] truncate">Calorie (kcal)</label>
                <input type="number" name="targetCalories" required value={formData.targetCalories} onChange={handleChange} />
              </div>
              <div>
                <label className="text-[10px] truncate">Water (L)</label>
                <input type="number" step="0.1" name="targetWater" required value={formData.targetWater} onChange={handleChange} />
              </div>
              <div>
                <label className="text-[10px] truncate">Sleep (hours)</label>
                <input type="number" step="0.5" name="targetSleep" required value={formData.targetSleep} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 mt-6">
            <button type="button" onClick={() => { setModalOpen(false); setError(''); }} className="btn btn-outline px-4 py-2 text-sm" disabled={updating}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary px-5 py-2 text-sm" disabled={updating}>
              {updating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
