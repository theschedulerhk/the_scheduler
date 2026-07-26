'use client';
import { useState } from 'react';
import { supabase } from '../../utils/supabase';

export default function LoginPage({ lang = 'en' }) {
  // --- FORM SELECTION STATE MATRIX ---
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('buyer'); // Strict toggle: 'buyer' or 'agent'
  const [rawEmail, setRawEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  // Multilingual localization dictionaries
  const ui = {
    titleLogin: { en: "Secure Sign In Portal", zh_hk: "系統安全登入門戶" },
    titleRegister: { en: "Create Unique Profile", zh_hk: "註冊新帳戶身份" },
    subText: { en: "Please select your active role below. You can maintain distinct Buyer and Agent spaces under the same email inbox.", zh_hk: "請在下方選擇您目前要使用的身份。您可以使用相同的電郵同時開通獨立的買家與代理帳戶。" },
    emailLabel: { en: "Email Address", zh_hk: "電子郵件地址" },
    passLabel: { en: "Account Password", zh_hk: "帳戶安全密碼" },
    nameLabel: { en: "Full Legal Name", zh_hk: "法定真實姓名 (與身份證相同)" },
    phoneLabel: { en: "WhatsApp Contact Number", zh_hk: "WhatsApp 聯絡電話" },
    roleLabel: { en: "Select Access Role Identity (Mandatory)", zh_hk: "選擇目前登入/註冊身份 (必填)" },
    roleBuyer: { en: "I am a Property Buyer", zh_hk: "我是一手新盤買家" },
    roleAgent: { en: "I am a Real Estate Agent", zh_hk: "我是地產代理經紀" },
    btnLogin: { en: "Secure Login ➔", zh_hk: "確認安全登入 ➔" },
    btnRegister: { en: "Complete Registration", zh_hk: "完成註冊並開通" },
    switchRegister: { en: "New to EstateFlow? Create an account ➔", zh_hk: "首次使用？立即註冊新帳戶 ➔" },
    switchLogin: { en: "Already have an account? Sign in here ➔", zh_hk: "已有專屬帳戶？按此前往登入 ➔" }
  };

  // Helper function to build the separated email address string variant
  const formatTaggedEmail = (emailStr, roleStr) => {
    const parts = emailStr.trim().split('@');
    if (parts.length !== 2) return emailStr;
    return `${parts[0]}+${roleStr}@${parts[1]}`.toLowerCase();
  };

  // --- FORM TRANSACTION ACTIONS ---
  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!rawEmail || !password) return;

    setLoading(true);
    setMessage({ text: '', isError: false });

    // Generate the unique, separated account string
    const processedEmail = formatTaggedEmail(rawEmail, selectedRole);

    if (isSignUpMode) {
      // EXECUTE SIGN UP
      const { data, error } = await supabase.auth.signUp({
        email: processedEmail,
        password: password,
        options: {
          data: {
            role: selectedRole,
            full_name: fullName,
            whatsapp_number: whatsapp,
            display_email: rawEmail.trim() // Keep raw email safe inside metadata for layout displays
          }
        }
      });

      setLoading(false);
      if (error) {
        setMessage({ text: `❌ ${error.message}`, isError: true });
      } else if (data?.user) {
        setMessage({ 
          text: lang === 'en' ? `🎉 Success! Your unique account as a [${selectedRole.toUpperCase()}] is active.` : `🎉 註冊成功！您的 [${selectedRole === 'buyer' ? '買家' : '代理'}] 專屬帳戶已即時開通。`, 
          isError: false 
        });
        setTimeout(() => { window.location.href = "/"; }, 1500);
      }

    } else {
      // EXECUTE SIGN IN
      const { data, error } = await supabase.auth.signInWithPassword({
        email: processedEmail,
        password: password,
      });

      setLoading(false);
      if (error) {
        setMessage({ text: `❌ ${error.message} (Make sure your access role switch matches your registration choice)`, isError: true });
      } else if (data?.user) {
        setMessage({ text: lang === 'en' ? "🎉 Access verified! Loading dashboard..." : "🎉 認證成功！正在載入主頁...", isError: false });
        setTimeout(() => { window.location.href = "/"; }, 1000);
      }
    }
  }

  return (
    <div class="max-w-md mx-auto bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm space-y-6 mt-10">
      
      {/* Title block banner */}
      <div class="text-center space-y-1.5">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto font-bold shadow-inner">🔐</div>
        <h2 class="text-xl font-black text-slate-900 tracking-tight">
          {isSignUpMode ? ui.titleRegister[lang] : ui.titleLogin[lang]}
        </h2>
        <p class="text-xs text-slate-400 font-medium leading-relaxed max-w-[320px] mx-auto">
          {ui.subText[lang]}
        </p>
      </div>

      {message.text && (
        <div class={`p-4 rounded-xl text-xs font-semibold border leading-relaxed ${message.isError ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
          {message.text}
        </div>
      )}

      <form class="space-y-4" onSubmit={handleFormSubmit}>
        
        {/* --- MANDATORY IDENTITY RADIO BUTTON SELECTION SET --- */}
        <div class="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">{ui.roleLabel[lang]}</label>
          
          <div class="flex flex-col gap-2">
            {/* Radio Input Option 1: Buyer */}
            <label class={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedRole === 'buyer' ? 'border-blue-600 bg-white ring-2 ring-blue-500/10' : 'border-slate-200/60 bg-white/40 hover:bg-white'}`}>
              <div class="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="role" 
                  value="buyer" 
                  checked={selectedRole === 'buyer'}
                  onChange={() => setSelectedRole('buyer')}
                  class="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                />
                <span class="text-xs font-bold text-slate-700">🛒 {ui.roleBuyer[lang]}</span>
              </div>
            </label>

            {/* Radio Input Option 2: Agent */}
            <label class={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedRole === 'agent' ? 'border-blue-600 bg-white ring-2 ring-blue-500/10' : 'border-slate-200/60 bg-white/40 hover:bg-white'}`}>
              <div class="flex items-center gap-3">
                <input 
                  type="radio" 
                  name="role" 
                  value="agent" 
                  checked={selectedRole === 'agent'}
                  onChange={() => setSelectedRole('agent')}
                  class="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500" 
                />
                <span class="text-xs font-bold text-slate-700">💼 {ui.roleAgent[lang]}</span>
              </div>
            </label>
          </div>
        </div>

        {/* Dynamic Registration Suffix Input Fields */}
        {isSignUpMode && (
          <>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{ui.nameLabel[lang]}</label>
              <input type="text" required disabled={loading} value={fullName} onChange={(e) => setFullName(e.target.value)} class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold text-slate-800" placeholder="Chan Tai Man" />
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{ui.phoneLabel[lang]}</label>
              <input type="tel" required disabled={loading} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold text-slate-800" placeholder="91234567" />
            </div>
          </>
        )}

        {/* Core Credentials Fields */}
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{ui.emailLabel[lang]}</label>
          <input type="email" required disabled={loading} value={rawEmail} onChange={(e) => setRawEmail(e.target.value)} class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold text-slate-800" placeholder="yourname@domain.com" />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{ui.passLabel[lang]}</label>
          <input type="password" required minLength={6} disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold text-slate-800" placeholder="••••••••" />
        </div>

        <button type="submit" disabled={loading} class="w-full mt-2 py-3 bg-blue-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-blue-700 shadow-md transition-all">
          {loading ? "..." : isSignUpMode ? ui.btnRegister[lang] : ui.btnLogin[lang]}
        </button>
      </form>

      {/* Mode Switch anchor */}
      <div class="text-center pt-1.5">
        <button type="button" onClick={() => { setIsSignUpMode(!isSignUpMode); setMessage({ text: '', isError: false }); }} class="text-xs font-bold text-blue-600 hover:underline">
          {isSignUpMode ? ui.switchLogin[lang] : ui.switchRegister[lang]}
        </button>
      </div>

    </div>
  );
}
