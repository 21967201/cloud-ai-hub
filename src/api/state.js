// Cloudflare Pages Function: /api/state

export async function POST({ request }) {
  const body = await request.json();
  
  // 在 Pages Functions 中，使用 KV 存储来持久化数据
  // 这里我们返回一个模拟的成功响应
  return new Response(JSON.stringify({
    success: true,
    message: `State updated for task: ${body.task_id || 'unknown'}`,
    timestamp: new Date().toISOString()
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}