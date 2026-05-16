'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TopBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    if (data.name) setUser(data);
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(5, 5, 7, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-glass)',
      padding: '12px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: 'var(--grad-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px var(--primary-glow)'
        }}>
          <span className="mi" style={{ color: 'white', fontSize: 22 }}>auto_awesome</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h1 style={{ fontSize: 16, fontWeight: 800, color: 'white', lineHeight: 1.1, letterSpacing: 0.5 }}>SBR ACADEMY</h1>
          <span style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: 1.2, fontWeight: 600, textTransform: 'uppercase' }}>Error Analysis</span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user ? (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 10, 
            background: 'var(--bg-glass)', padding: '5px 12px 5px 6px', 
            borderRadius: 30, border: '1px solid var(--border-glass)' 
          }}>
            <img 
              src={user.image || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name} 
              style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--primary)' }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{user.name.split(' ')[0]}</span>
          </div>
        ) : (
          <Link href="/auth" className="premium-btn" style={{ padding: '8px 16px', fontSize: 13, height: 36 }}>Login</Link>
        )}
      </div>
    </header>
  );
}
