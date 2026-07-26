'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function WelcomePage({ lang = 'en' }) {
  const [countdown, setCountdown] = useState(5);

  // Automatic countdown timer to guide the user to the login screen
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/login'; // Redirect to sign in page
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const ui = {
    title: { en: "Email Verification Successful!", zh_hk: "電子郵件認證成功！" },
    sub: { en: "Your EstateFlow profile has been securely activated on the blockchain ledger network.", zh_hk: "您的系統帳戶身份已成功啟用，所有安全存證及合規權限已即時開通。" },
    cardTitle: { en: "Registration Verified", zh_hk: "認證已完成" },
    desc: { en: "You have successfully verified your email address. You can now log into your distinct dashboard space as either a Buyer or an Agent.", zh_hk: "您已成功驗證您的電郵地址。您現在可以隨時使用單一電郵，分流登入您的專屬買家或地產代理帳戶。" },
    redirectText: { en: "Automatically redirecting to login portal in", zh_hk: "系統將於以下秒數內自動跳轉至登入口戶：" },
    btnManual: { en: "Go to Login Now ➔", zh_hk: "立即前往登入頁面 ➔" }
  };

  return (
    <div class="max-w-xl mx-auto px-4 py-16 text-center">
      <div class="bg-white border border-slate-200/80 p-8 md:p-10 rounded-3xl shadow-sm space-y-6 relative overflow-hidden">
        
        {/* Decorative Success Badge Icon */}
        <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl mx-auto font-bold shadow-inner border border-emerald-100/50 animate-bounce">
          ✓
        </div>

        {/* Text Headers */}
        <div class="space-y-2">
          <span class="text-[10px] font-bold tracking-widest text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-md">
            {ui.cardTitle[lang]}
          </span>
          <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {ui.title[lang]}
          </h2>
          <p class="text-xs text-slate-400 font-medium leading-relaxed px-4">
            {ui.sub[lang]}
          </p>
        </div>

        {/* Content Box */}
        <div class="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 text-sm text-slate-600 leading-relaxed text-left space-y-3">
          <p>{ui.desc[lang]}</p>
        </div>

        {/* Countdown Status Ticker */}
        <div class="text-xs font-semibold text-slate-500 bg-blue-50/50 border border-blue-100/50 py-3 rounded-xl">
          ⏳ {ui.redirectText[lang]} <span class="text-blue-600 font-black text-sm px-1 font-mono">{countdown}</span>s
        </div>

        {/* Fallback Manual Navigation Action Button */}
        <div class="pt-2">
          <Link 
            href="/login" 
            class="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all active:scale-[0.99]"
          >
            {ui.btnManual[lang]}
          </Link>
        </div>

      </div>
    </div>
  );
}
