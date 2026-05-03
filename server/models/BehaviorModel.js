const db = require('../db/db');

const BehaviorModel = {
  // 记录行为
  create: async (userId, targetType, targetId, behavior, duration) => {
    const [result] = await db.query(
      'INSERT INTO user_behaviors (user_id, target_type, target_id, behavior, duration) VALUES (?, ?, ?, ?, ?)',
      [userId, targetType, targetId, behavior, duration || null]
    );
    return result.insertId;
  },

  // 获取用户行为
  findByUser: async (userId, targetType) => {
    let sql = 'SELECT * FROM user_behaviors WHERE user_id = ?';
    const params = [userId];
    if (targetType) {
      sql += ' AND target_type = ?';
      params.push(targetType);
    }
    sql += ' ORDER BY created_at DESC';
    const [rows] = await db.query(sql, params);
    return rows;
  },

  // 获取某目标的行为统计
  getTargetStats: async (targetType, targetId) => {
    const [rows] = await db.query(
      `SELECT behavior, COUNT(*) as count FROM user_behaviors
       WHERE target_type = ? AND target_id = ?
       GROUP BY behavior`,
      [targetType, targetId]
    );
    return rows;
  }
};

module.exports = BehaviorModel;
