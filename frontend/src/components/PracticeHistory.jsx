import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * 练习历史组件
 * @param {object} props - 组件属性
 * @param {boolean} props.isOpen - 是否显示历史面板
 * @param {function} props.onClose - 关闭历史面板回调
 */
const PracticeHistory = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    incorrect: 0,
    accuracy: 0
  });

  // 获取历史记录
  const fetchHistory = useCallback(async (limit = 50, offset = 0) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/history?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }
      
      const data = await response.json();
      setHistory(data.records);
      
      // 计算统计信息
      const total = data.total;
      const correct = data.records.filter(record => record.isCorrect).length;
      const incorrect = data.records.filter(record => !record.isCorrect).length;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      
      setStats({
        total,
        correct,
        incorrect,
        accuracy
      });
    } catch (err) {
      console.error('获取历史记录失败:', err);
      setError(`获取历史记录失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  // 清空历史记录
  const clearHistory = async () => {
    if (!window.confirm('确定要清空所有历史记录吗？此操作不可撤销。')) {
      return;
    }

    try {
      const response = await fetch('/api/history', {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }
      
      // 清空本地状态
      setHistory([]);
      setStats({
        total: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0
      });
      
      alert('历史记录已清空');
    } catch (err) {
      console.error('清空历史记录失败:', err);
      alert(`清空历史记录失败: ${err.message}`);
    }
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 格式化设置信息
  const formatSettings = (settings) => {
    const parts = [];
    if (settings.min !== undefined && settings.max !== undefined) {
      parts.push(`范围: ${settings.min}-${settings.max}`);
    }
    if (settings.allowDecimal) {
      parts.push(`小数${settings.decimalPlaces || 1}位`);
    }
    return parts.length > 0 ? parts.join(', ') : '默认设置';
  };

  // 关闭历史面板
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // 初始化加载历史记录
  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, fetchHistory]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="history-overlay">
      <div className="history-panel">
        <div className="history-header">
          <h3>📊 练习历史</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="history-content">
          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {/* 统计信息 */}
          <div className="history-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">总练习次数</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.correct}</div>
              <div className="stat-label">正确次数</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.incorrect}</div>
              <div className="stat-label">错误次数</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.accuracy}%</div>
              <div className="stat-label">正确率</div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="history-actions">
            <button 
              className="btn-secondary"
              onClick={() => fetchHistory()}
              disabled={loading}
            >
              🔄 刷新
            </button>
            <button 
              className="btn-danger"
              onClick={clearHistory}
              disabled={stats.total === 0}
            >
              🗑️ 清空历史
            </button>
          </div>

          {/* 历史记录列表 */}
          <div className="history-list">
            {loading ? (
              <div className="loading">🔄 加载中...</div>
            ) : history.length === 0 ? (
              <div className="empty-history">
                📝 暂无练习历史记录
              </div>
            ) : (
              <div className="history-items">
                {history.map((record) => (
                  <div 
                    key={record.id} 
                    className={`history-item ${record.isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <div className="history-item-header">
                      <div className="history-result">
                        {record.isCorrect ? '✅' : '❌'}
                      </div>
                      <div className="history-time">
                        {formatTime(record.timestamp)}
                      </div>
                    </div>
                    
                    <div className="history-item-content">
                      <div className="history-numbers">
                        <span className="correct-answer">
                          答案: {record.number}
                        </span>
                        <span className="user-answer">
                          输入: {record.userAnswer}
                        </span>
                      </div>
                      
                      {record.germanWord && (
                        <div className="german-word">
                          🇩🇪 {record.germanWord}
                        </div>
                      )}
                      
                      <div className="history-settings">
                        ⚙️ {formatSettings(record.settings)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

PracticeHistory.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PracticeHistory;
