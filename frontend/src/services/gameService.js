import api from './api.js';

class GameService {
  // Start a new game
  async startGame(gameSettings) {
    try {
      const response = await api.post('/game/start', gameSettings);
      return response.data;
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  }

  // Submit an answer
  async submitAnswer(gameId, answer) {
    try {
      const response = await api.post('/game/answer', {
        gameId,
        answer
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting answer:', error);
      throw error;
    }
  }

  // Get game status
  async getGameStatus(gameId) {
    try {
      const response = await api.get(`/game/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting game status:', error);
      throw error;
    }
  }

  // End a game session
  async endGame(gameId) {
    try {
      const response = await api.delete(`/game/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Error ending game:', error);
      throw error;
    }
  }

  // Get game statistics
  async getGameStats() {
    try {
      const response = await api.get('/scores/stats/summary');
      return response.data;
    } catch (error) {
      console.error('Error getting game stats:', error);
      throw error;
    }
  }
}

export default new GameService();
