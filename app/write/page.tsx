'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cover, setCover] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          cover_image_url: cover || undefined,
          location: location || undefined,
          trip_date: date || undefined,
          status,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to create post');
      const slug = json.data?.slug;
      router.push(`/posts/${slug}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <main className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight">Write a Post</h1>
        <p className="mt-2 text-sm text-zinc-600">Add a story from your Yemen trip. You can save as draft or publish immediately.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {error && <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-zinc-700">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900" placeholder="Old City of Sana'a at Dawn" />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Story</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={8} className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900" placeholder="Share highlights, impressions, and tips..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Cover Image URL</label>
            <input value={cover} onChange={(e) => setCover(e.target.value)} className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900" placeholder="https://images.unsplash.com/..." />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900" placeholder="Sana'a, Yemen" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Trip Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-zinc-900">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button type="submit" disabled={submitting} className="rounded-full bg-zinc-900 px-5 py-2.5 text-white hover:bg-zinc-800 disabled:opacity-50">{submitting ? 'Saving…' : 'Save Post'}</button>
            <button type="button" onClick={() => router.push('/')} className="rounded-full border border-zinc-300 px-5 py-2.5 text-zinc-700 hover:bg-zinc-50">Cancel</button>
          </div>
        </form>
      </main>
    </div>
  );
}
