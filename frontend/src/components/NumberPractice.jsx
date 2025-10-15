import React, { useState, useEffect, useCallback } from 'react';
import AnswerInput from './AnswerInput';
import { speakGermanText, isTTSSupported, stopSpeaking } from '../utils/tts';

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
  const [stats, setStats] = useState({ total: 0, correct: 0, incorrect: 0 });
  const [ttsSupported, setTtsSupported] = useState(false);
  const [error, setError] = useState('');

  // 检查TTS支持
  useEffect(() => {
    setTtsSupported(isTTSSupported());
    if (!isTTSSupported()) {
      setError('您的浏览器不支持语音合成功能，请使用Chrome、Edge或Safari浏览器');
    }
  }, []);

  // 获取新数字
  const fetchNewNumber = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/number?min=0&max=100');
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }
      
      const data = await response.json();
      setCurrentNumber(data);
      setUserAnswer(null);
      setIsCorrect(null);
    } catch (err) {
      console.error('获取数字失败:', err);
      setError(`获取新数字失败: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 播放德语数字
  const playNumber = useCallback(async () => {
    if (!currentNumber || !ttsSupported || isPlaying) return;

    setIsPlaying(true);
    setError('');
    
    try {
      await speakGermanText(currentNumber.germanWord);
    } catch (err) {
      console.error('播放失败:', err);
      setError(`播放失败: ${err.message}`);
    } finally {
      setIsPlaying(false);
    }
  }, [currentNumber, ttsSupported, isPlaying]);

  // 提交答案
  const handleAnswerSubmit = useCallback(async (answer) => {
    if (!currentNumber || isLoading) return;

    setIsLoading(true);
    setUserAnswer(answer);
    setError('');

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
      setStats(prevStats => ({
        total: prevStats.total + 1,
        correct: prevStats.correct + (result.isCorrect ? 1 : 0),
        incorrect: prevStats.incorrect + (result.isCorrect ? 0 : 1)
      }));
    } catch (err) {
      console.error('验证答案失败:', err);
      setError(`验证答案失败: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [currentNumber, isLoading]);

  // 下一题
  const handleNextQuestion = useCallback(() => {
    stopSpeaking(); // 停止当前播放
    fetchNewNumber();
  }, [fetchNewNumber]);

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
      <h1>🔢 德语数字练习</h1>
      
      {error && (
        <div className="feedback incorrect">
          {error}
        </div>
      )}

      {!ttsSupported && (
        <div className="feedback incorrect">
          您的浏览器不支持语音合成功能，请使用Chrome、Edge或Safari浏览器
        </div>
      )}

      <div className="practice-card">
        {currentNumber && (
          <>
            <h2>请听数字并输入答案</h2>
            
            <div className="button-group">
              <button 
                className="btn-primary"
                onClick={playNumber}
                disabled={!ttsSupported || isPlaying || isLoading}
              >
                {isPlaying ? '🎵 播放中...' : '🔊 播放数字'}
              </button>
            </div>

            {isCorrect === null && !userAnswer && (
              <AnswerInput
                onAnswerSubmit={handleAnswerSubmit}
                disabled={isLoading || isPlaying}
                placeholder="请输入听到的数字"
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
                    下一题
                  </button>
                  {isCorrect === false && (
                    <button 
                      className="btn-primary"
                      onClick={playNumber}
                      disabled={!ttsSupported || isPlaying}
                    >
                      再听一遍
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
    </div>
  );
};

export default NumberPractice;
