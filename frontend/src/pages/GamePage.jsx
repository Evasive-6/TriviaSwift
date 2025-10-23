import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const handleAnswerSelect = useCallback(async (answer) => {
    if (isAnswering || showResult) return;

    setSelectedAnswer(answer);
    setIsAnswering(true);

    try {
      await submitAnswer(answer);
      // Automatically move to next question after a brief delay
      setTimeout(() => {
        setIsAnswering(false);
        setSelectedAnswer(null);
        setShowResult(false);
      }, 500);
    } catch (error) {
      console.error('Error submitting answer:', error);
      setIsAnswering(false);
    }
  }, [isAnswering, showResult, submitAnswer]);

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
    <div className="min-h-screen quiz-background">
      <Header />

        <div className="container mx-auto px-4 py-6">
          {/* Game Header */}
          <div className="flex items-center justify-between mb-6 animate-fade-in-up">
            <button
              onClick={handleGoHome}
              className="flex items-center text-slate-700 hover:text-slate-900 transition-all duration-300 glass-morphism px-4 py-2 rounded-xl hover:shadow-lg hover-lift font-['Inter'] font-semibold"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span>Home</span>
            </button>

            <div className="flex items-center text-slate-700 glass-morphism px-4 py-2 rounded-xl shadow-lg">
              <Clock className="h-5 w-5 mr-2 text-indigo-500" />
              <span className="font-black text-lg font-['Space_Grotesk']">
                {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* Score Board */}
          <div className="mb-6 animate-slide-in-right">
            <ScoreBoard
              score={score}
              correctAnswers={correctAnswers}
              totalQuestions={totalQuestions}
              currentQuestion={currentQuestionIndex}
              timeElapsed={timeElapsed}
            />
          </div>

          {/* Question Card */}
          <div className="mb-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center py-12"
                >
                  <div className="glass-morphism rounded-2xl shadow-lg p-8 animate-pulse-slow">
                    <LoadingSpinner size="large" text="Loading question..." />
                  </div>
                </motion.div>
              ) : currentQuestion ? (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuestionCard
                    question={currentQuestion}
                    options={currentQuestion.options}
                    onAnswerSelect={handleAnswerSelect}
                    selectedAnswer={selectedAnswer}
                    showResult={showResult}
                    correctAnswer={currentQuestion.correctAnswer}
                    currentQuestionIndex={currentQuestionIndex}
                    totalQuestions={totalQuestions}
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="no-question"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-morphism rounded-2xl shadow-lg p-8 text-center animate-fade-in-up"
                >
                  <p className="text-slate-600 text-lg font-['Inter']">Loading question...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center animate-fade-in-up">
            <button
              onClick={handleEndGame}
              className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-300 hover-lift shadow-lg font-['Poppins']"
            >
              End Game
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-6 max-w-xl mx-auto animate-slide-in-right">
              <div className="bg-gradient-to-r from-rose-100 to-red-100 border-2 border-rose-400 text-rose-700 px-6 py-4 rounded-xl shadow-lg">
                <p className="font-bold text-lg font-['Poppins']">Error</p>
                <p className="text-sm mt-1 font-['Inter']">{error}</p>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isAnswering && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="glass-morphism rounded-2xl shadow-lg p-8 animate-pulse-slow">
                <LoadingSpinner text="Submitting answer..." />
              </div>
            </div>
          )}
        </div>
    </div>
  );
};

export default GamePage;
