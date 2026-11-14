/* Shop: outfits, furniture, wall paint & flooring */
    // -----------------------------------------------------------------------
    // 9. THE WINTER ARC SHOP (OUTFITS w/ PANTS, FURNITURE & WALL PAINT)
    // -----------------------------------------------------------------------
    function setShopCategory(cat) {
      currentShopCategory = cat;
      SoundFX.pop();

      ['outfits', 'room', 'walls', 'floors'].forEach(c => {
        const btn = document.getElementById(`shop-cat-${c}`);
        if (btn) {
          btn.className = c === cat
            ? 'px-2.5 py-1 rounded-lg text-xs font-bold bg-ice-500/20 text-ice-300'
            : 'px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 hover:text-white';
        }
      });

      renderShop();
    }

    function renderShop() {
      const grid = document.getElementById('shop-items-grid');

      if (currentShopCategory === 'outfits') {
        grid.innerHTML = SHOP_OUTFITS.map(item => {
          const owned = gameState.unlockedOutfits.includes(item.id);
          const equipped = gameState.equippedOutfit === item.id;

          let btnHTML = '';
          if (equipped) {
            btnHTML = `<button disabled class="w-full py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">Equipped ✓</button>`;
          } else if (owned) {
            btnHTML = `<button onclick="equipOutfit('${item.id}')" class="w-full py-2 rounded-xl bg-ice-500/20 hover:bg-ice-500/30 border border-ice-400/40 text-ice-200 text-xs font-bold transition-all">Equip Fit</button>`;
          } else {
            btnHTML = `<button onclick="buyOutfit('${item.id}')" class="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-obsidian-950 text-xs font-extrabold transition-all flex items-center justify-center gap-1">
              <i class="fa-solid fa-coins"></i> ${item.price}
            </button>`;
          }

          return `
            <div class="frost-card rounded-2xl p-3.5 flex flex-col justify-between gap-2.5">
              <div>
                <div class="h-24 w-full rounded-xl bg-obsidian-950/90 border border-slate-800/90 p-1.5 mb-2.5 relative flex items-center justify-center">
                  ${getOutfitPreviewSVG(item.id)}
                  <span class="absolute top-1.5 right-1.5 px-2 py-0.5 rounded bg-slate-800/90 text-[9px] font-bold text-slate-300">${item.badge}</span>
                </div>
                <h4 class="font-display font-bold text-sm text-white">${item.name}</h4>
                <p class="text-[11px] text-slate-400 mt-0.5 leading-snug">${item.desc}</p>
              </div>
              ${btnHTML}
            </div>
          `;
        }).join('');
      } else if (currentShopCategory === 'room') {
        grid.innerHTML = SHOP_ROOM_ITEMS.map(item => {
          const owned = gameState.unlockedRoomItems.includes(item.id);

          const btnHTML = owned
            ? `<button disabled class="w-full py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">Placed in Room ✓</button>`
            : `<button onclick="buyRoomItem('${item.id}')" class="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-obsidian-950 text-xs font-extrabold transition-all flex items-center justify-center gap-1">
                <i class="fa-solid fa-coins"></i> ${item.price}
              </button>`;

          return `
            <div class="frost-card rounded-2xl p-3.5 flex flex-col justify-between gap-2.5">
              <div>
                <div class="h-20 w-full rounded-xl bg-obsidian-950/90 border border-slate-800/90 p-1.5 mb-2.5 flex items-center justify-center">
                  ${getRoomItemPreviewSVG(item.id)}
                </div>
                <h4 class="font-display font-bold text-sm text-white">${item.name}</h4>
                <p class="text-[11px] text-slate-400 mt-0.5 leading-snug">${item.desc}</p>
              </div>
              ${btnHTML}
            </div>
          `;
        }).join('');
      } else {
        // Wall Paint Colors Category
        grid.innerHTML = (currentShopCategory === 'floors' ? SHOP_FLOOR_COLORS : SHOP_WALL_COLORS).map(wall => {
          const isFloor = currentShopCategory === 'floors';
          const owned = (isFloor ? gameState.unlockedFloorColors : gameState.unlockedWallColors).includes(wall.id);
          const equipped = (isFloor ? gameState.equippedFloorColor : gameState.equippedWallColor) === wall.id;

          let btnHTML = '';
          if (equipped) {
            btnHTML = `<button disabled class="w-full py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">Active Wall ✓</button>`;
          } else if (owned) {
            btnHTML = `<button onclick="${isFloor ? 'equipFloorColor' : 'equipWallColor'}('${wall.id}')" class="w-full py-2 rounded-xl bg-ice-500/20 hover:bg-ice-500/30 border border-ice-400/40 text-ice-200 text-xs font-bold transition-all">Apply Paint</button>`;
          } else {
            btnHTML = `<button onclick="${isFloor ? 'buyFloorColor' : 'buyWallColor'}('${wall.id}')" class="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-obsidian-950 text-xs font-extrabold transition-all flex items-center justify-center gap-1">
              <i class="fa-solid fa-coins"></i> ${wall.price}
            </button>`;
          }

          return `
            <div class="frost-card rounded-2xl p-3.5 flex flex-col justify-between gap-2.5">
              <div>
                <div class="h-16 w-full rounded-xl border border-slate-700 mb-2.5 shadow-inner" style="background: linear-gradient(180deg, ${wall.top} 0%, ${wall.bottom} 100%);"></div>
                <h4 class="font-display font-bold text-sm text-white">${wall.name}</h4>
                <p class="text-[11px] text-slate-400 mt-0.5 leading-snug">${wall.desc}</p>
              </div>
              ${btnHTML}
            </div>
          `;
        }).join('');
      }
    }

    function buyWallColor(wallId) {
      const wall = SHOP_WALL_COLORS.find(w => w.id === wallId);
      if (!wall) return;
      if (gameState.coins < wall.price) {
        SoundFX.error();
        showToast(`Need ${wall.price - gameState.coins} more Winter Coins!`, 'warning');
        return;
      }
      gameState.coins -= wall.price;
      gameState.unlockedWallColors.push(wall.id);
      gameState.equippedWallColor = wall.id;
      SoundFX.levelUp();
      saveState();
      renderGameHub();
      triggerAvatarSpeech(`Painted the room ${wall.name}! Fresh vibe! 🎨`);
      showToast(`Unlocked & painted ${wall.name}!`, 'success');
    }

    function buyFloorColor(id) {
      const f = SHOP_FLOOR_COLORS.find(x => x.id === id);
      if (!f) return;
      if (gameState.coins < f.price) { SoundFX.error(); showToast(`Need ${f.price - gameState.coins} more Winter Coins!`, 'warning'); return; }
      gameState.coins -= f.price;
      gameState.unlockedFloorColors.push(f.id);
      gameState.equippedFloorColor = f.id;
      SoundFX.levelUp(); saveState(); renderGameHub();
      triggerAvatarSpeech(`New floor: ${f.name}! Fresh vibe! ✨`);
      showToast(`Unlocked & installed ${f.name}!`, 'success');
    }

    function equipFloorColor(id) {
      gameState.equippedFloorColor = id;
      SoundFX.pop(); saveState(); renderGameHub();
    }

    // Avatar interaction spots (click furniture -> avatar walks there; click again to leave)
    const AVATAR_SPOTS = {
      idle:      { x: 400, feet: 492, s: 0.8 },
      couch:     { x: 400, feet: 464, s: 0.8, clip: 436, front: true, speech: 'Ahh, this couch is so comfy 🛋️' },
      desk:      { x: 170, feet: 423, s: 0.8, clip: 372, front: true, type: true, speech: 'Deep work mode. Typing away ⌨️🔥' },
      window:    { x: 312, feet: 440, s: 0.8, look: true, speech: 'Wow, what a beautiful day outside! ❄️✨' },
      bookshelf: { x: 690, feet: 452, s: 0.8, book: true, speech: 'Reading something that levels me up 📚' }
    };
    let avatarSpot = 'idle', avatarPos = { x: 400, feet: 492 }, avatarMoveTimer = null;

    function avatarClicked() {
      if (avatarSpot !== 'idle') goToSpot('idle'); else interactWithAvatar();
    }

    function goToSpot(name) {
      if (avatarSpot === name) name = 'idle';
      const sp = AVATAR_SPOTS[name];
      const svg = document.getElementById('living-room-svg');
      const clip = document.getElementById('avatar-clip');
      const mover = document.getElementById('avatar-mover');
      const pose = document.getElementById('avatar-pose');
      const grp = document.getElementById('room-avatar-group');
      const hide = (id, h) => document.getElementById(id).classList.toggle('hidden', h);

      clearTimeout(avatarMoveTimer);
      // Leave previous pose: avatar back on top, clear props
      clip.removeAttribute('clip-path');
      svg.appendChild(clip);
      pose.classList.remove('pose-type', 'pose-look');
      ['pose-hands', 'held-book', 'chair-back', 'chair-front'].forEach(id => hide(id, true));

      const dist = Math.hypot(sp.x - avatarPos.x, sp.feet - avatarPos.feet);
      const dur = Math.max(0.5, Math.min(1.6, dist / 260));
      mover.style.transitionDuration = dur + 's';
      mover.style.transform = `translate(${sp.x - 90 * sp.s}px, ${sp.feet - 266 * sp.s}px) scale(${sp.s})`;
      const shadow = document.getElementById('avatar-shadow');
      shadow.setAttribute('cx', sp.x); shadow.setAttribute('cy', sp.feet);
      shadow.style.opacity = sp.front ? 0 : 1;
      avatarPos = { x: sp.x, feet: sp.feet };
      avatarSpot = name;

      if (name !== 'idle') SoundFX.pop();
      grp.classList.remove('avatar-breathe', 'avatar-celebrate');
      grp.classList.add('avatar-walk');

      avatarMoveTimer = setTimeout(() => {
        grp.classList.remove('avatar-walk');
        grp.classList.add('avatar-breathe');
        if (sp.front) {
          document.getElementById('sit-clip-rect').setAttribute('height', sp.clip);
          clip.setAttribute('clip-path', 'url(#sitClip)');
          svg.appendChild(document.getElementById('front-layers'));
        }
        if (sp.type) { hide('chair-back', false); hide('chair-front', false); hide('pose-hands', false); pose.classList.add('pose-type'); }
        if (sp.book) { hide('pose-hands', false); hide('held-book', false); }
        if (sp.look) pose.classList.add('pose-look');
        if (sp.speech) triggerAvatarSpeech(sp.speech);
      }, dur * 1000);
    }

    function equipWallColor(wallId) {
      gameState.equippedWallColor = wallId;
      SoundFX.pop();
      saveState();
      renderGameHub();
    }
