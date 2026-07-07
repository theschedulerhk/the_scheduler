'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabase';

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // Fetch all logged orders
  async function loadOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('updated_at', { ascending: false });
    if (!error && data) setOrders(data);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  // Update specific order step in Supabase
  async function handleStatusChange(orderId, newStatus) {
    setLoadingId(orderId);
    
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    setLoadingId(null);
    if (error) {
      alert(`Update failed: ${error.message}`);
    } else {
      loadOrders(); // Refresh table view text values
    }
  }

  return (
    <div class="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Management Panel</h2>
        <p class="text-sm text-slate-500 mt-1">Control client-facing logistical status updates directly.</p>
      </div>

      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th class="p-4">Customer Email</th>
              <th class="p-4">Product Purchased</th>
              <th class="p-4">Current Status Step</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-slate-100">
            {orders.map(order => (
              <tr key={order.id} class="hover:bg-slate-50/50 transition-colors">
                <td class="p-4 font-medium text-slate-900">{order.customer_email}</td>
                <td class="p-4 text-slate-600">{order.product_name}</td>
                <td class="p-4">
                  <select 
                    value={order.status} 
                    disabled={loadingId === order.id}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    class="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-xs font-semibold text-slate-700 disabled:opacity-50"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Processing">Processing</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                  {loadingId === order.id && <span class="text-xs text-blue-500 ml-2">Saving...</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div class="text-center py-12 text-slate-400 text-sm">No recorded customer data available.</div>
        )}
      </div>
    </div>
  );
}
