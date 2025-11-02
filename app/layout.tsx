import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from 'next/link';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yemen Travel Blog",
  description: "Share your journey across Yemen with stories, photos, and tips.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900`}>
        <header className="border-b border-zinc-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="font-semibold tracking-tight">Yemen Travel Blog</Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/" className="text-zinc-700 hover:text-black">Home</Link>
              <Link href="/write" className="rounded-full bg-zinc-900 px-3 py-1.5 text-white hover:bg-zinc-800">Write</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
