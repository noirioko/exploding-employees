// Energy levels and rewards
export const ENERGY_REWARDS = {
  low: { exp: 1, won: 10 },
  med: { exp: 2, won: 25 },
  high: { exp: 3, won: 50 }
};

// Card drop rate
export const CARD_DROP_CHANCE = 0.1; // 10% chance

// Employee promotion levels
export const PROMOTION_LEVELS = {
  EXP_PER_LEVEL: 10,
  TITLE_THRESHOLDS: {
    ENTRY: 1,
    JUNIOR: 3,
    SENIOR: 6,
    EXECUTIVE: 10
  }
};

// Gacha costs and rates
export const GACHA_COSTS = {
  normal: { amount: 50, currency: 'yuCash' },
  spicy: { amount: 1, currency: 'noahCreditCard' }
};

export const GACHA_DROP_RATES = {
  normal: {
    common: 0.70,
    rare: 0.20,
    super: 0.08,
    ultra: 0.02
  },
  spicy: {
    common: 0.20,
    rare: 0.40,
    super: 0.30,
    ultra: 0.10
  }
};

// Friendship/Bond levels
export const BOND_LEVELS = {
  LEVEL_1: 0,
  LEVEL_2: 20,
  LEVEL_3: 40,
  LEVEL_4: 60,
  LEVEL_5: 80,
  LEVEL_6: 100
};

export const HEART_COLORS = {
  0: { color: 'black', emoji: '🖤', level: 1 },
  20: { color: 'blue', emoji: '💙', level: 2 },
  40: { color: 'green', emoji: '💚', level: 3 },
  60: { color: 'yellow', emoji: '💛', level: 4 },
  80: { color: 'orange', emoji: '🧡', level: 5 },
  100: { color: 'red', emoji: '❤️', level: 6 }
};

// Gift preferences
export const GIFT_POINTS = {
  LOVED: 2,
  LIKED: 1,
  DISLIKED: -1
};

// Room dimensions
export const ROOM_DIMENSIONS = {
  WIDTH: 640,
  HEIGHT: 360,
  CENTER_X: 270,
  CENTER_Y: 130
};

// Character sprite sizes
export const SPRITE_SIZES = {
  CHARACTER: 40,
  FURNITURE_PREVIEW: 80
};

// Employee morale
export const MORALE_ENERGY_LIMIT = 10;

// Collection limits
export const COLLECTION_LIMITS = {
  TOTAL_CARDS: 100,
  TOTAL_AU_BOOKS: 20
};
