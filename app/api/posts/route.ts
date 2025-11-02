import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/utils/pool';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || 'published';

    const result = await pool.query(
      `SELECT id, title, slug, content, cover_image_url, location, trip_date, status, created_at
       FROM posts
       WHERE ($1::text IS NULL OR status = $1)
       ORDER BY COALESCE(trip_date::timestamp, created_at) DESC, created_at DESC
       LIMIT 100`,
      [status]
    );

    return NextResponse.json({ data: result.rows });
  } catch (err) {
    console.error('GET /api/posts error', err);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, cover_image_url, location, trip_date, status } = body || {};

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    let baseSlug = slugify(title);
    if (!baseSlug) baseSlug = `post-${Date.now()}`;

    // Ensure unique slug by appending -2, -3, ... if needed
    let uniqueSlug = baseSlug;
    for (let i = 2; i < 1000; i++) {
      const check = await pool.query('SELECT 1 FROM posts WHERE slug = $1', [uniqueSlug]);
      if (check.rowCount === 0) break;
      uniqueSlug = `${baseSlug}-${i}`;
    }

    const insert = await pool.query(
      `INSERT INTO posts (title, slug, content, cover_image_url, location, trip_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'published'))
       RETURNING id, title, slug, content, cover_image_url, location, trip_date, status, created_at`,
      [
        title,
        uniqueSlug,
        content,
        cover_image_url || null,
        location || null,
        trip_date || null,
        status || null,
      ]
    );

    return NextResponse.json({ data: insert.rows[0] }, { status: 201 });
  } catch (err) {
    console.error('POST /api/posts error', err);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
