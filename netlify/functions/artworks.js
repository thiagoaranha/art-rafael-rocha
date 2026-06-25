/**
 * Public API endpoint: GET /api/artworks
 *
 * Returns all available artworks ordered by creation date (newest first).
 * No authentication required — this is the data source for the public site.
 */
import { neon } from '@neondatabase/serverless';

export default async (request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const artworks = await sql`
      SELECT id, title, technique, year, dimensions, price_info, images, is_available, created_at
      FROM artworks
      WHERE is_available = TRUE
      ORDER BY created_at DESC
    `;

    return new Response(JSON.stringify(artworks), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('[artworks] Database error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch artworks' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export const config = {
  path: '/api/artworks',
};
