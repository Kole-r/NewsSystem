const JWT = require('../util/JWT');

// 白名单：不需要 token 验证的路由
const whitelist = [
    '/adminApi/user/login',
    '/webApi/user/login',
    '/webApi/user/register',
    '/webApi/news/list',
    '/webApi/news/detail',
    '/webApi/job/list',
    '/webApi/job/detail',
];

const authMiddleware = (req, res, next) => {
    // 检查白名单（支持带查询参数的 URL）
    const pathname = req.url.split('?')[0];
    if (whitelist.some(path => pathname.startsWith(path))) {
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
            req.user = payload;
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