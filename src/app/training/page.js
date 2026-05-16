'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

const CURRICULUM = [
  {
    title: 'Error Analysis',
    icon: 'gps_fixed',
    color: '#7c4dff',
    branches: [
      { name: '130 Common Mistakes', href: '/arena/errors', info: 'Core Stylistics' },
      { name: 'Identify & Correct', href: '/arena/errors?mode=practice', info: 'Practice Exercises' }
    ]
  },
  {
    title: 'Work Vocabulary',
    icon: 'work_outline',
    color: '#ffea00',
    branches: [
      { name: 'Verbs & Nouns', href: '/arena/work', info: 'Business Basics' },
      { name: 'Idioms & Phrases', href: '/arena/work', info: 'Professional English' }
    ]
  },
  {
    title: 'Grammar Guide',
    icon: 'bolt',
    color: '#00e5ff',
    branches: [
      { name: 'Modal Verbs', href: '/arena/grammar', info: 'Extended Usage' },
      { name: 'Sentence Structure', href: '/arena/grammar', info: 'Advanced Rules' }
    ]
  },
  {
    title: 'Phrasal Verbs',
    icon: 'sync_alt',
    color: '#ff4081',
    branches: [
      { name: 'Cut, Come, Give', href: '/arena/phrasal', info: 'Common Verbs' },
      { name: 'Do & Make', href: '/arena/phrasal', info: 'Action Verbs' }
    ]
  }
];

export default function TrainingPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filteredCurriculum = CURRICULUM.map(section => ({
    ...section,
    branches: section.branches.filter(b => 
      b.name.toLowerCase().includes(search.toLowerCase()) || 
      b.info.toLowerCase().includes(search.toLowerCase()) ||
      section.title.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(section => section.branches.length > 0);

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
            <div key={idx} className="glass-panel animate-slide-up" style={{ overflow: 'hidden', animationDelay: `${idx * 0.1}s` }}>
              {/* Header */}
              <div style={{ 
                padding: '24px', 
                background: `linear-gradient(90deg, ${section.color}15 0%, transparent 100%)`,
                display: 'flex', alignItems: 'center', gap: 16,
                borderBottom: '1px solid var(--border-glass)'
              }}>
                <div style={{ 
                  width: 48, height: 48, borderRadius: 14, background: section.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 8px 20px ${section.color}30`
                }}>
                  <span className="mi" style={{ color: 'white', fontSize: 24 }}>{section.icon}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800 }}>{section.title}</h3>
              </div>

              {/* Branches */}
              <div style={{ padding: '12px' }}>
                {section.branches.map((branch, bIdx) => (
                  <div 
                    key={bIdx}
                    onClick={() => router.push(branch.href)}
                    style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 20px', cursor: 'pointer', borderRadius: 16,
                      transition: '0.2s',
                    }}
                    className="hover-bright"
                  >
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>{branch.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{branch.info}</div>
                    </div>
                    <span className="mi" style={{ color: 'var(--text-muted)', fontSize: 18 }}>chevron_right</span>
                  </div>
                ))}
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
