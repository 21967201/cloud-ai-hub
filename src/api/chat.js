const AI_TOKEN = 'your_ai_token_here'; // 替换为实际的 Workers AI Token
const ACCOUNT_ID = 'your_account_id_here'; // 替换为实际的 Account ID

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS 处理
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }
    
    // 路由处理
    if (url.pathname === '/api/chat' && request.method === 'POST') {
      return handleChat(request, env);
    } else if (url.pathname === '/api/state' && request.method === 'POST') {
      return handleState(request);
    } else if (url.pathname === '/api/evolve' && request.method === 'POST') {
      return handleEvolve();
    }
    
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers }
    );
  }
};

async function handleChat(request, env) {
  const body = await request.json();
  const { message, history = [] } = body;
  
  if (!message || typeof message !== 'string') {
    return new Response(
      JSON.stringify({ error: 'Invalid message' }),
      { status: 400 }
    );
  }
  
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...history, { role: 'user', content: message }]
        })
      }
    );
    
    const data = await response.json();
    const fullHistory = [...history, { role: 'user', content: message }];
    
    if (data.result && data.result.response) {
      fullHistory.push({ role: 'assistant', content: data.result.response });
    }
    
    return new Response(
      JSON.stringify({
        message: data.result?.response || 'No response',
        history: fullHistory
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'AI API error: ' + error.message }),
      { status: 500 }
    );
  }
}

async function handleState(request) {
  const body = await request.json();
  return new Response(
    JSON.stringify({ message: 'State updated', ...body }),
    { status: 200 }
  );
}

async function handleEvolve() {
  return new Response(
    JSON.stringify({
      skill: { name: 'new_skill', created_at: new Date().toISOString() }
    }),
    { status: 200 }
  );
}