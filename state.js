/* Application state & persistence (save/l/* Application state & persistence (save/load) */
    // -----------------------------------------------------------------------
    // 3. APPLICATION STATE & PERSISTENCE
    // -----------------------------------------------------------------------
    const STORAGE_KEY = 'winter_arc_rpg_state_v2';

    let gameState = {
      onboarded: false,
      player: {
        name: '',
        heightUnit: 'ft', // 'ft' or 'cm'
        heightDisplay: "5'10\"",
        weightUnit: 'lbs', // 'lbs' or 'kg'
        startWeight: 175,
        currentWeight: 175,
        savings: 0,
        studyHours: 0,
        skinGlowScore: 7,
        skinTone: 'light',
        hairStyle: 'fade',
        hairColor: 'jet'
      },
      aspects: [],
      aspectXP: {},
      habits: [], // [{ id, text, aspectId, completedDate }]
      targetGoal: '',
      signatureDataUrl: '',
      schemaVersion: 2,
      totalXP: 0,        // single source of truth for progression (see progression.js)
      level: 1,          // derived from totalXP
      xp: 0,             // derived: XP into the current level
      rewardLog: [],     // every reward ever granted: { id, txId, source, dateKey, ts, xp, coins }
      weeklyReports: [], // immutable weekly snapshots
      activeTimers: {},  // running habit timers { habitId: { startedAt, dateKey } }
      programStartKey: null,
      completions: [],   // every completed quest: { id, habitId, habitText, aspectId, date, proofType, completedAt, xp, coins, proofData }
      coins: 100,
      streak: 1,
      activeDayOffset: 0, // Allows "Next Day (Demo)" testing while enforcing strict 1/day rule
      shareFriendsCount: 0,
      shareRewardClaimed: false,
      lastWeeklyLogTimestamp: 0,
      equippedOutfit: 'gown',
      unlockedOutfits: ['gown'],
      unlockedRoomItems: [],
      equippedWallColor: 'concrete',
      unlockedWallColors: ['concrete'],
      equippedFloorColor: 'slate',
      unlockedFloorColors: ['slate'],
      proofLogs: [],
      metricHistory: [],
      moodLogs: []
    };

    let currentWizardStep = 1;
    let activeProofHabitId = null;
    let pendingProofImage = null;
    let pendingProofVerified = false;
    let selectedMoodOption = { label: 'Locked In', emoji: '🔥' };
    let currentShopCategory = 'outfits';
    let hasSignedCanvas = false;

    function getCurrentGameDateKey() {
      const d = new Date();
      d.setDate(d.getDate() + (gameState.activeDayOffset || 0));
      return d.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    function getCurrentGameDateFormatted() {
      const d = new Date();
      d.setDate(d.getDate() + (gameState.activeDayOffset || 0));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function saveState() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      } catch (e) {
        console.warn('Storage quota warning:', e);
      }
    }

    function loadState() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          gameState = { ...gameState, ...migrateSave(parsed) };
        }
      } catch (e) {
        console.error('Failed to load saved state:', e);
      }
    }
