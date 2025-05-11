from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from models.models import User
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    db = current_app.config['DB']
    user_model = User(db)

    if user_model.find_by_email(data['email']):
        return jsonify({'message': 'User already exists'}), 400

    user_id = user_model.create_user(data['email'], data['email'], data['password'])
    return jsonify({'message': 'User registered', 'userId': user_id}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    db = current_app.config['DB']
    user_model = User(db)
    user = user_model.find_by_email(data['email'])
    if user and user_model.check_password(user['password'], data['password']):
        access_token = create_access_token(
            identity={"userId": str(user['_id']), "email": user['email']},
            expires_delta=timedelta(days=1)
        )
        return jsonify({
            "token": access_token,
            "user": {
                "id": str(user['_id']),
                "email": user['email']
            }
        }), 200
    return jsonify({'message': 'Invalid credentials'}), 401
