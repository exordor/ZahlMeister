const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { getRandomGermanNumber } = require('./utils/germanNumbers');

const app = express();
const PORT = process.env.PORT || 3001;

// 历史记录文件路径
const HISTORY_FILE = path.join(__dirname, 'data', 'history.json');
const DATA_DIR = path.dirname(HISTORY_FILE);

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 初始化历史记录文件
if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify({ records: [] }, null, 2));
}

// 读取历史记录
function readHistory() {
  try {
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取历史记录失败:', error);
    return { records: [] };
  }
}

// 保存历史记录
function saveHistory(history) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    return true;
  } catch (error) {
    console.error('保存历史记录失败:', error);
    return false;
  }
}

// 中间件
app.use(cors());
app.use(express.json());

// 获取随机数字
app.get('/api/number', (req, res) => {
  try {
    const { 
      min = 0, 
      max = 100, 
      decimal = false, 
      decimalPlaces = 1 
    } = req.query;
    
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    const allowDecimal = decimal === 'true';
    const decimalPlacesNum = parseInt(decimalPlaces);
    
    // 验证参数
    if (isNaN(minNum) || isNaN(maxNum) || minNum < 0 || maxNum > 1000 || minNum > maxNum) {
      return res.status(400).json({
        error: '无效的参数范围，请确保 min >= 0, max <= 1000, 且 min <= max'
      });
    }
    
    if (allowDecimal && (decimalPlacesNum < 1 || decimalPlacesNum > 2)) {
      return res.status(400).json({
        error: '小数位数必须在1-2之间'
      });
    }
    
    const result = getRandomGermanNumber(minNum, maxNum, allowDecimal, decimalPlacesNum);
    res.json(result);
  } catch (error) {
    console.error('生成随机数字时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 验证答案
app.post('/api/check', (req, res) => {
  try {
    const { answer, correctAnswer } = req.body;
    
    if (answer === undefined || correctAnswer === undefined) {
      return res.status(400).json({
        error: '缺少必要参数：answer 和 correctAnswer'
      });
    }
    
    const isCorrect = parseInt(answer) === parseInt(correctAnswer);
    
    res.json({
      isCorrect,
      userAnswer: answer,
      correctAnswer: correctAnswer
    });
  } catch (error) {
    console.error('验证答案时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 保存历史记录
app.post('/api/history', (req, res) => {
  try {
    const { number, germanWord, userAnswer, isCorrect, settings } = req.body;
    
    if (number === undefined || userAnswer === undefined || isCorrect === undefined) {
      return res.status(400).json({
        error: '缺少必要参数：number, userAnswer, isCorrect'
      });
    }
    
    const history = readHistory();
    const record = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      number,
      germanWord: germanWord || '',
      userAnswer,
      isCorrect,
      settings: settings || {}
    };
    
    history.records.push(record);
    
    // 只保留最近1000条记录
    if (history.records.length > 1000) {
      history.records = history.records.slice(-1000);
    }
    
    if (saveHistory(history)) {
      res.json({ success: true, record });
    } else {
      res.status(500).json({ error: '保存历史记录失败' });
    }
  } catch (error) {
    console.error('保存历史记录时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取历史记录
app.get('/api/history', (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    const history = readHistory();
    
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    
    const records = history.records
      .slice()
      .reverse() // 最新的在前面
      .slice(offsetNum, offsetNum + limitNum);
    
    res.json({
      records,
      total: history.records.length,
      hasMore: offsetNum + limitNum < history.records.length
    });
  } catch (error) {
    console.error('获取历史记录时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 清空历史记录
app.delete('/api/history', (req, res) => {
  try {
    const history = { records: [] };
    if (saveHistory(history)) {
      res.json({ success: true, message: '历史记录已清空' });
    } else {
      res.status(500).json({ error: '清空历史记录失败' });
    }
  } catch (error) {
    console.error('清空历史记录时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '德语数字练习API运行正常' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  console.log(`📡 API 端点:`);
  console.log(`   GET  /api/number - 获取随机数字`);
  console.log(`   POST /api/check - 验证答案`);
  console.log(`   POST /api/history - 保存历史记录`);
  console.log(`   GET  /api/history - 获取历史记录`);
  console.log(`   DELETE /api/history - 清空历史记录`);
  console.log(`   GET  /api/health - 健康检查`);
});

module.exports = app;
