import bcrypt
from flask import jsonify
from database.mongo import db
from utils.jwt_handler import generate_token

def signup_controller(data):
    if not data or not all(k in data for k in ("name", "email", "password")):
        return jsonify({"message": "Missing required fields"}), 400

    name = data["name"]
    email = data["email"]
    password = data["password"]

    try:
        users = db["users"]
        if users.find_one({"email": email}):
            return jsonify({"message": "Email already exists"}), 409

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        user_doc = {
            "name": name,
            "email": email,
            "password": hashed_password.decode("utf-8"),
            "age": 26,
            "height": 178,
            "weight": 71.2,
            "gender": "Male",
            "targetCalories": 2300,
            "targetWater": 3.0,
            "targetSleep": 8
        }
        result = users.insert_one(user_doc)
        user_id = str(result.get("_id") or user_doc.get("_id"))

        payload = {
            "user_id": user_id,
            "email": email
        }
        token = generate_token(payload)

        return jsonify({
            "message": "User created successfully",
            "token": token,
            "access_token": token,
            "user": {
                "_id": user_id,
                "name": name,
                "email": email,
                "age": 26,
                "height": 178,
                "weight": 71.2,
                "gender": "Male",
                "targetCalories": 2300,
                "targetWater": 3.0,
                "targetSleep": 8
            }
        }), 201

    except Exception as e:
        return jsonify({"message": "Internal server error"}), 500

def login_controller(data):
    if not data or not all(k in data for k in ("email", "password")):
        return jsonify({"error": "Missing required fields"}), 400

    email = data["email"]
    password = data["password"]

    try:
        users = db["users"]
        user = users.find_one({"email": email})
        
        if not user or "password" not in user:
            return jsonify({"error": "Invalid credentials"}), 401
            
        stored_hash = user["password"]
        if isinstance(stored_hash, str):
            stored_hash = stored_hash.encode('utf-8')
            
        if not bcrypt.checkpw(password.encode('utf-8'), stored_hash):
            return jsonify({"error": "Invalid credentials"}), 401
            
        user_id = str(user["_id"])
        payload = {
            "user_id": user_id,
            "email": user["email"]
        }
        token = generate_token(payload)
        
        return jsonify({
            "token": token,
            "access_token": token,
            "user": {
                "_id": user_id,
                "name": user.get("name"),
                "email": user.get("email"),
                "age": user.get("age", 26),
                "height": user.get("height", 178),
                "weight": user.get("weight", 71.2),
                "gender": user.get("gender", "Male"),
                "targetCalories": user.get("targetCalories", 2300),
                "targetWater": user.get("targetWater", 3.0),
                "targetSleep": user.get("targetSleep", 8)
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

def get_profile_controller(user_id):
    try:
        users = db["users"]
        user = users.find_one({"_id": user_id})
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({
            "user": {
                "_id": str(user["_id"]),
                "name": user.get("name"),
                "email": user.get("email"),
                "age": user.get("age", 26),
                "height": user.get("height", 178),
                "weight": user.get("weight", 71.2),
                "gender": user.get("gender", "Male"),
                "targetCalories": user.get("targetCalories", 2300),
                "targetWater": user.get("targetWater", 3.0),
                "targetSleep": user.get("targetSleep", 8)
            }
        }), 200
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

def update_profile_controller(user_id, data):
    try:
        users = db["users"]
        user = users.find_one({"_id": user_id})
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        name = data.get("name")
        email = data.get("email")
        age = data.get("age")
        height = data.get("height")
        weight = data.get("weight")
        gender = data.get("gender")
        targetCalories = data.get("targetCalories")
        targetWater = data.get("targetWater")
        targetSleep = data.get("targetSleep")
        
        update_fields = {}
        if name: update_fields["name"] = name
        if email:
            dup = users.find_one({"email": email})
            if dup and str(dup["_id"]) != str(user_id):
                return jsonify({"error": "Email already exists"}), 409
            update_fields["email"] = email
            
        if age is not None: update_fields["age"] = int(age)
        if height is not None: update_fields["height"] = float(height)
        if weight is not None: update_fields["weight"] = float(weight)
        if gender: update_fields["gender"] = gender
        if targetCalories is not None: update_fields["targetCalories"] = int(targetCalories)
        if targetWater is not None: update_fields["targetWater"] = float(targetWater)
        if targetSleep is not None: update_fields["targetSleep"] = float(targetSleep)
        
        if update_fields:
            users.update_one({"_id": user_id}, {"$set": update_fields})
            
        updated_user = users.find_one({"_id": user_id})
        
        payload = {
            "user_id": str(updated_user["_id"]),
            "email": updated_user["email"]
        }
        token = generate_token(payload)
        
        return jsonify({
            "message": "Profile updated successfully",
            "token": token,
            "access_token": token,
            "user": {
                "_id": str(updated_user["_id"]),
                "name": updated_user.get("name"),
                "email": updated_user.get("email"),
                "age": updated_user.get("age", 26),
                "height": updated_user.get("height", 178),
                "weight": updated_user.get("weight", 71.2),
                "gender": updated_user.get("gender", "Male"),
                "targetCalories": updated_user.get("targetCalories", 2300),
                "targetWater": updated_user.get("targetWater", 3.0),
                "targetSleep": updated_user.get("targetSleep", 8)
            }
        }), 200
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
