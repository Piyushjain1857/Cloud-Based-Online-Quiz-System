from flask import Blueprint, request, jsonify
from core.data import users, user_settings

user_bp = Blueprint('user', __name__)

@user_bp.route('/profile', methods=['GET'])
def get_profile():
    # In a real app, this would use the session or a token
    # For now, we'll return the first user or mock data
    user = users[0] if users else {'name': 'Piyush Jain', 'email': 'piyush@example.com'}
    return jsonify({
        'profile': user,
        'settings': user_settings
    }), 200

@user_bp.route('/profile', methods=['PUT'])
def update_profile():
    data = request.json
    
    if 'profile' in data:
        # Update mock users list if necessary
        if users:
            users[0].update(data['profile'])
            
    if 'settings' in data:
        user_settings.update(data['settings'])
        
    return jsonify({'message': 'Profile updated successfully', 'settings': user_settings}), 200
