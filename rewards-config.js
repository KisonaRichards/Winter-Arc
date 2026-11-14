/* Reward, proof-type and level-unlock configuration. Edit numbers here only. */
const XP_REWARDS = { easy: 40, medium: 65, hard: 100, dayCleared: 60, weeklyReview: 100, milestone: 250 };
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
  outfit: { gymset: 2, hoodie: 5, streetwear: 10, luxury: 20 },
  room:   { rug: 1, plant: 2, painting: 3, couch: 5, neon: 7, bookshelf: 10, window: 12, desk: 15, fireplace: 20 },
  wall:   { midnight: 1, sage: 3, terracotta: 3, cream: 5, pink: 7, black: 10 },
  floor:  { oak: 2, birch: 4, stone: 6, blush: 8, onyx: 12 }
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
