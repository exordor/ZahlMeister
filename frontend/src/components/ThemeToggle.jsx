import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ThemeToggle.css';

/**
 * Theme Toggle Component
 * Allows users to switch between light/dark/auto themes
 * @param {object} props - Component properties
 * @param {string} props.className - Additional CSS classes
 */
const ThemeToggle = ({ className = '' }) => {
  const [theme, setTheme] = useState('auto');

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'auto';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    if (newTheme === 'auto') {
      // Remove manual theme, let system preference take over
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', newTheme);
    }
    localStorage.setItem('theme', newTheme);
  };

  const cycleTheme = () => {
    const themeOrder = ['light', 'dark', 'auto'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const nextTheme = themeOrder[nextIndex];

    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'auto':
      default:
        return '🌓';
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return '浅色';
      case 'dark':
        return '深色';
      case 'auto':
      default:
        return '自动';
    }
  };

  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={cycleTheme}
      aria-label={`Switch theme (current: ${getThemeLabel()})`}
      title={`当前主题: ${getThemeLabel()}`}
    >
      <span className="theme-icon">{getThemeIcon()}</span>
      <span className="theme-label">{getThemeLabel()}</span>
    </button>
  );
};

ThemeToggle.propTypes = {
  className: PropTypes.string
};

export default ThemeToggle;
