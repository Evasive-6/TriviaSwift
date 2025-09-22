import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, RefreshCw, Filter } from 'lucide-react';
import Header from '../components/Header.jsx';
import Leaderboard from '../components/Leaderboard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import scoreService from '../services/scoreService.js';

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [limit, setLimit] = useState(20);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadScores();
  }, [limit, filter]);

  const loadScores = async () => {
    try {
      setLoading(true);
      setError(null);

      let scoresData;
      if (filter === 'all') {
        scoresData = await scoreService.getTopScores(limit);
      } else {
        // For now, just get all scores and filter client-side
        // In a real app, you'd have server-side filtering
        const allScores = await scoreService.getAllScores();
        scoresData = allScores.data.slice(0, limit);
      }

      setScores(scoresData.data || []);
    } catch (err) {
      console.error('Error loading scores:', err);
      setError('Failed to load leaderboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadScores();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Home
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-5 w-5 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">See how you rank against other players</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>Top 10</option>
              <option value={20}>Top 20</option>
              <option value={50}>Top 50</option>
              <option value={100}>Top 100</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {/* Leaderboard Component */}
        <Leaderboard
          scores={scores}
          loading={loading}
          error={error}
          limit={limit}
        />

        {/* Quick Actions */}
        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
          >
            <Trophy className="h-5 w-5 inline mr-2" />
            Play Now
          </button>
        </div>

        {/* Stats Summary */}
        {scores.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Quick Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{scores.length}</div>
                <div className="text-sm text-gray-600">Total Scores</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0}
                </div>
                <div className="text-sm text-gray-600">Highest Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {scores.length > 0 ? (scores.reduce((sum, s) => sum + s.score, 0) / scores.length).toFixed(0) : 0}
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {scores.length > 0 ? Math.max(...scores.map(s => s.accuracy || 0)) : 0}%
                </div>
                <div className="text-sm text-gray-600">Best Accuracy</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
