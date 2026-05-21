from flask import jsonify
from database.mongo import db
from datetime import datetime, timezone

def add_health_record(user_id: str, data: dict):
    if not data:
        return jsonify({"error": "No health data provided"}), 400
        
    required_fields = ["weight", "height", "age", "sleep_hours", "calories_consumed", "exercise_minutes", "heart_rate"]
    for field in required_fields:
        if field not in data or data[field] is None:
            return jsonify({"error": f"Missing or invalid field: {field}"}), 400
        
    try:
        weight = float(data["weight"])
        height = float(data["height"])
        age = int(data["age"])
        sleep_hours = float(data["sleep_hours"])
        calories_consumed = float(data["calories_consumed"])
        exercise_minutes = float(data["exercise_minutes"])
        heart_rate = float(data["heart_rate"])
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid data format"}), 400

    if not (weight > 0): return jsonify({"error": "Invalid weight"}), 400
    if not (height > 0): return jsonify({"error": "Invalid height"}), 400
    if not (1 <= age <= 120): return jsonify({"error": "Invalid age"}), 400
    if not (0 <= sleep_hours <= 24): return jsonify({"error": "Invalid sleep_hours"}), 400
    if not (calories_consumed >= 0): return jsonify({"error": "Invalid calories_consumed"}), 400
    if not (exercise_minutes >= 0): return jsonify({"error": "Invalid exercise_minutes"}), 400
    if not (20 <= heart_rate <= 250): return jsonify({"error": "Invalid heart_rate"}), 400
        
    try:
        health_records = db["health_records"]
        record = {
            "user_id": user_id,
            "weight": weight,
            "height": height,
            "age": age,
            "sleep_hours": sleep_hours,
            "calories_consumed": calories_consumed,
            "exercise_minutes": exercise_minutes,
            "heart_rate": heart_rate,
            "created_at": datetime.now(timezone.utc)
        }
        
        health_records.insert_one(record)
        
        response_data = {
            "success": True,
            "message": "Health record added",
            "data": {
                "weight": weight,
                "height": height,
                "age": age,
                "sleep_hours": sleep_hours,
                "calories_consumed": calories_consumed,
                "exercise_minutes": exercise_minutes,
                "heart_rate": heart_rate,
                "health_score": 75,
                "recommendations": [
                    "Maintain consistent sleep schedule",
                    "Stay hydrated"
                ]
            },
            "bmi_category": "Pending",
            "bmi": 0.0,
            "health_risk_score": 75,
            "calorie_needs": 2000,
            "recommendation_workout": "Pending AI analysis",
            "recommendation_diet": "Stay hydrated",
            "recommendation_sleep": "Maintain consistent sleep schedule"
        }
        return jsonify(response_data), 201
        
    except Exception as e:
        return jsonify({"error": "Failed to add health record"}), 500

def get_health_history(user_id: str):
    try:
        health_records = db["health_records"]
        
        # Determine all records matching user_id & sort backwards by creation date (newest first)
        records_cursor = health_records.find({"user_id": user_id}).sort("created_at", -1)
        
        records = []
        for doc in records_cursor:
            doc["_id"] = str(doc["_id"])  # Cast ObjectId to string for valid JSON serialization
            if "created_at" in doc:
                # Convert datetime to ISO-8601 string
                doc["created_at"] = doc["created_at"].isoformat()
                # Ensure compatibility with Charts.jsx which expects 'date'
                doc["date"] = doc["created_at"]
                
            records.append(doc)
            
        return jsonify(records), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to retrieve health history"}), 500
