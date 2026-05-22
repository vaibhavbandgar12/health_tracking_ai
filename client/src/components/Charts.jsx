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
      <div className="glass p-6 flex items-center justify-center h-[300px]">
        <p className="text-slate-500 text-sm">No history available. Submit a record to see trends.</p>
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
    <div className="glass p-5 flex flex-col h-full">
      <h3 className="font-bold text-slate-800 font-display mb-4">Weight Trend</h3>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
            <YAxis yAxisId="left" stroke="var(--text-muted)" domain={['dataMin - 2', 'dataMax + 2']} fontSize={12} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#ffffff', borderColor: 'var(--border-color)', borderRadius: '10px', boxShadow: 'var(--card-shadow)' }}
              itemStyle={{ color: 'var(--text-main)' }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="weight" 
              stroke="var(--primary)" 
              strokeWidth={3}
              activeDot={{ r: 6 }}
              name="Weight (kg)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
