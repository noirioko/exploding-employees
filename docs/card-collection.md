# Card Collection System

A passive collection system where you gather office-themed cards by completing tasks. Think of it like a trading card game or Pokémon card collection!

## 🎴 What Are Cards?

Cards are collectible items that drop randomly when you complete tasks. Each card features:
- **Unique ID**: Each card is unique
- **Title**: Card name/description
- **Image**: Visual representation
- **Rarity**: How rare the card is (common/rare/epic/legendary)
- **Character Association**: Some cards relate to specific employees
- **Lore/Flavor Text**: Short description or quote

## 📦 How to Get Cards

### Card Drop Mechanics

**Drop Chance:**
- **10% chance** per task completion
- Defined in `constants/gameConstants.js` as `CARD_DROP_CHANCE = 0.1`

**When Cards Drop:**
- Complete any task (daily, habit, recurring, finance, impossible)
- Card drops are **random** from the pool of uncollected cards
- You see a notification when a card drops
- Card is automatically added to your collection

**No Duplicates:**
- Once you collect a card, you won't get it again
- Drop pool only includes cards you haven't collected yet
- Makes collecting all cards achievable (not infinite grind)

### Drop Pool

**Total Cards Available:**
- 100 canon office cards (planned)
- Currently implemented: Check `src/data/cards.js`

**Card Categories:**
- Office supplies (stapler, coffee mug, keyboard)
- Employee moments (Yuwon working late, Noah slacking)
- Situations (deadline panic, meeting room chaos)
- Locations (office desk, break room, CEO office)
- Special events (company party, team building)

## 🖼️ Viewing Your Collection

### Vanity Page (`/vanity`)

The Vanity page is your card gallery:

**Features:**
- Grid view of all collected cards
- Cards displayed with images and titles
- Count indicator: "X / 100 cards collected"
- Rarity indicators (colors or borders)
- Sort/filter options (by rarity, character, date collected)

**Card Details:**
- Click on a card to see full details
- Larger image view
- Complete flavor text
- Collection date
- Rarity information

### Dashboard Notification

When a card drops:
- Popup notification appears
- Shows card image and name
- "New Card!" message
- Can click to go to Vanity page

## 🎨 Card Rarity System

Cards have different rarity tiers:

### Common (White/Gray)
- 50% of card pool
- Basic office items
- Everyday situations
- Easy to collect

### Rare (Blue)
- 30% of card pool
- Interesting moments
- Character-specific scenes
- Moderately hard to collect

### Epic (Purple)
- 15% of card pool
- Special events
- Rare employee interactions
- Harder to collect

### Legendary (Gold/Orange)
- 5% of card pool
- Extremely special moments
- Secret cards
- Very hard to collect
- May have special unlock conditions

**Note:** All rarities have equal drop chance from uncollected pool (simplified for player-friendly collecting)

## 📊 Collection Progress

### Tracking

**Overall Progress:**
- Total cards collected / Total cards available
- Percentage complete
- Displayed on Vanity page

**Per Character:**
- Cards collected for each employee
- Yuwon cards: X/25
- Jaehyun cards: X/25
- Minkyu cards: X/25
- Noah cards: X/25

**Per Category:**
- Office Supplies: X/20
- Employee Moments: X/30
- Situations: X/25
- Locations: X/15
- Special Events: X/10

### Achievements

**Collection Milestones:**
- Collect 10 cards → "Getting Started" 🌱
- Collect 25 cards → "Quarter Collection" 📚
- Collect 50 cards → "Halfway There" 🎯
- Collect 75 cards → "Almost Complete" ⭐
- Collect 100 cards → "Master Collector" 👑

**Character Completionist:**
- Collect all Yuwon cards → "Yuwon Fan" 💼
- Collect all Noah cards → "Noah Simp" 😏
- Collect all Jaehyun cards → "Habit Tracker" ✨
- Collect all Minkyu cards → "Finance Guru" 💰
- Collect all four → "Company Superfan" 🏢

## 🎁 Special Cards

### Secret Cards

Some cards have special unlock conditions:

**Achievement Cards:**
- Complete 100 tasks → "Overachiever Card"
- Rest 20 times → "Self-Care Champion Card"
- Earn 10,000 won → "Money Maker Card"

**Event Cards:**
- Complete task at specific time (midnight, birthday)
- Complete tasks on special dates
- Unlock specific AU books

**Interaction Cards:**
- Trigger specific employee interactions
- Max out friendship with an employee
- Witness rare employee mood states

## 📜 Card Data Structure

```javascript
{
  id: 'card_001',
  title: 'Coffee Break',
  description: 'Yuwon taking a much-needed coffee break',
  image: '/images/cards/coffee_break.png',
  rarity: 'common',
  category: 'employee_moments',
  character: 'yuwon',
  flavorText: '"Just five more minutes..." - Yuwon',
  collectedAt: '2025-10-09T12:34:56Z' // timestamp when collected
}
```

## 🎮 Gameplay Impact

### Purely Cosmetic

Cards are **100% cosmetic** - they don't affect gameplay:
- No stat bonuses
- No gameplay advantages
- Pure collection satisfaction
- Optional side content

### Motivation System

Cards serve as:
- **Passive reward** for completing tasks
- **Long-term goal** to collect them all
- **Variety** in task rewards (not just currency)
- **Lore delivery** through flavor text
- **Achievement tracking** showing your history

## 💡 Collection Tips

1. **Be consistent** - 10% drop chance means 1 card per ~10 tasks
2. **Complete high energy tasks** - More rewards per task (but same drop rate)
3. **Don't stress it** - Cards are passive, they come naturally
4. **Check Vanity regularly** - See your progress and appreciate your collection
5. **Read flavor text** - Cards tell the story of your office life

## 🔮 Planned Features

- [ ] Card trading system (trade duplicates with friends)
- [ ] Card packs (buy packs with YuCash for guaranteed cards)
- [ ] Card albums/binders (organize cards by theme)
- [ ] Card showcase on profile
- [ ] Animated/special effect cards
- [ ] Card crafting (combine cards to make special cards)
- [ ] Card gallery sorting/filtering improvements
- [ ] Print/export collection as PDF

## 🐛 Known Issues

- [ ] Card drop notification sometimes doesn't appear
- [ ] Last card drop state might not persist across sessions
- [ ] Need better visual feedback when card drops

## 📈 Collection Statistics

### Expected Timeline

**With consistent play:**
- Week 1: ~7-15 cards (completing 70-150 tasks)
- Month 1: ~30-50 cards
- Month 3: ~70-90 cards
- Full collection: ~4-6 months of regular play

**Drop Rate Math:**
- 10% drop rate = 1 card per 10 tasks (average)
- 100 cards total = ~1000 tasks to collect all
- 5 tasks per day = ~200 days to collect all
- RNG can speed up or slow down this timeline!

---

*Happy collecting! The office life is full of memorable moments - capture them all!* 🎴✨
