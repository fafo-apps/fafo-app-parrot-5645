import Link from 'next/link';
import { getBaseUrl } from '@/app/utils/baseUrl';

async function getPosts() {
  const res = await fetch(`${getBaseUrl()}/api/posts`, { next: { revalidate: 60 } });
  if (!res.ok) return [] as any[];
  const json = await res.json();
  return json.data || [];
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <section className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Yemen Travel Blog</h1>
          <p className="mt-2 text-zinc-600">Follow your journey through Yemen with stories, photos, and memorable places.</p>
        </section>

        {posts.length === 0 ? (
          <div className="rounded-lg border border-zinc-200 p-6 text-zinc-600">No posts yet. Start by creating your first entry on the Write page.</div>
        ) : (
          <ul className="grid gap-6">
            {posts.map((p: any) => (
              <li key={p.slug} className="rounded-xl border border-zinc-200 p-5 hover:shadow-sm transition-shadow">
                <Link href={`/posts/${p.slug}`} className="block">
                  {p.cover_image_url && (
                    // Using img tag for simplicity with external URLs
                    <img src={p.cover_image_url} alt={p.title} className="mb-4 h-56 w-full rounded-lg object-cover" />
                  )}
                  <h2 className="text-xl font-medium">{p.title}</h2>
                  <div className="mt-1 text-sm text-zinc-500">
                    {p.location ? <span>{p.location}</span> : null}
                    {p.trip_date ? <span>{p.location ? ' • ' : ''}{new Date(p.trip_date).toLocaleDateString()}</span> : null}
                  </div>
                  <p className="mt-3 line-clamp-2 text-zinc-600">{p.content?.slice(0, 160)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
