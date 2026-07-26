'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

export default function reg_success() {
  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <div class="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Registered Successfully</h2>
        <p class="text-sm text-slate-500 mt-1">Your email has been verified, you may login to your accunt using your email and password.</p>
      </div>

    </div>
  );
}
