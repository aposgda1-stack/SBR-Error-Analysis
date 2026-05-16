'use client';
import { useState } from 'react';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';
import VocabExercise from '../../../components/VocabExercise';

export default function WorkArena() {
  const [activeTask, setActiveTask] = useState(null);

  // Extract viable gap-fill exercises for modules
  const gapModules = [
    {
      id: 'work_nouns',
      title: 'Work Nouns',
      desc: 'Practice general employment vocabulary',
      task: sectionsData.work_vocabulary.task_2_nouns
    },
    {
      id: 'looking_job',
      title: 'Looking for a Job',
      desc: 'Vocabulary for job hunting and applications',
      task: sectionsData.employment_data.task_1_looking_for_a_job
    },
    {
      id: 'problems_work',
      title: 'Problems at Work',
      desc: 'Terminology for unions, strikes, and resignations',
      task: sectionsData.working_life_data.task_5_problems_at_work
    },
    {
      id: 'starting_business',
      title: 'Starting a Business',
      desc: 'Essential business and finance vocabulary',
      task: sectionsData.office_and_business_data.business_tasks.task_1_starting
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
