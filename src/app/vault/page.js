'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

export default function ReviewVault() {
  const router = useRouter();
  const [vault, setVault] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    if (!local.userId) { router.push('/auth'); return; }

    fetch(`/api/user?userId=${local.userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.vault) {
          setVault(data.user.vault.reverse());
        }
        setLoading(false);
      });
  }, []);

  const removeMistake = async (itemId) => {
    const local = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    setVault(prev => prev.filter(v => v.id !== itemId));
    
    try {
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'removeFromVault', userId: local.userId, itemId })
      });
    } catch (err) { console.error('Failed to remove mistake', err); }
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 110 }}>
      <TopBar />
      
      <div style={{ padding: '32px 20px', maxWidth: 600, margin: '0 auto' }}>
        <div className="animate-slide-up" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
            <div style={{ 
              width: 48, height: 48, borderRadius: 16, background: 'var(--grad-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px var(--primary-glow)'
            }}>
              <span className="mi" style={{ color: 'white', fontSize: 24 }}>auto_delete</span>
            </div>
            <div>
              <h2 style={{ fontSize: 28, fontWeight: 800 }}>Review Vault</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>Personalized list of your previous mistakes.</p>
            </div>
          </div>
          <div className="aurora-line" style={{ width: '100%' }} />
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
            <div className="mi animate-spin-slow" style={{ fontSize: 40, marginBottom: 16 }}>refresh</div>
            <p>Accessing your vault...</p>
          </div>
        ) : vault.length === 0 ? (
          <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <span className="mi" style={{ fontSize: 64, color: 'var(--success)', opacity: 0.3, marginBottom: 20 }}>verified_user</span>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Empty Vault!</h3>
            <p style={{ color: 'var(--text-dim)', maxWidth: 300, margin: '0 auto' }}>
              You haven't made any mistakes yet. Keep up the perfect performance!
            </p>
          </div>
        ) : (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {vault.map((item, i) => (
              <div key={i} className="glass-card" style={{ padding: '24px', position: 'relative' }}>
                <button 
                  onClick={() => removeMistake(item.id)}
                  style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(52, 211, 153, 0.1)', border: '1px solid var(--success)', color: 'var(--success)', borderRadius: 8, padding: '4px 8px', fontSize: 10, fontWeight: 800, cursor: 'pointer' }}
                >
                  <span className="mi" style={{ fontSize: 14, verticalAlign: 'middle', marginRight: 4 }}>done_all</span>
                  MASTERED
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span className="neon-tag" style={{ fontSize: 9 }}>{item.topic}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{new Date(item.date).toLocaleDateString()}</span>
                </div>
                
                <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(248, 113, 113, 0.05)', borderRadius: 12, borderLeft: '3px solid var(--error)' }}>
                  <div style={{ fontSize: 10, color: 'var(--error)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>The Mistake</div>
                  <p style={{ fontSize: 16, color: 'white', opacity: 0.8 }}>{item.wrong}</p>
                </div>

                <div style={{ padding: '12px 16px', background: 'rgba(52, 211, 153, 0.05)', borderRadius: 12, borderLeft: '3px solid var(--success)' }}>
                  <div style={{ fontSize: 10, color: 'var(--success)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Correct Form</div>
                  <p style={{ fontSize: 16, color: 'white', fontWeight: 600 }}>{item.correct}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
