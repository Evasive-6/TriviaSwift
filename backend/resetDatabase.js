require('dotenv').config();
const mongoose = require('mongoose');

const Score = require('./models/Score');
const Question = require('./models/Question');

const resetDatabase = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/triviaswift';
    await mongoose.connect(mongoURI);
    
    console.log('✅ Connected to MongoDB');

    // Delete all scores
    const deletedScores = await Score.deleteMany({});
    console.log(`🗑️  Deleted ${deletedScores.deletedCount} scores`);

    // Optionally, you can keep questions but let's show the count
    const questionCount = await Question.countDocuments();
    console.log(`📚 Keeping ${questionCount} questions`);

    console.log('✅ Database reset complete!');
    console.log('\nCurrent state:');
    console.log('- Scores: 0');
    console.log(`- Questions: ${questionCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
};

resetDatabase();
