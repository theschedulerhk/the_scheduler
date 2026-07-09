'use client';
import { useState } from 'react';
import { supabase } from '../../utils/supabase';

export default function LoginPage({ lang = 'en' }) {
  // --- ACCOUNT DATA STATE ARCHITECTURE ---
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  // Multilingual UI layout translation object dictionaries
  const ui = {
    title: { en: "Secure Access Portal", zh_hk: "置業安全認證門戶" },
    sub: { en: "Enter your details to receive a one-time verification token.", zh_hk: "輸入您的電子郵件以獲取一次性安全驗證碼。" },
    emailLabel: { en: "Registered Email Address", zh_hk: "電子郵件地址" },
    codeLabel: { en: "6-Digit Verification OTP Code", zh_hk: "輸入6位數安全驗證碼" },
    btnSend: { en: "Send Verification Code", zh_hk: "發送驗證碼" },
    btnVerify: { en: "Verify & Log In", zh_hk: "驗證並登入" },
    placeholderEmail: { en: "client@example.com", zh_hk: "請輸入您的電子郵件..." },
    placeholderCode: { en: "123456", zh_hk: "六位數字..." }
  };

  // --- STEP 1: REQUEST PASSWORDLESS OTP ---
  async function handleSendOTP(e) {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setMessage({ text: '', isError: false });

    // Request Supabase to mail an OTP code string to the visitor
    const { error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // Change this if you want the user to click a link instead of copying numbers
        shouldCreateUser: true, 
      }
    });

    setLoading(false);
    if (error) {
      setMessage({ text: `❌ ${error.message}`, isError: true });
    } else {
      setIsCodeSent(true);
      setMessage({ 
        text: lang === 'en' ? "✨ Verification code dispatched to your inbox!" : "✨ 驗證碼已成功發送至您的電子郵件！", 
        isError: false 
      });
    }
  }

  // --- STEP 2: VERIFY SUBMITTED OTP TOKEN ---
  async function handleVerifyOTP(e) {
    e.preventDefault();
    if (!otpCode) return;

    setLoading(true);
    setMessage({ text: '', isError: false });

    // Authenticate token session parameters
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otpCode,
      type: 'email' // When you upgrade to SMS later, you simply change this string parameter to 'sms'
    });

    setLoading(false);
    if (error) {
      setMessage({ text: `❌ ${error.message}`, isError: true });
    } else if (data?.user) {
      setMessage({ 
        text: lang === 'en' ? `🎉 Success! Logged in as: ${data.user.email}` : `🎉 驗證成功！歡迎登入：${data.user.email}`, 
        isError: false 
      });
      // Optional: window.location.href = "/"; -> Redirect user back to home or client tracking dashboard
    }
  }

  return (
    <div class="max-w-md mx-auto bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm space-y-6 mt-16">
      
      {/* Visual Header Identity */}
      <div class="text-center space-y-1.5">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto font-bold shadow-inner">🔐</div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">{ui.title[lang]}</h2>
        <p class="text-xs text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto">{ui.sub[lang]}</p>
      </div>

      {/* Dynamic Network Alert Banner */}
      {message.text && (
        <div class={`p-4 rounded-xl text-xs font-bold border transition-all ${message.isError ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
          {message.text}
        </div>
      )}

      {/* Conditional UI Step Routing Form */}
      <form class="space-y-4" onSubmit={isCodeSent ? handleVerifyOTP : handleSendOTP}>
        
        {/* Phase A View: Capture Email */}
        {!isCodeSent ? (
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
            <button 
              type="submit" 
              disabled={loading}
              class="w-full mt-4 py-3 bg-blue-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-blue-700 shadow-md shadow-blue-500/10 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              {loading ? "..." : ui.btnSend[lang]}
            </button>
          </div>
        ) : (
          /* Phase B View: Capture 6-digit Code token text string box */
          <div>
            <div class="mb-4 text-xs font-semibold text-slate-500">
              {lang === 'en' ? "Sent targeting account:" : "正驗證目標賬戶："} <span class="text-slate-800 font-bold underline">{email}</span>
            </div>
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{ui.codeLabel[lang]}</label>
            <input 
              type="text" 
              required
              maxLength={6}
              disabled={loading}
              value={otpCode} 
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} // Strips any non-number letters automatically
              class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-center text-lg font-mono font-bold tracking-widest disabled:opacity-50" 
              placeholder={ui.placeholderCode[lang]} 
            />
            <div class="flex gap-3 mt-4">
              <button 
                type="button" 
                onClick={() => setIsCodeSent(false)}
                class="px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-200 transition-colors"
              >
                ← Back
              </button>
              <button 
                type="submit" 
                disabled={loading}
                class="flex-1 py-3 bg-emerald-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-emerald-700 shadow-md shadow-emerald-500/10 active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? "..." : ui.btnVerify[lang]}
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}
