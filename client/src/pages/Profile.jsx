import React from 'react';
import { User } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';

export default function Profile() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Info */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 font-display tracking-tight flex items-center gap-2">
          <User className="text-primary w-8 h-8" />
          <span>My Profile & <span className="text-gradient">Targets</span></span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your biometrics defaults, age, height, and custom daily health goals.
        </p>
      </div>

      {/* Profile Presentation */}
      <ProfileCard />
    </div>
  );
}
