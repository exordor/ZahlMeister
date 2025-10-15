import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * 答案输入组件
 * @param {object} props - 组件属性
 * @param {function} props.onAnswerSubmit - 答案提交回调
 * @param {boolean} props.disabled - 是否禁用输入
 * @param {string} props.placeholder - 输入框占位符
 * @param {string} props.className - 自定义CSS类名
 * @param {boolean} props.allowDecimal - 是否允许小数输入
 */
const AnswerInput = ({ 
  onAnswerSubmit, 
  disabled = false, 
  placeholder = "请输入数字",
  className = "",
  allowDecimal = false
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
    
    // 根据是否允许小数进行验证
    if (value === '') {
      setAnswer(value);
      setError('');
    } else if (allowDecimal) {
      // 允许小数：数字、一个小数点、最多2位小数
      if (/^\d*\.?\d{0,2}$/.test(value)) {
        setAnswer(value);
        setError('');
      } else {
        setError('请输入有效的数字（支持小数）');
      }
    } else {
      // 只允许整数
      if (/^\d+$/.test(value)) {
        setAnswer(value);
        setError('');
      } else {
        setError('请输入有效的整数');
      }
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
      const numAnswer = allowDecimal ? parseFloat(answer) : parseInt(answer);
      onAnswerSubmit(numAnswer);
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
            placeholder={allowDecimal ? placeholder + "（支持小数）" : placeholder}
            disabled={disabled}
            maxLength="8"
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

AnswerInput.propTypes = {
  onAnswerSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  allowDecimal: PropTypes.bool
};

export default AnswerInput;
