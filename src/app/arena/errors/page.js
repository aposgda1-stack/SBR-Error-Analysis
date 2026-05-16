'use client';
import { useState, useEffect } from 'react';
import TopBar from '../../../components/TopBar';
import BottomNav from '../../../components/BottomNav';
import sectionsData from '../../../../data/sections.json';
import MistakesExercise from '../../../components/MistakesExercise';

export default function ErrorsArena() {
  const data = sectionsData.identify_error_data;

  return (
    <main style={{ minHeight: '100vh', paddingBottom: 100 }}>
      <TopBar />
      
      <div style={{ padding: '24px 20px' }}>
        <div className="animate-slide-up" style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ padding: '8px 12px', background: 'rgba(124, 77, 255, 0.1)', border: '1px solid var(--primary)', borderRadius: 12, color: 'var(--primary)', fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
              MODULE 01
            </div>
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: 'white' }}>Error Hunter</h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 15 }}>Master the 130 most common mistakes in English stylistics.</p>
        </div>

        <div className="glass-panel" style={{ padding: '2px', background: 'linear-gradient(135deg, var(--border-glass), transparent)' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 22, padding: '24px' }}>
            <MistakesExercise data={data} />
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
