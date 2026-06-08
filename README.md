# Cloud AI Hub - Workers AI Chat

Cloud-First AI Skill Distribution & Orchestration Hub

## 功能
- ☁️ Workers AI 聊天 (Llama 3.1 8B)
- 🧬 AI 技能进化
- 📊 状态管理

## 部署步骤

### 1. Cloudflare Dashboard 配置 AI Binding
1. 进入 [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages)
2. 选择 `cloud-ai-hub` 项目
3. **Settings** > **Bindings** > **Add** > **Workers AI**
4. Variable name 填写: `AI`
5. 点击 Save
6. **Redeploy** 项目

### 2. 本地开发
```bash
npm run dev
```

## 架构
```
index.html          ← 前端聊天界面
functions/
  api/
    chat.js         ← Workers AI 聊天路由 (用 env.AI.run)
    state.js         ← 状态管理路由
    evolve.js        ← 技能进化路由
```

## 重要说明
- Pages Functions 使用 `functions/` 目录（不是 `src/api/`）
- AI 调用使用 `context.env.AI.run()` 绑定方式（不是 REST API）
- 必须在 Dashboard 中配置 Workers AI Binding 才能工作