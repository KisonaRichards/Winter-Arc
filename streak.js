/* Real streaks, linked to the device's date. Demo "Next Day" shifts that date, so it behaves the same. */
const _dn = k => { const [y, m, d] = k.split('-').map(Number); return Date.UTC(y, m - 1, d) / 864e5; };

// Call when a quest is completed: +1 if the last active day was yesterday, otherwise starts at 1.
function updateStreakOnCompletion() {
  const today = getCurrentGameDateKey(), last = gameState.lastActiveDate;
  if (last === today) return gameState.streak;
  gameState.streak = last && _dn(today) - _dn(last) === 1 ? (gameState.streak || 0) + 1 : 1;
  gameState.lastActiveDate = today;
  gameState.bestStreak = Math.max(gameState.bestStreak || 0, gameState.streak);
  return gameState.streak;
}

// A whole missed day resets the streak to 0.
function refreshStreak() {
  const last = gameState.lastActiveDate;
  if (!last) { gameState.streak = 0; return; }
  if (_dn(getCurrentGameDateKey()) - _dn(last) > 1) gameState.streak = 0;
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
