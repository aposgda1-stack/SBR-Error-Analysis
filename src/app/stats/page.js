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
              <StatCard label="Accuracy" val="92%" icon="shutter_speed" color="var(--success)" />
              <StatCard label="Days Streak" val="14" icon="local_fire_department" color="var(--accent)" />
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="glass-panel" style={{ padding: 20 }}>
              <h4 style={{ fontSize: 14, marginBottom: 20 }}>Recent Progress</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { task: '130 Sentences', time: '2h ago', xp: '+45' },
                  { task: 'Grammar Quiz', time: 'Yesterday', xp: '+120' },
                  { task: 'Work Vocab', time: '3 days ago', xp: '+30' }
                ].map((act, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottom: '1px solid var(--border-glass)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{act.task}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{act.time}</div>
                    </div>
                    <div style={{ color: 'var(--success)', fontWeight: 800 }}>{act.xp} XP</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass-panel" style={{ padding: '8px' }}>
              <ActionItem icon="edit" label="Edit Profile" />
              <ActionItem icon="notifications" label="Study Reminders" />
              <ActionItem icon="security" label="Privacy Settings" />
              <ActionItem icon="logout" label="Sign Out" color="var(--error)" onClick={handleLogout} last />
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 10, marginTop: 40, textTransform: 'uppercase', letterSpacing: 2 }}>SBR Academy Premium v2.0</p>
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
