'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';

const GRAMMAR = sectionsData.grammar_guide;

const buildDrills = (topicKey) => {
  const pool = [];
  const data = GRAMMAR[topicKey];
  if (!data || !data.practice) return [];
  
  const topicLabel = topicKey.replace(/_/g, ' ');
  data.practice.forEach((item, i) => {
    if (item.sentence && item.answer) {
      pool.push({ id: `g_${topicKey}_${i}`, topic: topicLabel, sentence: item.sentence, answer: item.answer, isBool: false });
    } else if (item.wrong && item.correct) {
      pool.push({ id: `g_${topicKey}_${i}_t`, topic: topicLabel, sentence: item.correct, correctAnswer: true, isBool: true });
      pool.push({ id: `g_${topicKey}_${i}_f`, topic: topicLabel, sentence: item.wrong, correctAnswer: false, isBool: true });
    }
  });

  return [...pool].map(item => {
    if (item.isBool) return item;
    const makeTrue = Math.random() > 0.5;
    if (makeTrue) return { ...item, sentence: (item.sentence || '').replace('___', item.answer), correctAnswer: true };
    
    // Attempt semantic distractors or use another answer from the same topic
    const otherAnswers = pool.filter(x => x.answer && x.answer !== item.answer).map(x => x.answer);
    let distractor = otherAnswers.length ? otherAnswers[Math.floor(Math.random() * otherAnswers.length)] : 'incorrectly';
    
    return { ...item, sentence: (item.sentence || '').replace('___', distractor), correctAnswer: false };
  }).sort(() => Math.random() - 0.5);
};

export default function GrammarArena() {
  const [activeModule, setActiveModule] = useState(null);
  const [drills, setDrills] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const startModule = (topicKey) => {
    setDrills(buildDrills(topicKey));
    setActiveModule(topicKey);
    setCurrentIndex(0);
    setScore(0);
    setCompleted(false);
    setFeedback(null);
  };

  const handleAnswer = (choice) => {
    if (feedback) return;
    const current = drills[currentIndex];
    const isCorrect = choice === current.correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < drills.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        setCompleted(true);
        // Sync XP to server
        const newScore = isCorrect ? score + 1 : score;
        const uId = JSON.parse(localStorage.getItem('sbr_user') || '{}').userId;
        if (uId && newScore > 0) {
          fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'sync', userId: uId, incXp: newScore, incDone: 1 })
          }).catch(console.error);
        }
      }
    }, 800);
  };

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ padding: '24px 20px', maxWidth: 600, margin: '0 auto' }}>
        {activeModule === null ? (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>Grammar Blitz</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Master grammar rules topic by topic.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.keys(GRAMMAR).map((topicKey, i) => {
                if (!GRAMMAR[topicKey].practice) return null;
                const title = topicKey.replace(/_/g, ' ').toUpperCase();
                return (
                  <button
                    key={topicKey}
                    onClick={() => startModule(topicKey)}
                    className="glass-card"
                    style={{
                      width: '100%', padding: '20px', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', cursor: 'pointer', transition: '0.2s', border: '1px solid var(--border-glass)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--secondary)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Module {i + 1}</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>{title}</div>
                    </div>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
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
              onClick={() => setActiveModule(null)}
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', marginBottom: 24 }}
            >
              <span className="mi" style={{ fontSize: 18 }}>arrow_back</span> Back to Modules
            </button>
            
            <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {feedback && (
                <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: feedback === 'correct' ? 'rgba(0, 230, 118, 0.9)' : 'rgba(255, 82, 82, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
                  <span className="mi" style={{ fontSize: 80, color: 'white' }}>{feedback === 'correct' ? 'check_circle' : 'cancel'}</span>
                </div>
              )}

              {!completed ? (
                <div className="animate-fade-in">
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 800, marginBottom: 24, textTransform: 'uppercase', letterSpacing: 2 }}>Drill {currentIndex + 1} of {drills.length}</div>
                  <p style={{ fontSize: 22, fontWeight: 600, marginBottom: 48, lineHeight: 1.5, direction: 'ltr' }}>&ldquo;{drills[currentIndex].sentence}&rdquo;</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <button onClick={() => handleAnswer(true)} className="premium-btn" style={{ background: 'rgba(0, 230, 118, 0.15)', color: 'var(--success)', border: '1px solid var(--success)' }}>TRUE</button>
                    <button onClick={() => handleAnswer(false)} className="premium-btn" style={{ background: 'rgba(255, 82, 82, 0.15)', color: 'var(--error)', border: '1px solid var(--error)' }}>FALSE</button>
                  </div>
                </div>
              ) : (
                <div className="animate-slide-up">
                  <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 30px var(--primary-glow)' }}>
                    <span className="mi" style={{ fontSize: 40, color: 'white' }}>military_tech</span>
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Module Complete!</h3>
                  <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--secondary)', marginBottom: 32, fontFamily: 'JetBrains Mono' }}>{score} / {drills.length}</div>
                  <button className="premium-btn" onClick={() => setActiveModule(null)} style={{ margin: '0 auto' }}>Back to Modules</button>
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
