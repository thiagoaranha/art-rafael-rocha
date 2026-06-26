-- Database initialization script for Rafael Rocha art portfolio
-- Run this once after setting up Netlify Database (netlify db init)
-- Command: netlify db query < db/init.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS artworks (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT        NOT NULL,
  technique     TEXT        NOT NULL,
  year          INTEGER     NOT NULL,
  dimensions    TEXT        NOT NULL,
  price_info    TEXT        NOT NULL DEFAULT 'Valores sob consulta',
  description   TEXT,
  images        TEXT[]      NOT NULL DEFAULT '{}',
  is_available  BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index to speed up the public listing query (newest first)
CREATE INDEX IF NOT EXISTS artworks_created_at_idx ON artworks (created_at DESC);

-- Seed: insert two placeholder artworks for initial testing
INSERT INTO artworks (title, technique, year, dimensions, price_info, images, is_available) VALUES
(
  'Ancestralidade Urbana',
  'Acrílica sobre tela',
  2024,
  '100 x 140 cm',
  'Valores sob consulta',
  ARRAY[
    'https://res.cloudinary.com/ddfx20xgi/image/upload/v1782403591/WhatsApp_Image_2026-06-25_at_13.05.35_1_zjxvqi.jpg',
    'https://res.cloudinary.com/ddfx20xgi/image/upload/v1782403817/WhatsApp_Image_2026-06-25_at_13.05.35_ghyrzi.jpg',
    'https://res.cloudinary.com/ddfx20xgi/image/upload/v1782403817/WhatsApp_Image_2026-06-25_at_13.05.34_m0drgc.jpg'
  ],
  TRUE
),
(
  'Festa do Interior',
  'Técnica mista',
  2023,
  '80 x 120 cm',
  'Valores sob consulta',
  ARRAY[
    'https://res.cloudinary.com/ddfx20xgi/image/upload/v1782403591/WhatsApp_Image_2026-06-25_at_13.05.35_1_zjxvqi.jpg',
    'https://res.cloudinary.com/ddfx20xgi/image/upload/v1782403817/WhatsApp_Image_2026-06-25_at_13.05.35_ghyrzi.jpg',
    'https://res.cloudinary.com/ddfx20xgi/image/upload/v1782403817/WhatsApp_Image_2026-06-25_at_13.05.34_m0drgc.jpg'
  ],
  TRUE
);
