import React from 'react';
import { Activity, Heart, Flame, Scale } from 'lucide-react';

export default function MetricsCards({ prediction }) {
  if (!prediction) return null;

  return (
    <div className="metrics-grid">
      <div className="glass metric-card">
        <Scale className="metric-icon" size={24} />
        <div className="metric-label">BMI Category</div>
        <div className="metric-value">{prediction.bmi_category}</div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Score: {prediction.bmi}</div>
      </div>
      
      <div className="glass metric-card">
        <Heart className="metric-icon" size={24} style={{ color: '#ef4444' }} />
        <div className="metric-label">Health Risk Score</div>
        <div className="metric-value">{prediction.health_risk_score} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>/100</span></div>
      </div>
      
      <div className="glass metric-card">
        <Flame className="metric-icon" size={24} style={{ color: '#f59e0b' }} />
        <div className="metric-label">Calorie Needs</div>
        <div className="metric-value">{prediction.calorie_needs} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>kcal</span></div>
      </div>
    </div>
  );
}
