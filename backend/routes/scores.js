const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Path to scores data file
const scoresFilePath = path.join(__dirname, '../data/scores.json');

// Helper function to read scores
const readScores = async () => {
  try {
    const data = await fs.readFile(scoresFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
};

// Helper function to write scores
const writeScores = async (scores) => {
  await fs.writeFile(scoresFilePath, JSON.stringify(scores, null, 2));
};

// GET /api/scores - Get all scores
router.get('/', async (req, res, next) => {
  try {
    const scores = await readScores();
    
    // Sort by score descending
    const sortedScores = scores.sort((a, b) => b.score - a.score);
    
    res.json({
      success: true,
      count: sortedScores.length,
      data: sortedScores
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/scores/top/:limit? - Get top scores
router.get('/top/:limit?', async (req, res, next) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    const scores = await readScores();
    
    // Sort by score descending and take top N
    const topScores = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
    
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
    const scores = await readScores();
    const playerScores = scores.filter(score => 
      score.playerName.toLowerCase() === req.params.playerName.toLowerCase()
    );
    
    // Sort by date descending (most recent first)
    const sortedScores = playerScores.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    res.json({
      success: true,
      player: req.params.playerName,
      count: sortedScores.length,
      data: sortedScores
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/scores - Submit new score
router.post('/', async (req, res, next) => {
  try {
    const { playerName, score, totalQuestions, correctAnswers, timeTaken, difficulty } = req.body;
    
    // Basic validation
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
    
    const scores = await readScores();
    const newScore = {
      id: Date.now().toString(),
      playerName: playerName.trim(),
      score: Math.max(0, score), // Ensure non-negative score
      totalQuestions: Math.max(1, totalQuestions), // Ensure at least 1 question
      correctAnswers: Math.max(0, Math.min(correctAnswers, totalQuestions)), // Clamp between 0 and totalQuestions
      accuracy: Math.round((correctAnswers / totalQuestions) * 100),
      timeTaken: timeTaken || 0,
      difficulty: difficulty || 'medium',
      timestamp: new Date().toISOString()
    };
    
    scores.push(newScore);
    await writeScores(scores);
    
    res.status(201).json({
      success: true,
      data: newScore,
      rank: scores.filter(s => s.score > newScore.score).length + 1
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/scores/stats - Get statistics
router.get('/stats/summary', async (req, res, next) => {
  try {
    const scores = await readScores();
    
    if (scores.length === 0) {
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
    
    const totalGames = scores.length;
    const uniquePlayers = new Set(scores.map(score => score.playerName.toLowerCase())).size;
    const averageScore = Math.round(scores.reduce((sum, score) => sum + score.score, 0) / totalGames);
    const highestScore = Math.max(...scores.map(score => score.score));
    
    res.json({
      success: true,
      data: {
        totalGames,
        totalPlayers: uniquePlayers,
        averageScore,
        highestScore
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
