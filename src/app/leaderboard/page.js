'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaders, setLeaders] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        setLeaders(data.leaderboard || []);

        const userData = JSON.parse(localStorage.getItem('sbr_user') || '{}');
        if (userData.userId) {
          const userRes = await fetch(`/api/user?userId=${userData.userId}`);
          const uData = await userRes.json();
          setUserRank(uData.user);
        }
      } catch (err) {} finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ minHeight: '100dvh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface)' }}>Loading...</div>;

  const top3 = [leaders[1], leaders[0], leaders[2]]; // Rank 2, 1, 3 for podium layout

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--background)', paddingTop: 48, paddingBottom: 80 }}>
      <TopBar title="TOP 10 LEADERBOARD" />

      <main style={{ padding: '24px 16px', maxWidth: 480, margin: '0 auto', direction: 'rtl' }}>
        
        {/* Page Title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'Inter', fontWeight: 800, fontSize: 32, color: 'var(--primary)', marginBottom: 8 }}>لوحة الشرف: التوب 10</h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px', background: 'rgba(255,87,26,0.1)', border: '1px solid var(--primary-container)', borderRadius: 999 }}>
            <span style={{ width: 8, height: 8, background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></span>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--primary)', textTransform: 'uppercase' }}>Mission Status: Active</span>
          </div>
        </div>

        {/* Top 3 Podium */}
        <section style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', alignItems: 'end', gap: 8, 
          marginBottom: 48, background: 'linear-gradient(180deg, rgba(255,87,26,0.1) 0%, transparent 100%)',
          padding: 16, borderRadius: 16, border: '1px solid rgba(173,137,126,0.3)'
        }}>
          {top3.map((user, i) => {
            if (!user) return <div key={i} />;
            const isFirst = i === 1;
            const rank = i === 0 ? 2 : (i === 1 ? 1 : 3);
            return (
              <div key={user.userId} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: isFirst ? 'translateY(-16px)' : 'none' }}>
                <div style={{ position: 'relative', marginBottom: isFirst ? 16 : 12 }}>
                  {isFirst && <span className="material-symbols-outlined" style={{ position: 'absolute', top: -32, left: '50%', transform: 'translateX(-50%)', color: 'var(--primary)', fontSize: 36, fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>}
                  <img src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                    style={{ 
                      width: isFirst ? 80 : 60, height: isFirst ? 80 : 60, borderRadius: '50%', 
                      border: `${isFirst ? 4 : 2}px solid ${isFirst ? 'var(--primary)' : 'var(--outline)'}`,
                      objectFit: 'cover', boxShadow: isFirst ? '0 0 15px rgba(255,181,158,0.3)' : 'none'
                    }} 
                  />
                  <div style={{ 
                    position: 'absolute', bottom: -8, left: -8, background: isFirst ? 'var(--primary)' : 'var(--surface-container-highest)', 
                    color: isFirst ? 'var(--on-primary-container)' : 'var(--on-surface)',
                    padding: isFirst ? '2px 10px' : '2px 8px', borderRadius: 20, fontSize: isFirst ? 14 : 12, fontWeight: 700 
                  }}>{rank}</div>
                </div>
                <div style={{ 
                  background: isFirst ? 'rgba(255,87,26,0.15)' : 'var(--surface-container-high)', 
                  width: '100%', height: isFirst ? 100 : (rank === 2 ? 80 : 70), borderRadius: '12px 12px 0 0',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 16,
                  border: `1px solid ${isFirst ? 'var(--primary-container)' : 'var(--outline-variant)'}`,
                  borderBottom: 'none'
                }}>
                  <span style={{ fontSize: isFirst ? 14 : 11, fontWeight: 700, color: 'var(--on-surface)', textAlign: 'center', padding: '0 4px', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                  <span style={{ fontSize: isFirst ? 18 : 14, fontWeight: 800, color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>{user.xp || 0}%</span>
                </div>
              </div>
            );
          })}
        </section>

        {/* List 4-10 */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {leaders.slice(3).map((user, i) => (
            <div key={user.userId} style={{
              background: 'var(--surface-container)', borderRadius: 16, padding: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              border: '1px solid var(--outline-variant)', transition: 'all 0.2s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, width: 24, color: 'var(--on-surface-variant)' }}>{i + 4}</span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{user.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--secondary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>[STUDENT ELITE]</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 700, color: 'var(--primary)' }}>{user.xp || 0}%</span>
                  <div style={{ width: 80, height: 4, background: 'var(--surface-container-highest)', borderRadius: 999, marginTop: 4 }}>
                    <div style={{ width: `${user.xp || 0}%`, height: '100%', background: 'var(--primary)', borderRadius: 999 }} />
                  </div>
                </div>
                <span className="material-symbols-outlined" style={{ color: 'var(--on-surface-variant)' }}>emoji_events</span>
              </div>
            </div>
          ))}
        </section>

        {/* User Stats Card */}
        {userRank && (
          <section style={{ marginTop: 32, padding: 24, background: 'var(--surface-container-high)', borderRadius: 20, borderLeft: '4px solid var(--primary)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>حالة التقدم الخاص بك</h3>
            <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: 20 }}>
              أنت الآن في المركز رقم {userRank.rank} من أصل {leaders.length > 0 ? 'مئات' : '...'} الطلاب. استمر في التدريبات المكثفة لتصل إلى لوحة الشرف.
            </p>
            <button 
              onClick={() => router.push('/')}
              style={{
                width: '100%', background: 'var(--primary-container)', color: 'var(--on-primary-container)',
                border: 'none', borderRadius: 12, padding: 14, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
              }}
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              بدء جلسة جديدة
            </button>
          </section>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
