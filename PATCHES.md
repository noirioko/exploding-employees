# 📝 Patch Notes

A daily log of changes, fixes, and improvements to Exploding Employees.

---

## 2025-10-10 - Phase 1: Core Morale System Fixes

### 🎯 Goal
Fix critical issues with employee morale system and improve user experience based on feedback.

### ✅ Changes Implemented

#### 1. **Fixed Homepage Energy Goals** (`src/pages/Home.jsx`)
- **Problem**: Daily goal showed up to 20 tasks/day, causing 2× overwork
- **Fix**: Changed `getDailyGoal()` function (lines 41-54) to show realistic task counts
  - Energy 0-1: 1 task/day
  - Energy 2-5: 2-5 tasks/day
  - Energy 6-10: 6-10 tasks/day (max safe limit)
- **Impact**: Users won't accidentally overwork by following the daily goal

#### 2. **Fixed Noah's Ranking System** (`src/context/AppContext.jsx`)
- **Problem**: Noah got F rank even when no recurring tasks were due that day/week/month
- **Fix**: Rewrote Noah's ranking logic (lines 466-555) to only count "due days"
  - Daily tasks: Every day counts
  - Weekly tasks: Only count the specific weekday (e.g., Monday)
  - Monthly tasks: Only count the specific date (e.g., 15th)
  - Bi-monthly tasks: Only count the 2 specific dates
  - No tasks due in 7 days = B rank by default (benefit of doubt)
- **Impact**: Noah's rank now accurately reflects performance, not just existence of tasks

#### 3. **Added Score Breakdown Display** (`src/pages/Company.jsx`)
- **Addition**: New "📊 Last 7 Days" panel on each employee card (lines 799-830)
- **Shows**:
  - Days Worked: X/7 (green)
  - Today Energy: X/10 (color-coded: green/orange/red)
  - Today Tasks: X completed (blue)
- **Impact**: Quick visibility into performance metrics without overwhelming detail

#### 4. **Auto-Reset Energy at Midnight** (`src/pages/Home.jsx`)
- **Addition**: Energy slider automatically resets to 5 each day (lines 12-59)
- **How it works**:
  - Saves energy level to localStorage
  - Tracks last date with `energyLastDate`
  - Checks every minute for date changes
  - Auto-resets to 5 at midnight
- **Impact**: One less click for ADHD users! 🎉

### 📊 Files Changed
- `src/pages/Home.jsx` - Energy goals + auto-reset
- `src/context/AppContext.jsx` - Noah ranking logic
- `src/pages/Company.jsx` - Score breakdown display

### 🧪 Testing
- ✅ Build succeeded with no errors
- ✅ All TypeScript/React validations passed
- ⏳ Manual testing needed (Noah's due days logic, midnight reset)

### 📚 Related Documentation
- See `docs/employee-ranking-redesign.md` for full design discussion
- See `docs/employee-morale.md` for morale system overview
- See `docs/ISSUES.md` for list of remaining bugs

### 💭 Notes for Future Claude
- This was "Phase 1" of a larger morale system redesign
- Phase 2 (weighted scoring) was postponed to keep things simple
- User feedback: "lets keep it simple, not overwhelming"
- Noah's due days logic uses `task.recurrence`, `task.recurDay`, `task.recurDate`, and `task.recurDates`
- Energy system: 10 points max, low=1, med=2, high=3

### 🔜 Next Steps (Not Done Yet)
- Test Noah's ranking with various recurring task schedules
- Test midnight energy reset (need to wait until midnight!)
- Consider adding "Life Modes" for Minkyu (no-buy month, jobless mode, etc.)
- Consider adding sleep tracking system (affects all employees)

---

## Template for Future Patches

```markdown
## YYYY-MM-DD - Brief Description

### 🎯 Goal
What we're trying to achieve

### ✅ Changes Implemented
1. **Feature/Fix Name** (`file.js`)
   - **Problem**: What was wrong
   - **Fix**: What we did
   - **Impact**: How it helps

### 📊 Files Changed
- List of modified files

### 🧪 Testing
- Test results

### 💭 Notes for Future Claude
- Important context

### 🔜 Next Steps
- What's still todo
```

---

## Archive

*(Older patches will be moved here as needed)*
