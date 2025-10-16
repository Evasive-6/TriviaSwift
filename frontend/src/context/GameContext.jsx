import React, { createContext, useContext, useReducer, useEffect } from 'react';
import gameService from '../services/gameService.js';
import scoreService from '../services/scoreService.js';

// Initial state
const initialState = {
  // Game session
  currentGame: null,
  gameStatus: 'idle', // 'idle', 'playing', 'completed', 'error'

  // Current question
  currentQuestion: null,
  currentQuestionIndex: 0,
  totalQuestions: 0,

  // Score tracking
  score: 0,
  correctAnswers: 0,

  // Game settings
  gameSettings: {
    playerName: '',
    questionCount: 10,
    difficulty: 'mixed',
    category: 'mixed'
  },

  // Statistics
  statistics: null,

  // Loading states
  isLoading: false,
  error: null
};

// Action types
const GAME_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_GAME_SETTINGS: 'SET_GAME_SETTINGS',
  START_GAME: 'START_GAME',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  SUBMIT_ANSWER: 'SUBMIT_ANSWER',
  COMPLETE_GAME: 'COMPLETE_GAME',
  RESET_GAME: 'RESET_GAME',
  SET_STATISTICS: 'SET_STATISTICS'
};

// Reducer
function gameReducer(state, action) {
  switch (action.type) {
    case GAME_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case GAME_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case GAME_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case GAME_ACTIONS.SET_GAME_SETTINGS:
      return {
        ...state,
        gameSettings: { ...state.gameSettings, ...action.payload }
      };

    case GAME_ACTIONS.START_GAME:
      return {
        ...state,
        currentGame: action.payload,
        gameStatus: 'playing',
        currentQuestion: action.payload.question,
        currentQuestionIndex: 1,
        totalQuestions: action.payload.totalQuestions,
        score: 0,
        correctAnswers: 0,
        isLoading: false,
        error: null
      };

    case GAME_ACTIONS.SET_CURRENT_QUESTION:
      return {
        ...state,
        currentQuestion: action.payload.question,
        currentQuestionIndex: action.payload.currentQuestion,
        totalQuestions: action.payload.totalQuestions,
        score: action.payload.score,
        correctAnswers: action.payload.correctAnswers
      };

    case GAME_ACTIONS.SUBMIT_ANSWER:
      const newScore = action.payload.wasCorrect ? state.score + 10 : state.score;
      const newCorrectAnswers = action.payload.wasCorrect ? state.correctAnswers + 1 : state.correctAnswers;

      return {
        ...state,
        score: newScore,
        correctAnswers: newCorrectAnswers,
        currentQuestionIndex: action.payload.currentQuestion,
        currentQuestion: action.payload.question,
        totalQuestions: action.payload.totalQuestions
      };

    case GAME_ACTIONS.COMPLETE_GAME:
      return {
        ...state,
        gameStatus: 'completed',
        currentGame: {
          ...state.currentGame,
          finalScore: action.payload.finalScore,
          correctAnswers: action.payload.correctAnswers,
          totalQuestions: action.payload.totalQuestions,
          accuracy: action.payload.accuracy,
          totalTime: action.payload.totalTime
        },
        isLoading: false
      };

    case GAME_ACTIONS.RESET_GAME:
      return {
        ...initialState,
        gameSettings: state.gameSettings,
        statistics: state.statistics
      };

    case GAME_ACTIONS.SET_STATISTICS:
      return { ...state, statistics: action.payload };

    default:
      return state;
  }
}

// Context
const GameContext = createContext();

// Provider component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load statistics on mount
  useEffect(() => {
    loadGameStatistics();
  }, []);

  const loadGameStatistics = async () => {
    try {
      dispatch({ type: GAME_ACTIONS.SET_LOADING, payload: true });
      const statistics = await scoreService.getGameStatistics();
      dispatch({ type: GAME_ACTIONS.SET_STATISTICS, payload: statistics.data });
    } catch (error) {
      console.error('Failed to load game statistics:', error);
      dispatch({ type: GAME_ACTIONS.SET_ERROR, payload: 'Failed to load game statistics' });
    } finally {
      dispatch({ type: GAME_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const updateGameSettings = (settings) => {
    dispatch({ type: GAME_ACTIONS.SET_GAME_SETTINGS, payload: settings });
  };

  const startNewGame = async () => {
    try {
      dispatch({ type: GAME_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: GAME_ACTIONS.CLEAR_ERROR });

      const gameData = await gameService.startGame(state.gameSettings);
      dispatch({ type: GAME_ACTIONS.START_GAME, payload: gameData });
    } catch (error) {
      dispatch({ type: GAME_ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: GAME_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const submitAnswer = async (answer) => {
    try {
      if (!state.currentGame) {
        throw new Error('No active game session');
      }

      dispatch({ type: GAME_ACTIONS.SET_LOADING, payload: true });
      const result = await gameService.submitAnswer(state.currentGame.gameId, answer);

      if (result.gameComplete) {
        // Submit final score
        await scoreService.submitScore({
          playerName: state.gameSettings.playerName,
          score: result.finalScore,
          totalQuestions: result.totalQuestions,
          correctAnswers: result.correctAnswers,
          timeTaken: result.totalTime,
          difficulty: state.gameSettings.difficulty,
          categories: [state.gameSettings.category]
        });

        dispatch({ type: GAME_ACTIONS.COMPLETE_GAME, payload: result });
      } else {
        dispatch({ type: GAME_ACTIONS.SET_CURRENT_QUESTION, payload: result });
      }
    } catch (error) {
      dispatch({ type: GAME_ACTIONS.SET_ERROR, payload: error.message });
    } finally {
      dispatch({ type: GAME_ACTIONS.SET_LOADING, payload: false });
    }
  };

  const resetGame = () => {
    dispatch({ type: GAME_ACTIONS.RESET_GAME });
  };

  const value = {
    ...state,
    updateGameSettings,
    startNewGame,
    submitAnswer,
    resetGame,
    loadGameStatistics
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
