/* Reward, proof-type and level-unlock configuration. Edit numbers here only. */
const XP_REWARDS = { easy: 10, medium: 25, hard: 35, dayCleared: 30, weeklyReview: 50, milestone: 250,
  comeback: 200, dailyReflection: 10, weeklyLog: 25, shareBoost: 100 };
// Coin payouts (lowered so coins and levels run out together)
const COIN_REWARDS = { quest: 6, dayCleared: 6, dailyReflection: 6, weeklyLog: 20, weeklyReview: 60, shareBoost: 120 };
// Streak protection & comeback rules
const SHIELD_EVERY = 7, SHIELD_MAX = 3;          // +1 Winter Shield at every 7-day streak (holds up to 3)
const COMEBACK_AFTER_DAYS = 7, COMEBACK_COOLDOWN_DAYS = 30;
const ALERT_EVENING_HOUR = 18;                   // "streak at risk" alerts start at 6pm
const DIFFICULTIES = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };
const PROOF_TYPES = {
  photo:    { label: 'Photo',    icon: '📷', desc: 'Upload an image as proof that you completed the task.' },
  timer:    { label: 'Timer',    icon: '⏱',  desc: 'Complete the habit for a specified amount of time.' },
  checkbox: { label: 'Check-in', icon: '✓',  desc: 'Mark the habit complete when finished.' },
  manual:   { label: 'Manual',   icon: '✎',  desc: 'Record a short note confirming what you completed.' }
};
const TIMER_OPTIONS = [5, 10, 15, 30, 45, 60, 90, 120];
const MILESTONE_LEVELS = [5, 10, 15, 20, 25, 30];

// Level required to buy each item (unlockType "level"). Anything not listed = level 1.
const ITEM_LEVELS = {
  outfit: { gymset: 3, hoodie: 10, frostdress: 14, pinkset: 18, streetwear: 20, puffer: 28, luxury: 30 },
  room:   { rug: 1, plant: 3, couch: 5, painting: 8, neon: 12, bookshelf: 16, desk: 20, window: 23, fireplace: 25, fairylights: 9, aquarium: 22 },
  wall:   { midnight: 1, sage: 6, terracotta: 11, cream: 15, pink: 19, black: 27 },
  floor:  { oak: 3, birch: 12, stone: 13, blush: 18, onyx: 24 }
};
const ITEM_SOURCES = () => ({ outfit: SHOP_OUTFITS, room: SHOP_ROOM_ITEMS, wall: SHOP_WALL_COLORS, floor: SHOP_FLOOR_COLORS });
const SHOP_TAB_FOR = { outfit: 'outfits', room: 'room', wall: 'walls', floor: 'floors' };

function getRequiredLevel(cat, id) { return (ITEM_LEVELS[cat] || {})[id] || 1; }
function getShopItem(cat, id) { return (ITEM_SOURCES()[cat] || []).find(i => i.id === id); }
function getItemsUnlockedBetween(fromLevel, toLevel) {
  const out = [];
  Object.keys(ITEM_LEVELS).forEach(cat => Object.entries(ITEM_LEVELS[cat]).forEach(([id, lv]) => {
    const it = getShopItem(cat, id);
    if (it && lv > fromLevel && lv <= toLevel) out.push({ cat, id, name: it.name, level: lv });
  }));
  return out;
}
function getItemRarity(price) {
  return price < 150 ? 'COMMON' : price < 250 ? 'UNCOMMON' : price < 400 ? 'RARE' : price < 600 ? 'EPIC' : 'ELITE';
}
