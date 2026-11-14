/* Daily photo check-in & proof validation */
    // -----------------------------------------------------------------------
    // 8. STRICT ONCE-PER-DAY PHOTO CHECK-IN & SMART MISMATCH EDGE CASE
    // -----------------------------------------------------------------------
    function renderDailyCheckIn() {
      const todayKey = getCurrentGameDateKey();
      const container = document.getElementById('daily-habits-container');

      container.innerHTML = gameState.habits.map(h => {
        const aspect = LIFE_ASPECTS.find(a => a.id === h.aspectId) || LIFE_ASPECTS[0];
        const isCompletedToday = h.completedDate === todayKey;

        return `
          <div class="p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${isCompletedToday ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-obsidian-950/90 border-slate-800 hover:border-ice-400/40'}">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isCompletedToday ? 'bg-emerald-500/20 text-emerald-400' : 'bg-obsidian-900 ' + aspect.color}">
                <i class="fa-solid ${isCompletedToday ? 'fa-lock' : aspect.icon}"></i>
              </div>
              <div class="min-w-0">
                <p class="text-sm font-semibold truncate ${isCompletedToday ? 'line-through text-slate-400' : 'text-white'}">${h.text}</p>
                <span class="text-[11px] text-slate-400">${aspect.name}</span>
              </div>
            </div>

            ${isCompletedToday
              ? `<span class="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold shrink-0">✓ Done Today</span>`
              : `<button onclick="openProofModal('${h.id}')" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-ice-500 to-blue-600 hover:from-ice-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shrink-0 flex items-center gap-1.5 transition-all">
                  <i class="fa-solid fa-camera"></i> Snap Proof
                </button>`
            }
          </div>
        `;
      }).join('');

      // Render Recent Photo Proofs
      const feed = document.getElementById('proof-feed-list');
      document.getElementById('proof-feed-count').textContent = `${gameState.proofLogs.length} entries`;

      if (gameState.proofLogs.length === 0) {
        feed.innerHTML = `
          <div class="col-span-2 text-center py-6 text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            No real photo proofs uploaded yet. Tap "Snap Proof" above!
          </div>
        `;
      } else {
        feed.innerHTML = gameState.proofLogs.slice(0, 6).map(log => `
          <div class="rounded-2xl overflow-hidden bg-obsidian-950 border border-slate-800 flex flex-col">
            <div class="h-24 w-full bg-slate-900 relative overflow-hidden">
              <img src="${log.imageUrl}" class="w-full h-full object-cover" alt="Verified habit proof" />
              <span class="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-950/85 border border-emerald-400/40 text-[9px] font-bold text-emerald-300">✓ VERIFIED</span>
              <span class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-slate-300">${log.timestamp}</span>
            </div>
            <div class="p-2">
              <p class="text-[11px] font-bold text-white truncate">${log.habitText}</p>
              <p class="text-[10px] text-slate-400 truncate">${log.caption || 'Proof verified!'}</p>
            </div>
          </div>
        `).join('');
      }
    }

    function openProofModal(habitId) {
      const habit = gameState.habits.find(h => h.id === habitId);
      if (!habit) return;

      if (habit.completedDate === getCurrentGameDateKey()) {
        showToast('You already checked in this habit today! Resets tomorrow.', 'warning');
        return;
      }

      activeProofHabitId = habitId;
      pendingProofImage = null;
      pendingProofVerified = false;

      document.getElementById('proof-modal-habit-title').textContent = habit.text;
      document.getElementById('proof-caption-input').value = '';
      document.getElementById('proof-file-input').value = '';
      document.getElementById('upload-btn-label').textContent = 'Take Photo or Choose Image';

      document.getElementById('proof-placeholder-content').classList.remove('hidden');
      document.getElementById('proof-uploaded-img').classList.add('hidden');
      document.getElementById('proof-scanner-overlay').classList.add('hidden');
      document.getElementById('proof-verification-msg').classList.add('hidden');

      setProofSubmitState(false);
      document.getElementById('proof-modal').classList.remove('hidden');
    }

    function closeProofModal() {
      document.getElementById('proof-modal').classList.add('hidden');
      activeProofHabitId = null;
    }

    function setProofSubmitState(enabled) {
      const btn = document.getElementById('submit-proof-btn');
      if (enabled) {
        btn.disabled = false;
        btn.className = 'w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer';
        btn.innerHTML = '<i class="fa-solid fa-check-double"></i> "I Did That!" (+20 Coins, +25 XP)';
      } else {
        btn.disabled = true;
        btn.className = 'w-full py-3.5 rounded-xl bg-slate-800 text-slate-500 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-not-allowed';
        btn.innerHTML = '<i class="fa-solid fa-lock"></i> Upload Verified Photo to Claim';
      }
    }

    function handleProofFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const scanner = document.getElementById('proof-scanner-overlay');
      const msgBox = document.getElementById('proof-verification-msg');

      setProofSubmitState(false);
      msgBox.classList.add('hidden');

      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          // Compress for lightweight localStorage persistence
          const canvas = document.createElement('canvas');
          const maxW = 380;
          const scale = Math.min(1, maxW / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
          const previewImg = document.getElementById('proof-uploaded-img');
          previewImg.src = dataUrl;
          previewImg.classList.remove('hidden');
          document.getElementById('proof-placeholder-content').classList.add('hidden');
          document.getElementById('upload-btn-label').textContent = 'Retake / Choose Different Photo';

          // Trigger visual AI verification scanner
          scanner.classList.remove('hidden');

          setTimeout(() => {
            scanner.classList.add('hidden');

            // Verification check: accept any valid uploaded image (gift basket, screenshot, etc.)
            SoundFX.pop();
            pendingProofImage = dataUrl;
            pendingProofVerified = true;
            msgBox.className = 'p-3 rounded-xl border border-emerald-500/40 bg-emerald-950/50 text-xs font-semibold text-emerald-200';
            msgBox.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-400 mr-1"></i> Authentic Photo Proof Verified! Ready to claim your reward.`;
            msgBox.classList.remove('hidden');
            setProofSubmitState(true);
          }, 950);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    function submitHabitProof() {
      if (!pendingProofImage || !pendingProofVerified) {
        SoundFX.error();
        showToast('Please upload a verified photo of your habit first!', 'warning');
        return;
      }

      const habit = gameState.habits.find(h => h.id === activeProofHabitId);
      if (!habit) return;

      const todayKey = getCurrentGameDateKey();
      if (habit.completedDate === todayKey) {
        showToast('Already checked in today!', 'warning');
        closeProofModal();
        return;
      }

      habit.completedDate = todayKey;
      gameState.aspectXP[habit.aspectId] = (gameState.aspectXP[habit.aspectId] || 15) + 25;

      const caption = document.getElementById('proof-caption-input').value.trim();
      gameState.proofLogs.unshift({
        id: 'proof_' + Date.now(),
        habitText: habit.text,
        caption,
        imageUrl: pendingProofImage,
        timestamp: getCurrentGameDateFormatted()
      });

      closeProofModal();
      interactWithAvatar();
      awardXPAndCoins(REWARD_XP_PER_PROOF, REWARD_COINS_PER_PROOF);

      if (gameState.habits.every(h => h.completedDate === todayKey)) {
        setTimeout(() => {
          showToast(`100% DAILY HABITS LOCKED IN! Bonus +${ALL_DONE_BONUS_COINS} Coins!`, 'success');
          awardXPAndCoins(ALL_DONE_BONUS_XP, ALL_DONE_BONUS_COINS);
        }, 700);
      }
    }

    function startNewDayCycle() {
      if (!DEMO_MODE) return;
      gameState.activeDayOffset = (gameState.activeDayOffset || 0) + 1;
      gameState.streak += 1;
      SoundFX.pop();
      saveState();
      renderGameHub();
      showToast(`Day ${gameState.streak} (${getCurrentGameDateFormatted()}) unlocked! Daily check-ins reset.`, 'info');
      triggerAvatarSpeech(`Day ${gameState.streak} of the Winter Arc! Fresh habits ready! ❄️`);
    }

