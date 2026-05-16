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
    <main style={{
      minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, position: 'relative', overflow: 'hidden'
    }}>

      {/* Ambient orbs */}
      <div style={{
        position: 'fixed', top: '-20%', left: '-20%', width: '70vw', height: '70vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 65%)',
        filter: 'blur(80px)', zIndex: 0
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', right: '-20%', width: '60vw', height: '60vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 65%)',
        filter: 'blur(80px)', zIndex: 0
      }} />

      <div className="animate-slide-up" style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 26,
            background: 'var(--grad-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 12px 40px var(--primary-glow), 0 0 0 1px rgba(167,139,250,0.2)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)'
            }} />
            <span className="mi" style={{ fontSize: 40, color: 'white', position: 'relative' }}>fact_check</span>
          </div>
          <h1 className="premium-font" style={{ fontSize: 30, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>
            SBR — Error Analysis
          </h1>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>
            {isLogin ? 'Welcome back, student' : 'Join the platform'}
          </p>
        </div>

        {/* Disclaimer */}
        <div style={{
          background: 'rgba(251,191,36,0.05)',
          border: '1px solid rgba(251,191,36,0.2)',
          borderRadius: 18, padding: '14px 16px',
          marginBottom: 28, textAlign: 'center'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.7 }}>
            <span style={{ color: 'var(--gold)', fontWeight: 800 }}>⚠️ DISCLAIMER: </span>
            This is a non-profit educational platform built by students to help peers prepare for the final exam. Not affiliated with the official university administration.
          </p>
        </div>

        {/* Form */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          {/* Tab switcher */}
          <div style={{
            display: 'flex', background: 'rgba(255,255,255,0.03)',
            borderRadius: 16, padding: 4, marginBottom: 28,
            border: '1px solid var(--border-glass)'
          }}>
            {['Login', 'Register'].map((tab, i) => (
              <button
                key={tab}
                onClick={() => { setIsLogin(i === 0); setError(''); }}
                style={{
                  flex: 1, padding: '11px', border: 'none', borderRadius: 12,
                  background: (i === 0) === isLogin ? 'var(--grad-primary)' : 'transparent',
                  color: 'white', fontSize: 13, fontWeight: 800,
                  cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                  fontFamily: 'Plus Jakarta Sans',
                  boxShadow: (i === 0) === isLogin ? '0 4px 16px var(--primary-glow)' : 'none',
                  letterSpacing: 0.5
                }}
              >{tab}</button>
            ))}
          </div>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5 }}>
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
                <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5 }}>
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
              <label style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5 }}>
                Password
              </label>
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
              <div style={{
                padding: '12px 16px',
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid var(--error)',
                borderRadius: 14, color: 'var(--error)',
                fontSize: 13, textAlign: 'center',
                display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center'
              }}>
                <span className="mi" style={{ fontSize: 18 }}>error_outline</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="premium-btn"
              style={{ padding: '18px', marginTop: 8, fontSize: 16, borderRadius: 18, width: '100%' }}
            >
              {loading ? (
                <>
                  <span className="mi" style={{ fontSize: 18, animation: 'spin-slow 1s linear infinite' }}>autorenew</span>
                  Processing...
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <span className="mi" style={{ fontSize: 20 }}>{isLogin ? 'login' : 'person_add'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', marginTop: 28, textTransform: 'uppercase', letterSpacing: 2 }}>
          SBR — Error Analysis · v2.0
        </p>
      </div>
    </main>
  );
}
