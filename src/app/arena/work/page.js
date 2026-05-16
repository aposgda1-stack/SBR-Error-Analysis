'use client';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';
import VocabExercise from '../../../components/VocabExercise';

export default function WorkArena() {
  const data = sectionsData.office_and_business_data;

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ padding: '24px 20px' }}>
        <div className="animate-slide-up" style={{ marginBottom: 32 }}>
          <div style={{ padding: '8px 12px', display: 'inline-block', background: 'rgba(255, 234, 0, 0.1)', border: '1px solid #ffea00', borderRadius: 12, color: '#ffea00', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
            MODULE 04
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>Business Lexicon</h2>
          <p style={{ color: 'var(--text-dim)' }}>Polish your professional vocabulary for the workplace.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2px', background: 'linear-gradient(135deg, rgba(255,234,0,0.2), transparent)' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 22, padding: '24px' }}>
            <VocabExercise data={data} />
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
