const express = require('express');
const AIRouter = express.Router();
const AIController = require('../../controllers/admin/AIController');

AIRouter.post('/ai/chat', AIController.chat);

module.exports = AIRouter;
