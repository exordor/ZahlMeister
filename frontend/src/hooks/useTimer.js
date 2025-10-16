import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom Hook for Timer Functionality
 * Provides timer state and controls
 * @param {boolean} autoStart - Whether to start timer automatically (default: false)
 * @returns {Object} Timer state and controls
 */
const useTimer = (autoStart = false) => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef(null);

  // Start the timer
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  // Pause the timer
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  // Reset the timer
  const reset = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
  }, []);

  // Restart the timer (reset and start)
  const restart = useCallback(() => {
    setSeconds(0);
    setIsRunning(true);
  }, []);

  // Stop the timer (pause and reset)
  const stop = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
  }, []);

  // Effect to handle timer interval
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    restart,
    stop
  };
};

/**
 * Custom Hook for Session Timer
 * Tracks total session time with automatic start
 * @returns {Object} Session timer state
 */
export const useSessionTimer = () => {
  const timer = useTimer(true); // Auto-start session timer

  return {
    sessionTime: timer.seconds,
    pauseSession: timer.pause,
    resumeSession: timer.start
  };
};

/**
 * Custom Hook for Question Timer
 * Tracks time per question with manual control
 * @returns {Object} Question timer state and controls
 */
export const useQuestionTimer = () => {
  const timer = useTimer(false);
  const { seconds, isRunning, restart, stop, reset } = timer;

  const startQuestion = useCallback(() => {
    restart();
  }, [restart]);

  const finishQuestion = useCallback(() => {
    const timeSpent = seconds;
    stop();
    return timeSpent;
  }, [seconds, stop]);

  return {
    questionTime: seconds,
    isTimerRunning: isRunning,
    startQuestion,
    finishQuestion,
    resetQuestion: reset
  };
};

export default useTimer;
