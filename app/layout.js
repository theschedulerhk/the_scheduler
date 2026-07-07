import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body class="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen relative">
        
        {/* --- STICKY NAVIGATION BAR --- */}
        <header class="sticky top-0 z-40 bg-white/95 border-b border-slate-200/80 backdrop-blur-md">
          <nav class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo Brand Link */}
            <Link href="/" class="flex items-center gap-2 font-black text-xl text-blue-600 tracking-tight">
              <span>🏢</span> EstateFlow
            </Link>
            
            {/* Functional Menu Buttons */}
            <div class="flex items-center gap-6 font-semibold text-sm">
              <Link href="/properties" class="text-slate-600 hover:text-blue-600 transition-colors">
                Properties Available
              </Link>
              <Link href="/calculator" class="text-slate-600 hover:text-blue-600 transition-colors">
                Mortgage Calculation
              </Link>
              <Link href="/login" class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm text-xs">
                Login / Register
              </Link>
            </div>
          </nav>
        </header>

        {/* --- MAIN PAGE CONTAINER --- */}
        <main>
          {children}
        </main>

        {/* --- STANDARD CORPORATE FOOTER --- */}
        <footer class="bg-slate-900 text-slate-400 border-t border-slate-800">
          <div class="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div class="space-y-3">
              <h4 class="text-white font-bold text-base tracking-tight">🏢 EstateFlow Platform</h4>
              <p class="text-slate-400 leading-relaxed text-xs">A professional real estate tracking pipeline optimized for first-hand residential project data allocations.</p>
            </div>
            <div class="space-y-2">
              <h4 class="text-white font-bold text-xs uppercase tracking-wider">Quick Links</h4>
              <div class="flex flex-col gap-1.5 text-xs">
                <Link href="/properties" class="hover:text-white transition-colors">Properties Available</Link>
                <Link href="/calculator" class="hover:text-white transition-colors">Mortgage Calculator</Link>
                <Link href="/admin" class="hover:text-white transition-colors">Admin Area</Link>
              </div>
            </div>
            <div class="space-y-2">
              <h4 class="text-white font-bold text-xs uppercase tracking-wider">Disclaimer</h4>
              <p class="text-slate-500 text-xs leading-relaxed">All mock parameters shown are for software development demonstration exercises. Always cross-verify formal boundaries before final execution.</p>
            </div>
          </div>
          <div class="border-t border-slate-800 text-center py-6 text-xs text-slate-500">
            &copy; 2026 EstateFlow. All Rights Reserved. Hosted via Cloudflare Global Edge Network.
          </div>
        </footer>

      </body>
    </html>
  );
}
