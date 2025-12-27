const UserModel = require('../../models/UserModel');

const UserService = {
  // 登录校验
  login: async ({ username, password }) => {
    return UserModel.findByUsernameAndPassword(username, password); // 同时查询用户名和密码
  },
  update: async (id, userData) => {
    return UserModel.update(id, userData);
  },
  addUser: async (userData) => {
    return UserModel.create(userData);
  }
};

module.exports = UserService;
