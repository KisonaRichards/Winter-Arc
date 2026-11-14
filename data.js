/* Static game data: aspects, outfits, furniture, wall & floor colors, rewards, DEMO_MODE */
    // -----------------------------------------------------------------------
    // 1. STATIC GAME DATA (10 Aspects, Outfits w/ Pants, Room Decor, Wall Colors)
    // -----------------------------------------------------------------------
    const LIFE_ASPECTS = [
      { id: 'fitness', name: 'Fitness & Physique', icon: 'fa-dumbbell', color: 'text-rose-400', suggestions: ['45-min strength or cardio workout', 'Hit 10,000 steps today', '100 pushups & core circuit'] },
      { id: 'skincare', name: 'Skincare & Glow-up', icon: 'fa-sparkles', color: 'text-cyan-300', suggestions: ['AM & PM cleanser + SPF/moisturizer', 'Ice roller & gua sha routine', 'Zero dairy/sugar for clear skin'] },
      { id: 'finances', name: 'Finances & Savings', icon: 'fa-sack-dollar', color: 'text-emerald-400', suggestions: ['No-spend day on impulse buys', 'Transfer $20+ to Winter Savings', 'Track every expense in budget'] },
      { id: 'nutrition', name: 'Nutrition & Hydration', icon: 'fa-droplet', color: 'text-sky-400', suggestions: ['Drink 3L / 1 gallon of water', 'Hit daily protein goal (140g+)', 'Cook all meals at home today'] },
      { id: 'focus', name: 'Mental Focus & Study', icon: 'fa-brain', color: 'text-purple-400', suggestions: ['90-min deep work block (no phone)', 'Complete top 3 priority tasks', 'Zero doomscrolling before noon'] },
      { id: 'sleep', name: 'Sleep & Recovery', icon: 'fa-moon', color: 'text-indigo-400', suggestions: ['In bed by 10:30 PM (7.5h+ sleep)', 'No screens 45 mins before bed', 'Morning sunlight within 15 mins'] },
      { id: 'career', name: 'Career & Hustle', icon: 'fa-briefcase', color: 'text-amber-400', suggestions: ['1 hour building side project/skills', 'Send 3 outreach or job applications', 'Clear inbox & plan tomorrow'] },
      { id: 'reading', name: 'Reading & Mindset', icon: 'fa-book-open', color: 'text-orange-400', suggestions: ['Read 20 pages of non-fiction', 'Write 5-min morning gratitude & goals', '10-min mindfulness meditation'] },
      { id: 'style', name: 'Style & Grooming', icon: 'fa-shirt', color: 'text-pink-400', suggestions: ['Intentional outfit & grooming check', 'Keep living space spotless (10m tidy)', 'Posture & confidence check-in'] },
      { id: 'discipline', name: 'Consistency & Discipline', icon: 'fa-shield-halved', color: 'text-ice-400', suggestions: ['Wake up at 6:00 AM without snoozing', 'Cold shower finish (60 seconds)', 'Complete 100% of daily habits'] }
    ];

    const SKIN_TONES = [
      { id: 'fair', hex: '#f8d5c2', shadow: '#e0b199' },
      { id: 'light', hex: '#eab89b', shadow: '#cf9676' },
      { id: 'olive', hex: '#c88e68', shadow: '#a86e49' },
      { id: 'tan', hex: '#9f6542', shadow: '#7d4a2b' },
      { id: 'deep', hex: '#633b24', shadow: '#472816' }
    ];

    const HAIR_STYLES = [
      { id: 'fade', label: 'Clean Fade' },
      { id: 'messy', label: 'Textured Flow' },
      { id: 'braids', label: 'Box Braids' },
      { id: 'bun', label: 'Top Bun' },
      { id: 'long', label: 'Long Waves' }
    ];

    const HAIR_COLORS = [
      { id: 'jet', hex: '#18181b' },
      { id: 'espresso', hex: '#3f2314' },
      { id: 'ash', hex: '#78716c' },
      { id: 'platinum', hex: '#e2e8f0' },
      { id: 'iceblue', hex: '#38bdf8' }
    ];

    const SHOP_OUTFITS = [
      { id: 'gown', name: 'Clean Slate Gown', desc: 'Starter hospital gown & grip socks.', price: 0, badge: 'Starter' },
      { id: 'gymset', name: 'Stealth Compression + Joggers', desc: 'Fitted black top & tapered athletic joggers.', price: 150, badge: 'Fitness' },
      { id: 'hoodie', name: 'Frost Tech Fleece + Cargos', desc: 'Heavyweight ice hoodie & cargo sweatpants.', price: 240, badge: 'Cozy Fit' },
      { id: 'streetwear', name: 'Obsidian Bomber + Denim', desc: 'Structured bomber jacket & slim black pants.', price: 380, badge: 'Street' },
      { id: 'luxury', name: 'Executive Suit + Trousers', desc: 'Midnight tailored blazer, shirt & dress pants.', price: 600, badge: 'Elite' }
    ];

    const SHOP_ROOM_ITEMS = [
      { id: 'rug', name: 'Plush Frost Rug', desc: 'Soft woven circular rug with ice trim.', price: 120 },
      { id: 'plant', name: 'Monstera Vitality Plant', desc: 'Brings fresh oxygen & life to the corner.', price: 150 },
      { id: 'painting', name: 'Framed Alpine Art', desc: 'Gold-framed geometric mountain painting.', price: 180 },
      { id: 'couch', name: 'Plush Velvet Couch', desc: 'Deep navy lounge sofa with amber throw pillow.', price: 240 },
      { id: 'neon', name: 'Neon "LOCK IN" Sign', desc: 'Glowing cyan LED motivation on the wall.', price: 260 },
      { id: 'bookshelf', name: 'Mindset Bookshelf & Trophy', desc: 'Oak shelf stacked with wisdom & gold.', price: 300 },
      { id: 'window', name: 'Snowy Skyline Window', desc: 'Panoramic view of a winter night city.', price: 360 },
      { id: 'desk', name: 'Pro Creator Desk Setup', desc: 'Ultrawide monitor rig for deep work.', price: 450 },
      { id: 'fireplace', name: 'Warm Stone Fireplace', desc: 'Crackling winter hearth for ultimate coziness.', price: 550 }
    ];

    // DEMO MODE: shows the "Next Day" test button. Set to false for the real app release.
    const DEMO_MODE = true;
    // Slow-burn rewards so players can't max everything out in a few days
    const REWARD_XP_PER_PROOF = 10, REWARD_COINS_PER_PROOF = 10;
    const ALL_DONE_BONUS_XP = 60, ALL_DONE_BONUS_COINS = 10;

    const SHOP_FLOOR_COLORS = [
      { id: 'slate', name: 'Starter Slate Floor', desc: 'Default cold studio flooring.', price: 0, top: '#23293a', bottom: '#151924', line: '#1b2130' },
      { id: 'oak', name: 'Warm Oak Planks', desc: 'Cozy honey-brown hardwood.', price: 100, top: '#6b4a2e', bottom: '#45301d', line: '#38261a' },
      { id: 'birch', name: 'Light Birch', desc: 'Bright Scandinavian wood.', price: 120, top: '#b89b72', bottom: '#917654', line: '#7a6244' },
      { id: 'stone', name: 'Charcoal Stone', desc: 'Sleek modern stone tile.', price: 110, top: '#3a3d45', bottom: '#25272d', line: '#2e3037' },
      { id: 'blush', name: 'Blush Pink Floor', desc: 'Soft rosy flooring.', price: 130, top: '#9b6b80', bottom: '#744e5f', line: '#5f3f4d' },
      { id: 'onyx', name: 'Midnight Onyx', desc: 'Glossy deep black floor.', price: 130, top: '#15161b', bottom: '#0a0a0d', line: '#1a1b22' }
    ];

    const SHOP_WALL_COLORS = [
      { id: 'pink', name: 'Blush Rose Pink', desc: 'Soft, warm pink for a cozy glow.', price: 150, top: '#a8557a', bottom: '#7e3d5c', baseboard: '#4a1d34' },
      { id: 'black', name: 'Matte Obsidian Black', desc: 'Sleek all-black focus cave.', price: 150, top: '#17171c', bottom: '#0b0b0e', baseboard: '#050507' },
      { id: 'concrete', name: 'Starter Slate Grey', desc: 'Default bare obsidian studio wall.', price: 0, top: '#182032', bottom: '#101624', baseboard: '#0d121d' },
      { id: 'midnight', name: 'Deep Arctic Navy', desc: 'Rich twilight blue for late-night focus.', price: 90, top: '#0f2342', bottom: '#091529', baseboard: '#060e1c' },
      { id: 'sage', name: 'Sage Sanctuary', desc: 'Calm eucalyptus green for mindful clarity.', price: 120, top: '#1b332d', bottom: '#11211d', baseboard: '#0a1412' },
      { id: 'terracotta', name: 'Warm Ember Clay', desc: 'Cozy terracotta dusk tone.', price: 140, top: '#3b201c', bottom: '#241210', baseboard: '#170b09' },
      { id: 'cream', name: 'Nordic Warm Cream', desc: 'Bright minimalist Scandinavian gallery wall.', price: 160, top: '#d6cfc2', bottom: '#bfb6a6', baseboard: '#57534e' }
    ];

    // Mismatch keywords for smart photo proof validation edge case
    const UNRELATED_PHOTO_KEYWORDS = ['flower', 'rose', 'tulip', 'daisy', 'cat', 'dog', 'puppy', 'kitten', 'meme', 'wallpaper', 'cartoon', 'anime', 'beach', 'vacation', 'sunset', 'landscape', 'random'];

    const RANK_TITLES = [
      'Novice Sleeper',
      'Frost Apprentice',
      'Habit Builder',
      'Winter Grinder',
      'Relentless Architect',
      'Winter Arc Legend'
    ];

    const AVATAR_QUOTES = [
      "Lock in! Every rep and every habit counts. ❄️",
      "Remember why you signed the decree!",
      "From a bare room to an empire—keep stacking coins!",
      "No days off during the Winter Arc!",
      "Future you is watching. Make them proud! 🔥",
      "Snap real proof and claim your XP!"
    ];
