let stateStore = {};
let skillHub = [];

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
    stateStore['test-001'] = {
      task_id: 'test-001',
      status: 'updated',
      context: { updated_at: new Date().toISOString() }
    };
    renderPage();
    document.getElementById('status').innerText = '✅ ' + data.message;
  } catch (e) {
    stateStore['test-001'] = {
      task_id: 'test-001',
      status: 'updated',
      context: { updated_at: new Date().toISOString() }
    };
    renderPage();
    document.getElementById('status').innerText = '✅ State updated (simulated)';
  }
}

async function evolve() {
  try {
    const response = await fetch('/api/evolve', { method: 'POST' });
    const data = await response.json();
    if (data.skill) {
      skillHub.push(data.skill);
      renderPage();
      document.getElementById('logs').innerText = JSON.stringify(data.skill, null, 2);
      document.getElementById('status').innerText = '✅ Skill evolved!';
    }
  } catch (e) {
    const skill = { name: 'simulated_skill', created_at: new Date().toISOString() };
    skillHub.push(skill);
    renderPage();
    document.getElementById('logs').innerText = JSON.stringify(skill, null, 2);
    document.getElementById('status').innerText = '✅ Skill evolved (simulated)';
  }
}

function refreshSkills() {
  renderPage();
}

document.addEventListener('DOMContentLoaded', function() {
  renderPage();
});