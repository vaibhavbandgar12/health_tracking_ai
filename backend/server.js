import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, HealthRecord, getDatabaseStatus } from './database.js';

// Load environment variables
dotenv.config();

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JWT Utilities
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-key-here';
const JWT_EXPIRATION_HOURS = parseInt(process.env.JWT_EXPIRATION_HOURS || '24');

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${JWT_EXPIRATION_HOURS}h` });
};

// Authentication Middleware
const tokenRequired = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization token format' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// --- ROUTES ---

// Root Status Check Route
app.get('/', (req, res) => {
  res.json({
    Message: 'Backend Running Successfully',
    Database_Status: getDatabaseStatus()
  });
});

// Authentication Routes
app.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const finalEmail = email || req.body.username;
    
    if (!finalEmail || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const finalName = name || finalEmail.split('@')[0];

    const existingUser = await User.findOne({ email: finalEmail });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name: finalName,
      email: finalEmail,
      password: hashedPassword
    });
    await user.save();

    const token = generateToken({ user_id: user._id, email: user.email });

    // Return both token configurations for complete compatibility
    return res.status(201).json({
      message: 'User created successfully',
      token,
      access_token: token
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const email = req.body.email || req.body.username;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ user_id: user._id, email: user.email });

    // Return both configurations
    return res.status(200).json({
      token,
      access_token: token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Health Calculations & Recommendations Helper
const computeHealthMetrics = (record) => {
  const weight = parseFloat(record.weight);
  const height = parseFloat(record.height);
  const age = parseInt(record.age);
  const sleep_hours = parseFloat(record.sleep_hours);
  const calories_consumed = parseFloat(record.calories_consumed);
  const exercise_minutes = parseFloat(record.exercise_minutes);
  const heart_rate = record.heart_rate === null || record.heart_rate === '' || record.heart_rate === undefined ? 72 : parseFloat(record.heart_rate);

  // Calculations
  const bmi = parseFloat((weight / Math.pow(height / 100, 2)).toFixed(2));
  let bmi_category = 'Normal weight';
  if (bmi < 18.5) bmi_category = 'Underweight';
  else if (bmi >= 25 && bmi < 30) bmi_category = 'Overweight';
  else if (bmi >= 30) bmi_category = 'Obesity';

  // BMR (Mifflin-St Jeor Estimate) + Workout Adjustment
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  const calorie_needs = Math.round(bmr * 1.2 + (exercise_minutes * 5));

  // Dynamic health risk score
  let health_score = 100;
  if (bmi < 18.5 || bmi >= 25) health_score -= 10;
  if (bmi >= 30) health_score -= 10;
  if (sleep_hours < 7 || sleep_hours > 9) health_score -= 15;
  if (heart_rate < 60 || heart_rate > 100) health_score -= 15;
  if (exercise_minutes < 30) health_score -= 10;
  health_score = Math.max(10, Math.min(100, health_score));

  // Recommendations
  let recommendation_workout = 'Excellent workout routine! Maintain consistency.';
  if (exercise_minutes < 30) {
    recommendation_workout = 'Try to aim for at least 30 minutes of moderate exercise daily.';
  } else if (exercise_minutes > 90) {
    recommendation_workout = 'Great exercise levels, but ensure you include recovery days.';
  }

  let recommendation_diet = 'Maintain a balanced diet with plenty of fiber and lean proteins.';
  if (bmi_category === 'Obesity' || bmi_category === 'Overweight') {
    recommendation_diet = 'Focus on a small calorie-deficit diet rich in whole foods, protein, and vegetables.';
  } else if (bmi_category === 'Underweight') {
    recommendation_diet = 'Increase intake of nutrient-dense whole foods and healthy fats.';
  }

  let recommendation_sleep = 'Excellent sleep duration! Keep maintaining this routine.';
  if (sleep_hours < 7) {
    recommendation_sleep = 'Aim for 7-8 hours of quality sleep to support recovery and cognitive function.';
  } else if (sleep_hours > 9) {
    recommendation_sleep = 'Try to avoid oversleeping; keep sleep duration between 7-9 hours.';
  }

  return {
    bmi,
    bmi_category,
    calorie_needs,
    health_risk_score: health_score,
    recommendation_workout,
    recommendation_diet,
    recommendation_sleep,
    recommendations: [recommendation_sleep, recommendation_diet]
  };
};

// Health Record Routes
app.post(['/health/record', '/health/add'], tokenRequired, async (req, res) => {
  try {
    const { weight, height, age, sleep_hours, calories_consumed, exercise_minutes, heart_rate } = req.body;
    const user_id = req.user.user_id;

    // Validate inputs
    const parsedWeight = parseFloat(weight);
    const parsedHeight = parseFloat(height);
    const parsedAge = parseInt(age);
    const parsedSleep = parseFloat(sleep_hours);
    const parsedCalories = parseFloat(calories_consumed);
    const parsedExercise = parseFloat(exercise_minutes);
    const parsedHeartRate = heart_rate === null || heart_rate === '' || heart_rate === undefined ? null : parseFloat(heart_rate);

    if (isNaN(parsedWeight) || isNaN(parsedHeight) || isNaN(parsedAge) || isNaN(parsedSleep) || isNaN(parsedCalories) || isNaN(parsedExercise)) {
      return res.status(400).json({ error: 'Missing or invalid required fields' });
    }

    if (parsedWeight <= 0) return res.status(400).json({ error: 'Invalid weight' });
    if (parsedHeight <= 0) return res.status(400).json({ error: 'Invalid height' });
    if (parsedAge < 1 || parsedAge > 120) return res.status(400).json({ error: 'Invalid age' });
    if (parsedSleep < 0 || parsedSleep > 24) return res.status(400).json({ error: 'Invalid sleep hours' });
    if (parsedCalories < 0) return res.status(400).json({ error: 'Invalid calories' });
    if (parsedExercise < 0) return res.status(400).json({ error: 'Invalid exercise minutes' });
    if (parsedHeartRate !== null && (parsedHeartRate < 20 || parsedHeartRate > 250)) {
      return res.status(400).json({ error: 'Invalid heart rate' });
    }

    const finalHeartRate = parsedHeartRate || 72; // default fallback if empty

    const record = new HealthRecord({
      user_id,
      weight: parsedWeight,
      height: parsedHeight,
      age: parsedAge,
      sleep_hours: parsedSleep,
      calories_consumed: parsedCalories,
      exercise_minutes: parsedExercise,
      heart_rate: finalHeartRate
    });
    await record.save();

    const metrics = computeHealthMetrics({
      weight: parsedWeight,
      height: parsedHeight,
      age: parsedAge,
      sleep_hours: parsedSleep,
      calories_consumed: parsedCalories,
      exercise_minutes: parsedExercise,
      heart_rate: finalHeartRate
    });

    const response_data = {
      success: true,
      message: 'Health record added successfully',
      data: {
        weight: parsedWeight,
        height: parsedHeight,
        age: parsedAge,
        sleep_hours: parsedSleep,
        calories_consumed: parsedCalories,
        exercise_minutes: parsedExercise,
        heart_rate: finalHeartRate,
        health_score: metrics.health_risk_score,
        recommendations: metrics.recommendations
      },
      ...metrics
    };

    return res.status(201).json(response_data);
  } catch (error) {
    console.error('Add health record error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health/history', tokenRequired, async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const records = await HealthRecord.find({ user_id }).sort({ created_at: -1 });

    // Handle both Mongoose models and plain JS objects from mock DB
    const formattedRecords = records.map(doc => {
      const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
      obj._id = obj._id.toString();
      if (obj.created_at) {
        const dateStr = typeof obj.created_at === 'string' ? obj.created_at : obj.created_at.toISOString();
        obj.created_at = dateStr;
        obj.date = dateStr; // compatible with Charts.jsx
      }
      const metrics = computeHealthMetrics(obj);
      return { ...obj, ...metrics };
    });

    return res.status(200).json(formattedRecords);
  } catch (error) {
    console.error('Fetch health history error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
