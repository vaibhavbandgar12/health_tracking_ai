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

import json
from datetime import datetime
from bson import ObjectId

class MockCollection:
    def __init__(self, db_instance, collection_name):
        self.db_instance = db_instance
        self.collection_name = collection_name

    def _get_data(self):
        return self.db_instance._read_db()

    def _save_data(self, data):
        self.db_instance._write_db(data)

    def insert_one(self, doc):
        data = self._get_data()
        if self.collection_name not in data:
            data[self.collection_name] = []
        
        doc_copy = doc.copy()
        if "_id" not in doc_copy:
            doc_copy["_id"] = str(ObjectId())
        
        for k, v in doc_copy.items():
            if isinstance(v, datetime):
                doc_copy[k] = v.isoformat()
            elif isinstance(v, ObjectId):
                doc_copy[k] = str(v)
                
        data[self.collection_name].append(doc_copy)
        self._save_data(data)
        doc["_id"] = doc_copy["_id"]
        return doc_copy

    def find_one(self, query):
        data = self._get_data()
        if self.collection_name not in data:
            return None
        
        for doc in data[self.collection_name]:
            match = True
            for k, v in query.items():
                val = doc.get(k)
                if str(val) != str(v):
                    match = False
                    break
            if match:
                return doc
        return None

    def find(self, query):
        data = self._get_data()
        if self.collection_name not in data:
            results = []
        else:
            results = []
            for doc in data[self.collection_name]:
                match = True
                for k, v in query.items():
                    val = doc.get(k)
                    if str(val) != str(v):
                        match = False
                        break
                if match:
                    results.append(doc)
        
        class MockCursor:
            def __init__(self, items):
                self.items = items
            def sort(self, key, direction=-1):
                reverse = True if direction == -1 else False
                self.items.sort(key=lambda x: x.get(key, ''), reverse=reverse)
                return self
            def __iter__(self):
                return iter(self.items)
                
        return MockCursor(results)

    def delete_one(self, query):
        data = self._get_data()
        if self.collection_name not in data:
            return type('obj', (object,), {'deleted_count': 0})()
            
        initial_len = len(data[self.collection_name])
        data[self.collection_name] = [
            doc for doc in data[self.collection_name]
            if not all(str(doc.get(k)) == str(v) for k, v in query.items())
        ]
        self._save_data(data)
        return type('obj', (object,), {'deleted_count': initial_len - len(data[self.collection_name])})()

    def update_one(self, query, update_dict):
        data = self._get_data()
        if self.collection_name not in data:
            return type('obj', (object,), {'modified_count': 0})()
            
        modified = 0
        set_data = update_dict.get("$set", {})
        for doc in data[self.collection_name]:
            match = True
            for k, v in query.items():
                if str(doc.get(k)) != str(v):
                    match = False
                    break
            if match:
                for uk, uv in set_data.items():
                    doc[uk] = uv
                modified += 1
                break
        if modified > 0:
            self._save_data(data)
        return type('obj', (object,), {'modified_count': modified})()

class MockDB:
    def __init__(self, file_path='db.json'):
        self.file_path = file_path
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w') as f:
                json.dump({"users": [], "health_records": [], "predictions": [], "recommendations": []}, f, indent=2)

    def _read_db(self):
        try:
            with open(self.file_path, 'r') as f:
                return json.load(f)
        except Exception:
            return {"users": [], "health_records": [], "predictions": [], "recommendations": []}

    def _write_db(self, data):
        with open(self.file_path, 'w') as f:
            json.dump(data, f, indent=2)

    def __getitem__(self, item):
        return MockCollection(self, item)

# Reusable db object exported for convenience
is_mock_db = False
try:
    db = get_database()
except Exception as e:
    logger.warning("\n[DATABASE WARNING] Could not connect to MongoDB server.")
    logger.warning("Falling back to local file-based database (db.json).\n")
    is_mock_db = True
    db = MockDB()

def is_database_mock():
    return is_mock_db

def get_database_status():
    return 'Connected (JSON Fallback)' if is_mock_db else 'Connected'
