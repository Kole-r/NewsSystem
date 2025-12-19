const db = require('./db/db');

async function initDatabase() {
    try {
        console.log('开始初始化数据库...');
        
        // 创建用户表
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                gender TINYINT(1) DEFAULT NULL COMMENT '性别：0-女，1-男',
                introduction TEXT COMMENT '简介',
                avatar VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
                role TINYINT(1) DEFAULT 1 COMMENT '角色：1-普通用户，2-管理员',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `;
        
        await db.execute(createTableSQL);
        console.log('用户表创建成功');
        
        // 检查是否已有测试数据
        const [existingUsers] = await db.query('SELECT COUNT(*) as count FROM users');
        if (existingUsers[0].count === 0) {
            // 插入测试用户数据
            const insertUsersSQL = `
                INSERT INTO users (username, password, gender, introduction, avatar, role) VALUES
                ('admin', '123456', 1, '系统管理员', NULL, 2),
                ('user1', '123456', 1, '普通用户1', NULL, 1),
                ('test', 'test123', 0, '测试用户', NULL, 1)
            `;
            
            await db.execute(insertUsersSQL);
            console.log('测试用户数据插入成功');
            
            // 显示创建的用户
            const [users] = await db.query('SELECT id, username, role FROM users');
            console.log('创建的用户：', users);
        } else {
            console.log('数据库中已有用户数据，跳过插入');
            const [users] = await db.query('SELECT id, username, role FROM users');
            console.log('现有用户：', users);
        }
        
        console.log('数据库初始化完成！');
        console.log('测试登录信息：');
        console.log('管理员 - 用户名: admin, 密码: 123456');
        console.log('普通用户 - 用户名: user1, 密码: 123456');
        console.log('测试用户 - 用户名: test, 密码: test123');
        
    } catch (error) {
        console.error('数据库初始化失败:', error);
    } finally {
        process.exit(0);
    }
}

// 运行初始化
initDatabase();