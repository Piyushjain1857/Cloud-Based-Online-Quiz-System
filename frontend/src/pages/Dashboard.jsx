import { useState, useEffect } from 'react';
import axios from 'axios';
import StatCard from '../components/StatCard';
import QuizCard from '../components/QuizCard';
import { FileText, Users, Star } from 'lucide-react';
import { useUser } from '../context/UserContext';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useUser();
  const [stats, setStats] = useState({
    total_quizzes: 0,
    total_participants: '0',
    avg_score: '0%'
  });
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, quizzesRes] = await Promise.all([
          axios.get('http://localhost:3000/api/dashboard/stats'),
          axios.get('http://localhost:3000/api/quizzes/upcoming')
        ]);
        setStats(statsRes.data);
        setQuizzes(quizzesRes.data.quizzes);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-page">
      <section className="welcome-section">
        <h1>Welcome {user?.name ? user.name.split(' ')[0] : ''} to your Dashboard 👋</h1>
        <p>Here's what's happening with your quizzes today.</p>
      </section>

      <section className="stats-grid">
        <StatCard
          title="Total Quizzes"
          value={stats.total_quizzes}
          icon={<FileText size={24} />}
          variant="blue"
        />
        <StatCard
          title="Total Participants"
          value={stats.total_participants}
          icon={<Users size={24} />}
          variant="green"
        />
        <StatCard
          title="Avg. Score"
          value={stats.avg_score}
          icon={<Star size={24} />}
          variant="purple"
        />
      </section>

      <section className="upcoming-section">
        <div className="section-header">
          <h2>Upcoming Quizzes</h2>
          <a href="#" className="view-all">View All</a>
        </div>

        <div className="quiz-grid">
          {loading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="quiz-card skeleton"></div>)
          ) : (
            quizzes.map(quiz => <QuizCard key={quiz.id} quiz={quiz} />)
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
