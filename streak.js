/* Real streaks, linked to the device's date. Demo "Next Day" shifts that date, so it behaves the same. */
const _dn = k => { const [y, m, d] = k.split('-').map(Number); return Date.UTC(y, m - 1, d) / 864e5; };

// Call when a quest is completed: +1 if the last active day was yesterday, otherwise starts at 1.
function updateStreakOnCompletion() {
  const today = getCurrentGameDateKey(), last = gameState.lastActiveDate;
  if (last === today) return gameState.streak;
  gameState.streak = last && _dn(today) - _dn(last) === 1 ? (gameState.streak || 0) + 1 : 1;
  gameState.lastActiveDate = today;
  gameState.bestStreak = Math.max(gameState.bestStreak || 0, gameState.streak);
  if (gameState.streak % SHIELD_EVERY === 0 && gameState.shields < SHIELD_MAX) gameState.shields += 1; // milestone reward
  return gameState.streak;
}

const _key = n => new Date(n * 864e5).toISOString().slice(0, 10);

// Missing exactly one day: a Winter Shield saves the streak automatically. Missing more resets it to 0.
function refreshStreak() {
  const last = gameState.lastActiveDate;
  if (!last) { gameState.streak = 0; return; }
  const today = getCurrentGameDateKey(), gap = _dn(today) - _dn(last);
  if (gap === 2 && gameState.streak > 0 && gameState.shields > 0) {
    gameState.shields -= 1; gameState.shieldsUsed = (gameState.shieldsUsed || 0) + 1;
    gameState.lastActiveDate = _key(_dn(today) - 1); // yesterday is covered
    if (typeof showToast === 'function') showToast('🛡 Winter Shield used. Your streak survived a missed day.', 'info');
  } else if (gap > 1) gameState.streak = 0;
  checkComebackEligibility();
}

// After a long absence, the next completed quest earns a Comeback Bonus (at most once per cooldown).
function checkComebackEligibility() {
  const last = gameState.lastActiveDate; if (!last || gameState.comebackPending) return;
  const today = getCurrentGameDateKey(), away = _dn(today) - _dn(last);
  if (away < COMEBACK_AFTER_DAYS) return;
  const lc = gameState.lastComebackDate;
  if (lc && _dn(today) - _dn(lc) < COMEBACK_COOLDOWN_DAYS) return;
  gameState.comebackPending = { awayDays: away, since: last };
}
function claimComebackIfPending() {
  if (!gameState.comebackPending) return 0;
  const today = getCurrentGameDateKey();
  gameState.lastComebackDate = today; gameState.comebackPending = null;
  awardXPAndCoins(XP_REWARDS.comeback, 0, { source: 'comeback', txId: `comeback:${today}`, silent: true });
  return XP_REWARDS.comeback;
}

// Spend a Winter Shield on today: the streak is frozen (not broken) even if no quest is completed.
function useShieldToday() {
  const today = getCurrentGameDateKey();
  if (gameState.shields < 1 || gameState.streak < 1 || gameState.lastActiveDate === today) return false;
  gameState.shields -= 1; gameState.shieldsUsed = (gameState.shieldsUsed || 0) + 1; gameState.lastActiveDate = today;
  saveState(); renderGameHub();
  if (typeof showToast === 'function') showToast('🛡 Winter Shield used. Your streak is protected today.', 'success');
  return true;
}

// Keep everything correct when the date changes while the app is open (midnight, or returning to the tab).
let _lastDayKey = getCurrentGameDateKey();
function checkDayRollover() {
  const k = getCurrentGameDateKey();
  if (k === _lastDayKey) return;
  _lastDayKey = k;
  refreshStreak(); saveState(); renderGameHub(); renderDailyCheckIn();
}
setInterval(checkDayRollover, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkDayRollover(); });
(function () { const base = window.renderGameHub; window.renderGameHub = function () { refreshStreak(); base.apply(this, arguments); }; })();
