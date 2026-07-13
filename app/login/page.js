'use client';
import { useState } from 'react';
import { supabase } from '../../utils/supabase';

export default function LoginPage({ lang = 'en' }) {
  // --- COMPONENT STATE ARCHITECTURE ---
  const [isSignUpMode, setIsSignUpMode] = useState(false); // Toggles between Login and Register views
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  // Multilingual labels for the password interface forms
  const ui = {
    titleLogin: { en: "Welcome Back", zh_hk: "歡迎回來" },
    subLogin: { en: "Sign in with your email and password to track properties.", zh_hk: "請輸入您的電子郵件及密碼以管理您的關注項目。" },
    titleRegister: { en: "Create Client Account", zh_hk: "註冊客戶帳戶" },
    subRegister: { en: "Register your email profile to save your listing data.", zh_hk: "立即建立帳戶，開啟您的一手新盤追蹤功能。" },
    emailLabel: { en: "Email Address", zh_hk: "電子郵件地址" },
    passLabel: { en: "Account Password", zh_hk: "帳戶安全密碼" },
    btnLogin: { en: "Sign In Safely", zh_hk: "安全登入" },
    btnRegister: { en: "Complete Registration", zh_hk: "立即註冊" },
    switchRegister: { en: "New to EstateFlow? Create an account ➔", zh_hk: "首次使用？立即註冊新帳戶 ➔" },
    switchLogin: { en: "Already have an account? Sign in here ➔", zh_hk: "已有專屬帳戶？按此前往登入 ➔" },
    placeholderEmail: { en: "yourname@domain.com", zh_hk: "請輸入電郵地址..." },
    placeholderPass: { en: "••••••••", zh_hk: "請輸入密碼..." }
  };

  // --- ACTIONS: LOG IN EXECUTIONS ---
  async function handleSignIn(e) {
    e.preventDefault();
    if (!email || !password) return;
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
      setMessage({ 
        text: lang === 'en' ? "🎉 Authentication verified! Redirecting..." : "🎉 登入成功！正在載入專屬首頁...", 
        isError: false 
      });
      setTimeout(() => { window.location.href = "/"; }, 1000);
    }
  }

  // --- ACTIONS: REGISTER NEW ACCOUNTS ---
  async function handleSignUp(e) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setMessage({ text: '', isError: false });

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    setLoading(false);
    if (error) {
      setMessage({ text: `❌ ${error.message}`, isError: true });
    } else if (data?.user) {
      setMessage({ 
        text: lang === 'en' ? "🎉 Registration complete! Account activated instantly." : "🎉 帳戶註冊成功！已為您即時開通權限。", 
        isError: false 
      });
      setTimeout(() => { window.location.href = "/"; }, 1000);
    }
  }

  return (
    <div class="max-w-md mx-auto bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm space-y-6 mt-16">
      
      {/* Header Switching Identity Titles */}
      <div class="text-center space-y-1.5">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto font-bold shadow-inner">🔐</div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">
          {isSignUpMode ? ui.titleRegister[lang] : ui.titleLogin[lang]}
        </h2>
        <p class="text-xs text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto">
          {isSignUpMode ? ui.subRegister[lang] : ui.subLogin[lang]}
        </p>
      </div>

      {/* Operation Feedback Banners */}
      {message.text && (
        <div class={`p-4 rounded-xl text-xs font-semibold border transition-all leading-relaxed ${message.isError ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
          {message.text}
        </div>
      )}

      {/* Core HTML Entry Form */}
      <form class="space-y-4" onSubmit={isSignUpMode ? handleSignUp : handleSignIn}>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{ui.emailLabel[lang]}</label>
          <input 
            type="email" 
            required
            disabled={loading}
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold transition-all disabled:opacity-50" 
            placeholder={ui.placeholderEmail[lang]} 
          />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{ui.passLabel[lang]}</label>
          <input 
            type="password" 
            required
            minLength={6} // Supabase requires passwords to be at least 6 characters long
            disabled={loading}
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm font-semibold transition-all disabled:opacity-50" 
            placeholder={ui.placeholderPass[lang]} 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          class="w-full mt-2 py-3 bg-blue-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-blue-700 shadow-md active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {loading ? "..." : isSignUpMode ? ui.btnRegister[lang] : ui.btnLogin[lang]}
        </button>
      </form>

      {/* Sub Mode View Toggle Switch Link */}
      <div class="text-center pt-2">
        <button 
          onClick={() => {
            setIsSignUpMode(!isSignUpMode);
            setMessage({ text: '', isError: false }); // Clear lingering validation blocks on flip
          }}
          class="text-xs font-bold text-blue-600 hover:underline transition-all"
        >
          {isSignUpMode ? ui.switchLogin[lang] : ui.switchRegister[lang]}
        </button>
      </div>

    </div>
  );
}
