import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trophy, Home, BarChart3, Info } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/about', label: 'About', icon: Info }
  ];

  return (
    <header className="glass-morphism text-slate-800 shadow-premium-xl border-b border-white/20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <Link to="/" className="flex items-center space-x-4 text-4xl font-bold">
            <div className="p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <span className="text-gradient-accent font-['Poppins'] font-black tracking-wide">
              TriviaSwift
            </span>
          </Link>

          {/* Enhanced Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-6 py-4 rounded-2xl font-bold transition-all duration-500 hover-lift font-['Inter'] ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-premium-lg animate-glow'
                      : 'text-slate-700 hover:bg-white/20 hover:text-indigo-600'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Enhanced Mobile menu button */}
          <div className="md:hidden">
            <button className="text-slate-700 hover:text-indigo-600 p-3 rounded-2xl hover:bg-white/20 transition-all duration-300">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
