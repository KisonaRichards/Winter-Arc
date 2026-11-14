/* Weekly progress tracker & mood log */
    // -----------------------------------------------------------------------
    // 10. WEEKLY-GATED PROGRESS & ASPECT-TAILORED TRACKER
    // -----------------------------------------------------------------------
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

    function getDaysUntilNextWeeklyLog() {
      if (!gameState.lastWeeklyLogTimestamp) return 0;
      const elapsed = Date.now() - gameState.lastWeeklyLogTimestamp;
      if (elapsed >= SEVEN_DAYS_MS) return 0;
      return Math.ceil((SEVEN_DAYS_MS - elapsed) / (24 * 60 * 60 * 1000));
    }

    function demoFastForwardWeek() {
      gameState.lastWeeklyLogTimestamp = Date.now() - SEVEN_DAYS_MS - 1000;
      SoundFX.pop();
      saveState();
      renderProgressTab();
      showToast('7 days fast-forwarded! Weekly Transformation Log is now unlocked.', 'info');
    }

    function renderProgressTab() {
      const daysRemaining = getDaysUntilNextWeeklyLog();
      const isLocked = daysRemaining > 0;

      const lockBanner = document.getElementById('weekly-lock-banner');
      const submitBtn = document.getElementById('weekly-submit-btn');

      if (isLocked) {
        lockBanner.classList.remove('hidden');
        document.getElementById('weekly-lock-subtext').textContent = `Log updated! Next check-in available in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}.`;
        submitBtn.disabled = true;
        submitBtn.className = 'w-full py-2.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed';
        submitBtn.textContent = `Locked (${daysRemaining}d Remaining)`;
      } else {
        lockBanner.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.className = 'w-full py-2.5 rounded-xl bg-gradient-to-r from-ice-500 to-blue-600 hover:from-ice-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer';
        submitBtn.textContent = '+ Log Weekly Progress (+50 XP & +30 Coins)';
      }

      // Dynamically render inputs tailored to the user's chosen aspects & units
      const fieldsContainer = document.getElementById('dynamic-metric-fields');
      let fieldsHTML = `
        <div>
          <label class="block text-[11px] font-semibold text-slate-400 mb-1">Current Weight (${gameState.player.weightUnit})</label>
          <input id="track-weight-input" type="number" step="0.1" ${isLocked ? 'disabled' : ''} placeholder="${gameState.player.currentWeight}" class="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-white focus:border-ice-400 focus:outline-none disabled:opacity-50" />
        </div>
      `;

      if (gameState.aspects.includes('finances') || gameState.aspects.includes('career')) {
        fieldsHTML += `
          <div>
            <label class="block text-[11px] font-semibold text-slate-400 mb-1">Total Saved / Hustle ($)</label>
            <input id="track-savings-input" type="number" step="1" ${isLocked ? 'disabled' : ''} placeholder="${gameState.player.savings || 500}" class="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-white focus:border-ice-400 focus:outline-none disabled:opacity-50" />
          </div>
        `;
      }

      if (gameState.aspects.includes('skincare')) {
        fieldsHTML += `
          <div>
            <label class="block text-[11px] font-semibold text-slate-400 mb-1">Skin Clarity Score (1-10)</label>
            <input id="track-skin-input" type="number" min="1" max="10" ${isLocked ? 'disabled' : ''} placeholder="8" class="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-white focus:border-ice-400 focus:outline-none disabled:opacity-50" />
          </div>
        `;
      }

      if (gameState.aspects.includes('focus') || gameState.aspects.includes('reading')) {
        fieldsHTML += `
          <div>
            <label class="block text-[11px] font-semibold text-slate-400 mb-1">Deep Work / Pages This Week</label>
            <input id="track-study-input" type="number" ${isLocked ? 'disabled' : ''} placeholder="14" class="w-full px-3 py-2 rounded-xl bg-obsidian-900 border border-slate-700 text-xs text-white focus:border-ice-400 focus:outline-none disabled:opacity-50" />
          </div>
        `;
      }

      fieldsContainer.innerHTML = fieldsHTML;

      // Active Aspects Mastery Bars
      const barsContainer = document.getElementById('aspect-progress-bars');
      barsContainer.innerHTML = gameState.aspects.map(aspectId => {
        const aspect = LIFE_ASPECTS.find(a => a.id === aspectId) || LIFE_ASPECTS[0];
        const xp = gameState.aspectXP[aspectId] || 15;
        const pct = Math.min(100, xp);
        return `
          <div class="bg-obsidian-950/70 p-2.5 rounded-xl border border-slate-800/80">
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-semibold text-slate-200 flex items-center gap-1.5">
                <i class="fa-solid ${aspect.icon} ${aspect.color}"></i> ${aspect.name}
              </span>
              <span class="font-mono text-ice-300 font-bold">${pct}%</span>
            </div>
            <div class="w-full h-1.5 bg-obsidian-900 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-ice-400 to-blue-500 transition-all duration-500" style="width: ${pct}%"></div>
            </div>
          </div>
        `;
      }).join('');

      // History Log
      const historyContainer = document.getElementById('metric-history-list');
      historyContainer.innerHTML = gameState.metricHistory.map(entry => `
        <div class="p-2.5 rounded-xl bg-obsidian-950/70 border border-slate-800 flex items-center justify-between gap-2">
          <div>
            <span class="font-bold text-white">${entry.summary}</span>
            <p class="text-[11px] text-slate-400 mt-0.5">${entry.note}</p>
          </div>
          <span class="text-[10px] font-mono text-slate-500 shrink-0">${entry.date}</span>
        </div>
      `).join('');

      renderMoodTracker();
    }

    function selectDailyMood(label, emoji) {
      selectedMoodOption = { label, emoji };
      SoundFX.pop();
      renderMoodTracker();
    }

    function saveDailyMoodEntry() {
      const lineInput = document.getElementById('daily-mood-line');
      const note = lineInput.value.trim();
      if (!note) {
        SoundFX.error();
        showToast('Write a quick one-liner about your day first!', 'warning');
        return;
      }
      if (!gameState.moodLogs) gameState.moodLogs = [];
      gameState.moodLogs.unshift({
        date: getCurrentGameDateFormatted(),
        mood: selectedMoodOption.label,
        emoji: selectedMoodOption.emoji,
        note
      });
      lineInput.value = '';
      saveState();
      renderMoodTracker();
      awardXPAndCoins(10, 10);
      showToast('Daily mood & reflection saved! +10 Coins', 'success');
    }

    function renderMoodTracker() {
      document.querySelectorAll('.mood-btn').forEach(btn => {
        const isSelected = btn.getAttribute('data-mood') === selectedMoodOption.label;
        btn.className = isSelected
          ? 'mood-btn py-2 rounded-xl bg-ice-500/20 border border-ice-400 text-center transition-all shadow-sm'
          : 'mood-btn py-2 rounded-xl bg-obsidian-900 border border-slate-800 hover:border-ice-400/50 text-center transition-all';
      });

      const listEl = document.getElementById('daily-mood-history');
      if (!listEl) return;
      const logs = gameState.moodLogs || [];
      if (logs.length === 0) {
        listEl.innerHTML = `<p class="text-[11px] text-slate-500 italic">No daily mood entries yet. Log your pulse above!</p>`;
      } else {
        listEl.innerHTML = logs.slice(0, 5).map(m => `
          <div class="px-2.5 py-2 rounded-xl bg-obsidian-900/90 border border-slate-800/80 flex items-center justify-between gap-2 text-[11px]">
            <div class="min-w-0">
              <span class="font-bold text-ice-300">${m.emoji} ${m.mood}:</span>
              <span class="text-slate-300 ml-1">${m.note}</span>
            </div>
            <span class="text-[10px] font-mono text-slate-500 shrink-0">${m.date}</span>
          </div>
        `).join('');
      }
    }

    function logMetricUpdate(e) {
      e.preventDefault();
      const daysRemaining = getDaysUntilNextWeeklyLog();
      if (daysRemaining > 0) {
        SoundFX.error();
        showToast(`Weekly log is locked for ${daysRemaining} more day(s)!`, 'warning');
        return;
      }

      const wtEl = document.getElementById('track-weight-input');
      const savEl = document.getElementById('track-savings-input');
      const skinEl = document.getElementById('track-skin-input');
      const studyEl = document.getElementById('track-study-input');
      const noteVal = document.getElementById('track-note-input').value.trim();

      let summaryParts = [];

      if (wtEl && wtEl.value) {
        const wtVal = parseFloat(wtEl.value);
        if (!isNaN(wtVal) && wtVal > 0) {
          gameState.player.currentWeight = wtVal;
        }
      }
      summaryParts.push(`${gameState.player.currentWeight} ${gameState.player.weightUnit}`);

      if (savEl && savEl.value) {
        const savVal = parseFloat(savEl.value);
        if (!isNaN(savVal) && savVal >= 0) {
          gameState.player.savings = savVal;
          summaryParts.push(`$${savVal} saved`);
        }
      }

      if (skinEl && skinEl.value) {
        summaryParts.push(`Skin ${skinEl.value}/10`);
      }

      if (studyEl && studyEl.value) {
        summaryParts.push(`${studyEl.value} hrs/pgs`);
      }

      gameState.lastWeeklyLogTimestamp = Date.now();
      gameState.metricHistory.unshift({
        date: getCurrentGameDateFormatted(),
        summary: summaryParts.join(' • '),
        note: noteVal || 'Weekly Winter Arc milestone logged.'
      });

      document.getElementById('track-note-input').value = '';
      awardXPAndCoins(50, 30);
      showToast('Weekly log recorded! Next check-in unlocks in 7 days.', 'success');
    }

    function buyOutfit(outfitId) {
      const item = SHOP_OUTFITS.find(o => o.id === outfitId);
      if (!item) return;
      if (gameState.coins < item.price) {
        showToast(`Need ${item.price - gameState.coins} more Winter Coins!`, 'warning');
        return;
      }

      gameState.coins -= item.price;
      gameState.unlockedOutfits.push(item.id);
      gameState.equippedOutfit = item.id;

      SoundFX.levelUp();
      saveState();
      renderGameHub();
      interactWithAvatar();
      triggerAvatarSpeech(`Equipped ${item.name}! Looking sharp! 🔥`);
      showToast(`Unlocked & equipped ${item.name}!`, 'success');
    }

    function equipOutfit(outfitId) {
      gameState.equippedOutfit = outfitId;
      SoundFX.pop();
      saveState();
      renderGameHub();
      interactWithAvatar();
    }

    function buyRoomItem(itemId) {
      const item = SHOP_ROOM_ITEMS.find(r => r.id === itemId);
      if (!item) return;
      if (gameState.coins < item.price) {
        showToast(`Need ${item.price - gameState.coins} more Winter Coins!`, 'warning');
        return;
      }

      gameState.coins -= item.price;
      gameState.unlockedRoomItems.push(item.id);

      SoundFX.levelUp();
      saveState();
      renderGameHub();
      interactWithAvatar();
      triggerAvatarSpeech(`Added ${item.name} to the room! Huge upgrade! 🏠`);
      showToast(`Placed ${item.name} in your living room!`, 'success');
    }

    function demoBoostCoins() {
      gameState.coins += 500;
      SoundFX.coin();
      saveState();
      renderGameHub();
      spawnFloatingReward('+500 DEMO COINS');
      showToast('Demo Boost: +500 Winter Coins added! Check out the Shop.', 'success');
    }

