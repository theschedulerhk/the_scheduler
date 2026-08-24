'use client';
import { useEffect } from 'react';
import { supabase } from '../../../utils/supabase';

export default function AuthCallbackPage() {
  useEffect(() => {
    async function handleAuthCallback() {
      // 1. Grab the hidden recovery tokens from your browser address link string properties
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(window.location.search);
      
      const type = searchParams.get('type') || (hash.includes('type=recovery') ? 'recovery' : null);

      // 2. If the email link is a password recovery check token, route them straight to the form
      if (type === 'recovery') {
        window.location.href = '/reset-password';
      } else {
        // Otherwise, send standard confirmations back to the root homepage
        window.location.href = '/';
      }
    }
    handleAuthCallback();
  }, []);

  return (
    <div class="max-w-md mx-auto px-4 py-32 text-center text-slate-400 font-bold text-sm animate-pulse">
      🔒 Checking secure recovery authorization credentials...
    </div>
  );
}
