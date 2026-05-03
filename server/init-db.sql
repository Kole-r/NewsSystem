-- ============================================================
-- 就业服务平台 - 完整数据库初始化脚本
-- 数据库: employment_platform
-- ============================================================

-- 1. 用户表
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码',
  `role` tinyint NOT NULL DEFAULT 0 COMMENT '角色：0毕业生 1管理员',
  `real_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '真实姓名',
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '手机号',
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '头像URL',
  `major` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '专业',
  `degree` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '学历：本科/硕士/博士',
  `graduation_year` int DEFAULT NULL COMMENT '毕业年份',
  `university` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '毕业院校',
  `city_preference` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '意向城市',
  `job_preference` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '意向岗位类型',
  `bio` text COLLATE utf8mb4_unicode_ci COMMENT '个人简介',
  `status` tinyint DEFAULT 1 COMMENT '状态：1正常 0禁用',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 2. 新闻表
CREATE TABLE IF NOT EXISTS `news` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '新闻ID',
  `title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '标题',
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '内容',
  `summary` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '摘要',
  `category` int NOT NULL COMMENT '分类：1就业政策 2招聘快讯 3求职技巧 4通知公告',
  `cover` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '封面图URL',
  `tags` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标签，逗号分隔',
  `views` int DEFAULT 0 COMMENT '浏览量',
  `status` tinyint DEFAULT 0 COMMENT '状态：0未发布 1已发布',
  `publisher_id` int DEFAULT NULL COMMENT '发布者ID',
  `publish_date` date DEFAULT NULL COMMENT '发布日期',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='新闻表';

-- 3. 岗位表
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '岗位ID',
  `company_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '公司名称',
  `company_logo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '公司Logo',
  `company_size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '公司规模',
  `company_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '公司类型',
  `company_desc` text COLLATE utf8mb4_unicode_ci COMMENT '公司描述',
  `job_title` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '岗位名称',
  `job_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '岗位类型：技术/产品/运营/设计',
  `job_category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '岗位分类：前端/后端/算法/数据等',
  `city` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '工作城市',
  `salary_min` int DEFAULT NULL COMMENT '最低薪资',
  `salary_max` int DEFAULT NULL COMMENT '最高薪资',
  `degree_required` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '学历要求',
  `experience` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '经验要求',
  `job_description` text COLLATE utf8mb4_unicode_ci COMMENT '岗位描述',
  `job_requirements` text COLLATE utf8mb4_unicode_ci COMMENT '岗位要求',
  `benefits` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '福利待遇，逗号分隔',
  `tags` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标签，逗号分隔',
  `headcount` int DEFAULT 1 COMMENT '招聘人数',
  `status` tinyint DEFAULT 1 COMMENT '状态：0下架 1招聘中',
  `publish_date` date DEFAULT NULL COMMENT '发布日期',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_city` (`city`),
  KEY `idx_job_type` (`job_type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='岗位表';

-- 4. 用户行为表（推荐算法用）
CREATE TABLE IF NOT EXISTS `user_behaviors` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '行为ID',
  `user_id` int NOT NULL COMMENT '用户ID',
  `target_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目标类型：job/news',
  `target_id` int NOT NULL COMMENT '目标ID',
  `behavior` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '行为类型：view/collect/apply',
  `duration` int DEFAULT NULL COMMENT '停留时长（秒）',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_target` (`user_id`, `target_type`, `target_id`),
  KEY `idx_behavior` (`behavior`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户行为表';

-- 5. 收藏表
CREATE TABLE IF NOT EXISTS `favorites` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  `user_id` int NOT NULL COMMENT '用户ID',
  `target_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '目标类型：job/news',
  `target_id` int NOT NULL COMMENT '目标ID',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_target` (`user_id`, `target_type`, `target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';
