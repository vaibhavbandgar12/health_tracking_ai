from flask import Flask, jsonify
from flask_cors import CORS

# Import the database module to initialize the connection on application startup
from database.mongo import db, get_database_status

# Import routes
from routes.auth_routes import auth_blueprint
from routes.health_routes import health_blueprint
from routes.predict_routes import predict_blueprint

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5173", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Authorization", "Content-Type"]
    }
})

# Register routes
app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(health_blueprint, url_prefix='/health')
app.register_blueprint(predict_blueprint, url_prefix='/')

@app.route("/")
def home():
    # Verify DB initialization
    return jsonify({
        "Message": "Backend Running Successfully",
        "Database_Status": get_database_status()
    })

if __name__ == "__main__":
    app.run(debug=True, port=8000)