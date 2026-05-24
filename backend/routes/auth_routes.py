from flask import Blueprint, request, jsonify
from controllers.auth_controller import (
    signup_controller, 
    login_controller, 
    get_profile_controller, 
    update_profile_controller
)
from middleware.auth_middleware import token_required

auth_blueprint = Blueprint('auth_routes', __name__)

@auth_blueprint.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    return signup_controller(data)

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    return login_controller(data)

@auth_blueprint.route('/me', methods=['GET'])
@token_required
def get_profile():
    user_id = request.user.get("user_id")
    return get_profile_controller(user_id)

@auth_blueprint.route('/profile', methods=['PUT'])
@token_required
def update_profile():
    user_id = request.user.get("user_id")
    data = request.get_json(silent=True) or {}
    return update_profile_controller(user_id, data)


