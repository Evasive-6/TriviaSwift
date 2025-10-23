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
    <div className="glass-morphism rounded-2xl shadow-lg p-6 mb-6 hover-lift">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Score */}
        <div className="text-center group">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Trophy className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-xs font-bold text-slate-600 mb-1 font-['Inter'] uppercase tracking-wide">Score</div>
          <div className="text-2xl font-black text-slate-900 group-hover:text-yellow-600 transition-colors duration-300 font-['Space_Grotesk']">{score}</div>
        </div>

        {/* Correct Answers */}
        <div className="text-center group">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-emerald-400 to-green-400 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-xs font-bold text-slate-600 mb-1 font-['Inter'] uppercase tracking-wide">Correct</div>
          <div className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors duration-300 font-['Space_Grotesk']">
            {correctAnswers}/{totalQuestions}
          </div>
        </div>

        {/* Accuracy */}
        <div className="text-center group">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-xs font-bold text-slate-600 mb-1 font-['Inter'] uppercase tracking-wide">Accuracy</div>
          <div className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors duration-300 font-['Space_Grotesk']">
            {calculatedAccuracy.toFixed(0)}%
          </div>
        </div>

        {/* Time */}
        <div className="text-center group">
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 bg-gradient-to-r from-violet-400 to-purple-400 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
          </div>
          <div className="text-xs font-bold text-slate-600 mb-1 font-['Inter'] uppercase tracking-wide">Time</div>
          <div className="text-2xl font-black text-slate-900 group-hover:text-violet-600 transition-colors duration-300 font-['Space_Grotesk']">
            {formatTime(timeElapsed)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-slate-700 font-['Inter']">Progress</span>
          <span className="text-sm font-bold text-slate-700 font-['Inter']">
            {currentQuestion} / {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-slate-200/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
          <div
            className="progress-bar h-full rounded-full shadow-lg"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Performance Indicator */}
      {calculatedAccuracy > 0 && (
        <div className="mt-4 flex justify-center animate-fade-in-up">
          <div className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg font-['Poppins'] ${
            calculatedAccuracy >= 80
              ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white animate-pulse-slow'
              : calculatedAccuracy >= 60
              ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
              : 'bg-gradient-to-r from-rose-400 to-red-500 text-white'
          }`}>
            {calculatedAccuracy >= 80 ? '🏆 Excellent!' : calculatedAccuracy >= 60 ? '👍 Great Job!' : '💪 Keep Improving!'}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
