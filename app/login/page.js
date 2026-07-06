'use client';
import { useState } from 'react';
import { supabase } from '../../utils/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function handleSignUp(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setMessage(`Error: ${error.message}`);
    else setMessage('Success! Please check your email inbox to verify your account.');
  }

  async function handleLogin(e) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMessage(`Error: ${error.message}`);
    else setMessage(`Logged in successfully as: ${data.user.email}`);
  }

  return (
    <div class="max-w-md mx-auto bg-white border border-slate-100 p-8 rounded-2xl shadow-sm space-y-6 mt-10">
      <div class="text-center space-y-1">
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Account Portal</h2>
        <p class="text-sm text-slate-500">Sign in to track your order milestones live.</p>
      </div>

      {message && (
        <div class="p-4 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl border border-blue-100">
          {message}
        </div>
      )}

      <form class="space-y-4">
        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="you@example.com" />
        </div>

        <div>
          <label class="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm" placeholder="••••••••" />
        </div>

        <div class="flex gap-4 pt-2">
          <button onClick={handleLogin} type="submit" class="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-sm">
            Sign In
          </button>
          <button onClick={handleSignUp} type="button" class="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
