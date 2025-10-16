import PropTypes from 'prop-types';
import './Timer.css';

/**
 * Timer Component
 * Displays elapsed time in a formatted manner
 * @param {object} props - Component properties
 * @param {number} props.seconds - Time in seconds
 * @param {boolean} props.isRunning - Whether timer is actively running
 * @param {string} props.label - Optional label for the timer
 * @param {string} props.className - Additional CSS classes
 */
const Timer = ({ seconds = 0, isRunning = false, label, className = '' }) => {
  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`timer ${isRunning ? 'timer-running' : ''} ${className}`}>
      {label && <div className="timer-label">{label}</div>}
      <div className="timer-display">
        <span className="timer-icon">⏱️</span>
        <span className="timer-value">{formatTime(seconds)}</span>
      </div>
    </div>
  );
};

Timer.propTypes = {
  seconds: PropTypes.number,
  isRunning: PropTypes.bool,
  label: PropTypes.string,
  className: PropTypes.string
};

export default Timer;
