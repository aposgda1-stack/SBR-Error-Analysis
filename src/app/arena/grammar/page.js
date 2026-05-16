'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';

const GRAMMAR = sectionsData.grammar_guide;

const buildDrills = () => {
  const pool = [];
  Object.entries(GRAMMAR).forEach(([topic, data]) => {
    if (!data.practice) return;
    const topicLabel = topic.replace(/_/g, ' ');
    data.practice.forEach((item, i) => {
      if (item.sentence && item.answer) {
        pool.push({ id: `g_${topic}_${i}`, topic: topicLabel, sentence: item.sentence, answer: item.answer, isBool: false });
      } else if (item.wrong && item.correct) {
        pool.push({ id: `g_${topic}_${i}_t`, topic: topicLabel, sentence: item.correct, correctAnswer: true, isBool: true });
        pool.push({ id: `g_${topic}_${i}_f`, topic: topicLabel, sentence: item.wrong, correctAnswer: false, isBool: true });
      }
    });
  });

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 40).map(item => {
    if (item.isBool) return item;
    const makeTrue = Math.random() > 0.5;
    if (makeTrue) return { ...item, sentence: (item.sentence || '').replace('___', item.answer), correctAnswer: true };
    const distractor = pool.find(x => x.answer && x.answer !== item.answer)?.answer || 'incorrectly';
    return { ...item, sentence: (item.sentence || '').replace('___', distractor), correctAnswer: false };
  }).sort(() => Math.random() - 0.5).slice(0, 20);
};

export default function GrammarArena() {
  const [drills, setDrills] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    setDrills(buildDrills());
  }, []);

  const handleAnswer = (choice) => {
    if (feedback) return;
    const current = drills[currentIndex];
    const isCorrect = choice === current.correctAnswer;
    if (isCorrect) setScore(s => s + 1);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < drills.length - 1) setCurrentIndex(i => i + 1);
      else setCompleted(true);
    }, 800);
  };

  if (!drills.length) return null;

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ padding: '24px 20px' }}>
        <div className="animate-slide-up" style={{ marginBottom: 32 }}>
          <div style={{ padding: '8px 12px', display: 'inline-block', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--secondary)', borderRadius: 12, color: 'var(--secondary)', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
            MODULE 02
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800 }}>Grammar Blitz</h2>
          <p style={{ color: 'var(--text-dim)' }}>Rapid-fire true/false grammar challenge.</p>
        </div>

        <div className="glass-panel" style={{ padding: '40px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden', minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {feedback && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 10, background: feedback === 'correct' ? 'rgba(0, 230, 118, 0.9)' : 'rgba(255, 82, 82, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.2s ease' }}>
              <span className="material-symbols-rounded" style={{ fontSize: 80, color: 'white' }}>{feedback === 'correct' ? 'check_circle' : 'cancel'}</span>
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
                <span className="material-symbols-rounded" style={{ fontSize: 40, color: 'white' }}>military_tech</span>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Drill Complete!</h3>
              <div style={{ fontSize: 48, fontWeight: 800, color: 'var(--secondary)', marginBottom: 32, fontFamily: 'JetBrains Mono' }}>{score} / {drills.length}</div>
              <button className="premium-btn" onClick={() => window.location.reload()} style={{ margin: '0 auto' }}>Restart Arena</button>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </main>
  );
}
