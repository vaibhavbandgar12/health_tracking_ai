import React, { useState } from 'react';

export default function HealthInputForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    sleep_hours: '',
    calories_consumed: '',
    exercise_minutes: '',
    heart_rate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="glass card">
      <h2>Log Daily Metrics</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label>Weight (kg)</label>
            <input type="number" step="0.1" name="weight" required value={formData.weight} onChange={handleChange} />
          </div>
          <div>
            <label>Height (cm)</label>
            <input type="number" step="0.1" name="height" required value={formData.height} onChange={handleChange} />
          </div>
          <div>
            <label>Age</label>
            <input type="number" name="age" required value={formData.age} onChange={handleChange} />
          </div>
          <div>
            <label>Sleep (hours)</label>
            <input type="number" step="0.1" name="sleep_hours" required value={formData.sleep_hours} onChange={handleChange} />
          </div>
          <div>
            <label>Calories Consumed</label>
            <input type="number" name="calories_consumed" required value={formData.calories_consumed} onChange={handleChange} />
          </div>
          <div>
            <label>Exercise (minutes)</label>
            <input type="number" name="exercise_minutes" required value={formData.exercise_minutes} onChange={handleChange} />
          </div>
          <div className="col-span-12">
            <label>Heart Rate (bpm) - Optional</label>
            <input type="number" name="heart_rate" value={formData.heart_rate} onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Analyzing with AI...' : 'Submit & Get Insights'}
        </button>
      </form>
    </div>
  );
}
