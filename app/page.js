'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../utils/supabase';
import { translations } from '../utils/translations'; // ◄ Import restructured dictionary references

export default function HomePage({ lang = 'en' }) { // ◄ Captures active code state directly from layout shell
  const [applications, setApplications] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('on-sale');
  
  const getDbField = (item, baseFieldName) => {
    const localizedKey = `${baseFieldName}_${lang}`;
    return item[localizedKey] || item[`${baseFieldName}_en`] || item[baseFieldName] || '';
  };

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
      
      {/* --- WHATSAPP FLOATING BADGE BUTTON --- */}
      <a 
        href="https://wa.me" 
        target="_blank" 
        rel="noopener noreferrer"
        class="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#20ba56] transition-all flex items-center gap-2 font-bold text-sm tracking-wide"
      >
        <span class="text-xl">💬</span> {translations.whatsappBtn[lang]}
      </a>

      {/* --- CORE TAB SELECTION CODES --- */}
      <section class="space-y-4">
        {/* Tab Buttons Cluster Layout */}
        <div class="flex border-b border-slate-200 gap-2 overflow-x-auto scrollbar-none">
          <button 
            onClick={() => setActiveTab('on-sale')} 
            class={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeTab === 'on-sale' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            🟢 {lang === 'en' ? 'Active Ballot & Sales' : lang === 'zh_hk' ? '現正發售及抽籤項目' : '現正发售及抽签项目'}
          </button>
          <button 
            onClick={() => setActiveTab('upcoming')} 
            class={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeTab === 'upcoming' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            📅 {lang === 'en' ? 'Upcoming Launches' : lang === 'zh_hk' ? '即將推出物業' : '即将推出物业'}
          </button>
          <button 
            onClick={() => setActiveTab('inventory')} 
            class={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${activeTab === 'inventory' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            📊 {lang === 'en' ? 'Inventory & Price Range' : lang === 'zh_hk' ? '剩餘單位及價格範圍' : '剩余单位及价格范围'}
          </button>
        </div>
      
        {/* DISPLAY CONTENT GRID WINDOW */}
        <div class="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
          
          {/* TAB 1: Live Ballot Drawings Board (Flight Status Style) */}
          {activeTab === 'on-sale' && (
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                    <th class="p-4">{lang === 'en' ? 'Project' : '項目名稱'}</th>
                    <th class="p-4">{lang === 'en' ? 'District' : '地區'}</th>
                    <th class="p-4">{lang === 'en' ? 'Ballot Draw Date' : '抽籤日期'}</th>
                    <th class="p-4">{lang === 'en' ? 'Status' : '狀態'}</th>
                  </tr>
                </thead>
                <tbody class="text-sm divide-y divide-slate-100 font-medium">
                  {applications.filter(item => item.tab_type === 'on-sale' || !item.tab_type).map(item => (
                    <tr key={item.id} class="hover:bg-slate-50 transition-colors">
                      <td class="p-4 font-bold text-slate-900 text-base">{getDbField(item, 'project_name')}</td>
                      <td class="p-4 text-slate-500">{getDbField(item, 'district')}</td>
                      <td class="p-4 font-mono text-blue-600 bg-blue-50/40">{item.ballot_date || '--'}</td>
                      <td class="p-4">
                        <span class="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold uppercase">
                          {getDbField(item, 'status_label')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      
          {/* TAB 2: Upcoming Property Matrix Overview */}
          {activeTab === 'upcoming' && (
            <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {applications.filter(item => item.tab_type === 'upcoming').map(item => (
                <div key={item.id} class="border border-slate-100 p-5 rounded-xl bg-slate-50/50 space-y-2">
                  <span class="text-xs font-bold tracking-widest text-blue-600 uppercase">
                    {getDbField(item, 'phase_label')}
                  </span>
                  <h3 class="text-lg font-bold text-slate-900">{getDbField(item, 'project_name')}</h3>
                  <p class="text-sm text-slate-500">{getDbField(item, 'description')}</p>
                  <div class="text-xs bg-slate-200/60 inline-block px-3 py-1 rounded-md font-semibold text-slate-700">
                    {item.total_units_configured || '0'} Units
                  </div>
                </div>
              ))}
            </div>
          )}
      
          {/* TAB 3: Dynamic Price Bounds & Size Range Metrics */}
          {activeTab === 'inventory' && (
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th class="p-4">{lang === 'en' ? 'Project' : '項目名稱'}</th>
                    <th class="p-4 text-center">{lang === 'en' ? 'Remaining Units' : '剩餘伙數'}</th>
                    <th class="p-4">{lang === 'en' ? 'Price Bound' : '價格範圍'}</th>
                    <th class="p-4">{lang === 'en' ? 'Size Boundary' : '面積範圍'}</th>
                  </tr>
                </thead>
                <tbody class="text-sm divide-y divide-slate-100 font-medium text-slate-700">
                  {applications.filter(item => item.tab_type === 'inventory' || item.remaining_units).map(item => (
                    <tr key={item.id} class="hover:bg-slate-50 transition-colors">
                      <td class="p-4 font-bold text-slate-900">{getDbField(item, 'project_name')}</td>
                      <td class="p-4 text-center font-bold text-rose-600 bg-rose-50/30">
                        {item.remaining_units} / {item.total_units}
                      </td>
                      <td class="p-4 font-mono text-slate-900">
                        {item.lowest_price} - {item.highest_price}
                      </td>
                      <td class="p-4 font-mono text-slate-600">
                        {item.smallest_size} - {item.largest_size} sq.ft.
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      
        </div>
      </section>


      {/* --- IMAGE PROFILES GALLERY CARDS MATRIX --- */}
      <section class="max-w-6xl mx-auto px-4 space-y-4">
        <div class="border-b border-slate-200 pb-3">
          <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">{translations.exploreTitle[lang]}</h2>
          <p class="text-sm text-slate-500">{translations.exploreSub[lang]}</p>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          {/* Card Module item 1 */}
          <Link href="/properties/pinnacle-crest" class="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
            <div class="w-full aspect-[16/10] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl">🏙️</div>
            <div class="p-4 space-y-1">
              <h4 class="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">{translations.pinnacleTitle[lang]}</h4>
              <p class="text-xs text-slate-400 font-medium">{translations.pinnacleSub[lang]}</p>
            </div>
          </Link>
          
          {/* Card Module item 2 */}
          <Link href="/properties/marina-bay" class="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
            <div class="w-full aspect-[16/10] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-5xl">🏖️</div>
            <div class="p-4 space-y-1">
              <h4 class="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">{translations.marinaTitle[lang]}</h4>
              <p class="text-xs text-slate-400 font-medium">{translations.marinaSub[lang]}</p>
            </div>
          </Link>

        </div>
      </section>

    </div>
  );
}
