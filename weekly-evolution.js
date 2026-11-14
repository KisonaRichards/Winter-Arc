/* Weekly Evolution report: automatic 7-day weeks, real stats from completion/reward history,
   reflection, immutable snapshot, and an archive in the Progress tab. */
const WK = { dn: k => { const [y, m, d] = k.split('-').map(Number); return Date.UTC(y, m - 1, d) / 864e5; }, key: n => new Date(n * 864e5).toISOString().slice(0, 10) };
const REFLECT_FIELDS = [['changed', 'WHAT CHANGED?', 'What feels different compared with the beginning of the week?'], ['worked', 'WHAT WORKED?', 'What made completing your quests easier?'],
  ['didntWork', "WHAT DIDN'T?", 'Where did you struggle, lose momentum, or make things harder than necessary?'], ['nextFocus', "NEXT WEEK'S FOCUS", 'What deserves your attention next week?']];

function getProgramStart() {
  if (!gameState.programStartKey) { gameState.programStartKey = (gameState.completions.map(c => c.date).sort()[0]) || getCurrentGameDateKey(); saveState(); }
  return gameState.programStartKey;
}
function getCurrentWeekNumber() { return Math.floor((WK.dn(getCurrentGameDateKey()) - WK.dn(getProgramStart())) / 7) + 1; }
function getWeekRange(n) { const s = WK.dn(getProgramStart()) + (n - 1) * 7; return { start: WK.key(s), end: WK.key(s + 6) }; }
const fmtDay = k => new Date(k + 'T00:00:00Z').toLocaleDateString(undefined, { month: 'long', day: 'numeric', timeZone: 'UTC' });
const reportFor = n => (gameState.weeklyReports || []).find(r => r.week === n);

function computeWeekStats(n) {
  const { start, end } = getWeekRange(n), inR = d => d >= start && d <= end;
  const comps = gameState.completions.filter(c => inR(c.date)), scheduled = Math.max(1, gameState.habits.length * 7);
  const days = [...new Set(comps.map(c => c.date))].map(WK.dn).sort((a, b) => a - b);
  let best = 0, run = 0; days.forEach((d, i) => { run = i && d === days[i - 1] + 1 ? run + 1 : 1; best = Math.max(best, run); });
  const rl = gameState.rewardLog.filter(r => inR(r.dateKey)), by = {};
  comps.forEach(c => by[c.aspectId] = (by[c.aspectId] || 0) + 1);
  let top = null, topRate = -1;
  Object.keys(by).forEach(a => { const rate = by[a] / Math.max(1, gameState.habits.filter(h => h.aspectId === a).length * 7);
    if (rate > topRate || (rate === topRate && by[a] > by[top])) { top = a; topRate = rate; } });
  const moods = (gameState.moodLogs || []).filter(m => m.dateKey && inR(m.dateKey)), mc = {};
  moods.forEach(m => mc[m.mood] = (mc[m.mood] || 0) + 1);
  const mood = moods.length ? Object.keys(mc).sort((a, b) => mc[b] - mc[a])[0] : null;
  return { questCompletion: Math.min(100, Math.round(comps.length / scheduled * 100)), questsDone: comps.length, questsScheduled: scheduled,
    xpEarned: rl.reduce((s, r) => s + r.xp, 0), coinsEarned: rl.reduce((s, r) => s + r.coins, 0), longestStreak: best, topAspect: top, mood };
}
function weekTitle(n, pct) { return n === 1 ? 'THE BEGINNING' : pct >= 85 ? 'LOCKED IN' : pct >= 65 ? 'FINDING RHYTHM' : pct >= 40 ? 'BUILDING MOMENTUM' : 'THE RESET'; }
function weekLine(pct) { return pct >= 85 ? 'Clean week. Keep the standard.' : pct >= 50 ? 'Solid. The gaps are small enough to fix.' : "Not the strongest week. It's still data."; }
const aspName = id => { const a = (typeof LIFE_ASPECTS !== 'undefined' ? LIFE_ASPECTS : []).find(x => x.id === id); return a ? a.name.split(' &')[0].toUpperCase() : id ? String(id).toUpperCase() : '—'; };
function delta(a, b, unit = '') { const d = b - a; return `<span class="${d >= 0 ? 'text-emerald-300' : 'text-slate-400'}">${d >= 0 ? '↑' : '↓'} ${Math.abs(d).toLocaleString()}${unit}</span>`; }

function openWeeklyReport(n, readOnly) {
  const saved = reportFor(n), stats = saved ? saved.stats : computeWeekStats(n), ref = saved ? saved.reflection : {};
  const prev = reportFor(n - 1), { start, end } = getWeekRange(n), ro = !!saved || readOnly;
  const box = (l, v) => `<div class="rounded-xl bg-slate-800/60 p-3"><p class="text-[10px] tracking-widest text-slate-500">${l}</p><p class="font-display text-xl font-extrabold text-white">${v}</p></div>`;
  const cmp = prev ? `<p class="text-xs text-slate-400">vs Week ${n - 1}: completion ${prev.stats.questCompletion}% → ${stats.questCompletion}% ${delta(prev.stats.questCompletion, stats.questCompletion, '%')} · XP ${prev.stats.xpEarned.toLocaleString()} → ${stats.xpEarned.toLocaleString()} ${delta(prev.stats.xpEarned, stats.xpEarned, ' XP')}</p>`
    : '<p class="text-xs text-slate-400">FIRST WEEK. This is your baseline.</p>';
  const m = document.createElement('div');
  closeQuestModal(); m.id = 'quest-modal';
  m.className = 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto p-4';
  m.innerHTML = `<div class="frost-panel rounded-3xl p-5 w-full max-w-md mx-auto space-y-4 my-4">
    <div class="text-center"><p class="text-[10px] tracking-[.3em] text-ice-300">${weekTitle(n, stats.questCompletion)}</p><h3 class="font-display text-xl font-extrabold text-white">WEEK ${String(n).padStart(2, '0')} COMPLETE</h3><p class="text-xs text-slate-500">${fmtDay(start)} → ${fmtDay(end)}</p></div>
    <div><div class="h-2 rounded-full bg-slate-800 overflow-hidden"><div class="h-full bg-gradient-to-r from-ice-400 to-blue-500" style="width:${stats.questCompletion}%"></div></div>
    <p class="text-xs text-slate-400 mt-1">${stats.questCompletion}% quest completion (${stats.questsDone} / ${stats.questsScheduled})</p></div>
    <div class="grid grid-cols-2 gap-2">${box('XP EARNED', stats.xpEarned.toLocaleString())}${box('COINS', stats.coinsEarned.toLocaleString() + ' 🪙')}
    ${box('LONGEST STREAK', '🔥 ' + stats.longestStreak + ' DAY' + (stats.longestStreak === 1 ? '' : 'S'))}${box('TOP ASPECT', aspName(stats.topAspect))}${box('MOOD', stats.mood || 'Not recorded')}</div>
    ${cmp}<p class="text-sm italic text-slate-300">${weekLine(stats.questCompletion)}</p>
    <h4 class="font-display font-bold text-white">REFLECT</h4>
    ${REFLECT_FIELDS.map(([k, label, ph]) => `<div><p class="text-[11px] font-bold text-slate-300">${label}</p>
      <textarea id="wk-${k}" maxlength="500" rows="2" ${ro ? 'readonly' : ''} placeholder="${esc(ph)}" oninput="document.getElementById('wk-${k}-c').textContent=this.value.length+' / 500'" class="w-full rounded-xl bg-obsidian-950 border border-slate-700 p-2.5 text-sm text-white">${esc(ref[k] || '')}</textarea>
      <p id="wk-${k}-c" class="text-[10px] text-slate-500 text-right">${(ref[k] || '').length} / 500</p></div>`).join('')}
    <div class="flex gap-2"><button onclick="closeQuestModal()" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold">${ro ? 'Close' : 'Later'}</button>
    ${ro ? '' : `<button onclick="submitWeeklyReport(${n})" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-ice-500 to-blue-600 text-white text-sm font-bold">COMPLETE WEEK ${String(n).padStart(2, '0')} (+${XP_REWARDS.weeklyReview} XP)</button>`}</div></div>`;
  m.addEventListener('click', e => { if (e.target === m) closeQuestModal(); });
  document.body.appendChild(m);
}
function submitWeeklyReport(n) {
  if (reportFor(n)) return;
  const stats = computeWeekStats(n), { start, end } = getWeekRange(n), reflection = {};
  REFLECT_FIELDS.forEach(([k]) => reflection[k] = document.getElementById('wk-' + k).value.trim().slice(0, 500));
  const prevLevel = gameState.level, prevXP = gameState.totalXP, prevCoins = gameState.coins;
  gameState.weeklyReports.push({ weekId: 'W' + String(n).padStart(2, '0'), week: n, startDate: start, endDate: end, stats, reflection, title: weekTitle(n, stats.questCompletion), completedAt: Date.now() });
  awardXPAndCoins(XP_REWARDS.weeklyReview, 100, { source: 'weekly-review', txId: 'weekly-review:' + n, silent: true });
  saveState(); closeQuestModal(); renderEvolution(); renderGameHub();
  celebrate({ questName: 'Weekly review complete', xp: XP_REWARDS.weeklyReview, coins: 100, prevXP, newXP: gameState.totalXP, prevCoins, newCoins: gameState.coins,
    streak: 0, isFirstEver: false, isFirstToday: false, doneToday: 0, totalToday: 0, dayCleared: false, levelFrom: prevLevel, levelTo: gameState.level });
}

function renderEvolution() {
  const tab = document.getElementById('hub-tab-progress'); if (!tab) return;
  let sec = document.getElementById('evolution-section');
  if (!sec) { sec = document.createElement('div'); sec.id = 'evolution-section'; sec.className = 'space-y-2 pb-2 border-b border-slate-800'; tab.insertBefore(sec, tab.firstChild); }
  const cur = getCurrentWeekNumber(); let pending = null;
  for (let n = 1; n < cur; n++) if (!reportFor(n)) pending = n;
  const past = [...gameState.weeklyReports].sort((a, b) => b.week - a.week);
  sec.innerHTML = `<h3 class="font-display font-bold text-lg text-white">Evolution</h3>
    ${pending ? `<button onclick="openWeeklyReport(${pending})" class="w-full text-left rounded-2xl border border-amber-300/40 bg-amber-500/10 p-3"><p class="text-sm font-bold text-amber-200">WEEK ${String(pending).padStart(2, '0')} COMPLETE</p><p class="text-xs text-slate-300">Your weekly evolution is ready. <b>REVIEW WEEK ${String(pending).padStart(2, '0')}</b></p></button>` : ''}
    <p class="text-xs text-slate-400">CURRENT: WEEK ${String(cur).padStart(2, '0')} in progress · ${fmtDay(getWeekRange(cur).start)} → ${fmtDay(getWeekRange(cur).end)}</p>
    ${past.map(r => `<div class="rounded-xl bg-slate-800/50 p-3 flex items-center justify-between gap-2"><div class="text-xs"><p class="font-bold text-white">WEEK ${String(r.week).padStart(2, '0')} · ${r.title}</p>
      <p class="text-slate-400">${r.stats.questCompletion}% · ${r.stats.xpEarned.toLocaleString()} XP · 🔥 ${r.stats.longestStreak} · ${aspName(r.stats.topAspect)}</p></div>
      <button onclick="openWeeklyReport(${r.week},true)" class="text-[11px] font-bold text-ice-300 shrink-0">VIEW REPORT</button></div>`).join('')}`;
}
(function () { const base = window.renderProgressTab; window.renderProgressTab = function () { base(); renderEvolution(); }; })();
