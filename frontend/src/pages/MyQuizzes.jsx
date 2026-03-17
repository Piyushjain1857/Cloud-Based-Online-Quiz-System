import { useState, useEffect } from 'react';
import axios from 'axios';
import QuizCard from '../components/QuizCard';
import { Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import '../styles/dashboard.css';

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery, setSearchQuery } = useSearch();
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
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.subject.toLowerCase().includes(searchQuery.toLowerCase())
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
            className="btn btn-primary" 
            style={{ gap: '0.8rem' }}
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
        background: 'var(--bg-card)',
        padding: '1rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
          <input 
            type="text" 
            placeholder="Filter your quizzes by title or subject..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem 1rem 0.75rem 3rem', 
              background: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-dark)',
              outline: 'none',
              fontSize: '1rem'
            }}
          />
        </div>
        <button className="btn btn-secondary" style={{ padding: '0 1.5rem' }}>
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
            <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>
              <div style={{ marginBottom: '1.5rem', opacity: 0.5 }}>
                <Search size={48} style={{ margin: '0 auto' }} />
              </div>
              <h3>No quizzes found</h3>
              <p>Try adjusting your search terms or create a new quiz.</p>
              {searchQuery && (
                <button 
                   className="btn btn-secondary" 
                   style={{ marginTop: '1.5rem' }} 
                   onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyQuizzes;
