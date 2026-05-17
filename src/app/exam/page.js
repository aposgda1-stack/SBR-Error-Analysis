'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';

// Final Exam Components
import Q1ErrorHunter from '../../components/exam/Q1ErrorHunter';
import Q2PhrasalVerbs from '../../components/exam/Q2PhrasalVerbs';
import Q3WorkSheet from '../../components/exam/Q3WorkSheet';
import Q4MCQ from '../../components/exam/Q4MCQ';

// Midterm Exam Components
import M1Reading from '../../components/midterm/M1Reading';
import M2RetailVocab from '../../components/midterm/M2RetailVocab';
import M3Prepositions from '../../components/midterm/M3Prepositions';
import M4AuthorPurpose from '../../components/midterm/M4AuthorPurpose';
import M5FormA from '../../components/midterm/M5FormA';
import M6FormB from '../../components/midterm/M6FormB';

import audioManager from '../../utils/audio.js';

// Final Exam Syllabus
const FINAL_QUESTIONS = ['Q1', 'Q2', 'Q3', 'Q4'];
const FINAL_LABELS = {
  Q1: 'Identify & Correct Errors',
  Q2: 'Phrasal Verbs Mastery',
  Q3: 'Professional Work Vocab',
  Q4: 'Comprehensive MCQ Test',
};
const FINAL_MAX_SCORES = {
  Q1: 200,
  Q2: 100,
  Q3: 100,
  Q4: 100
};

// Midterm Exam Syllabus
const MIDTERM_QUESTIONS = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6'];
const MIDTERM_LABELS = {
  M1: 'Reading Comprehension',
  M2: 'Retail Vocabulary',
  M3: 'Prepositions & Phrasal',
  M4: 'Mini Texts & Author Purpose',
  M5: 'Common Errors Form A',
  M6: 'Common Errors Form B'
};
const MIDTERM_MAX_SCORES = {
  M1: 25,
  M2: 40,
  M3: 35,
  M4: 25,
  M5: 38, // 15 questions × 2.5 = 37.5 → rounded to 38
  M6: 40  // 16 questions × 2.5 = 40
};

export default function ExamPage() {
  const router = useRouter();
  const [selectedExam, setSelectedExam] = useState('final'); // 'final' | 'midterm'
  const [mode, setMode] = useState('landing'); // landing | exam | result | review
  
  // States based on selected exam
  const [activeQ, setActiveQ] = useState('Q1');
  const [scores, setScores] = useState({ Q1: null, Q2: null, Q3: null, Q4: null });
  const [midtermScores, setMidtermScores] = useState({ M1: null, M2: null, M3: null, M4: null, M5: null, M6: null });
  
  const [timeLeft, setTimeLeft] = useState(2400); // 40 minutes (2400s) for Final, 30 minutes (1800s) for Midterm
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedExams, setCompletedExams] = useState([]); // ['final', 'midterm']

  // Load completed exams from user history to prevent duplicate XP
  useEffect(() => {
    const uId = JSON.parse(localStorage.getItem('sbr_user') || '{}').userId;
    if (uId) {
      fetch(`/api/user?userId=${uId}`)
        .then(res => res.json())
        .then(data => {
          const history = data?.user?.history || [];
          const completed = [];
          if (history.some(h => h.type === 'Final Exam')) completed.push('final');
          if (history.some(h => h.type === 'Midterm Exam')) completed.push('midterm');
          setCompletedExams(completed);
        })
        .catch(console.error);
    }
  }, []);

  // Dynamic values based on selected exam
  const currentQuestions = selectedExam === 'final' ? FINAL_QUESTIONS : MIDTERM_QUESTIONS;
  const currentLabels = selectedExam === 'final' ? FINAL_LABELS : MIDTERM_LABELS;
  const currentMaxScores = selectedExam === 'final' ? FINAL_MAX_SCORES : MIDTERM_MAX_SCORES;
  const examTotalXP = selectedExam === 'final' ? 500 : 200;
  const activeScores = selectedExam === 'final' ? scores : midtermScores;

  // BUG 1 FIX: Split into two effects to prevent re-adding beforeunload every second
  useEffect(() => {
    if (mode !== 'exam') return;
    const handleBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [mode]);

  useEffect(() => {
    if (mode !== 'exam') return;
    if (timeLeft <= 0) { handleFinish(); return; }
    const iv = setInterval(() => {
        if (timeLeft <= 300 && timeLeft % 60 === 0) audioManager.play('TICK');
        setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(iv);
  }, [mode, timeLeft]);

  const handleScore = (q, score) => {
    audioManager.play('SUCCESS');
    if (selectedExam === 'final') {
      setScores(s => ({ ...s, [q]: score }));
    } else {
      setMidtermScores(s => ({ ...s, [q]: score }));
    }
  };

  const totalScore = Object.values(activeScores).reduce((a, b) => a + (b || 0), 0);

  const handleFinish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    audioManager.play('VICTORY');
    setMode('result');
    
    // BUG 2 FIX: Compute final score inline to avoid stale closure
    const latestScores = selectedExam === 'final' ? scores : midtermScores;
    const roundedScore = Math.round(Object.values(latestScores).reduce((a, b) => a + (b || 0), 0));
    const uId = JSON.parse(localStorage.getItem('sbr_user') || '{}').userId;
    if (uId) {
      try {
        const payload = { 
          action: 'sync', 
          userId: uId, 
          incDone: 4, 
          pushHistory: { 
            type: selectedExam === 'final' ? 'Final Exam' : 'Midterm Exam', 
            xp: roundedScore, 
            accuracy: Math.round((roundedScore / examTotalXP) * 100) 
          } 
        };
        // Only request XP increment if the user has not completed this exam previously
        if (roundedScore > 0 && !completedExams.includes(selectedExam)) {
          payload.incXp = roundedScore;
        }
        
        await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        // Add to local completed list to show retake notice instantly
        setCompletedExams(prev => [...prev, selectedExam]);
      } catch (err) { console.error('Failed to sync score', err); }
    }
  };

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  const reviewExam = () => {
    audioManager.play('CLICK');
    setMode('review');
  };

  const startExam = (examType) => {
    audioManager.play('CLICK');
    setSelectedExam(examType);
    if (examType === 'final') {
      setActiveQ('Q1');
      setScores({ Q1: null, Q2: null, Q3: null, Q4: null });
      setTimeLeft(2400); // 40 minutes
    } else {
      setActiveQ('M1');
      setMidtermScores({ M1: null, M2: null, M3: null, M4: null, M5: null, M6: null });
      setTimeLeft(1800); // 30 minutes
    }
    setMode('exam');
    setIsSubmitting(false);
  };

  if (mode === 'landing') return (
    <div style={{ minHeight:'100dvh', background:'var(--bg-main)', paddingBottom:110 }}>
      <TopBar />
      <main style={{ padding:'60px 24px', maxWidth:480, margin:'0 auto', textAlign:'center' }}>
        <div className="animate-slide-up" style={{ marginBottom: 32 }}>
            <div style={{ 
                width: 80, height: 80, borderRadius: 24, background: 'var(--grad-primary)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                boxShadow: '0 0 30px var(--primary-glow)'
            }}>
                <span className="mi" style={{ fontSize:40, color:'white' }}>assignment_late</span>
            </div>
            <h1 style={{ fontSize:32, fontWeight:800, color:'white', marginBottom:12 }}>SBR Exam Arena</h1>
            <p style={{ color:'var(--text-dim)', lineHeight:1.6, fontSize: 15 }}>
                Select an exam session to test your knowledge. Fully interactive click-based simulation.
            </p>
        </div>

        {/* Custom Premium Exam Toggles */}
        <div className="glass-panel" style={{ display: 'flex', padding: 6, gap: 6, marginBottom: 32, borderRadius: 16, background: 'rgba(255,255,255,0.02)' }}>
          <button 
            onClick={() => { audioManager.play('CLICK'); setSelectedExam('final'); }}
            style={{
              flex: 1, padding: '14px', borderRadius: 12, fontSize: 14, fontWeight: 800,
              background: selectedExam === 'final' ? 'var(--grad-primary)' : 'transparent',
              color: selectedExam === 'final' ? 'white' : 'var(--text-dim)',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s'
            }}
          >
            Final Exam (500 XP)
          </button>
          <button 
            onClick={() => { audioManager.play('CLICK'); setSelectedExam('midterm'); }}
            style={{
              flex: 1, padding: '14px', borderRadius: 12, fontSize: 14, fontWeight: 800,
              background: selectedExam === 'midterm' ? 'var(--grad-primary)' : 'transparent',
              color: selectedExam === 'midterm' ? 'white' : 'var(--text-dim)',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s'
            }}
          >
            Midterm & Past Exam (200 XP)
          </button>
        </div>

        {/* Dynamic landing view depending on selected exam */}
        {/* BUG 17 FIX: key prop forces re-animation when exam type switches */}
        <div key={selectedExam} className="animate-fade-in">
          {completedExams.includes(selectedExam) && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              border: '1px solid rgba(239, 68, 68, 0.25)', 
              color: 'var(--error)', 
              padding: '14px 18px', 
              borderRadius: 16, 
              fontSize: 13, 
              fontWeight: 700, 
              textAlign: 'right', 
              direction: 'rtl',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 10
            }}>
              <span className="mi" style={{ fontSize: 20, color: 'var(--error)' }}>warning</span>
              <span>لقد أتممت هذا الاختبار سابقاً. يمكنك إعادته للمراجعة، ولكن لن تمنح نقاط XP إضافية تفادياً للتكرار.</span>
            </div>
          )}
          <div style={{ marginBottom: 24, textAlign: 'left', padding: '0 8px' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 4 }}>
              {selectedExam === 'final' ? 'Comprehensive Final Exam' : 'Midterm & Previous Exam'}
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {selectedExam === 'final' 
                ? 'Covers the whole curriculum except Phrasal Verbs and Work in Part 1. 40 minutes time limit.' 
                : 'Interactive past paper assessment with Reading, Retail Vocab, Prepositions, and Forms A & B. 30 minutes.'}
            </p>
          </div>

          <div className="glass-panel" style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:40, padding: 16 }}>
            {currentQuestions.map(q => (
              <div key={q} style={{ background:'var(--bg-glass)', border:'1px solid var(--border-glass)', borderRadius:16, padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <span className="mi" style={{ color:'var(--primary)', fontSize:20 }}>check_circle_outline</span>
                  <span style={{ fontSize:14, fontWeight: 600, textAlign: 'left', color: 'white' }}>{currentLabels[q]}</span>
                </div>
                <span style={{ fontSize:13, fontWeight:800, color:'var(--text-muted)' }}>{currentMaxScores[q]} XP</span>
              </div>
            ))}
          </div>

          <button onClick={() => startExam(selectedExam)} className="premium-btn" style={{ width:'100%', padding:20, fontSize:18 }}>
            Start {selectedExam === 'final' ? 'Final' : 'Midterm'} Exam
          </button>
        </div>
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
            <div style={{ width:150, height:150, borderRadius:'50%', border:'6px solid var(--primary)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', background:'var(--bg-card)', boxShadow: '0 0 40px var(--primary-glow)' }}>
                <span style={{ fontSize:46, fontWeight:900, color:'white', fontFamily:'monospace' }}>{displayScore}</span>
                <span style={{ fontSize:12, color:'var(--text-muted)', fontWeight: 800 }}>OF {examTotalXP}</span>
            </div>
            <h2 style={{ fontSize:24, fontWeight:800, color:'white', marginBottom:20 }}>
                {displayScore >= (examTotalXP * 0.85) ? "🎉 Excellence! You're ready." : displayScore >= (examTotalXP * 0.5) ? "👍 Good effort, keep refining." : "💪 Focus more on the core modules."}
            </h2>
            {completedExams.includes(selectedExam) && (
              <div style={{ 
                background: 'rgba(255,255,255,0.02)', 
                border: '1px solid var(--border-glass)', 
                padding: '12px 16px', 
                borderRadius: 12, 
                fontSize: 13, 
                color: 'var(--text-muted)',
                marginBottom: 24,
                textAlign: 'center'
              }}>
                ℹ️ تم احتساب 0 XP (لقد حصلت على نقاط هذا الاختبار مسبقاً)
              </div>
            )}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:40 }}>
            {currentQuestions.map(q => (
              <div key={q} className="glass-card" style={{ padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'var(--text-dim)', fontWeight: 600 }}>{currentLabels[q]}</span>
                <span style={{ fontFamily:'monospace', fontSize:16, fontWeight:800, color:'var(--primary)' }}>{activeScores[q] ?? 0} / {currentMaxScores[q]}</span>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection: 'column', gap:16 }}>
            <button onClick={reviewExam} style={{ padding:18, background: 'var(--bg-glass)', border: '1px solid var(--primary)', color: 'white' }} className="premium-btn">
              <span className="mi" style={{ marginRight: 8, verticalAlign: 'middle' }}>visibility</span>
              Review Mistakes
            </button>
            <div style={{ display: 'flex', gap: 16 }}>
              {/* BUG 3 FIX: Reset ALL state on Retake */}
              <button onClick={() => { 
                setMode('landing'); 
                setIsSubmitting(false); 
                setScores({ Q1: null, Q2: null, Q3: null, Q4: null });
                setMidtermScores({ M1: null, M2: null, M3: null, M4: null, M5: null, M6: null });
                setActiveQ(selectedExam === 'final' ? 'Q1' : 'M1');
              }} style={{ flex:1, padding:18 }} className="premium-btn">Retake Exam</button>
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
                <button onClick={() => { if(confirm('Are you sure you want to exit? Your progress will be lost.')) { setMode('landing'); setIsSubmitting(false); } }} style={{ background:'transparent', border:'none', color:'var(--error)', cursor:'pointer', display:'flex', alignItems:'center', padding: 4 }}>
                  <span className="mi" style={{ fontSize: 24 }}>close</span>
                </button>
              ) : (
                <button onClick={() => setMode('result')} style={{ background:'transparent', border:'none', color:'var(--primary)', cursor:'pointer', display:'flex', alignItems:'center', padding: 4 }}>
                  <span className="mi" style={{ fontSize: 24 }}>arrow_back</span>
                </button>
              )}
              <span style={{ fontWeight:800, fontSize:14, color:'var(--primary)', letterSpacing: 1.5 }}>
                {mode === 'review' ? 'REVIEW MODE' : `${selectedExam.toUpperCase()} EXAM IN PROGRESS`}
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
            {currentQuestions.map(q => (
              <button key={q} onClick={() => setActiveQ(q)} style={{
                background: activeQ === q ? 'var(--primary)' : 'var(--bg-glass)',
                color: 'white',
                border: `1px solid ${activeScores[q] !== null ? 'var(--primary)' : 'var(--border-glass)'}`,
                borderRadius:12, padding:'8px 16px', fontFamily:'monospace', fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap',
                flexShrink:0, transition: '0.3s'
              }}>
                {q} {activeScores[q] !== null ? '✓' : ''}
              </button>
            ))}
            {mode === 'exam' && (
              <button onClick={handleFinish} style={{ marginLeft:'auto', background:'var(--error)', color:'white', border:'none', borderRadius:12, padding:'8px 20px', fontSize:13, fontWeight:800, cursor:'pointer', flexShrink:0 }}>
                Finish Exam
              </button>
            )}
          </div>
        </header>

        <main style={{ padding:'24px', maxWidth:600, margin:'0 auto' }}>
          <div className="animate-fade-in" style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>{currentLabels[activeQ]}</h3>
              <div style={{ height: 4, background: 'var(--bg-glass)', borderRadius: 2, marginTop: 12 }}>
                  <div style={{ width: `${((currentQuestions.indexOf(activeQ) + 1) / currentQuestions.length) * 100}%`, height: '100%', background: 'var(--primary)', borderRadius: 2, transition: '0.5s' }} />
              </div>
          </div>

          {/* BUG 19 FIX: Pass sectionScore to each component so review mode displays correct score */}
          {/* Render Final Exam Components */}
          {selectedExam === 'final' && (
            <>
              <div style={{ display: activeQ === 'Q1' ? 'block' : 'none' }}>
                <Q1ErrorHunter onScore={(s) => handleScore('Q1', s)} reviewMode={mode === 'review'} sectionScore={scores.Q1} />
              </div>
              <div style={{ display: activeQ === 'Q2' ? 'block' : 'none' }}>
                <Q2PhrasalVerbs onScore={(s) => handleScore('Q2', s)} reviewMode={mode === 'review'} sectionScore={scores.Q2} />
              </div>
              <div style={{ display: activeQ === 'Q3' ? 'block' : 'none' }}>
                <Q3WorkSheet onScore={(s) => handleScore('Q3', s)} reviewMode={mode === 'review'} sectionScore={scores.Q3} />
              </div>
              <div style={{ display: activeQ === 'Q4' ? 'block' : 'none' }}>
                <Q4MCQ onScore={(s) => handleScore('Q4', s)} reviewMode={mode === 'review'} sectionScore={scores.Q4} />
              </div>
            </>
          )}

          {/* Render Midterm Components */}
          {selectedExam === 'midterm' && (
            <>
              <div style={{ display: activeQ === 'M1' ? 'block' : 'none' }}>
                <M1Reading onScore={(s) => handleScore('M1', s)} reviewMode={mode === 'review'} sectionScore={midtermScores.M1} />
              </div>
              <div style={{ display: activeQ === 'M2' ? 'block' : 'none' }}>
                <M2RetailVocab onScore={(s) => handleScore('M2', s)} reviewMode={mode === 'review'} sectionScore={midtermScores.M2} />
              </div>
              <div style={{ display: activeQ === 'M3' ? 'block' : 'none' }}>
                <M3Prepositions onScore={(s) => handleScore('M3', s)} reviewMode={mode === 'review'} sectionScore={midtermScores.M3} />
              </div>
              <div style={{ display: activeQ === 'M4' ? 'block' : 'none' }}>
                <M4AuthorPurpose onScore={(s) => handleScore('M4', s)} reviewMode={mode === 'review'} sectionScore={midtermScores.M4} />
              </div>
              <div style={{ display: activeQ === 'M5' ? 'block' : 'none' }}>
                <M5FormA onScore={(s) => handleScore('M5', s)} reviewMode={mode === 'review'} sectionScore={midtermScores.M5} />
              </div>
              <div style={{ display: activeQ === 'M6' ? 'block' : 'none' }}>
                <M6FormB onScore={(s) => handleScore('M6', s)} reviewMode={mode === 'review'} sectionScore={midtermScores.M6} />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
