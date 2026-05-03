const express = require('express');
const WebUserRouter = express.Router();
const UserController = require('../../controllers/web/UserController');

WebUserRouter.post('/user/login', UserController.login);
WebUserRouter.post('/user/register', UserController.register);
WebUserRouter.get('/user/profile', UserController.getProfile);
WebUserRouter.get('/user/favorites', UserController.getFavorites);
WebUserRouter.post('/user/favorite', UserController.toggleFavorite);

module.exports = WebUserRouter;
