/**
 * SQLite数据库模块
 * 使用better-sqlite3进行数据持久化
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// 数据库文件路径
const DB_PATH = path.join(__dirname, 'practice_history.db');
const DB_DIR = path.dirname(DB_PATH);

// 确保db目录存在
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// 创建数据库连接
const db = new Database(DB_PATH);

// 启用外键约束
db.pragma('foreign_keys = ON');

// 设置WAL模式以提高并发性能
db.pragma('journal_mode = WAL');

/**
 * 初始化数据库表结构
 */
function initDatabase() {
  // 创建practice_history表
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS practice_history (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      number REAL NOT NULL,
      german_word TEXT NOT NULL,
      user_answer REAL NOT NULL,
      is_correct INTEGER NOT NULL,
      time_spent INTEGER DEFAULT 0,
      settings TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.exec(createTableSQL);

  // 创建索引以提高查询性能
  const createIndexSQL = `
    CREATE INDEX IF NOT EXISTS idx_timestamp ON practice_history(timestamp DESC);
    CREATE INDEX IF NOT EXISTS idx_is_correct ON practice_history(is_correct);
    CREATE INDEX IF NOT EXISTS idx_created_at ON practice_history(created_at DESC);
  `;

  db.exec(createIndexSQL);

  console.log('✅ 数据库初始化成功');
}

// 初始化数据库
initDatabase();

/**
 * 保存练习记录
 * @param {Object} record - 记录对象
 * @returns {Object} 插入的记录
 */
function saveRecord(record) {
  const { number, germanWord, userAnswer, isCorrect, timeSpent = 0, settings = {} } = record;

  const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  const timestamp = new Date().toISOString();
  const settingsJSON = JSON.stringify(settings);

  const insertSQL = `
    INSERT INTO practice_history (id, timestamp, number, german_word, user_answer, is_correct, time_spent, settings)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const stmt = db.prepare(insertSQL);
  stmt.run(id, timestamp, number, germanWord, userAnswer, isCorrect ? 1 : 0, timeSpent, settingsJSON);

  return {
    id,
    timestamp,
    number,
    germanWord,
    userAnswer,
    isCorrect,
    timeSpent,
    settings
  };
}

/**
 * 获取练习记录（分页）
 * @param {number} limit - 每页数量
 * @param {number} offset - 偏移量
 * @returns {Object} 记录列表和总数
 */
function getRecords(limit = 50, offset = 0) {
  // 获取总数
  const countSQL = 'SELECT COUNT(*) as count FROM practice_history';
  const countStmt = db.prepare(countSQL);
  const { count: total } = countStmt.get();

  // 获取分页记录（按时间倒序）
  const selectSQL = `
    SELECT
      id,
      timestamp,
      number,
      german_word as germanWord,
      user_answer as userAnswer,
      is_correct as isCorrect,
      time_spent as timeSpent,
      settings
    FROM practice_history
    ORDER BY timestamp DESC
    LIMIT ? OFFSET ?
  `;

  const stmt = db.prepare(selectSQL);
  const records = stmt.all(limit, offset);

  // 解析settings JSON
  const parsedRecords = records.map(record => ({
    ...record,
    isCorrect: record.isCorrect === 1,
    settings: record.settings ? JSON.parse(record.settings) : {}
  }));

  return {
    records: parsedRecords,
    total,
    hasMore: offset + limit < total
  };
}

/**
 * 清空所有记录
 * @returns {number} 删除的记录数
 */
function clearRecords() {
  const deleteSQL = 'DELETE FROM practice_history';
  const stmt = db.prepare(deleteSQL);
  const result = stmt.run();
  return result.changes;
}

/**
 * 获取统计信息
 * @returns {Object} 统计数据
 */
function getStatistics() {
  const statsSQL = `
    SELECT
      COUNT(*) as total,
      SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct,
      SUM(CASE WHEN is_correct = 0 THEN 1 ELSE 0 END) as incorrect,
      AVG(CASE WHEN is_correct = 1 AND time_spent > 0 THEN time_spent END) as avgCorrectTime,
      AVG(CASE WHEN is_correct = 0 AND time_spent > 0 THEN time_spent END) as avgIncorrectTime
    FROM practice_history
  `;

  const stmt = db.prepare(statsSQL);
  const stats = stmt.get();

  return {
    total: stats.total || 0,
    correct: stats.correct || 0,
    incorrect: stats.incorrect || 0,
    accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    avgCorrectTime: Math.round(stats.avgCorrectTime || 0),
    avgIncorrectTime: Math.round(stats.avgIncorrectTime || 0)
  };
}

/**
 * 关闭数据库连接
 */
function closeDatabase() {
  db.close();
  console.log('📊 数据库连接已关闭');
}

// 导出函数
module.exports = {
  db,
  saveRecord,
  getRecords,
  clearRecords,
  getStatistics,
  closeDatabase
};
