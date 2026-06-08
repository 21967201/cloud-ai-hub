export async function onRequestPost(context) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  try {
    const body = await context.request.json();
    return new Response(
      JSON.stringify({ message: 'State updated', ...body }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}
