import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, Trash, X, ChevronRight, Loader2 } from 'lucide-react';
import axios from 'axios';
import '../styles/create-quiz.css';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [quizMeta, setQuizMeta] = useState({
    title: '',
    subject: '',
    duration: '',
    points: 100,
    date: '',
    time: ''
  });

  const [questions, setQuestions] = useState([
    { id: Date.now(), text: '', options: ['', ''], correctAnswerIndex: 0 }
  ]);

  const handleMetaChange = (e) => {
    setQuizMeta({ ...quizMeta, [e.target.id]: e.target.value });
  };

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), text: '', options: ['', ''], correctAnswerIndex: 0 }]);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleQuestionChange = (id, text) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const addOption = (qId) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, options: [...q.options, ''] } : q));
  };

  const removeOption = (qId, optIndex) => {
    setQuestions(questions.map(q => {
      if (q.id === qId && q.options.length > 2) {
        const newOptions = q.options.filter((_, i) => i !== optIndex);
        let newCorrect = q.correctAnswerIndex;
        if (newCorrect === optIndex) newCorrect = 0;
        else if (newCorrect > optIndex) newCorrect--;
        return { ...q, options: newOptions, correctAnswerIndex: newCorrect };
      }
      return q;
    }));
  };

  const handleOptionChange = (qId, optIndex, value) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleCorrectChange = (qId, optIndex) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, correctAnswerIndex: optIndex } : q));
  };

  const saveQuiz = async () => {
    if (!quizMeta.title || !quizMeta.subject || !quizMeta.duration || !quizMeta.date || !quizMeta.time) {
      alert("Please fill in all Quiz Settings before saving.");
      return;
    }

    const isValid = questions.every(q => q.text && q.options.every(opt => opt !== ''));
    if (!isValid) {
      alert("Please ensure all questions and options are filled out.");
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/quizzes/full', {
        ...quizMeta,
        questions: questions.map(({ text, options, correctAnswerIndex }) => ({ text, options, correctAnswerIndex }))
      });
      alert('Quiz Published Successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving quiz:', err);
      alert('Failed to save quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-quiz-page">
      <div className="builder-header">
        <div className="breadcrumb">
          <span onClick={() => navigate('/dashboard')}>Dashboard</span> 
          <ChevronRight size={14} className="separator" /> 
          <span>Create Quiz</span>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          <button className="btn btn-primary" onClick={saveQuiz} disabled={loading}>
            {loading ? <Loader2 className="spinner" size={18} /> : <><Save size={18} /> Save & Publish</>}
          </button>
        </div>
      </div>

      <div className="builder-container">
        <aside className="builder-left">
          <div className="card">
            <h3>Quiz Settings</h3>
            <p className="text-muted mb-20">Configure the basic details of your quiz.</p>
            
            <form className="quiz-meta-form">
              <div className="form-group">
                <label>Quiz Title</label>
                <input type="text" id="title" value={quizMeta.title} onChange={handleMetaChange} placeholder="e.g. React.js Fundamentals" required />
              </div>
              
              <div className="form-group">
                <label>Subject / Category</label>
                <select id="subject" value={quizMeta.subject} onChange={handleMetaChange} required>
                  <option value="" disabled>Select Category</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="General Knowledge">General Knowledge</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group w-50">
                  <label>Duration (Mins)</label>
                  <input type="number" id="duration" value={quizMeta.duration} onChange={handleMetaChange} min="1" placeholder="30" required />
                </div>
                <div className="form-group w-50">
                  <label>Total Points</label>
                  <input type="number" id="points" value={quizMeta.points} onChange={handleMetaChange} min="1" required />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group w-50">
                  <label>Date</label>
                  <input type="date" id="date" value={quizMeta.date} onChange={handleMetaChange} required />
                </div>
                <div className="form-group w-50">
                  <label>Time</label>
                  <input type="time" id="time" value={quizMeta.time} onChange={handleMetaChange} required />
                </div>
              </div>
            </form>
          </div>
        </aside>

        <div className="builder-right">
          <div className="questions-header">
            <h3>Questions</h3>
            <span className="badge">{questions.length} Question{questions.length !== 1 ? 's' : ''}</span>
          </div>

          <div className="questions-list">
            {questions.map((q, qIndex) => (
              <div key={q.id} className="question-card">
                <div className="q-header">
                  <h4>Question {qIndex + 1}</h4>
                  <div className="q-actions">
                    <button onClick={() => removeQuestion(q.id)}><Trash size={16} /></button>
                  </div>
                </div>
                <div className="q-body">
                  <input 
                    type="text" 
                    className="q-input" 
                    placeholder="Type your question here..." 
                    value={q.text} 
                    onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                    required 
                  />
                  
                  <div className="options-list">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="option-item">
                        <input 
                          type="radio" 
                          name={`correct-${q.id}`} 
                          checked={q.correctAnswerIndex === optIndex}
                          onChange={() => handleCorrectChange(q.id, optIndex)}
                        />
                        <input 
                          type="text" 
                          className="op-input" 
                          placeholder={`Option ${optIndex + 1}`} 
                          value={opt}
                          onChange={(e) => handleOptionChange(q.id, optIndex, e.target.value)}
                          required 
                        />
                        <button className="remove-op" onClick={() => removeOption(q.id, optIndex)}><X size={16} /></button>
                      </div>
                    ))}
                  </div>
                  
                  <button className="add-op-btn" onClick={() => addOption(q.id)}>
                    <Plus size={14} /> Add Option
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="btn btn-outline-dashed w-100 mt-20" onClick={addQuestion}>
            <Plus size={18} /> Add New Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
