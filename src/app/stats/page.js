'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      
      <div style={{ padding: '40px 20px' }}>
        {/* Profile Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: 20 }}>
            <div style={{ 
              position: 'absolute', inset: -4, borderRadius: '50%', 
              background: 'var(--grad-primary)', filter: 'blur(15px)', opacity: 0.5 
            }} />
            <img 
              src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
              style={{ width: 120, height: 120, borderRadius: '50%', border: '4px solid var(--bg-main)', position: 'relative', objectFit: 'cover' }} 
            />
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800 }}>{user.name}</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Student ID: <span style={{ fontFamily: 'JetBrains Mono' }}>#{user.userId.slice(-6)}</span></p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
          <StatCard label="Global Rank" val="#12" icon="workspace_premium" color="var(--primary)" />
          <StatCard label="Total XP" val={user.score || 0} icon="bolt" color="var(--secondary)" />
          <StatCard label="Accuracy" val="92%" icon="shutter_speed" color="var(--success)" />
          <StatCard label="Days Streak" val="14" icon="local_fire_department" color="var(--accent)" />
        </div>

        {/* Settings / Actions */}
        <div className="glass-panel" style={{ padding: '8px' }}>
          <ActionItem icon="edit" label="Edit Profile" />
          <ActionItem icon="notifications" label="Study Reminders" />
          <ActionItem icon="security" label="Privacy Settings" />
          <ActionItem icon="logout" label="Sign Out" color="var(--error)" onClick={handleLogout} last />
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, marginTop: 40, textTransform: 'uppercase', letterSpacing: 2 }}>SBR Academy v1.0 Premium</p>
      </div>

      <BottomNav />
    </main>
  );
}

function StatCard({ label, val, icon, color }) {
  return (
    <div className="glass-card" style={{ padding: '24px 20px' }}>
      <span className="material-symbols-rounded" style={{ color, fontSize: 24, marginBottom: 12 }}>{icon}</span>
      <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'JetBrains Mono' }}>{val}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
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
        <span className="material-symbols-rounded" style={{ color: color === 'white' ? 'var(--text-dim)' : color, fontSize: 22 }}>{icon}</span>
        <span style={{ fontSize: 15, fontWeight: 600, color }}>{label}</span>
      </div>
      <span className="material-symbols-rounded" style={{ color: 'var(--text-muted)', fontSize: 20 }}>chevron_right</span>
    </div>
  );
}
