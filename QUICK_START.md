# TriviaSwift - Quick Start Guide

## 🚀 Running the Application

### Prerequisites
- Node.js (v16.0.0 or higher)
- MongoDB Atlas account (already configured in .env)
- npm or yarn package manager

---

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd "c:\Users\Acer\OneDrive\Desktop\tirviashift fina\TriviaSwift\backend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   **Expected Output:**
   ```
   🚀 TriviaSwift Backend Server running on port 3001
   📍 Health check: http://localhost:3001/api/health
   ✅ MongoDB Connected: cluster0.j5cuo.mongodb.net
   ```

---

## Frontend Setup

1. **Open a new terminal and navigate to frontend directory:**
   ```bash
   cd "c:\Users\Acer\OneDrive\Desktop\tirviashift fina\TriviaSwift\frontend"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   **Expected Output:**
   ```
   VITE v7.1.2  ready in XXX ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

4. **Open your browser:**
   - Navigate to: http://localhost:5173
   - The TriviaSwift application should now be running!

---

## 🧪 Testing the Application

### 1. Test Backend API
Open your browser or use curl:
```bash
# Health check
curl http://localhost:3001/api/health

# Get all questions
curl http://localhost:3001/api/questions

# Get scores
curl http://localhost:3001/api/scores
```

### 2. Test Frontend Features
1. **Home Page**: Enter your name and configure game settings
2. **Start Game**: Click "Start Game" button
3. **Answer Questions**: Select answers and see real-time feedback
4. **View Results**: See your final score and statistics
5. **Leaderboard**: Check your ranking against other players

---

## 📁 Project Structure

```
TriviaSwift/
├── backend/
│   ├── config/         # Database configuration
│   ├── data/           # JSON data files
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   ├── .env            # Environment variables
│   ├── server.js       # Main server file
│   └── package.json    # Backend dependencies
│
└── frontend/
    ├── src/
    │   ├── components/ # React components
    │   ├── context/    # React context
    │   ├── pages/      # Page components
    │   ├── services/   # API services
    │   ├── App.jsx     # Main App component
    │   ├── main.jsx    # Entry point
    │   └── index.css   # Global styles
    ├── index.html      # HTML template
    ├── vite.config.js  # Vite configuration
    └── package.json    # Frontend dependencies
```

---

## 🔧 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (jest)

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## 🌐 API Endpoints

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get question by ID
- `GET /api/questions/random/:count` - Get random questions
- `POST /api/questions` - Create new question

### Scores
- `GET /api/scores` - Get all scores
- `GET /api/scores/top/:limit` - Get top scores
- `POST /api/scores` - Submit new score
- `GET /api/scores/stats/summary` - Get statistics

### Game
- `POST /api/game/start` - Start new game
- `POST /api/game/answer` - Submit answer
- `GET /api/game/:gameId` - Get game status
- `DELETE /api/game/:gameId` - End game

### Users (Authentication)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update profile (protected)

---

## 🎮 Game Features

### Difficulty Levels
- **Easy**: Simple questions for beginners
- **Medium**: Moderate difficulty
- **Hard**: Challenging questions
- **Mixed**: Random mix of all difficulties

### Categories
- Geography
- Science
- History
- Literature
- Art
- General Knowledge
- Entertainment
- Sports

### Scoring System
- **Correct Answer**: +10 points
- **Accuracy**: Tracked in real-time
- **Time**: Displayed for each game
- **Leaderboard**: Global ranking system

---

## 🐛 Troubleshooting

### Backend won't start
1. Check if MongoDB connection string is correct in `.env`
2. Verify Node.js version: `node --version` (should be ≥16.0.0)
3. Delete `node_modules` and run `npm install` again

### Frontend won't start
1. Make sure backend is running on port 3001
2. Check if port 5173 is available
3. Clear browser cache and reload
4. Delete `node_modules` and run `npm install` again

### CORS Errors
- Ensure backend `.env` has: `CORS_ORIGIN=http://localhost:5173`
- Restart backend server after changing `.env`

### MongoDB Connection Issues
- Check internet connection
- Verify MongoDB Atlas credentials
- Check if IP address is whitelisted in MongoDB Atlas

---

## 📊 Database Information

**MongoDB Atlas Connection:**
- Database: `triviashift`
- Collections:
  - `questions` - Quiz questions
  - `scores` - Game scores
  - `users` - User accounts

**File-based Fallback:**
If MongoDB is unavailable, the app uses JSON files:
- `backend/data/questions.json`
- `backend/data/scores.json`

---

## ✅ Success Indicators

**Backend Running Successfully:**
- ✅ Console shows: "MongoDB Connected"
- ✅ Health check responds: http://localhost:3001/api/health
- ✅ No error messages in terminal

**Frontend Running Successfully:**
- ✅ Browser opens to http://localhost:5173
- ✅ No console errors (F12 Developer Tools)
- ✅ Can see TriviaSwift home page
- ✅ All images and styles load correctly

---

## 🎯 Next Steps

1. ✅ Backend and Frontend are running
2. ✅ Test all features work correctly
3. ✅ Check leaderboard functionality
4. ✅ Verify score submission
5. ✅ Test different difficulty levels
6. ✅ Try all categories

---

**Happy Gaming! 🎮**

For issues or questions, check the FIXES_APPLIED.md file for detailed information about all corrections made.
