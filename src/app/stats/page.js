'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    if (!userData.userId) {
      router.push('/auth');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user?userId=${userData.userId}`);
        const data = await res.json();
        // Merge API data with local userId so profile update works
        setUser({ ...data.user, userId: userData.userId });
      } catch (err) {} finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;
      setSyncing(true);
      try {
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateProfile',
            userId: user.userId,
            image: base64
          })
        });
        if (res.ok) {
          setUser({ ...user, image: base64 });
        }
      } catch (err) {
        alert('Upload failed');
      } finally {
        setSyncing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem('sbr_user');
    localStorage.removeItem('sbr_progress');
    router.push('/auth');
  };

  if (loading || !user) return <div style={{ minHeight: '100dvh', background: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface)' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--background)', paddingTop: 48, paddingBottom: 80 }}>
      <TopBar title="MY PROFILE & STATS" />

      <main style={{ padding: '32px 16px', maxWidth: 480, margin: '0 auto' }}>
        
        {/* Profile Header */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <img 
              src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`} 
              style={{ width: 120, height: 120, borderRadius: '50%', border: '4px solid var(--primary)', objectFit: 'cover' }} 
            />
            <label style={{
              position: 'absolute', bottom: 0, right: 0,
              background: 'var(--primary-container)', color: 'var(--on-primary-container)',
              width: 36, height: 36, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: syncing ? 'not-allowed' : 'pointer', border: '2px solid var(--background)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>photo_camera</span>
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} disabled={syncing} />
            </label>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--on-surface)' }}>{user.name}</h2>
          <p style={{ color: 'var(--primary)', fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: 600 }}>RANK #{user.rank}</p>
        </section>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          <div style={{ background: 'var(--surface-container)', padding: 20, borderRadius: 16, border: '1px solid var(--outline-variant)', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)', fontFamily: 'JetBrains Mono' }}>{user.xp || 0}%</div>
            <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Overall Progress</div>
          </div>
          <div style={{ background: 'var(--surface-container)', padding: 20, borderRadius: 16, border: '1px solid var(--outline-variant)', textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--tertiary)', fontFamily: 'JetBrains Mono' }}>{user.level || 1}</div>
            <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', textTransform: 'uppercase' }}>Current Level</div>
          </div>
        </div>

        {/* Settings / Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button 
            onClick={() => router.push('/')}
            style={{
              width: '100%', background: 'var(--surface-container-high)', color: 'var(--on-surface)',
              border: '1px solid var(--outline-variant)', borderRadius: 12, padding: 16,
              display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, cursor: 'pointer'
            }}
          >
            <span className="material-symbols-outlined">dashboard</span>
            Go to Dashboard
          </button>
          <button 
            onClick={handleLogout}
            style={{
              width: '100%', background: 'rgba(255,180,171,0.1)', color: 'var(--error)',
              border: '1px solid rgba(255,180,171,0.3)', borderRadius: 12, padding: 16,
              display: 'flex', alignItems: 'center', gap: 12, fontWeight: 600, cursor: 'pointer'
            }}
          >
            <span className="material-symbols-outlined">logout</span>
            Log Out & Clear Cache
          </button>
        </div>

      </main>
      <BottomNav />
    </div>
  );
}
