'use client';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const TRAINING_MODULES = [
  { id: 'errors', label: '130 Sentences', sub: 'Master Error Analysis', icon: 'gps_fixed', color: '#7c4dff', href: '/arena/errors' },
  { id: 'grammar', label: 'Grammar Guide', sub: 'Rules & Practice', icon: 'bolt', color: '#00e5ff', href: '/arena/grammar' },
  { id: 'phrasal', label: 'Phrasal Verbs', sub: 'Dynamic Idioms', icon: 'sync_alt', color: '#ff4081', href: '/arena/phrasal' },
  { id: 'work', label: 'Work Vocabulary', sub: 'Business English', icon: 'work_outline', color: '#ffea00', href: '/arena/work' },
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
  }, [router]);

  const timeRemaining = useMemo(() => {
    const examDate = new Date('2026-05-19T09:00:00');
    const now = new Date();
    const diff = examDate - now;
    if (diff <= 0) return 'NOW';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    return days > 0 ? `${days}d` : `${hours}h`;
  }, []);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 110 }}>
      <TopBar />
      
      <div style={{ padding: '32px 20px', maxWidth: 800, margin: '0 auto' }}>
        {/* Welcome Section */}
        <div className="animate-slide-up" style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -2, background: 'var(--grad-primary)', borderRadius: '50%', opacity: 0.3, filter: 'blur(8px)' }} />
              <img 
                src={user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Explorer'}`} 
                style={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid var(--primary)', position: 'relative' }}
              />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-dim)', marginBottom: 2 }}>Welcome back,</h2>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: 'white', letterSpacing: -0.5 }}>{user?.name || 'Explorer'}</h3>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
          {[
            { label: 'Modules', val: stats.done, icon: 'auto_stories', color: 'var(--secondary)' },
            { label: 'Accuracy', val: stats.accuracy + '%', icon: 'insights', color: 'var(--primary)' },
            { label: 'Streak', val: stats.streak + 'd', icon: 'local_fire_department', color: 'var(--accent)' }
          ].map((s, i) => (
            <div key={i} className="glass-card" style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span className="mi" style={{ color: s.color, fontSize: 22 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace' }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Next Exam Banner */}
        <div className="glass-panel" style={{ 
          padding: '24px', marginBottom: 48, 
          background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.1) 0%, rgba(124, 77, 255, 0.1) 100%)',
          border: '1px solid rgba(0, 229, 255, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>Upcoming Exam</h4>
            <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>Monday, 9:00 AM • Stay Prepared</p>
          </div>
          <div style={{ textAlign: 'right', position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--secondary)' }}>{timeRemaining}</div>
            <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Remaining</div>
          </div>
          {/* Decorative Circle */}
          <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'var(--primary)', opacity: 0.1, filter: 'blur(30px)' }} />
        </div>

        {/* Modules Grid */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2, fontWeight: 800, marginBottom: 20 }}>Training Modules</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {TRAINING_MODULES.map((module, i) => (
              <div 
                key={module.id} 
                onClick={() => router.push(module.href)}
                className="glass-card animate-slide-up" 
                style={{ 
                  padding: '24px 20px', cursor: 'pointer', 
                  animationDelay: `${i * 0.1}s`,
                  position: 'relative', overflow: 'hidden',
                  background: 'var(--bg-glass)'
                }}
              >
                <div style={{ 
                  width: 44, height: 44, borderRadius: 14, 
                  background: `${module.color}15`, 
                  border: `1px solid ${module.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16
                }}>
                  <span className="mi" style={{ color: module.color, fontSize: 22 }}>{module.icon}</span>
                </div>
                
                <h5 style={{ fontSize: 17, fontWeight: 800, marginBottom: 4, color: 'white' }}>{module.label}</h5>
                <p style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 500 }}>{module.sub}</p>

                <div style={{ height: 4, background: 'rgba(255,255,255,0.03)', borderRadius: 2, marginTop: 16, overflow: 'hidden' }}>
                  <div style={{ width: '45%', height: '100%', background: module.color, boxShadow: `0 0 10px ${module.color}` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
