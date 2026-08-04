'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../utils/supabase';

export default function BuyerDashboardHub({ lang = 'en' }) {
  const [loading, setLoading] = useState(true);
  const [activeApplications, setActiveApplications] = useState([]);

  // Load all recorded application history rows for this specific authenticated Buyer
  useEffect(() => {
    async function loadBuyerRecords() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      // Fetch rows matching the buyer's unique u_id handle
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('u_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setActiveApplications(data);
      }
      setLoading(false);
    }
    loadBuyerRecords();
  }, []);

  const ui = {
    title: { en: "Your Property Portal Hub", zh_hk: "您的置業中心控制台" },
    sub: { en: "Manage your first-hand residential applications and track matched agent milestones.", zh_hk: "管理您的一手住宅物業意向申請，並追蹤已配對地產代理的流程進度。" },
    newBtnTitle: { en: "Launch New Application", zh_hk: "➕ 提交全新物業意向申請" },
    newBtnSub: { en: "Configure priority units and input your requested rebate cut percentage.", zh_hk: "設定全新心儀新盤樓盤、優先單位次序及索取回佣拆賬比例。" },
    ongoingTitle: { en: "Your Ongoing Active Pipelines", zh_hk: "您正在進行中的置業追蹤條" },
    projectLabel: { en: "Target Project Node Reference", zh_hk: "目標一手新盤物業" },
    rebateLabel: { en: "Agreed Rebate Target", zh_hk: "要求回佣拆賬" },
    stepLabel: { en: "Current Workflow Step ID", zh_hk: "目前進度狀態代碼" },
    btnView: { en: "Enter Live Tracker ➔", zh_hk: "進入即時進度條 ➔" }
  };

  if (loading) return <div class="text-center py-24 font-bold text-slate-400 animate-pulse">⌛ Synchronizing Secure Buyer Profile space...</div>;

  return (
    <div class="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Title Header Card */}
      <div class="border-b border-slate-200 pb-4">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">{ui.title[lang]}</h2>
        <p class="text-sm text-slate-500 mt-1">{ui.sub[lang]}</p>
      </div>

      {/* --- SELECTION SECTION A: TRIGGER NEW APPLICATION FORM --- */}
      <Link href="/tracking/new" class="block bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-xl hover:scale-[1.01] hover:shadow-blue-500/10 transition-all border border-blue-500/20 group">
        <div class="flex justify-between items-center">
          <div class="space-y-1.5">
            <h3 class="text-lg md:text-xl font-black tracking-tight group-hover:underline">{ui.newBtnTitle[lang]}</h3>
            <p class="text-xs text-blue-100 max-w-xl font-medium leading-relaxed">{ui.newBtnSub[lang]}</p>
          </div>
          <span class="text-2xl transform group-hover:translate-x-1 transition-transform">➔</span>
        </div>
      </Link>

      {/* --- SELECTION SECTION B: ONGOING ACTIVE APPLICATIONS LIST --- */}
      <div class="space-y-4 pt-2">
        <h3 class="text-base font-extrabold text-slate-900 tracking-tight">{ui.ongoingTitle[lang]}</h3>
        
        {activeApplications.length === 0 ? (
          <div class="text-center py-12 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
            {lang === 'en' ? "No active or draft property applications found." : "目前暫無任何進行中或草稿物業申請記錄。"}
          </div>
        ) : (
          <div class="grid grid-cols-1 gap-4">
            {activeApplications.map((app) => (
              <div key={app.id} class="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm hover:border-slate-300 transition-colors">
                
                <div class="grid grid-cols-2 md:flex md:items-center gap-x-6 gap-y-2 text-xs font-semibold">
                  <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase block tracking-wider mb-0.5">Application ID</span>
                    <span class="text-sm font-bold text-slate-900 font-mono">#{app.id}</span>
                  </div>
                  <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase block tracking-wider mb-0.5">{ui.projectLabel[lang]}</span>
                    <span class="text-sm font-bold text-slate-800">Applications Node Project</span>
                  </div>
                  <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase block tracking-wider mb-0.5">{ui.rebateLabel[lang]}</span>
                    <span class="text-sm font-black text-emerald-600">{app.rebate}%</span>
                  </div>
                  <div>
                    <span class="text-[10px] font-bold text-slate-400 uppercase block tracking-wider mb-0.5">{ui.stepLabel[lang]}</span>
                    <span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono text-[11px]">ID: {app.step_id}</span>
                  </div>
                </div>

                {/* Direct access anchor link routing into the 18-step linear roadmap display view */}
                <Link 
                  href={`/tracking/pipeline?id=${app.id}`} 
                  class="w-full md:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-center text-xs font-bold transition-colors shadow-sm"
                >
                  {ui.btnView[lang]}
                </Link>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
