'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';
import MistakesExercise from '../../../components/MistakesExercise';


import audioManager from '../../../utils/audio.js';

function ErrorsContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'practice' ? 'grid' : 'card';
  
  const [activeTab, setActiveTab] = useState('mistakes'); // 'mistakes' or 'important'
  const [activeModuleIndex, setActiveModuleIndex] = useState(null);

  const data = sectionsData.identify_error_data;
  const mistakes = activeTab === 'mistakes' ? data.the_130_mistakes : data.identify_and_correct_practice;
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
              <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Master key syntax corrections and eliminate common student errors.</p>
            </div>

            {/* Premium Tab Switcher */}
            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.02)', padding: 6, borderRadius: 16, border: '1px solid var(--border-glass)', marginBottom: 24, gap: 4 }}>
              <button
                onClick={() => {
                  audioManager.play('CLICK');
                  setActiveTab('mistakes');
                  setActiveModuleIndex(null);
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeTab === 'mistakes' ? 'var(--grad-primary)' : 'transparent',
                  color: activeTab === 'mistakes' ? 'white' : 'var(--text-dim)',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: activeTab === 'mistakes' ? '0 4px 15px rgba(124, 77, 255, 0.3)' : 'none'
                }}
              >
                <span className="mi" style={{ fontSize: 18 }}>gavel</span>
                130 Mistakes
              </button>
              <button
                onClick={() => {
                  audioManager.play('CLICK');
                  setActiveTab('important');
                  setActiveModuleIndex(null);
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeTab === 'important' ? 'var(--grad-primary)' : 'transparent',
                  color: activeTab === 'important' ? 'white' : 'var(--text-dim)',
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: activeTab === 'important' ? '0 4px 15px rgba(124, 77, 255, 0.3)' : 'none'
                }}
              >
                <span className="mi" style={{ fontSize: 18, color: activeTab === 'important' ? 'white' : 'var(--gold)' }}>star</span>
                Important Errors (مهم)
              </button>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20, fontStyle: 'italic' }}>
              {activeTab === 'mistakes' 
                ? 'Systematic practice through 130 structured common mistakes.' 
                : 'Selected practice problems flagged as critical/important for student success.'}
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: totalModules }).map((_, i) => {
                const start = i * MODULE_SIZE + 1;
                const end = Math.min((i + 1) * MODULE_SIZE, mistakes.length);
                const isImportant = activeTab === 'important';
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
                      border: isImportant ? '1px solid rgba(255, 179, 0, 0.35)' : '1px solid var(--border-glass)',
                      position: 'relative',
                      boxShadow: isImportant ? '0 4px 20px rgba(255, 179, 0, 0.05)' : 'none'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontSize: 13, color: isImportant ? 'var(--gold)' : 'var(--primary)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
                          Module {i + 1}
                        </div>
                        {isImportant && (
                          <span style={{ 
                            background: 'rgba(255, 179, 0, 0.15)', 
                            border: '1px solid var(--gold)', 
                            borderRadius: 6, 
                            padding: '2px 6px', 
                            fontSize: 10, 
                            fontWeight: 800, 
                            color: 'var(--gold)',
                          }}>
                            ★ مهم
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>Sentences {start} - {end}</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: isImportant ? 'rgba(255, 179, 0, 0.15)' : 'rgba(124, 77, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isImportant ? 'var(--gold)' : 'var(--primary)' }}>
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
              data={mistakes.slice(activeModuleIndex * MODULE_SIZE, (activeModuleIndex + 1) * MODULE_SIZE)} 
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
