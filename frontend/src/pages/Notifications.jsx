import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { Bell, Info, Star, BookOpen, Clock, CheckCircle2, MoreHorizontal, Send, Megaphone } from 'lucide-react';
import '../styles/notifications.css';

const Notifications = () => {
  const { notifications, loading, markAsRead, refreshNotifications } = useNotifications();
  const { user } = useUser();
  const [filter, setFilter] = useState('all');
  const [broadcast, setBroadcast] = useState({ title: '', message: '', type: 'system' });
  const [broadcasting, setBroadcasting] = useState(false);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcast.title || !broadcast.message) return;

    setBroadcasting(true);
    try {
      await axios.post('http://localhost:3000/api/notifications/broadcast', broadcast);
      setBroadcast({ title: '', message: '', type: 'system' });
      alert('Broadcast sent successfully!');
      if (refreshNotifications) refreshNotifications();
    } catch (err) {
      console.error('Error broadcasting:', err);
      alert('Failed to send broadcast.');
    } finally {
      setBroadcasting(false);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'quiz': return <BookOpen size={24} />;
      case 'system': return <Info size={24} />;
      case 'performance': return <Star size={24} />;
      default: return <Bell size={24} />;
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with your latest quiz activities and alerts.</p>
        </div>
        <div className="notif-actions">
          <button 
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`btn ${filter === 'unread' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('unread')}
          >
            Unread
          </button>
          <button className="btn btn-secondary" onClick={() => markAsRead('all')}>
            Mark all read
          </button>
        </div>
      </div>

      {user?.role === 'admin' && (
        <section className="admin-broadcast-section">
          <form className="broadcast-form" onSubmit={handleBroadcast}>
            <h2><Megaphone size={20} /> Broadcast Announcement</h2>
            <div className="broadcast-inputs">
              <input 
                type="text" 
                placeholder="Notification Title" 
                value={broadcast.title}
                onChange={(e) => setBroadcast({...broadcast, title: e.target.value})}
                required
              />
              <select 
                value={broadcast.type}
                onChange={(e) => setBroadcast({...broadcast, type: e.target.value})}
              >
                <option value="system">System Alert</option>
                <option value="quiz">Quiz Related</option>
                <option value="performance">Performance Update</option>
                <option value="general">General Notification</option>
              </select>
            </div>
            <textarea 
              placeholder="Type your message to all users..." 
              value={broadcast.message}
              onChange={(e) => setBroadcast({...broadcast, message: e.target.value})}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={broadcasting} style={{ alignSelf: 'flex-end', gap: '8px' }}>
              {broadcasting ? 'Sending...' : <><Send size={18} /> Send Broadcast</>}
            </button>
          </form>
        </section>
      )}

      <div className="notif-list">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="notif-card skeleton" style={{ height: '120px' }}></div>)
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map(notif => (
            <div 
              key={notif.id} 
              className={`notif-card ${!notif.read ? 'unread' : ''}`}
              onClick={() => !notif.read && markAsRead(notif.id)}
            >
              <div className={`notif-icon-wrapper ${notif.type}`}>
                {getIcon(notif.type)}
              </div>
              <div className="notif-content">
                <h3>{notif.title}</h3>
                <p>{notif.message}</p>
                <div className="notif-time">
                  <Clock size={14} />
                  <span>{notif.time}</span>
                </div>
              </div>
              {!notif.read && <div className="notif-dot"></div>}
            </div>
          ))
        ) : (
          <div className="empty-notifications">
            <Bell size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <h3>No notifications found</h3>
            <p>You're all caught up! Check back later for new alerts.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
