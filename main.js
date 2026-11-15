/* Bootstrap on window load */
    // -----------------------------------------------------------------------
    // 11. BOOTSTRAP ON WINDOW LOAD
    // -----------------------------------------------------------------------
    window.onload = function () {
      loadState();
      if (!DEMO_MODE) document.querySelectorAll('[data-demo-only], #demo-next-day-btn').forEach(b => b.remove());
      if (gameState.onboarded) {
        document.getElementById('game-hub-screen').classList.remove('hidden');
        renderGameHub();
      } else {
        document.getElementById('onboarding-screen').classList.remove('hidden');
        initOnboardingUI();
      }
    };
