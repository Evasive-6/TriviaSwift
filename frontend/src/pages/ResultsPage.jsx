import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Clock, TrendingUp, RotateCcw, Home, Share2 } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import Header from '../components/Header.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const ResultsPage = () => {
  const navigate = useNavigate();
  const {
    currentGame,
    gameStatus,
    resetGame,
    isLoading
  } = useGame();

  useEffect(() => {
    if (gameStatus !== 'completed') {
      navigate('/');
    }
  }, [gameStatus, navigate]);

  if (gameStatus !== 'completed' || !currentGame) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <LoadingSpinner size="large" text="Loading results..." />
        </div>
      </div>
    );
  }

  const { finalScore, correctAnswers, totalQuestions, accuracy, totalTime } = currentGame;

  const getPerformanceMessage = () => {
    const percentage = accuracy;
    if (percentage >= 90) return { message: "Outstanding! You're a trivia master!", color: "text-green-600", bg: "bg-green-100" };
    if (percentage >= 80) return { message: "Excellent work! Very impressive!", color: "text-blue-600", bg: "bg-blue-100" };
    if (percentage >= 70) return { message: "Great job! Well done!", color: "text-purple-600", bg: "bg-purple-100" };
    if (percentage >= 60) return { message: "Good effort! Keep practicing!", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { message: "Keep trying! Practice makes perfect!", color: "text-orange-600", bg: "bg-orange-100" };
  };

  const performance = getPerformanceMessage();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayAgain = () => {
    resetGame();
    navigate('/');
  };

  const handleGoHome = () => {
    resetGame();
    navigate('/');
  };

  const handleShareResults = () => {
    const text = `I just scored ${finalScore} points in TriviaSwift! ${accuracy}% accuracy on ${totalQuestions} questions. Can you beat my score?`;
    if (navigator.share) {
      navigator.share({ title: 'TriviaSwift Results', text });
    } else {
      navigator.clipboard.writeText(text);
      // You could show a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Results Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Game Complete!</h1>
            <p className="text-gray-600">Here's how you performed</p>
          </div>

          {/* Performance Message */}
          <div className={`p-4 rounded-lg mb-6 ${performance.bg}`}>
            <p className={`text-center font-semibold ${performance.color}`}>
              {performance.message}
            </p>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{finalScore}</div>
              <div className="text-sm text-gray-600">Final Score</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {correctAnswers}/{totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Correct Answers</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 text-center">
              <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">
                {formatTime(totalTime)}
              </div>
              <div className="text-sm text-gray-600">Time Taken</div>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Game Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Questions Answered:</span>
                <span className="font-medium">{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Correct Answers:</span>
                <span className="font-medium text-green-600">{correctAnswers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Points Earned:</span>
                <span className="font-medium text-blue-600">{finalScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average per Question:</span>
                <span className="font-medium">{(finalScore / totalQuestions).toFixed(1)} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Completion Time:</span>
                <span className="font-medium">{formatTime(totalTime)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePlayAgain}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              <RotateCcw className="h-5 w-5 mr-2" />
              Play Again
            </button>

            <button
              onClick={handleShareResults}
              className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share Results
            </button>

            <button
              onClick={() => navigate('/leaderboard')}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-colors"
            >
              <Trophy className="h-5 w-5 mr-2" />
              View Leaderboard
            </button>
          </div>

          {/* Home Button */}
          <div className="text-center mt-6">
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center mx-auto text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Home className="h-4 w-4 mr-1" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
