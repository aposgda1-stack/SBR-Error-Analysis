'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopBar from '../../components/TopBar';
import BottomNav from '../../components/BottomNav';
import sectionsData from '../../../data/sections.json';

const MISTAKES = sectionsData.identify_error_data.the_130_mistakes;

export default function PanicPage() {
  const router = useRouter();
  const [wrongItems, setWrongItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('sbr_progress') || '{}');
    const wrongIds = new Set(saved.errors?.wrong || []);
    const items = MISTAKES.filter(m => wrongIds.has(m.id));
    setWrongItems(items);
    setLoading(false);
  }, []);

  const handleFix = (isFixed) => {
    setFeedback(isFixed ? 'fixed' : 'still_wrong');
    
    if (isFixed) {
      // Remove from wrong list in localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('sbr_progress') || '{}');
        const id = wrongItems[index].id;
        saved.errors.wrong = saved.errors.wrong.filter(w => w !== id);
        if (!saved.errors.done.includes(id)) saved.errors.done.push(id);
        localStorage.setItem('sbr_progress', JSON.stringify(saved));
      } catch (e) {}
    }

    setTimeout(() => {
      setFeedback(null);
      if (index + 1 >= wrongItems.length) {
        setWrongItems(wrongItems.filter((_, i) => i !== index || !isFixed));
        setIndex(0);
      } else {
        setIndex(i => i + 1);
      }
    }, 1000);
  };

  if (loading) return null;

  if (wrongItems.length === 0) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--background)', paddingTop: 48, paddingBottom: 80 }}>
        <TopBar title="PANIC BUTTON: CLEARED" />
        <main style={{ padding: 32, maxWidth: 480, margin: '0 auto', textAlign: 'center', paddingTop: 80 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 80, color: '#88e2a5', marginBottom: 24 }}>check_circle</span>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--on-surface)', marginBottom: 16 }}>Mission Clear!</h2>
          <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: 32 }}>
            لقد قمت بمراجعة وتصحيح جميع أخطائك السابقة. أنت الآن جاهز للامتحان بنسبة 100%.
          </p>
          <button onClick={() => router.push('/')} style={{ width: '100%', background: 'var(--primary-container)', color: 'var(--on-primary-container)', border: 'none', borderRadius: 16, padding: 18, fontWeight: 800, cursor: 'pointer' }}>العودة للرئيسية</button>
        </main>
        <BottomNav />
      </div>
    );
  }

  const current = wrongItems[index];

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--background)', paddingTop: 48, paddingBottom: 80 }}>
      <TopBar title="RESCUE MODE: FIXING ERRORS" />
      
      <main style={{ padding: '24px 16px', maxWidth: 480, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--error)', marginBottom: 8 }}>وضع الإنقاذ ليلة الامتحان</h2>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 14 }}>نحن نركز فقط على الأسئلة التي تعثرت فيها سابقاً</p>
          <div style={{ marginTop: 16, fontFamily: 'JetBrains Mono', fontSize: 12, color: 'var(--primary)' }}>Remaining: {wrongItems.length}</div>
        </div>

        <div style={{ 
          background: 'var(--surface-container)', borderRadius: 24, padding: 32, 
          border: '1px solid var(--error)', position: 'relative', overflow: 'hidden',
          boxShadow: '0 0 30px rgba(147,0,10,0.2)', animation: 'slideUp 0.3s ease'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'var(--error)' }} />
          
          <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Identify the error:</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--on-surface)', direction: 'ltr', lineHeight: 1.6, marginBottom: 32 }}>
            "{current.wrong}"
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginBottom: 4 }}>التصحيح الصحيح هو:</div>
            <div style={{ background: 'var(--surface-container-high)', padding: 16, borderRadius: 12, border: '1px solid var(--outline-variant)', direction: 'ltr', fontWeight: 600 }}>
              {current.correct}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <button 
            onClick={() => handleFix(true)}
            style={{ width: '100%', background: '#2e5238', color: '#88e2a5', border: '1px solid #88e2a5', borderRadius: 16, padding: 18, fontWeight: 800, cursor: 'pointer' }}
          >فهمتها، احذفها من القائمة</button>
          <button 
            onClick={() => handleFix(false)}
            style={{ width: '100%', background: 'transparent', color: 'var(--on-surface-variant)', border: '1px solid var(--outline-variant)', borderRadius: 16, padding: 16, fontWeight: 600, cursor: 'pointer' }}
          >ما زلت بحاجة لمراجعتها لاحقاً</button>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
