'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TopBar() {
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    if (data.name) setUser(data);

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 200,
      background: scrolled ? 'rgba(4, 2, 10, 0.92)' : 'rgba(4, 2, 10, 0.6)',
      backdropFilter: 'blur(32px) saturate(180%)',
      WebkitBackdropFilter: 'blur(32px) saturate(180%)',
      borderBottom: `1px solid ${scrolled ? 'rgba(167, 139, 250, 0.15)' : 'rgba(167, 139, 250, 0.07)'}`,
      padding: '10px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transition: 'all 0.4s ease',
      boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none'
    }}>
      {/* Aurora line at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: 'linear-gradient(90deg, transparent, var(--primary), var(--secondary), var(--accent), transparent)',
        opacity: 0.6
      }} />

      <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <div style={{
          width: 42, height: 42, borderRadius: 14,
          background: 'var(--grad-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px var(--primary-glow), 0 0 0 1px rgba(167,139,250,0.2)',
          position: 'relative', overflow: 'hidden',
          transition: 'transform 0.3s ease'
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%)'
          }} />
          <span className="mi" style={{ color: 'white', fontSize: 22, position: 'relative' }}>fact_check</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: 15, fontWeight: 800, color: 'white', lineHeight: 1.2,
            letterSpacing: 0.5, fontFamily: 'Plus Jakarta Sans'
          }}>SBR — ERROR ANALYSIS</span>
          <span style={{
            fontSize: 9, color: 'var(--primary)', letterSpacing: 2,
            fontWeight: 700, textTransform: 'uppercase', opacity: 0.8
          }}>Interactive Preparation</span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <Link href="/stats" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(167, 139, 250, 0.07)',
              padding: '5px 14px 5px 6px',
              borderRadius: 100,
              border: '1px solid rgba(167, 139, 250, 0.18)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}>
              {user.image ? (
                <img
                  src={user.image}
                  style={{
                    width: 30, height: 30, borderRadius: '50%', objectFit: 'cover',
                    border: '2px solid var(--primary)',
                    boxShadow: '0 0 12px var(--primary-glow)'
                  }}
                />
              ) : (
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'var(--grad-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 900, fontSize: 13,
                  boxShadow: '0 0 12px var(--primary-glow)'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
                  {user.name.split(' ')[0]}
                </span>
                <span style={{ fontSize: 9, color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>
                  Student
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <Link href="/auth" className="premium-btn" style={{ padding: '9px 20px', fontSize: 13 }}>
            Enter Academy
          </Link>
        )}
      </div>
    </header>
  );
}
