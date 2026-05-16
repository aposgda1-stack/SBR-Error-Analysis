'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: isLogin ? 'login' : 'signup', 
          email, 
          name: isLogin ? undefined : name, 
          password 
        }),
      });
      
      const data = await res.json();
      
      if (data.userId) {
        localStorage.setItem('sbr_user', JSON.stringify({ 
          name: data.name, 
          userId: data.userId,
          image: data.image
        }));
        router.push('/');
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="animate-slide-up" style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ 
            width: 80, height: 80, borderRadius: 24, background: 'var(--grad-primary)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
            boxShadow: '0 8px 30px var(--primary-glow)'
          }}>
            <span className="mi" style={{ fontSize: 36, color: 'white' }}>fact_check</span>
          </div>
          <h1 className="premium-font" style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>SBR - Error Analysis</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>{isLogin ? 'Login to your student account' : 'Register for the final exam'}</p>
        </div>

        <div style={{ 
          background: 'rgba(255, 234, 0, 0.05)', border: '1px solid rgba(255, 234, 0, 0.2)', 
          borderRadius: 16, padding: '16px', marginBottom: 32, textAlign: 'center' 
        }}>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, lineHeight: 1.6 }}>
            <span style={{ color: '#ffea00', fontWeight: 800 }}>⚠️ DISCLAIMER:</span> This platform is a non-profit educational initiative developed by students to help peers prepare for the final exam. It is not affiliated with the official university administration.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '32px' }}>
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                Email Address
              </label>
              <input 
                type="email" 
                className="premium-input" 
                placeholder="student@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            {!isLogin && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Full Name
                </label>
                <input 
                  type="text" 
                  className="premium-input" 
                  placeholder="Your display name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
            )}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Password</label>
              <input 
                type="password" 
                className="premium-input" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            {error && (
              <div style={{ padding: '12px', background: 'rgba(255, 82, 82, 0.08)', border: '1px solid var(--error)', borderRadius: 12, color: 'var(--error)', fontSize: 13, textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="premium-btn" style={{ padding: 18, marginTop: 8 }}>
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>
              {isLogin ? "New student?" : "Already registered?"}
            </span>
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, marginLeft: 8, cursor: 'pointer', fontSize: 14 }}
            >
              {isLogin ? 'Register now' : 'Login here'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
