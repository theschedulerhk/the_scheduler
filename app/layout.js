import './globals.css';

export const metadata = {
  title: 'My Store & Tracking',
  description: 'Built with Next.js and Supabase',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', color: '#333' }}>
        {/* Global Navigation Bar */}
        <nav style={{ display: 'flex', gap: '20px', padding: '15px 30px', backgroundColor: '#fff', borderBottom: '1px solid #ddd' }}>
          <a href="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: '#0070f3' }}>🏬 Home / Search</a>
          <a href="/login" style={{ textDecoration: 'none', color: '#333' }}>🔐 Login & Register</a>
          <a href="/tracking" style={{ textDecoration: 'none', color: '#333' }}>📦 Track Orders</a>
        </nav>
        
        {/* Page Content Container */}
        <main style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
