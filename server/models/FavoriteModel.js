const db = require('../db/db');

const FavoriteModel = {
  // 查询用户的收藏
  findByUser: async (userId, targetType) => {
    let sql = 'SELECT * FROM favorites WHERE user_id = ?';
    const params = [userId];
    if (targetType) {
      sql += ' AND target_type = ?';
      params.push(targetType);
    }
    sql += ' ORDER BY created_at DESC';
    const [rows] = await db.query(sql, params);
    return rows;
  },

  // 检查是否已收藏
  isFavorited: async (userId, targetType, targetId) => {
    const [rows] = await db.query(
      'SELECT id FROM favorites WHERE user_id = ? AND target_type = ? AND target_id = ?',
      [userId, targetType, targetId]
    );
    return rows.length > 0;
  },

  // 添加收藏
  create: async (userId, targetType, targetId) => {
    const [result] = await db.query(
      'INSERT IGNORE INTO favorites (user_id, target_type, target_id) VALUES (?, ?, ?)',
      [userId, targetType, targetId]
    );
    return result.insertId;
  },

  // 取消收藏
  remove: async (userId, targetType, targetId) => {
    const [result] = await db.query(
      'DELETE FROM favorites WHERE user_id = ? AND target_type = ? AND target_id = ?',
      [userId, targetType, targetId]
    );
    return result.affectedRows;
  }
};

module.exports = FavoriteModel;
