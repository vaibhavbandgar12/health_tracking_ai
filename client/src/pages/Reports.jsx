import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Trash2, 
  Download, 
  Calendar, 
  Heart, 
  Clock, 
  Flame, 
  Droplet,
  PlusCircle
} from 'lucide-react';
import ReportCard from '../components/ReportCard';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function Reports() {
  const { history, deleteRecord } = useAuth();
  const [filterCount, setFilterCount] = useState(7);

  // Filter logs
  const filteredHistory = history.slice(0, filterCount);

  // Prepare Chart Data for Sleep and Hydration Trends
  const trendData = [...filteredHistory].reverse().map(item => ({
    date: new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    sleep: item.sleep_hours,
    water: item.water_intake || 2.0,
    heart: item.heart_rate || 72
  }));

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ai_health_history_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 font-display tracking-tight flex items-center gap-2">
            <FileText className="text-primary w-8 h-8" />
            <span>Health Reports & <span className="text-gradient">Analytics</span></span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Review your weekly vitals statistics, check historical predictions, and manage logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter dropdown */}
          <select 
            value={filterCount} 
            onChange={(e) => setFilterCount(Number(e.target.value))}
            className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer hover:border-slate-300 transition-colors"
            style={{ width: 'auto' }}
          >
            <option value={7}>Last 7 entries</option>
            <option value={15}>Last 15 entries</option>
            <option value={30}>Last 30 entries</option>
          </select>

          {/* Export JSON btn */}
          <button 
            onClick={handleExportData}
            className="btn btn-outline text-xs py-2.5 px-4 font-semibold flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Export Logs
          </button>
        </div>
      </div>

      {/* Statistical Summary Row */}
      <ReportCard />

      {/* Double Column Subgrid: Charts & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Trend Area Chart (Sleep & Water Vitals) */}
        <div className="lg:col-span-12 glass p-5 flex flex-col h-[380px]">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 font-display flex items-center gap-1.5">
              <span>Sleep & Hydration Trends</span>
            </h3>
            <div className="flex gap-4 text-[10px] font-semibold uppercase tracking-wider">
              <span className="text-indigo-600">● Sleep (hrs)</span>
              <span className="text-sky-600">● Water (L)</span>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '10px' }} tickLine={false} />
                  <YAxis stroke="#64748b" style={{ fontSize: '10px' }} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(148, 163, 184, 0.05)' }}
                    itemStyle={{ color: '#0f172a', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="sleep" stroke="var(--primary)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSleep)" name="Sleep Duration (h)" />
                  <Area type="monotone" dataKey="water" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#colorWater)" name="Water Intake (L)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No logs recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Detailed Logs History Table */}
        <div className="lg:col-span-12 glass p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 font-display">Biometrics History Log</h3>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-3">BMI / Cat</th>
                  <th className="py-3.5 px-3">Health Score</th>
                  <th className="py-3.5 px-3">Weight</th>
                  <th className="py-3.5 px-3">Calories</th>
                  <th className="py-3.5 px-3">Sleep</th>
                  <th className="py-3.5 px-3">Exercise</th>
                  <th className="py-3.5 px-3">Water</th>
                  <th className="py-3.5 px-3">Heart Rate</th>
                  <th className="py-3.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((row) => (
                    <tr key={row._id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="py-3 px-3 text-slate-600 font-mono">
                        {new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-800 font-bold">{row.bmi}</span>
                        <span className="text-[10px] text-slate-500 block">{row.bmi_category}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          row.health_risk_score >= 85 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : row.health_risk_score >= 70
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-rose-50 text-rose-700 border-rose-100'
                        }`}>
                          {row.health_risk_score}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">{row.weight} kg</td>
                      <td className="py-3 px-3 text-slate-700">{row.calories_consumed} kcal</td>
                      <td className="py-3 px-3 text-slate-700">{row.sleep_hours} hrs</td>
                      <td className="py-3 px-3 text-slate-700">{row.exercise_minutes} min</td>
                      <td className="py-3 px-3 text-slate-700">{row.water_intake || 2.0} L</td>
                      <td className="py-3 px-3 text-slate-700">{row.heart_rate || 72} bpm</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this log entry?")) {
                              deleteRecord(row._id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="py-8 text-center text-slate-400 text-sm">
                      No logs found. Use the Dashboard to record your daily biometrics logs.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
