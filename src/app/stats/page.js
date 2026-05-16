'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    if (!local.userId) { router.push('/auth'); return; }

    fetch(`/api/user?userId=${local.userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser({ ...data.user, userId: local.userId });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
      <div className="animate-pulse" style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(167, 139, 250, 0.1)', border: '2px solid rgba(167,139,250,0.3)' }} />
      <div className="animate-pulse" style={{ width: 140, height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 10 }} />
    </div>
  );

  if (!user) return null;

  const level = Math.floor((user.xp || 0) / 100) + 1;
  const currentXp = (user.xp || 0) % 100;

  const badges = [
    { label: 'Pioneer', icon: 'rocket_launch', unlocked: (user.done || 0) >= 1, desc: 'Complete your first module' },
    { label: 'Scholar', icon: 'school', unlocked: (user.done || 0) >= 10, desc: '10 modules complete' },
    { label: 'Elite', icon: 'diamond', unlocked: (user.xp || 0) >= 1000, desc: 'Reach 1000 XP' },
    { label: 'Curator', icon: 'auto_stories', unlocked: (user.vault || []).length > 0, desc: 'Save to Review Vault' },
  ];

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 110, background: 'var(--bg-main)', position: 'relative' }}>
      <TopBar />

      {/* Ambient orbs */}
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-15%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(34,211,238,0.05) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ padding: '32px 20px', maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── PROFILE HERO ── */}
        <div className="animate-slide-up" style={{ marginBottom: 32 }}>
          <div style={{
            background: 'rgba(167,139,250,0.04)',
            border: '1px solid rgba(167,139,250,0.12)',
            borderRadius: 28, padding: '36px 24px',
            textAlign: 'center', position: 'relative', overflow: 'hidden'
          }}>
            {/* Aurora bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--accent))', opacity: 0.6 }} />

            {/* Avatar */}
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
              <div style={{ position: 'absolute', inset: -3, borderRadius: '50%', background: 'var(--grad-primary)', opacity: 0.4, filter: 'blur(12px)' }} />
              <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', border: '3px solid var(--primary)', boxShadow: '0 0 30px var(--primary-glow)', position: 'relative' }}>
                {user.image
                  ? <img src={user.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="avatar" />
                  : <div style={{ width: '100%', height: '100%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 900, color: 'white' }}>{(user.name || 'S').charAt(0).toUpperCase()}</div>
                }
              </div>
              {/* Level badge */}
              <div style={{ position: 'absolute', bottom: -4, right: -4, background: 'var(--grad-primary)', color: 'white', padding: '3px 9px', borderRadius: 10, fontSize: 12, fontWeight: 900, border: '2px solid var(--bg-main)', boxShadow: '0 4px 12px var(--primary-glow)' }}>
                LV{level}
              </div>
            </div>

            <h2 style={{ fontSize: 26, fontWeight: 900, color: 'white', letterSpacing: -0.5, marginBottom: 4 }}>{user.name}</h2>
            <p style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24 }}>Premium Candidate</p>

            {/* Mini stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 20, padding: 16, border: '1px solid var(--border-glass)' }}>
              {[
                { val: user.xp || 0, label: 'XP', color: 'var(--primary)' },
                { val: `#${user.rank || '--'}`, label: 'Rank', color: 'var(--gold)' },
                { val: user.done || 0, label: 'Modules', color: 'var(--secondary)' }
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', borderLeft: i > 0 ? '1px solid var(--border-glass)' : 'none' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* XP progress */}
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, fontWeight: 700 }}>
                <span style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Level {level}</span>
                <span style={{ color: 'var(--primary)' }}>{currentXp} / 100 XP</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ width: `${currentXp}%`, height: '100%', background: 'var(--grad-primary)', boxShadow: '0 0 10px var(--primary-glow)', transition: '1.2s cubic-bezier(0.4, 0, 0.2, 1)', borderRadius: 10 }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: 18, padding: 5, marginBottom: 28, border: '1px solid var(--border-glass)' }}>
          {[
            { id: 'overview', label: 'Overview', icon: 'grid_view' },
            { id: 'history', label: 'History', icon: 'history' },
            { id: 'settings', label: 'Settings', icon: 'settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '12px 8px', borderRadius: 14, border: 'none',
                background: activeTab === tab.id ? 'var(--grad-primary)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-dim)',
                fontSize: 12, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                cursor: 'pointer', transition: 'all 0.3s ease',
                boxShadow: activeTab === tab.id ? '0 6px 20px var(--primary-glow)' : 'none'
              }}
            >
              <span className="mi" style={{ fontSize: 16 }}>{tab.icon}</span>
              <span className="mobile-hide">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── CONTENT ── */}
        <div className="animate-fade-in" key={activeTab}>
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Badge grid */}
              <div className="glass-panel" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2 }}>Honor Badges</span>
                  <span className="mi" style={{ color: 'var(--gold)', fontSize: 20 }}>stars</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                  {badges.map((b, i) => (
                    <div key={i} className="glass-card" style={{
                      padding: 16, textAlign: 'center',
                      opacity: b.unlocked ? 1 : 0.3,
                      filter: b.unlocked ? 'none' : 'grayscale(1)',
                      border: b.unlocked ? '1px solid rgba(167,139,250,0.3)' : '1px solid var(--border-glass)'
                    }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: b.unlocked ? 'var(--grad-primary)' : 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', boxShadow: b.unlocked ? '0 0 20px var(--primary-glow)' : 'none' }}>
                        <span className="mi" style={{ color: b.unlocked ? 'white' : 'var(--text-muted)', fontSize: 22 }}>{b.icon}</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: b.unlocked ? 'white' : 'var(--text-muted)' }}>{b.label}</div>
                      <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 3, lineHeight: 1.3 }}>{b.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats detail */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
                  <span className="mi" style={{ color: 'var(--primary)', fontSize: 28, marginBottom: 8 }}>trending_up</span>
                  <div style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>{level > 5 ? 'Advanced' : 'Initiate'}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>Skill Tier</div>
                </div>
                <div className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
                  <span className="mi" style={{ color: 'var(--secondary)', fontSize: 28, marginBottom: 8 }}>psychology</span>
                  <div style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>{Math.min(100, (user.done || 0) * 10)}%</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>Mastery</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(!user.history || user.history.length === 0) ? (
                <div className="glass-panel" style={{ padding: 48, textAlign: 'center' }}>
                  <span className="mi" style={{ fontSize: 48, color: 'var(--text-muted)', marginBottom: 12, display: 'block' }}>history_toggle_off</span>
                  <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No activity yet. Start a training module!</p>
                </div>
              ) : (
                user.history.slice().reverse().slice(0, 15).map((h, i) => (
                  <div key={i} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(167,139,250,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="mi" style={{ color: 'var(--primary)', fontSize: 20 }}>auto_stories</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>{h.type || 'Session'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(h.date).toLocaleString('en-EG', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--success)' }}>+{h.xp} XP</div>
                      {h.accuracy && <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700 }}>{h.accuracy}% ACC</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass-panel" style={{ padding: 8 }}>
              <SettingRow icon="badge" label="Update Display Name" desc="Change your public leaderboard name" onClick={() => {
                const n = prompt('New Name:', user.name);
                if (n && n.trim()) {
                  fetch('/api/user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'updateProfile', userId: user.userId, name: n.trim() }) })
                    .then(() => window.location.reload());
                }
              }} />
              <SettingRow icon="camera_enhance" label="Update Avatar" desc="Upload a new profile picture" onClick={() => {
                const input = document.createElement('input');
                input.type = 'file'; input.accept = 'image/*';
                input.onchange = e => {
                  const f = e.target.files[0];
                  if (!f) return;
                  if (f.size > 2 * 1024 * 1024) { alert('Image must be under 2MB.'); return; }
                  const r = new FileReader();
                  r.onload = ev => {
                    fetch('/api/user', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'updateProfile', userId: user.userId, image: ev.target.result }) })
                      .then(() => window.location.reload());
                  };
                  r.readAsDataURL(f);
                };
                input.click();
              }} />
              <SettingRow icon="delete_sweep" label="Clear Local Cache" desc="Reset local storage data (safe)" onClick={() => {
                if (confirm('Clear local cache? Your server progress is safe.')) { localStorage.removeItem('sbr_progress'); alert('Done.'); }
              }} />
              <SettingRow icon="logout" label="Sign Out" desc="Log out from SBR Academy" color="var(--error)" onClick={handleLogout} last />
            </div>
          )}
        </div>

      </div>
      <BottomNav />
    </main>
  );
}

function SettingRow({ icon, label, desc, onClick, color = 'white', last }) {
  return (
    <div
      onClick={onClick}
      className="hover-bright"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 16px', cursor: 'pointer',
        borderBottom: last ? 'none' : '1px solid var(--border-glass)',
        borderRadius: last ? '0 0 20px 20px' : 0, transition: '0.2s'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span className="mi" style={{ color: color === 'white' ? 'var(--primary)' : color, fontSize: 22 }}>{icon}</span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color }}>{label}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
        </div>
      </div>
      <span className="mi" style={{ color: 'var(--text-muted)', fontSize: 20, flexShrink: 0 }}>chevron_right</span>
    </div>
  );
}
