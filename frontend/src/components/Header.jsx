import { Search, Bell, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useNotifications } from '../context/NotificationContext';
import '../styles/header.css';

const Header = () => {
    const { searchQuery, setSearchQuery } = useSearch();
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        const query = e.target.value;
        const currentPath = window.location.pathname;
        
        setSearchQuery(query);
        
        // Prevent redirect to /search if we are on My Quizzes, which handles its own filtering
        if (currentPath === '/my-quizzes') return;

        if (query.trim()) {
            navigate('/search');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <header className="top-header">
            <div className="search-bar">
                <Search size={18} className="search-icon" />
                <input 
                    type="text" 
                    placeholder="Search quizzes, subjects, or students..." 
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            
            <div className="header-actions">
                <Link to="/notifications" className="icon-btn">
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                </Link>
                <Link to="/create-quiz" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    <Plus size={18} /> Create New Quiz
                </Link>
            </div>
        </header>
    );
};

export default Header;
