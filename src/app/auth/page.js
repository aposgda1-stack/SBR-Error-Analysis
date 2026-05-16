'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (localStorage.getItem('sbr_user')) {
      router.push('/');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isLogin ? 'login' : 'signup',
          ...formData
        })
      });
      
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        localStorage.setItem('sbr_user', JSON.stringify(data));
        router.push('/');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100dvh', background: 'var(--background)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16
    }}>
      <div style={{
        width: '100%', maxWidth: 400,
        background: 'var(--surface-container)',
        padding: 32, borderRadius: 24,
        border: '1px solid var(--outline-variant)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
        animation: 'slideUp 0.4s ease'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--primary)' }}>school</span>
          </div>
          <h1 style={{ fontFamily: 'Inter', fontWeight: 900, fontSize: 24, color: 'var(--on-surface)', letterSpacing: '-0.02em' }}>
            SBR Academy
          </h1>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 14, marginTop: 4 }}>
            {isLogin ? 'Welcome back, Student' : 'Join the Elite Study Platform'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 600 }}>Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  background: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)',
                  borderRadius: 12, padding: '12px 16px', color: 'var(--on-surface)', outline: 'none'
                }}
              />
            </div>
          )}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 600 }}>Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                background: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)',
                borderRadius: 12, padding: '12px 16px', color: 'var(--on-surface)', outline: 'none'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 600 }}>Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={{
                background: 'var(--surface-container-high)', border: '1px solid var(--outline-variant)',
                borderRadius: 12, padding: '12px 16px', color: 'var(--on-surface)', outline: 'none'
              }}
            />
          </div>

          {error && <p style={{ color: 'var(--error)', fontSize: 13, textAlign: 'center' }}>{error}</p>}

          <button
            disabled={loading}
            style={{
              marginTop: 12,
              background: 'var(--primary-container)', color: 'var(--on-primary-container)',
              border: 'none', borderRadius: 12, padding: 16,
              fontFamily: 'Inter', fontWeight: 800, fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(255,87,26,0.3)'
            }}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--on-surface-variant)' }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none', border: 'none', color: 'var(--primary)',
              fontWeight: 700, marginLeft: 8, cursor: 'pointer'
            }}
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}
