// Seasonal decoration configuration
// Add new seasons by adding objects to this array!

export const seasons = [
  {
    id: 'halloween',
    name: 'Halloween',
    startDate: '10-01',  // MM-DD format
    endDate: '11-01',
    // Background layer decorations (BEHIND everything - buttons, currency, etc)
    backgroundDecorations: [
      // Pumpkin peeking behind currency
      { image: '/images/seasonal/pumpkin.png', position: { top: '5px', right: '310px' }, size: '50px', animation: 'pulse', delay: '0.3s' },
    ],

    // Foreground decorations (ABOVE background but still part of banner)
    bannerDecorations: [
      // Ghosts
      { image: '/images/seasonal/ghost_facingright.png', position: { top: '10px', left: 'calc(30% + 80px)' }, size: '40px', animation: 'haunt', delay: '0.5s' },
      { image: '/images/seasonal/ghost_facingleft.png', position: { top: '10px', right: '30%' }, size: '40px', animation: 'haunt', delay: '1.2s' },

      // Bats
      { image: '/images/seasonal/bat_1.png', position: { top: '5px', left: 'calc(35% - 50px)' }, size: '35px', animation: 'float', delay: '0.8s' },
      { image: '/images/seasonal/bat_2.png', position: { top: '2px', right: 'calc(30% - 20px)' }, size: '26px', animation: 'float', delay: '1.5s' },

      // Moon
      { image: '/images/seasonal/moon.png', position: { top: '8px', right: 'calc(35% + 50px)' }, size: '42px', animation: 'glow', delay: '0.7s' },
    ],
    // Optional: Custom header background color (spooky orange-purple gradient!)
    backgroundColor: 'linear-gradient(135deg, #ffb88c 0%, #d4a5f5 100%)'
  },
  // Add more seasons here! Examples:
  // {
  //   id: 'christmas',
  //   name: 'Christmas',
  //   startDate: '12-01',
  //   endDate: '12-26',
  //   decorations: [
  //     { image: '/images/seasonal/snowflake.png', position: { top: '10%', left: '20%' }, delay: '0s', size: '28px' },
  //     { image: '/images/seasonal/santa.png', position: { top: '80%', right: '15%' }, delay: '0.5s', size: '28px' },
  //     // etc...
  //   ],
  //   backgroundColor: 'linear-gradient(135deg, #e3f2fd 0%, #ffebee 100%)'
  // },
  // {
  //   id: 'valentines',
  //   name: "Valentine's Day",
  //   startDate: '02-01',
  //   endDate: '02-15',
  //   decorations: [...],
  //   backgroundColor: 'linear-gradient(135deg, #ffe6f0 0%, #ffd6e8 100%)'
  // }
];

// Function to get current active season
export const getCurrentSeason = () => {
  const now = new Date();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentDay = String(now.getDate()).padStart(2, '0');
  const currentDate = `${currentMonth}-${currentDay}`;

  return seasons.find(season => {
    const [startMonth, startDay] = season.startDate.split('-');
    const [endMonth, endDay] = season.endDate.split('-');

    const start = `${startMonth}-${startDay}`;
    const end = `${endMonth}-${endDay}`;

    // Handle year-spanning seasons (like Dec-Jan)
    if (start > end) {
      return currentDate >= start || currentDate <= end;
    }

    return currentDate >= start && currentDate <= end;
  });
};

// Star explosion decorations around logo - 10% larger spread than original
export const defaultDecorations = [
  { image: '/images/icon_star.png', position: { top: '-8%', left: '5%' }, delay: '0s', size: '24px' },
  { image: '/images/icon_star.png', position: { top: '94%', left: '1%' }, delay: '0.3s', size: '24px' },
  { image: '/images/icon_star.png', position: { top: '3%', right: '-2%' }, delay: '0.6s', size: '24px' },
  { image: '/images/icon_star.png', position: { top: '100%', right: '0%' }, delay: '0.9s', size: '24px' },
  { image: '/images/icon_star.png', position: { top: '-10%', left: '50%' }, delay: '1.2s', size: '24px' },
  { image: '/images/icon_star.png', position: { top: '105%', left: '50%' }, delay: '1.5s', size: '24px' },
  { image: '/images/icon_star.png', position: { top: '7%', right: '16%' }, delay: '1.8s', size: '24px' },
  { image: '/images/icon_star.png', position: { top: '86%', left: '22%' }, delay: '2.1s', size: '24px' },
  { image: '/images/icon_star.png', position: { top: '50%', left: '-8%' }, delay: '2.4s', size: '24px' },
  { image: '/images/icon_star.png', position: { top: '50%', right: '-8%' }, delay: '2.7s', size: '24px' },
];

// Background floating hearts and stars across the entire banner
export const defaultBannerDecorations = [
  { emoji: '💖', position: { top: '15px', left: '10%' }, delay: '0s', size: '18px' },
  { emoji: '⭐', position: { top: '12px', left: '20%' }, delay: '0.3s', size: '16px' },
  { emoji: '💕', position: { top: '18px', right: '15%' }, delay: '0.6s', size: '18px' },
  { emoji: '✨', position: { top: '10px', right: '25%' }, delay: '0.9s', size: '16px' },
  { emoji: '💖', position: { top: '8px', left: '65%' }, delay: '1.2s', size: '18px' },
  { emoji: '⭐', position: { top: '16px', right: '40%' }, delay: '1.5s', size: '16px' },
  { emoji: '✨', position: { top: '14px', left: '35%' }, delay: '1.8s', size: '16px' },
  { emoji: '💕', position: { top: '11px', right: '8%' }, delay: '2.1s', size: '18px' },
];
