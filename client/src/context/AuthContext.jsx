import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

// Default Mock Health Records for a realistic dashboard on first view
const DEFAULT_HISTORY = [
  {
    _id: 'rec-1',
    weight: 71.2,
    height: 178,
    age: 26,
    sleep_hours: 8.0,
    calories_consumed: 2100,
    exercise_minutes: 45,
    heart_rate: 68,
    water_intake: 2.8,
    gender: 'Male',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    bmi: 22.47,
    bmi_category: 'Normal weight',
    calorie_needs: 2315,
    health_risk_score: 95,
    recommendation_workout: 'Excellent exercise duration! Keep maintaining this routine.',
    recommendation_diet: 'Great calorie intake. Focus on eating high-fiber foods.',
    recommendation_sleep: 'Perfect sleep amount. Keep it up!'
  },
  {
    _id: 'rec-2',
    weight: 72.5,
    height: 178,
    age: 26,
    sleep_hours: 6.5,
    calories_consumed: 2800,
    exercise_minutes: 20,
    heart_rate: 78,
    water_intake: 1.5,
    gender: 'Male',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    bmi: 22.88,
    bmi_category: 'Normal weight',
    calorie_needs: 2190,
    health_risk_score: 80,
    recommendation_workout: 'Try to target at least 30 minutes of cardiovascular activity today.',
    recommendation_diet: 'Your calorie intake is slightly high. Limit sugary beverages and snacks.',
    recommendation_sleep: 'Aim for 7-8 hours of sleep. Try avoiding screen time 30 minutes before bed.'
  },
  {
    _id: 'rec-3',
    weight: 73.0,
    height: 178,
    age: 26,
    sleep_hours: 5.8,
    calories_consumed: 2950,
    exercise_minutes: 0,
    heart_rate: 85,
    water_intake: 1.2,
    gender: 'Male',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    bmi: 23.04,
    bmi_category: 'Normal weight',
    calorie_needs: 2090,
    health_risk_score: 65,
    recommendation_workout: 'Aim for light walking or active stretching. A sedentary day affects metabolism.',
    recommendation_diet: 'Hydrate more and reduce refined carbs. Choose leafy greens and lean proteins.',
    recommendation_sleep: 'Rest deficit detected. Prioritize sleep recovery tonight.'
  },
  {
    _id: 'rec-4',
    weight: 73.8,
    height: 178,
    age: 26,
    sleep_hours: 7.2,
    calories_consumed: 2200,
    exercise_minutes: 35,
    heart_rate: 72,
    water_intake: 2.2,
    gender: 'Male',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    bmi: 23.29,
    bmi_category: 'Normal weight',
    calorie_needs: 2265,
    health_risk_score: 90,
    recommendation_workout: 'Moderate active levels. Consistent resistance training can improve health score.',
    recommendation_diet: 'Keep eating balanced portions of healthy fats, proteins, and complex carbohydrates.',
    recommendation_sleep: 'Good sleep duration. Ensure sleep quality is high.'
  }
];

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Load user and health history from API on mount or token changes
  useEffect(() => {
    let active = true;

    const loadData = async () => {
      if (!token) {
        setUser(null);
        setHistory([]);
        setCurrentPrediction(null);
        return;
      }

      try {
        // Fetch current user details
        const userRes = await api.get('/auth/me');
        if (!active) return;
        setUser(userRes.data.user);

        // Fetch health logs history
        const historyRes = await api.get('/health/history');
        if (!active) return;
        const data = historyRes.data;
        setHistory(data);
        if (data.length > 0) {
          setCurrentPrediction(data[0]);
        } else {
          setCurrentPrediction(null);
        }
      } catch (error) {
        if (!active) return;
        console.error('Error loading user profile or history from backend:', error);
        // Automatically trigger logout on 401 Unauthorized errors
        if (error.response && error.response.status === 401) {
          logout();
        }
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [token]);

  // Generate dynamic AI suggestions and alerts based on the latest health metrics
  useEffect(() => {
    if (currentPrediction) {
      const alerts = [];
      
      // BMI Alerts
      if (currentPrediction.bmi >= 25 && currentPrediction.bmi < 30) {
        alerts.push({
          id: 'bmi-over',
          type: 'warning',
          title: 'Weight Alert',
          message: `Your BMI is ${currentPrediction.bmi} (Overweight). Consider a balanced calorie-deficit diet.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else if (currentPrediction.bmi >= 30) {
        alerts.push({
          id: 'bmi-obese',
          type: 'danger',
          title: 'Obesity Warning',
          message: `Your BMI is ${currentPrediction.bmi} (Obesity). Consult a health professional to devise a structured workout plan.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      // Sleep Alerts
      if (currentPrediction.sleep_hours < 6.5) {
        alerts.push({
          id: 'sleep-low',
          type: 'danger',
          title: 'Sleep Deficit',
          message: `Logged only ${currentPrediction.sleep_hours}h of sleep. Lack of sleep triggers cortisol spikes and slows down muscle recovery.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      // Exercise Alerts
      if (currentPrediction.exercise_minutes < 30) {
        alerts.push({
          id: 'exercise-low',
          type: 'warning',
          title: 'Sedentary Log',
          message: `You active exercise is below the recommended 30 min daily target. Try going for a quick walk.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      // Heart Rate Alerts
      if (currentPrediction.heart_rate > 100) {
        alerts.push({
          id: 'heart-high',
          type: 'danger',
          title: 'Elevated Heart Rate',
          message: `Resting heart rate at ${currentPrediction.heart_rate} bpm is higher than average. Track your stress levels.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      // Water Intake Alerts
      if (currentPrediction.water_intake < 2.0) {
        alerts.push({
          id: 'water-low',
          type: 'warning',
          title: 'Dehydration Risk',
          message: `Your water intake (${currentPrediction.water_intake}L) is below target. Drink a glass of water now.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      // Fallback notifications if healthy
      if (alerts.length === 0) {
        alerts.push({
          id: 'all-healthy',
          type: 'success',
          title: 'Optimal Health Log',
          message: 'Excellent daily log! All metrics are within standard healthy parameters. Keep it up!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }

      setNotifications(alerts);
    } else {
      setNotifications([
        {
          id: 'welcome-notification',
          type: 'info',
          title: 'Welcome to AI Health Tracker',
          message: 'Please log your first daily metrics entry to see personalized AI insights and alerts.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [currentPrediction]);

  // Auth Functions
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      
      setToken(token);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userEmail', user.email);
      
      setToken(token);
      setUser(user);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setToken(null);
    setUser(null);
    setHistory([]);
    setCurrentPrediction(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      const { token, user: updatedUser } = res.data;
      
      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('userName', updatedUser.name);
        localStorage.setItem('userEmail', updatedUser.email);
        setToken(token);
      }
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  // Add Health Record via API
  const addRecord = async (formData) => {
    try {
      const res = await api.post('/health/record', formData);
      let newRecord;
      if (res.data && res.data.success && res.data.data) {
        // Real backend format response
        const savedRecord = res.data.data;
        newRecord = {
          ...savedRecord,
          created_at: savedRecord.created_at || new Date().toISOString(),
          date: savedRecord.created_at || new Date().toISOString(),
          bmi: res.data.bmi,
          bmi_category: res.data.bmi_category,
          calorie_needs: res.data.calorie_needs,
          health_risk_score: res.data.health_risk_score,
          recommendation_workout: res.data.recommendation_workout,
          recommendation_diet: res.data.recommendation_diet,
          recommendation_sleep: res.data.recommendation_sleep
        };
      } else {
        // Mock API response (already decorated at the root)
        newRecord = res.data;
      }

      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      setCurrentPrediction(newRecord);
      return true;
    } catch (error) {
      console.error('Error adding health record:', error);
      throw error;
    }
  };

  const deleteRecord = async (id) => {
    try {
      await api.delete(`/health/record/${id}`);
      const updatedHistory = history.filter(rec => rec._id !== id);
      setHistory(updatedHistory);
      if (updatedHistory.length > 0) {
        setCurrentPrediction(updatedHistory[0]);
      } else {
        setCurrentPrediction(null);
      }
      return true;
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      history,
      currentPrediction,
      notifications,
      login,
      signup,
      logout,
      updateProfile,
      addRecord,
      deleteRecord
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
