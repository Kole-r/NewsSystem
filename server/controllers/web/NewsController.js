const NewsModel = require('../../models/NewsModel');
const BehaviorModel = require('../../models/BehaviorModel');

const NewsController = {
  // 获取已发布新闻列表
  getList: async (req, res) => {
    try {
      const db = require('../../db/db');
      const limit = req.query.limit ? Number(req.query.limit) : null;
      let sql = 'SELECT id, title, summary, category, cover, tags, views, publish_date, created_at FROM news WHERE status = 1 ORDER BY created_at DESC';
      if (limit) sql += ` LIMIT ${limit}`;
      const [rows] = await db.query(sql);

      res.status(200).json({ code: 200, data: rows });
    } catch (error) {
      console.error('获取新闻列表失败:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  },

  // 获取新闻详情
  getDetail: async (req, res) => {
    try {
      const news = await NewsModel.findById(req.params.id);
      if (!news || news.status !== 1) {
        return res.status(404).json({ code: 404, message: '新闻不存在' });
      }

      // 增加浏览量
      const db = require('../../db/db');
      await db.query('UPDATE news SET views = views + 1 WHERE id = ?', [req.params.id]);

      // 记录用户行为（如果有 token）
      const userId = req.user?.id;
      if (userId) {
        await BehaviorModel.create(userId, 'news', req.params.id, 'view');
      }

      res.status(200).json({ code: 200, data: { ...news, views: (news.views || 0) + 1 } });
    } catch (error) {
      console.error('获取新闻详情失败:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
};

module.exports = NewsController;
