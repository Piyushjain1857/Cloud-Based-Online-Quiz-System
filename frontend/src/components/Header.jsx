import { Search, Bell, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
    return (
        <header className="top-header">
            <div className="search-bar">
                <Search size={18} className="search-icon" />
                <input type="text" placeholder="Search quizzes, subjects, or students..." />
            </div>
            
            <div className="header-actions">
                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="badge">3</span>
                </button>
                <Link to="/create-quiz" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                    <Plus size={18} /> Create New Quiz
                </Link>
            </div>
        </header>
    );
};

export default Header;
