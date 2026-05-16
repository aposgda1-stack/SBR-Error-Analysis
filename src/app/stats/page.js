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
        setUser({ ...data.user, userId: local.userId });
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/auth');
  };

  if (loading) return null;

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      
      <div style={{ padding: '40px 20px', maxWidth: 600, margin: '0 auto' }}>
        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
            <div style={{ 
              position: 'absolute', inset: -4, borderRadius: '50%', 
              background: 'var(--grad-primary)', filter: 'blur(15px)', opacity: 0.5 
            }} />
            {user.image ? (
              <img 
                src={user.image} 
                style={{ width: 100, height: 100, borderRadius: '50%', border: '4px solid var(--bg-main)', position: 'relative', objectFit: 'cover' }} 
              />
            ) : (
              <div style={{
                width: 100, height: 100, borderRadius: '50%', border: '4px solid var(--bg-main)', position: 'relative',
                background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 40, fontWeight: 800, color: 'white'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800 }}>{user.name}</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>Student ID: <span style={{ fontFamily: 'monospace' }}>#{user.userId.slice(-6)}</span></p>
        </div>

        {/* Custom Tabs */}
        <div className="glass-card" style={{ display: 'flex', padding: 6, marginBottom: 32, borderRadius: 16 }}>
          {['overview', 'activity', 'settings'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '12px', border: 'none', borderRadius: 12,
                background: activeTab === tab ? 'var(--primary)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-dim)',
                fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1,
                cursor: 'pointer', transition: '0.3s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-slide-up">
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <StatCard label="Global Rank" val={`#${user.rank || 'N/A'}`} icon="workspace_premium" color="var(--primary)" />
              <StatCard label="Total XP" val={user.xp || 0} icon="bolt" color="var(--secondary)" />
              <StatCard label="Current Level" val={Math.floor((user.xp || 0) / 100) + 1} icon="upgrade" color="var(--success)" />
              <StatCard label="Next Level In" val={`${100 - ((user.xp || 0) % 100)} XP`} icon="trending_up" color="var(--accent)" />
            </div>
          )}

          {activeTab === 'activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: 'bolt', label: 'Total XP Earned', val: user.xp || 0, color: 'var(--primary)', suffix: ' XP' },
                { icon: 'auto_stories', label: 'Modules Completed', val: user.done || 0, color: 'var(--secondary)', suffix: ' sessions' },
                { icon: 'upgrade', label: 'Current Level', val: Math.floor((user.xp || 0) / 100) + 1, color: 'var(--success)', suffix: '' },
                { icon: 'workspace_premium', label: 'Global Rank', val: user.rank ? `#${user.rank}` : 'Unranked', color: 'var(--accent)', suffix: '' },
              ].map((item, i) => (
                <div key={i} className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span className="mi" style={{ fontSize: 24, color: item.color }}>{item.icon}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'JetBrains Mono', color: 'white' }}>{item.val}{item.suffix}</div>
                  </div>
                </div>
              ))}
              {user.updatedAt && (
                <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
                  Last synced: {new Date(user.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass-panel" style={{ padding: '8px' }}>
              <ActionItem icon="edit" label="Edit Profile Name" onClick={() => {
                const newName = prompt('Enter new profile name:', user.name);
                if (newName && newName.trim()) {
                  fetch('/api/user', { method: 'POST', body: JSON.stringify({ action: 'updateProfile', userId: user.userId, name: newName }) })
                    .then(() => {
                      const local = JSON.parse(localStorage.getItem('sbr_user') || '{}');
                      local.name = newName;
                      localStorage.setItem('sbr_user', JSON.stringify(local));
                      window.location.reload();
                    });
                }
              }} />
              <ActionItem icon="image" label="Upload Profile Image" onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (file.size > 2 * 1024 * 1024) {
                    alert('Image is too large. Please select an image under 2MB.');
                    return;
                  }
                  
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const base64Image = event.target.result;
                    fetch('/api/user', { 
                      method: 'POST', 
                      body: JSON.stringify({ action: 'updateProfile', userId: user.userId, image: base64Image }) 
                    })
                    .then(() => {
                      const local = JSON.parse(localStorage.getItem('sbr_user') || '{}');
                      local.image = base64Image;
                      localStorage.setItem('sbr_user', JSON.stringify(local));
                      window.location.reload();
                    });
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              }} />
              <ActionItem icon="delete_sweep" label="Reset Local Progress" onClick={() => {
                if (confirm('Are you sure you want to clear your local training progress? Your XP will remain on the server.')) {
                  localStorage.removeItem('sbr_progress');
                  alert('Local progress cleared.');
                }
              }} />
              <ActionItem icon="logout" label="Sign Out" color="var(--error)" onClick={handleLogout} last />
            </div>
          )}
        </div>

        <p className="premium-font" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 10, marginTop: 40, textTransform: 'uppercase', letterSpacing: 2 }}>SBR - Error Analysis v2.0</p>
      </div>

      <BottomNav />
    </main>
  );
}

function StatCard({ label, val, icon, color }) {
  return (
    <div className="glass-card" style={{ padding: '24px 16px' }}>
      <span className="mi" style={{ color, fontSize: 24, marginBottom: 12 }}>{icon}</span>
      <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace' }}>{val}</div>
      <div style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
    </div>
  );
}

function ActionItem({ icon, label, color = 'white', onClick, last }) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 20px', cursor: 'pointer',
        borderBottom: last ? 'none' : '1px solid var(--border-glass)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <span className="mi" style={{ color: color === 'white' ? 'var(--text-dim)' : color, fontSize: 22 }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color }}>{label}</span>
      </div>
      <span className="mi" style={{ color: 'var(--text-muted)', fontSize: 20 }}>chevron_right</span>
    </div>
  );
}
