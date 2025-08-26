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

// Helper function to write questions
const writeQuestions = async (questions) => {
  await fs.writeFile(questionsFilePath, JSON.stringify(questions, null, 2));
};

// GET /api/questions - Get all questions
router.get('/', async (req, res, next) => {
  try {
    const questions = await readQuestions();
    res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/questions/:id - Get question by ID
router.get('/:id', async (req, res, next) => {
  try {
    const questions = await readQuestions();
    const question = questions.find(q => q.id === req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }
    
    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/questions/category/:category - Get questions by category
router.get('/category/:category', async (req, res, next) => {
  try {
    const questions = await readQuestions();
    const categoryQuestions = questions.filter(q => 
      q.category.toLowerCase() === req.params.category.toLowerCase()
    );
    
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
    const questions = await readQuestions();
    
    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No questions available'
      });
    }
    
    // Shuffle and get random questions
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    const randomQuestions = shuffled.slice(0, Math.min(count, questions.length));
    
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
    const { question, options, correctAnswer, category, difficulty } = req.body;
    
    // Basic validation
    if (!question || !options || !correctAnswer || !category || !difficulty) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: question, options, correctAnswer, category, difficulty'
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
    
    const questions = await readQuestions();
    const newQuestion = {
      id: Date.now().toString(),
      question,
      options,
      correctAnswer,
      category,
      difficulty: difficulty.toLowerCase(),
      createdAt: new Date().toISOString()
    };
    
    questions.push(newQuestion);
    await writeQuestions(questions);
    
    res.status(201).json({
      success: true,
      data: newQuestion
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
