import { Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/quiz-card.css';

const QuizCard = ({ quiz }) => {
  const navigate = useNavigate();

  return (
    <div className="quiz-card">
      <span className="quiz-badge">{quiz.status}</span>
      <div className="quiz-subject">{quiz.subject}</div>
      <h3 className="quiz-title">{quiz.title}</h3>
      
      <div className="quiz-meta">
        <div className="meta-item">
          <Calendar size={14} />
          <span>{quiz.date}</span>
        </div>
        <div className="meta-item">
          <Clock size={14} />
          <span>{quiz.time} ({quiz.duration})</span>
        </div>
      </div>
      
      <div className="quiz-footer">
        <div className="participants">
          <div className="participants-avatars">
            <img src={`https://ui-avatars.com/api/?name=1&background=random`} className="p-avatar" alt="p1" />
            <img src={`https://ui-avatars.com/api/?name=2&background=random`} className="p-avatar" alt="p2" />
            <img src={`https://ui-avatars.com/api/?name=3&background=random`} className="p-avatar" alt="p3" />
          </div>
          <span>+{quiz.participants} enrolled</span>
        </div>
        <button 
          className="action-btn" 
          onClick={() => navigate(`/quiz/${quiz.id}`)}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizCard;
