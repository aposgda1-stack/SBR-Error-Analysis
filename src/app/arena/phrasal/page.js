'use client';
import { useState, useEffect } from 'react';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';

const PHRASALS = sectionsData.phrasal_verbs;

export default function PhrasalArena() {
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  const current = PHRASALS[index];

  const handleNext = () => {
    if (index < PHRASALS.length - 1) {
      setIndex(i => i + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
    }
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ padding: '24px 20px' }}>
        <div className="animate-slide-up" style={{ marginBottom: 32 }}>
          <div style={{ padding: '8px 12px', display: 'inline-block', background: 'rgba(255, 64, 129, 0.1)', border: '1px solid var(--accent)', borderRadius: 12, color: 'var(--accent)', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
            MODULE 03
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>Phrasal Mastery</h2>
          <p style={{ color: 'var(--text-dim)' }}>Visualize and memorize essential phrasal verbs.</p>
        </div>

        <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {!completed ? (
            <div className="animate-fade-in">
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 32, textTransform: 'uppercase', letterSpacing: 2 }}>Verb {index + 1} of {PHRASALS.length}</div>
              
              <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent)', marginBottom: 12, letterSpacing: -1 }}>{current.verb}</div>
              <p style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 48, fontWeight: 500 }}>{current.meaning}</p>
              
              {showAnswer ? (
                <div className="animate-slide-up" style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: 20, border: '1px solid var(--border-glass)', marginBottom: 40 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 8, textTransform: 'uppercase' }}>Example Usage</div>
                  <p style={{ fontSize: 18, color: 'white', fontStyle: 'italic', direction: 'ltr' }}>&ldquo;{current.example}&rdquo;</p>
                </div>
              ) : (
                <div style={{ height: 120 }}></div>
              )}

              <button className="premium-btn" style={{ width: '100%', background: showAnswer ? 'var(--bg-glass)' : 'var(--grad-primary)', border: showAnswer ? '1px solid var(--border-glass)' : 'none' }} onClick={() => showAnswer ? handleNext() : setShowAnswer(true)}>
                {showAnswer ? 'Next Verb' : 'Show Example'}
                <span className="material-symbols-rounded">{showAnswer ? 'arrow_forward' : 'visibility'}</span>
              </button>
            </div>
          ) : (
            <div className="animate-slide-up">
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 30px var(--primary-glow)' }}>
                <span className="material-symbols-rounded" style={{ fontSize: 40, color: 'white' }}>done_all</span>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>All Verbs Reviewed!</h3>
              <p style={{ color: 'var(--text-dim)', marginBottom: 32 }}>You're becoming a phrasal verb expert.</p>
              <button className="premium-btn" onClick={() => window.location.reload()} style={{ margin: '0 auto' }}>Start Over</button>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
