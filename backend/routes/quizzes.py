import time
from flask import Blueprint, request, jsonify
from core.data import upcoming_quizzes, full_quizzes

quizzes_bp = Blueprint('quizzes', __name__)

@quizzes_bp.route('/upcoming', methods=['GET'])
def get_upcoming_quizzes():
    return jsonify({
        'message': 'Upcoming quizzes fetched successfully.',
        'quizzes': upcoming_quizzes
    }), 200

@quizzes_bp.route('/my-quizzes', methods=['GET'])
def get_my_quizzes():
    return jsonify({
        'message': 'My quizzes fetched successfully.',
        'quizzes': upcoming_quizzes
    }), 200

@quizzes_bp.route('', methods=['POST'])
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

@quizzes_bp.route('/<quiz_id>', methods=['GET'])
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

@quizzes_bp.route('/<quiz_id>/submit', methods=['POST'])
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

@quizzes_bp.route('/full', methods=['POST'])
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

@quizzes_bp.route('/search', methods=['GET'])
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
