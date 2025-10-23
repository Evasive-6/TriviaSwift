import React, { useState, useEffect } from 'react';
import { Settings, User, Target, BookOpen, Zap } from 'lucide-react';
import questionService from '../services/questionService.js';

const GameSettings = ({ settings, onSettingsChange, onStartGame, loading = false }) => {
  const [categories, setCategories] = useState([]);
  const [difficulties] = useState(['easy', 'medium', 'hard', 'mixed']);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const availableCategories = await questionService.getCategories();
      setCategories(availableCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories(['General Knowledge', 'Science', 'History', 'Geography', 'Literature', 'Art']);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleInputChange = (field, value) => {
    onSettingsChange({ [field]: value });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 border-green-300 bg-green-50';
      case 'medium':
        return 'text-yellow-600 border-yellow-300 bg-yellow-50';
      case 'hard':
        return 'text-red-600 border-red-300 bg-red-50';
      case 'mixed':
        return 'text-blue-600 border-blue-300 bg-blue-50';
      default:
        return 'text-gray-600 border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="glass-morphism rounded-2xl shadow-lg p-6 max-w-md mx-auto hover-lift">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mr-3 shadow-lg">
          <Settings className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 font-['Poppins']">Game Settings</h2>
      </div>

      <div className="space-y-5">
        {/* Player Name */}
        <div>
          <label className="flex items-center text-sm font-bold text-slate-700 mb-2 font-['Inter']">
            <User className="h-4 w-4 mr-2 text-indigo-500" />
            Player Name
          </label>
          <input
            type="text"
            value={settings.playerName}
            onChange={(e) => handleInputChange('playerName', e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm font-['Inter']"
            disabled={loading}
          />
        </div>

        {/* Question Count */}
        <div>
          <label className="flex items-center text-sm font-bold text-slate-700 mb-2 font-['Inter']">
            <Target className="h-4 w-4 mr-2 text-indigo-500" />
            Number of Questions
          </label>
          <select
            value={settings.questionCount}
            onChange={(e) => handleInputChange('questionCount', parseInt(e.target.value))}
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm font-['Inter'] appearance-none cursor-pointer"
            disabled={loading}
          >
            {[5, 10, 15, 20, 25].map(count => (
              <option key={count} value={count}>{count} questions</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="flex items-center text-sm font-bold text-slate-700 mb-2 font-['Inter']">
            <Zap className="h-4 w-4 mr-2 text-indigo-500" />
            Difficulty
          </label>
          <div className="grid grid-cols-2 gap-2">
            {difficulties.map(difficulty => (
              <button
                key={difficulty}
                onClick={() => handleInputChange('difficulty', difficulty)}
                disabled={loading}
                className={`px-3 py-2 rounded-xl border-2 text-xs font-bold capitalize transition-all duration-300 hover-lift font-['Inter'] ${
                  settings.difficulty === difficulty
                    ? getDifficultyColor(difficulty) + ' shadow-lg'
                    : 'text-slate-600 border-slate-200 bg-white/80 backdrop-blur-sm hover:border-indigo-300 hover:text-indigo-600'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center text-sm font-bold text-slate-700 mb-2 font-['Inter']">
            <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
            Category
          </label>
          <select
            value={settings.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-sm bg-white/80 backdrop-blur-sm font-['Inter'] appearance-none cursor-pointer"
            disabled={loading || loadingCategories}
          >
            <option value="mixed">Mixed Categories</option>
            {loadingCategories ? (
              <option disabled>Loading categories...</option>
            ) : (
              categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))
            )}
          </select>
        </div>

        {/* Start Game Button */}
        <button
          onClick={onStartGame}
          disabled={loading || !settings.playerName.trim()}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-xl font-bold text-lg hover:from-indigo-600 hover:to-purple-600 focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift shadow-lg mt-6 font-['Poppins']"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Starting Game...
            </div>
          ) : (
            '🚀 Start Game'
          )}
        </button>
      </div>

      {/* Game Summary */}
      {settings.playerName && (
        <div className="mt-5 p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20 animate-fade-in-up backdrop-blur-sm">
          <p className="text-sm text-slate-700 font-semibold font-['Inter']">
            <span className="font-bold text-indigo-600">{settings.playerName}</span> will play{' '}
            <span className="font-bold">{settings.questionCount} questions</span>{' '}
            {settings.difficulty !== 'mixed' && (
              <>at <span className="font-bold">{settings.difficulty}</span> difficulty</>
            )}{' '}
            {settings.category !== 'mixed' && (
              <>in <span className="font-bold">{settings.category}</span> category</>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default GameSettings;
