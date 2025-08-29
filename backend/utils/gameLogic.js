/**
 * Utility functions for game logic
 */

// Shuffle an array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

// Calculate accuracy percentage
const calculateAccuracy = (correctAnswers, totalQuestions) => {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
};

// Generate a unique game ID
const generateGameId = () => {
  return Date.now().toString();
};

export {
  shuffleArray,
  calculateAccuracy,
  generateGameId
};
