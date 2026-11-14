/* Bootstrap on window load */
    // -----------------------------------------------------------------------
    // 11. BOOTSTRAP ON WINDOW LOAD
    // -----------------------------------------------------------------------
    window.onload = function () {
      loadState();
      if (!DEMO_MODE) { const b = document.getElementById('demo-next-day-btn'); if (b) b.classList.add('hidden'); }
      if (gameState.onboarded) {
        document.getElementById('game-hub-screen').classList.remove('hidden');
        renderGameHub();
      } else {
        document.getElementById('onboarding-screen').classList.remove('hidden');
        initOnboardingUI();
      }
    };
