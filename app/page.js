'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products from database
  async function fetchProducts() {
    let query = supabase.from('products').select('*');
    
    // Filter if user has typed something
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }

    const { data, error } = await query;
    if (!error && data) setProducts(data);
  }

  // Fetch automatically when page loads or when search term changes
  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  return (
    <div>
      <h1>Welcome to Our Store</h1>
      <p>Search for items you like below.</p>

      {/* Search Input */}
      <input 
        type="text" 
        placeholder="🔍 Type product name to search..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '25px', boxSizing: 'border-box' }}
      />

      {/* Grid Displaying Products */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div key={product.id} style={{ background: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
            <p style={{ color: '#666', fontSize: '14px' }}>{product.description}</p>
            <button style={{ width: '100%', padding: '8px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Place Offline Order
            </button>
          </div>
        ))}
      </div>
      {products.length === 0 && <p style={{ color: '#999' }}>No products found matching your search.</p>}
    </div>
  );
}
