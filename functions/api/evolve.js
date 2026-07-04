export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const SKILL_ROUTES = {
      '1688运营': ['1688-operation', 'research-engine'],
      'AI资讯': ['aihot'],
      '数据分析': ['excel-xlsx', 'research-engine'],
      '代码开发': ['ai-expert', 'llm-learning'],
      '文档写作': ['content-writer', 'ima-report'],
      '知识管理': ['ima-knowledge', 'kb-synthesizer'],
      '图像生成': ['image-gen', 'text-to-svg'],
      '技术调研': ['industry-analysis', 'industry-research'],
      '自我进化': ['self-improving', 'proactive-agent'],
      '复杂编排': ['agent-orchestrator'],
    };

    const body = await context.request.json().catch(() => ({}));
    const taskType = body.task_type || '通用';

    const matchedSkills = [];
    for (const [keyword, skills] of Object.entries(SKILL_ROUTES)) {
      if (taskType.includes(keyword) || keyword.includes(taskType)) {
        matchedSkills.push(...skills);
      }
    }

    const activeSkills = matchedSkills.length > 0
      ? [...new Set(matchedSkills)].slice(0, 3)
      : ['general-tools'];

    const prompt = `基于任务类型"${taskType}"，生成一个优化的技能配置。活跃技能: ${activeSkills.join(', ')}。简述优化建议。`;

    const answer = await context.env.AI.run(
      '@cf/deepseek-ai/deepseek-r1-distill-qwen-32b',
      { messages: [{ role: 'user', content: prompt }] }
    );

    return new Response(JSON.stringify({
      success: true,
      skill: {
        name: `evolved_${taskType}_${Date.now()}`,
        task_type: taskType,
        active_skills: activeSkills,
        ai_suggestion: answer.response || 'Evolved successfully',
        created_at: new Date().toISOString()
      }
    }), { status: 200, headers: corsHeaders });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Evolve error: ' + error.message }),
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
