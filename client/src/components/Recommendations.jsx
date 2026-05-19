import React from 'react';
import { Dumbbell, Utensils, Moon } from 'lucide-react';

export default function Recommendations({ prediction }) {
  if (!prediction) return null;

  return (
    <div className="glass card">
      <h2>AI Recommendations</h2>
      <ul className="recommendation-list">
        <li className="recommendation-item">
          <div className="reco-icon">
            <Dumbbell size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Workout</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{prediction.recommendation_workout}</div>
          </div>
        </li>
        <li className="recommendation-item">
          <div className="reco-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)' }}>
            <Utensils size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Diet</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{prediction.recommendation_diet}</div>
          </div>
        </li>
        <li className="recommendation-item">
          <div className="reco-icon" style={{ color: '#8b5cf6', background: 'rgba(139, 92, 246, 0.1)' }}>
            <Moon size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Sleep</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{prediction.recommendation_sleep}</div>
          </div>
        </li>
      </ul>
    </div>
  );
}
