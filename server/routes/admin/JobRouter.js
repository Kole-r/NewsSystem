const express = require('express');
const JobRouter = express.Router();
const JobController = require('../../controllers/admin/JobController');

// 岗位路由
JobRouter.get("/job/list", JobController.getJobs);
JobRouter.get("/job/list/:id", JobController.getJobs);
JobRouter.post("/job/add", JobController.addJob);
JobRouter.put("/job/update/:id", JobController.updateJob);
JobRouter.delete("/job/delete/:id", JobController.deleteJob);

module.exports = JobRouter;
