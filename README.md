# Cloud AI Hub - Workers AI Chat App

Cloud-First AI Skill Distribution & Orchestration Hub

## 功能
- Workers AI 聊天
- AI 技能进化
- 状态管理

## 部署
1. 设置环境变量：
   - `AI_TOKEN`: Workers AI Token
   - `ACCOUNT_ID`: Cloudflare Account ID
   
2. 部署到 Cloudflare Workers:
   ```bash
   wrangler deploy
   ```

3. 测试聊天功能:
   ```bash
   curl -X POST http://localhost:8787/api/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello"}'
   ```