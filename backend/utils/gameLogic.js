/**
 * Utility functions for game logic
 */

// Proper Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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

module.exports = {
  shuffleArray,
  calculateAccuracy,
  generateGameId
};
