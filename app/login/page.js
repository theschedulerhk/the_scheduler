'use client';
import { useState } from 'react';
import { supabase } from '../../utils/supabase';

export default function LoginPage({ lang = 'en' }) {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [selectedRole, setSelectedRole] = useState('buyer'); // 'buyer' or 'agent'
  const [rawEmail, setRawEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [eaaLicenseNo, setEaaLicenseNo] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });

  const formatTaggedEmail = (emailStr, roleStr) => {
    const parts = emailStr.trim().split('@');
    if (parts.length !== 2) return emailStr;
    return `${parts}+${roleStr}@${parts}`.toLowerCase();
  };

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!rawEmail || !password) return;

    setLoading(true);
    setMessage({ text: '', isError: false });

    const processedEmail = formatTaggedEmail(rawEmail, selectedRole);
    let uploadedFileUrl = '';

    // Handle agent EAA cert photo upload step
    if (isSignUpMode && selectedRole === 'agent') {
      if (!file) {
        alert(lang === 'en' ? "Please upload your EAA license certificate card photo." : "請上載您的EAA代理牌照相片。");
        setLoading(false);
        return;
      }
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `certs/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('property-images').upload(filePath, file);
      if (uploadError) {
        setMessage({ text: `❌ Upload Failed: ${uploadError.message}`, isError: true });
        setLoading(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(filePath);
      uploadedFileUrl = publicUrl;
    }

    if (isSignUpMode) {
      // EXECUTE SECURE SIGN UP
      const { data, error } = await supabase.auth.signUp({
        email: processedEmail,
        password: password,
        options: {
          data: {
            role: selectedRole, // Buyer or Agent dynamically tagged from frontend UI selection
            full_name: fullName,
            whatsapp_number: whatsapp,
            display_email: rawEmail.trim(),
            company_license_no: eaaLicenseNo,
            eaa_cert_url: uploadedFileUrl
          }
        }
      });

      setLoading(false);
      if (error) {
        setMessage({ text: `❌ ${error.message}`, isError: true });
      } else if (data?.user) {
        setMessage({ text: lang === 'en' ? "🎉 Account registered successfully!" : "🎉 帳戶註冊成功！歡迎使用系統。", isError: false });
        setTimeout(() => { window.location.href = "/"; }, 1500);
      }
    } else {
      // EXECUTE SECURE SIGN IN
      const { data, error } = await supabase.auth.signInWithPassword({
        email: processedEmail,
        password: password,
      });

      setLoading(false);
      if (error) {
        setMessage({ text: `❌ ${error.message}`, isError: true });
      } else if (data?.user) {
        setMessage({ text: lang === 'en' ? "🎉 Access verified! Loading panel..." : "🎉 登入成功！正在進入控制大堂...", isError: false });
        setTimeout(() => { window.location.href = "/"; }, 1000);
      }
    }
  }

  async function handleForgotPassword() {
    if (!rawEmail) {
      alert(lang === 'en' ? "Please input your email address first." : "請先在上方輸入您的電子郵件地址。");
      return;
    }
    setLoading(true);
    
    // Combines email with your radio selection tagging (+buyer or +agent)
    const processedEmail = formatTaggedEmail(rawEmail, selectedRole);
  
    const { error } = await supabase.auth.resetPasswordForEmail(processedEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  
    setLoading(true);
    if (error) {
      setMessage({ text: `❌ ${error.message}`, isError: true });
    } else {
      setMessage({ 
        text: lang === 'en' ? "✨ Password recovery link sent! Check your inbox." : "✨ 密碼重置連結已成功發送！請檢查您的電子郵件信箱。", 
        isError: false 
      });
    }
  }

  return (
    <div class="max-w-md mx-auto bg-white border border-slate-200 p-8 rounded-3xl shadow-sm space-y-6 mt-6">
      <div class="text-center space-y-1.5">
        <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto font-bold shadow-inner">🔐</div>
        <h2 class="text-xl font-black text-slate-900 tracking-tight">{isSignUpMode ? "Create Platform Identity" : "Secure Log In"}</h2>
      </div>

      {message.text && (
        <div class={`p-4 rounded-xl text-xs font-semibold border leading-relaxed ${message.isError ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-blue-50 border-blue-100 text-blue-700'}`}>
          {message.text}
        </div>
      )}

      <form class="space-y-4" onSubmit={handleFormSubmit}>
        {/* Strict User-Facing Identity Toggle Selectors */}
        <div class="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">Access Identity</label>
          <div class="flex flex-col gap-2">
            <label class={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedRole === 'buyer' ? 'border-blue-600 bg-white ring-2 ring-blue-500/10' : 'border-slate-200'}`}>
              <div class="flex items-center gap-3">
                <input type="radio" name="role" value="buyer" checked={selectedRole === 'buyer'} onChange={() => setSelectedRole('buyer')} class="w-4 h-4 text-blue-600" />
                <span class="text-xs font-bold text-slate-700">🛒 Property Buyer (新盤買家)</span>
              </div>
            </label>
            <label class={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedRole === 'agent' ? 'border-blue-600 bg-white ring-2 ring-blue-500/10' : 'border-slate-200'}`}>
              <div class="flex items-center gap-3">
                <input type="radio" name="role" value="agent" checked={selectedRole === 'agent'} onChange={() => setSelectedRole('agent')} class="w-4 h-4 text-blue-600" />
                <span class="text-xs font-bold text-slate-700">💼 Real Estate Agent (持牌經紀)</span>
              </div>
            </label>
          </div>
        </div>

        {isSignUpMode && (
          <>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">Full Legal Name</label>
              <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="Chan Tai Man" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-500 mb-1">WhatsApp Number</label>
              <input type="tel" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="91234567" />
            </div>
          </>
        )}

        {isSignUpMode && selectedRole === 'agent' && (
          <div class="bg-amber-50 border border-amber-200 p-4 rounded-2xl space-y-3">
            <div>
              <label class="block text-xs font-bold text-amber-800 mb-1">EAA License Number</label>
              <input type="text" required value={eaaLicenseNo} onChange={(e) => setEaaLicenseNo(e.target.value)} class="w-full px-4 py-2 border border-amber-200 rounded-xl text-sm" placeholder="E-123456" />
            </div>
            <div>
              <label class="block text-xs font-bold text-amber-800 mb-1">Upload Certificate Card Photo</label>
              <input type="file" required accept="image/*" onChange={(e) => setFile(e.target.files[0])} class="w-full text-xs text-slate-500 cursor-pointer" />
            </div>
          </div>
        )}

        <div>
          <label class="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
          <input type="email" required value={rawEmail} onChange={(e) => setRawEmail(e.target.value)} class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm" placeholder="name@domain.com" />
        </div>
        <div>
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            {ui.passLabel[lang]}
          </label>
          <input 
            type="password" 
            required 
            minLength={6} 
            disabled={loading} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-semibold text-slate-800" 
            placeholder="••••••••" 
          />
        
          {/* --- ADD THIS CODES CONTAINER IMMEDIATELY BELOW THE PASSWORD INPUT --- */}
          <div class="text-right mt-1.5">
            <button 
              type="button" 
              onClick={handleForgotPassword} // ◄ Fires the background Supabase reset email trigger
              class="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors underline bg-transparent border-none cursor-pointer"
            >
              {lang === 'en' ? "Forgot Password?" : "忘記密碼？"}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} class="w-full py-3 bg-blue-600 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider hover:bg-blue-700 transition-all">
          {loading ? "..." : isSignUpMode ? "Register Account" : "Login Securely"}
        </button>
      </form>

      <div class="text-center pt-1">
        <button type="button" onClick={() => { setIsSignUpMode(!isSignUpMode); setMessage({ text: '', isError: false }); }} class="text-xs font-bold text-blue-600 hover:underline">
          {isSignUpMode ? ui.switchLogin[lang] : ui.switchRegister[lang]}
        </button>
      </div>
    </div>
  );
}
