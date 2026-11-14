/* Navigation, settings modal & toasts */
    // -----------------------------------------------------------------------
    // 10. NAVIGATION, MODALS & NOTIFICATIONS
    // -----------------------------------------------------------------------
    function switchHubTab(tabName) {
      SoundFX.pop();
      ['checkin', 'shop', 'progress'].forEach(t => {
        document.getElementById(`hub-tab-${t}`).classList.toggle('hidden', t !== tabName);
        const btn = document.getElementById(`tab-btn-${t}`);
        if (t === tabName) {
          btn.className = 'py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 bg-ice-500 text-obsidian-950 shadow-md';
        } else {
          btn.className = 'py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 text-slate-300 hover:text-white';
        }
      });
    }

    function openSettingsModal() {
      const sigImg = document.getElementById('saved-signature-img');
      if (gameState.signatureDataUrl) {
        sigImg.src = gameState.signatureDataUrl;
      }
      document.getElementById('settings-modal').classList.remove('hidden');
    }

    function closeSettingsModal() {
      document.getElementById('settings-modal').classList.add('hidden');
    }

    let resetConfirmPending = false;
    function triggerResetConfirmation() {
      const btn = document.getElementById('reset-btn');
      if (!resetConfirmPending) {
        resetConfirmPending = true;
        btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation mr-1.5"></i> Tap Again to Confirm Full Reset';
        setTimeout(() => {
          resetConfirmPending = false;
          btn.innerHTML = '<i class="fa-solid fa-rotate-left mr-1.5"></i> Reset Winter Arc & Start Fresh';
        }, 4000);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    }

    function showToast(message, type = 'info') {
      const container = document.getElementById('toast-container');
      const toast = document.createElement('div');

      const colors = {
        success: 'bg-emerald-950/90 border-emerald-400/50 text-emerald-200',
        warning: 'bg-amber-950/90 border-amber-400/50 text-amber-200',
        info: 'bg-obsidian-900/95 border-ice-400/50 text-ice-200'
      };

      toast.className = `px-4 py-3 rounded-2xl border backdrop-blur-md shadow-xl text-xs font-semibold transition-all duration-300 transform translate-x-0 ${colors[type] || colors.info}`;
      toast.textContent = message;
      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

