const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
    host: 'localhost', // 数据库地址
    user: 'root',      // 数据库用户名
    password: '22222222', // 数据库密码
    database: 'news', // 数据库名称
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 导出连接池
module.exports = pool.promise();