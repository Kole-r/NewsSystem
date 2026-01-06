const UserService = require('../../services/admin/UserService');
const JWT = require('../../util/JWT');
const UserController = {
    // 用户登录
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            // 1. 参数验证
            if (!username || !password) {
                return res.status(400).json({
                    code: 400,
                    message: '用户名和密码不能为空'
                });
            }

            // 2. 调用Service层查询用户（只调用一次）
            const userInfo = await UserService.login(req.body);
            // 3. 判断登录结果
            if (!userInfo) {
                return res.status(200).json({
                    code: 401,
                    message: '用户名或密码错误'
                });
            }
            // 4. 生成JWT token
            const token = JWT.generate({
                id: userInfo.id,
                username: userInfo.username,
                role: userInfo.role
            }, '1h');
            res.header("Authorization", token);
            res.status(200).json({
                code: 200,
                message: '登录成功',
                data: {
                    username: userInfo.username,
                    role: userInfo.role,
                    gender: userInfo.gender ? userInfo.gender : null,
                    introduction: userInfo.introduction ? userInfo.introduction : null,
                    avatar: userInfo.avatar ? userInfo.avatar : null
                }
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: '服务器内部错误'
            });
        }
    },
    upload: async (req, res) => {
        const { username, introduction, gender } = req.body;
        const avatar = req.file ? `/avataruploads/${req.file.filename}` : null;
        //调用server模块更新数据
        const token = req.headers['authorization']?.split(' ')[1];
        const payload = JWT.verify(token);
        //更新用户信息
        try {
            const updateData = { username, introduction, gender: Number(gender) };
            if (avatar) {
                updateData.avatar = avatar; // 只有当 avatar 不为空时才添加到更新数据中
            }
            await UserService.update(payload.id, updateData);
            res.status(200).json({
                code: 200,
                message: '头像上传成功',
                data: {
                    username: username,
                    introduction: introduction,
                    gender: Number(gender),
                    avatar: avatar
                }
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: '服务器内部错误'
            });
        }
    },
    // 添加用户
    addUser: async (req, res) => {
        try {
            const { username, password, role, gender, introduction } = req.body;
            const avatar = req.file ? `/avataruploads/${req.file.filename}` : null;

            // 参数验证
            if (!username || username.length < 3 || username.length > 20) {
                return res.status(400).json({
                    code: 400,
                    message: '用户名长度必须在3到20个字符之间'
                });
            }
            if (!password || password.length < 6 || password.length > 20) {
                return res.status(400).json({
                    code: 400,
                    message: '密码长度必须在6到20个字符之间'
                });
            }
            if (!role) {
                return res.status(400).json({
                    code: 400,
                    message: '角色不能为空'
                });
            }

            // 调用Service层添加用户
            await UserService.addUser({
                username,
                password,
                role: Number(role),
                gender: Number(gender),
                introduction,
                avatar
            });
            res.status(200).json({
                code: 200,
                message: '用户添加成功'
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: '服务器内部错误'
            });
        }
    },
    // 获取用户列表/单个数据
    getUser: async (req, res) => {
        try {
            const userId = req.params.id; // 获取路径参数中的 id
            const result = await UserService.getUser(userId);

            // 处理返回结果：如果是单个用户，转换为数组；如果是列表，直接使用
            const users = Array.isArray(result) ? result : (result ? [result] : []);

            res.status(200).json({
                code: 200,
                message: '用户列表获取成功',
                data: users.map(user => ({
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    avatar: user.avatar,
                    introduction: user.introduction,
                }))
            });
        } catch (error) {
            console.error('获取用户列表失败:', error); // 添加错误日志
            res.status(500).json({
                code: 500,
                message: '服务器内部错误',
                error: error.message // 开发环境可以返回错误详情
            });
        }
    },
    // 删除用户
    deleteUser: async (req, res) => {
        try {
            const userId = req.params.id;
            if (!userId) {
                return res.status(400).json({
                    code: 400,
                    message: '用户ID不能为空'
                });
            }
            await UserService.deleteUser(userId);
            res.status(200).json({
                code: 200,
                message: '用户删除成功'
            });
        } catch (error) {
            res.status(500).json({
                code: 500,
                message: '服务器内部错误'
            });
        }
    },
    //编辑用户
    editUser: async (req, res) => {
        try {
            console.log('=== editUser 开始 ===');
            console.log('req.params:', req.params);
            console.log('req.body:', req.body);
            console.log('req.file:', req.file);
            
            const userId = req.params.id;
            const { username, password, role, gender, introduction } = req.body;
            const avatar = req.file ? `/avataruploads/${req.file.filename}` : undefined;
            
            // 参数验证
            if (!username || username.length < 3 || username.length > 20) {
                return res.status(400).json({
                    code: 400,
                    message: '用户名长度必须在3到20个字符之间'
                });
            }
            if (password && (password.length < 6 || password.length > 20)) {
                return res.status(400).json({
                    code: 400,
                    message: '密码长度必须在6到20个字符之间'
                });
            }
            if (!userId) {
                return res.status(400).json({
                    code: 400,
                    message: '用户ID不能为空'
                });
            }
            
            // 构建更新数据（只更新提供的字段，使用 in 检查字段是否存在）
            const updateData = {};
            if ('username' in req.body && username) updateData.username = username;
            if ('password' in req.body && password) updateData.password = password; // 密码可选，空则不更新
            if ('role' in req.body && role !== undefined) updateData.role = Number(role);
            if ('gender' in req.body && gender !== undefined) updateData.gender = Number(gender);
            if ('introduction' in req.body) updateData.introduction = introduction || ''; // 允许清空
            if (avatar) updateData.avatar = avatar; // 只有上传新头像才更新
            
            console.log('updateData:', updateData);
            
            // 调用Service层更新用户
            await UserService.update(userId, updateData);

            res.status(200).json({
                code: 200,
                message: '用户更新成功'
            });
        } catch (error) {
            console.error('编辑用户失败:');
            res.status(500).json({
                code: 500,
                message: '服务器内部错误',
                error: error.message
            });
        }
    }

};

module.exports = UserController;