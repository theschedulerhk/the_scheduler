'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

export default function AgentMatchBoard({ lang = 'en' }) {
  const [openApplications, setOpenApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myAgentId, setMyAgentId] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false); // ◄ Added authorization gate state

  // 1. VERIFY ACCOUNT ROLE SENSOR ON PAGE LOAD
  useEffect(() => {
    async function checkAgentAuthorization() {
      setLoading(true);
      
      // Grab the active session user object from browser memory
      const { data: { user } } = await supabase.auth.getUser();
      
      // BLOCK 1: If user is not logged in at all, kick them to login
      if (!user) {
        alert(lang === 'en' ? "Access Denied. Please log in first." : "拒絕訪問。請先登入您的代理帳戶。");
        window.location.href = '/login';
        return;
      }

      // Extract the metadata role we generated during registration radio selections
      const userRole = user.user_metadata?.role || 'buyer';

      // BLOCK 2: If the logged-in user is a Buyer, throw an alert and redirect them
      if (userRole !== 'agent') {
        alert(lang === 'en' ? "🔒 Restricted Area. Only registered real estate agents can access the matching board lobby." : "🔒 權限受限。此大堂專為註冊持牌地產代理而設，買家帳戶無法進入。");
        window.location.href = '/'; // Kick them back to safety on the homepage
        return;
      }

      // If they clear both blocks, unlock the page canvas
      setMyAgentId(user.id);
      setIsAuthorized(true);
      
      // Now safe to query database items
      await fetchOpenJobs();
    }

    checkAgentAuthorization();
  }, [lang]);

  // 2. FETCH ACTIVE OPEN LISTINGS
  async function fetchOpenJobs() {
    // Only fire query if security checks pass in background
    // Ensure agents can only grab distributed rows
    const { data, error } = await supabase
      .from('applications') // Maps straight to your applications table
      .select('*')
      .eq('step_id', 1) // step_id 1 means "Submitted Application" ready for matching
      .eq('platform_filter_status', 'distributed_to_agents'); // ◄ Add this extra line gate filter

    if (!error && data) setOpenApplications(data);
    setLoading(false);
  }

  // --- 3. THE UBER "RACE" CLAIM MECHANISM ---
  async function claimCustomer(applicationId, requestedRebate) {
    const legalConfirmation = window.confirm(
      lang === 'en' 
        ? `🚨 LEGAL WARNING & CONFIRMATION:\n\nAre you absolutely sure you want to accept this application?\n\nBy clicking OK, you explicitly bind your intent to fulfill a ${requestedRebate}% commission rebate split to this buyer. This record is locked on the platform ledger and will be provided directly to the EAA in the event of an arbitrage dispute.`
        : `🚨 法律合約確認及警告：\n\n您是否百分之百確定接單？\n\n一旦按下確認，即代表您在法律意向層面上，完全同意並承諾向此買家提供【${requestedRebate}%】的發展商佣金回贈。此紀錄將永久鎖定於平台數據庫內，若日後出現糾紛，此紀錄將直接遞交予地產代理監管局 (EAA) 作為書面誠信供詞及證據。`
    );

    if (!legalConfirmation) return;

    const eaaNo = prompt(lang === 'en' ? "Enter your EAA License Number to lock this claim:" : "請輸入您的地產代理EAA牌照號碼以鎖定配對：");
    if (!eaaNo) return;

    const { error } = await supabase
      .from('applications')
      .update({
        agent_id: myAgentId,
        agent_eaa_no: eaaNo,
        step_id: 2, // Moves from Submitted (1) to Prepare physical forms (2)
        last_upd: new Date().toISOString()
      })
      .eq('id', applicationId);

    if (error) {
      alert(lang === 'en' ? "Too slow! Another agent already claimed this client." : "慢了一步！此客戶已被其他代理接單。");
    } else {
      alert(lang === 'en' ? "🎉 Match Locked! Proceed to prepare the physical form." : "🎉 接單成功！請即刻準備實體表格及本票。");
      fetchOpenJobs(); 
    }
  }

  // --- SAFETY RETURN ELEMENT IF LOADING OR UNAUTHORIZED ---
  if (loading || !isAuthorized) {
    return (
      <div class="max-w-5xl mx-auto px-4 py-32 text-center text-slate-400 font-bold text-sm animate-pulse">
        🛡️ {lang === 'en' ? "Running Platform Security Clearance Audit..." : "正在執行安全合規審計，驗證地產代理身份..."}
      </div>
    );
  }

  // --- THE ACTUAL SECURE MATCH BOARD HTML MATRIX ---
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

      {openApplications.length === 0 ? (
        <div class="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
          {lang === 'en' ? "No buyers are currently waiting in the queue." : "目前暫無等待配對的買家申請。"}
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {openApplications.map(job => (
            <div key={job.id} class="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div class="space-y-4">
                <div class="flex justify-between items-start">
                  <span class="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-xs">
                    ID: #{job.id}
                  </span>
                  <div class="text-right">
                    <span class="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Requested Rebate</span>
                    <span class="text-2xl font-black text-emerald-600">{job.rebate}%</span>
                  </div>
                </div>
                <div class="border-t border-slate-50 pt-3 space-y-1">
                  <div class="text-xs text-slate-400 font-semibold uppercase">{lang === 'en' ? "Target Project ID Reference" : "心儀物業標誌"}</div>
                  <div class="text-lg font-bold text-slate-900 font-mono">Applications Project Node</div>
                </div>
              </div>
              <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs font-bold text-slate-400">Match Fee: <span class="text-slate-800">$300 HKD</span></span>
                <button onClick={() => claimCustomer(job.id, job.rebate)} class="px-5 py-2.5 bg-emerald-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md">
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
