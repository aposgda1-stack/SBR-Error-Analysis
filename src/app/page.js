'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const ARENAS = [
  { id: 'errors', label: 'الـ 130 جملة', sub: '130 Pairs', icon: 'gps_fixed', color: '#7c4dff', href: '/arena/errors' },
  { id: 'grammar', label: 'القواعد', sub: 'Grammar', icon: 'bolt', color: '#00e5ff', href: '/arena/grammar' },
  { id: 'phrasal', label: 'الأفعال الاصطلاحية', sub: 'Phrasal Verbs', icon: 'sync_alt', color: '#ff4081', href: '/arena/phrasal' },
  { id: 'work', label: 'المصطلحات العملية', sub: 'Work Vocab', icon: 'work_outline', color: '#ffea00', href: '/arena/work' },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ done: 0, accuracy: 85, streak: 4 });

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    if (!localUser.userId) { router.push('/auth'); return; }
    setUser(localUser);

    const progress = JSON.parse(localStorage.getItem('sbr_progress') || '{}');
    setStats(s => ({ ...s, done: Object.keys(progress).length }));
  }, []);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 110 }}>
      <TopBar />
      
      <div style={{ padding: '24px 20px', maxWidth: 600, margin: '0 auto' }}>
        {/* Welcome Section */}
        <div className="animate-slide-up" style={{ marginBottom: 32, textAlign: 'left' }}>
          <h2 style={{ fontSize: 24, fontWeight: 400, color: 'var(--text-dim)', marginBottom: 4 }}>Welcome back,</h2>
          <h3 style={{ fontSize: 32, fontWeight: 800, color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}>
            {user?.name || 'Explorer'} <span style={{ fontSize: 24 }}>👋</span>
          </h3>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Completed', val: stats.done, icon: 'check_circle', color: 'var(--secondary)' },
            { label: 'Accuracy', val: stats.accuracy + '%', icon: 'insights', color: 'var(--primary)' },
            { label: 'Streak', val: stats.streak, icon: 'local_fire_department', color: 'var(--accent)' }
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '16px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="mi" style={{ color: s.color, fontSize: 22, marginBottom: 8 }}>{s.icon}</span>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'monospace' }}>{s.val}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Panic Mode */}
        <div 
          onClick={() => router.push('/panic')}
          className="glass-panel" 
          style={{ 
            padding: '20px', marginBottom: 40, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'linear-gradient(90deg, rgba(255,64,129,0.08) 0%, rgba(124,77,255,0.05) 100%)',
            border: '1px solid rgba(255,64,129,0.2)'
          }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255,64,129,0.3)' }}>
              <span className="mi" style={{ color: 'white', fontSize: 22 }}>warning</span>
            </div>
            <div>
              <h4 style={{ fontSize: 17, fontWeight: 700 }}>Panic Mode</h4>
              <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>Review recent mistakes</p>
            </div>
          </div>
          <span className="mi" style={{ color: 'var(--text-muted)' }}>chevron_right</span>
        </div>

        {/* Arenas Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h4 style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 800 }}>Learning Arenas</h4>
          <div style={{ height: 1, flex: 1, background: 'var(--border-glass)', marginLeft: 16 }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {ARENAS.map((arena, i) => (
            <div 
              key={arena.id} 
              onClick={() => router.push(arena.href)}
              className="glass-card animate-slide-up" 
              style={{ 
                padding: '24px 20px', cursor: 'pointer', 
                animationDelay: `${i * 0.1}s`,
                background: `linear-gradient(135deg, ${arena.color}10 0%, transparent 100%)`,
                position: 'relative', overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ 
                  width: 40, height: 40, borderRadius: 10, 
                  background: arena.color, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 16px ${arena.color}30`
                }}>
                  <span className="mi" style={{ color: 'white', fontSize: 20 }}>{arena.icon}</span>
                </div>
              </div>
              
              <div style={{ textAlign: 'right', direction: 'rtl' }}>
                <h5 style={{ fontSize: 18, fontWeight: 800, marginBottom: 2, color: 'white' }}>{arena.label}</h5>
                <p style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>{arena.sub}</p>
              </div>

              <div style={{ height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 2, marginTop: 16, overflow: 'hidden' }}>
                <div style={{ width: '35%', height: '100%', background: arena.color, boxShadow: `0 0 10px ${arena.color}` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
