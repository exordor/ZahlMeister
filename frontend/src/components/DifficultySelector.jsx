import PropTypes from 'prop-types';
import './DifficultySelector.css';

/**
 * Difficulty levels configuration
 */
const DIFFICULTY_LEVELS = {
  easy: {
    label: '简单',
    icon: '🌱',
    min: 0,
    max: 20,
    allowDecimal: false,
    description: '基础数字 (0-20)'
  },
  medium: {
    label: '中等',
    icon: '🌿',
    min: 0,
    max: 100,
    allowDecimal: false,
    description: '标准练习 (0-100)'
  },
  hard: {
    label: '困难',
    icon: '🌳',
    min: 0,
    max: 1000,
    allowDecimal: false,
    description: '高级整数 (0-1000)'
  },
  expert: {
    label: '专家',
    icon: '🏆',
    min: 0,
    max: 1000,
    allowDecimal: true,
    decimalPlaces: 2,
    description: '完整难度 (含小数)'
  }
};

/**
 * Difficulty Selector Component
 * Allows users to select predefined difficulty levels
 * @param {object} props - Component properties
 * @param {string} props.currentDifficulty - Currently selected difficulty key
 * @param {function} props.onDifficultyChange - Callback when difficulty changes
 * @param {string} props.className - Additional CSS classes
 */
const DifficultySelector = ({
  currentDifficulty = 'medium',
  onDifficultyChange,
  className = ''
}) => {
  const handleDifficultyClick = (difficultyKey) => {
    if (onDifficultyChange) {
      onDifficultyChange(difficultyKey, DIFFICULTY_LEVELS[difficultyKey]);
    }
  };

  return (
    <div className={`difficulty-selector ${className}`}>
      <div className="difficulty-grid">
        {Object.entries(DIFFICULTY_LEVELS).map(([key, difficulty]) => (
          <button
            key={key}
            className={`difficulty-btn ${currentDifficulty === key ? 'active' : ''}`}
            onClick={() => handleDifficultyClick(key)}
            aria-label={`Select ${difficulty.label} difficulty`}
          >
            <div className="difficulty-icon">{difficulty.icon}</div>
            <div className="difficulty-content">
              <div className="difficulty-label">{difficulty.label}</div>
              <div className="difficulty-description">{difficulty.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

DifficultySelector.propTypes = {
  currentDifficulty: PropTypes.oneOf(['easy', 'medium', 'hard', 'expert']),
  onDifficultyChange: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default DifficultySelector;
