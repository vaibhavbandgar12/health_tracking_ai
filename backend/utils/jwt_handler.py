import os
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

# Load environment variables (useful if not already loaded in the main app)
load_dotenv()

JWT_SECRET = os.environ.get("JWT_SECRET", "your-default-secret-key-here")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = int(os.environ.get("JWT_EXPIRATION_HOURS", 24))

def generate_token(payload: dict, expires_in_hours: int = None) -> str:
    """
    Generates a JWT token encoding the provided payload.
    """
    expiration = expires_in_hours if expires_in_hours is not None else JWT_EXPIRATION_HOURS
    
    to_encode = payload.copy()
    expire_time = datetime.now(timezone.utc) + timedelta(hours=expiration)
    
    to_encode.update({"exp": expire_time})
    
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    """
    Verifies a JWT token and returns the decoded payload.
    Raises jwt.ExpiredSignatureError or jwt.InvalidTokenError if invalid.
    """
    try:
        decoded_payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_payload
    except Exception as e:
        # Re-raise the exception to be handled by the caller (API route/middleware)
        raise e
