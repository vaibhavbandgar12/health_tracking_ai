from flask import Blueprint, request
from controllers.health_controller import (
    get_latest_prediction_controller,
    get_latest_recommendation_controller,
    get_analytics_controller
)
from middleware.auth_middleware import token_required

predict_blueprint = Blueprint('predict_routes', __name__)

@predict_blueprint.route('/predict/latest', methods=['GET'])
@token_required
def get_latest_prediction():
    user_id = request.user.get("user_id")
    return get_latest_prediction_controller(user_id)

@predict_blueprint.route('/recommend/latest', methods=['GET'])
@token_required
def get_latest_recommendation():
    user_id = request.user.get("user_id")
    return get_latest_recommendation_controller(user_id)

@predict_blueprint.route('/analytics/<period>', methods=['GET'])
@token_required
def get_analytics(period):
    user_id = request.user.get("user_id")
    return get_analytics_controller(user_id, period)
