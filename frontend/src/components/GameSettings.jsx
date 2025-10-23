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
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center mb-6">
        <Settings className="h-6 w-6 text-blue-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Game Settings</h2>
      </div>

      <div className="space-y-4">
        {/* Player Name */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <User className="h-4 w-4 mr-1" />
            Player Name
          </label>
          <input
            type="text"
            value={settings.playerName}
            onChange={(e) => handleInputChange('playerName', e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {/* Question Count */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Target className="h-4 w-4 mr-1" />
            Number of Questions
          </label>
          <select
            value={settings.questionCount}
            onChange={(e) => handleInputChange('questionCount', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          >
            {[5, 10, 15, 20, 25].map(count => (
              <option key={count} value={count}>{count} questions</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Zap className="h-4 w-4 mr-1" />
            Difficulty
          </label>
          <div className="grid grid-cols-2 gap-2">
            {difficulties.map(difficulty => (
              <button
                key={difficulty}
                onClick={() => handleInputChange('difficulty', difficulty)}
                disabled={loading}
                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium capitalize transition-colors ${
                  settings.difficulty === difficulty
                    ? getDifficultyColor(difficulty)
                    : 'text-gray-600 border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <BookOpen className="h-4 w-4 mr-1" />
            Category
          </label>
          <select
            value={settings.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-6"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Starting Game...
            </div>
          ) : (
            'Start Game'
          )}
        </button>
      </div>

      {/* Game Summary */}
      {settings.playerName && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-medium">{settings.playerName}</span> will play{' '}
            <span className="font-medium">{settings.questionCount} questions</span>{' '}
            {settings.difficulty !== 'mixed' && (
              <>at <span className="font-medium">{settings.difficulty}</span> difficulty</>
            )}{' '}
            {settings.category !== 'mixed' && (
              <>in <span className="font-medium">{settings.category}</span> category</>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default GameSettings;
