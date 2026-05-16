'use client';
import { useState, useEffect, useRef } from 'react';

export default function useProgress() {
  const [progress, setProgress] = useState({
    errors: { done: [], wrong: [] },
    phrasal: { done: [], wrong: [] },
    grammar: { done: [], wrong: [] },
    work: { done: [], wrong: [] },
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sbr_progress');
      if (saved) setProgress(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const save = (next) => {
    setProgress(next);
    try { localStorage.setItem('sbr_progress', JSON.stringify(next)); } catch (e) {}
  };

  const markDone = (arena, id) => {
    const next = { ...progress };
    if (!next[arena].done.includes(id)) next[arena].done.push(id);
    next[arena].wrong = next[arena].wrong.filter(w => w !== id);
    save(next);
  };

  const markWrong = (arena, id) => {
    const next = { ...progress };
    if (!next[arena].wrong.includes(id)) next[arena].wrong.push(id);
    save(next);
  };

  const getPercent = (arena, total) => {
    if (!total) return 0;
    return Math.round((progress[arena].done.length / total) * 100);
  };

  const getWrong = (arena) => progress[arena].wrong;

  const reset = () => {
    const fresh = { errors: { done: [], wrong: [] }, phrasal: { done: [], wrong: [] }, grammar: { done: [], wrong: [] }, work: { done: [], wrong: [] } };
    save(fresh);
  };

  return { progress, markDone, markWrong, getPercent, getWrong, reset };
}
