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

  const ui = {
    titleLogin: { en: "Secure Sign In Portal", zh_hk: "系統安全登入門戶" },
    titleRegister: { en: "Create Unique Profile", zh_hk: "註冊新帳戶身份" },
    subText: { en: "Please select your active role below. You can maintain distinct Buyer and Agent spaces under the same email inbox.", zh_hk: "請在下方選擇您目前要使用的身份。您可以使用相同的電郵同時開通獨立的買家與代理帳戶。" },
    emailLabel: { en: "Email Address", zh_hk: "電子郵件地址" },
    passLabel: { en: "Account Password", zh_hk: "帳戶安全密碼" },
    nameLabel: { en: "Full Legal Name", zh_hk: "法定真實姓名 (與身份證相同)" },
    phoneLabel: { en: "WhatsApp Contact Number", zh_hk: "WhatsApp 聯絡電話" },
    roleLabel: { en: "Select Access Role Identity (Mandatory)", zh_hk: "選擇目前登入/註冊身份 (必填)" },
    roleBuyer: { en: "Property Buyer", zh_hk: "一手新盤買家" },
    roleAgent: { en: "Real Estate Agent", zh_hk: "持牌地產代理經紀" },
    roleOthers: { en: "Others / Admin / Master", zh_hk: "其他 / 平台管理員" },
    btnLogin: { en: "Secure Login ➔", zh_hk: "確認安全登入 ➔" },
    btnRegister: { en: "Complete Registration", zh_hk: "完成註冊並開通" },
    switchRegister: { en: "New to EstateFlow? Create an account ➔", zh_hk: "首次使用？立即註冊新帳戶 ➔" },
    switchLogin: { en: "Already have an account? Sign in here ➔", zh_hk: "已有專屬帳戶？按此前往登入 ➔" }
  };

  // Improved format rule helper: Administrative accounts do NOT get tagged!
  const formatTaggedEmail = (emailStr, roleStr) => {
    const cleanEmail = emailStr.trim().toLowerCase();
    if (roleStr === 'others') {
      return cleanEmail; // Returns raw string (e.g. master@theschedulerhk.com) without modifications
    }
    const parts = cleanEmail.split('@');
    if (parts.length !== 2) return cleanEmail;
    return `${parts[0]}+${roleStr}@${parts[1]}`;
  };

  // --- ACTIONS: SUBMIT LOGIC ---
  async function handleFormSubmit(e) {
    e.preventDefault();
    if (!rawEmail || !password) return;

    setLoading(true);
    setMessage({ text: '', isError: false });

    // Generate the correct email target variation string
    const processedEmail = formatTaggedEmail(rawEmail, selectedRole);

    if (isSignUpMode) {
      // BLOCK INTERNET USERS FROM REGISTERING AS 'OTHERS' PRIVATELY
      if (selectedRole === 'others') {
        setMessage({ text: "❌ Access Denied. Administrative roles can only be initialized manually by the Master system console.", isError: true });
        setLoading(false);
        return;
      }

      // STANDARD REGISTRATION FOR BUYERS / AGENTS
      const { data, error } = await supabase.auth.signUp({
        email: processedEmail,
        password: password,
        options: {
          data: {
            role: selectedRole,
            full_name: fullName,
            whatsapp_number: whatsapp,
            display_email: rawEmail.trim()
          }
        }
      });

      setLoading(false);
      if (error) {
        setMessage({ text: `❌ ${error.message}`, isError: true });
      } else if (data?.user) {
        setMessage({ text: lang === 'en' ? `🎉 Registration complete for [${selectedRole.toUpperCase()}].` : `🎉 註冊成功！您的專屬帳戶已即時開通。`, isError: false });
        setTimeout(() => { window.location.href = "/"; }, 1500);
      }

    } else {
      // EXECUTE LOGIN SYSTEM FOR ALL 4 ROLES
      const { data, error } = await supabase.auth.signInWithPassword({
        email: processedEmail,
        password: password,
      });

      setLoading(false);
      if (error) {
        setMessage({ text: `❌ ${error.message} (Verify your radio identity selector is accurate)`, isError: true });
      } else if (data?.user) {
        setMessage({ text: lang === 'en' ? "🎉 Access verified! Loading workspace..." : "🎉 認證成功！正在載入專屬控制大堂...", isError: false });
        
        // Smart Routing Trick: If Master or Admin signs in, skip the home loop and slide them straight into their control panels!
        const userRole = data.user.user_metadata?.role || 'buyer';
        setTimeout(() => {
          if (userRole === 'master' || userRole === 'admin') {
            window.location.href = "/master-panel"; // Redirect straight to management cockpit
          } else {
            window.location.href = "/";
          }
        }, 1000);
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
        {/* --- DYNAMIC RADIO BUTTON IDENTITY MATRIX --- */}
        <div class="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
          <label class="block text-xs font-bold uppercase tracking-wider text-slate-500">{ui.roleLabel[lang]}</label>
          
          <div class="flex flex-col gap-2">
            {/* 1. Buyer Option */}
            <label class={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all bg-white ${selectedRole === 'buyer' ? 'border-blue-600 ring-2 ring-blue-500/10' : 'border-slate-200'}`}>
              <div class="flex items-center gap-3">
                <input type="radio" name="role" value="buyer" checked={selectedRole === 'buyer'} onChange={() => setSelectedRole('buyer')} class="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                <span class="text-xs font-bold text-slate-700">🛒 {ui.roleBuyer[lang]}</span>
              </div>
            </label>

            {/* 2. Agent Option */}
            <label class={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all bg-white ${selectedRole === 'agent' ? 'border-blue-600 ring-2 ring-blue-500/10' : 'border-slate-200'}`}>
              <div class="flex items-center gap-3">
                <input type="radio" name="role" value="agent" checked={selectedRole === 'agent'} onChange={() => setSelectedRole('agent')} class="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                <span class="text-xs font-bold text-slate-700">💼 {ui.roleAgent[lang]}</span>
              </div>
            </label>

            {/* 3. Others / Admin Option */}
            <label class={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all bg-white ${selectedRole === 'others' ? 'border-slate-900 ring-2 ring-slate-900/10' : 'border-slate-200'}`}>
              <div class="flex items-center gap-3">
                <input type="radio" name="role" value="others" checked={selectedRole === 'others'} onChange={() => setSelectedRole('others')} class="w-4 h-4 text-slate-900 focus:ring-slate-900" />
                <span class="text-xs font-bold text-slate-700">🛠️ {ui.roleOthers[lang]}</span>
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
            Account Password
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
        
          {/* --- ENSURE THIS EXACT DIV SITS COHESIVELY INSIDE THIS CONTAINER LAYER --- */}
          <div class="text-right mt-1.5">
            <button 
              type="button" 
              onClick={handleForgotPassword}
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
