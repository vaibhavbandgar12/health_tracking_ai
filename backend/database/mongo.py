import os
import logging
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

class MongoDBConnection:
    """
    Singleton class to manage MongoDB connection locally or via URI.
    Ensures only a single connection pool is utilized across the app.
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MongoDBConnection, cls).__new__(cls)
            cls._instance.client = None
            cls._instance.db = None
            cls._instance._connect()
        return cls._instance

    def _connect(self):
        """Establish connection to MongoDB."""
        try:
            # Load MONGO_URI from .env, fallback to localhost for development
            mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
            database_name = "health_tracking_ai"
            
            logger.info("Initializing MongoDB connection...")
            
            # Connect to MongoDB
            self.client = MongoClient(mongo_uri)
            
            # Verify connection using standard 'ping' command
            self.client.admin.command('ping')
            logger.info("Successfully connected to MongoDB.")
            
            # Set the reusable database object
            self.db = self.client[database_name]
            
        except ConnectionFailure as e:
            logger.error(f"Could not connect to MongoDB. Connection Failure: {e}")
            raise
        except ConfigurationError as e:
            logger.error(f"MongoDB configuration error. Please check MONGO_URI: {e}")
            raise
        except Exception as e:
            logger.error(f"An unexpected error occurred while connecting to MongoDB: {e}")
            raise

    def get_db(self):
        """Return the database instance."""
        if self.db is None:
            logger.warning("Database instance not found. Attempting to reconnect...")
            self._connect()
        return self.db

    def close(self):
        """Close the MongoDB connection pool."""
        if self.client:
            self.client.close()
            logger.info("MongoDB connection closed.")
            self.client = None
            self.db = None
            self._instance = None

def get_database():
    """
    Helper function to get the database instance directly.
    
    Usage:
        from database.mongo import get_database
        
        db = get_database()
        users_collection = db['users']
        users_collection.find_one(...)
    """
    connection = MongoDBConnection()
    return connection.get_db()

# Reusable db object exported for convenience
try:
    db = get_database()
except Exception as e:
    logger.error(f"Failed to initialize database on startup: {e}")
    db = None
