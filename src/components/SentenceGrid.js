'use client';
import { useState } from 'react';

export default function SentenceGrid({ sentences, onSelect, activeIndex }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(45px, 1fr))', gap: 10, marginTop: 24 }}>
      {sentences.map((s, idx) => (
        <button
          key={s.id}
          onClick={() => onSelect(idx)}
          style={{
            height: 45,
            borderRadius: 12,
            border: activeIndex === idx ? `2px solid var(--primary)` : '1px solid var(--border-glass)',
            background: activeIndex === idx ? 'var(--primary-glow)' : 'var(--bg-glass)',
            color: activeIndex === idx ? 'white' : 'var(--text-dim)',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: activeIndex === idx ? '0 0 15px var(--primary-glow)' : 'none'
          }}
        >
          {idx + 1}
        </button>
      ))}
    </div>
  );
}
