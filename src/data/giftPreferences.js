// Gift preferences for each character
// loved: +80 friendship points
// liked: +45 friendship points
// neutral: +20 friendship points
// disliked: -20 friendship points
// hated: -40 friendship points

export const giftPreferences = {
  noah: {
    loved: ['steak', 'burger', 'pizza', 'roastedchicken'],
    liked: ['hotdog', 'sandwich', 'bacon', 'salmon'],
    disliked: ['cookies', 'donut', 'waffle'],
    hated: ['strawberrycake', 'cheesecake']
  },
  jaehyun: {
    loved: ['chocolatecake', 'cookies', 'cheesecake', 'strawberrycake'],
    liked: ['donut', 'waffle', 'pancakes', 'apple_pie'],
    disliked: ['salmon', 'steak'],
    hated: ['burger', 'hotdog']
  },
  minkyu: {
    loved: ['salmon', 'macncheese', 'pizza', 'burrito'],
    liked: ['friedegg', 'omlet', 'pancakes', 'bagel'],
    disliked: ['bacon', 'steak'],
    hated: ['roastedchicken', 'burger']
  },
  yuwon: {
    loved: ['strawberrycake', 'apple_pie', 'cookies', 'pancakes'],
    liked: ['waffle', 'donut', 'cheesecake', 'bagel'],
    disliked: ['hotdog', 'bacon'],
    hated: ['burrito', 'macncheese']
  }
};

// Get gift reaction and points
export const getGiftReaction = (character, dishId) => {
  const prefs = giftPreferences[character];
  if (!prefs) return { reaction: 'neutral', points: 20 };

  if (prefs.loved.includes(dishId)) {
    return {
      reaction: 'loved',
      points: 80,
      message: getLovedMessage(character)
    };
  } else if (prefs.liked.includes(dishId)) {
    return {
      reaction: 'liked',
      points: 45,
      message: getLikedMessage(character)
    };
  } else if (prefs.disliked.includes(dishId)) {
    return {
      reaction: 'disliked',
      points: -20,
      message: getDislikedMessage(character)
    };
  } else if (prefs.hated.includes(dishId)) {
    return {
      reaction: 'hated',
      points: -40,
      message: getHatedMessage(character)
    };
  } else {
    return {
      reaction: 'neutral',
      points: 20,
      message: getNeutralMessage(character)
    };
  }
};

// Character-specific reactions
const getLovedMessage = (character) => {
  const messages = {
    noah: "This is amazing! You really know what I like! ❤️",
    jaehyun: "Oh wow! This is my favorite! Thank you so much! ❤️",
    minkyu: "This is incredible! You're the best! ❤️",
    yuwon: "OMG this is perfect! I love it so much! ❤️"
  };
  return messages[character] || "I love this! ❤️";
};

const getLikedMessage = (character) => {
  const messages = {
    noah: "Thanks, this looks good! 😊",
    jaehyun: "Oh, this is nice! I appreciate it! 😊",
    minkyu: "Cool, I like this! Thanks! 😊",
    yuwon: "Aww, this is sweet! Thank you! 😊"
  };
  return messages[character] || "Thanks! 😊";
};

const getNeutralMessage = (character) => {
  const messages = {
    noah: "Oh, thanks for thinking of me.",
    jaehyun: "I'll have this later, thanks!",
    minkyu: "Appreciated, thanks.",
    yuwon: "Oh, you made this? That's nice!"
  };
  return messages[character] || "Thanks!";
};

const getDislikedMessage = (character) => {
  const messages = {
    noah: "Uh... thanks, I guess? 😬",
    jaehyun: "Oh... I'm not really a fan of this... 😕",
    minkyu: "Hmm, not really my thing... but thanks? 😬",
    yuwon: "Oh... um... I'll try it later... 😅"
  };
  return messages[character] || "Oh... thanks... 😬";
};

const getHatedMessage = (character) => {
  const messages = {
    noah: "Really? You know I hate this... 😠",
    jaehyun: "Ugh, you know I can't stand this! 😤",
    minkyu: "Are you serious? You know I don't like this! 😒",
    yuwon: "Nooo! Why would you give me this?! 😭"
  };
  return messages[character] || "I really don't like this... 😤";
};

// Friendship level thresholds (hearts)
export const friendshipLevels = {
  0: 0,      // 0 hearts
  1: 250,    // 1 heart
  2: 500,    // 2 hearts
  3: 750,    // 3 hearts
  4: 1000,   // 4 hearts
  5: 1250,   // 5 hearts
  6: 1500,   // 6 hearts
  7: 1750,   // 7 hearts
  8: 2000,   // 8 hearts
  9: 2250,   // 9 hearts
  10: 2500   // 10 hearts (max)
};

// Get heart count from friendship points
export const getHeartCount = (points) => {
  for (let i = 10; i >= 0; i--) {
    if (points >= friendshipLevels[i]) {
      return i;
    }
  }
  return 0;
};
