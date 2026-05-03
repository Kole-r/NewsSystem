# 就业服务平台

面向应届毕业生的一站式就业服务平台，提供岗位浏览、就业资讯、AI 智能问答等功能，并配套完整的后台管理系统。

## 项目结构

```
├── admin/          # 后台管理前端（Vue 3 + Vite，端口 5173）
├── client/         # 门户网站前端（Vue 3 + Vite，端口 5174）
├── server/         # 后端服务（Express.js，端口 3000）
└── ai_service/     # AI 问答服务（FastAPI + ChromaDB，端口 8000）
```

## 技术栈

| 模块 | 技术 |
|------|------|
| 后台管理前端 | Vue 3、Vite、Element Plus、Pinia、Vue Router |
| 门户网站前端 | Vue 3、Vite、Element Plus、Pinia、Vue Router |
| 后端服务 | Node.js、Express.js、MySQL（mysql2）、JWT、Multer |
| AI 服务 | Python 3.10、FastAPI、Transformers、ChromaDB、Qwen |

## 功能说明

### 门户网站（client/）

- **首页**：展示平台统计数据、最新岗位与资讯
- **岗位列表 / 详情**：浏览、搜索在招岗位，查看详细岗位信息
- **资讯列表 / 详情**：就业政策、招聘快讯、求职技巧等分类资讯
- **收藏夹**：收藏岗位与资讯
- **个人中心**：管理个人信息、头像、学历及求职意向
- **AI 助手**：浮窗式 AI 聊天机器人，支持就业相关问答

### 后台管理系统（admin/）

- **登录 / 权限控制**：基于角色的动态路由（角色 0 = 毕业生，角色 1 = 管理员）
- **用户管理**：查看、新增用户（仅管理员）
- **新闻管理**：新闻的增删改查、图文发布（富文本编辑器）
- **岗位管理**：岗位的增删改查、上下架管理
- **个人中心**：修改个人信息与密码

## 快速开始

### 环境要求

- Node.js（推荐 LTS 版本）
- Python 3.10
- MySQL 8.0+

### 1. 初始化数据库

```bash
# 登录 MySQL 后执行初始化脚本
cd server
node init-database.js
```

或直接在 MySQL 中执行 `server/init-db.sql`。

数据库名：`employment_platform`，包含以下数据表：

| 表名 | 说明 |
|------|------|
| `users` | 用户表（毕业生 / 管理员） |
| `news` | 新闻资讯表 |
| `jobs` | 岗位信息表 |
| `user_behaviors` | 用户行为记录表（用于推荐算法） |
| `favorites` | 收藏表 |

### 2. 启动后端服务（server/）

```bash
cd server
npm install
npm start
# 服务运行于 http://localhost:3000
```

### 3. 启动 AI 服务（ai_service/）

```bash
cd ai_service
pip install -r requirements.txt
python main.py
# 服务运行于 http://localhost:8000
```

> **注意**：AI 服务需要预先准备好 Qwen 微调后的模型，并将 `main.py` 中的 `MODEL_PATH` 修改为实际模型路径。

### 4. 启动后台管理前端（admin/）

```bash
cd admin
npm install
npm run dev
# 访问 http://localhost:5173
```

### 5. 启动门户网站前端（client/）

```bash
cd client
npm install
npm run dev
# 访问 http://localhost:5174
```

## 接口说明

### 请求路由

| 前缀 | 目标服务 | 说明 |
|------|----------|------|
| `/adminApi/*` | Express（3000） | 后台管理接口 |
| `/webApi/*` | Express（3000） | 门户网站接口 |
| `/api/*` | FastAPI（8000） | AI 服务接口 |
| `/avataruploads/*` | Express 静态文件 | 用户头像 |
| `/newsuploads/*` | Express 静态文件 | 新闻封面图 |

### 身份认证

- 使用 JWT，有效期 1 小时，每次请求自动续期
- 请求头：`Authorization: Bearer <token>`
- 以下接口无需登录即可访问：
  - `POST /adminApi/user/login`
  - `POST /webApi/user/login`
  - `POST /webApi/user/register`
  - `GET /webApi/news/list`、`/webApi/news/detail`
  - `GET /webApi/job/list`、`/webApi/job/detail`

### AI 服务接口

| 方法 | 路径 | 说明 |
|------|------|------|
| `POST` | `/api/ai/chat` | 与 AI 助手对话 |
| `POST` | `/api/ai/embed` | 向向量数据库添加文档 |
| `PUT` | `/api/ai/document/{type}/{id}` | 更新向量数据库中的文档 |
| `DELETE` | `/api/ai/document/{type}/{id}` | 删除向量数据库中的文档 |
| `GET` | `/health` | 健康检查 |

## AI 服务说明

AI 服务采用 **RAG（检索增强生成）** 架构：

1. 用户提问 → ChromaDB 向量检索（余弦相似度，返回 Top 3 结果）
2. 检索结果作为上下文注入 Prompt
3. Qwen 模型生成最终回答

向量数据库存储路径：`ai_service/chroma_db/`，集合名称：`employment_knowledge`。  
文档 ID 格式：`{类型}_{ID}`，例如 `job_1`、`news_5`。

## 文件上传

- 用户头像：上传至 `server/public/avataruploads/`
- 新闻封面图：上传至 `server/public/newsuploads/`
- 文件服务通过 Express 静态中间件对外提供访问
