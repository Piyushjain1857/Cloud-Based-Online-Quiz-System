import time
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes (important for cross-origin requests from frontend)
CORS(app)

# In-memory "database"
users = [
    {
        'id': '1',
        'name': 'Piyush Jain',
        'email': 'piyush@example.com',
        'password': 'password123',
        'profileImage': None
    }
]

# Mock Notifications
notifications = [
    {
        'id': '1',
        'type': 'quiz',
        'title': 'New Quiz Assigned',
        'message': 'Advanced Python Concepts quiz has been assigned to you.',
        'time': '2 hours ago',
        'read': False
    },
    {
        'id': '2',
        'type': 'system',
        'title': 'System Maintenance',
        'message': 'Cloud Quiz will be down for maintenance on Saturday at 2 AM.',
        'time': '5 hours ago',
        'read': False
    },
    {
        'id': '3',
        'type': 'performance',
        'title': 'Weekly Performance Out!',
        'message': 'Your weekly performance report for last week is now available.',
        'time': '1 day ago',
        'read': True
    }
]

@app.route('/api/auth/signup', methods=['POST'])
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

@app.route('/api/auth/login', methods=['POST'])
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

# Mock User Settings
user_settings = {
    'notifications': {
        'email': True,
        'push': False,
        'quizReminders': True
    },
    'preferences': {
        'theme': 'light',
        'language': 'English'
    }
}

@app.route('/api/user/profile', methods=['GET'])
def get_profile():
    # In a real app, this would use the session or a token
    # For now, we'll return the first user or mock data
    user = users[0] if users else {'name': 'Piyush Jain', 'email': 'piyush@example.com'}
    return jsonify({
        'profile': user,
        'settings': user_settings
    }), 200

@app.route('/api/user/profile', methods=['PUT'])
def update_profile():
    global user_settings
    data = request.json
    
    if 'profile' in data:
        # Update mock users list if necessary
        if users:
            users[0].update(data['profile'])
            
    if 'settings' in data:
        user_settings.update(data['settings'])
        
    return jsonify({'message': 'Profile updated successfully', 'settings': user_settings}), 200

# Mock Data for Upcoming Quizzes
upcoming_quizzes = [
    {
        'id': '101',
        'title': 'Advanced Python Concepts',
        'subject': 'Computer Science',
        'date': '2026-03-20',
        'time': '10:00 AM',
        'duration': '45 Mins',
        'participants': 120,
        'status': 'upcoming'
    },
    {
        'id': '102',
        'title': 'World History: WWII',
        'subject': 'History',
        'date': '2026-03-22',
        'time': '02:00 PM',
        'duration': '60 Mins',
        'participants': 85,
        'status': 'upcoming'
    },
    {
        'id': '103',
        'title': 'Calculus II Midterm',
        'subject': 'Mathematics',
        'date': '2026-03-25',
        'time': '09:00 AM',
        'duration': '90 Mins',
        'participants': 200,
        'status': 'upcoming'
    }
]

@app.route('/api/quizzes/upcoming', methods=['GET'])
def get_upcoming_quizzes():
    return jsonify({
        'message': 'Upcoming quizzes fetched successfully.',
        'quizzes': upcoming_quizzes
    }), 200

@app.route('/api/quizzes/my-quizzes', methods=['GET'])
def get_my_quizzes():
    return jsonify({
        'message': 'My quizzes fetched successfully.',
        'quizzes': upcoming_quizzes
    }), 200

@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    return jsonify({
        'total_quizzes': len(upcoming_quizzes) + 21,
        'total_participants': '1,204',
        'avg_score': '78%'
    }), 200

@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    return jsonify({
        'summary': {
            'avg_score': 82,
            'quizzes_taken': 45,
            'pass_rate': 94,
            'total_points': 4200
        },
        'performance_trend': [
            {'date': '2026-03-10', 'score': 75},
            {'date': '2026-03-11', 'score': 80},
            {'date': '2026-03-12', 'score': 78},
            {'date': '2026-03-13', 'score': 85},
            {'date': '2026-03-14', 'score': 82},
            {'date': '2026-03-15', 'score': 88},
            {'date': '2026-03-16', 'score': 92}
        ],
        'subject_performance': [
            {'subject': 'Computer Science', 'score': 88},
            {'subject': 'Mathematics', 'score': 72},
            {'subject': 'History', 'score': 95},
            {'subject': 'Science', 'score': 78},
            {'subject': 'Geography', 'score': 84}
        ],
        'recent_achievements': [
            {'title': 'Python Pro', 'description': 'Scored 100% in Advanced Python', 'date': 'Today'},
            {'title': '3 Day Streak', 'description': 'Took quizzes for 3 days in a row', 'date': 'Yesterday'},
            {'title': 'Quick Learner', 'description': 'Completed World History in under 10 mins', 'date': '2 days ago'}
        ]
    }), 200

@app.route('/api/quizzes', methods=['POST'])
def create_quiz():
    data = request.json
    title = data.get('title')
    subject = data.get('subject')
    duration = data.get('duration')
    date_val = data.get('date')
    time_val = data.get('time')

    if not title or not subject or not duration or not date_val or not time_val:
        return jsonify({'error': 'All fields are required.'}), 400

    new_quiz = {
        'id': str(int(time.time() * 1000)),
        'title': title,
        'subject': subject,
        'date': date_val,
        'time': time_val,
        'duration': f"{duration} Mins",
        'participants': 0,
        'status': 'upcoming'
    }

    upcoming_quizzes.insert(0, new_quiz)

    return jsonify({
        'message': 'Quiz created successfully',
        'quiz': new_quiz
    }), 201

# In-memory store for full quizzes
full_quizzes = [
    {
        'id': '101',
        'title': 'Advanced Python Concepts',
        'subject': 'Computer Science',
        'duration': '45 Mins',
        'points': 100,
        'questions': [
            {
                'id': 1,
                'text': 'What is a decorator in Python?',
                'options': [
                    'A way to modify the behavior of a function or class',
                    'A graphical element in a GUI',
                    'A type of loop',
                    'A mathematical operator'
                ],
                'correctAnswer': 0
            },
            {
                'id': 2,
                'text': 'What does PEP 8 stand for?',
                'options': [
                    'Python Extension Protocol 8',
                    'Python Enhancement Proposal 8',
                    'Programming Essentials Part 8',
                    'Public Email Policy 8'
                ],
                'correctAnswer': 1
            },
            {
                'id': 3,
                'text': 'Which of the following is used to manage virtual environments in Python?',
                'options': [
                    'npm',
                    'pip',
                    'venv',
                    'git'
                ],
                'correctAnswer': 2
            }
        ]
    }
]

@app.route('/api/quizzes/<quiz_id>', methods=['GET'])
def get_quiz_details(quiz_id):
    quiz = next((q for q in full_quizzes if q['id'] == quiz_id), None)
    if not quiz:
        # Check if it exists in upcoming_quizzes but not full_quizzes (mock behavior)
        meta = next((q for q in upcoming_quizzes if q['id'] == quiz_id), None)
        if meta:
            # Create a mock full quiz if metadata exists but full data doesn't
            quiz = {
                **meta,
                'points': 100,
                'questions': [
                    {
                        'id': 1,
                        'text': f'Sample Question 1 for {meta["title"]}',
                        'options': ['Option A', 'Option B', 'Option C', 'Option D'],
                        'correctAnswer': 0
                    },
                    {
                        'id': 2,
                        'text': f'Sample Question 2 for {meta["title"]}',
                        'options': ['Option A', 'Option B', 'Option C', 'Option D'],
                        'correctAnswer': 1
                    }
                ]
            }
            return jsonify(quiz), 200
        return jsonify({'error': 'Quiz not found'}), 404
    return jsonify(quiz), 200

@app.route('/api/quizzes/<quiz_id>/submit', methods=['POST'])
def submit_quiz(quiz_id):
    data = request.json
    answers = data.get('answers', []) # List of indices
    
    quiz = next((q for q in full_quizzes if q['id'] == quiz_id), None)
    if not quiz:
        # Fallback for mock quizzes
        meta = next((q for q in upcoming_quizzes if q['id'] == quiz_id), None)
        if meta:
             quiz = {
                'questions': [
                    {'correctAnswer': 0},
                    {'correctAnswer': 0}
                ]
            }
        else:
            return jsonify({'error': 'Quiz not found'}), 404

    score = 0
    results = []
    
    for i, question in enumerate(quiz['questions']):
        user_answer = answers[i] if i < len(answers) else None
        is_correct = user_answer == question['correctAnswer']
        if is_correct:
            score += 1
        results.append({
            'question_id': i + 1,
            'correct': is_correct,
            'correct_answer': question['correctAnswer']
        })

    final_score_pct = (score / len(quiz['questions'])) * 100 if quiz['questions'] else 0
    
    return jsonify({
        'message': 'Quiz submitted successfully',
        'score': score,
        'total_questions': len(quiz['questions']),
        'percentage': final_score_pct,
        'results': results
    }), 200

@app.route('/api/quizzes/full', methods=['POST'])
def create_full_quiz():
    data = request.json
    title = data.get('title')
    subject = data.get('subject')
    duration = data.get('duration')
    points = data.get('points')
    date_val = data.get('date')
    time_val = data.get('time')
    questions = data.get('questions', [])

    if not title or not subject or not duration or not date_val or not time_val or not questions:
        return jsonify({'error': 'All fields and at least one question are required.'}), 400

    quiz_id = str(int(time.time() * 1000))

    new_quiz_meta = {
        'id': quiz_id,
        'title': title,
        'subject': subject,
        'date': date_val,
        'time': time_val,
        'duration': f"{duration} Mins",
        'participants': 0,
        'status': 'upcoming'
    }

    new_full_quiz = {
        **new_quiz_meta,
        'points': points,
        'questions': questions
    }

    # Save to both lists for dashboard and deeper views
    upcoming_quizzes.insert(0, new_quiz_meta)
    full_quizzes.append(new_full_quiz)

    return jsonify({
        'message': 'Full quiz created successfully',
        'quiz_id': quiz_id
    }), 201

@app.route('/api/search', methods=['GET'])
def search_quizzes():
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify({'quizzes': []}), 200
    
    results = [
        q for q in upcoming_quizzes
        if query in q['title'].lower() or query in q['subject'].lower()
    ]
    
    return jsonify({
        'message': f'Found {len(results)} quizzes.',
        'quizzes': results
    }), 200

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    return jsonify({
        'message': 'Notifications fetched successfully.',
        'notifications': notifications,
        'unreadCount': len([n for n in notifications if not n['read']])
    }), 200

@app.route('/api/notifications/read', methods=['POST'])
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

if __name__ == '__main__':
    # Run server on port 3000 to match the previous node.js frontend integration
    app.run(host='0.0.0.0', port=3000, debug=True)
