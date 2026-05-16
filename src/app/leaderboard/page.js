'use client';
import { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaders = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      setLeaders(data.leaders || []);
    } catch (err) { console.error(err); }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchLeaders();
    const iv = setInterval(() => fetchLeaders(), 30000);
    return () => clearInterval(iv);
  }, []);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100, position: 'relative' }}>
      <TopBar />

      {/* Ambient bg */}
      <div style={{ position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '80vw', height: '50vw', background: 'radial-gradient(circle, rgba(251,191,36,0.06) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ padding: '32px 20px', maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 22, background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 30px rgba(251,191,36,0.35)' }}>
            <span className="mi" style={{ fontSize: 34, color: 'white' }}>military_tech</span>
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: 'white', marginBottom: 4 }}>Hall of Fame</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--text-dim)', fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px var(--success)', display: 'inline-block' }} />
              Live Rankings
            </span>
            <span>·</span>
            <button
              onClick={() => fetchLeaders(true)}
              disabled={refreshing}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
            >
              <span className={`mi ${refreshing ? 'animate-spin-slow' : ''}`} style={{ fontSize: 15 }}>refresh</span>
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Top 3 podium */}
        {!loading && leaders.length >= 1 && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 10, marginBottom: 40, padding: '0 4px' }}>
            {/* 2nd */}
            {leaders[1] && <PodiumCard user={leaders[1]} rank={2} height={130} color="#94a3b8" glow="rgba(148,163,184,0.3)" />}
            {/* 1st */}
            <PodiumCard user={leaders[0]} rank={1} height={170} color="#fbbf24" glow="rgba(251,191,36,0.4)" isFirst />
            {/* 3rd */}
            {leaders[2] && <PodiumCard user={leaders[2]} rank={3} height={110} color="#b45309" glow="rgba(180,83,9,0.3)" />}
          </div>
        )}

        {leaders.length === 0 && !loading && (
          <div className="glass-panel" style={{ padding: 48, textAlign: 'center' }}>
            <span className="mi" style={{ fontSize: 48, color: 'var(--text-muted)', display: 'block', marginBottom: 12 }}>groups</span>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No champions yet. Be the first!</p>
          </div>
        )}

        {/* Full list (rank 4+) */}
        {leaders.length > 3 && (
          <div className="glass-panel" style={{ padding: 8 }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading rankings…</div>
            ) : (
              leaders.slice(3).map((u, i) => (
                <div key={i} className="animate-slide-up" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderBottom: i < leaders.length - 4 ? '1px solid var(--border-glass)' : 'none',
                  animationDelay: `${i * 0.04}s`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', minWidth: 24, textAlign: 'center' }}>{i + 4}</span>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid var(--border-glass)' }}>
                      {u.image
                        ? <img src={u.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 16 }}>{(u.name || '?').charAt(0).toUpperCase()}</div>
                      }
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'white', wordBreak: 'break-word' }}>{u.name}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Level {Math.floor((u.xp || 0) / 100) + 1}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>{u.xp}</div>
                    <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>XP</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}

function PodiumCard({ user, rank, height, color, glow, isFirst }) {
  const size = isFirst ? 76 : 60;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: isFirst ? 1.2 : 1, minWidth: 0 }}>
      {/* Avatar */}
      <div style={{ position: 'relative', marginBottom: 10, flexShrink: 0 }}>
        <div style={{ width: size, height: size, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${color}`, boxShadow: `0 0 20px ${glow}`, flexShrink: 0 }}>
          {user?.image
            ? <img src={user.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div style={{ width: '100%', height: '100%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: isFirst ? 30 : 22 }}>{(user?.name || '?').charAt(0).toUpperCase()}</div>
          }
        </div>
        <div style={{ position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)', background: color, color: color === '#fbbf24' ? '#000' : '#fff', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, border: '2px solid var(--bg-main)' }}>{rank}</div>
      </div>

      {/* Podium block */}
      <div style={{ width: '100%', height, background: `linear-gradient(180deg, ${color}25 0%, ${color}08 100%)`, borderTop: `2px solid ${color}`, borderRadius: '12px 12px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 8px 10px', gap: 4 }}>
        {/* Full name — wraps, no truncation */}
        <div style={{ fontSize: isFirst ? 12 : 11, fontWeight: 800, color: 'white', textAlign: 'center', lineHeight: 1.3, wordBreak: 'break-word', width: '100%' }}>
          {user?.name || '---'}
        </div>
        <div style={{ fontSize: isFirst ? 15 : 13, fontWeight: 900, color, fontFamily: 'JetBrains Mono' }}>{user?.xp || 0}</div>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5 }}>XP</div>
      </div>
    </div>
  );
}
