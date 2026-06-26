/**
 * Protected Admin API endpoint: /api/artworks-admin
 *
 * All requests require the Authorization header:
 *   Authorization: Bearer <API_TOKEN>
 *
 * Supported methods:
 *   POST   — Create a new artwork
 *   PUT    — Update an existing artwork (requires ?id=<uuid> query param)
 *   DELETE — Delete an artwork (requires ?id=<uuid> query param)
 */
import { neon } from '@neondatabase/serverless';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

/**
 * Validates the Authorization Bearer token against the environment variable.
 * @param {Request} request
 * @returns {boolean}
 */
function isAuthorized(request) {
  const authHeader = request.headers.get('Authorization') ?? '';
  const token = authHeader.replace('Bearer ', '').trim();
  return token === process.env.API_TOKEN;
}

/**
 * Validates the required fields for creating or updating an artwork.
 * @param {object} body
 * @returns {{ valid: boolean, error?: string }}
 */
function validateArtworkBody(body) {
  const requiredFields = ['title', 'technique', 'year', 'dimensions'];
  for (const field of requiredFields) {
    if (!body[field]) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  if (!Array.isArray(body.images) || body.images.length === 0) {
    return { valid: false, error: 'At least one image URL is required' };
  }
  return { valid: true };
}

export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (!isAuthorized(request)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: CORS_HEADERS,
    });
  }

  const sql = neon(process.env.DATABASE_URL);
  const url = new URL(request.url);
  const artworkId = url.searchParams.get('id');

  try {
    // POST — Create a new artwork
    if (request.method === 'POST') {
      const body = await request.json();
      const validation = validateArtworkBody(body);

      if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.error }), {
          status: 400,
          headers: CORS_HEADERS,
        });
      }

      const [newArtwork] = await sql`
        INSERT INTO artworks (title, technique, year, dimensions, price_info, description, images, is_available)
        VALUES (
          ${body.title},
          ${body.technique},
          ${Number(body.year)},
          ${body.dimensions},
          ${body.price_info ?? 'Valores sob consulta'},
          ${body.description ?? null},
          ${body.images},
          ${body.is_available ?? true}
        )
        RETURNING *
      `;

      return new Response(JSON.stringify(newArtwork), {
        status: 201,
        headers: CORS_HEADERS,
      });
    }

    // PUT — Update an existing artwork
    if (request.method === 'PUT') {
      if (!artworkId) {
        return new Response(JSON.stringify({ error: 'Missing artwork id query parameter' }), {
          status: 400,
          headers: CORS_HEADERS,
        });
      }

      const body = await request.json();
      const validation = validateArtworkBody(body);

      if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.error }), {
          status: 400,
          headers: CORS_HEADERS,
        });
      }

      const [updated] = await sql`
        UPDATE artworks
        SET
          title        = ${body.title},
          technique    = ${body.technique},
          year         = ${Number(body.year)},
          dimensions   = ${body.dimensions},
          price_info   = ${body.price_info ?? 'Valores sob consulta'},
          description  = ${body.description ?? null},
          images       = ${body.images},
          is_available = ${body.is_available ?? true}
        WHERE id = ${artworkId}
        RETURNING *
      `;

      if (!updated) {
        return new Response(JSON.stringify({ error: 'Artwork not found' }), {
          status: 404,
          headers: CORS_HEADERS,
        });
      }

      return new Response(JSON.stringify(updated), {
        status: 200,
        headers: CORS_HEADERS,
      });
    }

    // DELETE — Remove an artwork
    if (request.method === 'DELETE') {
      if (!artworkId) {
        return new Response(JSON.stringify({ error: 'Missing artwork id query parameter' }), {
          status: 400,
          headers: CORS_HEADERS,
        });
      }

      const [deleted] = await sql`
        DELETE FROM artworks WHERE id = ${artworkId} RETURNING id
      `;

      if (!deleted) {
        return new Response(JSON.stringify({ error: 'Artwork not found' }), {
          status: 404,
          headers: CORS_HEADERS,
        });
      }

      return new Response(JSON.stringify({ success: true, id: deleted.id }), {
        status: 200,
        headers: CORS_HEADERS,
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  } catch (error) {
    console.error('[artworks-admin] Database error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: CORS_HEADERS,
    });
  }
};

export const config = {
  path: '/api/artworks-admin',
};
