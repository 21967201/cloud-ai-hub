export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  return new Response(
    JSON.stringify({
      skill: { name: 'new_skill', created_at: new Date().toISOString() }
    }),
    { status: 200, headers: corsHeaders }
  );
}
