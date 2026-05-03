const NewsModel = require('../../models/NewsModel');

const NewsService = {
  // 获取新闻列表或单个新闻
  getNews: async (id) => {
    if (id) {
      return NewsModel.findById(id);
    }
    return NewsModel.findAll();
  },

  // 按分类获取新闻
  getNewsByCategory: async (category) => {
    return NewsModel.findByCategory(category);
  },

  // 添加新闻
  addNews: async (newsData) => {
    const result = await NewsModel.create(newsData);
    return result;
  },

  // 更新新闻
  updateNews: async (id, newsData) => {
    return NewsModel.update(id, newsData);
  },

  // 删除新闻
  deleteNews: async (id) => {
    return NewsModel.deleteNews(id);
  }
};

module.exports = NewsService;
