/* Game hub rendering, room & avatar interactions */
    // -----------------------------------------------------------------------
    // 7. MAIN GAME HUB RENDERING & INTERACTIVITY
    // -----------------------------------------------------------------------
    function renderGameHub() {
      // Top HUD
      document.getElementById('hud-level-badge').textContent = gameState.level;
      document.getElementById('hud-player-name').textContent = gameState.player.name;
      const rankIdx = Math.min(gameState.level - 1, RANK_TITLES.length - 1);
      document.getElementById('hud-rank-title').textContent = RANK_TITLES[rankIdx];

      const prog = getLevelProgress(gameState.totalXP);
      document.getElementById('hud-xp-bar').style.width = `${prog.percent}%`;
      document.getElementById('hud-xp-text').textContent = prog.isMax
        ? 'MAX LEVEL'
        : `${prog.xpIntoLevel.toLocaleString()} / ${prog.xpForLevel.toLocaleString()} XP`;
      document.getElementById('hud-xp-text').title = prog.isMax ? '' : `${prog.xpToNext.toLocaleString()} XP to Level ${prog.level + 1}`;

      document.getElementById('hud-streak').textContent = `${gameState.streak}d`;
      document.getElementById('hud-coins').textContent = gameState.coins;

      // Update Share Boost HUD pill
      const shareCountEl = document.getElementById('hud-share-count');
      if (gameState.shareRewardClaimed) {
        shareCountEl.textContent = '✓';
        shareCountEl.className = 'px-1.5 py-0.2 rounded bg-emerald-500/20 text-[10px] font-bold text-emerald-300';
      } else {
        shareCountEl.textContent = `${gameState.shareFriendsCount}/3`;
      }

      // Target Goal & Baseline Banner
      document.getElementById('hub-target-goal').textContent = gameState.targetGoal;
      document.getElementById('hub-stat-height').textContent = gameState.player.heightDisplay;
      document.getElementById('hub-stat-weight').textContent = `${gameState.player.currentWeight} ${gameState.player.weightUnit}`;

      // Room & Avatar Stage
      renderRoomAndAvatar();

      // Daily Habits Checklist & Proof Feed
      renderDailyCheckIn();

      // Shop Items
      renderShop();

      // Progress Tab
      renderProgressTab();
    }

    function renderRoomAndAvatar() {
      const avatarContainer = document.getElementById('room-avatar-group');
      avatarContainer.innerHTML = buildAvatarSVG(
        gameState.player.skinTone,
        gameState.player.hairStyle,
        gameState.player.hairColor,
        gameState.equippedOutfit
      );

      // Apply Dynamic Wall Paint Color
      const wallObj = SHOP_WALL_COLORS.find(w => w.id === gameState.equippedWallColor) || SHOP_WALL_COLORS[0];
      document.getElementById('wall-grad-top').setAttribute('stop-color', wallObj.top);
      document.getElementById('wall-grad-bottom').setAttribute('stop-color', wallObj.bottom);
      document.getElementById('wall-baseboard').setAttribute('fill', wallObj.baseboard);

      // Apply Dynamic Floor Color
      const fl = SHOP_FLOOR_COLORS.find(f => f.id === gameState.equippedFloorColor) || SHOP_FLOOR_COLORS[0];
      document.getElementById('floor-grad-top').setAttribute('stop-color', fl.top);
      document.getElementById('floor-grad-bottom').setAttribute('stop-color', fl.bottom);
      document.querySelectorAll('.floor-line').forEach(l => l.setAttribute('stroke', fl.line));
      const skinObj = SKIN_TONES.find(x => x.id === gameState.player.skinTone) || SKIN_TONES[1];
      document.getElementById('pose-hands').style.color = skinObj.hex;

      // Toggle Room Decor Upgrades
      const allDecorIds = ['rug', 'plant', 'painting', 'couch', 'neon', 'bookshelf', 'window', 'desk', 'fireplace', 'fairylights', 'aquarium'];
      allDecorIds.forEach(id => {
        const el = document.getElementById(`decor-${id}`);
        if (el) {
          el.classList.toggle('hidden', !gameState.unlockedRoomItems.includes(id));
        }
      });

      document.getElementById('decor-couch-front').classList.toggle('hidden', !gameState.unlockedRoomItems.includes('couch'));
      document.getElementById('decor-desk-front').classList.toggle('hidden', !gameState.unlockedRoomItems.includes('desk'));

      const count = gameState.unlockedRoomItems.length;
      const total = SHOP_ROOM_ITEMS.length;
      const label = document.getElementById('room-status-label');
      if (count === 0) label.textContent = `Starter Bare Room (0/${total} Upgrades)`;
      else if (count < 5) label.textContent = `Cozy Starter Loft (${count}/${total} Upgrades)`;
      else if (count < total) label.textContent = `Locked-In Sanctuary (${count}/${total} Upgrades)`;
      else label.textContent = 'MAXED Winter Arc Penthouse 👑';
    }

    function interactWithAvatar() {
      SoundFX.pop();
      const avatarEl = document.getElementById('room-avatar-group');
      avatarEl.classList.remove('avatar-celebrate');
      void avatarEl.offsetWidth; // trigger reflow
      avatarEl.classList.add('avatar-celebrate');

      const randomQuote = AVATAR_QUOTES[Math.floor(Math.random() * AVATAR_QUOTES.length)];
      triggerAvatarSpeech(randomQuote);
    }

    let speechTimeout = null;
    function triggerAvatarSpeech(text) {
      const bubble = document.getElementById('avatar-speech-bubble');
      bubble.textContent = text;
      bubble.classList.remove('opacity-0', 'scale-90');
      bubble.classList.add('opacity-100', 'scale-100');

      clearTimeout(speechTimeout);
      speechTimeout = setTimeout(() => {
        bubble.classList.add('opacity-0', 'scale-90');
        bubble.classList.remove('opacity-100', 'scale-100');
      }, 3200);
    }

    function spawnFloatingReward(text) {
      const container = document.getElementById('room-floating-rewards');
      const badge = document.createElement('div');
      badge.className = 'floating-reward px-4 py-1.5 rounded-full bg-yellow-400 text-obsidian-950 font-display font-extrabold text-sm shadow-xl border-2 border-white';
      badge.textContent = text;
      container.appendChild(badge);
      setTimeout(() => badge.remove(), 1250);
    }

    // The one place XP and coins are granted.
    // opts.source: where it came from (quest, daily-bonus, ...). opts.txId: unique id that makes
    // the reward claimable only once (double-clicks, refreshes, re-submits all become no-ops).
    function awardXPAndCoins(xpAmount, coinAmount, opts = {}) {
      const xp = sanitizeXP(xpAmount);
      const coins = Math.max(0, Math.floor(Number(coinAmount)) || 0);
      const { source = 'misc', txId = null } = opts;
      if (txId && gameState.rewardLog.some(r => r.txId === txId)) return false;

      const levelBefore = gameState.level;
      gameState.totalXP += xp;
      gameState.coins += coins;
      syncDerivedProgress(gameState);
      gameState.rewardLog.push({
        id: 'rw_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        txId, source, dateKey: getCurrentGameDateKey(), ts: Date.now(), xp, coins
      });

      const leveledUp = gameState.level > levelBefore; // handles multi-level jumps

      if (opts.silent) {
        if (!leveledUp) SoundFX.coin(); // the celebration card handles all other feedback
      } else if (leveledUp) {
        SoundFX.levelUp();
        const jump = gameState.level - levelBefore > 1 ? `Level ${levelBefore} → ${gameState.level}` : `Level ${gameState.level}`;
        showToast(`LEVEL UP! You reached ${jump}!`, 'success');
        triggerAvatarSpeech(`LEVEL ${gameState.level} UNLOCKED! Unstoppable! 🚀`);
      } else {
        SoundFX.coin();
      }

      if (!opts.silent) spawnFloatingReward(`+${coins} Coins • +${xp} XP`);
      saveState();
      renderGameHub();
      return true;
    }
