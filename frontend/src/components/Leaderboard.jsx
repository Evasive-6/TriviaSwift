import React from 'react';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

const Leaderboard = ({ scores, loading = false, error = null, limit = 10 }) => {
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading leaderboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!scores || scores.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Scores Yet</h3>
          <p className="text-gray-500">Be the first to play and set a high score!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
        <div className="flex items-center justify-center">
          <Trophy className="h-6 w-6 text-white mr-2" />
          <h2 className="text-xl font-bold text-white">Leaderboard</h2>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-gray-50 p-4">
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          {/* 2nd Place */}
          {scores[1] && (
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Medal className="h-6 w-6 text-gray-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">2</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-800 truncate">{scores[1].playerName}</p>
              <p className="text-xs text-gray-600">{scores[1].score} pts</p>
            </div>
          )}

          {/* 1st Place */}
          {scores[0] && (
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">1</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-800 truncate">{scores[0].playerName}</p>
              <p className="text-xs text-gray-600">{scores[0].score} pts</p>
            </div>
          )}

          {/* 3rd Place */}
          {scores[2] && (
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-800 truncate">{scores[2].playerName}</p>
              <p className="text-xs text-gray-600">{scores[2].score} pts</p>
            </div>
          )}
        </div>
      </div>

      {/* Full List */}
      <div className="divide-y divide-gray-200">
        {scores.slice(0, limit).map((score, index) => {
          const rank = index + 1;
          return (
            <div
              key={`${score.playerName}-${score.timestamp || index}`}
              className={`flex items-center p-4 hover:bg-gray-50 transition-colors ${
                rank <= 3 ? 'bg-gray-50' : ''
              }`}
            >
              <div className="flex items-center justify-center w-10 mr-4">
                {getRankIcon(rank)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {score.playerName}
                </p>
                <p className="text-xs text-gray-500">
                  {score.accuracy} accuracy • {score.totalQuestions} questions
                </p>
              </div>

              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {score.score}
                </div>
                <div className="text-xs text-gray-500">
                  {score.timeTaken ? `${Math.floor(score.timeTaken / 60)}:${(score.timeTaken % 60).toString().padStart(2, '0')}` : '--:--'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      {scores.length > limit && (
        <div className="bg-gray-50 p-3 text-center">
          <p className="text-sm text-gray-600">
            Showing top {limit} of {scores.length} scores
          </p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
