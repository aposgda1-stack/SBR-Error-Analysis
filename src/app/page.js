'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const ARENAS = [
  { id: 'errors', label: 'الـ 130 جملة', sub: '130 Pairs', icon: 'target', color: '#7c4dff', href: '/arena/errors', total: 130 },
  { id: 'grammar', label: 'القواعد', sub: 'Grammar', icon: 'bolt', color: '#00e5ff', href: '/arena/grammar', total: 20 },
  { id: 'phrasal', label: 'الأفعال الاصطلاحية', sub: 'Phrasal Verbs', icon: 'link', color: '#ff4081', href: '/arena/phrasal', total: 40 },
  { id: 'work', label: 'المصطلحات العملية', sub: 'Work Vocab', icon: 'work', color: '#ffea00', href: '/arena/work', total: 30 },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ done: 0, accuracy: 0, streak: 0 });

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    if (!localUser.userId) {
      router.push('/auth');
      return;
    }
    setUser(localUser);

    const progress = JSON.parse(localStorage.getItem('sbr_progress') || '{}');
    const doneCount = Object.keys(progress).length;
    setStats({
      done: doneCount,
      accuracy: 85, // Placeholder
      streak: 4
    });

    // Sync with cloud
    fetch(`/api/user?userId=${localUser.userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.user?.progress) {
          const merged = { ...progress, ...data.user.progress };
          localStorage.setItem('sbr_progress', JSON.stringify(merged));
          setStats(s => ({ ...s, done: Object.keys(merged).length }));
        }
      });
  }, []);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      
      <div style={{ padding: '24px 20px' }}>
        {/* Hero Section */}
        <div className="animate-slide-up" style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>Welcome back,</h2>
          <h3 style={{ fontSize: 24, fontWeight: 400, color: 'var(--text-dim)' }}>{user?.name || 'Explorer'} 👋</h3>
        </div>

        {/* Quick Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Completed', val: stats.done, icon: 'check_circle', color: 'var(--secondary)' },
            { label: 'Accuracy', val: stats.accuracy + '%', icon: 'insights', color: 'var(--primary)' },
            { label: 'Streak', val: stats.streak, icon: 'local_fire_department', color: 'var(--accent)' }
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '16px 12px', textAlign: 'center' }}>
              <span className="material-symbols-rounded" style={{ color: s.color, fontSize: 20, marginBottom: 8 }}>{s.icon}</span>
              <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'JetBrains Mono' }}>{s.val}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Panic Mode Banner */}
        <div 
          onClick={() => router.push('/panic')}
          className="glass-panel" 
          style={{ 
            padding: '20px', marginBottom: 40, cursor: 'pointer',
            background: 'linear-gradient(90deg, rgba(255,64,129,0.1) 0%, rgba(124, 77, 255, 0.1) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            border: '1px solid rgba(255,64,129,0.2)'
          }}
        >
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(255,64,129,0.4)' }}>
              <span className="material-symbols-rounded" style={{ color: 'white' }}>warning</span>
            </div>
            <div>
              <h4 style={{ fontSize: 18, fontWeight: 700 }}>Panic Mode</h4>
              <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>Review questions you missed recently</p>
            </div>
          </div>
          <span className="material-symbols-rounded" style={{ color: 'var(--text-muted)' }}>chevron_right</span>
        </div>

        {/* Practice Arenas */}
        <h4 style={{ fontSize: 14, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20, fontWeight: 700 }}>Learning Arenas</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {ARENAS.map((arena, i) => (
            <div 
              key={arena.id} 
              onClick={() => router.push(arena.href)}
              className="glass-card animate-slide-up" 
              style={{ 
                padding: '24px 20px', cursor: 'pointer', 
                animationDelay: `${i * 0.1}s`,
                background: `linear-gradient(135deg, ${arena.color}15 0%, transparent 100%)`,
                border: `1px solid ${arena.color}30`
              }}
            >
              <div style={{ 
                width: 44, height: 44, borderRadius: 14, 
                background: arena.color, 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 8px 20px ${arena.color}40`,
                marginBottom: 16
              }}>
                <span className="material-symbols-rounded" style={{ color: 'white', fontSize: 24 }}>{arena.icon}</span>
              </div>
              <h5 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{arena.label}</h5>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 12 }}>{arena.sub}</p>
              
              <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: '40%', height: '100%', background: arena.color, boxShadow: `0 0 10px ${arena.color}` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
