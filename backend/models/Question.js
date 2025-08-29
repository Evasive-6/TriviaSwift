const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true,
    minlength: [5, 'Question must be at least 5 characters long'],
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(options) {
        return options.length >= 2 && options.length <= 6;
      },
      message: 'Question must have between 2 and 6 options'
    }
  },
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required'],
    validate: {
      validator: function(correctAnswer) {
        return this.options.includes(correctAnswer);
      },
      message: 'Correct answer must be one of the provided options'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
    enum: {
      values: ['Geography', 'Science', 'History', 'Literature', 'Art', 'General Knowledge', 'Entertainment', 'Sports'],
      message: 'Category must be one of: Geography, Science, History, Literature, Art, General Knowledge, Entertainment, Sports'
    }
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty is required'],
    enum: {
      values: ['easy', 'medium', 'hard'],
      message: 'Difficulty must be: easy, medium, or hard'
    }
  },
  explanation: {
    type: String,
    trim: true,
    maxlength: [1000, 'Explanation cannot exceed 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ createdAt: -1 });

// Virtual for getting the number of options
questionSchema.virtual('optionCount').get(function() {
  return this.options.length;
});

// Method to check if an answer is correct
questionSchema.methods.isCorrectAnswer = function(answer) {
  return this.correctAnswer.toLowerCase() === answer.toLowerCase();
};

// Static method to get random questions
questionSchema.statics.getRandomQuestions = async function(count = 10, filters = {}) {
  const matchStage = {};
  
  if (filters.category) {
    matchStage.category = filters.category;
  }
  
  if (filters.difficulty) {
    matchStage.difficulty = filters.difficulty;
  }
  
  const pipeline = [
    { $match: matchStage },
    { $sample: { size: count } }
  ];
  
  return await this.aggregate(pipeline);
};

// Update updatedAt timestamp before saving
questionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Question', questionSchema);
