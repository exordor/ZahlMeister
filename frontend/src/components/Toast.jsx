import { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Toast.css';

/**
 * Toast Notification Component
 * Displays temporary notification messages
 * @param {object} props - Component properties
 * @param {string} props.message - The message to display
 * @param {string} props.type - Type of toast: 'success', 'error', 'info', 'warning'
 * @param {number} props.duration - Duration in ms before auto-dismiss (default: 3000)
 * @param {function} props.onClose - Callback when toast is closed
 * @param {boolean} props.isVisible - Whether the toast is visible
 */
const Toast = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  isVisible = true
}) => {
  useEffect(() => {
    if (!isVisible || duration === 0) return;

    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible || !message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={`toast toast-${type} animate-slideInRight`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      {onClose && (
        <button
          className="toast-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
  duration: PropTypes.number,
  onClose: PropTypes.func,
  isVisible: PropTypes.bool
};

/**
 * Toast Container Component
 * Manages multiple toast notifications
 * @param {object} props - Component properties
 * @param {Array} props.toasts - Array of toast objects
 * @param {function} props.removeToast - Function to remove a toast by id
 */
export const ToastContainer = ({ toasts = [], removeToast }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
          isVisible={true}
        />
      ))}
    </div>
  );
};

ToastContainer.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      message: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['success', 'error', 'info', 'warning']),
      duration: PropTypes.number
    })
  ),
  removeToast: PropTypes.func.isRequired
};

export default Toast;
