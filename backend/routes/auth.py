import time
from flask import Blueprint, request, jsonify
from core.data import users

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'error': 'All fields are required.'}), 400

    # Check if user already exists
    for u in users:
        if u['email'] == email:
            return jsonify({'error': 'User with this email already exists.'}), 400

    # Add new user
    new_user = {
        'id': str(int(time.time() * 1000)),
        'name': name,
        'email': email,
        'password': password  # WARNING: In a real app, never store plain text passwords!
    }

    users.append(new_user)
    return jsonify({
        'message': 'User created successfully.',
        'user': {
            'id': new_user['id'],
            'name': new_user['name'],
            'email': new_user['email']
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required.'}), 400

    # Find user
    user = next((u for u in users if u['email'] == email), None)
    
    if not user:
        return jsonify({'error': 'Invalid email or password.'}), 401

    # Check password
    if user['password'] != password:
        return jsonify({'error': 'Invalid email or password.'}), 401

    return jsonify({
        'message': 'Login successful.',
        'user': {
            'id': user['id'],
            'name': user['name'],
            'email': user['email']
        }
    }), 200
