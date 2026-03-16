import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { TrendingUp, Target, Award, BookOpen, ChevronRight } from 'lucide-react';
import '../styles/dashboard.css';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/analytics');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="dashboard-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <div style={{ color: '#6366f1', fontSize: '1.25rem', fontWeight: '600' }}>Loading Analytics...</div>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="dashboard-page" style={{ padding: '2rem' }}>
      <section className="welcome-section" style={{ marginBottom: '2.5rem' }}>
        <h1>Performance Analytics</h1>
        <p>Your learning journey, visualized.</p>
      </section>

      {/* Summary Cards */}
      <div className="stats-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <div className="card" style={{ padding: '1.5rem', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '600' }}>Avg. Score</span>
            <TrendingUp size={20} color="#6366f1" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>{data.summary.avg_score}%</div>
          <div style={{ fontSize: '0.85rem', color: '#10b981', marginTop: '0.5rem' }}>+5.2% from last week</div>
        </div>

        <div className="card" style={{ padding: '1.5rem', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '600' }}>Quizzes Taken</span>
            <BookOpen size={20} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>{data.summary.quizzes_taken}</div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>12 pending evaluation</div>
        </div>

        <div className="card" style={{ padding: '1.5rem', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '600' }}>Pass Rate</span>
            <Target size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>{data.summary.pass_rate}%</div>
          <div style={{ fontSize: '0.85rem', color: '#f59e0b', marginTop: '0.5rem' }}>Goal: 95%</div>
        </div>

        <div className="card" style={{ padding: '1.5rem', background: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '600' }}>Total Points</span>
            <Award size={20} color="#ef4444" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: '700', color: '#111827' }}>{data.summary.total_points}</div>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '0.5rem' }}>Top 5% of students</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Performance Trend Chart */}
        <div className="card" style={{ padding: '2rem', background: '#fff', minHeight: '400px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ marginBottom: '2rem', color: '#111827', fontSize: '1.25rem' }}>Score Trend</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={data.performance_trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: '600', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Breakdown Chart */}
        <div className="card" style={{ padding: '2rem', background: '#fff', minHeight: '400px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ marginBottom: '2rem', color: '#111827', fontSize: '1.25rem' }}>Subject Performance</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={data.subject_performance} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} width={120} tick={{fill: '#4b5563', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                  {data.subject_performance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      <section style={{ marginTop: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#111827' }}>Recent Achievements</h2>
          <button style={{ color: '#6366f1', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            View Badges <ChevronRight size={16} />
          </button>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {data.recent_achievements.map((achievement, idx) => (
            <div key={idx} className="card" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem', 
              padding: '1.25rem 2rem',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '16px'
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: idx === 0 ? '#eff6ff' : '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: idx === 0 ? '#3b82f6' : '#22c55e'
              }}>
                <Award size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, color: '#111827', fontSize: '1.05rem' }}>{achievement.title}</h4>
                <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>{achievement.description}</p>
              </div>
              <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{achievement.date}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Analytics;
