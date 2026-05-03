const express = require('express');
const WebJobRouter = express.Router();
const JobController = require('../../controllers/web/JobController');
const RecommendService = require('../../services/web/RecommendService');

WebJobRouter.get('/job/list', JobController.getList);
WebJobRouter.get('/job/detail/:id', JobController.getDetail);
WebJobRouter.get('/job/recommend', async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ code: 401, message: '请先登录' });
    }
    const limit = Number(req.query.limit) || 10;
    const jobs = await RecommendService.getRecommendJobs(userId, limit);
    res.status(200).json({ code: 200, data: jobs });
  } catch (error) {
    console.error('推荐失败:', error);
    res.status(500).json({ code: 500, message: '推荐服务异常' });
  }
});

module.exports = WebJobRouter;
