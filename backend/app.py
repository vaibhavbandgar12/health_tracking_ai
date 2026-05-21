from flask import Flask, jsonify
from flask_cors import CORS

# Import the database module to initialize the connection on application startup
from database.mongo import db

# Import routes
from routes.auth_routes import auth_blueprint
from routes.health_routes import health_blueprint

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Authorization", "Content-Type"]
    }
})

# Register routes
app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(health_blueprint, url_prefix='/health')

@app.route("/")
def home():
    # Verify DB initialization
    db_status = "Connected" if db is not None else "Failed to Connect"
    return jsonify({
        "Message": "Backend Running Successfully",
        "Database_Status": db_status
    })



if __name__ == "__main__":
    app.run(debug=True, port=8000)