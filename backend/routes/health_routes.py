from flask import Blueprint, request
from controllers.health_controller import (
    add_health_record, 
    get_health_history, 
    delete_health_record
)
from middleware.auth_middleware import token_required

# Create a separate blueprint for health related features
health_blueprint = Blueprint('health_routes', __name__)

@health_blueprint.route('/add', methods=['POST'])
@health_blueprint.route('/record', methods=['POST'])
@token_required
def add_record():
    """
    Saves a new health record bound to the authenticated user.
    """
    data = request.get_json(silent=True) or {}
    user_id = request.user.get("user_id")
    
    return add_health_record(user_id, data)

@health_blueprint.route('/history', methods=['GET'])
@token_required
def get_history():
    """
    Fetches the health context timeline for the authenticated user natively.
    """
    user_id = request.user.get("user_id")
    
    return get_health_history(user_id)

@health_blueprint.route('/record/<id>', methods=['DELETE'])
@token_required
def delete_record_route(id):
    """
    Deletes a specific vitals entry.
    """
    user_id = request.user.get("user_id")
    
    return delete_health_record(user_id, id)
