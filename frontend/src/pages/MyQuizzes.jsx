import { useState, useEffect } from 'react';
import axios from 'axios';
import QuizCard from '../components/QuizCard';
import { Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/dashboard.css'; // Reuse dashboard styles for consistency

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/quizzes/my-quizzes');
        setQuizzes(response.data.quizzes);
      } catch (err) {
        console.error('Error fetching my quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <section className="welcome-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>My Quizzes</h1>
            <p>Manage and track the quizzes you've created.</p>
          </div>
          <button 
            className="action-btn" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              background: '#6366f1', 
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600'
            }}
            onClick={() => navigate('/create-quiz')}
          >
            <Plus size={20} /> Create New Quiz
          </button>
        </div>
      </section>

      <div className="search-bar-container" style={{ 
        margin: '2rem 0', 
        display: 'flex', 
        gap: '1rem',
        background: 'rgba(255, 255, 255, 0.05)',
        padding: '1rem',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input 
            type="text" 
            placeholder="Search quizzes by title or subject..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem 0.75rem 3rem', 
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              color: '#fff',
              outline: 'none'
            }}
          />
        </div>
        <button style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          background: 'transparent', 
          color: '#fff',
          padding: '0.75rem 1rem',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          cursor: 'pointer'
        }}>
          <Filter size={20} /> Filter
        </button>
      </div>

      <section className="upcoming-section">
        <div className="quiz-grid">
          {loading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="quiz-card skeleton"></div>)
          ) : filteredQuizzes.length > 0 ? (
            filteredQuizzes.map(quiz => <QuizCard key={quiz.id} quiz={quiz} />)
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#9ca3af', gridColumn: '1 / -1' }}>
              <p>No quizzes found matching your search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyQuizzes;
