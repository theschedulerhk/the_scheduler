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
    </div>
  );
}
