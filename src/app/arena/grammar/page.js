'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';
import audioManager from '../../../utils/audio.js';
import { calcAnswerXP, calcEndBonus, syncXP, XP_BASE, STREAK_THRESHOLD } from '../../../utils/scoring.js';

function XPToast({ xp, bonuses, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: 'fixed', top: 80, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end', pointerEvents: 'none' }}>
      <div style={{ background: 'var(--grad-primary)', color: 'white', padding: '10px 20px', borderRadius: 16, fontWeight: 900, fontSize: 20, boxShadow: '0 8px 30px var(--primary-glow)', animation: 'slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both' }}>+{xp} XP</div>
      {bonuses.map((b, i) => (
        <div key={i} style={{ background: 'rgba(12,8,25,0.9)', border: '1px solid var(--border-bright)', color: 'var(--primary)', padding: '6px 14px', borderRadius: 12, fontWeight: 700, fontSize: 13, animation: `slideUp 0.4s cubic-bezier(0.16,1,0.3,1) ${0.1*(i+1)}s both` }}>{b}</div>
      ))}
    </div>
  );
}

function StreakBadge({ streak }) {
  if (streak < 1) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      {Array.from({ length: STREAK_THRESHOLD }).map((_, i) => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: i < streak % STREAK_THRESHOLD || (streak % STREAK_THRESHOLD === 0 && streak > 0) ? '#f87171' : 'rgba(255,255,255,0.1)', boxShadow: i < streak % STREAK_THRESHOLD ? '0 0 8px #f87171' : 'none', transition: '0.3s' }} />
      ))}
      <span style={{ fontSize: 12, fontWeight: 800, color: '#f87171' }}>🔥 {streak}</span>
    </div>
  );
}

const GRAMMAR = sectionsData.grammar_guide;

const CATEGORIES = {
  cambridge: {
    title: 'Common Mistakes',
    icon: 'school',
    desc: 'Targeted practice for frequently confused terms and common grammatical errors.',
    keys: [
      'and_but_or',
      'during_for_since',
      'to_infinitive_vs_ing',
      'do_vs_make',
      'look_see_watch',
      'have_pass_spend_take',
      'countable_uncountable',
      'near_nearby_next_to'
    ]
  },
  advanced: {
    title: 'Advanced Discourse',
    icon: 'psychology',
    desc: 'Master professional discourse transitions, speculative modals, and style.',
    keys: [
      'modal_verbs',
      'big_great_large',
      'hope_vs_wish',
      'opinions',
      'give_provide_offer',
      'still_already_yet'
    ]
  }
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const shuffleArray = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const LOGICAL_DISTRACTORS = {
  modal_verbs: ['can', 'could', 'must', 'should', 'would', 'might', 'may', "can't", "couldn't", "shouldn't", "must not", "don't have to", "ought to", "would like", "had to"],
  hope_vs_wish: ['hope', 'wish', 'want', 'expect', 'would like', 'hopes', 'wishes', 'wanted'],
  and_but_or: ['and', 'but', 'or', 'so', 'because', 'although', 'yet', 'while'],
  during_for_since: ['during', 'for', 'since', 'while', 'when', 'in', 'at', 'on'],
  to_infinitive_vs_ing: ['to buy', 'buying', 'to ask', 'asking', 'to meet', 'meeting', 'to go', 'going', 'to do', 'doing', 'to watch', 'watching'],
  have_pass_spend_take: ['have', 'pass', 'spend', 'take', 'had', 'passed', 'spent', 'took', 'has', 'passes', 'spends', 'takes'],
  big_great_large: ['great', 'large', 'big', 'high', 'wide', 'short', 'low', 'small', 'strong', 'light', 'false'],
  near_nearby_next_to: ['near', 'nearby', 'next to', 'nearly', 'close to', 'next', 'almost'],
  plural_nouns: ['people', 'person', 'persons', 'peoples', 'children', 'child', 'childrens', 'stories', 'storys', 'wives', 'wifes'],
  look_see_watch: ['look', 'see', 'watch', 'looked', 'saw', 'watched', 'looking', 'seeing', 'watching'],
  countable_uncountable: ['work', 'works', 'jobs', 'job', 'advice', 'advices', 'information', 'informations', 'scenery', 'sceneries', 'furnitures', 'furniture'],
  double_consonant: ['writing', 'writting', 'planning', 'planing', 'opened', 'openned', 'referring', 'refering', 'preferred', 'prefered', 'stopped', 'stoped'],
  opinions: ['On the contrary', 'According to', 'Firstly', 'At first', 'However', 'Therefore', 'Furthermore', 'In addition', 'On the other hand'],
  give_provide_offer: ['give', 'provide', 'offer', 'gave', 'provided', 'offered', 'giving', 'providing', 'offering', 'gives', 'provides', 'offers'],
  still_already_yet: ['still', 'already', 'yet', 'anymore', 'any longer', 'no longer'],
  do_vs_make: ['do', 'make', 'did', 'made', 'does', 'makes', 'doing', 'making', 'done', 'doing']
};

const buildMCQ = (topicKey) => {
  const data = GRAMMAR[topicKey];
  if (!data || !data.practice) return [];

  // Collect all answers from ALL topics for cross-topic distractors
  const allAnswers = Object.values(GRAMMAR)
    .flatMap(g => g.practice || [])
    .map(p => p.answer)
    .filter(Boolean)
    .flatMap(a => a.split(' / '));

  const questions = [];

  data.practice.forEach((item, i) => {
    if (item.sentence && item.answer) {
      // Standard fill-in-the-blank MCQ
      const isDouble = item.answer.includes(' / ');
      const correctAns = item.answer;
      
      let distractors = [];
      if (isDouble) {
        // Generate double-blank distractors by combining items from logical distractors
        const words = LOGICAL_DISTRACTORS[topicKey] || ['do', 'make', 'did', 'made'];
        const combos = [];
        for (let x = 0; x < words.length; x++) {
          for (let y = 0; y < words.length; y++) {
            if (words[x] !== words[y] && combos.length < 20) {
              combos.push(`${words[x]} / ${words[y]}`);
            }
          }
        }
        distractors = shuffleArray(combos)
          .filter(c => c.toLowerCase() !== correctAns.toLowerCase())
          .slice(0, 3);
      } else {
        // Build distractors from same topic first
        const sameTopicAnswers = data.practice
          .filter((_, idx) => idx !== i)
          .map(p => p.answer)
          .filter(Boolean)
          .flatMap(a => a.split(' / '))
          .filter(a => a.toLowerCase() !== correctAns.toLowerCase());

        // Get logical distractors specifically for this category
        const categorySpecific = LOGICAL_DISTRACTORS[topicKey] || [];
        const categoryFiltered = categorySpecific.filter(a => a.toLowerCase() !== correctAns.toLowerCase());

        // Fallback cross-topic distractors
        const crossTopicAnswers = shuffleArray(allAnswers).filter(
          a => a.toLowerCase() !== correctAns.toLowerCase()
        );

        const distractor_pool = [
          ...sameTopicAnswers,
          ...categoryFiltered,
          ...crossTopicAnswers
        ];
        distractors = [...new Set(distractor_pool)].slice(0, 3);
      }

      const options = shuffleArray([correctAns, ...distractors]);

      questions.push({
        id: `g_${topicKey}_${i}`,
        type: 'fill',
        sentence: item.sentence,
        hint: isDouble ? `Fill in both blanks with the correct form pair.` : `Fill in the blank with the correct form.`,
        answer: correctAns,
        options,
        topic: topicKey.replace(/_/g, ' ')
      });

    } else if (item.wrong && item.correct) {
      // Error-identification MCQ: show wrong version, 4 options for correction
      // The blank is the error word
      const wrongWords = item.wrong.trim().split(/\s+/);
      const correctWords = item.correct.trim().split(/\s+/);

      // Find the differing word position
      let diffIdx = -1;
      for (let j = 0; j < Math.min(wrongWords.length, correctWords.length); j++) {
        if (wrongWords[j].replace(/[.,!?]/g, '') !== correctWords[j].replace(/[.,!?]/g, '')) {
          diffIdx = j;
          break;
        }
      }

      if (diffIdx >= 0) {
        const wrongWord = wrongWords[diffIdx].replace(/[.,!?]/g, '');
        const correctWord = correctWords[diffIdx].replace(/[.,!?]/g, '');

        // Generate logical distractors for this topic first
        const categorySpecific = LOGICAL_DISTRACTORS[topicKey] || [];
        const categoryFiltered = categorySpecific.filter(
          a => a.toLowerCase() !== correctWord.toLowerCase() && a.toLowerCase() !== wrongWord.toLowerCase()
        );

        const crossTopicAnswers = shuffleArray(allAnswers).filter(
          a => a.toLowerCase() !== correctWord.toLowerCase() && a.toLowerCase() !== wrongWord.toLowerCase()
        );

        const distractor_pool = [
          ...categoryFiltered,
          ...crossTopicAnswers
        ];

        const distractors = [...new Set(distractor_pool)].slice(0, 2);
        const options = shuffleArray([correctWord, wrongWord, ...distractors]);

        const highlighted = item.wrong.replace(wrongWords[diffIdx], `[${wrongWords[diffIdx]}]`);

        questions.push({
          id: `g_${topicKey}_${i}_err`,
          type: 'error',
          sentence: highlighted,
          hint: `The bracketed word is incorrect. Choose the correct replacement.`,
          answer: correctWord,
          options,
          topic: topicKey.replace(/_/g, ' ')
        });
      }
    }
  });

  return shuffleArray(questions);
};

export default function GrammarArena() {
  const [activeModule, setActiveModule] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [totalXp, setTotalXp] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [activeCategory, setActiveCategory] = useState('cambridge');
  const [completed, setCompleted] = useState(false);
  const [toast, setToast] = useState(null);
  const questionStartRef = useRef(Date.now());

  const startModule = (topicKey) => {
    audioManager.play('CLICK');
    const qs = buildMCQ(topicKey);
    setQuestions(qs);
    setActiveModule(topicKey);
    setCurrentIndex(0);
    setSelectedOpt(null);
    setTotalXp(0);
    setCorrectCount(0);
    setStreak(0);
    setCompleted(false);
    questionStartRef.current = Date.now();
  };

  const current = questions[currentIndex];

  const handleSelect = (opt) => {
    if (selectedOpt) return;
    setSelectedOpt(opt);
    if (opt.toLowerCase() === current.answer.toLowerCase()) {
      audioManager.play('SUCCESS');
      const newStreak = streak + 1;
      const elapsed = Date.now() - questionStartRef.current;
      const { xp, bonuses } = calcAnswerXP({ elapsedMs: elapsed, streak: newStreak, firstTry: true });
      setTotalXp(p => p + xp);
      setCorrectCount(p => p + 1);
      setStreak(newStreak);
      setToast({ xp, bonuses });
      syncXP({ incXp: xp });
    } else {
      audioManager.play('ERROR');
      setStreak(0);
    }
  };

  const handleNext = () => {
    audioManager.play('CLICK');
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedOpt(null);
      questionStartRef.current = Date.now();
    } else {
      audioManager.play('VICTORY');
      const { xp: bonusXp, isPerfect } = calcEndBonus(correctCount, questions.length);
      if (bonusXp > 0) syncXP({ incXp: bonusXp });
      syncXP({
        incXp: 0, incDone: 1,
        historyEntry: { date: new Date(), xp: totalXp + bonusXp, type: 'Grammar Blitz', accuracy: Math.round((correctCount / questions.length) * 100) }
      });
      setCompleted(true);
    }
  };

  const topicKeys = Object.keys(GRAMMAR).filter(k => GRAMMAR[k].practice);

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      <div style={{ padding: '24px 20px', maxWidth: 600, margin: '0 auto' }}>
        {activeModule === null ? (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 32 }}>
              <div style={{ padding: '8px 12px', display: 'inline-block', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--secondary)', borderRadius: 12, color: 'var(--secondary)', fontSize: 12, fontWeight: 700, letterSpacing: 1, marginBottom: 12 }}>
                MODULE 01
              </div>
              <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>Grammar Arena</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Master key grammar mechanics with topic-specific diagnostics.</p>
            </div>

            {/* Premium Tab Switcher */}
            <div style={{ display: 'flex', background: 'rgba(255, 255, 255, 0.02)', padding: 6, borderRadius: 16, border: '1px solid var(--border-glass)', marginBottom: 24, gap: 4 }}>
              {Object.entries(CATEGORIES).map(([key, cat]) => {
                const isActive = activeCategory === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      audioManager.play('CLICK');
                      setActiveCategory(key);
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: 'none',
                      background: isActive ? 'var(--grad-primary)' : 'transparent',
                      color: isActive ? 'white' : 'var(--text-dim)',
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: 'pointer',
                      transition: '0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isActive ? '0 4px 15px rgba(124, 77, 255, 0.3)' : 'none'
                    }}
                  >
                    <span className="mi" style={{ fontSize: 18 }}>{cat.icon}</span>
                    {cat.title}
                  </button>
                );
              })}
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20, fontStyle: 'italic' }}>
              {CATEGORIES[activeCategory].desc}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CATEGORIES[activeCategory].keys
                .filter(k => GRAMMAR[k] && GRAMMAR[k].practice)
                .map((topicKey, i) => {
                  const qCount = buildMCQ(topicKey).length;
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
                        <div style={{ fontSize: 11, color: 'var(--secondary)', fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Sub-Section {String(i + 1).padStart(2, '0')}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>{title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{qCount} questions available</div>
                      </div>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
                        <span className="mi">arrow_forward</span>
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

            {!completed ? (
              <div className="animate-fade-in" key={currentIndex}>
                {toast && <XPToast xp={toast.xp} bonuses={toast.bonuses} onDone={() => setToast(null)} />}
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Question</div>
                    <div style={{ fontSize: 20, fontWeight: 800 }}>{currentIndex + 1} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 14 }}>/ {questions.length}</span></div>
                  </div>
                  <StreakBadge streak={streak} />
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>XP</div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 20, fontWeight: 900, color: 'var(--primary)' }}>{totalXp}</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 24, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${((currentIndex) / questions.length) * 100}%`,
                    background: 'var(--secondary)', borderRadius: 4, transition: '0.5s'
                  }} />
                </div>

                {/* Question Card */}
                <div className="glass-card" style={{ padding: '28px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                  <div className="animate-shimmer" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3 }} />

                  {/* Hint */}
                  <div style={{ fontSize: 10, color: current?.type === 'error' ? 'var(--error)' : 'var(--secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12 }}>
                    {current?.type === 'error' ? '⚠ Find the correct replacement' : '📝 Fill in the blank'}
                  </div>

                  {/* Topic tag */}
                  <div style={{ display: 'inline-block', background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 8, padding: '3px 10px', fontSize: 9, color: 'var(--secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                    {current?.topic}
                  </div>

                  {/* Sentence */}
                  <p style={{ fontSize: 20, fontWeight: 600, color: 'white', lineHeight: 1.6, direction: 'ltr' }}>
                    &ldquo;{current?.sentence}&rdquo;
                  </p>
                </div>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {current?.options.map((opt, i) => {
                    const isSelected = selectedOpt === opt;
                    const isCorrect = selectedOpt && opt.toLowerCase() === current.answer.toLowerCase();
                    const isWrong = selectedOpt && isSelected && opt.toLowerCase() !== current.answer.toLowerCase();

                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(opt)}
                        style={{
                          width: '100%', padding: '16px 20px', borderRadius: 14, textAlign: 'left',
                          cursor: selectedOpt ? 'default' : 'pointer',
                          background: isCorrect ? 'rgba(0, 230, 118, 0.1)' : isWrong ? 'rgba(255, 82, 82, 0.1)' : isSelected ? 'rgba(0,229,255,0.08)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : isSelected ? 'var(--secondary)' : 'var(--border-glass)'}`,
                          color: isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : 'white',
                          transition: 'all 0.2s',
                          display: 'flex', alignItems: 'center', gap: 14, direction: 'ltr'
                        }}
                      >
                        <div style={{
                          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                          background: isCorrect ? 'var(--success)' : isWrong ? 'var(--error)' : isSelected ? 'var(--secondary)' : 'rgba(255,255,255,0.06)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: isCorrect || isWrong ? 16 : 12,
                          fontWeight: 900, color: isCorrect || isWrong || isSelected ? 'white' : 'var(--text-muted)'
                        }}>
                          {isCorrect ? <span className="mi" style={{ fontSize: 16 }}>check</span> : isWrong ? <span className="mi" style={{ fontSize: 16 }}>close</span> : OPTION_LABELS[i]}
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 600 }}>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback after answering */}
                {selectedOpt && (
                  <div className="animate-slide-up" style={{ marginBottom: 20 }}>
                    <div style={{
                      padding: '12px 16px', borderRadius: 12,
                      background: selectedOpt.toLowerCase() === current.answer.toLowerCase() ? 'rgba(0,230,118,0.05)' : 'rgba(255,82,82,0.05)',
                      border: `1px solid ${selectedOpt.toLowerCase() === current.answer.toLowerCase() ? 'var(--success)' : 'var(--error)'}`,
                      fontSize: 13, color: 'var(--text-dim)'
                    }}>
                      {selectedOpt.toLowerCase() !== current.answer.toLowerCase() && (
                        <strong style={{ color: 'var(--success)', display: 'block', marginBottom: 4 }}>
                          ✓ Correct: {current.answer}
                        </strong>
                      )}
                      Topic: <strong style={{ color: 'white' }}>{current.topic}</strong>
                    </div>
                  </div>
                )}

                {selectedOpt && (
                  <button className="premium-btn" style={{ width: '100%', padding: 18 }} onClick={handleNext}>
                    {currentIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                    <span className="mi">arrow_forward</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="animate-slide-up" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%', background: 'var(--grad-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px',
                  boxShadow: '0 0 40px var(--primary-glow)'
                }}>
                  <span className="mi" style={{ fontSize: 48, color: 'white' }}>military_tech</span>
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{calcEndBonus(correctCount, questions.length).isPerfect ? '🏆 Perfect Score!' : 'Module Complete!'}</h2>
                <p style={{ color: 'var(--text-dim)', marginBottom: 32 }}>
                  <strong style={{ color: 'var(--secondary)' }}>{correctCount}/{questions.length}</strong> correct · {Math.round((correctCount/questions.length)*100)}% accuracy
                </p>
                <div className="glass-card" style={{ padding: 24, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)', fontSize: 13 }}>Base XP</span><span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900 }}>{correctCount * XP_BASE}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-dim)', fontSize: 13 }}>Bonuses</span><span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, color: 'var(--primary)' }}>+{totalXp - correctCount * XP_BASE}</span></div>
                  {calcEndBonus(correctCount, questions.length).isPerfect && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--gold)', fontSize: 13 }}>💎 Perfect</span><span style={{ fontFamily: 'JetBrains Mono', fontWeight: 900, color: 'var(--gold)' }}>+30</span></div>}
                  <div style={{ height: 1, background: 'var(--border-glass)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontSize: 15, fontWeight: 800 }}>Total XP</span><span style={{ fontFamily: 'JetBrains Mono', fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>+{totalXp + calcEndBonus(correctCount, questions.length).xp}</span></div>
                </div>
                <button className="premium-btn" onClick={() => setActiveModule(null)} style={{ margin: '0 auto' }}>
                  Back to Modules <span className="mi">list</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <BottomNav />
    </main>
  );
}
