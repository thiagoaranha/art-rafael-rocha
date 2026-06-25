/**
 * Protected API endpoint: /api/auth
 *
 * POST /api/auth  — Validates the admin password and returns a session token.
 *
 * The ADMIN_PASSWORD and API_TOKEN environment variables must be configured
 * in the Netlify dashboard under Site Configuration → Environment Variables.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return new Response(JSON.stringify({ error: 'Password is required' }), {
        status: 400,
        headers: CORS_HEADERS,
      });
    }

    const isPasswordValid = password === process.env.ADMIN_PASSWORD;

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401,
        headers: CORS_HEADERS,
      });
    }

    // Return the API token used to authorize write operations
    return new Response(JSON.stringify({ token: process.env.API_TOKEN }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error('[auth] Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};

export const config = {
  path: '/api/auth',
};
