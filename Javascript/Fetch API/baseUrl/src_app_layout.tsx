import React from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'API Base URL Management Example',
  description: 'An example of managing API base URLs in a Next.js application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-blue-500 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Link href="/" className="text-white text-2xl font-bold">My App</Link>
            <ul className="flex space-x-4">
              <li>
                <Link href="/" className="text-white hover:underline">Home</Link>
              </li>
              <li>
                <Link href="/posts" className="text-white hover:underline">Posts</Link>
              </li>
            </ul>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}

