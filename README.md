# AI Health Tracking System (AI HealthTrack)

AI HealthTrack is a state-of-the-art, premium full-stack wellness diagnostics application. It provides real-time biometrics analytics, personalized wellness directives, and daily progress tracking. Using a responsive React dashboard on the frontend and a Python/Flask server with a dual-mode database on the backend, users can log daily vital metrics (sleep, hydration, weight, exercise intensity, calorie intake, heart rate) to receive dynamic diagnostics, health risk indexes, and health suggestions.

---

## Key Features

1. **User Authentication & Session Security**: JWT-based login/signup system with password hashing (`bcrypt`) and secure routing protection.
2. **Dynamic Biometrics Diagnostics**: Real-time evaluation of:
   * **Body Mass Index (BMI)**: Calculated from height and weight, categorized into standard clinical classifications.
   * **Daily Calorie Needs**: Basal Metabolic Rate (BMR) estimation using Mifflin-St Jeor formula adjusted dynamically for active physical activity duration.
   * **Health Score Index**: A dynamic rating from 10 to 100 calculated from vitals deviation (sleep duration, heart rate anomalies, water intake, active movement).
3. **AI Wellness Planner & Suggestions**: Adaptive checklist of daily physical, nutritional, and recovery targets with actionable recommendations.
4. **Vitals Visualization & Trends**: Interactive charts showing sleep quality, hydration, weight changes, and heart rate history.
5. **Dual-Mode Database Fallback**: Auto-detects MongoDB availability. If MongoDB is offline, it seamlessly falls back to a custom, JSON-file-based database (`db.json`) that replicates Mongoose query operations (CRUD) to guarantee high availability.
6. **Local Mock Mode Toggle**: A client-side API configuration switch (`USE_MOCK_API = true`) in the frontend to bypass backend servers completely and simulate real-time metrics operations.

---

## Directory Overview

```text
ai_health_tracking/
├── backend/            # Python Flask Server, JWT authentication, and Dual-Mode Database
│   ├── database/       # MongoDB connection & custom JSON-file fallback ODM
│   ├── db.json         # Fallback local JSON database file
│   ├── app.py          # Flask entry point and blueprints
│   ├── routes/         # Auth, health, and predict routes blueprints
│   ├── controllers/    # Route controllers and AI biometrics logic
│   └── requirements.txt# Python backend package dependencies
└── client/             # React (Vite) Frontend
    ├── src/
    │   ├── components/ # Modular UI components (Charts, Forms, Metrics, Cards)
    │   ├── context/    # AuthContext.jsx handles state sync, JWT, and alerts
    │   ├── layouts/    # Page structures (Root & Sidebar Dashboard Layouts)
    │   ├── pages/      # Views (Dashboard, Recommendations, Reports, Settings)
    │   └── services/   # api.js handles Axios routing and Mock APIs
    └── package.json    # Frontend configuration & bundler details
```

---

## Quick Start

### 1. Requirements
* [Node.js](https://nodejs.org/) (v16+)
* [Python 3.x](https://www.python.org/)
* [MongoDB](https://www.mongodb.com/) (Optional: the system automatically boots in JSON fallback mode if MongoDB is absent)

### 2. Startup Commands

Start the entire stack by booting up the backend server followed by the client bundler.

#### Start the Python Flask Backend:
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*The server will start on port `8000`. You should see `Successfully connected to MongoDB` or `[DATABASE WARNING] Could not connect to MongoDB server. Falling back to local file-based database (db.json)`.*

#### Start the React Client:
```bash
cd client
npm install
npm run dev
```
*The React developer server will launch (typically at `http://localhost:5173`).*

---

## Complete Project Documentation

For a comprehensive guide covering the architectural design system, API payloads, mathematical formulas, state management, and file systems, read our detailed [DOCUMENTATION.md](file:///c:/ai_health_tracking/DOCUMENTATION.md).

You can also view the compiled PDF guide at [DOCUMENTATION.pdf](file:///c:/ai_health_tracking/DOCUMENTATION.pdf).
