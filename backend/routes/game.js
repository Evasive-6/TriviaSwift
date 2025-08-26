const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Path to questions data file
const questionsFilePath = path.join(__dirname, '../data/questions.json');

// Helper function to read questions
const readQuestions = async () => {
  try {
    const data = await fs.readFile(questionsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
};

// In-memory game sessions (for demo purposes)
// In production, you'd want to use a proper database
const activeGames = new Map();

// POST /api/game/start - Start a new game session
router.post('/start', async (req, res, next) => {
  try {
    const { playerName, questionCount = 10, difficulty, category } = req.body;
    
    if (!playerName) {
      return res.status(400).json({
        success: false,
        error: 'playerName is required'
      });
    }
    
    const questions = await readQuestions();
    
    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No questions available to start game'
      });
    }
    
    // Filter questions based on difficulty and category if provided
    let filteredQuestions = questions;
    if (difficulty) {
      filteredQuestions = filteredQuestions.filter(q => 
        q.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }
    if (category) {
      filteredQuestions = filteredQuestions.filter(q => 
        q.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (filteredQuestions.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No questions match the specified criteria'
      });
    }
    
    // Shuffle and select questions
    const shuffledQuestions = [...filteredQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffledQuestions.slice(0, Math.min(questionCount, filteredQuestions.length));
    
    // Create game session
    const gameId = Date.now().toString();
    const gameSession = {
      id: gameId,
      playerName: playerName.trim(),
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      score: 0,
      correctAnswers: 0,
      startTime: new Date().toISOString(),
      difficulty: difficulty || 'mixed',
      category: category || 'mixed',
      status: 'active'
    };
    
    activeGames.set(gameId, gameSession);
    
    // Return first question
    const currentQuestion = selectedQuestions[0];
    const questionToSend = {
      id: currentQuestion.id,
      question: currentQuestion.question,
      options: currentQuestion.options,
      category: currentQuestion.category,
      difficulty: currentQuestion.difficulty
    };
    
    res.json({
      success: true,
      gameId,
      totalQuestions: selectedQuestions.length,
      currentQuestion: 1,
      question: questionToSend
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/game/answer - Submit answer for current question
router.post('/answer', async (req, res, next) => {
  try {
    const { gameId, answer } = req.body;
    
    if (!gameId || answer === undefined) {
      return res.status(400).json({
        success: false,
        error: 'gameId and answer are required'
      });
    }
    
    const gameSession = activeGames.get(gameId);
    
    if (!gameSession) {
      return res.status(404).json({
        success: false,
        error: 'Game session not found'
      });
    }
    
    if (gameSession.status !== 'active') {
      return res.status(400).json({
        success: false,
        error: 'Game session is not active'
      });
    }
    
    const currentQuestion = gameSession.questions[gameSession.currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    // Update game state
    if (isCorrect) {
      gameSession.score += 10; // 10 points per correct answer
      gameSession.correctAnswers += 1;
    }
    
    gameSession.currentQuestionIndex += 1;
    
    // Check if game is complete
    if (gameSession.currentQuestionIndex >= gameSession.questions.length) {
      gameSession.status = 'completed';
      gameSession.endTime = new Date().toISOString();
      gameSession.totalTime = Math.round((new Date(gameSession.endTime) - new Date(gameSession.startTime)) / 1000);
      
      activeGames.set(gameId, gameSession);
      
      return res.json({
        success: true,
        gameComplete: true,
        finalScore: gameSession.score,
        correctAnswers: gameSession.correctAnswers,
        totalQuestions: gameSession.questions.length,
        accuracy: Math.round((gameSession.correctAnswers / gameSession.questions.length) * 100),
        totalTime: gameSession.totalTime
      });
    }
    
    // Get next question
    const nextQuestion = gameSession.questions[gameSession.currentQuestionIndex];
    const questionToSend = {
      id: nextQuestion.id,
      question: nextQuestion.question,
      options: nextQuestion.options,
      category: nextQuestion.category,
      difficulty: nextQuestion.difficulty
    };
    
    activeGames.set(gameId, gameSession);
    
    res.json({
      success: true,
      gameComplete: false,
      currentQuestion: gameSession.currentQuestionIndex + 1,
      totalQuestions: gameSession.questions.length,
      score: gameSession.score,
      correctAnswers: gameSession.correctAnswers,
      wasCorrect: isCorrect,
      correctAnswer: currentQuestion.correctAnswer,
      question: questionToSend
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/game/:gameId - Get game session status
router.get('/:gameId', async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const gameSession = activeGames.get(gameId);
    
    if (!gameSession) {
      return res.status(404).json({
        success: false,
        error: 'Game session not found'
      });
    }
    
    res.json({
      success: true,
      data: gameSession
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/game/:gameId - End game session
router.delete('/:gameId', async (req, res, next) => {
  try {
    const { gameId } = req.params;
    
    if (activeGames.has(gameId)) {
      activeGames.delete(gameId);
      res.json({
        success: true,
        message: 'Game session ended'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Game session not found'
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
