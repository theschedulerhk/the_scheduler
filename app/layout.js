'use client';
import './globals.css';
import Link from 'next/link';
import { useState, cloneElement, Children } from 'react';
import { translations } from '../utils/translations'; 

export default function RootLayout({ children }) {
  const [lang, setLang] = useState('en'); // Holds active key string: 'en', 'zh_hk', or 'zh_cn'

  return (
    <html lang={lang}>
      <body class="bg-slate-50 text-slate-800 font-sans antialiased min-h-screen relative">
        
        {/* --- STICKY NAVIGATION BAR --- */}
        <header class="sticky top-0 z-40 bg-white/95 border-b border-slate-200/80 backdrop-blur-md">
          <nav class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" class="flex items-center gap-2 font-black text-xl text-blue-600 tracking-tight">
              <span>🏢</span> {translations.brand[lang]} {/* ◄ New key target access format */}
            </Link>
            
            <div class="flex items-center gap-6 font-semibold text-sm">
              <Link href="/properties" class="text-slate-600 hover:text-blue-600 transition-colors">
                {translations.navProperties[lang]}
              </Link>
              <Link href="/calculator" class="text-slate-600 hover:text-blue-600 transition-colors">
                {translations.navCalculator[lang]}
              </Link>
              
              {/* --- CONTROL BUTTON CLUSTER --- */}
              <div class="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold shadow-inner">
                <button 
                  onClick={() => setLang('zh_hk')} 
                  class={`px-2 py-1 rounded-md transition-all ${lang === 'zh_hk' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  繁
                </button>
                <button 
                  onClick={() => setLang('zh_cn')} 
                  class={`px-2 py-1 rounded-md transition-all ${lang === 'zh_cn' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  简
                </button>
                <button 
                  onClick={() => setLang('en')} 
                  class={`px-2 py-1 rounded-md transition-all ${lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  ENG
                </button>
              </div>

              <Link href="/login" class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm text-xs">
                {translations.navLogin[lang]}
              </Link>
            </div>
          </nav>
        </header>

        {/* --- MAIN PAGE CONTENT WRAPPER --- */}
        <main>
          {Children.map(children, child => cloneElement(child, { lang }))}
        </main>

        <footer class="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
          <div class="text-center py-6 text-xs text-slate-500">
            &copy; 2026 {translations.brand[lang]}. All Rights Reserved. Hosted via Cloudflare Global Edge Network.
          </div>
        </footer>

      </body>
    </html>
  );
}
