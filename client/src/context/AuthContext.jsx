import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Load user and health history from LocalStorage on mount
  useEffect(() => {
    if (token) {
      // Mock User Details
      setUser({
        name: localStorage.getItem('userName') || 'Vaibhav',
        email: localStorage.getItem('userEmail') || 'vaibhav@example.com',
        age: 26,
        height: 178,
        weight: 71.2,
        gender: 'Male',
        targetCalories: 2300,
        targetWater: 3.0,
        targetSleep: 8
      });

      // Load health history
      const savedHistory = localStorage.getItem('mock_health_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        if (parsed.length > 0) {
          setCurrentPrediction(parsed[0]);
        }
      } else {
        localStorage.setItem('mock_health_history', JSON.stringify(DEFAULT_HISTORY));
        setHistory(DEFAULT_HISTORY);
        setCurrentPrediction(DEFAULT_HISTORY[0]);
      }
    } else {
      setUser(null);
      setHistory([]);
      setCurrentPrediction(null);
    }
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
    return new Promise((resolve) => {
      setTimeout(() => {
        const dummyToken = 'mock-jwt-token-key-12345';
        const name = email.split('@')[0];
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
        
        localStorage.setItem('token', dummyToken);
        localStorage.setItem('userName', capitalizedName);
        localStorage.setItem('userEmail', email);
        
        setToken(dummyToken);
        resolve(true);
      }, 800);
    });
  };

  const signup = async (name, email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const dummyToken = 'mock-jwt-token-key-12345';
        
        localStorage.setItem('token', dummyToken);
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        
        setToken(dummyToken);
        resolve(true);
      }, 800);
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setToken(null);
  };

  const updateProfile = (profileData) => {
    if (user) {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem('userName', updatedUser.name);
      localStorage.setItem('userEmail', updatedUser.email);
    }
  };

  // Add Health Record locally
  const addRecord = (formData) => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);
    const sleep = parseFloat(formData.sleep_hours);
    const calories = parseFloat(formData.calories_consumed);
    const exercise = parseFloat(formData.exercise_minutes);
    const heartRate = parseFloat(formData.heart_rate || 72);
    const water = parseFloat(formData.water_intake || 2.0);
    const gender = formData.gender || 'Male';

    // 1. BMI Calculation
    const bmi = parseFloat((weight / Math.pow(height / 100, 2)).toFixed(2));
    let bmiCategory = 'Normal weight';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
    else if (bmi >= 30) bmiCategory = 'Obesity';

    // 2. Calorie Needs (Mifflin-St Jeor) + Exercise Adjustments
    const bmr = gender === 'Male'
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;
    const calorieNeeds = Math.round(bmr * 1.2 + (exercise * 5));

    // 3. Dynamic Health Risk Score
    let healthScore = 100;
    if (bmi < 18.5 || bmi >= 25) healthScore -= 10;
    if (bmi >= 30) healthScore -= 10;
    if (sleep < 7 || sleep > 9) healthScore -= 15;
    if (heartRate < 60 || heartRate > 100) healthScore -= 15;
    if (exercise < 30) healthScore -= 10;
    if (water < 2.0) healthScore -= 10;
    healthScore = Math.max(10, Math.min(100, healthScore));

    // 4. Recommendation Generation
    let recWorkout = 'Excellent workout level! Keep maintaining consistency.';
    if (exercise < 30) {
      recWorkout = 'Try to aim for at least 30 minutes of moderate exercise daily.';
    } else if (exercise > 90) {
      recWorkout = 'Great exercise levels, but ensure you include recovery days to avoid burnout.';
    }

    let recDiet = 'Maintain a balanced diet with plenty of fiber, leafy greens, and lean protein.';
    if (bmiCategory === 'Obesity' || bmiCategory === 'Overweight') {
      recDiet = 'Focus on a small calorie-deficit diet rich in whole foods, vegetables, and complex carbohydrates.';
    } else if (bmiCategory === 'Underweight') {
      recDiet = 'Increase intake of nutrient-dense whole foods, healthy fats (avocados, nuts), and lean proteins.';
    }

    let recSleep = 'Excellent sleep duration! Keep maintaining this routine.';
    if (sleep < 7) {
      recSleep = 'Aim for 7-8 hours of quality sleep to support cardiovascular recovery and cognitive function.';
    } else if (sleep > 9) {
      recSleep = 'Try to keep sleep duration between 7-9 hours to prevent lethargy and fatigue.';
    }

    const newRecord = {
      _id: `rec-${Date.now()}`,
      weight,
      height,
      age,
      sleep_hours: sleep,
      calories_consumed: calories,
      exercise_minutes: exercise,
      heart_rate: heartRate,
      water_intake: water,
      gender,
      created_at: new Date().toISOString(),
      date: new Date().toISOString(),
      bmi,
      bmi_category: bmiCategory,
      calorie_needs: calorieNeeds,
      health_risk_score: healthScore,
      recommendation_workout: recWorkout,
      recommendation_diet: recDiet,
      recommendation_sleep: recSleep
    };

    const updatedHistory = [newRecord, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('mock_health_history', JSON.stringify(updatedHistory));
    setCurrentPrediction(newRecord);
  };

  const deleteRecord = (id) => {
    const updatedHistory = history.filter(rec => rec._id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('mock_health_history', JSON.stringify(updatedHistory));
    if (updatedHistory.length > 0) {
      setCurrentPrediction(updatedHistory[0]);
    } else {
      setCurrentPrediction(null);
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
