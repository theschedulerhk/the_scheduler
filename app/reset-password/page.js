'use client';
import { useState } from 'react';
import { supabase } from '../../utils/supabase';

export default function ResetPasswordPage({ lang = 'en' }) {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  async function handlePasswordUpdate(e) {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert(lang === 'en' ? "Password must be at least 6 characters." : "密碼長度必須至少為 6 位數。");
      return;
    }

    setLoading(true);
    setMessage({ text: '', isError: false });

    // Updates the password for the active recovery session token
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    setLoading(false);
    if (error) {
      setMessage({ text: `❌ ${error.message}`, isError: true });
    } else {
      setMessage({ 
        text: lang === 'en' ? "🎉 Password updated successfully! Redirecting to login..." : "🎉 密碼更新成功！正在跳轉至登入頁面...", 
        isError: false 
      });
      setTimeout(() => { window.location.href = '/login'; }, 2000);
    }
  }

  return (
    <div class="max-w-md mx-auto bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6 mt-16">
      <div class="text-center space-y-1.5">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto font-bold shadow-inner">🔒</div>
        <h2 class="text-xl font-black text-slate-900 tracking-tight">
          {lang === 'en' ? "Set New Password" : "設定新帳戶密碼"}
        </h2>
        <p class="text-xs text-slate-400 font-medium">
          {lang === 'en' ? "Please input your secure new password blueprint below." : "請在下方輸入您要修改的全新安全密碼。"}
        </p>
      </div>

      {message.text && (
        <div class={`p-4 rounded-xl text-xs font-semibold border leading-relaxed ${message.isError ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handlePasswordUpdate} class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            {lang === 'en' ? "New Password" : "全新安全密碼"}
          </label>
          <input 
            type="password" 
            required 
            minLength={6}
            disabled={loading}
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)}
            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
            placeholder="••••••••" 
          />
        </div>
        <button type="submit" disabled={loading} class="w-full py-3 bg-blue-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-blue-700 transition-all">
          {loading ? "..." : (lang === 'en' ? "Update Password" : "確認更改密碼")}
        </button>
      </form>
    </div>
  );
}
