'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const localUser = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    if (localUser.userId) {
      router.push('/dashboard');
    }
  }, [router]);

  if (!isClient) return null;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-main)', position: 'relative', overflow: 'hidden' }}>
      {/* Premium Background Effects */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 60%)', filter: 'blur(80px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 60%)', filter: 'blur(80px)', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
        {/* Navbar */}
        <motion.nav 
          initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 80, padding: '16px 0' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 24px var(--primary-glow)' }}>
              <span className="mi" style={{ color: 'white', fontSize: 28 }}>fact_check</span>
            </div>
            <h1 className="premium-font" style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5 }}>SBR</h1>
          </div>
          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <div className="premium-btn" style={{ padding: '12px 24px', fontSize: 14 }}>Enter Academy</div>
          </Link>
        </motion.nav>

        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <span style={{ padding: '8px 16px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid var(--primary)', borderRadius: 20, color: 'var(--primary)', fontSize: 12, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24, display: 'inline-block' }}>
              Final Exam Preparation
            </span>
          </motion.div>
          
          <motion.h2 
            className="premium-font"
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}
            style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24, textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
          >
            Master <span style={{ background: 'var(--grad-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Error Analysis</span> with Precision.
          </motion.h2>

          <motion.p 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontSize: 18, color: 'var(--text-dim)', marginBottom: 48, lineHeight: 1.6, maxWidth: 600, margin: '0 auto 48px' }}
          >
            An interactive, high-performance platform designed specifically to help you identify stylistic errors, conquer grammar, and expand your business vocabulary.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center' }}
          >
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <div className="premium-btn" style={{ padding: '16px 32px', fontSize: 16 }}>
                Start Training <span className="mi">arrow_forward</span>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 80 }}
        >
          {[
            { icon: 'troubleshoot', title: 'Smart Error Detection', desc: 'Identify syntax and semantic errors interactively.' },
            { icon: 'menu_book', title: 'Modular Grammar', desc: 'Focus on specific grammatical rules with targeted drills.' },
            { icon: 'speed', title: 'High Performance', desc: 'Premium transitions and blazing fast loading speeds.' }
          ].map((f, i) => (
            <div key={i} className="glass-card" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <span className="mi" style={{ fontSize: 32, color: 'var(--secondary)' }}>{f.icon}</span>
              </div>
              <h3 className="premium-font" style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Dedication Section */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}
          style={{ marginTop: 100, textAlign: 'center', padding: '40px 20px', borderTop: '1px solid var(--border-glass)' }}
        >
          <span className="mi" style={{ color: 'var(--accent)', fontSize: 32, marginBottom: 16 }}>favorite</span>
          <p className="premium-font" style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', fontStyle: 'italic', maxWidth: 600, margin: '0 auto' }}>
            "Dedicated to my amazing friends. We survived Stylistics, we survived Integrated Sciences, and we will conquer Error Analysis together. Best of luck to us all!"
          </p>
        </motion.div>
      </div>
    </main>
  );
}
