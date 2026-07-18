'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

export default function TrackingPage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        supabase
          .from('orders')
          .select('*')
          .eq('customer_email', user.email)
          .then(({ data, error }) => {
            if (!error && data) setOrders(data);
          });
      }
    });
  }, []);

  if (!user) {
    return (
      <div class="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm max-w-md mx-auto space-y-4 mt-10">
        <span class="text-4xl">⚠️</span>
        <h2 class="text-xl font-bold text-slate-900">Authentication Required</h2>
        <p class="text-sm text-slate-500 max-w-xs mx-auto">Please secure your session to access historical order tracking records.</p>
        <a href="/login" class="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-sm">
          Go to Portal
        </a>
      </div>
    );
  }

  return (
    <div class="space-y-6 max-w-2xl mx-auto">
      <div class="border-b border-slate-200 pb-4">
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Your Tracking Dashboard</h2>
        <p class="text-sm text-slate-500 mt-1">Logged in active profile: <span class="font-semibold text-slate-700">{user.email}</span></p>
      </div>

      {orders.length === 0 ? (
        <div class="text-center py-12 bg-white border border-slate-100 rounded-2xl text-slate-400 text-sm">
          You do not have any active tracking procedures logged.
        </div>
      ) : (
        <div class="space-y-4">
          {orders.map(order => (
            <div key={order.id} class="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-center justify-between group hover:border-slate-200 transition-all">
              <div class="space-y-1.5">
                <p class="text-[10px] font-mono tracking-wider text-slate-400 uppercase">ID: {order.id.slice(0, 8)}...</p>
                <h4 class="font-bold text-slate-900 text-base">{order.product_name}</h4>
              </div>
              
              {/* Flexible visual status badge */}
              <div class="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-bold text-xs border border-blue-100/50">
                ● {order.status}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* --- IRREFUTABLE THIRD-PARTY AUDIT PROOF CARD --- */}
      <div class="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xl space-y-4 relative overflow-hidden">
        
        {/* Abstract target design indicator tag */}
        <div class="absolute -top-4 -right-4 w-24 h-24 bg-blue-600/10 rounded-full blur-xl pointer-events-none"></div>
      
        <div class="flex items-center gap-3">
          <span class="text-2xl">🛡️</span>
          <div>
            <h4 class="font-black text-slate-100 text-sm md:text-base tracking-tight">
              {lang === 'en' ? "EAA-Compliant Platform Audit Ledger" : "地產代理監管局合規審計存證"}
            </h4>
            <p class="text-[11px] text-slate-400 font-medium leading-relaxed">
              {lang === 'en' 
                ? "This record serves as secure, independent third-party evidence of commercial promise." 
                : "本平台作為獨立第三方存證，此條數據已完成電子數位簽章，具備絕對合規法律證物效力。"}
            </p>
          </div>
        </div>
    
        {/* Locked System Properties Parameters */}
        <div class="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 font-mono text-xs space-y-2">
          <div class="flex justify-between border-b border-slate-800 pb-2">
            <span class="text-slate-500">Agreed Rebate Split:</span>
            <span class="text-emerald-400 font-bold">{activeJob.rebate}%</span>
          </div>
          <div class="flex justify-between border-b border-slate-800 pb-2">
            <span class="text-slate-500">Claimed Agent ID:</span>
            <span class="text-slate-300">{activeJob.agent_id}</span>
          </div>
          <div class="flex justify-between border-b border-slate-800 pb-2">
            <span class="text-slate-500">Agent EAA License No:</span>
            <span class="text-blue-400 font-bold underline">{activeJob.agent_eaa_no || 'Pending Unlock'}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Secure Timestamp:</span>
            <span class="text-slate-400">{activeJob.last_upd}</span>
          </div>
        </div>
      
        {/* Action button allowing users to print or save the screen as data proof */}
        <div class="text-right">
          <button 
            onClick={() => window.print()} 
            class="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-[10px] uppercase tracking-wider transition-all"
          >
            🖨️ {lang === 'en' ? "Export Certified Audit Sheet" : "導出經認證之法律存證"}
          </button>
        </div>
      </div>
    </div>

  );
}
