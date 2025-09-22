import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

// Pages
import HomePage from './pages/HomePage.jsx'
import GamePage from './pages/GamePage.jsx'
import ResultsPage from './pages/ResultsPage.jsx'
import LeaderboardPage from './pages/LeaderboardPage.jsx'
import AboutPage from './pages/AboutPage.jsx'

const App = () => {
  return (
    <ErrorBoundary>
      <GameProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </div>
        </Router>
      </GameProvider>
    </ErrorBoundary>
  )
}

export default App
