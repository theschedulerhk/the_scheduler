'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../utils/supabase';

export default function HomePage() {
  const [applications, setApplications] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');

  // --- RUNS AUTOMATICALLY ON PAGE LOAD & TYPING ---
  useEffect(() => {
    async function fetchDatabaseData() {
      let query = supabase.from('application').select('*');
      
      if (searchTerm) {
        query = query.ilike('project_name', `%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (!error && data) {
        setApplications(data); 
      }
    }
    fetchDatabaseData();
  }, [searchTerm]); 

  return (
    <div class="space-y-12 pb-20">
      
      {/* --- FLOATING STICKY WHATSAPP BUTTON --- */}
      <a 
        href="https://wa.me" 
        target="_blank" 
        rel="noopener noreferrer"
        class="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#20ba56] hover:scale-105 transition-all flex items-center gap-2 font-bold text-sm tracking-wide"
      >
        <span class="text-xl">💬</span> Contact Us
      </a>

      {/* --- HERO BANNER & SEARCH ENGINES --- */}
      <section class="max-w-6xl mx-auto px-4 pt-12">
        <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-white shadow-xl space-y-6 relative overflow-hidden">
          <div class="max-w-xl space-y-2 relative z-10">
            <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">Find Your Next First-Hand Property</h1>
            <p class="text-slate-300 text-base">Track live presale consent applications, upcoming launches, and visual architectural profiles instantly.</p>
          </div>
          
          {/* Interactive Search Bar Input */}
          <div class="max-w-xl relative group z-10">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 text-lg">🔍</div>
            <input 
              type="text" 
              placeholder="Search projects by database name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              class="w-full pl-11 pr-4 py-3.5 bg-white text-slate-900 border-none rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-base placeholder-slate-400"
            />
          </div>
        </div>
      </section>

      {/* --- PHOTO GRID GALLERY SECTION (EACH LINKS TO OWN PAGE) --- */}
      <section class="max-w-6xl mx-auto px-4 space-y-4">
        <div class="border-b border-slate-200 pb-3">
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Explore Upcoming Blueprints</h2>
          <p class="text-sm text-slate-500">Click any estate block display thumbnail to explore individual allocation metrics.</p>
        </div>
        
        {/* Responsive Flex Grid Layout */}
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          {/* Photo Project 1 */}
          <Link href="/properties/pinnacle-crest" class="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
            <div class="w-full aspect-[16/10] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl group-hover:scale-[1.01] transition-transform">
              🏙️
            </div>
            <div class="p-4 space-y-1">
              <span class="text-[10px] font-bold tracking-widest text-blue-600 uppercase">Kai Tak District</span>
              <h4 class="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">The Pinnacle Crest Layout</h4>
              <p class="text-xs text-slate-400 font-medium">Click to analyze full interior specifications ➔</p>
            </div>
          </Link>
          
          {/* Photo Project 2 */}
          <Link href="/properties/marina-bay" class="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
            <div class="w-full aspect-[16/10] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-5xl group-hover:scale-[1.01] transition-transform">
              🏖️
            </div>
            <div class="p-4 space-y-1">
              <span class="text-[10px] font-bold tracking-widest text-emerald-600 uppercase">Tsing Yi Waterfront</span>
              <h4 class="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">Marina Bay Masterplan</h4>
              <p class="text-xs text-slate-400 font-medium">Click to analyze full interior specifications ➔</p>
            </div>
          </Link>

        </div>
      </section>

    </div>
  );
}
