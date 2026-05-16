'use client';
import { useState, useEffect } from 'react';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setLeaders(data.leaders || []);
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ padding: '24px 20px' }}>
        <div className="animate-slide-up" style={{ marginBottom: 40, textAlign: 'center' }}>
          <div style={{ 
            width: 60, height: 60, borderRadius: 20, background: 'var(--grad-primary)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
            boxShadow: '0 0 30px var(--primary-glow)'
          }}>
            <span className="mi" style={{ fontSize: 32, color: 'white' }}>military_tech</span>
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>Hall of Fame</h2>
          <p style={{ color: 'var(--text-dim)' }}>Top performing students this week</p>
        </div>

        {/* Top 3 Podium */}
        {!loading && leaders.length >= 3 && (
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12, marginBottom: 48, padding: '0 10px' }}>
            {/* 2nd Place */}
            <PodiumUser user={leaders[1]} rank={2} height={120} color="#cbd5e1" />
            {/* 1st Place */}
            <PodiumUser user={leaders[0]} rank={1} height={160} color="#fbbf24" isFirst />
            {/* 3rd Place */}
            <PodiumUser user={leaders[2]} rank={3} height={100} color="#92400e" />
          </div>
        )}

        {/* Full List */}
        <div className="glass-panel" style={{ padding: '8px' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading champions...</div>
          ) : (
            leaders.slice(3).map((u, i) => (
              <div key={i} className="animate-slide-up" style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', borderBottom: i === leaders.length - 4 ? 'none' : '1px solid var(--border-glass)',
                animationDelay: `${i * 0.05}s`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-muted)', width: 20 }}>{i + 4}</span>
                  <img src={u.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-glass)' }} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Level {Math.floor(u.xp / 100) + 1}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>{u.xp}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)', textTransform: 'uppercase' }}>XP Points</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}

function PodiumUser({ user, rank, height, color, isFirst }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <img 
          src={user?.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
          style={{ 
            width: isFirst ? 80 : 64, height: isFirst ? 80 : 64, borderRadius: '50%', 
            border: `3px solid ${color}`, padding: 3, background: 'var(--bg-main)',
            boxShadow: isFirst ? `0 0 25px ${color}40` : 'none'
          }} 
        />
        <div style={{ 
          position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
          background: color, color: '#000', width: 24, height: 24, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900
        }}>{rank}</div>
      </div>
      <div style={{ 
        width: '100%', height, background: `linear-gradient(180deg, ${color}20 0%, transparent 100%)`,
        borderTop: `2px solid ${color}`, borderRadius: '12px 12px 0 0',
        display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 12
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'white', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || '---'}</div>
        <div style={{ fontSize: 14, fontWeight: 900, color, fontFamily: 'JetBrains Mono' }}>{user?.xp || 0}</div>
      </div>
    </div>
  );
}
