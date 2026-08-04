'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

export default function MasterAdminPanel() {
  const [currentRole, setCurrentRole] = useState(null); // 'master' or 'admin'
  const [incomingApplications, setIncomingApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAdminAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single();
      if (profile?.role !== 'master' && profile?.role !== 'admin') {
        alert("🔒 Unauthorized. Access restricted to Master and Admin roles.");
        window.location.href = '/';
        return;
      }
      setCurrentRole(profile.role);
      loadApplications(profile.role);
    }
    verifyAdminAuth();
  }, []);

  async function loadApplications(role) {
    setLoading(true);
    let query = supabase.from('applications').select('*');
    
    if (role === 'master') {
      // Master sees EVERYTHING currently stuck at the initial filtration checkpoint
      query = query.eq('platform_filter_status', 'pending_master');
    } else {
      // Admins ONLY see files that Master explicitly approved for distribution handling
      query = query.eq('platform_filter_status', 'approved_for_admins');
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (!error && data) setIncomingApplications(data);
    setLoading(false);
  }

  // ACTION 1: Master hands application down to Admin partners
  async function passToAdmins(appId) {
    const { error } = await supabase
      .from('applications')
      .update({ platform_filter_status: 'approved_for_admins' })
      .eq('id', appId);
    if (!error) loadApplications(currentRole);
  }

  // ACTION 2: Master or Admin pushes application live to the Agent Matching Board Pool
  async function distributeToAgents(appId) {
    const { error } = await supabase
      .from('applications')
      .update({ 
        platform_filter_status: 'distributed_to_agents',
        step_id: 1 // Moves step_id to 1 so it populates on the Agent's Uber Match Board Lobby!
      })
      .eq('id', appId);
    if (!error) loadApplications(currentRole);
  }

  if (loading) return <div class="text-center py-20 font-bold text-slate-400 animate-pulse">🔒 Verifying Platform Administrative Authority Clearance...</div>;

  return (
    <div class="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div class="border-b border-slate-200 pb-4">
        <span class="px-2.5 py-1 text-[10px] font-black tracking-wider uppercase rounded-md text-white bg-slate-900">
          👑 Active Role: {currentRole?.toUpperCase()}
        </span>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight mt-2">Administrative Distribution Deck</h2>
        <p class="text-sm text-slate-500 mt-0.5">Filter incoming property allocations and regulate dashboard transfers seamlessly.</p>
      </div>

      {incomingApplications.length === 0 ? (
        <div class="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
          No pipeline applications are currently awaiting review under your authorization level.
        </div>
      ) : (
        <div class="space-y-4">
          {incomingApplications.map(app => (
            <div key={app.id} class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-3">
                  <span class="font-bold text-slate-900">Application Key: #{app.id}</span>
                  <span class="text-xs font-mono text-slate-400">Buyer U_ID: {app.u_id?.substring(0,8)}...</span>
                </div>
                <p class="text-sm text-slate-600 font-semibold">Requested Commission Split Cut: <span class="text-emerald-600 font-bold">{app.rebate}%</span></p>
              </div>

              {/* Contextual Action Button Clustered Rows */}
              <div class="flex gap-2 w-full md:w-auto">
                {currentRole === 'master' && (
                  <button 
                    onClick={() => passToAdmins(app.id)}
                    class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all flex-1 md:flex-none"
                  >
                    Pass to Admin Team ➔
                  </button>
                )}
                <button 
                  onClick={() => distributeToAgents(app.id)}
                  class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex-1 md:flex-none shadow-md shadow-blue-500/10"
                >
                  ⚡ Release to Agent Pool
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
