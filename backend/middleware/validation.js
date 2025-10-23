import User from '../models/User.js';

/**
 * Validation middleware for request data
 */

// Validate user registration
const validateUserRegistration = async (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  // Username validation
  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  } else if (username.length > 30) {
    errors.push('Username cannot exceed 30 characters');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  } else {
    // Check if username already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      errors.push('Username already exists');
    }
  }

  // Email validation
  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('Please enter a valid email address');
  } else {
    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      errors.push('Email already exists');
    }
  }

  // Password validation
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Validate user login
const validateUserLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Validate user update
const validateUserUpdate = (req, res, next) => {
  const { username, email, preferences } = req.body;
  const errors = [];

  if (username) {
    if (username.trim().length < 3) {
      errors.push('Username must be at least 3 characters long');
    } else if (username.length > 30) {
      errors.push('Username cannot exceed 30 characters');
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }
  }

  if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }

  if (preferences) {
    if (preferences.difficulty && !['easy', 'medium', 'hard', 'mixed'].includes(preferences.difficulty)) {
      errors.push('Difficulty must be one of: easy, medium, hard, mixed');
    }

    if (preferences.questionCount && (preferences.questionCount < 5 || preferences.questionCount > 50)) {
      errors.push('Question count must be between 5 and 50');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Validate question creation
const validateQuestion = (req, res, next) => {
  const { question, options, correctAnswer, category, difficulty } = req.body;
  const errors = [];

  if (!question || question.trim().length < 5) {
    errors.push('Question must be at least 5 characters long');
  }

  if (!Array.isArray(options) || options.length < 2) {
    errors.push('Options must be an array with at least 2 items');
  } else {
    options.forEach((option, index) => {
      if (!option || option.trim().length === 0) {
        errors.push(`Option ${index + 1} cannot be empty`);
      }
    });
  }

  if (!correctAnswer || correctAnswer.trim().length === 0) {
    errors.push('Correct answer is required');
  } else if (!options.includes(correctAnswer)) {
    errors.push('Correct answer must be one of the options');
  }

  if (!category || category.trim().length === 0) {
    errors.push('Category is required');
  }

  if (!difficulty || !['easy', 'medium', 'hard'].includes(difficulty.toLowerCase())) {
    errors.push('Difficulty must be one of: easy, medium, hard');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Validate score submission
const validateScore = (req, res, next) => {
  const { playerName, score, totalQuestions, correctAnswers } = req.body;
  const errors = [];

  if (!playerName || playerName.trim().length === 0) {
    errors.push('Player name is required');
  } else if (playerName.trim().length > 50) {
    errors.push('Player name must be 50 characters or less');
  }

  if (score === undefined || typeof score !== 'number') {
    errors.push('Score must be a number');
  } else if (score < 0) {
    errors.push('Score cannot be negative');
  }

  if (totalQuestions === undefined || typeof totalQuestions !== 'number') {
    errors.push('Total questions must be a number');
  } else if (totalQuestions < 1) {
    errors.push('Total questions must be at least 1');
  }

  if (correctAnswers === undefined || typeof correctAnswers !== 'number') {
    errors.push('Correct answers must be a number');
  } else if (correctAnswers < 0) {
    errors.push('Correct answers cannot be negative');
  } else if (correctAnswers > totalQuestions) {
    errors.push('Correct answers cannot exceed total questions');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Validate game start
const validateGameStart = (req, res, next) => {
  const { playerName, questionCount, difficulty, category } = req.body;
  const errors = [];

  if (!playerName || playerName.trim().length === 0) {
    errors.push('Player name is required');
  }

  if (questionCount !== undefined) {
    if (typeof questionCount !== 'number') {
      errors.push('Question count must be a number');
    } else if (questionCount < 1) {
      errors.push('Question count must be at least 1');
    } else if (questionCount > 50) {
      errors.push('Question count cannot exceed 50');
    }
  }

  if (difficulty && !['easy', 'medium', 'hard', 'mixed'].includes(difficulty.toLowerCase())) {
    errors.push('Difficulty must be one of: easy, medium, hard, mixed');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

// Validate game answer
const validateGameAnswer = (req, res, next) => {
  const { gameId, answer } = req.body;
  const errors = [];

  if (!gameId || gameId.trim().length === 0) {
    errors.push('Game ID is required');
  }

  if (answer === undefined) {
    errors.push('Answer is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  next();
};

export {
  validateUserRegistration,
  validateUserLogin,
  validateUserUpdate,
  validateQuestion,
  validateScore,
  validateGameStart,
  validateGameAnswer
};
