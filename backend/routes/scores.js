const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');

const scoresFilePath = path.join(__dirname, '../data/scores.json');

// Helper function to read scores from file
const readScoresFromFile = async () => {
  try {
    const data = await fs.readFile(scoresFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Scores file not found, returning empty array');
    return [];
  }
};

// GET /api/scores - Get all scores sorted by score descending
router.get('/', async (req, res, next) => {
  try {
    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      const scores = await Score.find().sort({ score: -1, timestamp: -1 });
      res.json({
        success: true,
        count: scores.length,
        data: scores
      });
    } else {
      // Fallback to file-based storage
      const scores = await readScoresFromFile();
      // Sort by score descending
      scores.sort((a, b) => b.score - a.score);
      res.json({
        success: true,
        count: scores.length,
        data: scores
      });
    }
  } catch (error) {
    next(error);
  }
});

// GET /api/scores/top/:limit? - Get top scores
router.get('/top/:limit?', async (req, res, next) => {
  try {
    const limit = parseInt(req.params.limit) || 10;
    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      const topScores = await Score.getTopScores(limit);
      res.json({
        success: true,
        limit,
        data: topScores
      });
    } else {
      // Fallback to file-based storage
      const scores = await readScoresFromFile();
      // Sort by score descending and take top limit
      const topScores = scores
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
      res.json({
        success: true,
        limit,
        data: topScores
      });
    }
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
    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
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
    } else {
      // Fallback to file-based storage
      const scores = await readScoresFromFile();
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
      const uniquePlayers = new Set(scores.map(s => s.playerName)).size;
      const averageScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
      const highestScore = Math.max(...scores.map(s => s.score));

      res.json({
        success: true,
        data: {
          totalGames,
          totalPlayers: uniquePlayers,
          averageScore: Math.round(averageScore),
          highestScore
        }
      });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
