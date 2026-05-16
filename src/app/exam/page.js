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
  Q1: 'Q1: Identify & Correct (40 Marks)',
  Q2: 'Q2: Phrasal Verbs – Word Box',
  Q3: 'Q3: Work Sheet – Word Box',
  Q4: 'Q4: MCQ – Full Syllabus',
};

export default function ExamPage() {
  const router = useRouter();
  const [mode, setMode] = useState('landing'); // landing | exam | result
  const [activeQ, setActiveQ] = useState('Q1');
  const [scores, setScores] = useState({ Q1: null, Q2: null, Q3: null, Q4: null });
  const [timeLeft, setTimeLeft] = useState(2400);

  useEffect(() => {
    if (mode !== 'exam') return;
    if (timeLeft <= 0) { setMode('result'); return; }
    const iv = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(iv);
  }, [mode, timeLeft]);

  const handleScore = (q, score) => setScores(s => ({ ...s, [q]: score }));

  const totalScore = Object.values(scores).reduce((a, b) => a + (b || 0), 0);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');

  if (mode === 'landing') return (
    <div style={{ minHeight:'100dvh', background:'var(--background)', paddingTop:48, paddingBottom:80 }}>
      <TopBar title="FINAL EXAM SIMULATOR" />
      <main style={{ padding:32, maxWidth:480, margin:'0 auto', textAlign:'center', paddingTop:60 }}>
        <span className="material-symbols-outlined" style={{ fontSize:72, color:'var(--primary)' }}>assignment</span>
        <h1 style={{ fontSize:28, fontWeight:900, color:'var(--on-surface)', margin:'16px 0' }}>محاكي الامتحان النهائي</h1>
        <p style={{ color:'var(--on-surface-variant)', lineHeight:1.7, marginBottom:32 }}>
          يحتوي الامتحان على 4 أسئلة تغطي كامل المنهج.<br/>الوقت المتاح: <strong style={{ color:'var(--primary)' }}>40 دقيقة</strong>.<br/>لن يظهر أي تصحيح حتى تنتهي وتضغط Submit.
        </p>
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:40, textAlign:'right' }}>
          {QUESTIONS.map(q => (
            <div key={q} style={{ background:'var(--surface-container)', border:'1px solid var(--outline-variant)', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
              <span className="material-symbols-outlined" style={{ color:'var(--primary)', fontSize:20 }}>radio_button_unchecked</span>
              <span style={{ fontSize:14, color:'var(--on-surface)' }}>{LABELS[q]}</span>
            </div>
          ))}
        </div>
        <button onClick={() => { setMode('exam'); setTimeLeft(2400); }} style={{ width:'100%', background:'var(--primary-container)', color:'var(--on-primary-container)', border:'none', borderRadius:16, padding:20, fontWeight:900, fontSize:18, cursor:'pointer', boxShadow:'0 8px 24px rgba(255,87,26,0.3)' }}>
          ابدأ الامتحان الآن
        </button>
      </main>
      <BottomNav />
    </div>
  );

  if (mode === 'result') {
    const allDone = Object.values(scores).every(s => s !== null);
    return (
      <div style={{ minHeight:'100dvh', background:'var(--background)', paddingTop:48, paddingBottom:80 }}>
        <TopBar title="EXAM RESULTS" />
        <main style={{ padding:32, maxWidth:480, margin:'0 auto', textAlign:'center', paddingTop:40 }}>
          <div style={{ width:160, height:160, borderRadius:'50%', border:'8px solid var(--primary)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', margin:'0 auto 32px', background:'var(--surface-container)' }}>
            <span style={{ fontSize:42, fontWeight:900, color:'var(--primary)', fontFamily:'JetBrains Mono' }}>{totalScore}</span>
            <span style={{ fontSize:12, color:'var(--on-surface-variant)' }}>/ 100</span>
          </div>
          <h2 style={{ fontSize:24, fontWeight:800, color:'var(--on-surface)', marginBottom:24 }}>
            {totalScore >= 85 ? '🎉 ممتاز! أنت جاهز للامتحان.' : totalScore >= 60 ? '👍 جيد، راجع الأخطاء واحاول مرة أخرى.' : '💪 يحتاج مراجعة، استمر في التدريب.'}
          </h2>
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:32, textAlign:'right' }}>
            {QUESTIONS.map(q => (
              <div key={q} style={{ background:'var(--surface-container)', border:'1px solid var(--outline-variant)', borderRadius:12, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13, color:'var(--on-surface-variant)' }}>{LABELS[q]}</span>
                <span style={{ fontFamily:'JetBrains Mono', fontSize:14, fontWeight:700, color:'var(--primary)' }}>{scores[q] ?? 0}</span>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <button onClick={() => { setMode('exam'); setActiveQ('Q1'); setScores({ Q1:null, Q2:null, Q3:null, Q4:null }); setTimeLeft(2400); }} style={{ flex:1, background:'var(--primary-container)', color:'var(--on-primary-container)', border:'none', borderRadius:12, padding:16, fontWeight:800, cursor:'pointer' }}>إعادة الامتحان</button>
            <button onClick={() => router.push('/')} style={{ flex:1, background:'var(--surface-container-high)', color:'var(--on-surface)', border:'1px solid var(--outline-variant)', borderRadius:12, padding:16, fontWeight:700, cursor:'pointer' }}>الرئيسية</button>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div style={{ minHeight:'100dvh', background:'var(--background)', paddingTop:96, paddingBottom:80 }}>
      <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:100 }}>
        <div style={{ background:'var(--surface)', borderBottom:'1px solid var(--outline-variant)', height:48, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px' }}>
          <span style={{ fontWeight:900, fontSize:16, color:'var(--primary)', fontFamily:'Inter' }}>FINAL EXAM</span>
          <span style={{ fontFamily:'JetBrains Mono', fontSize:16, fontWeight:700, color: timeLeft < 300 ? 'var(--error)' : 'var(--primary)' }}>{mm}:{ss}</span>
        </div>
        <div style={{ background:'var(--surface-container-low)', padding:'8px 16px', display:'flex', gap:8, overflowX:'auto' }}>
          {QUESTIONS.map(q => (
            <button key={q} onClick={() => setActiveQ(q)} style={{
              background: activeQ === q ? 'var(--primary-container)' : 'var(--surface-container-high)',
              color: activeQ === q ? 'var(--on-primary-container)' : 'var(--on-surface-variant)',
              border: `1px solid ${scores[q] !== null ? 'var(--primary)' : 'var(--outline-variant)'}`,
              borderRadius:20, padding:'6px 14px', fontFamily:'JetBrains Mono', fontSize:12, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap',
              flexShrink:0,
            }}>
              {q} {scores[q] !== null ? '✓' : ''}
            </button>
          ))}
          <button onClick={() => setMode('result')} style={{ marginLeft:'auto', background:'var(--error-container)', color:'var(--on-error-container)', border:'1px solid var(--error)', borderRadius:20, padding:'6px 16px', fontFamily:'JetBrains Mono', fontSize:12, fontWeight:700, cursor:'pointer', flexShrink:0 }}>
            Submit
          </button>
        </div>
      </header>

      <main style={{ padding:'16px', maxWidth:560, margin:'0 auto' }}>
        {activeQ === 'Q1' && <Q1ErrorHunter onScore={(s) => handleScore('Q1', s)} />}
        {activeQ === 'Q2' && <Q2PhrasalVerbs onScore={(s) => handleScore('Q2', s)} />}
        {activeQ === 'Q3' && <Q3WorkSheet onScore={(s) => handleScore('Q3', s)} />}
        {activeQ === 'Q4' && <Q4MCQ onScore={(s) => handleScore('Q4', s)} />}
      </main>
    </div>
  );
}
