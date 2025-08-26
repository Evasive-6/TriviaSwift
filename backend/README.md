# 🎯 TriviaSwift Backend API

A robust Node.js + Express.js backend API for the TriviaSwift quiz game application.

## 📋 Features

- **Question Management**: CRUD operations for trivia questions
- **Score Tracking**: Real-time score recording and leaderboards
- **Game Sessions**: Complete game flow management
- **RESTful API**: Clean, consistent API design
- **Data Validation**: Comprehensive input validation
- **Error Handling**: Graceful error handling with meaningful responses

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the backend directory:
```bash
cd TriviaSwift/backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. The server will start on `http://localhost:3001`

## 📊 API Endpoints

### Health Check
- `GET /api/health` - Server status

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get question by ID
- `GET /api/questions/category/:category` - Get questions by category
- `GET /api/questions/random/:count?` - Get random questions
- `POST /api/questions` - Create new question

### Scores
- `GET /api/scores` - Get all scores (sorted by score)
- `GET /api/scores/top/:limit?` - Get top scores
- `GET /api/scores/player/:playerName` - Get scores by player
- `GET /api/scores/stats/summary` - Get statistics
- `POST /api/scores` - Submit new score

### Game
- `POST /api/game/start` - Start new game session
- `POST /api/game/answer` - Submit answer
- `GET /api/game/:gameId` - Get game status
- `DELETE /api/game/:gameId` - End game session

## 🎮 Game Flow

1. **Start Game**: POST `/api/game/start` with player details
2. **Answer Questions**: POST `/api/game/answer` for each question
3. **Complete Game**: Automatically ends when all questions are answered
4. **Submit Score**: Score is automatically recorded upon completion

## 📁 Project Structure

```
backend/
├── server.js          # Main server file
├── package.json        # Dependencies and scripts
├── routes/            # API route handlers
│   ├── questions.js   # Question management
│   ├── scores.js      # Score tracking
│   └── game.js        # Game sessions
├── middleware/        # Custom middleware
│   ├── errorHandler.js # Global error handling
│   └── validation.js   # Input validation
├── utils/             # Utility functions
│   ├── gameLogic.js   # Game-specific logic
│   └── helpers.js     # General helpers
├── data/              # Data storage (JSON files)
│   ├── questions.json # Question database
│   └── scores.json    # Score database
└── README.md          # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
PORT=3001
NODE_ENV=development
```

### Data Storage
Currently uses JSON files for simplicity. Can be easily migrated to:
- MongoDB
- PostgreSQL
- MySQL
- SQLite

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📝 Sample Requests

### Start a Game
```bash
curl -X POST http://localhost:3001/api/game/start \
  -H "Content-Type: application/json" \
  -d '{"playerName": "TestPlayer", "questionCount": 5}'
```

### Submit Answer
```bash
curl -X POST http://localhost:3001/api/game/answer \
  -H "Content-Type: application/json" \
  -d '{"gameId": "12345", "answer": "Paris"}'
```

### Get Top Scores
```bash
curl http://localhost:3001/api/scores/top/5
```

## 🛠 Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

### Adding New Features
1. Create new route in `routes/` directory
2. Add validation in `middleware/validation.js`
3. Update server.js to include new route
4. Test thoroughly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions, please check the documentation or create an issue in the repository.
