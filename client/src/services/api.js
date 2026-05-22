import axios from 'axios';

// ==========================================
// 🚨 MOCK MODE SWITCH
// Set to true to bypass backend; set to false to connect to the actual API.
// ==========================================
const USE_MOCK_API = false;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Auto-inject JWT on every request (for real backend mode)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// 🔌 LOCAL MOCK DATA & INTERCEPTOR
// ==========================================
if (USE_MOCK_API) {
  // In-memory mock database
  let mockHistory = [
    {
      _id: 'mock-rec-1',
      weight: 70.5,
      height: 175,
      age: 25,
      sleep_hours: 8,
      calories_consumed: 2100,
      exercise_minutes: 45,
      heart_rate: 72,
      water_intake: 2.8,
      gender: 'Male',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      bmi: 23.02,
      bmi_category: 'Normal weight',
      calorie_needs: 2300,
      health_risk_score: 95,
      recommendation_workout: 'Excellent workout routine! Maintain consistency.',
      recommendation_diet: 'Maintain a balanced diet with plenty of fiber and lean proteins.',
      recommendation_sleep: 'Excellent sleep duration! Keep maintaining this routine.'
    },
    {
      _id: 'mock-rec-2',
      weight: 72.0,
      height: 175,
      age: 25,
      sleep_hours: 6.2,
      calories_consumed: 2600,
      exercise_minutes: 15,
      heart_rate: 79,
      water_intake: 1.5,
      gender: 'Male',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      bmi: 23.51,
      bmi_category: 'Normal weight',
      calorie_needs: 2150,
      health_risk_score: 70,
      recommendation_workout: 'Try to aim for at least 30 minutes of moderate exercise daily.',
      recommendation_diet: 'Focus on a small calorie-deficit diet rich in whole foods, protein, and vegetables.',
      recommendation_sleep: 'Aim for 7-8 hours of quality sleep to support recovery and cognitive function.'
    }
  ];

  // Intercept Axios requests to bypass network calls
  api.interceptors.request.use(async (config) => {
    const url = config.url;
    const method = config.method.toUpperCase();

    // 1. Auth Mock (/auth/login and /auth/signup)
    if (url.includes('/auth/login') || url.includes('/auth/signup')) {
      const isSignup = url.includes('/auth/signup');
      const payload = JSON.parse(config.data || '{}');
      const name = payload.name || (payload.email ? payload.email.split('@')[0] : 'User');
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

      const responseData = {
        message: 'Mock authentication successful',
        token: 'mock-jwt-token-xyz',
        access_token: 'mock-jwt-token-xyz',
        user: {
          _id: 'mock-user-123',
          name: capitalizedName,
          email: payload.email || 'user@example.com',
          age: 26,
          height: 178,
          weight: 71.2,
          gender: 'Male',
          targetCalories: 2300,
          targetWater: 3.0,
          targetSleep: 8
        }
      };

      throw new axios.Cancel(JSON.stringify({ status: isSignup ? 201 : 200, data: responseData }));
    }

    // 2. Profile GET Mock (/auth/me)
    if (url.includes('/auth/me') && method === 'GET') {
      const responseData = {
        user: {
          _id: 'mock-user-123',
          name: 'Vaibhav',
          email: 'vaibhav@example.com',
          age: 26,
          height: 178,
          weight: 71.2,
          gender: 'Male',
          targetCalories: 2300,
          targetWater: 3.0,
          targetSleep: 8
        }
      };
      throw new axios.Cancel(JSON.stringify({ status: 200, data: responseData }));
    }

    // 3. Profile PUT Mock (/auth/profile)
    if (url.includes('/auth/profile') && method === 'PUT') {
      const payload = JSON.parse(config.data || '{}');
      const responseData = {
        message: 'Mock profile updated successfully',
        token: 'mock-jwt-token-xyz',
        access_token: 'mock-jwt-token-xyz',
        user: {
          _id: 'mock-user-123',
          name: payload.name || 'Vaibhav',
          email: payload.email || 'vaibhav@example.com',
          age: payload.age !== undefined ? Number(payload.age) : 26,
          height: payload.height !== undefined ? Number(payload.height) : 178,
          weight: payload.weight !== undefined ? Number(payload.weight) : 71.2,
          gender: payload.gender || 'Male',
          targetCalories: payload.targetCalories !== undefined ? Number(payload.targetCalories) : 2300,
          targetWater: payload.targetWater !== undefined ? Number(payload.targetWater) : 3.0,
          targetSleep: payload.targetSleep !== undefined ? Number(payload.targetSleep) : 8
        }
      };
      throw new axios.Cancel(JSON.stringify({ status: 200, data: responseData }));
    }

    // 4. GET History Mock (/health/history)
    if (url.includes('/health/history') && method === 'GET') {
      throw new axios.Cancel(JSON.stringify({ status: 200, data: mockHistory }));
    }

    // 5. DELETE Record Mock (/health/record/:id)
    if (url.includes('/health/record/') && method === 'DELETE') {
      const parts = url.split('/');
      const id = parts[parts.length - 1];
      mockHistory = mockHistory.filter(r => r._id !== id);
      throw new axios.Cancel(JSON.stringify({ status: 200, data: { success: true, message: 'Health record deleted successfully' } }));
    }

    // 6. POST Record Mock (/health/record or /health/add)
    if ((url.includes('/health/record') || url.includes('/health/add')) && method === 'POST') {
      const payload = JSON.parse(config.data || '{}');

      // Local mock calculations
      const weight = parseFloat(payload.weight || 70);
      const height = parseFloat(payload.height || 170);
      const age = parseInt(payload.age || 25);
      const sleep = parseFloat(payload.sleep_hours || 8);
      const calories = parseFloat(payload.calories_consumed || 2000);
      const exercise = parseFloat(payload.exercise_minutes || 30);
      const heartRate = parseFloat(payload.heart_rate || 72);
      const water = parseFloat(payload.water_intake || 2.0);
      const gender = payload.gender || 'Male';

      const bmi = parseFloat((weight / Math.pow(height / 100, 2)).toFixed(2));
      let bmiCategory = 'Normal weight';
      if (bmi < 18.5) bmiCategory = 'Underweight';
      else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
      else if (bmi >= 30) bmiCategory = 'Obesity';

      const bmr = gender === 'Male'
        ? (10 * weight) + (6.25 * height) - (5 * age) + 5
        : (10 * weight) + (6.25 * height) - (5 * age) - 161;
      const calorieNeeds = Math.round(bmr * 1.2 + (exercise * 5));

      let healthScore = 100;
      if (bmi < 18.5 || bmi >= 25) healthScore -= 10;
      if (bmi >= 30) healthScore -= 10;
      if (sleep < 7 || sleep > 9) healthScore -= 15;
      if (heartRate < 60 || heartRate > 100) healthScore -= 15;
      if (exercise < 30) healthScore -= 10;
      if (water < 2.0) healthScore -= 10;
      healthScore = Math.max(10, Math.min(100, healthScore));

      const newRecord = {
        _id: `mock-rec-${Date.now()}`,
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
        recommendation_workout: exercise < 30 ? 'Try to aim for at least 30 minutes of moderate exercise daily.' : 'Excellent workout routine! Maintain consistency.',
        recommendation_diet: bmiCategory === 'Normal weight' ? 'Maintain a balanced diet with plenty of fiber and protein.' : 'Adjust nutrition to align with BMI goals.',
        recommendation_sleep: sleep < 7 ? 'Aim for 7-8 hours of quality sleep to support recovery.' : 'Excellent sleep duration!'
      };

      // Add to internal list (newest first)
      mockHistory.unshift(newRecord);

      throw new axios.Cancel(JSON.stringify({ status: 201, data: newRecord }));
    }

    return config;
  });

  // Handle cancelled mock request promises and treat them as successful responses
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (axios.isCancel(error)) {
        try {
          const parsed = JSON.parse(error.message);
          return Promise.resolve({
            status: parsed.status,
            data: parsed.data,
            headers: {},
            config: {}
          });
        } catch (e) {
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
}

export default api;
