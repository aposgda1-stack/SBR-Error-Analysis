'use client';
import { useEffect, useState } from 'react';
// Final Deployment Trigger - Production Ready
import { useRouter } from 'next/navigation';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const ARENAS = [
  { id: 'errors', label: 'الـ 130 جملة', sub: '130 Pairs', icon: 'target', color: 'var(--primary)', href: '/arena/errors', total: 130 },
  { id: 'grammar', label: 'القواعد', sub: 'Grammar', icon: 'bolt', color: 'var(--tertiary)', href: '/arena/grammar', total: 20 },
  { id: 'phrasal', label: 'الأفعال الاصطلاحية', sub: 'Phrasal Verbs', icon: 'link', color: 'var(--error)', href: '/arena/phrasal', total: 40 },
  { id: 'work', label: 'مصطلحات العمل', sub: 'Work Vocab', icon: 'work', color: '#a78bfa', href: '/arena/work', total: 30 },
];

function ProgressBar({ percent, color }) {
  return (
    <div style={{ height: 6, background: 'var(--surface-container-highest)', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${percent}%`, background: color,
        borderRadius: 999, transition: 'width 0.6s ease',
        boxShadow: `0 0 8px ${color}88`,
      }} />
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const [progress, setProgress] = useState({ errors: 0, grammar: 0, phrasal: 0, work: 0 });
  const [wrongCount, setWrongCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    if (!userData.userId) {
      router.push('/auth');
      return;
    }
    setUser(userData);

    const initData = async () => {
      let localProgress = JSON.parse(localStorage.getItem('sbr_progress') || '{}');
      let currentProgress = localProgress;

      try {
        const res = await fetch(`/api/user?userId=${userData.userId}`);
        const data = await res.json();
        
        if (data?.user?.progress) {
          const cloudProgress = data.user.progress;
          // Robust deep merge strategy for arrays
          const mergedProgress = { ...localProgress };
          for (const arenaId of Object.keys(cloudProgress)) {
            if (!mergedProgress[arenaId]) {
              mergedProgress[arenaId] = cloudProgress[arenaId];
            } else {
              const localDone = new Set(mergedProgress[arenaId].done || []);
              const localWrong = new Set(mergedProgress[arenaId].wrong || []);
              
              (cloudProgress[arenaId].done || []).forEach(id => {
                localDone.add(id);
                localWrong.delete(id); // If mastered in cloud, remove from wrong
              });
              
              (cloudProgress[arenaId].wrong || []).forEach(id => {
                if (!localDone.has(id)) localWrong.add(id);
              });
              
              mergedProgress[arenaId].done = Array.from(localDone);
              mergedProgress[arenaId].wrong = Array.from(localWrong);
            }
          }

          currentProgress = mergedProgress;
          localStorage.setItem('sbr_progress', JSON.stringify(mergedProgress));
        }
        
        // Push current/merged progress back to cloud
        const countDone = (p) => Object.values(p).reduce((acc, curr) => acc + (curr.done?.length || 0), 0);
        const totalItems = ARENAS.reduce((acc, curr) => acc + curr.total, 0);
        const xp = Math.round((countDone(currentProgress) / totalItems) * 100);
        
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sync', userId: userData.userId, progress: currentProgress, xp })
        });
      } catch (err) {
        console.error("Sync error:", err);
      }

      // Calculate state based on the chosen currentProgress
      const p = {};
      let totalWrong = 0;
      ARENAS.forEach(a => {
        const done = currentProgress[a.id]?.done?.length || 0;
        p[a.id] = Math.round((done / a.total) * 100);
        totalWrong += currentProgress[a.id]?.wrong?.length || 0;
      });
      setProgress(p);
      setWrongCount(totalWrong);
    };

    initData();
  }, []);

  const weakest = ARENAS.reduce((min, a) => progress[a.id] < progress[min.id] ? a : min, ARENAS[0]);

  if (!user) return null;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--background)', paddingTop: 48, paddingBottom: 80 }}>
      <TopBar />

      <main style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480, margin: '0 auto' }}>

        {/* User Greeting */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, animation: 'fadeIn 0.5s ease' }}>
          <img 
            src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
            style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid var(--primary)' }} 
          />
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--on-surface)' }}>Welcome, {user.name.split(' ')[0]}!</h1>
            <p style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>Ready for your daily mission?</p>
          </div>
        </div>

        {/* Mission Status */}
        <section style={{
          background: 'var(--surface-container)', borderRadius: 20,
          border: '1px solid var(--outline-variant)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: 4, height: '100%', background: 'var(--primary)' }} />
          <div style={{ padding: '20px 20px 24px' }}>
            <h2 style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 18, marginBottom: 20, color: 'var(--on-surface)' }}>
              حالة المهمة <span style={{ color: 'var(--on-surface-variant)', fontWeight: 400, fontSize: 14 }}>(Mission Status)</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {ARENAS.map(arena => (
                <div key={arena.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--on-surface-variant)' }}>
                      {arena.label} <span style={{ opacity: 0.6 }}>({arena.sub})</span>
                    </span>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600,
                      color: progress[arena.id] < 30 ? 'var(--error)' : 'var(--primary)',
                    }}>
                      {progress[arena.id]}%
                    </span>
                  </div>
                  <ProgressBar percent={progress[arena.id]} color={progress[arena.id] < 30 ? 'var(--error)' : arena.color} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <button
          onClick={() => router.push(weakest.href)}
          style={{
            width: '100%', background: 'var(--primary-container)',
            color: 'var(--on-primary-container)',
            border: 'none', borderRadius: 16, padding: '20px 24px',
            fontFamily: 'Inter', fontWeight: 800, fontSize: 18,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 8px 24px rgba(255,87,26,0.3)',
            transition: 'all 0.2s ease',
            position: 'relative', overflow: 'hidden',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 24 }}>rocket_launch</span>
          ابدأ المهمة التالية
        </button>

        {/* Arenas Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {ARENAS.map(arena => (
            <button
              key={arena.id}
              onClick={() => router.push(arena.href)}
              style={{
                background: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)',
                borderRadius: 16, padding: '16px', cursor: 'pointer', textAlign: 'right',
                transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', gap: 10,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22, color: arena.color }}>{arena.icon}</span>
              <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 14, color: 'var(--on-surface)', lineHeight: 1.3 }}>{arena.label}</span>
              <div style={{ width: '100%', height: 3, background: 'var(--surface-container-highest)', borderRadius: 999 }}>
                <div style={{ width: `${progress[arena.id]}%`, height: '100%', background: arena.color, borderRadius: 999 }} />
              </div>
            </button>
          ))}
        </div>

        {/* Panic Button */}
        <button
          onClick={() => router.push('/panic')}
          style={{
            width: '100%',
            background: 'var(--error-container)', color: 'var(--on-error-container)',
            border: '1px solid var(--error)', borderRadius: 16, padding: '16px',
            fontFamily: 'JetBrains Mono', fontWeight: 600, fontSize: 13,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 12px rgba(147,0,10,0.3)',
            letterSpacing: '0.04em',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>warning</span>
          زر طوارئ ليلة الامتحان
          {wrongCount > 0 && (
            <span style={{
              background: 'var(--error)', color: 'var(--on-error)',
              borderRadius: 999, padding: '2px 8px', fontSize: 11, fontWeight: 800,
            }}>{wrongCount}</span>
          )}
        </button>

      </main>
      <BottomNav />
    </div>
  );
}
