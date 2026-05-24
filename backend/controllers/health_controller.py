from flask import jsonify
from database.mongo import db
from datetime import datetime, timezone

def compute_health_metrics(record):
    try:
        weight = float(record["weight"])
        height = float(record["height"])
        age = int(record["age"])
        sleep_hours = float(record["sleep_hours"])
        calories_consumed = float(record["calories_consumed"])
        exercise_minutes = float(record["exercise_minutes"])
        heart_rate = float(record.get("heart_rate") or 72)
        water_intake = float(record.get("water_intake") or 2.0)
        gender = record.get("gender") or "Male"
    except (ValueError, TypeError, KeyError):
        # Return basic fallbacks if fields are missing or corrupt
        return {
            "bmi": 0.0,
            "bmi_category": "Normal weight",
            "calorie_needs": 2000,
            "health_risk_score": 75,
            "sleep_quality": "Good",
            "risk_level": "Low",
            "recommendation_workout": "Excellent workout routine!",
            "recommendation_diet": "Maintain a balanced diet.",
            "recommendation_sleep": "Excellent sleep duration!",
            "workout_tips": [],
            "diet_tips": [],
            "sleep_tips": [],
            "recommendations": []
        }

    # Calculations
    bmi = round(weight / ((height / 100) ** 2), 2)
    bmi_category = "Normal weight"
    if bmi < 18.5:
        bmi_category = "Underweight"
    elif 25 <= bmi < 30:
        bmi_category = "Overweight"
    elif bmi >= 30:
        bmi_category = "Obesity"

    # BMR + Calorie Needs
    if gender == "Male":
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
    else:
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
    calorie_needs = round(bmr * 1.2 + (exercise_minutes * 5))

    # Health Score
    health_score = 100
    if bmi < 18.5 or bmi >= 25:
        health_score -= 10
    if bmi >= 30:
        health_score -= 10
    if sleep_hours < 7 or sleep_hours > 9:
        health_score -= 15
    if heart_rate < 60 or heart_rate > 100:
        health_score -= 15
    if exercise_minutes < 30:
        health_score -= 10
    if water_intake < 2.0:
        health_score -= 10
    health_score = max(10, min(100, health_score))

    # Sleep Quality
    sleep_quality = "Good"
    if sleep_hours >= 7.5 and sleep_hours <= 9:
        sleep_quality = "Excellent"
    elif sleep_hours >= 7:
        sleep_quality = "Good"
    elif sleep_hours >= 5.5:
        sleep_quality = "Fair"
    else:
        sleep_quality = "Poor"

    # Risk Level
    risk_level = "Low"
    if health_score >= 85:
        risk_level = "Low"
    elif health_score >= 70:
        risk_level = "Moderate"
    else:
        risk_level = "High"

    # Recommendation lists
    workout_tips = []
    diet_tips = []
    sleep_tips = []

    if 30 <= exercise_minutes <= 90:
        workout_tips.append("Excellent workout routine! Maintain consistency.")
    if bmi_category == "Normal weight":
        diet_tips.append("Maintain a balanced diet with plenty of fiber and lean proteins.")
    if 7 <= sleep_hours <= 9:
        sleep_tips.append("Excellent sleep duration! Keep maintaining this routine.")

    if bmi_category in ["Obesity", "Overweight"]:
        workout_tips.append("45 min cardio daily")
        workout_tips.append("strength training 3x/week")
        diet_tips.append("300 kcal daily deficit")
        diet_tips.append("increase protein to 120g")
        diet_tips.append("Focus on a small calorie-deficit diet rich in whole foods, protein, and vegetables.")
    elif bmi_category == "Underweight":
        diet_tips.append("Increase intake of nutrient-dense whole foods and healthy fats.")

    if risk_level == "High":
        workout_tips.append("low-intensity only this week")
        workout_tips.append("flag for doctor consultation")

    if sleep_quality in ["Poor", "Fair"]:
        sleep_tips.append("consistent bedtime before 11pm")
        sleep_tips.append("no caffeine after 2pm")
        sleep_tips.append("no screens 1hr before bed")
        sleep_tips.append("Aim for 7-8 hours of quality sleep to support recovery and cognitive function.")
    elif sleep_hours > 9:
        sleep_tips.append("Try to avoid oversleeping; keep sleep duration between 7-9 hours.")

    if exercise_minutes < 30:
        workout_tips.append("Try to aim for at least 30 minutes of moderate exercise daily.")
    elif exercise_minutes > 90:
        workout_tips.append("Great exercise levels, but ensure you include recovery days.")

    if heart_rate > 90:
        workout_tips.append("focus on low-impact exercise")

    if water_intake < 2.0:
        diet_tips.append("increase water intake to at least 2.5L-3.0L daily")

    return {
        "bmi": bmi,
        "bmi_category": bmi_category,
        "calorie_needs": calorie_needs,
        "health_risk_score": health_score,
        "sleep_quality": sleep_quality,
        "risk_level": risk_level,
        "recommendation_workout": workout_tips[-1] if workout_tips else "Excellent workout routine! Maintain consistency.",
        "recommendation_diet": diet_tips[-1] if diet_tips else "Maintain a balanced diet with plenty of fiber and lean proteins.",
        "recommendation_sleep": sleep_tips[-1] if sleep_tips else "Excellent sleep duration! Keep maintaining this routine.",
        "workout_tips": workout_tips,
        "diet_tips": diet_tips,
        "sleep_tips": sleep_tips,
        "recommendations": sleep_tips + diet_tips + workout_tips
    }

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
        water_intake = float(data.get("water_intake") or 2.0)
        gender = data.get("gender") or "Male"
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
            "water_intake": water_intake,
            "gender": gender,
            "created_at": datetime.now(timezone.utc)
        }
        
        result = health_records.insert_one(record)
        record_id = str(result.get("_id") or record.get("_id"))

        metrics = compute_health_metrics({
            "weight": weight,
            "height": height,
            "age": age,
            "sleep_hours": sleep_hours,
            "calories_consumed": calories_consumed,
            "exercise_minutes": exercise_minutes,
            "heart_rate": heart_rate,
            "water_intake": water_intake,
            "gender": gender
        })

        # Save to predictions collection
        db["predictions"].insert_one({
            "user_id": user_id,
            "record_id": record_id,
            "bmi": metrics["bmi"],
            "bmi_category": metrics["bmi_category"],
            "health_score": metrics["health_risk_score"],
            "risk_level": metrics["risk_level"],
            "calorie_needs": metrics["calorie_needs"],
            "sleep_quality": metrics["sleep_quality"],
            "created_at": datetime.now(timezone.utc)
        })

        # Save to recommendations collection
        db["recommendations"].insert_one({
            "user_id": user_id,
            "record_id": record_id,
            "workout": metrics["workout_tips"],
            "diet": metrics["diet_tips"],
            "sleep": metrics["sleep_tips"],
            "created_at": datetime.now(timezone.utc)
        })
        
        response_data = {
            "success": True,
            "message": "Health record added successfully",
            "data": {
                "_id": record_id,
                "user_id": user_id,
                "weight": weight,
                "height": height,
                "age": age,
                "sleep_hours": sleep_hours,
                "calories_consumed": calories_consumed,
                "exercise_minutes": exercise_minutes,
                "heart_rate": heart_rate,
                "water_intake": water_intake,
                "gender": gender,
                "created_at": record["created_at"].isoformat() if isinstance(record["created_at"], datetime) else record["created_at"],
                "health_score": metrics["health_risk_score"],
                "recommendations": metrics["recommendations"]
            },
            **metrics
        }
        return jsonify(response_data), 201
        
    except Exception as e:
        return jsonify({"error": "Failed to add health record"}), 500

def get_health_history(user_id: str):
    try:
        health_records = db["health_records"]
        records_cursor = health_records.find({"user_id": user_id}).sort("created_at", -1)
        
        records = []
        for doc in records_cursor:
            doc["_id"] = str(doc["_id"])
            if "created_at" in doc:
                if isinstance(doc["created_at"], datetime):
                    doc["created_at"] = doc["created_at"].isoformat()
                elif isinstance(doc["created_at"], str):
                    pass
                doc["date"] = doc["created_at"]
                
            metrics = compute_health_metrics(doc)
            records.append({**doc, **metrics})
            
        return jsonify(records), 200
        
    except Exception as e:
        return jsonify({"error": "Failed to retrieve health history"}), 500

def delete_health_record(user_id: str, record_id: str):
    try:
        health_records = db["health_records"]
        result = health_records.delete_one({"_id": record_id, "user_id": user_id})
        
        db["predictions"].delete_one({"record_id": record_id, "user_id": user_id})
        db["recommendations"].delete_one({"record_id": record_id, "user_id": user_id})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Health record not found or unauthorized"}), 404
            
        return jsonify({"success": True, "message": "Health record deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Failed to delete health record"}), 500

def get_latest_prediction_controller(user_id):
    try:
        predictions = db["predictions"]
        cursor = predictions.find({"user_id": user_id}).sort("created_at", -1)
        latest = None
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            if "created_at" in doc and isinstance(doc["created_at"], datetime):
                doc["created_at"] = doc["created_at"].isoformat()
            latest = doc
            break
            
        if not latest:
            return jsonify({"error": "No predictions found"}), 404
        return jsonify(latest), 200
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

def get_latest_recommendation_controller(user_id):
    try:
        recommendations = db["recommendations"]
        cursor = recommendations.find({"user_id": user_id}).sort("created_at", -1)
        latest = None
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            if "created_at" in doc and isinstance(doc["created_at"], datetime):
                doc["created_at"] = doc["created_at"].isoformat()
            latest = doc
            break
            
        if not latest:
            return jsonify({"error": "No recommendations found"}), 404
        return jsonify(latest), 200
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

def get_analytics_controller(user_id, period):
    try:
        health_records = db["health_records"]
        all_records = list(health_records.find({"user_id": user_id}).sort("created_at", -1))
        
        cutoff = datetime.min.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        
        if period == 'daily':
            cutoff = datetime(now.year, now.month, now.day, tzinfo=timezone.utc)
        elif period == 'weekly':
            from datetime import timedelta
            cutoff = now - timedelta(days=7)
        elif period == 'monthly':
            from datetime import timedelta
            cutoff = now - timedelta(days=30)
            
        filtered = []
        for r in all_records:
            created_at = r.get("created_at")
            if isinstance(created_at, str):
                created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            if created_at.tzinfo is None:
                created_at = created_at.replace(tzinfo=timezone.utc)
            if created_at >= cutoff:
                r_copy = r.copy()
                r_copy["_id"] = str(r_copy["_id"])
                if isinstance(r_copy["created_at"], datetime):
                    r_copy["created_at"] = r_copy["created_at"].isoformat()
                r_copy["date"] = r_copy["created_at"]
                filtered.append(r_copy)
                
        if not filtered:
            stats = {
                "count": 0,
                "avg_weight": 0,
                "avg_sleep": 0,
                "avg_calories": 0,
                "total_exercise": 0,
                "avg_exercise": 0,
                "avg_heart_rate": 0,
                "avg_water": 0
            }
        else:
            count = len(filtered)
            total_weight = sum(float(r.get("weight") or 0) for r in filtered)
            total_sleep = sum(float(r.get("sleep_hours") or 0) for r in filtered)
            total_calories = sum(float(r.get("calories_consumed") or 0) for r in filtered)
            total_exercise = sum(float(r.get("exercise_minutes") or 0) for r in filtered)
            total_heart_rate = sum(float(r.get("heart_rate") or 72) for r in filtered)
            total_water = sum(float(r.get("water_intake") or 2.0) for r in filtered)
            
            stats = {
                "count": count,
                "avg_weight": round(total_weight / count, 2),
                "avg_sleep": round(total_sleep / count, 2),
                "avg_calories": round(total_calories / count, 2),
                "total_exercise": total_exercise,
                "avg_exercise": round(total_exercise / count, 2),
                "avg_heart_rate": round(total_heart_rate / count, 2),
                "avg_water": round(total_water / count, 2)
            }
            
        return jsonify({"period": period, "stats": stats, "records": filtered}), 200
    except Exception as e:
        return jsonify({"error": "Failed to calculate analytics"}), 500
