const UserModel = require('../../models/UserModel');
const FavoriteModel = require('../../models/FavoriteModel');
const JWT = require('../../util/JWT');

const UserController = {
  // 用户登录
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ code: 400, message: '请输入用户名和密码' });
      }

      const user = await UserModel.findByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ code: 401, message: '用户名或密码错误' });
      }

      if (user.status === 0) {
        return res.status(403).json({ code: 403, message: '账号已被禁用' });
      }

      const token = JWT.generate({
        id: user.id,
        username: user.username,
        role: user.role
      }, '7d');

      res.status(200).json({
        code: 200,
        message: '登录成功',
        data: {
          token,
          id: user.id,
          username: user.username,
          role: user.role,
          real_name: user.real_name,
          avatar: user.avatar,
          major: user.major,
          degree: user.degree,
          university: user.university
        }
      });
    } catch (error) {
      console.error('登录失败:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  },

  // 用户注册
  register: async (req, res) => {
    try {
      const { username, password, real_name } = req.body;
      if (!username || !password) {
        return res.status(400).json({ code: 400, message: '请输入用户名和密码' });
      }

      const existing = await UserModel.findByUsername(username);
      if (existing) {
        return res.status(400).json({ code: 400, message: '用户名已存在' });
      }

      const userId = await UserModel.create({
        username,
        password,
        real_name: real_name || username,
        role: 0,
        status: 1
      });

      res.status(200).json({
        code: 200,
        message: '注册成功',
        data: { id: userId }
      });
    } catch (error) {
      console.error('注册失败:', error);
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  },

  // 获取个人信息
  getProfile: async (req, res) => {
    try {
      const user = await UserModel.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ code: 404, message: '用户不存在' });
      }
      const { password, ...safeUser } = user;
      res.status(200).json({ code: 200, data: safeUser });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  },

  // 获取收藏列表
  getFavorites: async (req, res) => {
    try {
      const favorites = await FavoriteModel.findByUser(req.user.id);

      // 填充目标详情
      const db = require('../../db/db');
      const enriched = await Promise.all(favorites.map(async (fav) => {
        let title = '';
        if (fav.target_type === 'job') {
          const [rows] = await db.query('SELECT job_title FROM jobs WHERE id = ?', [fav.target_id]);
          title = rows[0]?.job_title || '';
        } else if (fav.target_type === 'news') {
          const [rows] = await db.query('SELECT title FROM news WHERE id = ?', [fav.target_id]);
          title = rows[0]?.title || '';
        }
        return { ...fav, title };
      }));

      res.status(200).json({ code: 200, data: enriched });
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  },

  // 添加/取消收藏
  toggleFavorite: async (req, res) => {
    try {
      const { target_type, target_id } = req.body;
      const userId = req.user.id;

      const exists = await FavoriteModel.isFavorited(userId, target_type, target_id);
      if (exists) {
        await FavoriteModel.remove(userId, target_type, target_id);
        res.status(200).json({ code: 200, message: '已取消收藏', data: { favorited: false } });
      } else {
        await FavoriteModel.create(userId, target_type, target_id);
        res.status(200).json({ code: 200, message: '收藏成功', data: { favorited: true } });
      }
    } catch (error) {
      res.status(500).json({ code: 500, message: '服务器内部错误' });
    }
  }
};

module.exports = UserController;
