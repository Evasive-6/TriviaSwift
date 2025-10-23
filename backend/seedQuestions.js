require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Question = require('./models/Question');

const seedQuestions = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/triviaswift';
    await mongoose.connect(mongoURI);
    
    console.log('✅ Connected to MongoDB');

    // Read questions from JSON file
    const questionsFilePath = path.join(__dirname, 'data', 'questions.json');
    const questionsData = JSON.parse(fs.readFileSync(questionsFilePath, 'utf8'));

    // Remove id field from questions (MongoDB will generate _id)
    const questionsToInsert = questionsData.map(q => {
      const { id, ...questionWithoutId } = q;
      return questionWithoutId;
    });

    // Clear existing questions
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing questions');

    // Insert questions
    const insertedQuestions = await Question.insertMany(questionsToInsert);
    console.log(`✅ Inserted ${insertedQuestions.length} questions`);

    console.log('\n📊 Questions by category:');
    const categories = {};
    insertedQuestions.forEach(q => {
      categories[q.category] = (categories[q.category] || 0) + 1;
    });
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  - ${category}: ${count}`);
    });

    console.log('\n📊 Questions by difficulty:');
    const difficulties = {};
    insertedQuestions.forEach(q => {
      difficulties[q.difficulty] = (difficulties[q.difficulty] || 0) + 1;
    });
    Object.entries(difficulties).forEach(([difficulty, count]) => {
      console.log(`  - ${difficulty}: ${count}`);
    });

    console.log('\n✅ Database seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedQuestions();
