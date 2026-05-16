'use client';
import { useState, useEffect } from 'react';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';

const PHRASAL_DATA = sectionsData.phrasal_verbs || {};

export default function PhrasalArena() {
  const [activeRoot, setActiveRoot] = useState(null);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  const startModule = (root) => {
    setActiveRoot(root);
    setIndex(0);
    setShowAnswer(false);
    setCompleted(false);
  };

  const currentPhrasals = activeRoot ? PHRASAL_DATA[activeRoot] : [];
  const current = currentPhrasals[index];

  const handleNext = () => {
    if (index < currentPhrasals.length - 1) {
      setIndex(i => i + 1);
      setShowAnswer(false);
    } else {
      setCompleted(true);
      // Sync results
      const uId = JSON.parse(localStorage.getItem('sbr_user') || '{}').userId;
      if (uId) {
        fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sync', userId: uId, incXp: 10, incDone: 1 })
        }).catch(console.error);
      }
    }
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ padding: '24px 20px', maxWidth: 600, margin: '0 auto' }}>
        {activeRoot === null ? (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>Phrasal Mastery</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Master phrasal verbs grouped by their root word.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.keys(PHRASAL_DATA).map((rootKey, i) => {
                const count = PHRASAL_DATA[rootKey].length;
                return (
                  <button
                    key={rootKey}
                    onClick={() => startModule(rootKey)}
                    className="glass-card"
                    style={{
                      width: '100%', padding: '20px', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', cursor: 'pointer', transition: '0.2s', border: '1px solid var(--border-glass)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Module {i + 1}</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'white', textTransform: 'capitalize' }}>{rootKey} Verbs</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{count} verbs</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255, 64, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                      <span className="mi">play_arrow</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="animate-slide-up">
            <button 
              onClick={() => setActiveRoot(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginBottom: 24 }}
            >
              <span className="mi" style={{ fontSize: 18 }}>arrow_back</span> Back to Modules
            </button>
            
            <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {!completed ? (
                <div className="animate-fade-in" key={index}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 32, textTransform: 'uppercase', letterSpacing: 2 }}>Verb {index + 1} of {currentPhrasals.length}</div>
                  
                  <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent)', marginBottom: 8, letterSpacing: -1 }}>{current.verb}</div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 48, fontWeight: 600, textTransform: 'uppercase' }}>Root: {activeRoot}</p>
                  
                  {showAnswer ? (
                    <div className="animate-slide-up" style={{ background: 'rgba(255,255,255,0.03)', padding: '24px', borderRadius: 20, border: '1px solid var(--border-glass)', marginBottom: 40 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 8, textTransform: 'uppercase' }}>Definition</div>
                      <p style={{ fontSize: 18, color: 'white', fontWeight: 600, direction: 'ltr' }}>{current.def}</p>
                    </div>
                  ) : (
                    <div style={{ height: 120 }}></div>
                  )}

                  <button className="premium-btn" style={{ width: '100%', background: showAnswer ? 'var(--bg-glass)' : 'var(--grad-primary)', border: showAnswer ? '1px solid var(--border-glass)' : 'none' }} onClick={() => showAnswer ? handleNext() : setShowAnswer(true)}>
                    {showAnswer ? 'Next Verb' : 'Show Meaning'}
                    <span className="mi">{showAnswer ? 'arrow_forward' : 'visibility'}</span>
                  </button>
                </div>
              ) : (
                <div className="animate-slide-up">
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 30px var(--primary-glow)' }}>
                    <span className="mi" style={{ fontSize: 40, color: 'white' }}>done_all</span>
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Module Complete!</h3>
                  <p style={{ color: 'var(--text-dim)', marginBottom: 32 }}>You've reviewed all "{activeRoot}" phrasal verbs.</p>
                  <button className="premium-btn" onClick={() => setActiveRoot(null)} style={{ margin: '0 auto' }}>Back to Modules</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
