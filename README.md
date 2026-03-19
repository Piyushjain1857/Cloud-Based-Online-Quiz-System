# Projexi - Cloud-Based Online Quiz System

Projexi is a full-stack web application designed for creating and managing online quizzes. It features a React-based frontend and a Flask-based backend.

## Project Structure

- `frontend/`: React application built with Vite and Tailwind CSS.
- `backend/`: Flask application with SQLAlchemy and SQLite.
- `Prototype/`: Design prototypes or earlier versions.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- npm or yarn

---

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python3 -m venv venv
   ```

3. **Activate the virtual environment:**
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```

4. **Install dependencies:**
   ```bash
   pip3 install -r requirements.txt
   ```

5. **Initialize the database (optional, if `projexi.db` doesn't exist):**
   ```bash
   python3 seed_db.py
   ```

6. **Start the server:**
   ```bash
   python3 app.py
   ```
   The backend will start at `http://127.0.0.1:3000`.

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:5173`.

---

## Contributing

Please ensure you add a `.gitignore` to your local environment if it's not already present.

- Frontend: `frontend/.gitignore`
- Backend: `backend/.gitignore`

---

## License

This project is private and for educational purposes.
