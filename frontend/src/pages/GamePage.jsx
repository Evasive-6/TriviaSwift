import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Home } from 'lucide-react';
import { useGame } from '../context/GameContext.jsx';
import Header from '../components/Header.jsx';
import QuestionCard from '../components/QuestionCard.jsx';
import ScoreBoard from '../components/ScoreBoard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const GamePage = () => {
  const navigate = useNavigate();
  const {
    gameStatus,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    score,
    correctAnswers,
    isLoading,
    error,
    submitAnswer,
    resetGame
  } = useGame();

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswering, setIsAnswering] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Timer effect
  useEffect(() => {
    if (gameStatus === 'playing') {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameStatus]);

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
  }, [currentQuestion]);

  const handleAnswerSelect = async (answer) => {
    if (isAnswering || showResult) return;

    setSelectedAnswer(answer);
    setIsAnswering(true);

    try {
      await submitAnswer(answer);
      setShowResult(true);
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setIsAnswering(false);
    }
  };

  const handleNextQuestion = () => {
    setShowResult(false);
    setSelectedAnswer(null);
  };

  const handleEndGame = () => {
    resetGame();
    navigate('/');
  };

  const handleGoHome = () => {
    resetGame();
    navigate('/');
  };

  if (gameStatus === 'idle') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Active Game</h2>
          <p className="text-gray-600 mb-8">Please start a new game from the home page.</p>
          <button
            onClick={handleGoHome}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (gameStatus === 'completed') {
    navigate('/results');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Game Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleGoHome}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Home
          </button>

          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 mr-1" />
            <span>{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Score Board */}
        <ScoreBoard
          score={score}
          correctAnswers={correctAnswers}
          totalQuestions={totalQuestions}
          currentQuestion={currentQuestionIndex}
          timeElapsed={timeElapsed}
        />

        {/* Question Card */}
        <div className="mb-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" text="Loading question..." />
            </div>
          ) : currentQuestion ? (
            <QuestionCard
              question={currentQuestion}
              options={currentQuestion.options}
              onAnswerSelect={handleAnswerSelect}
              selectedAnswer={selectedAnswer}
              showResult={showResult}
              correctAnswer={currentQuestion.correctAnswer}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-600">Loading question...</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {showResult && currentQuestionIndex < totalQuestions && (
            <button
              onClick={handleNextQuestion}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Next Question
            </button>
          )}

          <button
            onClick={handleEndGame}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            End Game
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 max-w-2xl mx-auto">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isAnswering && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <LoadingSpinner text="Submitting answer..." />
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
