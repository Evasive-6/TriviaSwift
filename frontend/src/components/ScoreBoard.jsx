import React from 'react';
import { Trophy, Target, Clock, TrendingUp } from 'lucide-react';

const ScoreBoard = ({
  score,
  correctAnswers,
  totalQuestions,
  currentQuestion,
  timeElapsed = null,
  accuracy = null
}) => {
  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;
  const calculatedAccuracy = accuracy || (totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0);

  const formatTime = (seconds) => {
    if (seconds === null) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Score */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="h-5 w-5 text-yellow-500 mr-1" />
            <span className="text-sm font-medium text-gray-600">Score</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{score}</div>
        </div>

        {/* Correct Answers */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Target className="h-5 w-5 text-green-500 mr-1" />
            <span className="text-sm font-medium text-gray-600">Correct</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {correctAnswers}/{totalQuestions}
          </div>
        </div>

        {/* Accuracy */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-1" />
            <span className="text-sm font-medium text-gray-600">Accuracy</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {calculatedAccuracy.toFixed(0)}%
          </div>
        </div>

        {/* Time */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-5 w-5 text-purple-500 mr-1" />
            <span className="text-sm font-medium text-gray-600">Time</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatTime(timeElapsed)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-600">
            {currentQuestion} / {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Performance Indicator */}
      {calculatedAccuracy > 0 && (
        <div className="mt-4 flex justify-center">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            calculatedAccuracy >= 80
              ? 'bg-green-100 text-green-800'
              : calculatedAccuracy >= 60
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {calculatedAccuracy >= 80 ? 'Excellent!' : calculatedAccuracy >= 60 ? 'Good Job!' : 'Keep Trying!'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
