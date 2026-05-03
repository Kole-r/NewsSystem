const JobModel = require('../../models/JobModel');

const JobService = {
  getJobs: async (id, filters) => {
    if (id) {
      return JobModel.findById(id);
    }
    return JobModel.findAll(filters);
  },

  addJob: async (jobData) => {
    return JobModel.create(jobData);
  },

  updateJob: async (id, jobData) => {
    return JobModel.update(id, jobData);
  },

  deleteJob: async (id) => {
    return JobModel.deleteJob(id);
  }
};

module.exports = JobService;
