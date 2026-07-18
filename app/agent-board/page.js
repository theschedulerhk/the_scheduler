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
  async function claimCustomer(jobId, requestedRebate) {
    if (!myAgentId) return alert("Please log in as an agent first.");
  
    // --- THE LEGAL VALIDATOR POPUP ---
    const legalConfirmation = window.confirm(
      lang === 'en' 
        ? `🚨 LEGAL WARNING & CONFIRMATION:\n\nAre you absolutely sure you want to accept this application?\n\nBy clicking OK, you explicitly bind your intent to fulfill a ${requestedRebate}% commission rebate split to this buyer. This record is locked on the platform ledger and will be provided directly to the EAA in the event of an arbitrage dispute.`
        : `🚨 法律合約確認及警告：\n\n您是否百分之百確定接單？\n\n一旦按下確認，即代表您在法律意向層面上，完全同意並承諾向此買家提供【${requestedRebate}%】的發展商佣金回贈。此紀錄將永久鎖定於平台數據庫內，若日後出現糾紛，此紀錄將直接遞交予地產代理監管局 (EAA) 作為書面誠信供詞及證據。`
    );
  
    if (!legalConfirmation) return; // Breaks execution if they try to chicken out
  
    // Prompt for mandatory Hong Kong EAA License No. before claiming
    const eaaNo = prompt(lang === 'en' ? "Enter your EAA License Number to lock this claim:" : "請輸入您的地產代理EAA牌照號碼以鎖定配對：");
    if (!eaaNo) return;
  
    setLoading(true);
    const { error } = await supabase
      .from('applications')
      .update({
        agent_id: myAgentId,
        agent_eaa_no: eaaNo,
        step_id: 2, // Moves from Submitted (1) to Prepare physical forms (2)
        last_upd: new Date().toISOString()
      })
      .eq('id', jobId);
  
    if (error) {
      alert(lang === 'en' ? "Too slow! Another agent already claimed this client." : "慢了一步！此客戶已被其他代理接單。");
    } else {
      alert(lang === 'en' ? "🎉 Match Locked! Proceed to prepare the physical form." : "🎉 接單成功！請即刻準備實體表格及本票。");
      fetchOpenJobs(); 
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
