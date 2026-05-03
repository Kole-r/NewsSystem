const NewsService = require('../../services/admin/NewsService');
const JWT = require('../../util/JWT');

const NewsController = {
  // 获取新闻列表或单个新闻
  getNews: async (req, res) => {
    try {
      const newsId = req.params.id; // 获取路径参数中的 id
      const result = await NewsService.getNews(newsId);

      // 处理返回结果：如果是单个新闻，转换为数组；如果是列表，直接使用
      const newsList = Array.isArray(result) ? result : (result ? [result] : []);

      res.status(200).json({
        code: 200,
        message: '新闻列表获取成功',
        data: newsList
      });
    } catch (error) {
      console.error('获取新闻列表失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器内部错误',
        error: error.message
      });
    }
  },

  // 按分类获取新闻
  getNewsByCategory: async (req, res) => {
    try {
      const category = req.params.category;
      if (!category) {
        return res.status(400).json({
          code: 400,
          message: '请指定新闻分类'
        });
      }

      const result = await NewsService.getNewsByCategory(category);
      res.status(200).json({
        code: 200,
        message: '分类新闻获取成功',
        data: result
      });
    } catch (error) {
      console.error('获取分类新闻失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器内部错误'
      });
    }
  },

  // 添加新闻
  addNews: async (req, res) => {
    try {      
      const { title, content, category, isPublish } = req.body;
      console.log('【NewsController】解构出的数据:', { title, content, category, isPublish });
      
      const cover = req.file ? `/newsuploads/${req.file.filename}` : null; // 封面图片路径，如果没有上传则为 null
      console.log('【NewsController】处理后的封面路径:', cover);
      
      // 获取当前用户 ID
      const token = req.headers['authorization']?.split(' ')[1];
      console.log('【NewsController】获取到的Token:', token ? '存在' : '不存在');
      const payload = JWT.verify(token);
      console.log('【NewsController】Token解析结果:', payload);
      const userId = payload.id;
      console.log('【NewsController】当前用户ID:', userId);

      // 参数验证
      console.log('【NewsController】开始参数验证...');
      if (!title || title.length < 5 || title.length > 100) {
        console.log('❌ 【NewsController】标题验证失败:', { title, length: title?.length });
        return res.status(400).json({
          code: 400,
          message: '新闻标题长度必须在 5 - 100 之间'
        });
      }
      console.log('✓ 【NewsController】标题验证通过');

      if (!content || content.length < 20) {
        console.log('❌ 【NewsController】内容验证失败:', { content: content?.substring(0, 50), length: content?.length });
        return res.status(400).json({
          code: 400,
          message: '新闻内容长度必须至少 20 字'
        });
      }
      console.log('✓ 【NewsController】内容验证通过，长度:', content.length);

      if (!category) {
        console.log('❌ 【NewsController】分类验证失败');
        return res.status(400).json({
          code: 400,
          message: '请选择新闻分类'
        });
      }
      console.log('✓ 【NewsController】分类验证通过:', category);

      // 调用 Service 层添加新闻
      console.log('【NewsController】所有验证通过，准备调用Service层添加新闻...');
      const newsData = {
        title,
        content,
        category: Number(category),
        cover,
        isPublish: Number(isPublish) || 0,
        userId
      };
      console.log('【NewsController】传递给Service的完整数据:', JSON.stringify(newsData, null, 2));
      
      const newsId = await NewsService.addNews(newsData);
      
      console.log('【NewsController】✓ 新闻添加成功，ID:', newsId);
      console.log('============================================\n');

      res.status(200).json({
        code: 200,
        message: '新闻添加成功',
        data: {
          id: newsId
        }
      });
    } catch (error) {
      console.error('\n❌ 【NewsController】添加新闻失败:', error.message);
      console.error('【NewsController】错误堆栈:', error.stack);
      console.log('============================================\n');
      res.status(500).json({
        code: 500,
        message: '服务器内部错误'
      });
    }
  },

  // 更新新闻
  updateNews: async (req, res) => {
    try {
      console.log('=== updateNews 开始 ===');
      const newsId = req.params.id;
      const { title, content, category, isPublish } = req.body;
      const cover = req.file ? `/newsuploads/${req.file.filename}` : null;

      // 参数验证
      if (!newsId) {
        return res.status(400).json({
          code: 400,
          message: '请指定要更新的新闻 ID'
        });
      }

      if (title && (title.length < 5 || title.length > 100)) {
        return res.status(400).json({
          code: 400,
          message: '新闻标题长度必须在 5 - 100 之间'
        });
      }

      if (content && content.length < 20) {
        return res.status(400).json({
          code: 400,
          message: '新闻内容长度必须至少 20 字'
        });
      }

      // 构建更新数据对象
      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;
      if (category) updateData.category = Number(category);
      if (isPublish !== undefined) updateData.isPublish = Number(isPublish);
      if (cover) updateData.cover = cover;

      // 调用 Service 层更新新闻
      await NewsService.updateNews(newsId, updateData);

      res.status(200).json({
        code: 200,
        message: '新闻更新成功'
      });
    } catch (error) {
      console.error('更新新闻失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器内部错误'
      });
    }
  },

  // 删除新闻
  deleteNews: async (req, res) => {
    try {
      const newsId = req.params.id;
      if (!newsId) {
        return res.status(400).json({
          code: 400,
          message: '请指定要删除的新闻 ID'
        });
      }

      await NewsService.deleteNews(newsId);
      res.status(200).json({
        code: 200,
        message: '新闻删除成功'
      });
    } catch (error) {
      console.error('删除新闻失败:', error);
      res.status(500).json({
        code: 500,
        message: '服务器内部错误'
      });
    }
  }
};

module.exports = NewsController;
