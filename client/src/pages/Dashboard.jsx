import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LogOut, LayoutDashboard } from 'lucide-react';
import MetricsCards from '../components/MetricsCards';
import HealthInputForm from '../components/HealthInputForm';
import Recommendations from '../components/Recommendations';
import Charts from '../components/Charts';

const API_URL = 'http://localhost:8000';

export default function Dashboard({ setAuth }) {
  const [history, setHistory] = useState([]);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/health/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
      console.error('Error fetching history:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuth(false);
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      // Ensure numeric fields are numbers (backend expects numeric types)
      const payload = {
        weight: Number(formData.weight),
        height: Number(formData.height),
        age: Number(formData.age),
        sleep_hours: Number(formData.sleep_hours),
        calories_consumed: Number(formData.calories_consumed),
        exercise_minutes: Number(formData.exercise_minutes),
        heart_rate:
          formData.heart_rate === '' || formData.heart_rate == null
            ? null
            : Number(formData.heart_rate)
      };

      const response = await axios.post(`${API_URL}/health/record`, payload, {

        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setCurrentPrediction(response.data);
      fetchHistory(); // Refresh the chart
    } catch (error) {
      console.error('Error submitting record:', error);
      alert('Failed to submit health record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LayoutDashboard className="text-gradient" size={32} />
          <h1>Health <span className="text-gradient">Dashboard</span></h1>
        </div>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      <MetricsCards prediction={currentPrediction} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <HealthInputForm onSubmit={handleSubmit} loading={loading} />
          <div className="mt-6">
            <Recommendations prediction={currentPrediction} />
          </div>
        </div>
        <div className="lg:col-span-8">
          <Charts data={history} />
        </div>
      </div>
    </div>
  );
}
