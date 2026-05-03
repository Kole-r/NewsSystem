const express = require('express');
const WebNewsRouter = express.Router();
const NewsController = require('../../controllers/web/NewsController');

WebNewsRouter.get('/news/list', NewsController.getList);
WebNewsRouter.get('/news/detail/:id', NewsController.getDetail);

module.exports = WebNewsRouter;
