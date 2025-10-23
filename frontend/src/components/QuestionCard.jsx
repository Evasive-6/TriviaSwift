import React from 'react';
import { Clock, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QuestionCard = ({
  question,
  options,
  onAnswerSelect,
  selectedAnswer,
  showResult = false,
  correctAnswer,
  timeRemaining = null,
  currentQuestionIndex = 0,
  totalQuestions = 0
}) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-emerald-600 bg-emerald-100 border-emerald-200';
      case 'medium':
        return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'hard':
        return 'text-rose-600 bg-rose-100 border-rose-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  const getOptionClassName = (option) => {
    let baseClasses = 'w-full p-4 text-left rounded-xl border-2 transition-all duration-300 cursor-pointer hover-lift relative overflow-hidden group font-medium';

    if (showResult) {
      if (option === correctAnswer) {
        baseClasses += ' border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 shadow-lg animate-glow';
      } else if (option === selectedAnswer && option !== correctAnswer) {
        baseClasses += ' border-rose-500 bg-gradient-to-r from-rose-50 to-red-50 text-rose-800 shadow-lg';
      } else {
        baseClasses += ' border-slate-200 bg-white/80 backdrop-blur-sm';
      }
    } else {
      if (selectedAnswer === option) {
        baseClasses += ' border-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl option-selected animate-glow';
      } else {
        baseClasses += ' border-slate-200 bg-white/90 backdrop-blur-sm hover:border-indigo-300 hover:shadow-lg hover:bg-white';
      }
    }

    return baseClasses;
  };

  const getLetterClassName = (index, isSelected) => {
    let baseClasses = 'flex-shrink-0 w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center mr-4 transition-all duration-300';
    
    if (isSelected) {
      baseClasses += ' bg-white text-indigo-600 shadow-lg scale-110';
    } else {
      baseClasses += ' bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-2 border-indigo-500 shadow-md';
    }
    
    return baseClasses;
  };

  const progressPercentage = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  // Animation variants for question transitions
  const questionVariants = {
    initial: { 
      opacity: 0, 
      x: 50, 
      scale: 0.95 
    },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      x: -50, 
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const optionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  return (
    <div className="relative">
      {/* Decorative Elements */}
      <div className="decorative-element decorative-element-1">
        <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-20 animate-float"></div>
      </div>
      <div className="decorative-element decorative-element-2">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-float"></div>
      </div>
      <div className="decorative-element decorative-element-3">
        <div className="w-20 h-20 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full opacity-15 animate-float"></div>
      </div>
      <div className="decorative-element decorative-element-4">
        <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-float"></div>
      </div>

      {/* Main Card with Framer Motion */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question?.id || 'loading'}
          variants={questionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="glass-morphism rounded-2xl shadow-lg p-6 max-w-3xl mx-auto relative z-10"
        >
          {/* Progress Section */}
          <div className="text-center mb-6">
            <div className="text-lg font-bold text-slate-700 mb-2 font-['Poppins']">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </div>
            <div className="w-full bg-slate-200/50 rounded-full h-3 mb-4 overflow-hidden backdrop-blur-sm">
              <motion.div 
                className="progress-bar h-full rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Question Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-600 font-['Inter']">
                  Question #{question?.id || 'N/A'}
                </span>
                {question?.category && (
                  <div className="text-xs text-slate-500 mt-1 font-['Inter']">
                    {question.category}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Difficulty Badge */}
              {question?.difficulty && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getDifficultyColor(question.difficulty)} shadow-lg`}>
                  {question.difficulty.toUpperCase()}
                </span>
              )}

              {/* Timer */}
              {timeRemaining !== null && (
                <div className="flex items-center space-x-2 text-slate-600 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-xl shadow-lg">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span className="font-bold text-sm font-['Space_Grotesk']">{timeRemaining}s</span>
                </div>
              )}
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <motion.h2 
              className="text-xl font-bold text-slate-900 leading-relaxed text-center font-['Poppins'] tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {question?.question || 'Loading question...'}
            </motion.h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {options?.map((option, index) => {
              const isSelected = selectedAnswer === option;
              return (
                <motion.button
                  key={`${question?.id}-${index}`}
                  custom={index}
                  variants={optionVariants}
                  initial="initial"
                  animate="animate"
                  onClick={() => !showResult && onAnswerSelect(option)}
                  disabled={showResult}
                  className={getOptionClassName(option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center">
                    <span className={getLetterClassName(index, isSelected)}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-left font-semibold text-lg font-['Inter']">{option}</span>
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </motion.button>
              );
            })}
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuestionCard;