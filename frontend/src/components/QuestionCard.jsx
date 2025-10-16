import React from 'react';
import { Clock, Target, Zap } from 'lucide-react';

const QuestionCard = ({
  question,
  options,
  onAnswerSelect,
  selectedAnswer,
  showResult = false,
  correctAnswer,
  timeRemaining = null
}) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'hard':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getOptionClassName = (option, index) => {
    let baseClasses = 'w-full p-4 text-left rounded-lg border-2 transition-all duration-200 cursor-pointer hover:bg-gray-50';

    if (showResult) {
      if (option === correctAnswer) {
        baseClasses += ' border-green-500 bg-green-50 text-green-800';
      } else if (option === selectedAnswer && option !== correctAnswer) {
        baseClasses += ' border-red-500 bg-red-50 text-red-800';
      } else {
        baseClasses += ' border-gray-200 bg-white';
      }
    } else {
      baseClasses += selectedAnswer === option
        ? ' border-blue-500 bg-blue-50 text-blue-800'
        : ' border-gray-200 bg-white';
    }

    return baseClasses;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-600">
            Question {question?.id || 'N/A'}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Difficulty Badge */}
          {question?.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty.toUpperCase()}
            </span>
          )}

          {/* Timer */}
          {timeRemaining !== null && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{timeRemaining}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Category */}
      {question?.category && (
        <div className="mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Zap className="h-3 w-3 mr-1" />
            {question.category}
          </span>
        </div>
      )}

      {/* Question Text */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
          {question?.question || 'Loading question...'}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options?.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && onAnswerSelect(option)}
            disabled={showResult}
            className={getOptionClassName(option, index)}
          >
            <div className="flex items-center">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-current text-white text-sm font-medium flex items-center justify-center mr-3">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-left">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Result Feedback */}
      {showResult && (
        <div className="mt-4 p-4 rounded-lg bg-gray-50">
          <div className="flex items-center">
            {selectedAnswer === correctAnswer ? (
              <>
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-green-800 font-medium">Correct!</span>
              </>
            ) : (
              <>
                <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center mr-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-red-800 font-medium">Incorrect</span>
                <span className="text-gray-600 ml-2">
                  Correct answer: {correctAnswer}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
