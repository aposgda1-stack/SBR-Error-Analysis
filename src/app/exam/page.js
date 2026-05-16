'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';
import Q1ErrorHunter from '../../components/exam/Q1ErrorHunter';
import Q2PhrasalVerbs from '../../components/exam/Q2PhrasalVerbs';
import Q3WorkSheet from '../../components/exam/Q3WorkSheet';
import Q4MCQ from '../../components/exam/Q4MCQ';

const QUESTIONS = ['Q1', 'Q2', 'Q3', 'Q4'];
const LABELS = {
  Q1: 'Identify & Correct Errors',
  Q2: 'Phrasal Verbs Mastery',
  Q3: 'Professional Work Vocab',
  Q4: 'Comprehensive MCQ Test',
};

export default function ExamPage() {
  const router = useRouter();
  const [mode, setMode] = useState('landing'); // landing | exam | result
  const [activeQ, setActiveQ] = useState('Q1');
  const [scores, setScores] = useState({ Q1: null, Q2: null, Q3: null, Q4: null });
  const [timeLeft, setTimeLeft] = useState(2400);

  useEffect(() => {
    if (mode !== 'exam') return;
    if (timeLeft <= 0) { handleFinish(); return; }
    const iv = setInterval(() => setTimeLeft(t => t - 1), 1000);
    
    const handleBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      clearInterval(iv);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [mode, timeLeft]);

  const handleScore = (q, score) => setScores(s => ({ ...s, [q]: score }));

  const totalScore = Object.values(scores).reduce((a, b) => a + (b || 0), 0);

  const handleFinish = async () => {
    setMode('result');
    const roundedScore = Math.round(totalScore);
    const uId = JSON.parse(localStorage.getItem('sbr_user') || '{}').userId;
    if (uId && roundedScore > 0) {
      try {
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'sync', userId: uId, incXp: roundedScore, incDone: 4 })
        });
      } catch (err) { console.error('Failed to sync score', err); }
    }
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  const reviewExam = () => {
    setMode('review');
  };

  if (mode === 'landing') return (
    <div style={{ minHeight:'100dvh', background:'var(--bg-main)', paddingBottom:110 }}>
      <TopBar />
      <main style={{ padding:'60px 24px', maxWidth:480, margin:'0 auto', textAlign:'center' }}>
        <div className="animate-slide-up" style={{ marginBottom: 40 }}>
            <div style={{ 
                width: 80, height: 80, borderRadius: 24, background: 'var(--grad-primary)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                boxShadow: '0 0 30px var(--primary-glow)'
            }}>
                <span className="mi" style={{ fontSize:40, color:'white' }}>assignment_late</span>
            </div>
            <h1 style={{ fontSize:32, fontWeight:800, color:'white', marginBottom:12 }}>Final Exam Simulator</h1>
            <p style={{ color:'var(--text-dim)', lineHeight:1.6, fontSize: 15 }}>
                Complete the full curriculum assessment.<br/>Time Limit: <strong style={{ color:'var(--primary)' }}>40 Minutes</strong>.
            </p>
        </div>

        <div className="glass-panel" style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:40, padding: 16 }}>
          {QUESTIONS.map(q => (
            <div key={q} style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:16, padding:'14px 20px', display:'flex', alignItems:'center', gap:16 }}>
              <span className="mi" style={{ color:'var(--primary)', fontSize:20 }}>check_circle_outline</span>
              <span style={{ fontSize:14, fontWeight: 600 }}>{LABELS[q]}</span>
            </div>
          ))}
        </div>

        <button onClick={() => { setMode('exam'); setTimeLeft(2400); }} className="premium-btn" style={{ width:'100%', padding:20, fontSize:18 }}>
          Start Final Exam
        </button>
      </main>
      <BottomNav />
    </div>
  );

  const displayScore = Math.round(totalScore);

  return (
    <div style={{ minHeight:'100dvh', background:'var(--bg-main)', paddingTop:120, paddingBottom:80 }}>
      <TopBar />
      
      {mode === 'result' && (
        <main style={{ padding:'40px 24px', maxWidth:480, margin:'0 auto', textAlign:'center', marginTop: -60 }}>
          <div className="animate-slide-up" style={{ marginBottom: 32 }}>
            <div style={{ width:130, height:130, borderRadius:'50%', border:'6px solid var(--primary)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', background:'var(--bg-card)', boxShadow: '0 0 40px var(--primary-glow)' }}>
                <span style={{ fontSize:42, fontWeight:900, color:'white', fontFamily:'monospace' }}>{displayScore}</span>
                <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight: 800 }}>OF 100</span>
            </div>
            <h2 style={{ fontSize:24, fontWeight:800, color:'white', marginBottom:32 }}>
                {displayScore >= 85 ? "🎉 Excellence! You're ready." : displayScore >= 50 ? "👍 Good effort, keep refining." : "💪 Focus more on the core modules."}
            </h2>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:40 }}>
            {QUESTIONS.map(q => (
              <div key={q} className="glass-card" style={{ padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'var(--text-dim)', fontWeight: 600 }}>{LABELS[q]}</span>
                <span style={{ fontFamily:'monospace', fontSize:16, fontWeight:800, color:'var(--primary)' }}>{scores[q] ?? 0}</span>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection: 'column', gap:16 }}>
            <button onClick={reviewExam} style={{ padding:18, background: 'var(--bg-glass)', border: '1px solid var(--primary)', color: 'white' }} className="premium-btn">
              <span className="mi" style={{ marginRight: 8, verticalAlign: 'middle' }}>visibility</span>
              Review Mistakes
            </button>
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => { setMode('landing'); setScores({ Q1:null, Q2:null, Q3:null, Q4:null }); }} style={{ flex:1, padding:18 }} className="premium-btn">Retake Exam</button>
              <button onClick={() => router.push('/')} style={{ flex:1, padding:18, background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'white' }} className="premium-btn">Home</button>
            </div>
          </div>
        </main>
      )}

      <div style={{ display: (mode === 'exam' || mode === 'review') ? 'block' : 'none' }}>
        <header style={{ position:'fixed', top:58, left:0, right:0, zIndex:100 }}>
          <div style={{ background:'rgba(5, 5, 7, 0.9)', backdropFilter: 'blur(20px)', borderBottom:'1px solid var(--border-glass)', height:50, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {mode === 'exam' ? (
                <button onClick={() => { if(confirm('Are you sure you want to exit? Your progress will be lost.')) { setMode('landing'); setScores({ Q1:null, Q2:null, Q3:null, Q4:null }); } }} style={{ background:'transparent', border:'none', color:'var(--error)', cursor:'pointer', display:'flex', alignItems:'center', padding: 4 }}>
                  <span className="mi" style={{ fontSize: 24 }}>close</span>
                </button>
              ) : (
                <button onClick={() => setMode('result')} style={{ background:'transparent', border:'none', color:'var(--primary)', cursor:'pointer', display:'flex', alignItems:'center', padding: 4 }}>
                  <span className="mi" style={{ fontSize: 24 }}>arrow_back</span>
                </button>
              )}
              <span style={{ fontWeight:800, fontSize:14, color:'var(--primary)', letterSpacing: 1.5 }}>
                {mode === 'review' ? 'REVIEW MODE' : 'EXAM IN PROGRESS'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: mode === 'review' ? 'rgba(0, 230, 118, 0.1)' : timeLeft < 300 ? 'rgba(255, 82, 82, 0.1)' : 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 10 }}>
              <span className="mi" style={{ fontSize: 18, color: mode === 'review' ? 'var(--success)' : timeLeft < 300 ? 'var(--error)' : 'white' }}>
                {mode === 'review' ? 'done_all' : 'timer'}
              </span>
              <span style={{ fontFamily:'monospace', fontSize:16, fontWeight:800, color: mode === 'review' ? 'var(--success)' : timeLeft < 300 ? 'var(--error)' : 'white' }}>
                {mode === 'review' ? 'Finished' : `${mm}:${ss}`}
              </span>
            </div>
          </div>
          <div style={{ background:'rgba(15, 15, 20, 0.7)', padding:'10px 20px', display:'flex', gap:10, overflowX:'auto' }}>
            {QUESTIONS.map(q => (
              <button key={q} onClick={() => setActiveQ(q)} style={{
                background: activeQ === q ? 'var(--primary)' : 'var(--bg-glass)',
                color: 'white',
                border: `1px solid ${scores[q] !== null ? 'var(--primary)' : 'var(--border-glass)'}`,
                borderRadius:12, padding:'8px 16px', fontFamily:'monospace', fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap',
                flexShrink:0, transition: '0.3s'
              }}>
                {q} {scores[q] !== null ? '✓' : ''}
              </button>
            ))}
            {mode === 'exam' && (
              <button onClick={handleFinish} style={{ marginLeft:'auto', background:'var(--error)', color:'white', border:'none', borderRadius:12, padding:'8px 20px', fontSize:13, fontWeight:800, cursor:'pointer', flexShrink:0 }}>
                Finish
              </button>
            )}
          </div>
        </header>

        <main style={{ padding:'24px', maxWidth:600, margin:'0 auto' }}>
          <div className="animate-fade-in" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{LABELS[activeQ]}</h3>
              <div style={{ height: 4, background: 'var(--bg-glass)', borderRadius: 2, marginTop: 12 }}>
                  <div style={{ width: `${(QUESTIONS.indexOf(activeQ) + 1) * 25}%`, height: '100%', background: 'var(--primary)', borderRadius: 2, transition: '0.5s' }} />
              </div>
          </div>
          <div style={{ display: activeQ === 'Q1' ? 'block' : 'none' }}>
            <Q1ErrorHunter onScore={(s) => handleScore('Q1', s)} />
          </div>
          <div style={{ display: activeQ === 'Q2' ? 'block' : 'none' }}>
            <Q2PhrasalVerbs onScore={(s) => handleScore('Q2', s)} />
          </div>
          <div style={{ display: activeQ === 'Q3' ? 'block' : 'none' }}>
            <Q3WorkSheet onScore={(s) => handleScore('Q3', s)} />
          </div>
          <div style={{ display: activeQ === 'Q4' ? 'block' : 'none' }}>
            <Q4MCQ onScore={(s) => handleScore('Q4', s)} />
          </div>
        </main>
      </div>
    </div>
  );
}
