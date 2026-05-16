'use client';
import { useState, useEffect, useRef } from 'react';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

const RANK_CONFIG = {
  1: { color: '#FFD700', glow: 'rgba(255, 215, 0, 0.5)', label: 'Champion', icon: 'workspace_premium', height: 200 },
  2: { color: '#C0C0C0', glow: 'rgba(192, 192, 192, 0.35)', label: 'Elite', icon: 'military_tech', height: 160 },
  3: { color: '#CD7F32', glow: 'rgba(205, 127, 50, 0.35)', label: 'Veteran', icon: 'shield', height: 130 },
};

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [myRank, setMyRank] = useState(null);
  const intervalRef = useRef(null);

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
    // Get current user rank
    const local = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    if (local.userId) setMyRank(local.userId);
    intervalRef.current = setInterval(() => fetchLeaders(), 30000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 110, background: 'var(--bg-main)', position: 'relative', overflowX: 'hidden' }}>

      <style>{`
        @keyframes trophy-float {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes rank-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes podium-rise {
          from { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
          to { transform: scaleY(1); transform-origin: bottom; opacity: 1; }
        }
        @keyframes crown-pulse {
          0%, 100% { filter: drop-shadow(0 0 8px #FFD700); transform: scale(1); }
          50% { filter: drop-shadow(0 0 24px #FFD700) drop-shadow(0 0 48px rgba(255,215,0,0.4)); transform: scale(1.1); }
        }
        @keyframes particle-float {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 1; }
          100% { transform: translateY(-120px) translateX(var(--tx, 20px)) scale(0); opacity: 0; }
        }
        @keyframes row-enter {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        .rank-row {
          animation: row-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .rank-row:hover {
          background: rgba(255,255,255,0.04) !important;
          transform: translateX(4px);
          transition: all 0.25s ease;
        }
        .champion-glow {
          animation: crown-pulse 2.5s ease-in-out infinite;
        }
        .live-dot {
          animation: live-pulse 1.8s ease-in-out infinite;
        }
        .podium-block {
          animation: podium-rise 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .trophy-anim {
          animation: trophy-float 4s ease-in-out infinite;
        }
      `}</style>

      <TopBar />

      {/* ── CINEMATIC BACKGROUND ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Gold nebula */}
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '100vw', height: '70vh', background: 'radial-gradient(ellipse, rgba(255,215,0,0.07) 0%, rgba(167,139,250,0.04) 40%, transparent 70%)', filter: 'blur(60px)' }} />
        {/* Purple deep */}
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        {/* Cyan streak */}
        <div style={{ position: 'absolute', top: '30%', right: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(34,211,238,0.06) 0%, transparent 65%)', filter: 'blur(70px)' }} />
        {/* Subtle grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,215,0,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.015) 1px, transparent 1px)', backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse at 50% 0%, black 0%, transparent 70%)' }} />
      </div>

      <div style={{ padding: '32px 20px', maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── HERO HEADER ── */}
        <div className="animate-slide-up" style={{ textAlign: 'center', marginBottom: 48 }}>
          {/* Trophy icon */}
          <div className="trophy-anim" style={{ display: 'inline-block', marginBottom: 20 }}>
            <div style={{ width: 90, height: 90, borderRadius: 28, background: 'linear-gradient(135deg, #92400e 0%, #f59e0b 40%, #fbbf24 70%, #fde68a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 1px rgba(255,215,0,0.3), 0 0 40px rgba(255,215,0,0.4), 0 20px 60px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)' }} />
              <span className="mi" style={{ fontSize: 46, color: 'white', position: 'relative', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>emoji_events</span>
            </div>
          </div>

          <h1 style={{ fontSize: 38, fontWeight: 900, background: 'linear-gradient(135deg, #fde68a 0%, #fbbf24 40%, #f59e0b 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 8, letterSpacing: -1 }}>
            Hall of Fame
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 14, fontWeight: 500, marginBottom: 16 }}>
            The greatest minds in SBR Academy
          </p>

          {/* Live badge + refresh */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, padding: '8px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span className="live-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399', display: 'inline-block' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#34d399' }}>LIVE</span>
            </div>
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />
            <button
              onClick={() => fetchLeaders(true)}
              disabled={refreshing}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, padding: 0 }}
            >
              <span className={`mi ${refreshing ? 'animate-spin-slow' : ''}`} style={{ fontSize: 16 }}>refresh</span>
              {refreshing ? 'Updating…' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* ── TOP 3 PODIUM ── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 12, marginBottom: 40, height: 260 }}>
            {[160, 200, 130].map((h, i) => (
              <div key={i} className="animate-pulse" style={{ flex: 1, height: h, background: 'rgba(255,255,255,0.04)', borderRadius: '16px 16px 0 0', border: '1px solid rgba(255,255,255,0.06)' }} />
            ))}
          </div>
        ) : top3.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 10, marginBottom: 40, padding: '20px 0 0' }}>
            {/* ORDER: 2nd, 1st, 3rd */}
            {[
              top3[1] ? { ...top3[1], rankPos: 2 } : null,
              top3[0] ? { ...top3[0], rankPos: 1 } : null,
              top3[2] ? { ...top3[2], rankPos: 3 } : null,
            ].map((u, i) => {
              if (!u) return <div key={i} style={{ flex: 1 }} />;
              const cfg = RANK_CONFIG[u.rankPos];
              const isChamp = u.rankPos === 1;
              const avatarSize = isChamp ? 86 : 68;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: isChamp ? 1.3 : 1, minWidth: 0 }}>
                  {/* Crown for 1st */}
                  {isChamp && (
                    <div className="champion-glow" style={{ marginBottom: 6, fontSize: 28 }}>👑</div>
                  )}

                  {/* Avatar ring */}
                  <div style={{ position: 'relative', marginBottom: 12 }}>
                    {/* Outer glow ring */}
                    <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', background: `conic-gradient(${cfg.color}, transparent, ${cfg.color})`, animation: isChamp ? 'spin-slow 4s linear infinite' : 'none', opacity: 0.5 }} />
                    <div style={{ position: 'absolute', inset: -2, borderRadius: '50%', background: cfg.color, opacity: 0.15, filter: 'blur(8px)' }} />
                    <div style={{ width: avatarSize, height: avatarSize, borderRadius: '50%', overflow: 'hidden', border: `3px solid ${cfg.color}`, boxShadow: `0 0 25px ${cfg.glow}, 0 8px 30px rgba(0,0,0,0.5)`, position: 'relative', zIndex: 1 }}>
                      {u.image
                        ? <img src={u.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={u.name} />
                        : <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${cfg.color}88, ${cfg.color}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: isChamp ? 34 : 26 }}>{(u.name || '?').charAt(0).toUpperCase()}</div>
                      }
                    </div>
                    {/* Rank badge */}
                    <div style={{ position: 'absolute', bottom: -6, right: -6, zIndex: 2, width: 26, height: 26, borderRadius: '50%', background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: u.rankPos === 1 ? '#000' : '#fff', border: '2px solid var(--bg-main)', boxShadow: `0 4px 12px ${cfg.glow}` }}>
                      {u.rankPos}
                    </div>
                  </div>

                  {/* Name above podium */}
                  <div style={{ textAlign: 'center', marginBottom: 8, padding: '0 4px', width: '100%' }}>
                    <div style={{ fontSize: isChamp ? 13 : 11, fontWeight: 900, color: 'white', wordBreak: 'break-word', lineHeight: 1.3 }}>
                      {u.name || '---'}
                    </div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>{cfg.label}</div>
                  </div>

                  {/* Podium block */}
                  <div
                    className="podium-block"
                    style={{
                      width: '100%', height: cfg.height,
                      background: `linear-gradient(180deg, ${cfg.color}20 0%, ${cfg.color}06 60%, transparent 100%)`,
                      borderTop: `3px solid ${cfg.color}`,
                      borderLeft: `1px solid ${cfg.color}30`,
                      borderRight: `1px solid ${cfg.color}30`,
                      borderRadius: '14px 14px 0 0',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      gap: 2, padding: '16px 8px',
                      animationDelay: `${i * 0.15}s`,
                      position: 'relative', overflow: 'hidden'
                    }}
                  >
                    {/* Shimmer line */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: cfg.color, opacity: 0.8, boxShadow: `0 0 16px ${cfg.glow}` }} />
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: isChamp ? 24 : 20, fontWeight: 900, color: cfg.color, textShadow: `0 0 20px ${cfg.glow}` }}>
                      {(u.xp || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>XP Points</div>
                    <div style={{ marginTop: 4, background: `${cfg.color}20`, border: `1px solid ${cfg.color}40`, borderRadius: 8, padding: '3px 10px', fontSize: 10, fontWeight: 700, color: cfg.color }}>
                      Lv.{Math.floor((u.xp || 0) / 100) + 1}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {top3.length === 0 && !loading && (
          <div className="glass-panel" style={{ padding: 56, textAlign: 'center', marginBottom: 32 }}>
            <span className="mi" style={{ fontSize: 56, color: 'var(--text-muted)', display: 'block', marginBottom: 16 }}>groups</span>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>No champions yet — be the first to claim glory!</p>
          </div>
        )}

        {/* ── DIVIDER ── */}
        {rest.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08))' }} />
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>Rankings</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)' }} />
          </div>
        )}

        {/* ── REST OF THE LIST ── */}
        {rest.length > 0 && (
          <div style={{ borderRadius: 28, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(20px)' }}>
            {rest.map((u, i) => {
              const rank = i + 4;
              const isMe = u.userId === myRank;
              return (
                <div
                  key={i}
                  className="rank-row"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderBottom: i < rest.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: isMe ? 'rgba(167,139,250,0.06)' : 'transparent',
                    cursor: 'default',
                    animationDelay: `${i * 0.04}s`,
                    transition: 'all 0.25s ease'
                  }}
                >
                  {/* Left: rank + avatar + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0, flex: 1 }}>
                    {/* Rank number */}
                    <div style={{ minWidth: 32, textAlign: 'center' }}>
                      <span style={{ fontFamily: 'JetBrains Mono', fontSize: 13, fontWeight: 900, color: rank <= 10 ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {rank}
                      </span>
                    </div>

                    {/* Avatar */}
                    <div style={{ width: 42, height: 42, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: isMe ? '2px solid var(--primary)' : '1.5px solid rgba(255,255,255,0.08)', boxShadow: isMe ? '0 0 12px var(--primary-glow)' : 'none' }}>
                      {u.image
                        ? <img src={u.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={u.name} />
                        : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(236,72,153,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 16 }}>{(u.name || '?').charAt(0).toUpperCase()}</div>
                      }
                    </div>

                    {/* Name + level */}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isMe ? 'var(--primary)' : 'white', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        {u.name || 'Anonymous'}
                        {isMe && <span style={{ fontSize: 8, fontWeight: 900, background: 'var(--primary)', color: 'white', padding: '2px 6px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0 }}>YOU</span>}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>Level {Math.floor((u.xp || 0) / 100) + 1}</div>
                    </div>
                  </div>

                  {/* Right: XP */}
                  <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: 12 }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 15, fontWeight: 900, color: rank <= 10 ? 'var(--primary)' : 'var(--text-dim)' }}>
                      {(u.xp || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>XP</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', marginTop: 32, textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>
          Rankings update every 30 seconds
        </p>
      </div>

      <BottomNav />
    </main>
  );
}
