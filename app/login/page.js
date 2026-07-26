'use client';
import { useState } from 'react';
import { supabase } from '../../utils/supabase';

export default function LoginPage({ lang = 'en' }) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [role, setRole] = useState('buyer'); // 'buyer' or 'agent'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  // Multilingual UI translation dictionary labels
  const ui = {
    titleLogin: { en: "Welcome Back", zh_hk: "歡迎回來" },
    titleRegister: { en: "Create Platform Account", zh_hk: "註冊系統帳戶" },
    subRegister: { en: "Select your identity profile type to begin matching.", zh_hk: "請選擇您的使用身份，開啟一手新盤搶單與回佣功能。" },
    emailLabel: { en: "Email Address", zh_hk: "電子郵件地址" },
    passLabel: { en: "Account Password", zh_hk: "帳戶安全密碼" },
    nameLabel: { en: "Full Legal Name", zh_hk: "法定真實姓名 (與身份證相同)" },
    phoneLabel: { en: "WhatsApp Contact Number", zh_hk: "WhatsApp 聯絡電話" },
    roleBuyer: { en: "I am a Property Buyer", zh_hk: "我是一手新盤買家" },
    roleAgent: { en: "I am a Real Estate Agent", zh_hk: "我是地產代理經紀" },
    btnLogin: { en: "Sign In Safely", zh_hk: "安全登入" },
    btnRegister: { en: "Complete Registration", zh_hk: "立即註冊" },
    switchRegister: { en: "New to EstateFlow? Create an account ➔", zh_hk: "首次使用？立即註冊新帳戶 ➔" },
    switchLogin: { en: "Already have an account? Sign in here ➔", zh_hk: "已有專屬帳戶？按此前往登入 ➔" }
  };

  // --- SIGN IN LOGIC ---
  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', isError: false });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);
    if (error) {
      setMessage({ text: `❌ ${error.message}`, isError: true });
    } else if (data?.user) {
      setMessage({ text: lang === 'en' ? "🎉 Access verified! Loading dashboard..." : "🎉 登入成功！正在載入主頁...", isError: false });
      setTimeout(() => { window.location.href = "/"; }, 1000);
    }
  }

  // --- SIGN UP LOGIC (WITH PROFILE META DATA) ---
  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', isError: false });

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        // This meta data block passes straight into your Supabase handle_new_user() trigger!
        data: {
          role: role,
          full_name: fullName,
          whatsapp_number: whatsapp
        }
      }
    });

    setLoading(false);
    if (error) {
      setMessage({ text: `❌ ${error.message}`, isError: true });
    } else if (data?.user) {
      setMessage({ 
        text: lang === 'en' ? "🎉 Account registered! Profile activated instantly." : "🎉 帳戶建立成功！已為您即時開通專屬角色權限。", 
        isError: false 
      });
      setTimeout(() => { window.location.href = "/"; }, 1500);
    }
  }

  return (
    <div class="max-w-md mx-auto bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm space-y-6 mt-10">
      
      {/* Dynamic Header Titles */}
      <div class="text-center space-y-1.5">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto font-bold shadow-inner">🔐</div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">
          {isSignUpMode ? ui.titleRegister[lang] : ui.titleLogin[lang]}
        </h2>
        <p class="text-xs text-slate-400 font-medium max-w-[280px] mx-auto">
          {isSignUpMode ? ui.subRegister[lang] : "estate tracking pipeline gate."}
        </p>
      </div>

      {message.text && (
        <div class={`p-4 rounded-xl text-xs font-semibold border leading-relaxed ${message.isError ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
          {message.text}
        </div>
      )}

      {/* Form Submission Wrapper */}
      <form class="space-y-4" onSubmit={isSignUpMode ? handleSignUp : handleSignIn}>
        
        {/* --- ROLE SELECTION BUTTONS BLOCK (Only visible during signup) --- */}
        {isSignUpMode && (
          <div class="grid grid-cols-2 gap-3 pb-2">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              class={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${role === 'buyer' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/10' : 'border-slate-200 text-slate-500 bg-slate-50/50'}`}
            >
              <span>🛒</span><br/>{ui.roleBuyer[lang]}
            </button>
            <button
              type="button"
              onClick={() => setRole('agent')}
              class={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${role === 'agent' ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/10' : 'border-slate-200 text-slate-500 bg-slate-50/50'}`}
            >
              <span>💼</span><br/>{ui.roleAgent[lang]}
            </button>
          </div>
        )}

        {/* Input Field: Full Legal Name (Only on Registration) */}
        {isSignUpMode && (
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{ui.nameLabel[lang]}</label>
            <input type="text" required disabled={loading} value={fullName} onChange={(e) => setFullName(e.target.value)} class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold" placeholder="Chan Tai Man" />
          </div>
        )}

        {/* Input Field: WhatsApp Contact (Only on Registration) */}
        {isSignUpMode && (
          <div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{ui.phoneLabel[lang]}</label>
            <input type="tel" required disabled={loading} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold" placeholder="91234567" />
          </div>
        )}

        {/* Core Auth Credentials */}
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{ui.emailLabel[lang]}</label>
          <input type="email" required disabled={loading} value={email} onChange={(e) => setEmail(e.target.value)} class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold" placeholder="client@domain.com" />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{ui.passLabel[lang]}</label>
          <input type="password" required minLength={6} disabled={loading} value={password} onChange={(e) => setPassword(e.target.value)} class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold" placeholder="••••••••" />
        </div>

        <button type="submit" disabled={loading} class="w-full mt-2 py-3 bg-blue-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-blue-700 shadow-md transition-all">
          {loading ? "..." : isSignUpMode ? ui.btnRegister[lang] : ui.btnLogin[lang]}
        </button>
      </form>

      {/* Layout View Mode Toggle Link */}
      <div class="text-center pt-1.5">
        <button onClick={() => { setIsSignUpMode(!isSignUpMode); setMessage({ text: '', isError: false }); }} class="text-xs font-bold text-blue-600 hover:underline">
          {isSignUpMode ? ui.switchLogin[lang] : ui.switchRegister[lang]}
        </button>
      </div>

    </div>
  );
}
