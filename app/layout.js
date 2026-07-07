import Link from 'next/link'; // ◄ 1. Add this import at the very top
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body class="bg-slate-50 text-slate-800 antialiased min-h-screen">
        <header class="sticky top-0 z-50 bg-white/90 border-b border-slate-200/80 backdrop-blur-md">
          <nav class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* 2. Change <a> tags to <Link href="..."> */}
            <Link href="/" class="flex items-center gap-2 font-bold text-lg text-blue-600 tracking-tight hover:opacity-90">
              <span>🏬</span> OrderFlow
            </Link>
            <div class="flex items-center gap-6 font-medium text-sm text-slate-600">
              <Link href="/" class="hover:text-blue-600 transition-colors">Search Store</Link>
              <Link href="/tracking" class="hover:text-blue-600 transition-colors">Track Orders</Link>
              <Link href="/login" class="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-xs shadow-sm">
                Account Portal
              </Link>
            </div>
          </nav>
        </header>

        <main class="max-w-5xl mx-auto px-4 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
