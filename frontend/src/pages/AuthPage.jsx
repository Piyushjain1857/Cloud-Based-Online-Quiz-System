import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import '../styles/auth.css';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });
      setSuccess('Login successful! Redirecting...');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:3000/api/auth/signup', formData);
      setSuccess('Account created successfully! Please log in.');
      setTimeout(() => {
        setIsLogin(true);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="background-anim">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <main className="auth-wrapper">
        <div className="auth-container">
          <div className="auth-info">
            <div className="info-content">
              <h1>Cloud Quiz</h1>
              <p>Unlock the power of interactive learning and assessment. Join our platform to create, take, and evaluate quizzes seamlessly.</p>
            </div>
          </div>

          <div className="auth-forms">
            {error && (
              <div className="notification error">
                <span>{error}</span>
                <X className="close-btn" size={16} onClick={() => setError('')} />
              </div>
            )}
            {success && (
              <div className="notification success">
                <span>{success}</span>
                <X className="close-btn" size={16} onClick={() => setSuccess('')} />
              </div>
            )}

            <div className={`form-section ${isLogin ? 'active' : ''}`}>
              <h2>Welcome Back</h2>
              <p className="subtitle">Log in to your account to continue</p>
              
              <form onSubmit={handleLogin}>
                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-field">
                    <Mail className="icon" size={18} />
                    <input 
                      type="email" 
                      name="email"
                      placeholder="you@example.com" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <div className="input-field">
                    <Lock className="icon" size={18} />
                    <input 
                      type="password" 
                      name="password"
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <Loader2 className="spinner" size={18} /> : 'Log In'}
                </button>
              </form>
              <p className="toggle-text">
                Don't have an account? <span className="toggle-link" onClick={() => setIsLogin(false)}>Sign Up</span>
              </p>
            </div>

            <div className={`form-section ${!isLogin ? 'active' : ''}`}>
              <h2>Create Account</h2>
              <p className="subtitle">Join us to start learning today</p>
              
              <form onSubmit={handleSignup}>
                <div className="input-group">
                  <label>Full Name</label>
                  <div className="input-field">
                    <User className="icon" size={18} />
                    <input 
                      type="text" 
                      name="name"
                      placeholder="John Doe" 
                      value={formData.name}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <div className="input-field">
                    <Mail className="icon" size={18} />
                    <input 
                      type="email" 
                      name="email"
                      placeholder="you@example.com" 
                      value={formData.email}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <div className="input-field">
                    <Lock className="icon" size={18} />
                    <input 
                      type="password" 
                      name="password"
                      placeholder="••••••••" 
                      value={formData.password}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <Loader2 className="spinner" size={18} /> : 'Sign Up'}
                </button>
              </form>
              <p className="toggle-text">
                Already have an account? <span className="toggle-link" onClick={() => setIsLogin(true)}>Log In</span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
