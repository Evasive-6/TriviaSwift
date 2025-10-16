import api from './api.js';

class QuestionService {
  // Get all questions
  async getAllQuestions() {
    try {
      const response = await api.get('/questions');
      return response.data;
    } catch (error) {
      console.error('Error getting all questions:', error);
      throw error;
    }
  }

  // Get random questions
  async getRandomQuestions(count = 10, filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);

      const url = `/questions/random/${count}${params.toString() ? '?' + params.toString() : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error getting random questions:', error);
      throw error;
    }
  }

  // Get questions by category
  async getQuestionsByCategory(category) {
    try {
      const response = await api.get(`/questions/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error getting questions by category:', error);
      throw error;
    }
  }

  // Get question by ID
  async getQuestionById(id) {
    try {
      const response = await api.get(`/questions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error getting question by ID:', error);
      throw error;
    }
  }

  // Get available categories
  async getCategories() {
    try {
      const response = await this.getAllQuestions();
      const categories = [...new Set(response.data.map(q => q.category))];
      return categories.sort();
    } catch (error) {
      console.error('Error getting categories:', error);
      throw error;
    }
  }

  // Get available difficulties
  async getDifficulties() {
    return ['easy', 'medium', 'hard'];
  }
}

export default new QuestionService();
