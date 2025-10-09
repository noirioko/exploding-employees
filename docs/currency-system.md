# Currency & Economy System

Exploding Employees has a multi-currency economy system for purchasing items, unlocking features, and tracking finances.

## 💰 The Three Currencies

### 1. Won (₩) - Company Earnings
**Type**: Accumulated currency (not directly spendable)

**How to Earn:**
- Complete any task (daily, habit, recurring, finance, impossible)
- Amount earned depends on task energy level:
  - Low energy: 10 won
  - Med energy: 25 won
  - High energy: 50 won

**Accumulation:**
- Won accumulates in "Accumulated Won" balance
- Displayed on Company page
- Represents company earnings that haven't been paid out yet

**Conversion:**
- Must be converted to YuCash to spend
- Use "Give Paycheck" button on Company page
- Converts all accumulated won → YuCash 1:1 ratio
- Resets accumulated won to 0 after conversion

**Why Two Currencies?**
- Simulates real work-to-paycheck flow
- Encourages saving up before spending
- Adds satisfaction of "payday"

---

### 2. YuCash - Spendable Currency
**Type**: Spendable currency (like cash in your wallet)

**How to Earn:**
- Convert accumulated won using "Give Paycheck" button
- 1 won = 1 YuCash (1:1 conversion)

**What You Can Buy:**
- **Ingredients** (Store page): 50-200 YuCash each
- **Gacha Rolls** (Store page): 100 YuCash per roll
- **AU Book Snippets** (Library page): 50-500 YuCash per snippet
- **Furniture** (Coming soon): Varies by item

**Current Balance:**
- Displayed on Store page, Library page, Company page
- Persists across sessions (saved to localStorage)

**Strategy Tips:**
- Save up before going on shopping sprees
- Balance between gacha, cooking, and story unlocks
- Ingredients are relatively cheap, gacha is mid-tier, AU snippets vary

---

### 3. Noah Credit Card - Premium Currency
**Type**: Special/premium currency (rare)

**How to Earn:**
- Special events (to be implemented)
- Achievements (to be implemented)
- Currently not actively used in game

**Future Uses:**
- Premium furniture
- Exclusive gacha pools
- Skip timers or cooldowns
- Special AU books

**Note:** Currently a placeholder for future premium features

---

## 💳 Currency Flow Diagram

```
Complete Task
    ↓
Earn Won (10/25/50)
    ↓
Won accumulates in "Accumulated Won"
    ↓
Click "Give Paycheck" button
    ↓
Accumulated Won → YuCash (1:1)
    ↓
Spend YuCash on features
```

---

## 🏪 Spending Guide

### Store Page (`/store`)

**Ingredients Section:**
- Raw ingredients for cooking
- Prices: 50-200 YuCash each
- Buy in bulk or individually
- Check inventory to see what you have

**Gacha Section:**
- Roll for AU Books
- Cost: 100 YuCash per roll
- 20 total AU books to collect
- Random drops, no duplicates

**Example Prices:**
- Rice: 50 YuCash
- Vegetables: 100 YuCash
- Meat: 150 YuCash
- Special ingredients: 200 YuCash

---

### Library Page (`/library`)

**AU Book Snippets:**
- Each AU book has multiple story snippets (blurred by default)
- Cost varies by snippet: 50-500 YuCash
- Some snippets are more expensive (juicier content!)
- Once unlocked, snippets stay unlocked forever
- Track "Juice Spent" per book

**Strategy:**
- Unlock cheapest snippets first to get story flow
- Save expensive snippets for when you have extra cash
- Focus on favorite characters/AUs first

---

## 💸 Finance Task Integration

Finance tasks have a special relationship with the currency system:

**Positive Finance Tasks (+amount):**
- Represents income (salary, freelance, gifts, etc.)
- Earns won like normal tasks (10/25/50 based on energy)
- The +amount is for tracking only, doesn't add extra won
- Example: "Freelance payment +50000" still earns 10-50 won based on energy

**Negative Finance Tasks (-amount):**
- Represents expenses (bills, purchases, etc.)
- Still earns won like normal tasks (yes, even expenses!)
- The -amount is for tracking only, doesn't deduct won
- Example: "Rent payment -500000" still earns 10-50 won

**Why do expenses earn won?**
- Game design: completing any task = productivity = earning
- Realistic: tracking finances itself is productive work
- Alternative: Think of it as "you saved money by tracking your expenses"

**Budget Tracking:**
- Finance tasks are tracked separately on Record page
- Income and spending totals are calculated
- Budget goals can be set (weekly/monthly/yearly)
- Purely for tracking, doesn't affect YuCash balance

---

## 📊 Currency Display

### Company Page
- Shows "Accumulated Won" (unconverted)
- Shows "YuCash" balance
- Shows "Give Paycheck" button to convert
- Shows total EXP

### Store Page
- Shows "YuCash" balance prominently
- Updates in real-time when purchasing

### Library Page
- Shows "YuCash" balance
- Shows "Juice Spent" per AU book
- Shows cost of each snippet

### Dashboard/Header
- Consider adding YuCash balance to header (coming soon)

---

## 🎮 Economy Balance

### Earning Rates

**Per Task:**
- Low energy: 10 won (1-2 min task)
- Med energy: 25 won (5-10 min task)
- High energy: 50 won (20+ min task)

**Per Day (example):**
- Complete 5 low energy tasks = 50 won
- Complete 3 med energy tasks = 75 won
- Complete 2 high energy tasks = 100 won
- Typical productive day = 150-250 won

**Per Week:**
- Consistent work = ~1000-1500 won
- Enough for 10-15 gacha rolls or lots of cooking

### Spending Rates

**Ingredients:**
- Full meal ingredients = ~300-500 YuCash
- Can cook 3-5 dishes per productive day

**Gacha:**
- 100 YuCash per roll
- Need ~2000 YuCash to collect all 20 books (if unlucky)
- Average player: collect all books in 2-3 weeks

**AU Snippets:**
- Total cost per book = ~1000-3000 YuCash
- Full library unlock = ~30,000-50,000 YuCash
- Long-term goal (months of gameplay)

---

## 💡 Economy Strategy Tips

1. **Give paycheck regularly** - Don't let accumulated won sit idle
2. **Budget your spending** - Decide if you want to focus on cooking, gacha, or story
3. **Complete high energy tasks** - Most won per task
4. **Don't worry about efficiency** - Game is meant to be relaxing
5. **Finance tracking is separate** - Your +/- finance amounts don't affect your won earnings

---

## 🔮 Planned Features

- [ ] Daily login bonus (free YuCash)
- [ ] Achievements award YuCash
- [ ] Noah Credit Card earning mechanics
- [ ] Premium currency purchases (Noah Credit Card)
- [ ] Currency conversion rates adjustable
- [ ] Discount events in store
- [ ] "Bankrupt" state if you spend too much (just kidding... unless?)

---

## 🐛 Known Issues

- None currently! Currency system is working as intended.

---

## 📈 Progression Timeline

**Week 1:**
- Earn ~1000-1500 won
- Unlock 5-10 gacha books
- Cook a few dishes
- Unlock some cheap AU snippets

**Month 1:**
- Earn ~5000-7000 won
- Collect all 20 AU books from gacha
- Focus on unlocking favorite AU stories
- Build cooking recipe collection

**Long Term:**
- Earn ~20,000+ won
- Unlock most/all AU snippets
- Max out cooking recipes
- Collect all furniture (coming soon)
- Save for future features

---

*The economy is designed to be generous and rewarding - you should never feel starved for currency!*
