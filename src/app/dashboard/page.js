'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

const TRAINING_MODULES = [
  { id: 'errors', label: '130 Sentences', sub: 'Error Analysis', icon: 'gps_fixed', color: '#a78bfa', href: '/arena/errors' },
  { id: 'grammar', label: 'Grammar Blitz', sub: 'Rules & Drills', icon: 'bolt', color: '#22d3ee', href: '/arena/grammar' },
  { id: 'phrasal', label: 'Phrasal Verbs', sub: 'Cut · Come · Give', icon: 'sync_alt', color: '#f472b6', href: '/arena/phrasal' },
  { id: 'work', label: 'Work Vocab', sub: 'Business English', icon: 'work_outline', color: '#fbbf24', href: '/arena/work' },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ done: 0, xp: 0, rank: 0, sessions: 0 });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    if (!localUser.userId) { router.push('/auth'); return; }
    setUser(localUser);

    fetch(`/api/user?userId=${localUser.userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          const local = JSON.parse(localStorage.getItem('sbr_user') || '{}');
          if (data.user.image && !local.image) {
            local.image = data.user.image;
            localStorage.setItem('sbr_user', JSON.stringify(local));
            setUser({ ...local });
          }
          setStats({
            done: data.user.done || 0,
            xp: data.user.xp || 0,
            rank: data.user.rank || 'Unranked',
            sessions: data.user.done || 0
          });
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [router]);

  if (!user) return null;

  const level = Math.floor(stats.xp / 100) + 1;
  const xpProgress = stats.xp % 100;

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 120, position: 'relative' }}>
      <TopBar />

      {/* Ambient orb */}
      <div style={{
        position: 'fixed', top: '30%', right: '-20%', width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(167,139,250,0.06) 0%, transparent 65%)',
        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0
      }} />

      <div style={{ padding: '28px 20px', maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* === WELCOME HERO === */}
        <div className="animate-slide-up" style={{ marginBottom: 36 }}>
          <div style={{
            background: 'rgba(167,139,250,0.04)',
            border: '1px solid rgba(167,139,250,0.12)',
            borderRadius: 28, padding: '28px 24px',
            position: 'relative', overflow: 'hidden'
          }}>
            {/* Top aurora */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--accent))',
              opacity: 0.7
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  position: 'absolute', inset: -3, borderRadius: '50%',
                  background: 'var(--grad-primary)', opacity: 0.5, filter: 'blur(10px)'
                }} />
                {user?.image ? (
                  <img
                    src={user.image}
                    style={{
                      width: 72, height: 72, borderRadius: '50%',
                      border: '3px solid var(--primary)',
                      objectFit: 'cover', position: 'relative',
                      boxShadow: '0 0 30px var(--primary-glow)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'var(--grad-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32, fontWeight: 900, color: 'white',
                    position: 'relative',
                    boxShadow: '0 0 30px var(--primary-glow)'
                  }}>
                    {(user?.name || 'S').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
                  Welcome back
                </p>
                <h2 style={{
                  fontSize: 26, fontWeight: 900, color: 'white',
                  letterSpacing: -0.5, lineHeight: 1.1,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {user?.name || 'Student'} 👋
                </h2>
                {/* Level + XP bar */}
                <div style={{ marginTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
                      Level {level}
                    </span>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>
                      {xpProgress}/100 XP
                    </span>
                  </div>
                  <div style={{ height: 6, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${xpProgress}%`,
                      background: 'var(--grad-primary)',
                      borderRadius: 100,
                      boxShadow: '0 0 12px var(--primary-glow)',
                      transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === STATS ROW === */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 36 }}
          className="animate-slide-up"
        >
          {[
            { label: 'Sessions', val: stats.done, icon: 'auto_stories', color: 'var(--secondary)', bg: 'rgba(34,211,238,0.08)' },
            { label: 'Total XP', val: stats.xp, icon: 'bolt', color: 'var(--primary)', bg: 'rgba(167,139,250,0.08)' },
            { label: 'Rank', val: stats.rank === 'Unranked' ? 'N/A' : `#${stats.rank}`, icon: 'workspace_premium', color: 'var(--gold)', bg: 'rgba(251,191,36,0.08)' }
          ].map((s, i) => (
            <div key={i} style={{
              padding: '20px 14px',
              background: s.bg,
              border: `1px solid ${s.color}20`,
              borderRadius: 22,
              display: 'flex', flexDirection: 'column', gap: 8,
              transition: 'transform 0.3s ease',
              animationDelay: `${i * 0.1}s`
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: `${s.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span className="mi" style={{ color: s.color, fontSize: 20 }}>{s.icon}</span>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 22, fontWeight: 900, color: 'white', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginTop: 4 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* === MODULES GRID === */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h4 style={{
              fontSize: 11, color: 'var(--text-muted)',
              textTransform: 'uppercase', letterSpacing: 2.5,
              fontWeight: 800, fontFamily: 'Plus Jakarta Sans'
            }}>Training Modules</h4>
            <span className="neon-tag">4 Active</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {TRAINING_MODULES.map((module, i) => (
              <div
                key={module.id}
                onClick={() => router.push(module.href)}
                className="glass-card animate-slide-up"
                style={{
                  padding: '26px 20px', cursor: 'pointer',
                  animationDelay: `${i * 0.08}s`,
                  background: `linear-gradient(135deg, ${module.color}08 0%, transparent 100%)`,
                  borderColor: `${module.color}20`
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 16,
                  background: `${module.color}15`,
                  border: `1px solid ${module.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 18,
                  boxShadow: `0 8px 20px ${module.color}15`
                }}>
                  <span className="mi" style={{ color: module.color, fontSize: 24 }}>{module.icon}</span>
                </div>

                <h5 style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, color: 'white', fontFamily: 'Plus Jakarta Sans' }}>{module.label}</h5>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>{module.sub}</p>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.05)', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{
                      width: stats.done > 0 ? `${Math.min(100, stats.done * 8)}%` : '0%',
                      height: '100%',
                      background: `linear-gradient(90deg, ${module.color}, ${module.color}99)`,
                      boxShadow: `0 0 8px ${module.color}`,
                      borderRadius: 100,
                      transition: '1.5s ease'
                    }} />
                  </div>
                  <span className="mi" style={{ color: module.color, fontSize: 16 }}>chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exam CTA */}
        <div
          className="animate-slide-up"
          onClick={() => router.push('/exam')}
          style={{
            marginTop: 20, padding: '24px',
            background: 'var(--grad-primary)',
            borderRadius: 24,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: '0 12px 40px var(--primary-glow)',
            position: 'relative', overflow: 'hidden',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
        >
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0,
            width: '60%',
            background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.08) 100%)'
          }} />
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Ready to test yourself?</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'white', fontFamily: 'Playfair Display' }}>Final Exam Simulator</div>
          </div>
          <div style={{
            width: 52, height: 52, borderRadius: 18,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <span className="mi" style={{ color: 'white', fontSize: 28 }}>assignment_late</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
