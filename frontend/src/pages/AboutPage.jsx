import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Github, ExternalLink, Heart, Code, Users, Trophy } from 'lucide-react';
import Header from '../components/Header.jsx';

const AboutPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Trophy,
      title: 'Multiple Categories',
      description: 'Test your knowledge across Science, History, Geography, Literature, Art, and General Knowledge.'
    },
    {
      icon: Code,
      title: 'Smart Scoring',
      description: 'Earn 10 points for each correct answer with real-time score tracking and accuracy calculations.'
    },
    {
      icon: Users,
      title: 'Compete Globally',
      description: 'Compare your scores with players worldwide on our comprehensive leaderboard system.'
    }
  ];

  const technologies = [
    { name: 'React 19', description: 'Modern React with hooks and context' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
    { name: 'Express.js', description: 'Fast, unopinionated web framework' },
    { name: 'MongoDB', description: 'NoSQL database for flexible data storage' },
    { name: 'Vite', description: 'Next generation frontend tooling' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back to Home
        </button>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About TriviaSwift</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A modern, engaging trivia game built with cutting-edge web technologies.
            Challenge yourself, learn new things, and compete with players from around the world.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* How to Play */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Play</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Getting Started</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Enter your name and choose your game settings</li>
                <li>Select difficulty level and category preferences</li>
                <li>Choose how many questions you want to answer</li>
                <li>Click "Start Game" to begin your trivia challenge</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🏆 During the Game</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Read each question carefully</li>
                <li>Select your answer from the multiple choices</li>
                <li>Get immediate feedback on your answer</li>
                <li>Track your score and progress in real-time</li>
                <li>Continue until you've answered all questions</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Built With</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technologies.map((tech, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Info */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Open Source Project</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            TriviaSwift is an open-source project built to demonstrate modern web development practices.
            The codebase is available on GitHub for anyone to explore, contribute, or use as a learning resource.
          </p>
          <div className="flex justify-center">
            <a
              href="https://github.com/Evasive-6/TriviaSwift"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Github className="h-5 w-5 mr-2" />
              View Source Code
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 py-8 border-t border-gray-200">
          <p className="text-gray-600 flex items-center justify-center">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for trivia enthusiasts everywhere
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © 2024 TriviaSwift. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
