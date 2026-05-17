'use client';
import { useState } from 'react';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import confusingData from '../../../../data/confusing.json';
import VocabExercise from '../../../components/VocabExercise';

export default function ConfusingArena() {
  const [activeTask, setActiveTask] = useState(null);

  // Group into modules of 1 pair each (matches curriculum exactly)
  const GROUP_SIZE = 1;
  const gapModules = [];
  
  for (let i = 0; i < confusingData.length; i += GROUP_SIZE) {
    const chunk = confusingData.slice(i, i + GROUP_SIZE);
    
    let combinedText = [];
    let combinedBoxWords = [];
    let combinedAnswers = {};
    let globalIndex = 1;
    
    chunk.forEach(pairItem => {
      combinedBoxWords.push(...pairItem.pair.split('/').map(w => w.trim()));
      
      pairItem.sentences.forEach(sentence => {
        // Find the "___" and replace with "(1) ___"
        const gapText = sentence.text.replace('___', `(${globalIndex}) ___`);
        combinedText.push(`${globalIndex}. ${gapText}`);
        combinedAnswers[globalIndex] = sentence.answer;
        globalIndex++;
      });
    });

    // Remove duplicates from box words if any (e.g., take / pass might share words)
    combinedBoxWords = [...new Set(combinedBoxWords)];

    gapModules.push({
      id: `confusing_mod_${i + 1}`,
      title: `${chunk[0].pair.split('/')[0].trim()} vs ${chunk[0].pair.split('/')[1]?.trim() || ''}`,
      desc: 'Complete the sentences correctly.',
      task: {
        title: `Pair ${i + 1}: ${chunk[0].pair}`,
        instruction: 'Complete the sentences with the correct word from the bank:',
        text: combinedText.join('\n\n'),
        box_words: combinedBoxWords,
        answers: combinedAnswers
      }
    });
  }

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ padding: '24px 20px', maxWidth: 600, margin: '0 auto' }}>
        {activeTask === null ? (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 32 }}>
              <div style={{ padding: '8px 12px', display: 'inline-block', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: 12, color: '#10b981', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
                MODULE 05
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>False Friends</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Master 34 confusing pairs and false friends to perfect your accuracy.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {gapModules.map((mod, i) => (
                <button
                  key={mod.id}
                  onClick={() => setActiveTask(mod.task)}
                  className="glass-card"
                  style={{
                    width: '100%', padding: '20px', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', cursor: 'pointer', transition: '0.2s', border: '1px solid var(--border-glass)'
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, color: '#10b981', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Set {i + 1}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>{mod.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{mod.desc}</div>
                  </div>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <span className="mi">play_arrow</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="animate-slide-up">
            <button 
              onClick={() => setActiveTask(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginBottom: 24 }}
            >
              <span className="mi" style={{ fontSize: 18 }}>arrow_back</span> Back to Sets
            </button>
            
            <div className="glass-panel" style={{ padding: '2px', background: 'linear-gradient(135deg, rgba(16,185,129,0.2), transparent)' }}>
              <div style={{ background: 'var(--bg-card)', borderRadius: 22, padding: '24px' }}>
                <VocabExercise task={activeTask} onFinish={() => setActiveTask(null)} />
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
