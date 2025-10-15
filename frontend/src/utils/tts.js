// Web Speech API TTS 工具函数

/**
 * 检查浏览器是否支持 Web Speech API
 * @returns {boolean} 是否支持
 */
export function isTTSSupported() {
  return 'speechSynthesis' in window;
}

/**
 * 获取可用的德语语音
 * @returns {SpeechSynthesisVoice[]} 德语语音列表
 */
export function getGermanVoices() {
  if (!isTTSSupported()) {
    return [];
  }
  
  const voices = speechSynthesis.getVoices();
  return voices.filter(voice => 
    voice.lang.startsWith('de') || 
    voice.lang.includes('German') ||
    voice.name.toLowerCase().includes('german')
  );
}

/**
 * 使用德语语音播放文本
 * @param {string} text - 要播放的文本
 * @param {number} rate - 语速 (0.1 - 10, 默认 0.8)
 * @param {number} pitch - 音调 (0 - 2, 默认 1)
 * @param {number} volume - 音量 (0 - 1, 默认 1)
 * @returns {Promise<void>}
 */
export function speakGermanText(text, rate = 0.8, pitch = 1, volume = 1) {
  return new Promise((resolve, reject) => {
    if (!isTTSSupported()) {
      reject(new Error('浏览器不支持语音合成功能'));
      return;
    }

    // 停止当前播放
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // 设置语音参数
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = 'de-DE';

    // 尝试获取德语语音
    const germanVoices = getGermanVoices();
    if (germanVoices.length > 0) {
      // 优先选择德语语音
      utterance.voice = germanVoices[0];
    } else {
      // 如果没有德语语音，使用默认语音但设置德语语言
      console.warn('未找到德语语音，使用默认语音');
    }

    // 事件处理
    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (event) => {
      reject(new Error(`语音播放错误: ${event.error}`));
    };

    // 开始播放
    speechSynthesis.speak(utterance);
  });
}

/**
 * 停止当前播放的语音
 */
export function stopSpeaking() {
  if (isTTSSupported()) {
    speechSynthesis.cancel();
  }
}

/**
 * 暂停当前播放的语音
 */
export function pauseSpeaking() {
  if (isTTSSupported()) {
    speechSynthesis.pause();
  }
}

/**
 * 恢复播放暂停的语音
 */
export function resumeSpeaking() {
  if (isTTSSupported()) {
    speechSynthesis.resume();
  }
}

/**
 * 检查是否正在播放语音
 * @returns {boolean} 是否正在播放
 */
export function isSpeaking() {
  if (!isTTSSupported()) {
    return false;
  }
  return speechSynthesis.speaking;
}

/**
 * 获取语音状态信息
 * @returns {object} 语音状态
 */
export function getSpeechStatus() {
  if (!isTTSSupported()) {
    return {
      supported: false,
      speaking: false,
      paused: false,
      germanVoices: 0
    };
  }

  const germanVoices = getGermanVoices();
  
  return {
    supported: true,
    speaking: speechSynthesis.speaking,
    paused: speechSynthesis.paused,
    germanVoices: germanVoices.length,
    availableVoices: germanVoices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      localService: voice.localService
    }))
  };
}
