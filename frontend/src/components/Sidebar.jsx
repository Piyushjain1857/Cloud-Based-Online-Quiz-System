import { NavLink, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, List, BarChart2, Settings, Cloud, LogOut } from 'lucide-react';
import { useUser } from '../context/UserContext';
import '../styles/sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const { user, loading } = useUser();
  
  const userName = user?.name || 'Admin';
  const profileImage = user?.profileImage;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Cloud size={24} className="logo-icon" />
          <span>Cloud Quiz</span>
        </div>
      </div>
      
      <ul className="nav-links">
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <Home size={20} /> <span>Dashboard</span>
          </NavLink>
        </li>
        {user?.role === 'admin' && (
          <li>
            <NavLink to="/create-quiz" className={({ isActive }) => isActive ? 'active' : ''}>
              <PlusCircle size={20} /> <span>Create Quiz</span>
            </NavLink>
          </li>
        )}
        <li>
          <NavLink to="/my-quizzes">
            <List size={20} /> <span>My Quizzes</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/analytics">
            <BarChart2 size={20} /> <span>Analytics</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/settings">
            <Settings size={20} /> <span>Settings</span>
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-footer">
        <div className="user-profile">
          <img 
            src={profileImage || `https://ui-avatars.com/api/?name=${userName}&background=4F46E5&color=fff`} 
            alt="User Avatar" 
            className="avatar" 
          />
          <div className="user-info">
            <p className="name">Welcome, {userName.split(' ')[0]}!</p>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
