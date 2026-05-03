const db = require('../db/db');

// 新闻模型 - 数据库操作方法

// 根据 ID 查询新闻
const findById = async (id) => {
  const [rows] = await db.query('SELECT * FROM news WHERE id = ?', [id]);
  return rows[0];
};

// 查询所有新闻
const findAll = async () => {
  const [rows] = await db.query('SELECT * FROM news ORDER BY created_at DESC');
  return rows;
};

// 根据分类查询新闻
const findByCategory = async (category) => {
  const [rows] = await db.query('SELECT * FROM news WHERE category = ? ORDER BY created_at DESC', [category]);
  return rows;
};

// 创建新闻
const create = async (newsData) => {
  const { title, content, category, cover, isPublish, userId } = newsData;
  const [result] = await db.query(
    'INSERT INTO news (title, content, category, cover, isPublish, userId, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
    [title, content, category, cover, isPublish, userId]
  );
  return result.insertId;
};

// 更新新闻
const update = async (id, newsData) => {
  try {
    console.log('=== NewsModel.update 开始 ===');
    // 过滤掉 undefined 的字段，只更新提供的字段
    const filteredData = Object.entries(newsData)
      .filter(([_, value]) => value !== undefined)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
    
    console.log('更新数据:', filteredData);
    if (Object.keys(filteredData).length === 0) {
      throw new Error('没有可更新的字段');
    }

    // 添加更新时间
    filteredData.updated_at = new Date();

    // 动态构建 SQL 查询
    const fields = Object.keys(filteredData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(filteredData), id];

    const sql = `UPDATE news SET ${fields} WHERE id = ?`;
    console.log('执行 SQL:', sql);
    console.log('SQL 参数:', values);
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) {
      console.warn(`警告：没有找到 id=${id} 的新闻记录`);
    }
    return result.affectedRows;
  } catch (error) {
    console.error('Error in NewsModel.update:', error);
    throw error;
  }
};

// 删除新闻
const deleteNews = async (id) => {
  const [result] = await db.query('DELETE FROM news WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = {
  findById,
  findAll,
  findByCategory,
  create,
  update,
  deleteNews
};
