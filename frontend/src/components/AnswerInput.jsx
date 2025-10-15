import React, { useState, useEffect } from 'react';

/**
 * 答案输入组件
 * @param {object} props - 组件属性
 * @param {function} props.onAnswerSubmit - 答案提交回调
 * @param {boolean} props.disabled - 是否禁用输入
 * @param {string} props.placeholder - 输入框占位符
 * @param {string} props.className - 自定义CSS类名
 */
const AnswerInput = ({ 
  onAnswerSubmit, 
  disabled = false, 
  placeholder = "请输入数字",
  className = ""
}) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  // 清空输入框
  const clearInput = () => {
    setAnswer('');
    setError('');
  };

  // 处理输入变化
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // 只允许输入数字
    if (value === '' || /^\d+$/.test(value)) {
      setAnswer(value);
      setError('');
    } else {
      setError('请输入有效的数字');
    }
  };

  // 处理提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!answer.trim()) {
      setError('请输入答案');
      return;
    }

    if (onAnswerSubmit) {
      onAnswerSubmit(parseInt(answer));
      clearInput();
    }
  };

  // 处理键盘事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // 当disabled状态改变时清空输入
  useEffect(() => {
    if (disabled) {
      clearInput();
    }
  }, [disabled]);

  return (
    <div className={`answer-input ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={answer}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            maxLength="4"
            autoComplete="off"
            autoFocus
          />
          <button 
            type="submit" 
            className="btn-primary"
            disabled={disabled || !answer.trim()}
          >
            提交答案
          </button>
        </div>
      </form>
      
      {error && (
        <div className="error-message" style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '0.5rem' }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default AnswerInput;
