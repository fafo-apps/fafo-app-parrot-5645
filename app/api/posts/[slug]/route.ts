import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/app/utils/pool';

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const { searchParams } = new URL(req.url);
    const includeDraft = searchParams.get('includeDraft') === 'true';

    const result = await pool.query(
      `SELECT id, title, slug, content, cover_image_url, location, trip_date, status, created_at
       FROM posts
       WHERE slug = $1 AND (status = 'published' OR $2::boolean = true)
       LIMIT 1`,
      [slug, includeDraft]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: result.rows[0] });
  } catch (err) {
    console.error('GET /api/posts/[slug] error', err);
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const body = await req.json();
    const { title, content, cover_image_url, location, trip_date, status } = body || {};

    const result = await pool.query(
      `UPDATE posts SET
         title = COALESCE($1, title),
         content = COALESCE($2, content),
         cover_image_url = COALESCE($3, cover_image_url),
         location = COALESCE($4, location),
         trip_date = COALESCE($5, trip_date),
         status = COALESCE($6, status),
         updated_at = now()
       WHERE slug = $7
       RETURNING id, title, slug, content, cover_image_url, location, trip_date, status, created_at` ,
      [title ?? null, content ?? null, cover_image_url ?? null, location ?? null, trip_date ?? null, status ?? null, slug]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ data: result.rows[0] });
  } catch (err) {
    console.error('PUT /api/posts/[slug] error', err);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const result = await pool.query('DELETE FROM posts WHERE slug = $1 RETURNING slug', [slug]);
    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/posts/[slug] error', err);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
