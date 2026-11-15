/* Share & boost modal */
    // -----------------------------------------------------------------------
    // 12. NAVIGATION, MODALS & NOTIFICATIONS
    // -----------------------------------------------------------------------
    function openShareBoostModal() {
      document.getElementById('invite-link-text').textContent = `${location.href.split(/[?#]/)[0]}?ref=${encodeURIComponent(gameState.player.name || 'athlete')}`;
      renderShareBoostUI();
      document.getElementById('share-boost-modal').classList.remove('hidden');
    }

    function closeShareBoostModal() {
      document.getElementById('share-boost-modal').classList.add('hidden');
    }

    // Copies the invite link (modern clipboard API, with a fallback for older browsers).
    async function copyInviteLink() {
      const linkText = document.getElementById('invite-link-text').textContent;
      try {
        await navigator.clipboard.writeText(linkText);
      } catch (e) {
        const tempInput = document.createElement('input');
        tempInput.value = linkText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      SoundFX.pop();
      return true;
    }

    // Opens the device's native share sheet (Messages, WhatsApp, Instagram, etc.).
    // Returns 'shared', 'copied' (no share sheet available) or 'cancelled'.
    async function shareInvite() {
      const url = document.getElementById('invite-link-text').textContent;
      if (navigator.share) {
        try {
          await navigator.share({ title: 'Winter Arc', text: "I'm locking in this winter with Winter Arc. Join me:", url });
          return 'shared';
        } catch (e) {
          if (e && e.name === 'AbortError') return 'cancelled'; // user closed the share box
        }
      }
      await copyInviteLink();
      return 'copied';
    }

    function renderShareBoostUI() {
      const count = gameState.shareFriendsCount || 0;
      document.getElementById('share-modal-progress').textContent = `${count} / 3`;

      const slotsGrid = document.getElementById('share-slots-grid');
      slotsGrid.innerHTML = [1, 2, 3].map(idx => {
        const done = count >= idx;
        return `
          <div class="p-3 rounded-2xl border text-center transition-all ${done ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300' : 'bg-obsidian-950 border-slate-800 text-slate-500'}">
            <i class="fa-solid ${done ? 'fa-circle-check text-emerald-400' : 'fa-user-clock'} text-lg mb-1"></i>
            <p class="text-[11px] font-bold">Friend ${idx}</p>
          </div>
        `;
      }).join('');

      const btn = document.getElementById('claim-share-reward-btn');
      if (gameState.shareRewardClaimed) {
        btn.disabled = true;
        btn.className = 'w-full py-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-sm flex items-center justify-center gap-2';
        btn.innerHTML = '<i class="fa-solid fa-check-double"></i> +' + XP_REWARDS.shareBoost + ' XP & +120 Coins Claimed!';
      } else if (count < 3) {
        btn.disabled = false;
        btn.className = 'w-full py-3.5 rounded-xl bg-gradient-to-r from-ice-500 to-blue-600 hover:from-ice-400 hover:to-blue-500 text-white font-extrabold text-sm shadow-lg transition-all flex items-center justify-center gap-2';
        btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Share Invite to Friend #${count + 1} (${count}/3)`;
      } else {
        btn.disabled = false;
        btn.className = 'w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-obsidian-950 font-extrabold text-sm shadow-lg animate-pulse transition-all flex items-center justify-center gap-2';
        btn.innerHTML = '<i class="fa-solid fa-gift"></i> Claim +' + XP_REWARDS.shareBoost + ' XP & +120 Coins!';
      }
    }

    let shareInFlight = false; // blocks double-taps while the share sheet is open

    async function claimShareBoostReward() {
      if (gameState.shareRewardClaimed || shareInFlight) return;

      if (gameState.shareFriendsCount < 3) {
        shareInFlight = true;
        let result;
        try {
          result = await shareInvite();
        } finally {
          shareInFlight = false;
        }

        // Do not count it if the user dismissed the native share sheet
        if (result === 'cancelled') {
          showToast('Share cancelled.', 'info');
          return;
        }
        gameState.shareFriendsCount = (gameState.shareFriendsCount || 0) + 1;
        SoundFX.pop();
        saveState();
        renderShareBoostUI();
        renderGameHub();

        const actionLabel = result === 'shared' ? 'Invite shared' : 'Invite link copied';
        showToast(`${actionLabel}! (${gameState.shareFriendsCount}/3)`, 'info');
      } else {
        gameState.shareRewardClaimed = true;
        closeShareBoostModal();
        interactWithAvatar();
        awardXPAndCoins(XP_REWARDS.shareBoost, COIN_REWARDS.shareBoost, { source: 'share-boost', txId: 'share-boost' });
        showToast('Starter Share Boost unlocked! Hit the Shop to upgrade your fit!', 'success');
      }
    }
