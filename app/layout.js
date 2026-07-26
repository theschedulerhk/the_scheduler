'use client';
import './globals.css';
import Link from 'next/link';
import { useState, useEffect, cloneElement, Children } from 'react';
import { supabase } from '../utils/supabase';
import { translations } from '../utils/translations';

export default function RootLayout({ children }) {
  // --- STATE FOR GLOBAL SYSTEM ---
  const [lang, setLang] = useState('en'); 
  const [userSession, setUserSession] = useState(null);
  const [userRole, setUserRole] = useState(null); // Tracks 'buyer' or 'agent'
  const [displayEmail, setDisplayEmail] = useState('');

  // --- AUTOMATIC SESSION LIFECYCLE SENSOR ---
  useEffect(() => {
    async function checkActiveUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserSession(user);
        // Safely extract role parameters from our registration metadata box
        const roleMeta = user.user_metadata?.role || 'buyer';
        const cleanEmail = user.user_metadata?.display_email || user.email;
        
        setUserRole(roleMeta);
        setDisplayEmail(cleanEmail);
      } else {
        setUserSession(null);
        setUserRole(null);
        setDisplayEmail('');
      }
    }
    
    checkActiveUser();

    // Listen continuously for instant login/logout auth actions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserSession(session.user);
        setUserRole(session.user.user_metadata?.role || 'buyer');
        setDisplayEmail(session.user.user_metadata?.display_email || session.user.email);
      } else {
        setUserSession(null);
        setUserRole(null);
        setDisplayEmail('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Action: Global sign out function execution trigger
  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.href = '/login'; // Redirect cleanly to trigger memory wipe
  }

  return (
    <html lang={lang}>
      {/* 
        DYNMIC INTEGRATED COLOR SKIN MECHANICS:
        - Guest/Unlogged -> Standard neutral borders 
        - Buyer          -> Deepened left blue security border trim
        - Agent          -> Deepened left emerald operational racing trim
      */}
      <body class={`bg-slate-50 text-slate-800 font-sans antialiased min-h-screen relative transition-all duration-300 ${
        userRole === 'buyer' ? 'border-l-4 border-blue-600' : userRole === 'agent' ? 'border-l-4 border-emerald-500' : ''
      }`}>
        
        {/* --- DYNAMIC STATE LOGOUT ACCENT IDENTITY BANNER --- */}
        {userSession && (
          <div class={`w-full text-center py-1.5 px-4 text-[11px] font-black tracking-wider uppercase transition-colors shadow-inner flex items-center justify-center gap-2 ${
            userRole === 'buyer' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            <span>{userRole === 'buyer' ? '🛒 BUYER CONTROL PLATFORM' : '💼 REAL ESTATE AGENT INTERFACE'}</span>
            <span class="opacity-40">|</span>
            <span class="font-mono lowercase normal-case tracking-normal opacity-90">{displayEmail}</span>
          </div>
        )}

        {/* --- STICKY NAVIGATION HEADER BAR --- */}
        <header class="sticky top-0 z-40 bg-white/95 border-b border-slate-200/80 backdrop-blur-md shadow-sm">
          <nav class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            
            {/* Dynamic brand logo accent switch color matching role logic */}
            <Link href="/" class={`flex items-center gap-2 font-black text-xl tracking-tight transition-colors ${
              userRole === 'buyer' ? 'text-blue-600' : userRole === 'agent' ? 'text-emerald-600' : 'text-slate-900'
            }`}>
              <span>🏢</span> {translations.brand[lang]}
            </Link>
            
            {/* Functional Menu Connections List */}
            <div class="flex items-center gap-6 font-semibold text-sm">
              
              {/* Contextual navigation link rendering swaps based on who logged into the terminal */}
              {userRole === 'agent' ? (
                // Only agents see the Uber active ride pool board link option
                <Link href="/agent-board" class="text-slate-600 hover:text-emerald-600 transition-colors font-bold">
                  ⚡ {lang === 'en' ? "Match Board Lobby" : "搶單接單大堂"}
                </Link>
              ) : (
                // Buyers and guests see standard informational options layers
                <>
                  <Link href="/apply" class="text-slate-600 hover:text-blue-600 transition-colors">
                    {lang === 'en' ? "Apply Now" : "意向提交申請"}
                  </Link>
                  <Link href="/calculator" class="text-slate-600 hover:text-blue-600 transition-colors">
                    {translations.navCalculator[lang]}
                  </Link>
                </>
              )}

              {userSession && (
                <Link href="/tracking" class="text-slate-600 hover:text-blue-600 transition-colors">
                  {lang === 'en' ? "Track Status" : "進度置業條"}
                </Link>
              )}
              
              {/* Language Selection Tab Switches Block Container */}
              <div class="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-[10px] font-bold shadow-inner">
                <button onClick={() => setLang('zh_hk')} class={`px-2 py-0.5 rounded-md transition-all ${lang === 'zh_hk' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}>繁</button>
                <button onClick={() => setLang('en')} class={`px-2 py-0.5 rounded-md transition-all ${lang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}>ENG</button>
              </div>

              {/* --- CONDITIONALLY RENDERED AUTHENTICATION ENTRY SWITCH ACTION KEY --- */}
              {!userSession ? (
                <Link href="/login" class="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-sm text-xs">
                  {translations.navLogin[lang]}
                </Link>
              ) : (
                <button 
                  onClick={handleSignOut} 
                  class="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-sm text-xs font-bold"
                >
                  {lang === 'en' ? "Sign Out" : "登出帳戶"}
                </button>
              )}
            </div>

          </nav>
        </header>

        {/* --- MASTER CHILDREN COMPONENT SLOT HANDOVER --- */}
        <main class="py-4">
          {Children.map(children, child => cloneElement(child, { lang }))}
        </main>

      </body>
    </html>
  );
}
