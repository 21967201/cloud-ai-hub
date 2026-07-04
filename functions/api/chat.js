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

    const modelMap = {
      'llama-3.3': '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      'llama-4-scout': '@cf/meta/llama-4-scout-17b-16e-instruct',
      'deepseek-r1': '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
      'mistral-small': '@cf/mistralai/mistral-small-3.1-24b-instruct',
      'qwen3-30b': '@cf/qwen/qwen3-30b-a3b-fp8',
      'glm-5': '@cf/zai-org/glm-5.2',
    };
    const selectedModel = modelMap[body.model] || modelMap['llama-3.3'];

    const answer = await context.env.AI.run(
      selectedModel,
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
