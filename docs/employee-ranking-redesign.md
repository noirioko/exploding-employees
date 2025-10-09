# Employee Ranking System Redesign

**Status**: 🟡 Design Phase
**Created**: 2025-10-10
**Problem**: Current ranking system is too simplistic (attendance-only) and doesn't handle edge cases well

---

## 🎯 Core Philosophy

**Employees are a mirror of your wellbeing**

The ranking system should reflect:
- Your work-life balance (not overworking)
- Your consistency (building habits)
- Your productivity (getting things done)
- Your self-care (taking breaks when needed)

**It should feel:**
- ✅ Fair and forgiving
- ✅ Motivating, not punishing
- ✅ Reflective of real life
- ❌ NOT gameable or exploitable
- ❌ NOT punishing for legitimate reasons (no tasks, tasks not due)

---

## 🐛 Current Problems

### 1. Noah's Recurring Task Problem
**Issue**: Noah gets penalized even when:
- No recurring tasks exist
- Tasks aren't due that day (monthly bills)
- You're on vacation/break

**Current Logic**: Counts days with completed recurring tasks
**Problem**: Treats all days equally, doesn't account for task schedules

### 2. Oversimplification
**Issue**: Only tracks "did you log something today?" (attendance)
**Missing**:
- Energy management (not overworking)
- Mood/wellbeing
- Quality of work (performance)
- Sustainability (long-term consistency)

### 3. No Visual Feedback
**Issue**: Just shows S/A/B/C/F rank
**Missing**:
- Trends over time (improving vs declining)
- Breakdown of score components
- Historical data visualization
- Comparison across employees

### 4. Binary Thinking
**Issue**: Either "worked" or "didn't work" (1 or 0)
**Reality**: Quality matters, not just quantity
- Completing 10 low-energy tasks ≠ completing 3 high-energy tasks
- Working sustainably ≠ burning out
- Consistency ≠ cramming

---

## 🎨 Proposed Solution: Weighted Score System

### Score Components (100 points total)

#### 1. **Attendance Score** (40 points)
*"Are you showing up consistently?"*

**Calculation:**
```
attendanceScore = (daysWorked / 7) × 40
```

**Special Rules:**
- **Noah (Recurring)**: Only count days when tasks are ACTUALLY due
  - Daily recurring: Every day counts
  - Weekly recurring: Only that weekday counts
  - Monthly recurring: Only that date counts
  - If NO tasks due in a day, day doesn't count against you
- **Minkyu (Finance)**: More forgiving (5 days = 40 points)
- **Others**: Standard 7-day tracking

**Example:**
- 7/7 days worked = 40 points
- 5/7 days worked = 28.6 points
- 3/7 days worked = 17.1 points

---

#### 2. **Energy Management Score** (20 points)
*"Are you taking care of yourself?"*

**Calculation:**
```
// Track energy usage each day
dailyEnergyScores = days.map(day => {
  if (energyUsed <= 6) return 100%  // Healthy range
  if (energyUsed <= 8) return 75%   // Getting stressed
  if (energyUsed <= 9) return 50%   // Overworked
  if (energyUsed >= 10) return 0%   // Burnout!
})

energyManagementScore = average(dailyEnergyScores) × 0.2
```

**Philosophy**:
- Rewards staying in healthy energy range (≤6)
- Penalizes overwork
- Reflects real burnout risk

**Example:**
- All days ≤6 energy = 20 points
- 2 days at 9 energy, rest ≤6 = ~15 points
- Consistently 10+ energy = 0 points

---

#### 3. **Performance Quality Score** (20 points)
*"What did you accomplish?"*

**Calculation:**
```
// Performance levels from getMoraleStatus
dailyPerformanceScores = days.map(day => {
  return performanceLevel / 100  // Already 0-100%
})

performanceQualityScore = average(dailyPerformanceScores) × 0.2
```

**Performance Levels** (from current system):
- 0%: Absolutely nothing to do
- 20%: Slacking (tasks exist, nothing done)
- 50%: Okay (1+ task completed)
- 70%: Good (3+ tasks OR 4+ energy used)
- 100%: Excellent (5+ tasks AND 7+ energy used)

**Example:**
- Average 70% performance = 14 points
- Average 50% performance = 10 points
- Average 100% performance = 20 points

---

#### 4. **Mood/Wellbeing Score** (20 points)
*"How are you feeling?"*

**Calculation:**
```
// Mood levels from getMoraleStatus
dailyMoodScores = days.map(day => {
  return moodLevel / 100  // Already 0-100%
})

moodWellbeingScore = average(dailyMoodScores) × 0.2
```

**Mood Levels** (from current system):
- 0%: Extremely bored (no work)
- 25%: Bored
- 40%: Okay
- 50%: Content
- 70%: Happy
- 80%: Stressed (high but negative)
- 100%: Overworked (negative)
- 120%: Burnout (very negative)

**Special Handling for High Stress:**
```
if (moodLevel > 100) {
  // Burnout - penalize heavily
  moodScore = 0
} else if (moodLevel > 80) {
  // Stressed - cap at 50%
  moodScore = Math.min(moodLevel, 80)
}
```

**Example:**
- Average 60% mood = 12 points
- Average 40% mood = 8 points
- Any day with burnout = 0 for that day

---

### Final Rank Calculation

```javascript
totalScore =
  attendanceScore +         // 0-40 points
  energyManagementScore +   // 0-20 points
  performanceQualityScore + // 0-20 points
  moodWellbeingScore        // 0-20 points

// Total: 0-100 points
```

**Rank Thresholds:**
- **S Rank**: 90-100 points (Excellent - sustainable high performance)
- **A Rank**: 75-89 points (Great - consistent quality work)
- **B Rank**: 60-74 points (Good - solid performance)
- **C Rank**: 40-59 points (Okay - room for improvement)
- **D Rank**: 25-39 points (Poor - struggling)
- **F Rank**: 0-24 points (Failing - need intervention)

---

## 📊 Visualization Ideas

### 1. **Rank Card** (Current View)
```
┌─────────────────────────────────┐
│  YUWON - Daily Tasks            │
│  ┌─────┐                         │
│  │  A  │  82 / 100 points       │
│  └─────┘                         │
│                                  │
│  📊 Breakdown:                   │
│  ├─ Attendance:    35/40 ⭐⭐⭐⭐☆│
│  ├─ Energy Mgmt:   18/20 ⭐⭐⭐⭐⭐│
│  ├─ Performance:   14/20 ⭐⭐⭐☆☆│
│  └─ Wellbeing:     15/20 ⭐⭐⭐⭐☆│
└─────────────────────────────────┘
```

### 2. **Trend Graph** (7-day history)
```
Score History (Last 7 Days)
100 ┤         ╭─╮
 90 ┤       ╭─╯ ╰╮
 80 ┤     ╭─╯    ╰╮
 70 ┤   ╭─╯       ╰─╮
 60 ┤ ╭─╯           ╰─
    └─────────────────
     S M T W T F S
```

### 3. **Component Radar Chart**
```
     Attendance
         ⭐
         │
Mood ⭐──┼──⭐ Energy
         │
         ⭐
    Performance
```

### 4. **Weekly Summary Card**
```
┌──────────────────────────────┐
│  THIS WEEK'S SUMMARY         │
├──────────────────────────────┤
│  📅 Days Active:    6/7      │
│  ⚡ Avg Energy:     5.2/10   │
│  📈 Avg Score:      78 pts   │
│  🎯 Tasks Done:     24       │
│  🏆 Best Day:       Monday   │
│  😴 Rest Taken:     2 times  │
└──────────────────────────────┘
```

---

## 🔧 Implementation Plan

### Phase 1: Data Collection Enhancement
**Goal**: Start tracking all necessary metrics

1. **Update `getMoraleStatus()` to return**:
   ```javascript
   {
     // Existing
     mood, moodLevel, performance, performanceLevel,
     rank, rankColor, daysWorked,

     // New
     energyHistory: [6, 5, 7, 4, 8, 5, 6],  // Last 7 days
     performanceHistory: [70, 80, 60, ...], // Last 7 days
     moodHistory: [60, 55, 70, ...],        // Last 7 days
     attendanceHistory: [1, 1, 1, 0, 1...], // Last 7 days

     // Scores
     attendanceScore: 35,
     energyManagementScore: 18,
     performanceQualityScore: 14,
     moodWellbeingScore: 15,
     totalScore: 82,

     // Metadata
     calculationMethod: 'weighted',
     noahDueDaysCount: 5  // For Noah, days with due tasks
   }
   ```

2. **Create helper functions**:
   - `calculateAttendanceScore(employee, days)`
   - `calculateEnergyManagementScore(employee, days)`
   - `calculatePerformanceScore(employee, days)`
   - `calculateMoodScore(employee, days)`
   - `calculateWeightedRank(scores)`

3. **Special Noah Logic**:
   ```javascript
   // Only count "due days" for Noah
   const getDueDaysForNoah = (last7Days) => {
     return last7Days.filter(date => {
       return recurringTasks.some(task =>
         isTaskDueOnDate(task, date)
       )
     })
   }
   ```

### Phase 2: UI Implementation
**Goal**: Display new ranking system

1. **Update Company.jsx**:
   - Show score breakdown (40/20/20/20)
   - Add star ratings for each component
   - Show total score out of 100

2. **Add Stats Panel**:
   - Create new `EmployeeStatsPanel.jsx` component
   - 7-day trend graph
   - Weekly summary
   - Historical comparison

3. **Add Tooltips**:
   - Hover over rank to see explanation
   - Hover over score components for details
   - Show "why" you got this rank

### Phase 3: Visualization
**Goal**: Make data beautiful and useful

1. **Install chart library** (optional):
   - Chart.js or Recharts for graphs
   - OR custom CSS/SVG for simplicity

2. **Create visualizations**:
   - Line chart for trend
   - Radar chart for components
   - Progress bars for scores

3. **Add export/screenshot**:
   - "Share my stats" button
   - Export as image

---

## 🧪 Testing Strategy

### Test Cases

#### 1. Normal Usage
```
Input:
- 7 days worked
- Average 5 energy/day
- 3 tasks/day
- Happy mood

Expected:
- Attendance: 40/40
- Energy: 20/20
- Performance: ~14/20 (70%)
- Mood: ~12/20 (60%)
- Total: ~86 = A Rank ✅
```

#### 2. Noah with Sparse Recurring Tasks
```
Input:
- 1 monthly task (due on 5th)
- Only 1 due day in last 7 days
- Completed on that day

Expected:
- Attendance: 40/40 (1/1 due days)
- Noah should NOT be penalized ✅
```

#### 3. Overwork Scenario
```
Input:
- 7 days worked
- 10+ energy every day
- 8 tasks/day (high output)
- Burnout mood (120%)

Expected:
- Attendance: 40/40
- Energy: 0/20 (burnout!)
- Performance: 20/20 (excellent)
- Mood: 0/20 (burnout penalty)
- Total: 60 = B Rank
- Message: "Take a break!" ⚠️
```

#### 4. Inconsistent Work
```
Input:
- 3 days worked out of 7
- Days worked: good energy (5), good performance (70%), happy mood (60%)
- Days not worked: no data

Expected:
- Attendance: 17/40 (3/7)
- Energy: ~17/20 (85% of days worked)
- Performance: ~14/20 (70%)
- Mood: ~12/20 (60%)
- Total: ~60 = B Rank
```

---

## 🎯 Success Criteria

The redesign is successful if:

1. ✅ **Fair**: Noah isn't penalized for no due tasks
2. ✅ **Balanced**: Can't get S rank by just grinding (must be sustainable)
3. ✅ **Clear**: Players understand why they got their rank
4. ✅ **Motivating**: Encourages healthy work-life balance
5. ✅ **Reflective**: Mirrors real wellbeing (not just productivity)
6. ✅ **Visual**: Easy to see trends and improvement areas

---

## 🔮 Future Enhancements

### V2 Features (After Initial Release)

1. **Achievements**:
   - "Perfect Week" (S rank all 7 days)
   - "Work-Life Balance" (Never overworked for 30 days)
   - "Comeback" (F to A in one week)

2. **Seasonal Adjustments**:
   - Holiday mode (more forgiving)
   - Vacation mode (pause tracking)
   - Crunch time mode (temporarily allow overwork)

3. **Predictions**:
   - "If you keep this pace, you'll get A rank by Friday"
   - "Warning: 2 more high-energy days will cause burnout"

4. **Social Features**:
   - Compare ranks with friends
   - Global leaderboard (anonymous)
   - Share stats on social media

5. **Insights**:
   - "Your best day is Monday"
   - "You tend to overwork on Fridays"
   - "Your mood improves when you rest"

---

## ❓ Open Questions

1. **Should we keep simple mode?**
   - Option A: Only weighted system
   - Option B: Let users toggle between simple (attendance) and advanced (weighted)

2. **How to handle data migration?**
   - Existing users will lose historical ranks
   - Should we recalculate from completed tasks history?

3. **Should overwork be MORE penalized?**
   - Current: 0 points for energy management
   - Alternative: NEGATIVE points that reduce other scores

4. **How to visualize on mobile?**
   - Charts might be hard to see on small screens
   - Need responsive design

5. **Should Noah's "due days" be visible?**
   - Show "3 due days this week, completed 3" in UI?
   - Help users understand the scoring?

---

## 📝 Next Steps

1. **Review this document** - Discuss and refine the design
2. **Update ISSUES.md** - Document this as planned feature
3. **Update employee-morale.md** - Reflect new scoring system
4. **Implement Phase 1** - Data collection
5. **Test Phase 1** - Verify calculations
6. **Implement Phase 2** - UI updates
7. **User testing** - Get feedback
8. **Iterate** - Refine based on usage

---

## 💬 Discussion Notes

*(Add notes from discussions here)*

-

---

**Status**: 🟡 Awaiting Review
**Next Action**: Review and approve design, or suggest changes
