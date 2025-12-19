-- 创建用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `gender` tinyint(1) DEFAULT NULL COMMENT '性别：0-女，1-男',
  `introduction` text COMMENT '简介',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像URL',
  `role` tinyint(1) DEFAULT 1 COMMENT '角色：1-普通用户，2-管理员',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 插入测试用户数据
INSERT INTO `users` (`username`, `password`, `gender`, `introduction`, `avatar`, `role`) VALUES
('admin', '123456', 1, '系统管理员', NULL, 2),
('user1', '123456', 1, '普通用户1', NULL, 1),
('test', 'test123', 0, '测试用户', NULL, 1);