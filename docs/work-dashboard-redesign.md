# 📋 Work Dashboard Redesign

**Status:** Planning Phase
**Date:** 2025-10-14
**Goal:** Transform the Home page from a long vertical scroll into a flexible, Notion-style sidebar layout with gamified features.

---

## 🎯 Problems with Current Design

1. **Long vertical scroll** - Everything is stacked, hard to focus
2. **No organization** - TodoList, Habits, Finance all mixed together
3. **No interactivity** - Just static lists, no timers or gamification
4. **Energy slider placement** - Takes up a lot of space
5. **Missing features** - No pomodoro, no wishlist, no boss mode

---

## 🎨 Proposed Layout

```
┌────────────────────────────────────────────────────────┐
│ 🏢 AXIS Logo + Main Nav (Home/Company/Record/etc)     │ ← Header 1 (Global)
├────────────────────────────────────────────────────────┤
│ ⚡ Energy: [====] 5/10  |  Daily Goal: 5 tasks today  │ ← Header 2 (Work page only - COMPACT)
├──────────┬─────────────────────────────────────────────┤
│          │                                             │
│ SIDEBAR  │           MAIN CONTENT AREA                 │
│          │                                             │
│ ✅ Todo  │  [Shows selected section from sidebar]     │
│ 🔄 Habits│                                             │
│ 📅 Recur │  - TodoList with tasks                     │
│ 💰 Finance│  - Or Habits tracker                      │
│   • Trans│  - Or Recurring tasks                      │
│   • Wish │  - Or Finance (with subcategories)         │
│   • Budget│ - Or Pomodoro/Boss Mode                   │
│ ⏱️ Timer │                                             │
│          │                                             │
└──────────┴─────────────────────────────────────────────┘
```

---

## 🎮 New Features

### 1. **Sidebar Navigation** (Left Side)
- ✅ **TodoList** (Yuwon) - Click to show todo tasks
- 🔄 **Habits** (Jaehyun) - Click to show habit tracker
- 📅 **Recurring** (Noah) - Click to show recurring tasks
- 💰 **Finance** (Minkyu) - Click to expand subcategories:
  - 💸 Transactions (current finance logs)
  - 🛍️ Wishlist (things you want but didn't buy!)
  - 📊 Budget Goals
- ⏱️ **Timer** (Pomodoro/Boss Mode)

### 2. **Pomodoro = Boss Mode** 🔥

**Concept:** The pomodoro timer isn't just a timer - it's Noah watching you work!

**Flow:**
1. Click "⏱️ Timer" in sidebar
2. See 3 mode options:
   - 🕐 **Clock In** (Normal) - Standard 25min/5min break, chill vibes
   - 👀 **Noah is Around** - Boss is watching! Bonus rewards
   - 🔥 **Boss from Hell** - High pressure! Best rewards, can't skip
3. Select tasks from TodoList to focus on
4. Start timer → Noah appears with dialogues based on mode
5. Complete session → Auto-log completed tasks + rewards

**Boss Mode Features:**
- **Dialogue system** - Noah gives orders/encouragement based on mode
- **Task selection** - Pick which tasks to work on during this session
- **Auto-logging** - Completed tasks auto-marked when timer ends
- **Rewards scaling** - Boss from Hell gives better rewards
- **Can't skip** - In Boss from Hell mode, you're locked in!

### 3. **Finance Wishlist** 🛍️

**Purpose:** Track things you WANT to buy but resist (delayed gratification!)

**Features:**
- Add items you're tempted to buy
- Track "Days Resisted"
- Get rewards for resisting longer
- Eventually move to "Bought!" or "Not interested anymore"

**UI:**
```
🛍️ Wishlist
┌─────────────────────────────────────┐
│ Nintendo Switch - $299              │
│ Days resisted: 12 🔥                │
│ [Still want] [Not interested] [Buy] │
└─────────────────────────────────────┘
```

### 4. **Compact Energy Header**

**Current:** Takes up a lot of vertical space with slider + daily goal + description

**Proposed:** Single compact line
```
⚡ Energy: [========] 5/10  |  Daily Goal: 5 tasks today  |  🌙 Resets at midnight
```

- Horizontal slider (smaller)
- Daily goal inline
- One-line layout
- Always visible at top of Work page

---

## 📐 Technical Details

### Layout Structure

**Component Hierarchy:**
```
<Home>
  <CompactEnergyHeader />
  <div className="work-dashboard">
    <Sidebar
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    />
    <MainContent>
      {activeSection === 'todolist' && <TodoList />}
      {activeSection === 'habits' && <Habits />}
      {activeSection === 'recurring' && <RecurringTasks />}
      {activeSection === 'finance-transactions' && <FinanceLogs />}
      {activeSection === 'finance-wishlist' && <Wishlist />}
      {activeSection === 'finance-budget' && <BudgetGoals />}
      {activeSection === 'timer' && <PomodoroTimer />}
    </MainContent>
  </div>
</Home>
```

### State Management

**New state needed:**
```javascript
const [activeSection, setActiveSection] = useState('todolist');
const [pomodoroMode, setPomodoroMode] = useState('normal'); // 'normal' | 'noah-around' | 'boss-hell'
const [selectedTasks, setSelectedTasks] = useState([]); // For pomodoro
const [wishlistItems, setWishlistItems] = useState([]); // For wishlist
```

### Sidebar Styling
- Fixed width (200px?)
- Sticky scroll
- Highlight active section
- Collapse/expand for Finance subcategories
- Icons + labels

### Responsive Design
- Mobile: Sidebar becomes bottom nav or hamburger menu
- Tablet: Keep sidebar but narrower
- Desktop: Full sidebar layout

---

## 🎯 Implementation Plan

### Phase 1: Layout Structure
- [ ] Create CompactEnergyHeader component
- [ ] Create Sidebar component with navigation
- [ ] Add state management for active section
- [ ] Update Home.jsx with new layout
- [ ] Add CSS for sidebar + main content grid

### Phase 2: Pomodoro/Boss Mode
- [ ] Create PomodoroTimer component
- [ ] Add mode selection UI (Clock In / Noah is Around / Boss from Hell)
- [ ] Task selection system
- [ ] Timer logic (25min work / 5min break)
- [ ] Noah dialogue system based on mode
- [ ] Auto-logging completed tasks
- [ ] Rewards calculation

### Phase 3: Finance Wishlist
- [ ] Create Wishlist component
- [ ] Add wishlist state to AppContext
- [ ] Add "Days Resisted" tracking
- [ ] UI for adding/managing wishlist items
- [ ] Rewards for delayed gratification

### Phase 4: Polish & Testing
- [ ] Mobile responsive design
- [ ] Animations and transitions
- [ ] Test all sections
- [ ] Update documentation

---

## 💭 Design Decisions

### Why Sidebar?
- **Focus:** Only see one section at a time
- **Organization:** Clear categories instead of long scroll
- **Flexibility:** Easy to add new sections later
- **Familiar:** Notion/Slack/Discord all use sidebars

### Why Pomodoro = Boss Mode?
- **Gamification:** Makes work feel like a game
- **Motivation:** Noah's dialogue keeps you engaged
- **Integration:** Timer + tasks + rewards all in one
- **Fun:** "Boss from Hell" mode sounds way more fun than "intense pomodoro"

### Why Wishlist?
- **Real need:** User mentioned wanting to track things they resist buying
- **Positive reinforcement:** Celebrate delayed gratification
- **Finance integration:** Fits naturally with Minkyu's role
- **Simple:** Easy to understand and use

---

## 🤔 Open Questions

1. **Energy slider behavior:** Should it persist across page refreshes within the same day?
   - **Answer:** Yes - it already does with localStorage

2. **Sidebar collapse:** Should sidebar be collapsible to give more space to main content?
   - **To discuss:** Maybe add a toggle button?

3. **Boss Mode rewards:** What kind of rewards? Just exp/won, or something special?
   - **To discuss:** Maybe special "Noah's Approval" currency or badges?

4. **Wishlist rewards:** How to reward delayed gratification?
   - **Ideas:** Badge system? Achievement tracking? Exp bonus?

5. **Mobile layout:** Bottom nav or hamburger menu for sidebar?
   - **To discuss:** Bottom nav is more accessible, hamburger is cleaner

---

## 🎨 Visual Mockup Ideas

### Sidebar (Collapsed)
```
┌─────┐
│ ✅  │ TodoList
│ 🔄  │ Habits
│ 📅  │ Recurring
│ 💰▼ │ Finance (expanded)
│  💸 │   Transactions
│  🛍️ │   Wishlist
│  📊 │   Budget
│ ⏱️  │ Timer
└─────┘
```

### Boss Mode Screen
```
┌────────────────────────────────────┐
│ 👔 Noah's Boss Mode                │
│                                    │
│ Select your challenge:             │
│                                    │
│ [🕐 Clock In]                      │
│ Normal mode - Chill work session   │
│                                    │
│ [👀 Noah is Around]                │
│ Boss is watching! +20% rewards     │
│                                    │
│ [🔥 Boss from Hell]                │
│ High pressure! +50% rewards        │
│ ⚠️ Can't skip or cancel!           │
│                                    │
│ Select tasks to work on:           │
│ ☐ Design homepage mockups          │
│ ☐ Review code for bugs             │
│ ☐ Write documentation              │
│                                    │
│         [START SESSION]            │
└────────────────────────────────────┘
```

---

## 📝 Notes for Future Implementation

- Keep current Home.jsx as backup (`Home.old.jsx`)
- Build new components incrementally
- Test each phase before moving to next
- Get user feedback on sidebar layout before full implementation
- Consider adding keyboard shortcuts (j/k for navigation?)
- Maybe add drag-and-drop to reorder sidebar sections?

---

## 🔗 Related Documents

- `employee-morale.md` - Morale system (affects boss mode dialogues)
- `task-system.md` - Task types and mechanics
- `currency-system.md` - Rewards and exp system
- `ISSUES.md` - Track bugs during implementation

---

**Next Steps:**
1. Review this design doc with user
2. Get feedback on layout and features
3. Start Phase 1 implementation (layout structure)
4. Iterate based on testing and feedback
