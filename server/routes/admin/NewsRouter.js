const express = require('express');
const NewsRouter = express.Router();
const NewsController = require('../../controllers/admin/NewsController');
// 处理文件上传
const multer = require('multer');
const upload = multer({ dest: 'public/newsuploads/' });

// 新闻路由
NewsRouter.get("/news/list", NewsController.getNews); // 获取新闻列表
NewsRouter.get("/news/list/:id", NewsController.getNews); // 获取单个新闻
NewsRouter.get("/news/category/:category", NewsController.getNewsByCategory); // 按分类获取新闻
NewsRouter.post("/news/add", upload.single('file'), NewsController.addNews); // 添加新闻
NewsRouter.put("/news/update/:id", upload.single('file'), NewsController.updateNews); // 更新新闻
NewsRouter.delete("/news/delete/:id", NewsController.deleteNews); // 删除新闻

module.exports = NewsRouter;
