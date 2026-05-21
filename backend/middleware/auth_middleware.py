from functools import wraps
from flask import request, jsonify
import jwt
from utils.jwt_handler import verify_token

def token_required(f):
    """
    Decorator to protect Flask routes with JWT authentication.
    Expects 'Authorization: Bearer <token>' in headers.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        
        # Validate header presence and format
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid authorization token format"}), 401
            
        token = auth_header.split(" ")[1]
        
        try:
            # Decode token; throws exception on failure
            decoded_payload = verify_token(token)
            
            # Attach to Flask's global request object securely
            request.user = decoded_payload
            
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except Exception as e:
            return jsonify({"error": "An error occurred while verifying the token"}), 500
            
        return f(*args, **kwargs)
        
    return decorated
