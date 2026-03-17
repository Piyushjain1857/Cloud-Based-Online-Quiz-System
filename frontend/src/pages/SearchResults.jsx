import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearch } from '../context/SearchContext';
import QuizCard from '../components/QuizCard';
import { Search as SearchIcon, Frown } from 'lucide-react';
import '../styles/dashboard.css'; // Reuse dashboard styles for grids

const SearchResults = () => {
  const { searchQuery } = useSearch();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:3000/api/search?q=${searchQuery}`);
        setResults(response.data.quizzes);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(performSearch, 300); // Debounce
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="dashboard-page">
      <section className="welcome-section" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <SearchIcon size={28} className="text-primary" />
          <h1>Search Results for "{searchQuery}"</h1>
        </div>
        <p>Found {results.length} matches across all quizzes.</p>
      </section>

      {loading ? (
        <div className="quiz-grid">
          {Array(3).fill(0).map((_, i) => <div key={i} className="quiz-card skeleton"></div>)}
        </div>
      ) : results.length > 0 ? (
        <div className="quiz-grid">
          {results.map(quiz => <QuizCard key={quiz.id} quiz={quiz} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
          <Frown size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No quizzes found</h3>
          <p>Try searching for a different keyword or subject.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
