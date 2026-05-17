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
  { id: 'confusing', label: 'Confusing Pairs', sub: 'False Friends', icon: 'compare_arrows', color: '#10b981', href: '/arena/confusing' },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ done: 0, xp: 0, rank: 0, sessions: 0 });
  const [loaded, setLoaded] = useState(false);
  const [fairPlayNotice, setFairPlayNotice] = useState(null); // stores deductedXp if present
  const [cheatingNotice, setCheatingNotice] = useState(null); // stores deductedXp for cheating if present
  const [adminReport, setAdminReport] = useState(null); // stores admin custom message if present
  const [platformUpdate, setPlatformUpdate] = useState(null); // stores platform update message if present

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    if (!localUser.userId) { router.push('/auth'); return; }
    setUser(localUser);

    fetch(`/api/user?userId=${localUser.userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          const local = JSON.parse(localStorage.getItem('sbr_user') || '{}');
          // Always keep local storage in sync with fresh database values
          local.name = data.user.name || local.name || 'Student';
          local.image = data.user.image || local.image || null;
          localStorage.setItem('sbr_user', JSON.stringify(local));
          setUser({ ...local });

          if (data.user.completedSections) {
            localStorage.setItem('sbr_completed_sections', JSON.stringify(data.user.completedSections));
          }
          
          setStats({
            done: data.user.done || 0,
            xp: data.user.xp || 0,
            rank: data.user.rank || 'Unranked',
            sessions: data.user.done || 0
          });

          // Fair Play Check: Detect if user had duplicate final exam points deducted
          if (data.user.notification && data.user.notification.show) {
            if (data.user.notification.type === 'fair_play_deduction') {
              setFairPlayNotice(data.user.notification.deductedXp || 0);
            } else if (data.user.notification.type === 'cheating_deduction') {
              setCheatingNotice(data.user.notification.deductedXp || 0);
            } else if (data.user.notification.type === 'admin_report') {
              setAdminReport({
                title: data.user.notification.title || 'Security Update',
                message: data.user.notification.message || ''
              });
            } else if (data.user.notification.type === 'platform_update') {
              setPlatformUpdate({
                title: data.user.notification.title || 'Platform Update',
                message: data.user.notification.message || ''
              });
            }

            // Dismiss notice on the server instantly
            fetch('/api/user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'sync',
                userId: localUser.userId,
                clearNotification: true
              })
            }).catch(console.error);
          }
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
            background: 'linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(12,8,25,0.75) 100%)',
            border: '1px solid rgba(167,139,250,0.18)',
            borderRadius: 32, padding: '28px 24px',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(124, 77, 255, 0.05), inset 0 1px 0 rgba(255,255,255,0.08)'
          }}>
            {/* Top aurora */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--accent))',
              opacity: 0.8
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }} className="mobile-stack">
              {/* Avatar */}
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  position: 'absolute', inset: -6, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))', opacity: 0.6, filter: 'blur(12px)'
                }} />
                {user?.image ? (
                  <img
                    src={user.image}
                    style={{
                      width: 80, height: 80, borderRadius: '50%',
                      border: '3px solid var(--primary)',
                      objectFit: 'cover', position: 'relative',
                      boxShadow: '0 0 35px var(--primary-glow)'
                    }}
                  />
                ) : (
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'var(--grad-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 36, fontWeight: 900, color: 'white',
                    position: 'relative',
                    boxShadow: '0 0 35px var(--primary-glow)',
                    border: '2px solid rgba(255,255,255,0.1)'
                  }}>
                    {(user?.name || 'S').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
                  Welcome back
                </p>
                <h2 style={{
                  fontSize: 28, fontWeight: 950, color: 'white',
                  letterSpacing: -0.8, lineHeight: 1.1,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {user?.name || 'Student'} 👋
                </h2>
                {/* Level + XP bar */}
                <div style={{ marginTop: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.2 }}>
                      Level {level}
                    </span>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 800 }}>
                      {xpProgress}/100 XP
                    </span>
                  </div>
                  <div style={{ height: 8, borderRadius: 100, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${xpProgress}%`,
                      background: 'var(--grad-primary)',
                      borderRadius: 100,
                      boxShadow: '0 0 15px var(--primary-glow)',
                      transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)'
                    }} />
                  </div>
                </div>

                {/* Vault Shortcut */}
                <button 
                  onClick={() => router.push('/vault')}
                  style={{ 
                    marginTop: 18, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 14, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
                    cursor: 'pointer', transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 4px 25px rgba(0,0,0,0.3)'
                  }}
                  className="hover-bright hover-scale"
                >
                  <span className="mi" style={{ color: 'var(--gold)', fontSize: 18, textShadow: '0 0 10px rgba(251,191,36,0.4)' }}>auto_delete</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'white', textTransform: 'uppercase', letterSpacing: 0.8 }}>Open Review Vault</span>
                  <span className="mi" style={{ color: 'var(--text-muted)', fontSize: 16 }}>chevron_right</span>
                </button>
              </div>
            </div>

            {/* Panic Mode Feature Card */}
            <div 
              onClick={() => router.push('/panic')}
              className="glass-card animate-slide-up hover-scale" 
              style={{ 
                marginTop: 20, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16, 
                cursor: 'pointer', background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.12), rgba(12,8,25,0.65))',
                border: '1px solid rgba(239, 68, 68, 0.3)', animationDelay: '0.2s',
                boxShadow: '0 10px 30px rgba(239, 68, 68, 0.05)', borderRadius: 24
              }}
            >
              <div style={{ 
                width: 46, height: 46, borderRadius: 14, background: 'var(--error)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 25px rgba(239, 68, 68, 0.45)'
              }}>
                <span className="mi" style={{ color: 'white', fontSize: 24 }}>bolt</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: 'white', letterSpacing: -0.2 }}>Panic Mode</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>60s high-speed survival challenge</div>
              </div>
              <span className="mi" style={{ color: 'var(--error)', fontSize: 20 }}>chevron_right</span>
            </div>

            {/* Daily Goal Section */}
            <div className="glass-card animate-slide-up" style={{ marginTop: 20, padding: 24, textAlign: 'center', animationDelay: '0.3s', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Daily Focus</div>
                {(() => {
                  const today = new Date().toDateString();
                  const todaySessions = (user.history || []).filter(h => new Date(h.date).toDateString() === today).length;
                  const goalMet = todaySessions >= 3;
                  const pct = Math.min(todaySessions / 3, 1);
                  return (
                    <>
                      <div style={{ position: 'relative', width: 90, height: 90, margin: '0 auto 18px' }}>
                        <svg width="90" height="90" viewBox="0 0 90 90">
                          <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="7" />
                          <circle cx="45" cy="45" r="38" fill="none" stroke={goalMet ? 'var(--success)' : 'var(--primary)'} strokeWidth="7"
                            strokeDasharray={`${pct * 238} 238`}
                            strokeLinecap="round" transform="rotate(-90 45 45)"
                            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1)', filter: `drop-shadow(0 0 8px ${goalMet ? 'var(--success)' : 'var(--primary)'})` }}
                          />
                        </svg>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: goalMet ? 'var(--success)' : 'white', textShadow: goalMet ? '0 0 10px rgba(16,185,129,0.4)' : 'none' }}>
                          {todaySessions}/3
                        </div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: goalMet ? 'var(--success)' : 'white' }}>
                        {goalMet ? 'Daily Goal Reached! 🔥' : `${3 - todaySessions} more sessions today`}
                      </div>
                    </>
                  );
                })()}
            </div>
          </div>
        </div>

        {/* === STATS ROW === */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 36 }}
          className="animate-slide-up mobile-stack"
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
            <span className="neon-tag">5 Active</span>
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

      {fairPlayNotice !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 2, 12, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 24
        }} className="animate-fade-in">
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(12, 8, 25, 0.98) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            boxShadow: '0 25px 70px rgba(239, 68, 68, 0.15)',
            borderRadius: 32,
            padding: '36px 28px',
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
            position: 'relative'
          }} className="animate-scale-up">
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <span className="mi" style={{ color: 'var(--error)', fontSize: 36 }}>gavel</span>
            </div>
            
            <h3 style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 12 }}>
              Fair Play Enforcement
            </h3>
            
            <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 20 }}>
              Dear student, in alignment with our <strong>Fair Play & Fair Competition Policy</strong>, a system audit resolved an exploit where the Final Exam was completed multiple times to farm duplicate XP. 
            </p>

            <div style={{
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 16,
              padding: '16px 20px',
              marginBottom: 20
            }}>
              <span style={{ fontSize: 13, color: 'var(--error)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                Deducted Balance
              </span>
              <div style={{ fontSize: 32, fontWeight: 950, color: 'var(--error)', fontFamily: 'monospace', marginTop: 4 }}>
                -{fairPlayNotice} XP
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 28, textAlign: 'left' }}>
              ⚠️ Points for major exams (Final & Midterm) are only awarded once to preserve competitive integrity.
              <br/><br/>
              💡 <strong>Boost your score safely:</strong> You can earn unlimited points by repeating the <strong>Practice Sections</strong> (130 Sentences, Grammar Blitz, Phrasal Verbs, etc.) as many times as you want!
            </p>

            <button 
              onClick={() => setFairPlayNotice(null)} 
              className="premium-btn" 
              style={{ width: '100%', padding: '16px 24px', fontSize: 14, borderRadius: 16, background: 'var(--grad-primary)' }}
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      )}

      {cheatingNotice !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 2, 12, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 24
        }} className="animate-fade-in">
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(12, 8, 25, 0.98) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            boxShadow: '0 25px 70px rgba(239, 68, 68, 0.15)',
            borderRadius: 32,
            padding: '36px 28px',
            maxWidth: 480,
            width: '100%',
            textAlign: 'center',
            position: 'relative'
          }} className="animate-scale-up">
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              <span className="mi" style={{ color: 'var(--error)', fontSize: 36 }}>warning</span>
            </div>
            
            <h3 style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 12 }}>
              Academic Integrity Warning
            </h3>
            
            <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: 20 }}>
              Dear student, a security audit detected suspicious repetitive speed patterns and XP farming behaviors associated with your account.
            </p>

            <div style={{
              background: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 16,
              padding: '16px 20px',
              marginBottom: 20
            }}>
              <span style={{ fontSize: 13, color: 'var(--error)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                Deducted Penalty
              </span>
              <div style={{ fontSize: 32, fontWeight: 950, color: 'var(--error)', fontFamily: 'monospace', marginTop: 4 }}>
                -{cheatingNotice} XP
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 28, textAlign: 'left' }}>
              ⚠️ To maintain fair competition and leaderboards, we have adjusted your score by deducting <strong>{cheatingNotice} XP</strong>.
              <br/><br/>
              🚫 Please note that subsequent violations or automated script usages will lead to a **permanent suspension** of your account from the leaderboards. Let's study hard and compete fairly!
            </p>

            <button 
              onClick={() => setCheatingNotice(null)} 
              className="premium-btn" 
              style={{ width: '100%', padding: '16px 24px', fontSize: 14, borderRadius: 16, background: 'var(--grad-primary)' }}
            >
              I Acknowledge & Promise to Play Fairly
            </button>
          </div>
        </div>
      )}

      {adminReport !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 2, 12, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 24
        }} className="animate-fade-in">
          <div style={{
            background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.08) 0%, rgba(12, 8, 25, 0.98) 100%)',
            border: '1px solid rgba(167, 139, 250, 0.25)',
            boxShadow: '0 25px 70px rgba(167, 139, 250, 0.15)',
            borderRadius: 32,
            padding: '36px 28px',
            maxWidth: 520,
            width: '100%',
            position: 'relative'
          }} className="animate-scale-up">
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(167, 139, 250, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '1px solid rgba(167, 139, 250, 0.3)'
            }}>
              <span className="mi" style={{ color: 'var(--primary)', fontSize: 36 }}>security</span>
            </div>
            
            <h3 style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 16, textAlign: 'center', fontFamily: 'Plus Jakarta Sans' }}>
              {adminReport.title || 'Security System Report'}
            </h3>
            
            <div style={{ 
              fontSize: 13, 
              color: 'var(--text-dim)', 
              lineHeight: 1.7, 
              marginBottom: 28, 
              textAlign: 'right', 
              direction: 'rtl',
              maxHeight: '260px',
              overflowY: 'auto',
              paddingRight: 8,
              fontFamily: 'system-ui'
            }}>
              {adminReport.message.split('\n').map((line, idx) => (
                <div key={idx} style={{ marginBottom: line.trim() === '' ? 12 : 4 }}>
                  {line}
                </div>
              ))}
            </div>

            <button 
              onClick={() => setAdminReport(null)} 
              className="premium-btn" 
              style={{ width: '100%', padding: '16px 24px', fontSize: 14, borderRadius: 16, background: 'var(--grad-primary)' }}
            >
              إغلاق التقرير المباشر
            </button>
          </div>
        </div>
      )}

      {platformUpdate !== null && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 2, 12, 0.85)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: 24
        }} className="animate-fade-in">
          <div style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(12, 8, 25, 0.98) 100%)',
            border: '1px solid rgba(14, 165, 233, 0.25)',
            boxShadow: '0 25px 70px rgba(14, 165, 233, 0.15)',
            borderRadius: 32,
            padding: '36px 28px',
            maxWidth: 520,
            width: '100%',
            position: 'relative'
          }} className="animate-scale-up">
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(14, 165, 233, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '1px solid rgba(14, 165, 233, 0.3)'
            }}>
              <span className="mi" style={{ color: '#38bdf8', fontSize: 36 }}>auto_awesome</span>
            </div>
            
            <h3 style={{ fontSize: 24, fontWeight: 900, color: 'white', marginBottom: 16, textAlign: 'center', letterSpacing: -0.5 }}>
              {platformUpdate.title}
            </h3>
            
            <div style={{ 
              fontSize: 14, 
              color: 'var(--text-dim)', 
              lineHeight: 1.7, 
              marginBottom: 28, 
              textAlign: 'center',
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '0 8px'
            }}>
              {platformUpdate.message.split('\n').map((line, idx) => (
                <div key={idx} style={{ marginBottom: line.trim() === '' ? 12 : 6, color: line.includes('XP') ? '#38bdf8' : 'var(--text-dim)', fontWeight: line.includes('XP') ? 600 : 400 }}>
                  {line}
                </div>
              ))}
            </div>

            <button 
              onClick={() => setPlatformUpdate(null)} 
              className="premium-btn" 
              style={{ width: '100%', padding: '16px 24px', fontSize: 15, borderRadius: 16, background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)' }}
            >
              Awesome! Let's Go 🚀
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </main>
  );
}
