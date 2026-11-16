/* Bootstrap on window load */
    // -----------------------------------------------------------------------
    // 11. BOOTSTRAP ON WINDOW LOAD
    // -----------------------------------------------------------------------
    // Swaps "Winter Arc" in the page's fixed text for the current season's name (no-op for Winter).
function applySeasonBranding() {
  if (SEASON.arc === 'Winter Arc') return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(n => { if (/winter arc/i.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace(/winter arc/gi, m => (m === m.toUpperCase() ? SEASON.arc.toUpperCase() : SEASON.arc)); });
}

window.onload = function () {
  applySeasonBranding();
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
