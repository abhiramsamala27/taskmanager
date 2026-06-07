import React, { useState, useRef, useEffect } from 'react';
import { Menu, Moon, Sun, Bell, Search, ChevronDown, User, LogOut, Settings, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: 'rgba(10, 10, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.12)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">

        {/* Mobile menu button */}
        <button
          id="navbar-menu-btn"
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo (mobile only) */}
        <div className="md:hidden flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
          >
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold gradient-text">TaskMaster</span>
        </div>

        {/* Search Bar */}
        <motion.div
          animate={{ width: searchFocused ? '320px' : '240px' }}
          transition={{ duration: 0.2 }}
          className="hidden md:flex items-center relative"
        >
          <Search
            className="absolute left-3 h-4 w-4 transition-colors"
            style={{ color: searchFocused ? '#6366F1' : '#6B7280' }}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl transition-all outline-none"
            style={{
              background: searchFocused
                ? 'rgba(99, 102, 241, 0.1)'
                : 'rgba(31, 41, 55, 0.6)',
              border: searchFocused
                ? '1px solid rgba(99, 102, 241, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.06)',
              color: 'var(--foreground)',
              boxShadow: searchFocused ? '0 0 0 3px rgba(99, 102, 241, 0.12)' : 'none',
            }}
          />
        </motion.div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2">

          {/* Notification Bell */}
          <button
            id="navbar-notifications-btn"
            className="relative p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <Bell className="h-5 w-5" />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
            />
          </button>

          {/* Theme Toggle */}
          <button
            id="navbar-theme-toggle"
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-yellow-300 transition-all"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-white/10" />

          {/* User Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="navbar-user-menu-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/10 transition-all"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold leading-none" style={{ color: 'var(--foreground)' }}>
                  {user?.name}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">Pro Member</p>
              </div>
              <ChevronDown
                className={`hidden md:block h-4 w-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden z-50"
                  style={{
                    background: 'rgba(17, 24, 39, 0.98)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(20px)',
                  }}
                >
                  {/* User info header */}
                  <div className="p-4 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
                      >
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-2">
                    <Link
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                      <User className="h-4 w-4 text-indigo-400" />
                      View Profile
                    </Link>
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                    >
                      {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-blue-400" />}
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="mx-2 border-t border-white/5" />

                  <div className="p-2">
                    <button
                      onClick={() => { logout(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
