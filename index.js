// Cloud AI Hub - 纯前端版本，直接部署为静态站点

let stateStore = {};
let stateMutex = {};
let skillHub = [];

function updateStateInMemory() {
  if (stateMutex['test-001']) return;
  stateMutex['test-001'] = true;
  stateStore['test-001'] = {
    task_id: 'test-001',
    status: 'updated',
    context: { updated_at: new Date().toISOString() }
  };
  setTimeout(() => delete stateMutex['test-001'], 1000);
}

function evolveSkill() {
  const skill = {
    name: `auto_gen_skill_${Date.now()}`,
    created_at: new Date().toISOString(),
    triggered_at: new Date().toISOString()
  };
  skillHub.push(skill);
  return skill;
}

function renderPage() {
  document.getElementById('state').innerText = JSON.stringify(stateStore['test-001'] || { status: 'empty' }, null, 2);
  document.getElementById('skills').innerText = JSON.stringify(skillHub, null, 2);
}

async function updateState() {
  try {
    const response = await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: 'test-001', status: 'updating' })
    });
    const data = await response.json();
    updateStateInMemory();
    renderPage();
    alert('状态已更新: ' + data.message);
  } catch (e) {
    alert('请求失败: ' + e.message);
  }
}

async function evolve() {
  try {
    const response = await fetch('/api/evolve', {
      method: 'POST'
    });
    const data = await response.json();
    if (data.success) {
      evolveSkill();
      renderPage();
      document.getElementById('logs').innerText = JSON.stringify(data.skill, null, 2);
    }
  } catch (e) {
    alert('请求失败: ' + e.message);
  }
}

function refreshSkills() {
  renderPage();
}

// 页面加载时渲染
document.addEventListener('DOMContentLoaded', function() {
  renderPage();
});