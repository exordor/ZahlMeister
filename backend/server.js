const express = require('express');
const cors = require('cors');
const { getRandomGermanNumber } = require('./utils/germanNumbers');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 获取随机数字
app.get('/api/number', (req, res) => {
  try {
    const { min = 0, max = 100 } = req.query;
    const minNum = parseInt(min);
    const maxNum = parseInt(max);
    
    // 验证参数
    if (isNaN(minNum) || isNaN(maxNum) || minNum < 0 || maxNum > 1000 || minNum > maxNum) {
      return res.status(400).json({
        error: '无效的参数范围，请确保 min >= 0, max <= 1000, 且 min <= max'
      });
    }
    
    const result = getRandomGermanNumber(minNum, maxNum);
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
  console.log(`   GET  /api/health - 健康检查`);
});

module.exports = app;
