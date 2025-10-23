import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  avatar: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  stats: {
    totalGames: {
      type: Number,
      default: 0
    },
    totalScore: {
      type: Number,
      default: 0
    },
    totalCorrect: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 0
    },
    bestScore: {
      type: Number,
      default: 0
    },
    averageAccuracy: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'mixed'],
      default: 'mixed'
    },
    categories: [{
      type: String,
      enum: ['Geography', 'Science', 'History', 'Literature', 'Art', 'General Knowledge', 'Entertainment', 'Sports']
    }],
    questionCount: {
      type: Number,
      default: 10,
      min: 5,
      max: 50
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'stats.totalScore': -1 });
userSchema.index({ 'stats.bestScore': -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Method to update user stats after game
userSchema.methods.updateStats = function(gameResult) {
  this.stats.totalGames += 1;
  this.stats.totalScore += gameResult.score;
  this.stats.totalCorrect += gameResult.correctAnswers;
  this.stats.totalQuestions += gameResult.totalQuestions;
  
  if (gameResult.score > this.stats.bestScore) {
    this.stats.bestScore = gameResult.score;
  }
  
  this.stats.averageAccuracy = ((this.stats.totalCorrect / this.stats.totalQuestions) * 100).toFixed(1);
  this.lastLogin = Date.now();
};

// Virtual for accuracy percentage
userSchema.virtual('accuracyPercentage').get(function() {
  if (this.stats.totalQuestions === 0) return 0;
  return ((this.stats.totalCorrect / this.stats.totalQuestions) * 100).toFixed(1);
});

// Virtual for average score
userSchema.virtual('averageScore').get(function() {
  if (this.stats.totalGames === 0) return 0;
  return (this.stats.totalScore / this.stats.totalGames).toFixed(1);
});

// Method to get public profile (exclude password)
userSchema.methods.toPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model('User', userSchema);
