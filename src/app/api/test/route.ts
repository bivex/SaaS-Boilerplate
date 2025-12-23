export async function GET() {
  return new Response('Test API works!', { status: 200 });
}

export async function POST(request: Request) {
  const body = await request.json();
  return new Response(JSON.stringify({ received: body }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
