const db = require('../db/db');

// 基础数据库操作方法

// 根据用户名查询用户
const findByUsername = async (username) => {
  const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

// 根据用户名和密码查询用户（用于登录校验）
const findByUsernameAndPassword = async (username, password) => {
  const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  return rows[0];
};

// 根据 ID 查询用户
const findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

// 查询所有用户
const findAll = async () => {
  const [rows] = await db.query('SELECT * FROM users');
  return rows;
};

// 创建用户
const create = async (userData) => {
  const { username, password, gender, introduction, avatar, role } = userData;
  const [result] = await db.query(
    'INSERT INTO users (username, password, gender, introduction, avatar, role) VALUES (?, ?, ?, ?, ?, ?)',
    [username, password, gender, introduction, avatar, role]
  );
  return result.insertId;
};

// 更新用户
const update = async (id, userData) => {
  try {
    console.log('=== UserModel.update 开始 ===');
    // 过滤掉 undefined 的字段，只更新提供的字段
    const filteredData = Object.entries(userData)
      .filter(([_, value]) => value !== undefined)//用于过滤二维数组，返回满足条件的元素的新数组。
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});//用于将二维数组转换为对象
    if (Object.keys(filteredData).length === 0) {
      throw new Error('没有可更新的字段');
    }
    // 动态构建 SQL 查询
    const fields = Object.keys(filteredData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(filteredData), id];

    const sql = `UPDATE users SET ${fields} WHERE id = ?`;
    console.log('执行 SQL:', sql);
    console.log('SQL 参数:', values);
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) {
      console.warn(`警告：没有找到 id=${id} 的用户记录`);
    }
    return result.affectedRows;
  } catch (error) {
    console.error('Error in UserModel.update:', error);
    throw error;
  }
};


// 删除用户
const remove = async (id) => {
  const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = {
  findByUsername,
  findByUsernameAndPassword,
  findById,
  findAll,
  create,
  update,
  remove
};
