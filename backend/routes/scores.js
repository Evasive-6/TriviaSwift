import express from 'express';
import Score from '../models/Score.js';
const router = express.Router();

// GET /api/scores - Get all scores sorted by score descending
router.get('/', async (req, res, next) => {
  try {
    const scores = await Score.find().sort({ score: -1, timestamp: -1 });
    res.json({
      success: true,
      count: scores.length,
      data: scores
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/scores/top/:limit? - Get top scores
router.get('/top/:limit?', async (req, res, next) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const topScores = await Score.getTopScores(limit);
    res.json({
      success: true,
      limit,
      data: topScores
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/scores/player/:playerName - Get scores by player
router.get('/player/:playerName', async (req, res, next) => {
  try {
    const playerName = req.params.playerName;
    const playerScores = await Score.find({ playerName: new RegExp(playerName, 'i') }).sort({ timestamp: -1 });
    res.json({
      success: true,
      player: playerName,
      count: playerScores.length,
      data: playerScores
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/scores - Submit new score
router.post('/', async (req, res, next) => {
  try {
    const { playerName, score, totalQuestions, correctAnswers, timeTaken, difficulty, categories, questions } = req.body;
    
    if (!playerName || score === undefined || totalQuestions === undefined || correctAnswers === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: playerName, score, totalQuestions, correctAnswers'
      });
    }
    
    if (typeof score !== 'number' || typeof totalQuestions !== 'number' || typeof correctAnswers !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'score, totalQuestions, and correctAnswers must be numbers'
      });
    }
    
    if (correctAnswers > totalQuestions) {
      return res.status(400).json({
        success: false,
        error: 'correctAnswers cannot be greater than totalQuestions'
      });
    }
    
    const newScore = await Score.create({
      playerName: playerName.trim(),
      score: Math.max(0, score),
      totalQuestions: Math.max(1, totalQuestions),
      correctAnswers: Math.max(0, Math.min(correctAnswers, totalQuestions)),
      accuracy: Math.round((correctAnswers / totalQuestions) * 100),
      timeTaken: timeTaken || 0,
      difficulty: difficulty || 'medium',
      categories: categories || [],
      questions: questions || []
    });
    
    // Calculate rank
    const rank = await Score.countDocuments({ score: { $gt: newScore.score } }) + 1;
    
    res.status(201).json({
      success: true,
      data: newScore,
      rank
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/scores/stats/summary - Get statistics summary
router.get('/stats/summary', async (req, res, next) => {
  try {
    const totalGames = await Score.countDocuments();
    if (totalGames === 0) {
      return res.json({
        success: true,
        message: 'No scores recorded yet',
        data: {
          totalGames: 0,
          totalPlayers: 0,
          averageScore: 0,
          highestScore: 0
        }
      });
    }
    
    const uniquePlayers = await Score.distinct('playerName').then(players => players.length);
    const averageScoreAgg = await Score.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);
    const averageScore = averageScoreAgg[0]?.avgScore || 0;
    const highestScoreDoc = await Score.findOne().sort({ score: -1 });
    const highestScore = highestScoreDoc?.score || 0;
    
    res.json({
      success: true,
      data: {
        totalGames,
        totalPlayers: uniquePlayers,
        averageScore: Math.round(averageScore),
        highestScore
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
