import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * 设置面板组件
 * @param {object} props - 组件属性
 * @param {boolean} props.isOpen - 是否显示设置面板
 * @param {function} props.onClose - 关闭设置面板回调
 * @param {object} props.settings - 当前设置
 * @param {function} props.onSettingsChange - 设置变更回调
 */
const SettingsPanel = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState({
    min: 0,
    max: 100,
    allowDecimal: false,
    decimalPlaces: 1
  });

  // 预设范围选项
  const presetRanges = [
    { label: '基础 (0-10)', min: 0, max: 10 },
    { label: '初级 (0-100)', min: 0, max: 100 },
    { label: '中级 (0-1000)', min: 0, max: 1000 },
    { label: '自定义', min: 0, max: 1000 }
  ];

  // 初始化设置
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  // 从localStorage加载设置
  useEffect(() => {
    const savedSettings = localStorage.getItem('german-number-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setLocalSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('加载设置失败:', error);
      }
    }
  }, []);

  // 保存设置到localStorage
  const saveSettings = (newSettings) => {
    localStorage.setItem('german-number-settings', JSON.stringify(newSettings));
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  // 处理设置变更
  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    saveSettings(newSettings);
  };

  // 处理预设范围选择
  const handlePresetChange = (preset) => {
    const newSettings = {
      ...localSettings,
      min: preset.min,
      max: preset.max
    };
    setLocalSettings(newSettings);
    saveSettings(newSettings);
  };

  // 处理自定义范围验证
  const handleCustomRangeChange = (key, value) => {
    const num = parseInt(value);
    if (isNaN(num) || num < 0 || num > 1000) {
      return; // 无效值，不更新
    }
    handleSettingChange(key, num);
  };

  // 关闭设置面板
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // 重置为默认设置
  const handleReset = () => {
    const defaultSettings = {
      min: 0,
      max: 100,
      allowDecimal: false,
      decimalPlaces: 1
    };
    setLocalSettings(defaultSettings);
    saveSettings(defaultSettings);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="settings-overlay">
      <div className="settings-panel">
        <div className="settings-header">
          <h3>⚙️ 练习设置</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>

        <div className="settings-content">
          {/* 数字范围设置 */}
          <div className="setting-group">
            <h4>📊 数字范围</h4>
            
            <div className="preset-ranges">
              <label>预设范围：</label>
              <div className="preset-buttons">
                {presetRanges.map((preset, index) => (
                  <button
                    key={index}
                    className={`preset-btn ${
                      localSettings.min === preset.min && localSettings.max === preset.max 
                        ? 'active' : ''
                    }`}
                    onClick={() => handlePresetChange(preset)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="custom-range">
              <label>自定义范围：</label>
              <div className="range-inputs">
                <div className="input-group">
                  <label>最小值：</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={localSettings.min}
                    onChange={(e) => handleCustomRangeChange('min', e.target.value)}
                    className="range-input"
                  />
                </div>
                <div className="input-group">
                  <label>最大值：</label>
                  <input
                    type="number"
                    min="0"
                    max="1000"
                    value={localSettings.max}
                    onChange={(e) => handleCustomRangeChange('max', e.target.value)}
                    className="range-input"
                  />
                </div>
              </div>
            </div>

            <div className="range-display">
              当前范围: {localSettings.min} - {localSettings.max}
            </div>
          </div>

          {/* 小数设置 */}
          <div className="setting-group">
            <h4>🔢 小数设置</h4>
            
            <div className="decimal-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={localSettings.allowDecimal}
                  onChange={(e) => handleSettingChange('allowDecimal', e.target.checked)}
                  className="toggle-input"
                />
                <span className="toggle-slider"></span>
                启用小数练习
              </label>
            </div>

            {localSettings.allowDecimal && (
              <div className="decimal-places">
                <label>小数位数：</label>
                <div className="decimal-buttons">
                  <button
                    className={`decimal-btn ${localSettings.decimalPlaces === 1 ? 'active' : ''}`}
                    onClick={() => handleSettingChange('decimalPlaces', 1)}
                  >
                    1位
                  </button>
                  <button
                    className={`decimal-btn ${localSettings.decimalPlaces === 2 ? 'active' : ''}`}
                    onClick={() => handleSettingChange('decimalPlaces', 2)}
                  >
                    2位
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 操作按钮 */}
          <div className="settings-actions">
            <button className="btn-secondary" onClick={handleReset}>
              🔄 重置设置
            </button>
            <button className="btn-primary" onClick={handleClose}>
              ✅ 保存设置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

SettingsPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  settings: PropTypes.object,
  onSettingsChange: PropTypes.func
};

export default SettingsPanel;
