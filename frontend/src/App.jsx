import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import QuizScreen from './pages/QuizScreen';
import MyQuizzes from './pages/MyQuizzes';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import SearchResults from './pages/SearchResults';
import Notifications from './pages/Notifications';
import Layout from './layouts/MainLayout';
import { UserProvider } from './context/UserContext';
import { SearchProvider } from './context/SearchContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <UserProvider>
      <SearchProvider>
        <NotificationProvider>
          <Router>
            <Routes>
            <Route path="/" element={<AuthPage />} />
            
            {/* Protected Routes inside Layout */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-quiz" element={<CreateQuiz />} />
              <Route path="/quiz/:id" element={<QuizScreen />} />
              <Route path="/my-quizzes" element={<MyQuizzes />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
    </NotificationProvider>
    </SearchProvider>
  </UserProvider>
  );
}

export default App;
