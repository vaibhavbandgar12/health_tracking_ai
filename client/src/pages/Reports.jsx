import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
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
  const { user, history, deleteRecord } = useAuth();
  const [filterCount, setFilterCount] = useState(7);

  // Filter logs
  const filteredHistory = history.slice(0, filterCount);

  // Prepare Chart Data for Sleep and Hydration Trends
  const trendData = [...filteredHistory].reverse().map(item => {
    const d = new Date(item.date);
    const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const timeStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    return {
      date: `${dateStr} ${timeStr}`,
      sleep: item.sleep_hours,
      water: item.water_intake || 2.0,
      heart: item.heart_rate || 72
    };
  });

  const handleExportData = () => {
    if (!history || history.length === 0) {
      alert("No data available to export.");
      return;
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Theme Colors matching the modern dashboard
    const primaryColor = [79, 70, 229]; // Indigo #4f46e5
    const textColorDark = [15, 23, 42]; // Slate 900 #0f172a
    const textColorMuted = [100, 116, 139]; // Slate 500 #64748b
    const borderColor = [226, 232, 240]; // Slate 200 #e2e8f0
    const lightBgColor = [248, 250, 252]; // Slate 50 #f8fafc

    // 1. Header Band
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text("AI Health Tracking System", 15, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text("Personalized Health & Vitals History Report", 15, 25);

    // Right-aligned header metadata
    const reportDateStr = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.setFontSize(10);
    doc.text(`Generated: ${reportDateStr}`, pageWidth - 15, 18, { align: 'right' });
    if (user && user.name) {
      doc.text(`User: ${user.name} (${user.email || 'N/A'})`, pageWidth - 15, 25, { align: 'right' });
    } else {
      doc.text(`User ID: ${history[0]?.user_id || 'N/A'}`, pageWidth - 15, 25, { align: 'right' });
    }

    // 2. Summary Statistics Averages (from all history records)
    const count = history.length;
    const avgWeight = (history.reduce((sum, item) => sum + (item.weight || 0), 0) / count).toFixed(1);
    const avgCalories = Math.round(history.reduce((sum, item) => sum + (item.calories_consumed || 0), 0) / count);
    const avgSleep = (history.reduce((sum, item) => sum + (item.sleep_hours || 0), 0) / count).toFixed(1);
    const avgExercise = Math.round(history.reduce((sum, item) => sum + (item.exercise_minutes || 0), 0) / count);
    const avgWater = (history.reduce((sum, item) => sum + (item.water_intake || 2.0), 0) / count).toFixed(1);
    const avgHeart = Math.round(history.reduce((sum, item) => sum + (item.heart_rate || 72), 0) / count);
    const avgHealth = Math.round(history.reduce((sum, item) => sum + (item.health_risk_score || 0), 0) / count);

    // Section Title
    doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text("Health Dashboard & Vitals Summary", 15, 52);

    // Draw Summary Grid Container
    doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.3);
    doc.rect(15, 57, pageWidth - 30, 32, 'FD');

    // Summary Stats - 4 columns
    const colWidth = (pageWidth - 30) / 4;
    const colY = 64;

    // Col 1: Health Score & Logs
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
    doc.text("Avg Health Score", 15 + 5, colY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(`${avgHealth}`, 15 + 5, colY + 7);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
    doc.text(`Based on ${count} log entries`, 15 + 5, colY + 13);

    // Col 2: Weight & Calories
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text("Avg Weight & Calories", 15 + colWidth + 5, colY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
    doc.text(`${avgWeight} kg`, 15 + colWidth + 5, colY + 6);
    doc.text(`${avgCalories} kcal`, 15 + colWidth + 5, colY + 12);

    // Col 3: Sleep & Exercise
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
    doc.text("Avg Sleep & Exercise", 15 + 2 * colWidth + 5, colY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
    doc.text(`${avgSleep} hrs`, 15 + 2 * colWidth + 5, colY + 6);
    doc.text(`${avgExercise} mins`, 15 + 2 * colWidth + 5, colY + 12);

    // Col 4: Water & Heart Rate
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
    doc.text("Avg Hydration & HR", 15 + 3 * colWidth + 5, colY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
    doc.text(`${avgWater} L / day`, 15 + 3 * colWidth + 5, colY + 6);
    doc.text(`${avgHeart} bpm`, 15 + 3 * colWidth + 5, colY + 12);

    // 3. Log History Table
    doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text("Detailed Biometrics History Log", 15, 100);

    // Column Definitions: label, width
    const cols = [
      { id: 'date', label: 'Date', width: 26 },
      { id: 'bmi', label: 'BMI (Cat)', width: 30 },
      { id: 'health', label: 'Health Score', width: 24 },
      { id: 'weight', label: 'Weight', width: 18 },
      { id: 'calories', label: 'Calories', width: 20 },
      { id: 'sleep', label: 'Sleep', width: 16 },
      { id: 'exercise', label: 'Exercise', width: 18 },
      { id: 'water', label: 'Water', width: 14 },
      { id: 'heart', label: 'HR', width: 14 }
    ];

    let currentY = 105;

    // Helper to draw table header
    const drawTableHeader = (y) => {
      doc.setFillColor(51, 65, 85); // Slate 700
      doc.rect(15, y, pageWidth - 30, 8, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(255, 255, 255);

      let xOffset = 15;
      cols.forEach(col => {
        const align = (col.id === 'date' || col.id === 'bmi') ? 'left' : 'center';
        if (align === 'left') {
          doc.text(col.label, xOffset + 2, y + 5.5);
        } else {
          doc.text(col.label, xOffset + col.width / 2, y + 5.5, { align: 'center' });
        }
        xOffset += col.width;
      });
    };

    // Draw first header
    drawTableHeader(currentY);
    currentY += 8;

    // Loop and draw rows
    history.forEach((row, index) => {
      // Check for page overflow
      if (currentY + 8 > pageHeight - 15) {
        doc.addPage();
        
        // Draw Page Header on new pages
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, pageWidth, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text("AI Health Tracking Report - Log History", 15, 10);
        
        currentY = 25;
        drawTableHeader(currentY);
        currentY += 8;
      }

      // Zebra striping background color
      if (index % 2 === 1) {
        doc.setFillColor(lightBgColor[0], lightBgColor[1], lightBgColor[2]);
        doc.rect(15, currentY, pageWidth - 30, 8, 'F');
      }

      // Draw bottom horizontal border
      doc.setDrawColor(241, 245, 249); // Slate 100
      doc.line(15, currentY + 8, pageWidth - 15, currentY + 8);

      // Render cells
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);

      let xOffset = 15;
      cols.forEach(col => {
        let val = '';
        if (col.id === 'date') {
          val = new Date(row.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
          doc.text(val, xOffset + 2, currentY + 5.5);
        } else if (col.id === 'bmi') {
          val = `${row.bmi || 'N/A'}`;
          const cat = row.bmi_category || '';
          doc.setFont('helvetica', 'bold');
          doc.text(val, xOffset + 2, currentY + 5.5);
          
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6.5);
          doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
          doc.text(` (${cat})`, xOffset + 2 + doc.getTextWidth(val) + 1, currentY + 5.5);
          doc.setFontSize(8.5); // restore
          doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
        } else if (col.id === 'health') {
          const score = row.health_risk_score || 0;
          doc.setFont('helvetica', 'bold');
          if (score >= 85) {
            doc.setTextColor(16, 185, 129); // Emerald 500
          } else if (score >= 70) {
            doc.setTextColor(245, 158, 11); // Amber 500
          } else {
            doc.setTextColor(239, 68, 68); // Rose 500
          }
          doc.text(`${score}`, xOffset + col.width / 2, currentY + 5.5, { align: 'center' });
          doc.setTextColor(textColorDark[0], textColorDark[1], textColorDark[2]);
          doc.setFont('helvetica', 'normal');
        } else if (col.id === 'weight') {
          val = `${row.weight || 0} kg`;
          doc.text(val, xOffset + col.width / 2, currentY + 5.5, { align: 'center' });
        } else if (col.id === 'calories') {
          val = `${row.calories_consumed || 0}`;
          doc.text(val, xOffset + col.width / 2, currentY + 5.5, { align: 'center' });
        } else if (col.id === 'sleep') {
          val = `${row.sleep_hours || 0}h`;
          doc.text(val, xOffset + col.width / 2, currentY + 5.5, { align: 'center' });
        } else if (col.id === 'exercise') {
          val = `${row.exercise_minutes || 0}m`;
          doc.text(val, xOffset + col.width / 2, currentY + 5.5, { align: 'center' });
        } else if (col.id === 'water') {
          val = `${row.water_intake || 2.0}L`;
          doc.text(val, xOffset + col.width / 2, currentY + 5.5, { align: 'center' });
        } else if (col.id === 'heart') {
          val = `${row.heart_rate || 72}`;
          doc.text(val, xOffset + col.width / 2, currentY + 5.5, { align: 'center' });
        }
        xOffset += col.width;
      });

      currentY += 8;
    });

    // Add page numbers at the footer of each page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(textColorMuted[0], textColorMuted[1], textColorMuted[2]);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
      doc.text("AI Health Tracking System © 2026", 15, pageHeight - 8);
    }

    doc.save(`ai_health_report_${new Date().toISOString().slice(0, 10)}.pdf`);
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
