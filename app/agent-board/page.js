'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

export default function AgentMatchBoard({ lang = 'en' }) {
  const [openApplications, setOpenApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myAgentId, setMyAgentId] = useState(null);

  // 1. Get the logged-in Agent's ID on page load
  useEffect(() => {
    async function getAgentSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setMyAgentId(user.id);
    }
    getAgentSession();
  }, []);

  // 2. Fetch all unclaimed buyer applications ripe for a race
  async function fetchOpenJobs() {
    setLoading(true);
    // Find rows where agent_id is not yet claimed (adjust '1' if your unassigned default is null)
    const { data, error } = await supabase
      .from('buyer_applications') // Replace with your exact table name if different
      .select('*')
      .eq('step_id', 1); // step_id 1 means "Submitted Application" ready for matching

    if (!error && data) setOpenApplications(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchOpenJobs();
  }, []);

  // 3. The Uber "RACE" Claim Mechanism
  async function claimCustomer(applicationId) {
    if (!myAgentId) return alert("Please log in as an agent first.");

    // Prompt for required Hong Kong EAA License No. before claiming
    const eaaNo = prompt(lang === 'en' ? "Enter your EAA License Number to lock this claim:" : "請輸入您的地產代理EAA牌照號碼以鎖定配對：");
    if (!eaaNo) return;

    // Update the row instantly. Row Level Security or a check ensures first-come, first-served
    const { error } = await supabase
      .from('buyer_applications')
      .update({
        agent_id: myAgentId,
        agent_eaa_no: eaaNo,
        step_id: 2, // Advance step_id to 2: "Prepare physical form & Cashier Order"
        last_upd: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (error) {
      alert(lang === 'en' ? "Too slow! Another agent already claimed this client." : "慢了一步！此客戶已被其他代理接單。");
    } else {
      alert(lang === 'en' ? "🎉 Client locked! Pay your $300 HKD fee to unlock contact data." : "🎉 接單成功！請支付$300港幣配對費以解鎖客戶資料。");
      fetchOpenJobs(); // Refresh board
    }
  }

  return (
    <div class="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div class="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h2 class="text-2xl font-black text-slate-900 tracking-tight">
            {lang === 'en' ? "Live Buyer Application Pool" : "一手新盤即時接單大堂"}
          </h2>
          <p class="text-sm text-slate-500 mt-0.5">
            {lang === 'en' ? "Refresh to claim active buyers looking for rebate matches." : "即時刷新搶單。查看買家要求的回佣比例並進行高速配對。"}
          </p>
        </div>
        <button onClick={fetchOpenJobs} class="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-slate-800 transition-all shadow-sm">
          🔄 {lang === 'en' ? "Refresh Board" : "刷新大堂"}
        </button>
      </div>

      {loading ? (
        <div class="text-center py-20 text-slate-400 text-sm font-semibold animate-pulse">⌛ Scanning Edge Nodes for Unclaimed Applications...</div>
      ) : openApplications.length === 0 ? (
        <div class="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
          {lang === 'en' ? "No buyers are currently waiting in the queue." : "目前暫無等待配對的買家申請。"}
        </div>
      ) : (
        /* The Uber Ride Grid Layout */
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openApplications.map(job => (
            <div key={job.id} class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div class="space-y-4">
                <div class="flex justify-between items-start">
                  <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-bold text-xs">
                    ID: #{job.id}
                  </span>
                  <div class="text-right">
                    <span class="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Requested Rebate</span>
                    <span class="text-2xl font-black text-emerald-600">{job.rebate}%</span>
                  </div>
                </div>

                <div class="border-t border-slate-50 pt-3 space-y-1">
                  <div class="text-xs text-slate-400 font-semibold uppercase">{lang === 'en' ? "Target Project" : "心儀新盤樓盤"}</div>
                  <div class="text-lg font-bold text-slate-900">Grand Horizon (Phase 1)</div>
                </div>
              </div>

              <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-400">Match Fee: <span class="text-slate-800">$300 HKD</span></span>
                <button 
                  onClick={() => claimCustomer(job.id)}
                  class="px-5 py-2.5 bg-blue-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                  ⚡ {lang === 'en' ? "Accept Ride & Match" : "立即接單搶客"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
