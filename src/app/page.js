'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const features = [
  { icon: 'troubleshoot', title: 'Smart Error Detection', desc: 'Pinpoint syntax and semantic errors interactively with instant feedback.', color: 'var(--primary)' },
  { icon: 'menu_book', title: 'Modular Grammar', desc: 'Focus on specific grammatical rules with precision drills designed for your exam.', color: 'var(--secondary)' },
  { icon: 'emoji_events', title: 'Live Leaderboard', desc: 'Compete with peers, track your global rank, and rise to the top in real time.', color: 'var(--gold)' },
  { icon: 'sync_alt', title: 'Phrasal Verbs', desc: 'Master 5 essential verb groups: cut, come, give, do & make.', color: 'var(--accent)' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

export default function LandingPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const localUser = JSON.parse(localStorage.getItem('sbr_user') || '{}');
    if (localUser.userId) router.push('/dashboard');
  }, [router]);

  if (!isClient) return null;

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-main)', overflowX: 'hidden', position: 'relative' }}>

      {/* === AMBIENT BACKGROUND ORBS === */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-15%',
          width: '70vw', height: '70vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 65%)',
          filter: 'blur(80px)', animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-15%',
          width: '60vw', height: '60vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 65%)',
          filter: 'blur(80px)', animation: 'float 10s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute', top: '40%', left: '40%',
          width: '40vw', height: '40vw', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 65%)',
          filter: 'blur(100px)', animation: 'float 12s ease-in-out infinite 2s'
        }} />
      </div>

      {/* === GRID PATTERN === */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(167,139,250,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(167,139,250,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)'
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

        {/* === NAVBAR === */}
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '20px 0', marginBottom: 40, flexWrap: 'wrap', gap: 16
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 18,
              background: 'var(--grad-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 32px var(--primary-glow), 0 0 0 1px rgba(167,139,250,0.25)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)'
              }} />
              <span className="mi" style={{ color: 'white', fontSize: 28, position: 'relative' }}>fact_check</span>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'white', letterSpacing: 0.5, lineHeight: 1.1 }}>
                SBR — ERROR ANALYSIS
              </div>
              <div style={{ fontSize: 10, color: 'var(--primary)', letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase', opacity: 0.8 }}>
                Final Exam Preparation
              </div>
            </div>
          </div>

          <Link href="/auth" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="premium-btn"
              style={{ padding: '12px 28px', fontSize: 14 }}
            >
              Enter Academy <span className="mi" style={{ fontSize: 18 }}>arrow_forward</span>
            </motion.div>
          </Link>
        </motion.nav>

        {/* === HERO === */}
        <div style={{ textAlign: 'center', maxWidth: 780, margin: '0 auto 100px', paddingTop: 20 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ marginBottom: 28 }}
          >
            <span className="neon-tag">Final Exam Prep · Interactive Platform</span>
          </motion.div>

          <motion.h1
            className="premium-font"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 'clamp(42px, 7vw, 80px)',
              fontWeight: 900, lineHeight: 1.05, marginBottom: 28,
              color: 'white'
            }}
          >
            Master{' '}
            <span className="text-gradient">Error Analysis</span>
            <br />with Precision.
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontSize: 18, color: 'var(--text-dim)', marginBottom: 52,
              lineHeight: 1.75, maxWidth: 560, margin: '0 auto 52px'
            }}
          >
            An interactive, high-performance platform built by students, for students — to conquer grammar, phrasal verbs, and error detection before your final exam.
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="premium-btn"
                style={{ padding: '18px 40px', fontSize: 17, borderRadius: 20 }}
              >
                Start Training Free
                <span className="mi" style={{ fontSize: 20 }}>rocket_launch</span>
              </motion.div>
            </Link>
            <Link href="/auth" style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '18px 32px', fontSize: 17, borderRadius: 20,
                  background: 'rgba(167,139,250,0.08)',
                  border: '1px solid rgba(167,139,250,0.3)',
                  color: 'var(--primary)', fontWeight: 700,
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'all 0.3s ease', cursor: 'pointer'
                }}
              >
                <span className="mi" style={{ fontSize: 20 }}>login</span>
                Sign In
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '24px 48px', marginTop: 64, flexWrap: 'wrap' }}
          >
            {[
              { val: '130+', label: 'Error Patterns' },
              { val: '5', label: 'Phrasal Verb Groups' },
              { val: '4', label: 'Curriculum Modules' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 32, fontWeight: 900, fontFamily: 'JetBrains Mono',
                  background: 'var(--grad-primary)', WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>{s.val}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* === FEATURES GRID === */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20, marginBottom: 100
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="glass-card"
              style={{ padding: '32px 28px', textAlign: 'left' }}
            >
              {/* Top aurora line */}
              <div style={{
                height: 3, borderRadius: 2, marginBottom: 28,
                background: `linear-gradient(90deg, ${f.color}, transparent)`
              }} />
              <div style={{
                width: 56, height: 56, borderRadius: 18,
                background: `${f.color}18`,
                border: `1px solid ${f.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
                boxShadow: `0 8px 24px ${f.color}20`
              }}>
                <span className="mi" style={{ fontSize: 28, color: f.color }}>{f.icon}</span>
              </div>
              <h3 className="premium-font" style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: 'white' }}>{f.title}</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.7 }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* === DEDICATION === */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{
            marginBottom: 60, textAlign: 'center',
            padding: '48px 32px',
            background: 'rgba(167,139,250,0.04)',
            border: '1px solid rgba(167,139,250,0.1)',
            borderRadius: 32,
            position: 'relative', overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, var(--accent), var(--primary), var(--secondary), transparent)',
            opacity: 0.6
          }} />
          <span className="mi" style={{ color: 'var(--accent)', fontSize: 36, marginBottom: 20, display: 'block' }}>favorite</span>
          <p className="premium-font" style={{
            fontSize: 20, color: 'rgba(255,255,255,0.88)',
            fontStyle: 'italic', maxWidth: 640, margin: '0 auto', lineHeight: 1.8
          }}>
            "Dedicated to my amazing friends. We survived Stylistics, we survived Integrated Sciences, and together — we will conquer Error Analysis."
          </p>
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 8 }}>
            {['⭐', '⭐', '⭐'].map((s, i) => (
              <span key={i} style={{ fontSize: 18 }}>{s}</span>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          style={{ textAlign: 'center', paddingBottom: 48 }}
        >
          <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2 }}>
            SBR — Error Analysis · Non-profit student initiative · v2.0
          </p>
        </motion.div>
      </div>
    </main>
  );
}
