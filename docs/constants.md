# Constants & Configuration

Game balance values, configuration settings, and tunable constants used throughout Exploding Employees.

## ⚡ Energy & Rewards

### ENERGY_REWARDS

Defined in `src/constants/gameConstants.js`:

```javascript
export const ENERGY_REWARDS = {
  low: {
    exp: 1,
    won: 10,
    energyCost: 1
  },
  med: {
    exp: 2,
    won: 25,
    energyCost: 2
  },
  high: {
    exp: 3,
    won: 50,
    energyCost: 3
  }
};
```

**Balance Notes:**
- Linear scaling: med = 2× low, high = 3× low
- Won scales faster than exp (10/25/50 vs 1/2/3)
- Encourages high-energy tasks for currency farming
- Low-energy tasks for grinding without overwork

### Energy Limits

```javascript
const MAX_ENERGY_PER_DAY = 10; // Soft cap per employee
const OVERWORK_THRESHOLD = 9; // Warning threshold
const CRITICAL_OVERWORK = 10; // Angry threshold
```

**Energy States:**
- 0-5: Normal (safe zone)
- 6-8: Stressed (caution)
- 9: Overworked (warning)
- 10+: Critical (must rest immediately)

## 🎴 Card Drop Rates

### CARD_DROP_CHANCE

```javascript
export const CARD_DROP_CHANCE = 0.1; // 10% per task
```

**Drop Math:**
- 10% = 1 card per 10 tasks (average)
- 100 cards = ~1000 tasks to collect all
- 5 tasks/day = ~200 days to collect all
- RNG variance applies!

**Tuning Considerations:**
- Too high: Cards lose value, complete too fast
- Too low: Frustrating grind, never complete
- 10% feels rewarding without being overwhelming

## 💰 Currency Values

### Store Prices

```javascript
// Ingredients (YuCash)
const INGREDIENT_PRICES = {
  basic: 50,      // Rice, vegetables
  common: 75,     // Eggs, bread
  uncommon: 100,  // Meat, spices
  rare: 150,      // Special meats
  premium: 200    // Luxury ingredients
};

// Gacha
const GACHA_ROLL_COST = 100; // YuCash per roll

// AU Snippet Costs (varies by snippet)
const SNIPPET_COSTS = {
  intro: 50,
  standard: 100,
  important: 200,
  climax: 300,
  premium: 500
};
```

### Conversion Rates

```javascript
const WON_TO_YUCASH_RATE = 1.0; // 1:1 conversion
```

**Future Considerations:**
- Exchange rate events (1.5× conversion days)
- Premium currency (Noah Credit Card) exchange
- Currency sinks for inflation control

## 🎯 Morale Thresholds

### Rank Requirements

```javascript
// Standard (Yuwon, Jaehyun)
const RANK_THRESHOLDS = {
  S: 7,  // All 7 days
  A: 5,  // 5-6 days
  B: 3,  // 3-4 days
  C: 1,  // 1-2 days
  F: 0   // 0 days
};

// Finance (Minkyu) - More Forgiving
const FINANCE_RANK_THRESHOLDS = {
  S: 5,  // 5+ days
  A: 3,  // 3-4 days
  B: 2,  // 2 days
  C: 1,  // 1 day
  F: 0   // 0 days
};

// Recurring (Noah) - Same as standard now
const RECURRING_RANK_THRESHOLDS = {
  S: 7,  // All 7 days
  A: 5,  // 5-6 days
  B: 3,  // 3-4 days
  C: 1,  // 1-2 days
  F: 0   // 0 days
};
```

### Mood Levels

```javascript
const MOOD_LEVELS = {
  extremely_bored: 0,
  bored: 25,
  okay: 40,
  content: 50,
  happy: 70,
  stressed: 80,
  overworked: 100,
  critical: 120
};
```

## 💖 Friendship System

### Friendship Points

```javascript
// Max friendship
const MAX_FRIENDSHIP = 2500; // 10 hearts × 250 points each

// Heart Milestones
const FRIENDSHIP_HEARTS = {
  1: 0,
  2: 250,
  3: 500,
  4: 750,
  5: 1000,
  6: 1250,
  7: 1500,
  8: 1750,
  9: 2000,
  10: 2500
};

// Dish Friendship Values
const DISH_FRIENDSHIP = {
  simple: 25,
  standard: 50,
  complex: 100,
  premium: 150
};

// Favorite Dish Bonus
const FAVORITE_DISH_MULTIPLIER = 1.5; // 50% bonus
```

### Friendship Unlocks

```javascript
const FRIENDSHIP_REWARDS = {
  2: 'Thank you message',
  4: 'Special dialogue',
  6: 'Personal story snippet',
  8: 'Free AU book unlock',
  10: 'Secret ending + special furniture'
};
```

## 🏠 Room Configuration

### Grid System

```javascript
const ROOM_CONFIG = {
  gridSize: 20,           // 20×20 grid
  cellSize: 32,           // 32×32 pixels per cell
  roomWidth: 640,         // 20 × 32
  roomHeight: 640,        // 20 × 32
  maxFurniture: 100       // Performance limit
};
```

### Character Movement

```javascript
const CHARACTER_CONFIG = {
  walkSpeed: 2,           // Pixels per frame
  idleTime: 3000,         // 3 seconds idle before moving
  animationSpeed: 200,    // MS per animation frame
  spriteSize: 32          // 32×32 sprite
};
```

## 🎨 UI Constants

### Colors

```javascript
const COLORS = {
  // Ranks
  rankS: '#f39c12',  // Gold
  rankA: '#3498db',  // Blue
  rankB: '#2ecc71',  // Green
  rankC: '#95a5a6',  // Gray
  rankF: '#e74c3c',  // Red

  // Energy
  energyLow: '#27ae60',
  energyMed: '#f39c12',
  energyHigh: '#e74c3c',

  // Task Types
  daily: '#e91e63',
  habit: '#9c27b0',
  recurring: '#2196f3',
  finance: '#4caf50',
  impossible: '#ff9800'
};
```

### Animations

```javascript
const ANIMATION_CONFIG = {
  taskComplete: {
    duration: 500,      // MS
    easing: 'ease-out'
  },
  cardDrop: {
    duration: 800,
    easing: 'bounce'
  },
  currencyGain: {
    duration: 1000,
    easing: 'ease-in-out'
  }
};
```

## 📊 Balance Tuning Guide

### When to Adjust Constants

**Too Easy:**
- Energy cap too high → reduce MAX_ENERGY_PER_DAY
- Too much currency → reduce won/exp rewards
- Cards drop too often → reduce CARD_DROP_CHANCE

**Too Grindy:**
- Energy cap too low → increase MAX_ENERGY_PER_DAY
- Not enough currency → increase rewards
- Cards too rare → increase drop chance

**Not Engaging:**
- Rank thresholds too easy/hard → adjust
- Friendship progresses too slow → increase points per gift
- Furniture too expensive → reduce prices

### Testing Checklist

Before changing constants:
- [ ] Document current value
- [ ] Test with real gameplay (not just math)
- [ ] Check impact on other systems
- [ ] Get feedback from players
- [ ] Monitor progression rates
- [ ] Be willing to revert if needed

## 🔮 Experimental Features

### Feature Flags

```javascript
const FEATURE_FLAGS = {
  enableRecurringAutoRegen: false,    // Auto-regenerate recurring tasks
  enableMultiplayer: false,            // Multiplayer features
  enableCloudSync: false,              // Cloud save/sync
  enableAchievements: false,           // Achievement system
  enableDailyQuests: false,            // Daily quest system
  enableSeasonalEvents: false          // Holiday events
};
```

Usage:
```javascript
if (FEATURE_FLAGS.enableRecurringAutoRegen) {
  // Recurring task regeneration logic
}
```

## 📈 Analytics Constants

### Tracking Events (for future analytics)

```javascript
const ANALYTICS_EVENTS = {
  taskCompleted: 'task_completed',
  cardDropped: 'card_dropped',
  gachaRolled: 'gacha_rolled',
  friendshipLevelUp: 'friendship_level_up',
  paycheckClaimed: 'paycheck_claimed',
  furniturePlaced: 'furniture_placed'
};
```

## 🎮 Difficulty Presets

### For Future Difficulty Settings

```javascript
const DIFFICULTY_PRESETS = {
  relaxed: {
    maxEnergy: 15,
    wonMultiplier: 1.5,
    cardDropChance: 0.15
  },
  balanced: {
    maxEnergy: 10,
    wonMultiplier: 1.0,
    cardDropChance: 0.1
  },
  hardcore: {
    maxEnergy: 7,
    wonMultiplier: 0.75,
    cardDropChance: 0.05
  }
};
```

---

## 🔧 Modifying Constants

### How to Change

1. **Edit source files:**
   - `src/constants/gameConstants.js`
   - Component-specific constants in respective files

2. **Clear localStorage** (if needed):
   - Old saves may have cached values
   - Use "Reset Data" feature

3. **Test thoroughly:**
   - Check all affected systems
   - Verify math still works
   - Ensure no divide-by-zero errors

4. **Document changes:**
   - Update this file
   - Add to CHANGELOG
   - Note in commit message

---

*Balance is an art - tune carefully and test often!* ⚖️✨
