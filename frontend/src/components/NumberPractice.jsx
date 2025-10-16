import { useState, useEffect, useCallback, useRef } from 'react';
import AnswerInput from './AnswerInput';
import SettingsPanel from './SettingsPanel';
import PracticeHistory from './PracticeHistory';
import { ToastContainer } from './Toast';
import StreakCounter from './StreakCounter';
import Timer from './Timer';
import ThemeToggle from './ThemeToggle';
import { speakGermanText, isTTSSupported, stopSpeaking } from '../utils/tts';
import { playSuccess, playError, playCelebration, playClick } from '../utils/sounds';
import useKeyboardShortcuts, { SHORTCUTS } from '../hooks/useKeyboardShortcuts';
import { useSessionTimer, useQuestionTimer } from '../hooks/useTimer';

/**
 * 数字练习主组件
 */
const NumberPractice = () => {
  // 状态管理
  const [currentNumber, setCurrentNumber] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [questionId, setQuestionId] = useState(0);

  // 统计状态
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    streak: 0,
    bestStreak: 0
  });

  // UI状态
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Toast通知状态
  const [toasts, setToasts] = useState([]);

  // 设置状态
  const [settings, setSettings] = useState({
    min: 0,
    max: 100,
    allowDecimal: false,
    decimalPlaces: 1,
    soundEnabled: true,
    difficulty: 'medium',
    autoPlayEnabled: false,
    autoPlayCount: 1
  });
  const lastAutoPlayQuestionId = useRef(null);
  const currentNumberRef = useRef(null);

  // 计时器
  const { sessionTime } = useSessionTimer();
  const { questionTime, startQuestion, finishQuestion, isTimerRunning } = useQuestionTimer();

  // Toast管理函数
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // 检查TTS支持
  useEffect(() => {
    setTtsSupported(isTTSSupported());
    if (!isTTSSupported()) {
      addToast('您的浏览器不支持语音合成功能，请使用Chrome、Edge或Safari浏览器', 'warning', 5000);
    }
  }, [addToast]);

  useEffect(() => {
    currentNumberRef.current = currentNumber;
  }, [currentNumber]);

  // 加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('german-number-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('加载设置失败:', error);
      }
    }

    // 加载统计数据
    const savedStats = localStorage.getItem('german-number-stats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('加载统计失败:', error);
      }
    }
  }, []);

  // 保存统计数据
  useEffect(() => {
    localStorage.setItem('german-number-stats', JSON.stringify(stats));
  }, [stats]);

  // 获取新数字
  const fetchNewNumber = useCallback(async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        min: settings.min.toString(),
        max: settings.max.toString(),
        decimal: settings.allowDecimal.toString(),
        decimalPlaces: settings.decimalPlaces.toString()
      });

      const response = await fetch(`/api/number?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }

      const data = await response.json();
      setCurrentNumber(data);
      setUserAnswer(null);
      setIsCorrect(null);
      setQuestionId(prev => prev + 1);
      startQuestion(); // 开始计时
    } catch (err) {
      console.error('获取数字失败:', err);
      addToast(`获取新数字失败: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [settings, startQuestion, addToast]);

  // 播放德语数字
  const playNumber = useCallback(async (repeatCount = 1) => {
    if (!currentNumber || !ttsSupported || isPlaying) return;

    const plays = Math.max(1, Number(repeatCount) || 1);
    const targetWord = currentNumber.germanWord;
    setIsPlaying(true);

    try {
      for (let i = 0; i < plays; i += 1) {
        await speakGermanText(targetWord);
        if (settings.soundEnabled) {
          playClick();
        }
        if (i < plays - 1) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          const latestNumber = currentNumberRef.current;
          if (!latestNumber || latestNumber.germanWord !== targetWord) {
            break;
          }
        }
      }
    } catch (err) {
      console.error('播放失败:', err);
      addToast(`播放失败: ${err.message}`, 'error');
    } finally {
      setIsPlaying(false);
    }
  }, [currentNumber, ttsSupported, isPlaying, settings.soundEnabled, addToast]);

  // 提交答案
  const handleAnswerSubmit = useCallback(async (answer) => {
    if (!currentNumber || isLoading) return;

    setIsLoading(true);
    setUserAnswer(answer);

    const timeSpent = finishQuestion(); // 停止计时并获取时间

    try {
      const response = await fetch('/api/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: answer,
          correctAnswer: currentNumber.number
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }

      const result = await response.json();
      setIsCorrect(result.isCorrect);

      // 更新统计
      const newStreak = result.isCorrect ? stats.streak + 1 : 0;
      const newBestStreak = Math.max(stats.bestStreak, newStreak);

      setStats(prevStats => ({
        total: prevStats.total + 1,
        correct: prevStats.correct + (result.isCorrect ? 1 : 0),
        incorrect: prevStats.incorrect + (result.isCorrect ? 0 : 1),
        streak: newStreak,
        bestStreak: newBestStreak
      }));

      // 音效和提示
      if (result.isCorrect) {
        if (settings.soundEnabled) {
          if (newStreak >= 5) {
            playCelebration();
          } else {
            playSuccess();
          }
        }

        if (newStreak >= 5) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 2000);
        }

        addToast(`正确！答案是 ${currentNumber.number}`, 'success', 2000);
      } else {
        if (settings.soundEnabled) {
          playError();
        }
        addToast(`错误！正确答案是 ${currentNumber.number}`, 'error', 3000);
      }

      // 保存到历史记录
      try {
        await fetch('/api/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            number: currentNumber.number,
            germanWord: currentNumber.germanWord,
            userAnswer: answer,
            isCorrect: result.isCorrect,
            timeSpent: timeSpent,
            settings: settings
          })
        });
      } catch (historyError) {
        console.error('保存历史记录失败:', historyError);
      }
    } catch (err) {
      console.error('验证答案失败:', err);
      addToast(`验证答案失败: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [currentNumber, isLoading, finishQuestion, stats, settings, addToast]);

  // 下一题
  const handleNextQuestion = useCallback(() => {
    stopSpeaking();
    fetchNewNumber();
  }, [fetchNewNumber]);

  useEffect(() => {
    if (!settings.autoPlayEnabled) {
      return;
    }
    lastAutoPlayQuestionId.current = null;
  }, [settings.autoPlayEnabled]);

  // 自动播放
  useEffect(() => {
    if (!settings.autoPlayEnabled) return;
    if (!currentNumber || !ttsSupported) return;
    if (isPlaying) return;
    if (questionId === 0) return;
    if (lastAutoPlayQuestionId.current === questionId) return;

    lastAutoPlayQuestionId.current = questionId;
    const repeatCount = Math.max(1, Number(settings.autoPlayCount) || 1);
    playNumber(repeatCount);
  }, [
    settings.autoPlayEnabled,
    settings.autoPlayCount,
    currentNumber,
    ttsSupported,
    questionId,
    playNumber,
    isPlaying
  ]);

  // 键盘快捷键
  useKeyboardShortcuts({
    [SHORTCUTS.SPACE]: () => {
      // Space键只播放，不获取新数字
      if (currentNumber && !isPlaying) {
        playNumber();
      }
    },
    [SHORTCUTS.KEY_N]: () => {
      if (userAnswer !== null) {
        handleNextQuestion();
      }
    },
    [SHORTCUTS.KEY_S]: () => {
      setShowSettings(true);
    },
    [SHORTCUTS.KEY_H]: () => {
      setShowHistory(true);
    }
  }, !showSettings && !showHistory);

  // 初始化加载第一个数字
  useEffect(() => {
    fetchNewNumber();
  }, [fetchNewNumber]);

  // 组件卸载时停止播放
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>🔢 德语数字练习</h1>
        <div className="header-actions">
          <ThemeToggle />
          <button
            className="btn-secondary"
            onClick={() => setShowSettings(true)}
            title="设置 (快捷键: S)"
          >
            ⚙️
          </button>
          <button
            className="btn-secondary"
            onClick={() => setShowHistory(true)}
            title="历史记录 (快捷键: H)"
          >
            📊
          </button>
        </div>
      </div>

      {/* 计时器和连胜计数器 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
        <Timer
          seconds={sessionTime}
          isRunning={true}
          label="总时长"
        />

        <StreakCounter
          streak={stats.streak}
          bestStreak={stats.bestStreak}
          showCelebration={showCelebration}
        />

        {isTimerRunning && (
          <Timer
            seconds={questionTime}
            isRunning={isTimerRunning}
            label="本题"
          />
        )}
      </div>

      <div className="practice-card">
        {currentNumber && (
          <>
            <h2>请听数字并输入答案</h2>
            
            <div className="button-group">
              <button 
                className="btn-primary"
                onClick={() => playNumber()}
                disabled={!ttsSupported || isPlaying || isLoading}
              >
                {isPlaying ? '🎵 播放中...' : '🔊 播放数字'}
              </button>
            </div>

            {isCorrect === null && !userAnswer && (
              <AnswerInput
                onAnswerSubmit={handleAnswerSubmit}
                disabled={isLoading}
                placeholder="请输入听到的数字"
                allowDecimal={settings.allowDecimal}
              />
            )}

            {userAnswer !== null && (
              <>
                <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                  {isCorrect ? (
                    <>✅ 正确！答案是 {currentNumber.number}</>
                  ) : (
                    <>❌ 错误！正确答案是 {currentNumber.number}，您输入的是 {userAnswer}</>
                  )}
                </div>

                <div className="button-group">
                  <button
                    className="btn-secondary"
                    onClick={handleNextQuestion}
                    disabled={isLoading}
                  >
                    下一题 (N)
                  </button>
                  {isCorrect === false && (
                    <button
                      className="btn-primary"
                      onClick={() => playNumber()}
                      disabled={!ttsSupported || isPlaying}
                    >
                      再听一遍 (Space)
                    </button>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {isLoading && !currentNumber && (
          <div>🔄 加载中...</div>
        )}
      </div>

      {/* 统计信息 */}
      {stats.total > 0 && (
        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">总题数</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.correct}</div>
            <div className="stat-label">正确</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.incorrect}</div>
            <div className="stat-label">错误</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
            </div>
            <div className="stat-label">正确率</div>
          </div>
        </div>
      )}

      {/* 键盘快捷键提示 */}
      <div style={{
        marginTop: 'var(--space-lg)',
        padding: 'var(--space-md)',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        fontSize: 'var(--font-size-sm)',
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center'
      }}>
        <strong>⌨️ 快捷键:</strong> Space = 播放 | N = 下一题 | S = 设置 | H = 历史
      </div>

      {/* Toast通知容器 */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* 设置面板 */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {/* 历史记录面板 */}
      <PracticeHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
      />
    </div>
  );
};

export default NumberPractice;
