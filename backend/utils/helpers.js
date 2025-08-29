/**
 * General helper functions
 */

// Format timestamp to readable date
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize input string
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Generate random string
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Calculate time difference in seconds
const getTimeDifference = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return Math.round((end - start) / 1000);
};

// Format time in minutes and seconds
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

// Validate difficulty level
const isValidDifficulty = (difficulty) => {
  return ['easy', 'medium', 'hard', 'mixed'].includes(difficulty.toLowerCase());
};

// Validate category
const isValidCategory = (category) => {
  // This can be expanded with a list of valid categories
  return typeof category === 'string' && category.trim().length > 0;
};

export {
  formatDate,
  isValidEmail,
  sanitizeInput,
  generateRandomString,
  getTimeDifference,
  formatTime,
  isValidDifficulty,
  isValidCategory
};
