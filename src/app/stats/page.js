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
            <img 
              src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
              style={{ width: 100, height: 100, borderRadius: '50%', border: '4px solid var(--bg-main)', position: 'relative', objectFit: 'cover' }} 
            />
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
            <div className="glass-panel" style={{ padding: 20 }}>
              <h4 style={{ fontSize: 14, marginBottom: 20 }}>Recent Activity</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {user.updatedAt ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="mi" style={{ color: 'var(--primary)', fontSize: 24 }}>check_circle</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Platform Synchronization</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{new Date(user.updatedAt).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)' }}>
                    <span className="mi" style={{ fontSize: 32, marginBottom: 8, opacity: 0.5 }}>history_toggle_off</span>
                    <p style={{ fontSize: 13 }}>No recent activity recorded yet.</p>
                  </div>
                )}
              </div>
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
              <ActionItem icon="image" label="Edit Profile Image" onClick={() => {
                const newImage = prompt('Paste new image URL:', user.image || '');
                if (newImage !== null) {
                  fetch('/api/user', { method: 'POST', body: JSON.stringify({ action: 'updateProfile', userId: user.userId, image: newImage }) })
                    .then(() => {
                      const local = JSON.parse(localStorage.getItem('sbr_user') || '{}');
                      local.image = newImage;
                      localStorage.setItem('sbr_user', JSON.stringify(local));
                      window.location.reload();
                    });
                }
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
