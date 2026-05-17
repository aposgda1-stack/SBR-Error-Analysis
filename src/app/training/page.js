'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

const CURRICULUM = [
  {
    title: '130 Sentences',
    icon: 'gps_fixed',
    color: '#7c4dff',
    href: '/arena/errors',
    info: 'Master the 130 structural sentence errors'
  },
  {
    title: 'Work Vocabulary',
    icon: 'work_outline',
    color: '#ffea00',
    href: '/arena/work',
    info: 'Business & Employment: Verbs, Nouns, Idioms'
  },
  {
    title: 'Grammar Guide',
    icon: 'bolt',
    color: '#00e5ff',
    href: '/arena/grammar',
    info: 'Rules & Collocations: Modal Verbs, Adverbs, Adjectives'
  },
  {
    title: 'Phrasal Verbs',
    icon: 'sync_alt',
    color: '#ff4081',
    href: '/arena/phrasal',
    info: 'Essential Combinations: Cut, Come, Give, Make, Do'
  },
  {
    title: 'Confusing Pairs',
    icon: 'compare_arrows',
    color: '#10b981',
    href: '/arena/confusing',
    info: 'False Friends: Differentiate between 34 confusing pairs'
  }
];

export default function TrainingPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredCurriculum = CURRICULUM.filter(section => 
    section.title.toLowerCase().includes(search.toLowerCase()) || 
    section.info.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 120 }}>
      <TopBar />
      
      <div style={{ padding: '32px 20px', maxWidth: 800, margin: '0 auto' }}>
        <div className="animate-slide-up" style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 'clamp(24px, 8vw, 32px)', fontWeight: 800, color: 'white', marginBottom: 12 }}>Curriculum Hub</h2>
          
          {/* Search Bar */}
          <div style={{ position: 'relative', marginTop: 24 }}>
            <span className="mi" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>search</span>
            <input 
              type="text" 
              placeholder="Search topics, rules, or modules..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="premium-input"
              style={{ width: '100%', paddingLeft: 48, background: 'var(--bg-glass)', borderRadius: 16 }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
          {filteredCurriculum.map((section, idx) => (
            <div 
              key={idx} 
              onClick={() => router.push(section.href)}
              className="glass-panel animate-slide-up hover-bright" 
              style={{ 
                overflow: 'hidden', animationDelay: `${idx * 0.1}s`, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px',
                border: '1px solid var(--border-glass)'
              }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ 
                  width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${section.color}, ${section.color}99)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 20px ${section.color}40`
                }}>
                  <span className="mi" style={{ color: 'white', fontSize: 28 }}>{section.icon}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: 'white', marginBottom: 4 }}>{section.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{section.info}</p>
                </div>
              </div>
              <div style={{ 
                width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center' 
              }}>
                <span className="mi" style={{ color: 'white', fontSize: 20 }}>arrow_forward</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
      <style jsx>{`
        .hover-bright:hover {
          background: rgba(255,255,255,0.03);
        }
      `}</style>
    </main>
  );
}
