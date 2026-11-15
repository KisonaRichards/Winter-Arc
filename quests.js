/* Quests: proof types (photo / timer / checkbox / manual), difficulty, and the single completion pipeline:
   validate proof -> completeQuest -> awardXPAndCoins -> celebrate */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function habitCfg(h) {
  return { proofType: PROOF_TYPES[h.proofType] ? h.proofType : 'photo', difficulty: DIFFICULTIES[h.difficulty] ? h.difficulty : 'medium', targetMinutes: h.targetMinutes || 30 };
}

function startQuest(habitId) {
  const h = gameState.habits.find(x => x.id === habitId);
  if (!h) return;
  if (h.completedDate === getCurrentGameDateKey()) { showToast('Already checked in today! Resets tomorrow.', 'warning'); return; }
  const c = habitCfg(h);
  if (c.proofType === 'photo') return openProofModal(habitId);
  if (c.proofType === 'checkbox') return completeQuest(h, 'checkbox', { checked: true });
  openQuestModal(h);
}

// The one completion pipeline. Every proof type ends here.
function completeQuest(habit, proofType, proofData) {
  const today = getCurrentGameDateKey();
  if (habit.completedDate === today) return false; // duplicate guard
  const c = habitCfg(habit), xp = XP_REWARDS[c.difficulty], coins = COIN_REWARDS.quest;
  const prev = { xp: gameState.totalXP, coins: gameState.coins, level: gameState.level };
  const wasFirstEver = gameState.completions.length === 0;
  const doneBefore = gameState.habits.filter(h => h.completedDate === today).length;

  habit.completedDate = today;
  gameState.aspectXP[habit.aspectId] = (gameState.aspectXP[habit.aspectId] || 15) + 25;
  if (gameState.activeTimers) delete gameState.activeTimers[habit.id];
  gameState.completions.push({ id: 'cmp_' + Date.now(), habitId: habit.id, habitText: habit.text, aspectId: habit.aspectId,
    date: today, proofType, difficulty: c.difficulty, completedAt: Date.now(), xp, coins, proofData });
  const shieldsBefore = gameState.shields;
  updateStreakOnCompletion();
  const shieldEarned = gameState.shields > shieldsBefore;
  awardXPAndCoins(xp, coins, { source: 'quest', txId: `quest:${habit.id}:${today}`, silent: true });

  const dayCleared = gameState.habits.every(h => h.completedDate === today);
  let totalXP = xp, totalCoins = coins;
  if (dayCleared) {
    awardXPAndCoins(XP_REWARDS.dayCleared, COIN_REWARDS.dayCleared, { source: 'daily-bonus', txId: `daily-bonus:${today}`, silent: true });
    totalXP += XP_REWARDS.dayCleared; totalCoins += COIN_REWARDS.dayCleared;
  }
  const comebackXP = claimComebackIfPending();
  totalXP += comebackXP;
  closeQuestModal();
  interactWithAvatar();
  celebrate({ comebackXP, shieldEarned, questName: habit.text, xp: totalXP, coins: totalCoins, prevXP: prev.xp, newXP: gameState.totalXP,
    prevCoins: prev.coins, newCoins: gameState.coins, streak: gameState.streak, isFirstEver: wasFirstEver,
    isFirstToday: doneBefore === 0, doneToday: doneBefore + 1, totalToday: gameState.habits.length,
    dayCleared, levelFrom: prev.level, levelTo: gameState.level });
  return true;
}

/* ---------- Timer / Manual modal ---------- */
let questTimerInterval = null;
function closeQuestModal() { clearInterval(questTimerInterval); const m = document.getElementById('quest-modal'); if (m) m.remove(); }
function modalShell(inner) {
  closeQuestModal();
  const m = document.createElement('div');
  m.id = 'quest-modal';
  m.className = 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4';
  m.innerHTML = `<div class="frost-panel rounded-3xl p-5 w-full max-w-sm space-y-4">${inner}</div>`;
  m.addEventListener('click', e => { if (e.target === m) closeQuestModal(); });
  document.body.appendChild(m);
}
function openQuestModal(h) {
  const c = habitCfg(h);
  if (c.proofType === 'manual') {
    modalShell(`<h3 class="font-display font-bold text-lg text-white">${esc(h.text)}</h3>
      <p class="text-xs text-slate-400">What did you complete?</p>
      <textarea id="quest-note" maxlength="300" rows="4" class="w-full rounded-xl bg-obsidian-950 border border-slate-700 p-3 text-sm text-white" placeholder="e.g. Studied SQL joins for 45 minutes."></textarea>
      <div class="flex justify-between text-[11px] text-slate-500"><span>Min 10 characters</span><span id="quest-note-count">0 / 300</span></div>
      <p id="quest-error" class="text-xs text-amber-300 hidden"></p>
      <div class="flex gap-2"><button onclick="closeQuestModal()" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold">Cancel</button>
      <button onclick="submitManualQuest('${h.id}')" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-ice-500 to-blue-600 text-white text-sm font-bold">Submit</button></div>`);
    document.getElementById('quest-note').addEventListener('input', e => { document.getElementById('quest-note-count').textContent = `${e.target.value.length} / 300`; });
    return;
  }
  // Timer: state lives in gameState (wall-clock based), so refreshing can't skip time.
  gameState.activeTimers = gameState.activeTimers || {};
  const t = gameState.activeTimers[h.id];
  const draw = () => {
    const tm = gameState.activeTimers[h.id], target = c.targetMinutes * 60;
    const el = tm ? Math.floor((Date.now() - tm.startedAt) / 1000) : 0, done = el >= target;
    const f = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    modalShell(`<h3 class="font-display font-bold text-lg text-white">${esc(h.text)}</h3>
      <div class="text-center py-3"><p class="font-display text-4xl font-extrabold ${done ? 'text-emerald-300' : 'text-white'}">${f(Math.min(el, target))} <span class="text-slate-500 text-xl">/ ${f(target)}</span></p>
      <p class="text-xs text-slate-400 mt-1">${done ? 'TARGET REACHED' : tm ? 'Timer running. Keep it open or come back later.' : 'Start when you begin.'}</p></div>
      ${!tm ? `<button onclick="startQuestTimer('${h.id}')" class="w-full py-3 rounded-xl bg-gradient-to-r from-ice-500 to-blue-600 text-white font-bold text-sm">START TIMER</button>`
        : done ? `<button onclick="finishTimerQuest('${h.id}')" class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm">COMPLETE QUEST</button>`
        : `<button onclick="finishTimerQuest('${h.id}')" class="w-full py-3 rounded-xl bg-slate-800 text-slate-500 font-bold text-sm">COMPLETE QUEST</button>`}
      ${DEMO_MODE && tm && !done ? `<button onclick="demoSkipTimer('${h.id}')" class="w-full text-[11px] text-slate-500 underline">Demo: skip ahead</button>` : ''}
      <button onclick="closeQuestModal()" class="w-full text-xs text-slate-400">Close</button>`);
    if (tm && !done) { clearInterval(questTimerInterval); questTimerInterval = setInterval(() => { if (document.getElementById('quest-modal')) draw(); }, 1000); }
  };
  draw();
}
function startQuestTimer(id) { gameState.activeTimers[id] = { startedAt: Date.now(), dateKey: getCurrentGameDateKey() }; saveState(); openQuestModal(gameState.habits.find(h => h.id === id)); }
function demoSkipTimer(id) { gameState.activeTimers[id].startedAt -= habitCfg(gameState.habits.find(h => h.id === id)).targetMinutes * 60000; openQuestModal(gameState.habits.find(h => h.id === id)); }
function finishTimerQuest(id) {
  const h = gameState.habits.find(x => x.id === id), c = habitCfg(h), tm = (gameState.activeTimers || {})[id];
  const mins = tm ? (Date.now() - tm.startedAt) / 60000 : 0;
  if (!tm || mins < c.targetMinutes) { showToast("You haven't reached the required time yet.", 'warning'); return; }
  completeQuest(h, 'timer', { targetMinutes: c.targetMinutes, completedMinutes: Math.floor(mins) });
}
function submitManualQuest(id) {
  const h = gameState.habits.find(x => x.id === id), note = document.getElementById('quest-note').value.trim();
  if (note.length < 10) { const e = document.getElementById('quest-error'); e.textContent = 'Add a short completion note before submitting (10+ characters).'; e.classList.remove('hidden'); return; }
  completeQuest(h, 'manual', { note: note.slice(0, 300) });
}

/* ---------- Per-habit quest settings (proof method, difficulty, timer length) ---------- */
function openQuestSettings(id) {
  const h = gameState.habits.find(x => x.id === id), c = habitCfg(h);
  modalShell(`<h3 class="font-display font-bold text-lg text-white">Quest settings</h3><p class="text-xs text-slate-400 -mt-2">${esc(h.text)}<br>Changes apply to future completions only.</p>
    <div class="space-y-1.5">${Object.entries(PROOF_TYPES).map(([k, p]) => `<label class="flex gap-2 p-2.5 rounded-xl border ${c.proofType === k ? 'border-ice-400/60 bg-ice-500/10' : 'border-slate-700'} cursor-pointer">
      <input type="radio" name="qs-proof" value="${k}" ${c.proofType === k ? 'checked' : ''} class="mt-1"><span><b class="text-sm text-white">${p.icon} ${p.label}</b><br><span class="text-[11px] text-slate-400">${p.desc}</span></span></label>`).join('')}</div>
    <div class="grid grid-cols-2 gap-2 text-xs text-slate-300">
      <label>Difficulty<select id="qs-diff" class="w-full mt-1 rounded-lg bg-obsidian-950 border border-slate-700 p-2 text-white">${Object.entries(DIFFICULTIES).map(([k, v]) => `<option value="${k}" ${c.difficulty === k ? 'selected' : ''}>${v} (+${XP_REWARDS[k]} XP)</option>`).join('')}</select></label>
      <label>Timer length<select id="qs-min" class="w-full mt-1 rounded-lg bg-obsidian-950 border border-slate-700 p-2 text-white">${TIMER_OPTIONS.map(m => `<option value="${m}" ${c.targetMinutes === m ? 'selected' : ''}>${m} min</option>`).join('')}</select></label></div>
    <div class="flex gap-2"><button onclick="closeQuestModal()" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-sm font-bold">Cancel</button>
    <button onclick="saveQuestSettings('${id}')" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-ice-500 to-blue-600 text-white text-sm font-bold">Save</button></div>`);
}
function saveQuestSettings(id) {
  const h = gameState.habits.find(x => x.id === id);
  h.proofType = document.querySelector('input[name="qs-proof"]:checked').value;
  h.difficulty = document.getElementById('qs-diff').value;
  h.targetMinutes = parseInt(document.getElementById('qs-min').value, 10);
  saveState(); closeQuestModal(); renderDailyCheckIn();
}

// Decorate the existing check-in list: proof/difficulty tag, new button action, settings gear.
(function () {
  const base = window.renderDailyCheckIn;
  window.renderDailyCheckIn = function () {
    base();
    const rows = [...document.getElementById('daily-habits-container').children];
    gameState.habits.forEach((h, i) => {
      const row = rows[i]; if (!row) return;
      const c = habitCfg(h), p = PROOF_TYPES[c.proofType], span = row.querySelector('span');
      if (span) span.textContent += ` · ${p.icon} ${c.proofType === 'timer' ? c.targetMinutes + ' min' : p.label} · ${DIFFICULTIES[c.difficulty]}`;
      const btn = row.querySelector('button');
      // Settings button (proof method, difficulty, timer). Uses a plain emoji so it still shows if the icon font fails to load.
      const gear = document.createElement('button');
      gear.className = 'w-9 h-9 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white text-base shrink-0 flex items-center justify-center';
      gear.textContent = '⚙️'; gear.title = 'Change proof method'; gear.setAttribute('aria-label', 'Change proof method');
      gear.setAttribute('onclick', `openQuestSettings('${h.id}')`);
      if (btn) {
        btn.setAttribute('onclick', `startQuest('${h.id}')`);
        const run = (gameState.activeTimers || {})[h.id];
        const label = { photo: 'Snap Proof', timer: run ? 'Timer' : 'Start Timer', checkbox: 'Complete', manual: 'Write Note' }[c.proofType];
        btn.innerHTML = `<span>${p.icon}</span> ${label}`;
        btn.parentNode.insertBefore(gear, btn);
      } else {
        row.appendChild(gear); // completed today: you can still change the method for future days
      }
      row.classList.add('gap-2');
    });
  };
})();
