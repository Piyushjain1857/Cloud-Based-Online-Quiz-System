from flask import Blueprint, request, jsonify
from core.data import notifications

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('', methods=['GET'])
def get_notifications():
    return jsonify({
        'message': 'Notifications fetched successfully.',
        'notifications': notifications,
        'unreadCount': len([n for n in notifications if not n['read']])
    }), 200

@notifications_bp.route('/read', methods=['POST'])
def mark_notifications_read():
    data = request.json
    notif_id = data.get('id')
    
    if notif_id == 'all':
        for n in notifications:
            n['read'] = True
    else:
        for n in notifications:
            if n['id'] == notif_id:
                n['read'] = True
                break
                
    return jsonify({
        'message': 'Notifications marked as read.',
        'unreadCount': len([n for n in notifications if not n['read']])
    }), 200
