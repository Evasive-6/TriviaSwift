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
    gameSettings,
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
    <div className="min-h-screen quiz-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">TriviaSwift</span>
          </h1>
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
            Challenge yourself with our exciting trivia game! Test your knowledge across multiple categories and compete for the highest score.
          </p>

          {/* Quick Stats */}
          {statistics && (
            <div className="flex justify-center space-x-8 mb-6 animate-slide-in-right">
              <div className="text-center group">
                <div className="text-2xl font-bold text-indigo-500 group-hover:scale-110 transition-transform duration-300">{statistics.totalGames || 0}</div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Games Played</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-purple-500 group-hover:scale-110 transition-transform duration-300">{statistics.totalPlayers || 0}</div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Players</div>
              </div>
              <div className="text-center group">
                <div className="text-2xl font-bold text-orange-500 group-hover:scale-110 transition-transform duration-300">{statistics.highestScore || 0}</div>
                <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">High Score</div>
              </div>
            </div>
          )}
        </div>

        {/* Game Settings */}
        <div className="max-w-md mx-auto mb-8 animate-fade-in-up">
          <GameSettings
            settings={gameSettings}
            onSettingsChange={updateGameSettings}
            onStartGame={handleStartGame}
            loading={isLoading}
          />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="glass-morphism rounded-xl shadow-lg p-4 text-center hover-lift group animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 font-['Poppins']">{feature.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-['Inter']">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="text-center animate-fade-in-up">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/leaderboard')}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold text-sm hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 hover-lift shadow-lg"
            >
              <Trophy className="h-4 w-4 mr-2" />
              View Leaderboard
            </button>
            <button
              onClick={() => navigate('/about')}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold text-sm hover:from-gray-600 hover:to-gray-700 transition-all duration-300 hover-lift shadow-lg"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="fixed bottom-6 right-6 max-w-sm animate-slide-in-right">
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-2xl shadow-lg">
            <p className="font-bold text-lg">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && <LoadingSpinner fullScreen text="Starting your game..." />}
    </div>
  );
};

export default HomePage;
