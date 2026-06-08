// 全局数据存储
let stateStore = {};
let stateMutex = {};
let skillHub = [];

// HTML 页面内容
const htmlPage = `<!DOCTYPE html>
<html>
<head><title>Cloud AI Hub</title>
<style>
  body { background: #1a1a1a; color: #00ff9d; font-family: monospace; padding: 20px; }
  .card { background: #000; border: 1px solid #333; padding: 20px; margin: 20px 0; }
  button { background: #00ff9d; color: #000; border: none; padding: 10px 20px; cursor: pointer; margin: 5px; }
</style>
</head>
<body>
  <h1>🤖 Cloud AI Hub Dashboard</h1>
  <div class="card">
    <h3>📊 State Status</h3>
    <div id="state">Empty</div>
    <button onclick="updateState()">Update State</button>
  </div>
  <div class="card">
    <h3>🧬 Evolution Logs</h3>
    <div id="logs"></div>
    <button onclick="evolve()">Trigger Evolution</button>
  </div>
  <div class="card">
    <h3>📦 Deployed Skills</h3>
    <div id="skills"></div>
  </div>
  <script>
    async function updateState(){
      const res = await fetch('/api/v1/state/test-001/update', {method:'POST', body:'"updated"'});
      document.getElementById('state').innerText = await res.text();
    }
    async function evolve(){
      const r = await fetch('/api/v1/skills/evolve', {method:'POST'});
      const d = await r.json();
      document.getElementById('logs').innerText = JSON.stringify(d, null, 2);
      refreshSkills();
    }
    async function refreshSkills(){
      const r = await fetch('/api/v1/skills');
      document.getElementById('skills').innerText = JSON.stringify(await r.json(), null, 2);
    }
    refreshSkills();
  </script>
</body>
</html>`;

// Cloudflare Workers 核心：监听 fetch 事件
export default {
  async fetch(request) {
    const url = new URL(request.url);
    
    // 主页面
    if (url.pathname === '/' && request.method === 'GET') {
      return new Response(htmlPage, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // 状态更新 API
    if (url.pathname === '/api/v1/state/test-001/update' && request.method === 'POST') {
      if (stateMutex['test-001']) {
        return new Response('State is currently being updated', { status: 409 });
      }
      stateMutex['test-001'] = true;
      setTimeout(() => delete stateMutex['test-001'], 1000);
      stateStore['test-001'] = {
        task_id: 'test-001',
        status: 'updated',
        context: { updated_at: new Date().toISOString() }
      };
      return new Response('State updated for task test-001', { status: 200 });
    }
    
    // 技能进化 API
    if (url.pathname === '/api/v1/skills/evolve' && request.method === 'POST') {
      const skill = {
        name: `auto_gen_skill_${Date.now()}`,
        created_at: new Date().toISOString(),
        triggered_at: new Date().toISOString()
      };
      skillHub.push(skill);
      return new Response(JSON.stringify({ success: true, skill }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 技能列表 API
    if (url.pathname === '/api/v1/skills' && request.method === 'GET') {
      return new Response(JSON.stringify(skillHub), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 404
    return new Response('Not Found', { status: 404 });
  }
};
