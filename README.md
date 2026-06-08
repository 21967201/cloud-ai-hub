# 🤖 Cloud AI Hub

**Cloud-First AI Skill Distribution & Orchestration Hub**

## 🚀 Features

- 📊 Real-time Dashboard
- 🧬 AI Skill Evolution System
- 📦 Skill Management & Deployment
- ⚡ Lightning-fast State Management
- 🔄 Auto-scaling Ready

## 📋 Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Server will run on `http://localhost:8788`

## 🔗 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Dashboard UI |
| `/api/v1/state/test-001/update` | POST | Update state |
| `/api/v1/skills/evolve` | POST | Trigger skill evolution |
| `/api/v1/skills` | GET | List all skills |

## 🌐 Deployment

### Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Use these settings:
   - **Build Command:** Leave empty
   - **Output Directory:** Leave empty
   - **Install Command:** `npm install`

4. Deploy!

## 📝 License

MIT
