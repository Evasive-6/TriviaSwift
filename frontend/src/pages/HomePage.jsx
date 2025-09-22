import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, BarChart3, Users, Zap, Target } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import GameSettings from '../components/GameSettings.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const HomePage = () => {
  const navigate = useNavigate();
  const {
    gameStatus,
    statistics,
    isLoading,
    error,
    updateGameSettings,
    startNewGame,
    resetGame
  } = useGame();

  useEffect(() => {
    // Reset any existing game when returning to home
    if (gameStatus !== 'idle') {
      resetGame();
    }
  }, []);

  const handleStartGame = async () => {
    await startNewGame();
    navigate('/game');
  };

  const features = [
    {
      icon: Target,
      title: 'Multiple Categories',
      description: 'Test your knowledge across various topics including Science, History, Geography, and more.'
    },
    {
      icon: Zap,
      title: 'Difficulty Levels',
      description: 'Choose from Easy, Medium, Hard, or Mixed difficulty to match your skill level.'
    },
    {
      icon: Trophy,
      title: 'Compete & Score',
      description: 'Track your progress, earn points, and compete with others on the leaderboard.'
    },
    {
      icon: BarChart3,
      title: 'Detailed Statistics',
      description: 'View comprehensive game statistics and track your improvement over time.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">TriviaSwift</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Challenge yourself with our exciting trivia game! Test your knowledge across multiple categories and compete for the highest score.
          </p>

          {/* Quick Stats */}
          {statistics && (
            <div className="flex justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{statistics.totalGames || 0}</div>
                <div className="text-sm text-gray-600">Games Played</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{statistics.totalPlayers || 0}</div>
                <div className="text-sm text-gray-600">Players</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{statistics.highestScore || 0}</div>
                <div className="text-sm text-gray-600">High Score</div>
              </div>
            </div>
          )}
        </div>

        {/* Game Settings */}
        <div className="max-w-md mx-auto mb-12">
          <GameSettings
            settings={{
              playerName: '',
              questionCount: 10,
              difficulty: 'mixed',
              category: 'mixed'
            }}
            onSettingsChange={updateGameSettings}
            onStartGame={handleStartGame}
            loading={isLoading}
          />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/leaderboard')}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-colors"
            >
              <Trophy className="h-5 w-5 mr-2" />
              View Leaderboard
            </button>
            <button
              onClick={() => navigate('/stats')}
              className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              <BarChart3 className="h-5 w-5 mr-2" />
              View Statistics
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 max-w-sm">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && <LoadingSpinner fullScreen text="Starting your game..." />}
    </div>
  );
};

export default HomePage;
