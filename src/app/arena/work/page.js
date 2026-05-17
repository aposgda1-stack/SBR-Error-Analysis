'use client';
import { useState } from 'react';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';
import VocabExercise from '../../../components/VocabExercise';

export default function WorkArena() {
  const [activeTask, setActiveTask] = useState(null);

  const verbsTask = sectionsData.work_vocabulary.task_1_verbs;
  const nounsTask = sectionsData.work_vocabulary.task_2_nouns;
  const idiomsTask = sectionsData.work_vocabulary.task_3_idioms;
  const jobOrWork = sectionsData.working_life_data.task_6_job_or_work;
  const jobOrCareer = sectionsData.working_life_data.task_7_job_or_career;

  const gapModules = [
    {
      id: 'work_verbs',
      title: verbsTask.title,
      desc: 'Match words with their definitions.',
      task: {
        title: verbsTask.title,
        instruction: verbsTask.instruction,
        text: verbsTask.definitions.map(d => `${d.id}. ${d.text} (${d.id}) ___`).join('\n\n'),
        box_words: verbsTask.definitions.map(d => d.answer),
        answers: Object.fromEntries(verbsTask.definitions.map(d => [d.id, d.answer]))
      }
    },
    {
      id: 'work_nouns',
      title: nounsTask.title,
      desc: 'Practice general employment vocabulary.',
      task: {
        title: nounsTask.title,
        instruction: nounsTask.instruction,
        text: nounsTask.text,
        box_words: nounsTask.box_words,
        answers: nounsTask.answers
      }
    },
    {
      id: 'work_idioms',
      title: idiomsTask.title,
      desc: 'Match sentences with idioms and colloquialisms.',
      task: {
        title: idiomsTask.title,
        instruction: 'Fill in the appropriate idiom or colloquialism.',
        text: idiomsTask.pairs.map((p, i) => {
          const gapSentence = p.right.replace(new RegExp(p.idiom, 'i'), `(${i+1}) ___`);
          return `${i + 1}. ${p.left}\n   ${gapSentence}`;
        }).join('\n\n'),
        box_words: idiomsTask.pairs.map(p => p.idiom),
        answers: Object.fromEntries(idiomsTask.pairs.map((p, i) => [i + 1, p.idiom]))
      }
    },
    {
      id: 'job_or_work',
      title: 'Job or Work?',
      desc: 'Differentiate between job and work in context.',
      task: {
        title: 'Job or Work?',
        instruction: 'Complete the sentences with work or job:',
        text: jobOrWork.map((q, i) => `${i + 1}. ${q.sentence.replace('___', `(${i + 1})`)}`).join('\n\n'),
        answers: Object.fromEntries(jobOrWork.map((q, i) => [i + 1, q.answer])),
        box_words: ["job", "work"]
      }
    },
    {
      id: 'job_or_career',
      title: 'Job or Career?',
      desc: 'Differentiate between job and career in context.',
      task: {
        title: 'Job or Career?',
        instruction: 'Complete the sentences with job or career:',
        text: jobOrCareer.map((q, i) => `${i + 1}. ${q.sentence.replace('___', `(${i + 1})`)}`).join('\n\n'),
        answers: Object.fromEntries(jobOrCareer.map((q, i) => [i + 1, q.answer])),
        box_words: ["job", "career"]
      }
    }
  ];

  // Standardize the shape of the tasks for VocabExercise
  const normalizedModules = gapModules.map(m => {
    // If it doesn't have answers in object format, convert arrays to objects
    let normalizedTask = { ...m.task, title: m.title, instruction: m.desc };
    
    if (Array.isArray(m.task.answers)) {
      const objAnswers = {};
      m.task.answers.forEach((ans, idx) => {
        objAnswers[idx + 1] = ans;
      });
      normalizedTask.answers = objAnswers;
    }
    
    if (m.task.box) {
      normalizedTask.box_words = m.task.box;
    }
    
    return { ...m, task: normalizedTask };
  });

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ padding: '24px 20px', maxWidth: 600, margin: '0 auto' }}>
        {activeTask === null ? (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 32 }}>
              <div style={{ padding: '8px 12px', display: 'inline-block', background: 'rgba(255, 234, 0, 0.1)', border: '1px solid #ffea00', borderRadius: 12, color: '#ffea00', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
                MODULE 04
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>Business Lexicon</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Polish your professional vocabulary for the workplace.</p>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {normalizedModules.map((mod, i) => (
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
                    <div style={{ fontSize: 13, color: '#ffea00', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Module {i + 1}</div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'white' }}>{mod.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{mod.desc}</div>
                  </div>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255, 234, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffea00' }}>
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
              <span className="mi" style={{ fontSize: 18 }}>arrow_back</span> Back to Modules
            </button>
            
            <div className="glass-panel" style={{ padding: '2px', background: 'linear-gradient(135deg, rgba(255,234,0,0.2), transparent)' }}>
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
