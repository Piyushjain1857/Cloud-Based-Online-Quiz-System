import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import '../styles/quiz-screen.css';

const QuizScreen = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [results, setResults] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/quizzes/${id}`);
                if (!response.ok) throw new Error('Failed to fetch quiz');
                const data = await response.ok ? await response.json() : null;
                
                if (data) {
                    setQuiz(data);
                    // Parse duration like "45 Mins"
                    const minutes = parseInt(data.duration);
                    setTimeLeft(minutes * 60);
                } else {
                    setError('Quiz not found');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [id]);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitted) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isSubmitted && quiz) {
            submitQuiz();
        }
    }, [timeLeft, isSubmitted, quiz]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (optionIndex) => {
        if (isSubmitted) return;
        setAnswers({
            ...answers,
            [currentQuestionIndex]: optionIndex
        });
    };

    const submitQuiz = async () => {
        if (isSubmitted) return;
        
        try {
            const formattedAnswers = quiz.questions.map((_, index) => 
                answers[index] !== undefined ? answers[index] : null
            );

            const response = await fetch(`http://localhost:3000/api/quizzes/${id}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: formattedAnswers })
            });

            if (!response.ok) throw new Error('Submission failed');
            const resultData = await response.json();
            setResults(resultData);
            setIsSubmitted(true);
        } catch (err) {
            alert('Error submitting quiz: ' + err.message);
        }
    };

    if (loading) return <div className="loading-state">Loading Quiz...</div>;
    if (error) return (
        <div className="error-state">
            <AlertCircle size={48} />
            <h2>Oops! {error}</h2>
            <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
    );

    if (isSubmitted && results) {
        return (
            <div className="quiz-screen-container">
                <div className="question-card results-container">
                    <CheckCircle2 size={64} color="#10b981" style={{ marginBottom: '1rem' }} />
                    <h1>Quiz Completed!</h1>
                    <div className="score-circle" style={{ '--score-pct': `${results.percentage}%` }}>
                        <div className="score-value">{Math.round(results.percentage)}%</div>
                    </div>
                    <div className="results-stats">
                        <div className="stat-item">
                            <span className="label">Score</span>
                            <span className="value">{results.score} / {results.total_questions}</span>
                        </div>
                        <div className="stat-item">
                            <span className="label">Correct Answers</span>
                            <span className="value">{results.score}</span>
                        </div>
                    </div>
                    <button className="finish-btn" onClick={() => navigate('/dashboard')}>
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div className="quiz-screen-container">
            <header className="quiz-header">
                <div className="quiz-info">
                    <h1>{quiz.title}</h1>
                    <p>{quiz.subject}</p>
                </div>
                <div className={`quiz-timer ${timeLeft < 60 ? 'critical' : ''}`}>
                    <Clock size={18} />
                    <span>{formatTime(timeLeft)}</span>
                </div>
            </header>

            <main className="question-section">
                <div className="question-card">
                    <span className="question-number">Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                    <h2 className="question-text">{currentQuestion.text}</h2>

                    <div className="options-grid">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                className={`option-btn ${answers[currentQuestionIndex] === index ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(index)}
                            >
                                <div className="option-marker">{String.fromCharCode(65 + index)}</div>
                                <span>{option}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="quiz-navigation">
                    <button 
                        className="nav-btn prev-btn" 
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    >
                        <ChevronLeft size={20} />
                        Previous
                    </button>

                    {currentQuestionIndex === quiz.questions.length - 1 ? (
                        <button className="nav-btn submit-btn" onClick={submitQuiz}>
                            Submit Quiz
                        </button>
                    ) : (
                        <button 
                            className="nav-btn next-btn"
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        >
                            Next
                            <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default QuizScreen;
