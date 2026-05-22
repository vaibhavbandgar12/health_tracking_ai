import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const DB_FILE_PATH = path.resolve('db.json');

// Check if db.json exists, if not create it
if (!fs.existsSync(DB_FILE_PATH)) {
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify({ users: [], health_records: [] }, null, 2));
}

let isMock = false;

// Try to connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/health_tracking_ai';
console.log('Attempting to connect to MongoDB...');

try {
  // We set a 3-second timeout for server selection to fail quickly if MongoDB is not running
  await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 3000 });
  console.log('Connected to MongoDB successfully.');
} catch (err) {
  console.warn('\n[DATABASE WARNING] Could not connect to MongoDB server.');
  console.warn('Falling back to local file-based database (db.json).\n');
  isMock = true;
}

// --- MONGOOSE MODELS ---
const mongooseUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, default: 26 },
  height: { type: Number, default: 178 },
  weight: { type: Number, default: 71.2 },
  gender: { type: String, default: 'Male' },
  targetCalories: { type: Number, default: 2300 },
  targetWater: { type: Number, default: 3.0 },
  targetSleep: { type: Number, default: 8 }
});
const MongooseUser = mongoose.model('User', mongooseUserSchema);

const mongooseHealthRecordSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  age: { type: Number, required: true },
  sleep_hours: { type: Number, required: true },
  calories_consumed: { type: Number, required: true },
  exercise_minutes: { type: Number, required: true },
  heart_rate: { type: Number, required: true },
  water_intake: { type: Number, default: 2.0 },
  gender: { type: String, default: 'Male' },
  created_at: { type: Date, default: Date.now }
});
const MongooseHealthRecord = mongoose.model('HealthRecord', mongooseHealthRecordSchema);

// --- MOCK DATABASE IMPLEMENTATION ---
const getLocalData = () => {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE_PATH, 'utf8'));
  } catch (error) {
    return { users: [], health_records: [] };
  }
};

const saveLocalData = (data) => {
  fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2));
};

class MockUser {
  constructor(data = {}) {
    this._id = data._id || Math.random().toString(36).substring(2, 11);
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.age = data.age !== undefined ? data.age : 26;
    this.height = data.height !== undefined ? data.height : 178;
    this.weight = data.weight !== undefined ? data.weight : 71.2;
    this.gender = data.gender || 'Male';
    this.targetCalories = data.targetCalories !== undefined ? data.targetCalories : 2300;
    this.targetWater = data.targetWater !== undefined ? data.targetWater : 3.0;
    this.targetSleep = data.targetSleep !== undefined ? data.targetSleep : 8;
  }

  async save() {
    const data = getLocalData();
    // Prevent duplicate emails in mock
    const exists = data.users.some(u => u.email === this.email && u._id !== this._id);
    if (exists) {
      throw new Error('Email already exists');
    }
    // Remove if already exists (for updates)
    data.users = data.users.filter(u => u._id !== this._id);
    data.users.push({
      _id: this._id,
      name: this.name,
      email: this.email,
      password: this.password,
      age: this.age,
      height: this.height,
      weight: this.weight,
      gender: this.gender,
      targetCalories: this.targetCalories,
      targetWater: this.targetWater,
      targetSleep: this.targetSleep
    });
    saveLocalData(data);
    return this;
  }

  static async findOne(query) {
    const data = getLocalData();
    const found = data.users.find(u => u.email === query.email);
    return found ? new MockUser(found) : null;
  }

  static async create(data) {
    const instance = new MockUser(data);
    await instance.save();
    return instance;
  }
}

class MockHealthRecord {
  constructor(data = {}) {
    this._id = data._id || Math.random().toString(36).substring(2, 11);
    this.user_id = data.user_id;
    this.weight = data.weight;
    this.height = data.height;
    this.age = data.age;
    this.sleep_hours = data.sleep_hours;
    this.calories_consumed = data.calories_consumed;
    this.exercise_minutes = data.exercise_minutes;
    this.heart_rate = data.heart_rate;
    this.water_intake = data.water_intake !== undefined ? data.water_intake : 2.0;
    this.gender = data.gender || 'Male';
    this.created_at = data.created_at ? new Date(data.created_at) : new Date();
  }

  async save() {
    const data = getLocalData();
    data.health_records.push({
      _id: this._id,
      user_id: this.user_id.toString(),
      weight: this.weight,
      height: this.height,
      age: this.age,
      sleep_hours: this.sleep_hours,
      calories_consumed: this.calories_consumed,
      exercise_minutes: this.exercise_minutes,
      heart_rate: this.heart_rate,
      water_intake: this.water_intake,
      gender: this.gender,
      created_at: this.created_at.toISOString()
    });
    saveLocalData(data);
    return this;
  }

  static find(query) {
    const data = getLocalData();
    const records = data.health_records
      .filter(r => r.user_id === query.user_id.toString())
      .map(r => new MockHealthRecord(r));

    // Support chainable sorting
    return {
      sort: (sortQuery) => {
        if (sortQuery.created_at === -1) {
          records.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
        } else {
          records.sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
        }
        return records;
      }
    };
  }

  static async deleteOne(query) {
    const data = getLocalData();
    const initialLength = data.health_records.length;
    data.health_records = data.health_records.filter(r => {
      let match = true;
      if (query._id && r._id !== query._id) match = false;
      if (query.user_id && r.user_id !== query.user_id.toString()) match = false;
      return !match;
    });
    saveLocalData(data);
    return { deletedCount: initialLength - data.health_records.length };
  }
}

// Export actual or mock models based on connection status
export const User = isMock ? MockUser : MongooseUser;
export const HealthRecord = isMock ? MockHealthRecord : MongooseHealthRecord;
export const isDatabaseMock = () => isMock;
export const getDatabaseStatus = () => isMock ? 'Connected (JSON Fallback)' : 'Connected';
