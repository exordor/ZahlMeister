import PropTypes from 'prop-types';
import './StreakCounter.css';

/**
 * Streak Counter Component
 * Displays current streak of correct answers with celebration effects
 * @param {object} props - Component properties
 * @param {number} props.streak - Current streak count
 * @param {number} props.bestStreak - Best streak achieved
 * @param {boolean} props.showCelebration - Whether to show celebration animation
 * @param {string} props.className - Additional CSS classes
 */
const StreakCounter = ({
  streak = 0,
  bestStreak = 0,
  showCelebration = false,
  className = ''
}) => {
  const getStreakEmoji = () => {
    if (streak === 0) return '💤';
    if (streak < 3) return '🔥';
    if (streak < 5) return '🔥🔥';
    if (streak < 10) return '🔥🔥🔥';
    return '🔥🔥🔥🌟';
  };

  const getStreakMessage = () => {
    if (streak === 0) return '开始连胜！';
    if (streak < 3) return '继续保持！';
    if (streak < 5) return '太棒了！';
    if (streak < 10) return '精彩绝伦！';
    return '无人能挡！';
  };

  return (
    <div className={`streak-counter ${showCelebration ? 'celebrating' : ''} ${className}`}>
      <div className="streak-main">
        <div className="streak-icon">{getStreakEmoji()}</div>
        <div className="streak-content">
          <div className="streak-value">{streak}</div>
          <div className="streak-label">连胜</div>
        </div>
        {showCelebration && <div className="streak-message">{getStreakMessage()}</div>}
      </div>

      {bestStreak > 0 && bestStreak > streak && (
        <div className="best-streak">
          <span className="best-streak-icon">👑</span>
          <span className="best-streak-label">最佳: {bestStreak}</span>
        </div>
      )}

      {showCelebration && (
        <>
          <div className="confetti confetti-1">🎉</div>
          <div className="confetti confetti-2">⭐</div>
          <div className="confetti confetti-3">✨</div>
          <div className="confetti confetti-4">🎊</div>
        </>
      )}
    </div>
  );
};

StreakCounter.propTypes = {
  streak: PropTypes.number,
  bestStreak: PropTypes.number,
  showCelebration: PropTypes.bool,
  className: PropTypes.string
};

export default StreakCounter;
