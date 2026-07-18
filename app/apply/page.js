'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

export default function BuyerApplyPage({ lang = 'en' }) {
  // --- APPLICATION DATA STATE ---
  const [myUserId, setMyUserId] = useState(null);
  const [projectName, setProjectName] = useState('Grand Horizon (Phase 1)');
  const [unit1, setUnit1] = useState('');
  const [unit2, setUnit2] = useState('');
  const [unit3, setUnit3] = useState('');
  const [rebatePercent, setRebatePercent] = useState(50); // Default 50% agent rebate split
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  // Multilingual UI label dictionaries
  const ui = {
    title: { en: "Submit Property Intention Application", zh_hk: "遞交一手新盤意向申請" },
    sub: { en: "Configure your priority targets and define your ideal commission rebate split.", zh_hk: "設定您的心儀單位選樓排序，並自訂您期望的代理回佣成數比例。" },
    projectLabel: { en: "Select Target Real Estate Project", zh_hk: "選擇心儀一手新盤項目" },
    priorityLabel: { en: "Unit Selection Priorities (Top 3 Preferences)", zh_hk: "選樓意向優先次序 (最多填寫3個)" },
    p1: { en: "1st Choice Unit (e.g. Block 2, 15F, Flat A)", zh_hk: "第一志願單位 (例: 2座15樓A室)" },
    p2: { en: "2nd Choice Unit (Optional)", zh_hk: "第二志願單位 (選填)" },
    p3: { en: "3rd Choice Unit (Optional)", zh_hk: "第三志願單位 (選填)" },
    rebateLabel: { en: "Requested Agent Commission Rebate Split", zh_hk: "要求代理回佣拆賬比例" },
    rebateTip: { en: "Percentage of the total developer commission given back to you.", zh_hk: "（註：指發展商支付給代理的總佣金中，代理回贈給您的百分比）" },
    feeNotice: { en: "An application processing fee of $150 HKD applies upon submission.", zh_hk: "遞交申請需要支付 $150 港幣的平台配對處理費。" },
    btnSubmit: { en: "Launch Intent & Post to Pool", zh_hk: "確認提交並放入接單大堂" },
    errorLogin: { en: "Authentication Required. Please log in before creating an application.", zh_hk: "安全認證錯誤：請先登入帳戶，然後再建立物業意向申請。" }
  };

  // 1. Automatically secure the active Buyer's User ID on page render
  useEffect(() => {
    async function getBuyerSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setMyUserId(user.id);
      } else {
        setMessage({ text: ui.errorLogin[lang], isError: true });
      }
    }
    getBuyerSession();
  }, [lang]);

  // 2. Action: Submit and insert the application data row into Supabase
  async function handleSubmitApplication(e) {
    e.preventDefault();
    if (!myUserId) {
      alert(ui.errorLogin[lang]);
      return;
    }

    // Combine unit inputs into a single clean pipeline string sequence
    const prioritySequence = [unit1, unit2, unit3].filter(Boolean).join(' > ');
    if (!unit1) {
      alert(lang === 'en' ? "Please provide at least your 1st choice unit preference." : "請至少填寫您的第一志願單位意向。");
      return;
    }

    setLoading(true);
    setMessage({ text: '', isError: false });

    // Insert the fresh layout row parameters directly into your database 'applications' table
    const { error } = await supabase
      .from('applications') // Maps perfectly to your exact database table name
      .insert([
        {
          u_id: myUserId, // Maps straight to your u_id column
          step_id: 1, // step_id 1 puts it directly into the active pool waiting for an agent
          agent_id: 1, // Sets your default unassigned placeholder agent identifier
          rebate: rebatePercent, // Stores your chosen split number (e.g. 50)
          // Add custom text columns if you have them, otherwise Next.js passes the core values
          last_upd: new Date().toISOString()
        }
      ]);

    setLoading(false);

    if (error) {
      setMessage({ text: `❌ Database Error: ${error.message}`, isError: true });
    } else {
      setMessage({ 
        text: lang === 'en' ? "🎉 Success! Intent posted live. Redirecting to your tracking pipeline..." : "🎉 申請提交成功！已放入搶單大堂。正在前往您的置業進度條...", 
        isError: false 
      });
      // Redirect the buyer directly to their live tracking pipeline view after 2 seconds
      setTimeout(() => {
        window.location.href = "/tracking";
      }, 2000);
    }
  }

  return (
    <div class="max-w-3xl mx-auto px-4 py-8 space-y-8">
      
      {/* --- PANEL TITLES HEADER --- */}
      <div class="border-b border-slate-200 pb-4">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">{ui.title[lang]}</h2>
        <p class="text-sm text-slate-500 mt-1">{ui.sub[lang]}</p>
      </div>

      {/* --- DYNAMIC ACTION FEEDBACK BANNER --- */}
      {message.text && (
        <div class={`p-4 rounded-xl text-xs font-bold border transition-all leading-relaxed ${message.isError ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
          {message.text}
        </div>
      )}

      {/* --- CORE ENTRY FORM --- */}
      <form onSubmit={handleSubmitApplication} class="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Dropdown: Target Project selection */}
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">{ui.projectLabel[lang]}</label>
          <select 
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            disabled={loading || !myUserId}
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold text-slate-800 disabled:opacity-50"
          >
            <option value="Grand Horizon (Phase 1)">Grand Horizon Phase 1 (藍澄灣一期)</option>
            <option value="Victoria Harbour Views">Victoria Harbour Views (維港匯)</option>
            <option value="The Pinnacle Crest">The Pinnacle Crest (天峰)</option>
          </select>
        </div>

        {/* Text Field Inputs: Unit priority list */}
        <div class="space-y-3.5">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">{ui.priorityLabel[lang]}</label>
          
          <input 
            type="text" 
            required
            value={unit1}
            onChange={(e) => setUnit1(e.target.value)}
            disabled={loading || !myUserId}
            placeholder={ui.p1[lang]}
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold placeholder-slate-400 disabled:opacity-50"
          />
          
          <input 
            type="text" 
            value={unit2}
            onChange={(e) => setUnit2(e.target.value)}
            disabled={loading || !myUserId}
            placeholder={ui.p2[lang]}
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold placeholder-slate-400 disabled:opacity-50"
          />
          
          <input 
            type="text" 
            value={unit3}
            onChange={(e) => setUnit3(e.target.value)}
            disabled={loading || !myUserId}
            placeholder={ui.p3[lang]}
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold placeholder-slate-400 disabled:opacity-50"
          />
        </div>

        {/* Range Slider: Interactive rebate percentage split */}
        <div class="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4">
          <div class="flex justify-between items-start">
            <div class="space-y-0.5">
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">{ui.rebateLabel[lang]}</label>
              <span class="text-[10px] font-medium text-slate-400 block max-w-xs md:max-w-md leading-relaxed">{ui.rebateTip[lang]}</span>
            </div>
            {/* Massive numbers preview text right above slider handle */}
            <div class="text-3xl font-black text-blue-600 tracking-tight">
              {rebatePercent}%
            </div>
          </div>

          <input 
            type="range" 
            min="20" 
            max="95" 
            step="5"
            value={rebatePercent}
            onChange={(e) => setRebatePercent(Number(e.target.value))}
            disabled={loading || !myUserId}
            class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 disabled:opacity-50"
          />
          
          <div class="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wide px-1">
            <span>20% Rebate</span>
            <span>50% Split</span>
            <span>95% Max Rebate</span>
          </div>
        </div>

        {/* Submit action panel row wrapper */}
        <div class="pt-4 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <span class="text-xs font-semibold text-slate-400 text-center md:text-left leading-relaxed">
            🔒 {ui.feeNotice[lang]}
          </span>
          <button 
            type="submit"
            disabled={loading || !myUserId}
            class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "..." : ui.btnSubmit[lang]}
          </button>
        </div>

      </form>
    </div>
  );
}
