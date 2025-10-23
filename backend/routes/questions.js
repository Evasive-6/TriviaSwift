const express = require('express');
const router = express.Router();

const Question = require('../models/Question');
const fs = require('fs').promises;
const path = require('path');
const mongoose = require('mongoose');

const questionsFilePath = path.join(__dirname, '../data/questions.json');

// Helper function to read questions from file
const readQuestionsFromFile = async () => {
  try {
    const data = await fs.readFile(questionsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('Questions file not found, returning empty array');
    return [];
  }
};

// GET /api/questions - Get all questions
router.get('/', async (req, res, next) => {
  try {
    // Try MongoDB first
    if (mongoose.connection.readyState === 1) {
      const questions = await Question.find().sort({ createdAt: -1 });
      res.json({
        success: true,
        count: questions.length,
        data: questions
      });
    } else {
      // Fallback to file-based storage
      const questions = await readQuestionsFromFile();
      res.json({
        success: true,
        count: questions.length,
        data: questions
      });
    }

  } catch (error) {
    next(error);
  }
});

// GET /api/questions/:id - Get question by ID
router.get('/:id', async (req, res, next) => {
  try {
    const foundQuestion = await Question.findById(req.params.id);
    
    if (!foundQuestion) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      data: foundQuestion
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/questions/category/:category - Get questions by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const categoryQuestions = await Question.find({ 
      category: new RegExp(req.params.category, 'i') 
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: categoryQuestions.length,
      category: req.params.category,
      data: categoryQuestions
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/questions/random/:count? - Get random questions
router.get('/random/:count?', async (req, res, next) => {
  try {
    const count = parseInt(req.params.count) || 10;
    const filters = {};
    
    // Add optional query filters
    if (req.query.category) {
      filters.category = new RegExp(req.query.category, 'i');
    }
    if (req.query.difficulty) {
      filters.difficulty = req.query.difficulty.toLowerCase();
    }
    
    const randomQuestions = await Question.getRandomQuestions(count, filters);
    
    if (randomQuestions.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No Questions available matching your criteria'
      });
    }
    
    res.json({
      success: true,
      count: randomQuestions.length,
      data: randomQuestions
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/questions - Create new question
router.post('/', async (req, res, next) => {
  try {
    const { question, options, correctAnswer, category, difficulty, explanation } = req.body;
    
    // Basic validation
    if (!question || !options || !correctAnswer || !category || !difficulty) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: Question, options, correctAnswer, category, difficulty'
      });
    }
    
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Options must be an array with at least 2 items'
      });
    }
    
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        error: 'Correct answer must be one of the options'
      });
    }
    
    const newQuestion = await Question.create({
      question,
      options,
      correctAnswer,
      category,
      difficulty: difficulty.toLowerCase(),
      explanation
    });
    
    res.status(201).json({
      success: true,
      data: newQuestion
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    next(error);
  }
});

// PUT /api/questions/:id - Update question
router.put('/:id', async (req, res, next) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedQuestion) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      data: updatedQuestion
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }
    next(error);
  }
});

// DELETE /api/questions/:id - Delete question
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    
    if (!deletedQuestion) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Question deleted successfully',
      data: deletedQuestion
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
