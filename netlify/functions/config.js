/**
 * Public config endpoint: GET /api/config
 *
 * Returns non-sensitive public configuration values sourced from
 * Netlify environment variables. This allows changing settings like
 * the WhatsApp contact number without touching the source code.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json',
};

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  const config = {
    // Format: digits only, with country code — e.g. 558197098615
    // (55 = Brazil, 81 = Recife, then the 9-digit number)
    whatsappNumber: process.env.WHATSAPP_NUMBER ?? '',
  };

  return new Response(JSON.stringify(config), {
    status: 200,
    headers: CORS_HEADERS,
  });
};

export const config = {
  path: '/api/config',
};
