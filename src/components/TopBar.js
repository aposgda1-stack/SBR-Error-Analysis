'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TopBar({ title, right }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    // Countdown to 9:00 AM tomorrow (exam time)
    const updateTimer = () => {
      const now = new Date();
      const exam = new Date();
      exam.setDate(exam.getDate() + (now.getHours() >= 9 ? 1 : 0));
      exam.setHours(9, 0, 0, 0);
      const diff = exam - now;
      if (diff <= 0) { setTime('00:00:00'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTime(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    updateTimer();
    const iv = setInterval(updateTimer, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'var(--surface)',
      borderBottom: '1px solid var(--outline-variant)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 16px', height: 48,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 22 }}>clinical_notes</span>
        <span style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 18, letterSpacing: '-0.02em', color: 'var(--primary)' }}>
          {title || 'MISSION CONTROL'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link href="/stats" style={{ textDecoration: 'none', display: 'flex' }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)', fontSize: 24 }}>account_circle</span>
        </Link>
        <div style={{
          fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 500,
          color: 'var(--primary)',
          background: 'var(--surface-container-high)',
          padding: '4px 12px', borderRadius: 20,
          border: '1px solid rgba(255,181,158,0.3)',
          boxShadow: '0 0 8px rgba(255,181,158,0.15)',
        }}>
          {time}
        </div>
      </div>
    </header>
  );
}
