const JWT = require('../util/JWT');

const authMiddleware = (req, res, next) => {
    if (req.url === '/adminApi/user/login') {
        next();
        return;
    }

    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
        const payload = JWT.verify(token);
        if (payload) {
            const newToken = JWT.generate({
                id: payload.id,
                username: payload.username,
                role: payload.role
            }, '1h');
            res.header("Authorization", newToken);
            next();
        } else {
            return res.status(401).json({
                code: 401,
                message: '无效的token,请重新登录'
            });
        }
    } else {
        return res.status(401).json({
            code: 401,
            message: '缺少 token, 请先登录'
        });
    }
};

module.exports = authMiddleware;