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
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="animate-slide-up" style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ 
            width: 72, height: 72, borderRadius: 24, background: 'var(--grad-primary)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            boxShadow: '0 0 40px var(--primary-glow)'
          }}>
            <span className="material-symbols-rounded" style={{ fontSize: 36, color: 'white' }}>auto_awesome</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>SBR Academy</h1>
          <p style={{ color: 'var(--text-dim)' }}>{isLogin ? 'Login to your student account' : 'Register for the final exam'}</p>
        </div>

        <div className="glass-panel" style={{ padding: '32px' }}>
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8, letterSpacing: 1 }}>
                Email Address
              </label>
              <input 
                type="email" 
                className="premium-input" 
                style={{ width: '100%' }} 
                placeholder="student@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>

            {!isLogin && (
              <div className="animate-fade-in">
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8, letterSpacing: 1 }}>
                  Full Name
                </label>
                <input 
                  type="text" 
                  className="premium-input" 
                  style={{ width: '100%' }} 
                  placeholder="Your display name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
            )}
            
            <div>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: 8, letterSpacing: 1 }}>Password</label>
              <input 
                type="password" 
                className="premium-input" 
                style={{ width: '100%' }} 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>

            {error && (
              <div style={{ padding: '12px', background: 'rgba(255, 82, 82, 0.1)', border: '1px solid var(--error)', borderRadius: 12, color: 'var(--error)', fontSize: 13, textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="premium-btn" style={{ width: '100%', padding: 18, marginTop: 8 }}>
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
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
