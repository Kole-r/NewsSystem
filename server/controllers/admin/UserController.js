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
                    gender: userInfo.gender?userInfo.gender:null,
                    introduction: userInfo.introduction?userInfo.introduction:null,
                    avatar: userInfo.avatar?userInfo.avatar:null
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
        console.log('头像上传路径:', avatar);
        //调用server模块更新数据
        const token = req.headers['authorization']?.split(' ')[1];
        const payload = JWT.verify(token);
        
        try {
            await UserService.update(payload.id, { username, introduction, gender: Number(gender), avatar });
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
    }
};

module.exports = UserController;