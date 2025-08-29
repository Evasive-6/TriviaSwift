const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: [true, 'Player name is required'],
    trim: true,
    minlength: [1, 'Player name must be at least 1 character long'],
    maxlength: [50, 'Player name cannot exceed 50 characters']
  },
  score: {
    type: Number,
    required: [true, 'Score is required'],
    min: [0, 'Score cannot be negative']
  },
  totalQuestions: {
    type: Number,
    required: [true, 'Total questions count is required'],
    min: [1, 'Must have at least 1 question']
  },
  correctAnswers: {
    type: Number,
    required: [true, 'Correct answers count is required'],
    min: [0, 'Correct answers cannot be negative'],
    validate: {
      validator: function(correctAnswers) {
        return correctAnswers <= this.totalQuestions;
      },
      message: 'Correct answers cannot exceed total questions'
    }
  },
  accuracy: {
    type: Number,
    required: [true, 'Accuracy is required'],
    min: [0, 'Accuracy cannot be negative'],
    max: [100, 'Accuracy cannot exceed 100%']
  },
  timeTaken: {
    type: Number,
    required: [true, 'Time taken is required'],
    min: [0, 'Time taken cannot be negative']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: {
      values: ['easy', 'medium', 'hard', 'mixed'],
      message: 'Difficulty must be: easy, medium, hard, or mixed'
    }
  },
  categories: {
    type: [String],
    default: []
  },
  questions: [{
    questionId: String,
    question: String,
    userAnswer: String,
    correct: Boolean,
    timeSpent: Number
  }],
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
scoreSchema.index({ playerName: 1 });
scoreSchema.index({ score: -1 });
scoreSchema.index({ timestamp: -1 });
scoreSchema.index({ difficulty: 1, score: -1 });

// Virtual for calculating accuracy percentage
scoreSchema.virtual('accuracyPercentage').get(function() {
  return ((this.correctAnswers / this.totalQuestions) * 100).toFixed(1);
});

// Virtual for average time per question
scoreSchema.virtual('averageTimePerQuestion').get(function() {
  return (this.timeTaken / this.totalQuestions).toFixed(2);
});

// Static method to get top scores
scoreSchema.statics.getTopScores = async function(limit = 10, filters = {}) {
  const matchStage = {};
  
  if (filters.difficulty) {
    matchStage.difficulty = filters.difficulty;
  }
  
  if (filters.playerName) {
    matchStage.playerName = new RegExp(filters.playerName, 'i');
  }
  
  const pipeline = [
    { $match: matchStage },
    { $sort: { score: -1, timeTaken: 1 } },
    { $limit: limit }
  ];
  
  return await this.aggregate(pipeline);
};

// Static method to get player statistics
scoreSchema.statics.getPlayerStats = async function(playerName) {
  const stats = await this.aggregate([
    { $match: { playerName: new RegExp(playerName, 'i') } },
    {
      $group: {
        _id: '$playerName',
        totalGames: { $sum: 1 },
        totalScore: { $sum: '$score' },
        totalQuestions: { $sum: '$totalQuestions' },
        totalCorrect: { $sum: '$correctAnswers' },
        totalTime: { $sum: '$timeTaken' },
        bestScore: { $max: '$score' },
        averageScore: { $avg: '$score' },
        averageAccuracy: { $avg: '$accuracy' }
      }
    }
  ]);
  
  return stats[0] || null;
};

// Method to calculate and set accuracy
scoreSchema.methods.calculateAccuracy = function() {
  this.accuracy = ((this.correctAnswers / this.totalQuestions) * 100).toFixed(1);
  return this.accuracy;
};

// Pre-save middleware to ensure accuracy is calculated
scoreSchema.pre('save', function(next) {
  if (this.isModified('correctAnswers') || this.isModified('totalQuestions')) {
    this.calculateAccuracy();
  }
  next();
});

module.exports = mongoose.model('Score', scoreSchema);
