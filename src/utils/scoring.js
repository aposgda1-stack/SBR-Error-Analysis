/**
 * SBR Premium Scoring Engine
 * Base: 10 XP per correct answer
 * Bonuses:
 *   ⚡ Speed Bonus   → +5 XP  (answered in < 5s)
 *   🔥 Streak Bonus  → +15 XP (every 3 correct in a row)
 *   🎯 First Try     → +5 XP  (correct on first attempt, MistakesExercise only)
 *   💎 Perfect End   → +30 XP (100% accuracy at module end)
 */

export const XP_BASE = 10;
export const XP_SPEED_BONUS = 5;
export const XP_STREAK_BONUS = 15;
export const XP_FIRST_TRY_BONUS = 5;
export const XP_PERFECT_BONUS = 30;
export const STREAK_THRESHOLD = 3;
export const SPEED_THRESHOLD_MS = 5000;

/**
 * Calculate XP for a single correct answer.
 * @param {object} opts
 * @param {number} opts.elapsedMs   - time taken in ms since question appeared
 * @param {number} opts.streak      - current streak count (after this correct answer)
 * @param {boolean} opts.firstTry   - true if no wrong attempts before this correct
 * @returns {{ xp: number, bonuses: string[] }}
 */
export function calcAnswerXP({ elapsedMs = 9999, streak = 0, firstTry = false }) {
  let xp = XP_BASE;
  const bonuses = [];

  if (elapsedMs < SPEED_THRESHOLD_MS) {
    xp += XP_SPEED_BONUS;
    bonuses.push(`⚡ Speed +${XP_SPEED_BONUS}`);
  }
  if (streak > 0 && streak % STREAK_THRESHOLD === 0) {
    xp += XP_STREAK_BONUS;
    bonuses.push(`🔥 Streak x${streak} +${XP_STREAK_BONUS}`);
  }
  if (firstTry) {
    xp += XP_FIRST_TRY_BONUS;
    bonuses.push(`🎯 First Try +${XP_FIRST_TRY_BONUS}`);
  }

  return { xp, bonuses };
}

/**
 * Calculate end-of-module perfect bonus.
 * @param {number} score   - correct answers
 * @param {number} total   - total questions
 * @returns {{ xp: number, isPerfect: boolean }}
 */
export function calcEndBonus(score, total) {
  const isPerfect = score === total && total > 0;
  return { xp: isPerfect ? XP_PERFECT_BONUS : 0, isPerfect };
}

/**
 * Sync XP to server (fire & forget).
 */
export function syncXP({ incXp = 0, incDone = 0, historyEntry = null, pushVault = null, completedSection = null }) {
  const uId = JSON.parse(localStorage.getItem('sbr_user') || '{}').userId;
  if (!uId) return;
  
  if (completedSection) {
    try {
      const localCompleted = JSON.parse(localStorage.getItem('sbr_completed_sections') || '[]');
      if (!localCompleted.includes(completedSection)) {
        localCompleted.push(completedSection);
        localStorage.setItem('sbr_completed_sections', JSON.stringify(localCompleted));
      }
    } catch (e) {
      console.error(e);
    }
  }

  if (incXp <= 0 && incDone <= 0 && !historyEntry && !pushVault && !completedSection) return;
  
  const body = { action: 'sync', userId: uId };
  if (incXp > 0) body.incXp = incXp;
  if (incDone > 0) body.incDone = incDone;
  if (historyEntry) body.pushHistory = historyEntry;
  if (pushVault) body.pushVault = pushVault;
  if (completedSection) body.pushCompletedSection = completedSection;
  
  fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(console.error);
}
