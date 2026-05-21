import bcrypt
from flask import jsonify
from database.mongo import db
from utils.jwt_handler import generate_token

def signup_controller(data):
    # Validate request payload
    if not data or not all(k in data for k in ("name", "email", "password")):
        return jsonify({"message": "Missing required fields"}), 400

    name = data["name"]
    email = data["email"]
    password = data["password"]

    try:
        users = db["users"]
        
        # Validate uniqueness
        if users.find_one({"email": email}):
            return jsonify({"message": "Email already exists"}), 409

        # Hash password securely
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        # Save user to database
        users.insert_one({
            "name": name,
            "email": email,
            "password": hashed_password.decode("utf-8")
        })

        return jsonify({"message": "User created successfully"}), 201

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
            
        payload = {
            "user_id": str(user["_id"]),
            "email": user["email"]
        }
        token = generate_token(payload)
        
        return jsonify({"token": token}), 200
        
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500
