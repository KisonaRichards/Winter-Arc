/* Progression: the single source of truth for XP, levels and save migration.
   Nothing else in the app should do level math. */

const XP_CONFIG = {
  // Cumulative XP to reach level L = (levelStep / 2) * (L - 1) * (L + 2)
  // levelStep 50 -> L2: 100, L3: 250, L4: 450, L5: 700, L6: 1000 ...
  levelStep: 50,
  maxLevel: 100,
  maxTotalXP: 1000000000
};
const SAVE_SCHEMA_VERSION = 2;

// Safe whole-number XP: invalid, negative, decimal or missing values become 0 / floored.
function sanitizeXP(value) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.min(n, XP_CONFIG.maxTotalXP);
}

function clampLevel(level) {
  const n = Math.floor(Number(level));
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.min(n, XP_CONFIG.maxLevel);
}

// Total (cumulative) XP needed to REACH a level.
function getXPRequiredForLevel(level) {
  const L = clampLevel(level);
  return (XP_CONFIG.levelStep / 2) * (L - 1) * (L + 2);
}

// XP needed to get from this level to the next one (0 at max level).
function getXPRequiredForNextLevel(level) {
  const L = clampLevel(level);
  if (L >= XP_CONFIG.maxLevel) return 0;
  return getXPRequiredForLevel(L + 1) - getXPRequiredForLevel(L);
}

function getLevelFromXP(totalXP) {
  const xp = sanitizeXP(totalXP);
  let level = 1;
  while (level < XP_CONFIG.maxLevel && xp >= getXPRequiredForLevel(level + 1)) level++;
  return level;
}

function getXPIntoCurrentLevel(totalXP) {
  const xp = sanitizeXP(totalXP);
  return xp - getXPRequiredForLevel(getLevelFromXP(xp));
}

// Everything a progress bar needs, calculated within the current level.
function getLevelProgress(totalXP) {
  const xp = sanitizeXP(totalXP);
  const level = getLevelFromXP(xp);
  const xpForLevel = getXPRequiredForNextLevel(level);
  const xpIntoLevel = getXPIntoCurrentLevel(xp);
  const isMax = level >= XP_CONFIG.maxLevel;
  return {
    level, totalXP: xp, xpIntoLevel, xpForLevel, isMax,
    xpToNext: isMax ? 0 : xpForLevel - xpIntoLevel,
    percent: isMax ? 100 : Math.min(100, Math.floor((xpIntoLevel / xpForLevel) * 100))
  };
}

// Keep the legacy `level` / `xp` fields in sync as derived values (old code & exports still read them).
function syncDerivedProgress(state) {
  state.totalXP = sanitizeXP(state.totalXP);
  state.level = getLevelFromXP(state.totalXP);
  state.xp = getXPIntoCurrentLevel(state.totalXP);
}

// Upgrade older saves (and imported backups) without losing progress.
function migrateSave(save) {
  if (!save || typeof save !== 'object') return save;
  if ((save.schemaVersion || 1) < 2) {
    // Old system: level L needed L*100 XP, and `xp` was XP into the current level.
    const lvl = clampLevel(save.level);
    save.totalXP = sanitizeXP(50 * lvl * (lvl - 1) + sanitizeXP(save.xp));
  }
  save.totalXP = sanitizeXP(save.totalXP);
  if (!Array.isArray(save.rewardLog)) save.rewardLog = [];
  if (!Array.isArray(save.completions)) save.completions = [];
  if (!Array.isArray(save.weeklyReports)) save.weeklyReports = [];
  if (!save.activeTimers || typeof save.activeTimers !== 'object') save.activeTimers = {};
  if (typeof save.programStartKey === 'undefined') save.programStartKey = null;
  save.schemaVersion = SAVE_SCHEMA_VERSION;
  syncDerivedProgress(save);
  return save;
}
