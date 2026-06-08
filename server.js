const { createServer } = require('http');

// 全局数据存储（运行时内存存储）
let stateStore = {};
let stateMutex = {};
let skillHub = [];

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // === 主页面 (Dashboard) ===
  if (url.pathname === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<head><title>Cloud AI Hub</title>
<style>
  body { background: #1a1a1a; color: #00ff9d; font-family: monospace; padding: 20px; }
  .card { background: #000; border: 1px solid #333; padding: 20px; margin: 20px 0; }
  button { background: #00ff9d; color: #000; border: none; padding: 10px 20px; cursor: pointer; margin: 5px; }
  .success { color: #00ff9d; }
  .error { color: #ff4444; }
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
</html>`);
    return;
  }
  
  // === 状态更新 API ===
  if (url.pathname === '/api/v1/state/test-001/update' && req.method === 'POST') {
    if (stateMutex['test-001']) {
      res.writeHead(409, { 'Content-Type': 'text/plain' });
      res.end('State is currently being updated');
      return;
    }
    stateMutex['test-001'] = true;
    setTimeout(() => delete stateMutex['test-001'], 1000);
    stateStore['test-001'] = {
      task_id: 'test-001',
      status: 'updated',
      context: { updated_at: new Date().toISOString() }
    };
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('State updated for task test-001');
    return;
  }
  
  // === 技能进化 API ===
  if (url.pathname === '/api/v1/skills/evolve' && req.method === 'POST') {
    const skill = {
      name: `auto_gen_skill_${Date.now()}`,
      created_at: new Date().toISOString(),
      triggered_at: new Date().toISOString()
    };
    skillHub.push(skill);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, skill }));
    return;
  }
  
  // === 技能列表 API ===
  if (url.pathname === '/api/v1/skills' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(skillHub));
    return;
  }
  
  // === 404 ===
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

const PORT = process.env.PORT || 8788;
server.listen(PORT, () => {
  console.log(`🚀 Cloud AI Hub is running on :${PORT}`);
});
