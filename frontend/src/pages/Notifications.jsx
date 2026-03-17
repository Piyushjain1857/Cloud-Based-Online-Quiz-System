import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { Bell, Info, Star, BookOpen, Clock, CheckCircle2, MoreHorizontal } from 'lucide-react';
import '../styles/notifications.css';

const Notifications = () => {
  const { notifications, loading, markAsRead } = useNotifications();
  const [filter, setFilter] = useState('all');

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
