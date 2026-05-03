# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

就业服务平台 — a full-stack employment services platform with two frontends (admin + client), an Express backend, and an AI-powered RAG chatbot. Five sub-projects: `admin/`, `client/`, `server/`, `ai_service/`, `ai_tuning/`.

## Development Commands

```bash
# Admin frontend (admin/) — Vue 3 + Vite, port 5173
cd admin && npm install && npm run dev

# Client frontend (client/) — Vue 3 + Vite, port 5174
cd client && npm install && npm run dev

# Backend (server/) — Express.js via node-dev, port 3000
cd server && npm install && npm start

# AI Service (ai_service/) — FastAPI + ChromaDB, port 8000
cd ai_service && source venv/bin/activate && python main.py

# Database initialization (MySQL)
cd server && node init-database.js   # Runs init-db.sql

# AI fine-tuning (ai_tuning/)
cd ai_tuning && python train.py      # LoRA fine-tune Qwen-1.8B-Chat
cd ai_tuning && python merge_lora.py # Merge LoRA → merged_model/
```

Python 3.10 (`.python-version`). Node not pinned.

## Architecture

### Request Flow

```
Admin (5173) ──┐
               ├─ /adminApi/*  → Express (3000) → MySQL
               ├─ /webApi/*    → Express (3000) → MySQL
               ├─ /avataruploads/*, /newsuploads/* → Express static files
               └─ /api/*       → FastAPI (8000) → ChromaDB + Qwen

Client (5174) ─┘  (same proxy rules)
```

Both Vite dev servers proxy API requests to Express (3000) and FastAPI (8000). See `admin/vite.config.js` and `client/vite.config.js`.

### server/ — Express.js Backend

- **MVC**: `routes/` → `controllers/` → `services/` → `models/`
- **Route groups**: `/adminApi/*` (admin CRUD), `/webApi/*` (client-facing), `/api/*` (AI proxy)
- **Auth**: JWT (`middlewares/authMiddleware.js`) — all routes except `POST /adminApi/user/login`. Header: `Authorization: Bearer <token>`. Token refreshes on each request (1h expiry).
- **DB**: MySQL via `mysql2` pool (`server/db/db.js`). Database: `employment_platform`. Tables: `users`, `news`, `jobs`, `user_behaviors`, `favorites`.
- **Roles**: `users.role` — 0 = 毕业生 (student), 1 = 管理员 (admin)
- **Uploads**: `multer` → `public/avataruploads/` (avatars), `public/newsuploads/` (news covers)

### admin/ — Admin Frontend (Vue 3)

- Vue 3 + Vite + Element Plus + Pinia (persisted state)
- Dynamic routes injected in `router.beforeEach` guard (`router/index.js`). Routes from `router/config.js` wrapped in `Mainbox` layout. `requiresAdmin: true` routes only added for role=1.
- Pinia stores: `store/global.js` (router init flag), `store/userInfo.js` (user + token), `store/collapse.js` (sidebar)
- Views: Login, Home, Center (profile), user/news/job CRUD, NotFound

### client/ — Client Frontend (Vue 3)

- Same stack as admin, runs on port 5174
- Views: Home, Login, JobList, JobDetail, NewsList, NewsDetail, Favorites, Profile
- Has its own `ChatBot.vue` component (AI assistant floating widget)

### ai_service/ — Python AI Service (FastAPI)

- **RAG pipeline**: question → ChromaDB vector search (top 3, cosine) → context in prompt → Qwen model generates answer
- **Model**: LoRA-merged Qwen from `ai_tuning/merged_model/` (absolute path hardcoded in `main.py`)
- **Vector store**: ChromaDB at `ai_service/chroma_db/`, collection `employment_knowledge`
- **Endpoints**: `POST /api/ai/chat`, `POST /api/ai/embed`, `DELETE/PUT /api/ai/document/{type}/{id}`, `GET /health`

### ai_tuning/ — Model Fine-tuning

- LoRA fine-tuning on Qwen-1.8B-Chat with employment data (21 JSONL files)
- `train.py` → `lora_model/` → `merge_lora.py` → `merged_model/`
- Uses MPS acceleration on macOS

## Key Conventions

- **Language**: UI and comments in Chinese (中文).
- **AI document IDs**: `{doc_type}_{doc_id}` format in ChromaDB (e.g., `job_1`, `news_5`).
- **No linting or testing** configured in any sub-project.
- **UI design**: Use the `nothing-design` skill (`.claude/skills/frontend-design.md`) — avoid generic "AI look".
