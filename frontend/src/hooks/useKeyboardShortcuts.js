import { useEffect } from 'react';

/**
 * Custom Hook for Keyboard Shortcuts
 * Registers global keyboard shortcuts for the application
 * @param {Object} shortcuts - Map of key combinations to callback functions
 * @param {boolean} enabled - Whether shortcuts are enabled (default: true)
 *
 * @example
 * useKeyboardShortcuts({
 *   'Enter': handleSubmit,
 *   ' ': handlePlay,  // Space key
 *   'n': handleNext,
 *   'KeyS': handleSettings
 * }, true);
 */
const useKeyboardShortcuts = (shortcuts = {}, enabled = true) => {
  useEffect(() => {
    if (!enabled || !shortcuts) return;

    const handleKeyDown = (event) => {
      // Don't trigger shortcuts when typing in inputs/textareas
      const isInputElement =
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA' ||
        event.target.isContentEditable;

      // Allow Enter in inputs, but prevent other shortcuts
      if (isInputElement && event.key !== 'Enter') {
        return;
      }

      // Get the key or code
      const key = event.key;
      const code = event.code;

      // Check if this key has a registered shortcut
      const handler = shortcuts[key] || shortcuts[code];

      if (handler && typeof handler === 'function') {
        // Prevent default behavior for registered shortcuts
        event.preventDefault();
        handler(event);
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
};

/**
 * Predefined shortcut configurations
 */
export const SHORTCUTS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  KEY_N: 'n',
  KEY_S: 's',
  KEY_H: 'h',
  KEY_A: 'a',
  KEY_P: 'p'
};

export default useKeyboardShortcuts;
