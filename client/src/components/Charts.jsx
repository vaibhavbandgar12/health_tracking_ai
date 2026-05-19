import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function Charts({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
        <p style={{ color: 'var(--text-muted)' }}>No history available. Submit a record to see trends.</p>
      </div>
    );
  }

  // Format data for Recharts (reverse to show chronological order left-to-right)
  const chartData = [...data].reverse().map(item => ({
    date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    weight: item.weight,
    calories: item.calories_consumed
  }));

  return (
    <div className="glass card" style={{ height: '100%' }}>
      <h2>Weight Trend</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="var(--text-muted)" />
            <YAxis yAxisId="left" stroke="var(--text-muted)" domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--bg-dark)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--text-main)' }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="weight" 
              stroke="var(--primary)" 
              strokeWidth={3}
              activeDot={{ r: 8 }}
              name="Weight (kg)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
