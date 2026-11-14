/* Level gates: locked items stay visible, can't be bought, and explain what they're waiting for. */
const GATED_BUYS = { buyOutfit: 'outfit', buyRoomItem: 'room', buyWallColor: 'wall', buyFloorColor: 'floor' };
function isLevelUnlocked(cat, id) { return gameState.level >= getRequiredLevel(cat, id); }

Object.entries(GATED_BUYS).forEach(([fn, cat]) => {
  const orig = window[fn];
  window[fn] = function (id) { if (!isLevelUnlocked(cat, id)) { showLockModal(cat, id); return; } return orig.apply(this, arguments); };
});

function showLockModal(cat, id) {
  const it = getShopItem(cat, id); if (!it) return;
  const req = getRequiredLevel(cat, id), toGo = req - gameState.level;
  const xpLeft = Math.max(0, getXPRequiredForLevel(req) - gameState.totalXP);
  modalShell(`<div class="text-center space-y-2"><p class="text-3xl">🔒</p><h3 class="font-display font-extrabold text-white tracking-wide">ITEM RESERVED</h3>
    <p class="text-sm text-slate-300">${esc(it.name)} is waiting for you at Level ${req}.</p>
    <div class="grid grid-cols-2 gap-2 text-xs"><div class="rounded-xl bg-slate-800/70 p-2"><p class="text-slate-500">Your level</p><p class="text-lg font-bold text-white">${gameState.level}</p></div>
    <div class="rounded-xl bg-amber-500/10 p-2"><p class="text-slate-500">Required</p><p class="text-lg font-bold text-amber-300">${req}</p></div></div>
    <p class="text-xs text-slate-400">${toGo} level${toGo === 1 ? '' : 's'} to go · ${xpLeft.toLocaleString()} XP</p>
    <button onclick="closeQuestModal()" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-ice-500 to-blue-600 text-white text-sm font-bold">KEEP GOING</button></div>`);
}

// Decorate the shop after each render: lock state, level progress, rarity.
(function () {
  const base = window.renderShop;
  window.renderShop = function () {
    base();
    document.querySelectorAll('#shop-items-grid button[onclick]').forEach(btn => {
      const m = /^(buy\w+)\('([^']+)'\)$/.exec(btn.getAttribute('onclick') || ''); if (!m || !GATED_BUYS[m[1]]) return;
      const cat = GATED_BUYS[m[1]], id = m[2], it = getShopItem(cat, id), req = getRequiredLevel(cat, id);
      const card = btn.closest('div[class*="rounded"]'), title = card && card.querySelector('h4, h3');
      if (title && it) title.insertAdjacentHTML('beforeend', ` <span class="text-[9px] tracking-wider text-slate-500 align-middle">${getItemRarity(it.price)}</span>`);
      if (!isLevelUnlocked(cat, id)) {
        btn.setAttribute('onclick', `showLockModal('${cat}','${id}')`);
        btn.className = 'w-full py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold border border-slate-700';
        btn.innerHTML = `🔒 LEVEL ${req} <span class="block text-[10px] font-normal">LEVEL ${gameState.level} / ${req} · ${it ? it.price : ''} 🪙</span>`;
      }
    });
  };
})();
