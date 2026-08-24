'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link'; 
import { supabase } from '../../../utils/supabase';

export default function NewApplicationForm({ lang = 'en' }) {
  const [myUserId, setMyUserId] = useState(null);
  const [projectName, setProjectName] = useState('Grand Horizon (Phase 1)');
  const [unit1, setUnit1] = useState('');
  const [unit2, setUnit2] = useState('');
  const [unit3, setUnit3] = useState('');
  const [rebatePercent, setRebatePercent] = useState(50);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  useEffect(() => {
    async function secureUserSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setMyUserId(user.id);
    }
    secureUserSession();
  }, []);

  async function handleLaunchApplication(e) {
    e.preventDefault();
    if (!myUserId) return alert("Please sign in first.");
    if (!unit1) return alert(lang === 'en' ? "Please provide your 1st choice unit." : "請填寫您的第一志願單位。");

    setLoading(true);
    setMessage({ text: '', isError: false });

    // Combine values into custom priority text arrays
    const formattedPriority = [unit1, unit2, unit3].filter(Boolean).join(' > ');

    const { error } = await supabase
      .from('applications')
      .insert([
        {
          u_id: myUserId,
          step_id: 0, // Starts at step_id 0: "Draft" under Master filtering validation
          agent_id: 1, // Default fallback platform placeholder unassigned identifier
          rebate: rebatePercent,
          platform_filter_status: 'pending_master', // Routes to Master dashboard gate first!
          last_upd: new Date().toISOString()
        }
      ]);

    setLoading(false);
    if (error) {
      setMessage({ text: `❌ Database Error: ${error.message}`, isError: true });
    } else {
      setMessage({ 
        text: lang === 'en' ? "🎉 Success! Intent drafted and routed up to Master for filtering review." : "🎉 申請建立成功！已即時送往 Master 審查大堂，正在跳轉回主控制台...", 
        isError: false 
      });
      setTimeout(() => { window.location.href = "/tracking"; }, 2000);
    }
  }

  return (
    <div class="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
        <Link href="/tracking" class="hover:text-blue-600 transition-colors">← Back to Dashboard Hub</Link>
      </div>

      <div class="border-b border-slate-200 pb-4">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Configure New Intention Application</h2>
        <p class="text-sm text-slate-500 mt-0.5">Designate your target apartment allocations and request an agent rebate match split.</p>
      </div>

      {message.text && (
        <div class={`p-4 rounded-xl text-xs font-bold border transition-all ${message.isError ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleLaunchApplication} class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Property Project</label>
          <select value={projectName} onChange={(e) => setProjectName(e.target.value)} class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800">
            <option value="Grand Horizon (Phase 1)">Grand Horizon Phase 1 (藍澄灣一期)</option>
            <option value="The Pinnacle Crest">The Pinnacle Crest (天峰)</option>
          </select>
        </div>

        <div class="space-y-3">
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Allocation Priorities</label>
          <input type="text" required value={unit1} onChange={(e) => setUnit1(e.target.value)} placeholder="1st Choice Unit (e.g. Block 2, 15F, Flat A)" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold" />
          <input type="text" value={unit2} onChange={(e) => setUnit2(e.target.value)} placeholder="2nd Choice Unit (Optional)" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold" />
          <input type="text" value={unit3} onChange={(e) => setUnit3(e.target.value)} placeholder="3rd Choice Unit (Optional)" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold" />
        </div>

        <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
          <div class="flex justify-between items-center">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Requested Rebate Split Cut</label>
            <div class="text-3xl font-black text-blue-600 tracking-tight">{rebatePercent}%</div>
          </div>
          <input type="range" min="20" max="95" step="5" value={rebatePercent} onChange={(e) => setRebatePercent(Number(e.target.value))} class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
        </div>

        <div class="pt-4 border-t border-slate-100 text-right">
          <button type="submit" disabled={loading || !myUserId} class="px-6 py-3 bg-blue-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-blue-700 shadow-md">
            {loading ? "..." : "Launch Intention ➔"}
          </button>
        </div>
      </form>
    </div>
  );
}
