'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';
import MistakesExercise from '../../../components/MistakesExercise';


function ErrorsContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'practice' ? 'grid' : 'card';
  
  const data = sectionsData.identify_error_data;
  const mistakes = data.the_130_mistakes;
  const MODULE_SIZE = 10;
  const totalModules = Math.ceil(mistakes.length / MODULE_SIZE);
  
  const [activeModuleIndex, setActiveModuleIndex] = useState(null);

  return (
    <>
      <div style={{ padding: '24px 20px', maxWidth: 600, margin: '0 auto' }}>
        {activeModuleIndex === null ? (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>Error Hunter</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Master the 130 most common mistakes gradually.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Array.from({ length: totalModules }).map((_, i) => {
                const start = i * MODULE_SIZE + 1;
                const end = Math.min((i + 1) * MODULE_SIZE, mistakes.length);
                return (
                  <button
                    key={i}
                    onClick={() => setActiveModuleIndex(i)}
                    className="glass-card"
                    style={{
                      width: '100%', padding: '20px', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', cursor: 'pointer', transition: '0.2s', border: '1px solid var(--border-glass)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Module {i + 1}</div>
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
              onClick={() => setActiveModuleIndex(null)}
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
