# Cooking & Gift System

An interactive cooking system where you buy ingredients, discover recipes, cook dishes, and gift them to employees to increase friendship!

## 👨‍🍳 Cooking Overview

The cooking system adds a fun side activity to the game:
- Buy ingredients from the Store
- Discover recipes by cooking
- Cook dishes with ingredients you own
- Gift dishes to employees
- Build friendship points

## 🛒 Buying Ingredients

### Store Page (`/store`)

**Ingredients Available:**
- Various raw ingredients (vegetables, meat, spices, etc.)
- Each ingredient has a price (50-200 YuCash)
- Buy one at a time or in bulk
- Ingredients go into your inventory

**Pricing Examples:**
- Basic vegetables: 50 YuCash
- Rice/grains: 75 YuCash
- Meat/protein: 150 YuCash
- Special ingredients: 200 YuCash

**Inventory:**
- Track quantity of each ingredient owned
- Displayed on Store page or Kitchen page
- Ingredients never expire
- Can stockpile as much as you want

## 📖 Recipe System

### Discovering Recipes

**Discovery Methods:**

1. **Cooking Discovery (Primary)**
   - Try combining ingredients
   - If valid recipe, discover it!
   - Recipe saved to "Discovered Recipes" list
   - Can repeat recipe anytime

2. **Recipe Hints (Future)**
   - NPCs give recipe hints
   - Recipe book collectibles
   - Achievements unlock recipes

### Recipe Structure

Each recipe requires:
- Specific ingredients + quantities
- Example: "Kimchi Fried Rice" needs:
  - 1× Rice
  - 1× Kimchi
  - 1× Egg
  - 1× Sesame Oil

### Recipe Categories

**Korean Dishes:**
- Kimchi Fried Rice
- Bibimbap
- Tteokbokki
- Bulgogi
- Japchae
- Korean Fried Chicken

**Comfort Foods:**
- Ramen
- Grilled Cheese
- Mac & Cheese
- Chicken Soup
- Pizza

**Desserts:**
- Cookies
- Cake
- Ice Cream
- Boba Tea

**Drinks:**
- Coffee
- Tea
- Smoothies
- Hot Chocolate

**Total Recipes:** 30+ discoverable recipes

## 🍳 Cooking Process

### How to Cook

1. Go to Kitchen/Cooking interface (Store page or separate Kitchen page)
2. Select a recipe (if discovered) or experiment with ingredients
3. Check if you have required ingredients
4. Click "Cook" button
5. Ingredients are consumed
6. Dish is added to inventory

### Cooking Interface

**Recipe List:**
- Shows all discovered recipes
- Grayed out if missing ingredients
- Shows ingredient requirements
- Click to cook

**Experimental Cooking:**
- Select ingredients manually
- Try combinations
- If valid recipe → discover + cook
- If invalid → "Nothing happened" (ingredients wasted? Or returned?)

**Inventory Display:**
- Shows your ingredients (left side)
- Shows cooked dishes (right side)
- Quantities for each item

## 🎁 Gifting Dishes

### Friendship System Integration

**Give Gift:**
- Go to Company page or Room page
- Click employee you want to gift to
- Select dish from your inventory
- Dish is consumed
- Employee reacts
- Friendship points increase!

### Friendship Points

**Point Gains:**
- Each dish has base friendship value
- Some employees prefer certain dishes (bonus points!)
- Gifting favorite dish = 2× points

**Employee Preferences:**

**Yuwon:**
- Loves: Coffee, comfort food, sweets
- Likes: Most dishes
- Bonus: Caffeinated drinks +50% points

**Noah:**
- Loves: Expensive dishes, desserts, fancy food
- Likes: Most dishes except simple ones
- Bonus: Premium ingredients +50% points

**Jaehyun:**
- Loves: Healthy food, salads, smoothies
- Likes: Most dishes
- Bonus: Vegetables/fruits +50% points

**Minkyu:**
- Loves: Korean food, spicy food, traditional dishes
- Likes: Most dishes
- Bonus: Korean recipes +50% points

### Friendship Levels

**Point Ranges:**
- 0-250 points: Acquaintance 🤝 (1-2 hearts)
- 250-500 points: Friend 😊 (3-4 hearts)
- 500-1000 points: Close Friend 💚 (5-6 hearts)
- 1000-1500 points: Best Friend 💙 (7-8 hearts)
- 1500-2500 points: Soulmate 💖 (9-10 hearts)

**Max Friendship:** 2500 points (10 hearts)

### Friendship Rewards

**Unlocks at Different Levels:**
- **2 hearts**: Employee sends thank you message
- **4 hearts**: Unlock special dialogue
- **6 hearts**: Unlock personal story snippet
- **8 hearts**: Unlock special AU book (free!)
- **10 hearts**: Unlock secret ending, special furniture, character customization

## 🍽️ Dish Properties

### Dish Categories

**Simple Dishes (1-2 ingredients):**
- Friendship value: +25 points
- Cost: ~100-150 YuCash in ingredients
- Examples: Fried Egg, Toast, Tea

**Standard Dishes (3-4 ingredients):**
- Friendship value: +50 points
- Cost: ~200-400 YuCash in ingredients
- Examples: Kimchi Fried Rice, Grilled Cheese, Ramen

**Complex Dishes (5+ ingredients):**
- Friendship value: +100 points
- Cost: ~500-800 YuCash in ingredients
- Examples: Bibimbap, Bulgogi, Korean Fried Chicken

**Premium Dishes (rare ingredients):**
- Friendship value: +150 points
- Cost: ~1000+ YuCash in ingredients
- Examples: Fancy Sushi, Gourmet Steak, Special Desserts

## 🎮 Gameplay Loop

```
Buy Ingredients (Store)
    ↓
Cook Dishes (Kitchen)
    ↓
Gift to Employees (Company/Room)
    ↓
Earn Friendship Points
    ↓
Unlock Rewards & Stories
    ↓
Repeat!
```

## 💡 Strategy Tips

### Efficient Cooking

1. **Buy in bulk** - Stock up on common ingredients
2. **Discover recipes first** - Don't waste ingredients experimenting
3. **Cook employee favorites** - Get bonus friendship points
4. **Balance variety** - Try different dishes for fun
5. **Save premium dishes** - Use for higher friendship levels

### Friendship Grinding

1. **Focus on one employee** - Max out one at a time
2. **Daily gifts** - Give one gift per day to each employee
3. **Preferences matter** - Always gift favorite dishes for bonus
4. **Cost efficiency** - Simple dishes are enough early on
5. **Long-term investment** - Premium dishes for final friendship levels

### Budget Management

**Cooking vs Other Features:**
- Cooking competes with gacha and AU snippets for YuCash
- Balance your spending based on goals
- Cooking = gameplay feature + character interaction
- Gacha = story content + collection

**Cost Comparison:**
- 1 gacha roll = 100 YuCash
- 1 simple dish = ~150 YuCash
- 1 complex dish = ~500 YuCash
- Max friendship (one employee) = ~3,000-5,000 YuCash

## 🔮 Planned Features

- [ ] Recipe book interface (dedicated page)
- [ ] Cooking mini-game (timed ingredient selection)
- [ ] Recipe rating/difficulty
- [ ] Cooking achievements
- [ ] Cooking levels/skill progression
- [ ] Restaurant/café feature (sell dishes for won)
- [ ] Employee requests specific dishes
- [ ] Seasonal recipes
- [ ] Recipe sharing (export/import with friends)
- [ ] Cooking competitions/challenges

## 🐛 Known Issues

- [ ] Ingredient inventory may not update immediately after cooking
- [ ] Some recipes may have incorrect ingredient requirements
- [ ] Gifting animation could be improved
- [ ] Friendship point calculations need verification

## 📊 Recipe Data Structure

```javascript
{
  id: 'recipe_kimchi_fried_rice',
  name: 'Kimchi Fried Rice',
  description: 'A delicious Korean comfort food',
  category: 'korean',
  difficulty: 'easy',
  ingredients: [
    { id: 'rice', amount: 1 },
    { id: 'kimchi', amount: 1 },
    { id: 'egg', amount: 1 },
    { id: 'sesame_oil', amount: 1 }
  ],
  friendshipValue: 50,
  cookingTime: '15 minutes',
  image: '/images/dishes/kimchi_fried_rice.png',
  characterPreference: {
    yuwon: 1.0, // normal
    noah: 1.0,
    jaehyun: 1.0,
    minkyu: 1.5  // 50% bonus (Korean food)
  }
}
```

## 🎨 UI/UX Elements

### Kitchen Interface

**Ingredient Panel:**
- Grid view of all ingredients
- Shows owned quantity
- Click to add to recipe builder

**Recipe Panel:**
- List of discovered recipes
- Preview ingredients needed
- "Cook" button (enabled if have ingredients)

**Dishes Panel:**
- Grid view of cooked dishes in inventory
- Shows quantity
- Click to gift or consume

### Gift Animation

**When Gifting:**
1. Dish icon floats to employee
2. Employee reacts with emoji/animation
3. Friendship points increase animation (+50 ✨)
4. Heart particles
5. Thank you message from employee

---

*Cook delicious meals and win your employees' hearts through their stomachs!* 🍳💖
