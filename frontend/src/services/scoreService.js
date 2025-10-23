import api from './api.js';

class ScoreService {
  // Get all scores
  async getAllScores() {
    try {
      const response = await api.get('/scores');
      return response.data;
    } catch (error) {
      console.error('Error getting all scores:', error);
      throw error;
    }
  }

  // Get top scores
  async getTopScores(limit = 10) {
    try {
      const response = await api.get(`/scores/top/${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error getting top scores:', error);
      throw error;
    }
  }

  // Get scores by player
  async getPlayerScores(playerName) {
    try {
      const response = await api.get(`/scores/player/${encodeURIComponent(playerName)}`);
      return response.data;
    } catch (error) {
      console.error('Error getting player scores:', error);
      throw error;
    }
  }

  // Submit a new score
  async submitScore(scoreData) {
    try {
      const response = await api.post('/scores', scoreData);
      return response.data;
    } catch (error) {
      console.error('Error submitting score:', error);
      throw error;
    }
  }

  // Get game statistics
  async getGameStatistics() {
    try {
      const response = await api.get('/scores/stats/summary');
      return response.data;
    } catch (error) {
      console.error('Error getting game statistics:', error);
      throw error;
    }
  }

  // Format score for display
  formatScore(score) {
    return {
      ...score,
      accuracy: score.accuracy ? `${score.accuracy}%` : 'N/A',
      timeTaken: score.timeTaken ? `${Math.floor(score.timeTaken / 60)}:${(score.timeTaken % 60).toString().padStart(2, '0')}` : 'N/A',
      timestamp: score.timestamp ? new Date(score.timestamp).toLocaleDateString() : 'N/A'
    };
  }

  // Format multiple scores
  formatScores(scores) {
    return scores.map(score => this.formatScore(score));
  }
}

export default new ScoreService();
