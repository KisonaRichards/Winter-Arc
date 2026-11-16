/* In-game alerts: the Winter Arc world reacting to what you're doing (shown on the home screen). */
function getAlerts(hour = new Date().getHours()) {
  const list = [];
  if (!gameState.onboarded || !(gameState.habits || []).length) return list;
  const today = getCurrentGameDateKey(), habits = gameState.habits, last = gameState.lastActiveDate;
  const done = habits.filter(h => h.completedDate === today).length, left = habits.length - done;
  const away = last ? _dn(today) - _dn(last) : 0, started = gameState.completions.length > 0;
  const go = { label: 'ENTER THE ARC', fn: "alertGo()" };
  if (done === 0 && (gameState.comebackPending || away >= COMEBACK_AFTER_DAYS))
    list.push({ type: 'dormant', title: '⚠️ ARC STATUS: DORMANT', body: `Your progress hasn't been erased, but your momentum is fading.${gameState.comebackPending ? ` Complete today's mission for a <b>Comeback Bonus (+${XP_REWARDS.comeback} XP)</b>.` : ''}`, actions: [{ label: 'RETURN TO THE ARC', fn: 'alertGo()' }] });
  else if (done === 0 && started && away >= 3)
    list.push({ type: 'quiet', title: 'Your Arc has gone quiet.', body: `You haven't checked in for ${away} days. Your character is still here. Ready to get back in?`, actions: [{ label: 'RETURN TO THE ARC', fn: 'alertGo()' }] });
  if (done === 0 && started && gameState.streak > 0 && last !== today && hour >= ALERT_EVENING_HOUR) {
    const acts = [{ label: 'FINISH MISSION', fn: 'alertGo()' }];
    if (gameState.shields > 0) acts.push({ label: `USE SHIELD (${gameState.shields})`, fn: 'alertUseShield()' });
    list.push({ type: 'risk', title: '⚠️ STREAK AT RISK', body: `Your ${SEASON.arc} closes soon and you haven't completed a Law today. Your ${gameState.streak}-day streak is on the line.`, actions: acts });
  }
  if (left === 1 && done > 0)
    list.push({ type: 'one-left', title: '🔥 ALMOST THERE', body: `One Law remains between you and today's completion bonus (+${XP_REWARDS.dayCleared} XP). Finish it. Claim your XP.`, actions: [{ label: 'FINISH IT', fn: 'alertGo()' }] });
  if (done === 0 && started && away < 3)
    list.push({ type: 'start', title: `${SEASON.icon} ${SEASON.arc.toUpperCase()} ALERT`, body: `Your day hasn't started yet. <b>${left} Law${left === 1 ? '' : 's'} remain.</b> Your next move is waiting.`, actions: [go] });
  const inst = typeof getInstallAlert === 'function' ? getInstallAlert() : null;
  if (inst) list.push(inst);
  return list;
}

function renderAlerts() {
  const el = document.getElementById('alert-banner');
  const hud = document.getElementById('hud-streak');
  if (hud) {
    hud.textContent = `${gameState.streak}d` + (gameState.shields > 0 ? ` 🛡${gameState.shields}` : '');
    hud.title = 'Streak. 🛡 Winter Shields protect your streak for one missed day (earned every 7-day streak).';
  }
  if (!el) return;
  const today = getCurrentGameDateKey(), dis = gameState.alertsDismissed || {};
  const a = getAlerts().find(x => !(dis[x.type] && _dn(today) - _dn(dis[x.type]) < (x.snooze || 1)));
  if (!a) { el.innerHTML = ''; return; }
  el.innerHTML = `<div class="max-w-7xl mx-auto px-4 pt-3"><div class="relative rounded-2xl border border-amber-300/30 bg-gradient-to-r from-indigo-500/15 to-ice-500/10 p-3 pr-9">
    <p class="font-display font-bold text-sm text-white">${a.title}</p><p class="text-xs text-slate-300 mt-0.5">${a.body}</p>
    <div class="flex flex-wrap gap-2 mt-2">${a.actions.map((b, i) => `<button onclick="${b.fn}" class="px-3 py-1.5 rounded-lg text-[11px] font-bold ${i ? 'bg-slate-800 text-slate-200' : 'bg-gradient-to-r from-ice-500 to-blue-600 text-white'}">${b.label}</button>`).join('')}</div>
    <button onclick="dismissAlert('${a.type}')" class="absolute top-2 right-2 w-6 h-6 rounded-full text-slate-400 hover:text-white text-xs" aria-label="Dismiss">✕</button></div></div>`;
}
function dismissAlert(type) { gameState.alertsDismissed = gameState.alertsDismissed || {}; gameState.alertsDismissed[type] = getCurrentGameDateKey(); saveState(); renderAlerts(); }
function alertGo() { switchHubTab('checkin'); }
function alertUseShield() { useShieldToday(); renderAlerts(); }

(function () { const base = window.renderGameHub; window.renderGameHub = function () { base.apply(this, arguments); renderAlerts(); }; })();
setInterval(renderAlerts, 60000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) renderAlerts(); });
