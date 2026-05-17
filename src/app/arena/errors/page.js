'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';
import MistakesExercise from '../../../components/MistakesExercise';


import audioManager from '../../../utils/audio.js';

function ErrorsContent() {
  const [activeModuleIndex, setActiveModuleIndex] = useState(null);

  const data = sectionsData.identify_error_data;
  const mistakes = data.the_130_mistakes || [];
  const MODULE_SIZE = 10;
  const totalModules = Math.ceil(mistakes.length / MODULE_SIZE);

  return (
    <>
      <div style={{ padding: '24px 20px', maxWidth: 600, margin: '0 auto' }}>
        {activeModuleIndex === null ? (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 32 }}>
              <div style={{ padding: '8px 12px', display: 'inline-block', background: 'rgba(124, 77, 255, 0.1)', border: '1px solid var(--primary)', borderRadius: 12, color: 'var(--primary)', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
                MODULE 02
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>Error Hunter</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Master 130 syntax corrections to eliminate common student errors.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* The Ultimate Challenge Card */}
              <button
                onClick={() => {
                  audioManager.play('CLICK');
                  setActiveModuleIndex('all');
                }}
                className="glass-card animate-pulse"
                style={{
                  width: '100%', padding: '24px', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', cursor: 'pointer', transition: '0.2s', 
                  border: '2px solid rgba(124, 77, 255, 0.4)',
                  background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.15) 0%, rgba(12, 8, 25, 0.98) 100%)',
                  boxShadow: '0 8px 32px rgba(124, 77, 255, 0.15)',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                      🔥 THE ULTIMATE CHALLENGE
                    </div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'white', marginBottom: 2 }}>Comprehensive 130 Sentences</div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Correct all 130 errors in a single run. XP awarded ONCE.</div>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 15px var(--primary)' }}>
                  <span className="mi" style={{ fontSize: 24 }}>bolt</span>
                </div>
              </button>

              {Array.from({ length: totalModules }).map((_, i) => {
                const start = i * MODULE_SIZE + 1;
                const end = Math.min((i + 1) * MODULE_SIZE, mistakes.length);
                return (
                  <button
                    key={i}
                    onClick={() => {
                      audioManager.play('CLICK');
                      setActiveModuleIndex(i);
                    }}
                    className="glass-card"
                    style={{
                      width: '100%', padding: '20px', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', cursor: 'pointer', transition: '0.2s', 
                      border: '1px solid var(--border-glass)',
                      position: 'relative'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
                          Module {i + 1}
                        </div>
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>Sentences {start} - {end}</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(124, 77, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
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
              onClick={() => {
                audioManager.play('CLICK');
                setActiveModuleIndex(null);
              }}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginBottom: 24 }}
            >
              <span className="mi" style={{ fontSize: 18 }}>arrow_back</span> Back to Modules
            </button>
            <MistakesExercise 
              data={activeModuleIndex === 'all' ? mistakes : mistakes.slice(activeModuleIndex * MODULE_SIZE, (activeModuleIndex + 1) * MODULE_SIZE)} 
              isComprehensive={activeModuleIndex === 'all'}
              onComplete={() => setActiveModuleIndex(null)} 
            />
          </div>
        )}
      </div>
    </>
  );
}

export default function ErrorsArena() {
  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      <Suspense fallback={<div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Initializing...</div>}>
        <ErrorsContent />
      </Suspense>
      <BottomNav />
    </main>
  );
}
