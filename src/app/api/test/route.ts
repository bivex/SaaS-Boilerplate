/**
 * Copyright (c) 2025 Bivex
 *
 * Author: Bivex
 * Available for contact via email: support@b-b.top
 * For up-to-date contact information:
 * https://github.com/bivex
 *
 * Created: 2025-12-23T21:00:19
 * Last Updated: 2025-12-23T21:00:19
 *
 * Licensed under the MIT License.
 * Commercial licensing available upon request.
 */

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
