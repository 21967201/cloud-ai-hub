export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const body = await context.request.json();
    const { message, history = [] } = body;

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid message' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 使用 Workers AI Binding (env.AI.run) 调用模型
    const messages = [
      ...history,
      { role: 'user', content: message }
    ];

    const answer = await context.env.AI.run(
      '@cf/meta/llama-3.1-8b-instruct',
      { messages }
    );

    // 构建完整历史
    const fullHistory = [
      ...history,
      { role: 'user', content: message },
      { role: 'assistant', content: answer.response }
    ];

    return new Response(
      JSON.stringify({
        message: answer.response || 'No response',
        history: fullHistory
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'AI error: ' + error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
