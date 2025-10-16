const express = require('express');
const cors = require('cors');
const { getRandomGermanNumber } = require('./utils/germanNumbers');
const { saveRecord, getRecords, clearRecords, getStatistics } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3001;

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

    // 处理小数比较
    const userAnswer = parseFloat(answer);
    const correct = parseFloat(correctAnswer);
    const isCorrect = Math.abs(userAnswer - correct) < 0.001; // 浮点数精度容差

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
    const { number, germanWord, userAnswer, isCorrect, timeSpent, settings } = req.body;

    if (number === undefined || userAnswer === undefined || isCorrect === undefined) {
      return res.status(400).json({
        error: '缺少必要参数：number, userAnswer, isCorrect'
      });
    }

    const record = saveRecord({
      number,
      germanWord: germanWord || '',
      userAnswer,
      isCorrect,
      timeSpent: timeSpent || 0,
      settings: settings || {}
    });

    res.json({ success: true, record });
  } catch (error) {
    console.error('保存历史记录时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取历史记录
app.get('/api/history', (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);

    const result = getRecords(limitNum, offsetNum);

    res.json(result);
  } catch (error) {
    console.error('获取历史记录时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 清空历史记录
app.delete('/api/history', (req, res) => {
  try {
    const deletedCount = clearRecords();
    res.json({
      success: true,
      message: `已清空 ${deletedCount} 条历史记录`
    });
  } catch (error) {
    console.error('清空历史记录时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取统计信息
app.get('/api/statistics', (req, res) => {
  try {
    const stats = getStatistics();
    res.json(stats);
  } catch (error) {
    console.error('获取统计信息时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: '德语数字练习API运行正常', database: 'SQLite' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在端口 ${PORT}`);
  console.log(`📊 数据库类型: SQLite`);
  console.log(`📡 API 端点:`);
  console.log(`   GET  /api/number - 获取随机数字`);
  console.log(`   POST /api/check - 验证答案`);
  console.log(`   POST /api/history - 保存历史记录`);
  console.log(`   GET  /api/history - 获取历史记录`);
  console.log(`   DELETE /api/history - 清空历史记录`);
  console.log(`   GET  /api/statistics - 获取统计信息`);
  console.log(`   GET  /api/health - 健康检查`);
});

module.exports = app;
