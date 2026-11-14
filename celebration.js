/* Quest celebration: standard (compact card), day cleared and level up (full overlay). */
const CELEBRATION_MESSAGES = {
  standard: ['That counts. Keep stacking them.', 'One less thing you can talk yourself out of.', 'Proof beats promises.', 'Small move. Real progress.',
    'You showed up. That\'s the part that matters.', 'Another one handled.', 'The boring stuff is starting to compound.', 'You did the thing. Moving on.',
    'Not glamorous. Still counts.', 'Future-you gets to cash this one in.', 'Momentum looks suspiciously like this.', 'You kept the promise today.',
    'Nothing flashy. Just consistency doing its job.', 'Another brick in the wall.', 'That\'s how the gap gets smaller.', 'One more vote for the person you\'re building.'],
  firstEver: ['Well. You officially started.', 'First one in the books.'],
  firstToday: ['And we\'re off.', 'Day started. Good.', 'First one down. The rest get easier.'],
  roll: ['You\'re on a little roll.', 'Three deep. Don\'t get cocky. Keep going.', 'Look at that. A pattern.'],
  streak: ['At this point, the streak has receipts.', 'The streak keeps its own score.', 'Okay, this is becoming a pattern.'],
  dayCleared: ['That\'s the whole board cleared.', 'Everything handled. Rest is earned.', 'Clean sweep. Nothing left to negotiate with.'],
  levelUp: ['Level up. Your room better make some space.', 'Higher level. Same job: keep showing up.', 'The grind noticed. So did the game.'],
  milestone: ['Milestone level. You\'ve officially outgrown the starter gear.', 'Okay, this is becoming a pattern.', 'Not a fluke anymore.']
};
const _celRecent = [];
const celReduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function celPick(cat) {
  const pool = CELEBRATION_MESSAGES[cat] || CELEBRATION_MESSAGES.standard;
  let opts = pool.filter(m => !_celRecent.includes(m)); if (!opts.length) opts = pool;
  const m = opts[Math.floor(Math.random() * opts.length)];
  _celRecent.push(m); if (_celRecent.length > 4) _celRecent.shift();
  return m;
}
function countUp(el, from, to, delay = 0, ms = 700) {
  if (!el) return;
  if (celReduced() || from === to) { el.textContent = to.toLocaleString(); return; }
  el.textContent = from.toLocaleString();
  setTimeout(() => { const t0 = performance.now(); (function f(t) {
    const p = Math.min(1, (t - t0) / ms); el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))).toLocaleString();
    if (p < 1) requestAnimationFrame(f); })(t0); }, delay);
}
let _celTimer = null;
function closeCelebration() { clearTimeout(_celTimer); const r = document.getElementById('celebration-root'); if (r) r.remove(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCelebration(); });

function celParticles(host, n, spread, colors) {
  if (celReduced() || !host.animate) return;
  for (let i = 0; i < n; i++) {
    const s = document.createElement('span'), a = Math.random() * Math.PI * 2, d = spread * (0.4 + Math.random() * 0.6), sz = 3 + Math.random() * 4;
    s.style.cssText = `position:absolute;left:50%;top:40%;width:${sz}px;height:${sz}px;border-radius:50%;background:${colors[i % colors.length]};pointer-events:none`;
    host.appendChild(s);
    s.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d - 30}px) scale(.3)`, opacity: 0 }],
      { duration: 900 + Math.random() * 600, delay: 300 + Math.random() * 300, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'both' }).onfinish = () => s.remove();
  }
}

function celebrate(d) {
  closeCelebration();
  const tier = d.levelTo > d.levelFrom ? 'level' : d.dayCleared ? 'day' : 'standard';
  const cat = tier === 'level' ? (MILESTONE_LEVELS.includes(d.levelTo) ? 'milestone' : 'levelUp') : tier === 'day' ? 'dayCleared'
    : d.isFirstEver ? 'firstEver' : d.streak >= 7 ? 'streak' : d.isFirstToday ? 'firstToday' : d.doneToday >= 3 ? 'roll' : 'standard';
  const title = { level: 'LEVEL UP', day: 'DAY CLEARED', standard: 'QUEST COMPLETE' }[tier];
  const sub = tier === 'level' ? `LEVEL ${d.levelFrom} → LEVEL ${d.levelTo}` : tier === 'day' ? `${d.doneToday} / ${d.totalToday} QUESTS COMPLETE` : esc(d.questName);
  const unlocked = tier === 'level' ? getItemsUnlockedBetween(d.levelFrom, d.levelTo) : [];
  const big = tier !== 'standard';
  const row = (label, gain, icon, id, prev, next, delay) => `<div class="cel-rise" style="animation-delay:${delay}s"><span class="font-display text-2xl font-extrabold text-white">+<span id="${id}-g">0</span> ${icon}</span>
    <span class="block text-[10px] tracking-widest text-slate-500">${label} <span id="${id}-t"></span></span></div>`;
  const root = document.createElement('div');
  root.id = 'celebration-root';
  root.className = 'fixed inset-0 z-[60] flex justify-center ' + (big ? 'items-center bg-black/70 backdrop-blur-sm px-4' : 'items-start pt-20 pointer-events-none px-4');
  root.innerHTML = `<div class="relative pointer-events-auto w-full max-w-xs rounded-3xl border ${big ? 'border-amber-300/40' : 'border-ice-400/30'} bg-obsidian-900/95 shadow-2xl p-5 text-center space-y-3 cel-rise" style="animation-delay:0s">
    <p class="font-display text-xs tracking-[.3em] font-extrabold ${big ? 'text-amber-300' : 'text-ice-300'} cel-glow">${title}</p>
    <p class="text-sm text-slate-300 break-words">${sub}</p>
    <div class="flex justify-center gap-6">${row('TOTAL XP', d.xp, 'XP', 'cxp', d.prevXP, d.newXP, 0.25)}${row('COINS', d.coins, '🪙', 'cco', d.prevCoins, d.newCoins, 0.4)}</div>
    ${d.streak >= 2 ? `<p class="cel-rise text-sm font-bold text-orange-300" style="animation-delay:.6s"><span class="cel-flame">🔥</span> ${d.streak} DAY STREAK</p>` : ''}
    ${unlocked.length ? `<div class="cel-rise text-left text-xs space-y-1 rounded-xl bg-amber-500/10 border border-amber-400/30 p-3" style="animation-delay:.7s"><p class="font-bold text-amber-200">NEW ACCESS UNLOCKED</p>${unlocked.map(u => `<p class="text-slate-200">✦ ${esc(u.name)} <span class="text-slate-500">(Lv ${u.level})</span></p>`).join('')}</div>` : ''}
    <p class="cel-rise text-sm italic text-slate-200" style="animation-delay:.85s">${celPick(cat)}</p>
    ${big ? `<button onclick="${unlocked.length ? `viewUnlocked('${unlocked[0].cat}')` : 'closeCelebration()'}" class="cel-rise w-full py-2.5 rounded-xl bg-gradient-to-r from-ice-500 to-blue-600 text-white text-sm font-bold" style="animation-delay:1s">${unlocked.length ? 'VIEW ITEM' : 'CONTINUE'}</button>` : ''}</div>`;
  root.addEventListener('click', e => { if (e.target === root || !big) closeCelebration(); });
  document.body.appendChild(root);
  countUp(document.getElementById('cxp-g'), 0, d.xp, 250); countUp(document.getElementById('cco-g'), 0, d.coins, 400);
  document.getElementById('cxp-t').textContent = `${d.prevXP.toLocaleString()} → ${d.newXP.toLocaleString()}`;
  document.getElementById('cco-t').textContent = `${d.prevCoins.toLocaleString()} → ${d.newCoins.toLocaleString()}`;
  celParticles(root.firstElementChild, tier === 'level' ? 60 : tier === 'day' ? 28 : 10, tier === 'standard' ? 110 : 190, ['#38bdf8', '#fde047', '#e0f2fe']);
  if (tier === 'level') SoundFX.levelUp();
  if (!big) _celTimer = setTimeout(closeCelebration, 2800);
}
function viewUnlocked(cat) { closeCelebration(); switchHubTab('shop'); setShopCategory(SHOP_TAB_FOR[cat]); }
