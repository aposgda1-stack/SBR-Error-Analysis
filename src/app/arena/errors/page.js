'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';
import MistakesExercise from '../../../components/MistakesExercise';
import SentenceGrid from '../../../components/SentenceGrid';

function ErrorsContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'practice' ? 'grid' : 'card';
  
  const data = sectionsData.identify_error_data;
  const mistakes = data.the_130_mistakes;
  const [view, setView] = useState(initialMode); // 'card' or 'grid'
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    setView('card');
  };

  return (
    <>
      <div style={{ padding: '24px 20px', maxWidth: 600, margin: '0 auto' }}>
        <div className="animate-slide-up" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ padding: '8px 12px', background: 'rgba(124, 77, 255, 0.1)', border: '1px solid var(--primary)', borderRadius: 12, color: 'var(--primary)', fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase' }}>
              Module 01
            </div>
            
            {/* View Switcher */}
            <div style={{ display: 'flex', background: 'var(--bg-glass)', borderRadius: 10, padding: 4 }}>
              <button 
                onClick={() => setView('card')}
                style={{ padding: '6px 12px', border: 'none', borderRadius: 8, background: view === 'card' ? 'var(--primary)' : 'transparent', color: 'white', cursor: 'pointer', transition: '0.3s' }}
              >
                <span className="mi" style={{ fontSize: 18 }}>view_carousel</span>
              </button>
              <button 
                onClick={() => setView('grid')}
                style={{ padding: '6px 12px', border: 'none', borderRadius: 8, background: view === 'grid' ? 'var(--primary)' : 'transparent', color: 'white', cursor: 'pointer', transition: '0.3s' }}
              >
                <span className="mi" style={{ fontSize: 18 }}>grid_view</span>
              </button>
            </div>
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>Error Hunter</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Master the 130 most common mistakes.</p>
        </div>

        {view === 'card' ? (
          <div className="animate-fade-in">
            <MistakesExercise data={data} startIndex={selectedIndex} />
          </div>
        ) : (
          <div className="animate-slide-up glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Select a Sentence</h4>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>Jump directly to any specific case.</p>
            <SentenceGrid sentences={mistakes} onSelect={handleSelect} activeIndex={selectedIndex} />
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
