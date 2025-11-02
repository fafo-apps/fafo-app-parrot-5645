import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBaseUrl } from '@/app/utils/baseUrl';

async function getPost(slug: string) {
  const res = await fetch(`${getBaseUrl()}/api/posts/${slug}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to load post');
  const json = await res.json();
  return json.data;
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700">← Back to posts</Link>
        <article className="mt-4">
          <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
          <div className="mt-2 text-sm text-zinc-500">
            {post.location ? <span>{post.location}</span> : null}
            {post.trip_date ? <span>{post.location ? ' • ' : ''}{new Date(post.trip_date).toLocaleDateString()}</span> : null}
          </div>
          {post.cover_image_url && (
            <img src={post.cover_image_url} alt={post.title} className="mt-6 w-full rounded-xl object-cover" />
          )}
          <div className="prose prose-zinc mt-6 max-w-none whitespace-pre-wrap leading-7">
            {post.content}
          </div>
        </article>
      </main>
    </div>
  );
}
