# Task System

The task system is the core gameplay mechanic of Exploding Employees. Tasks are created by you and automatically assigned to employees based on task type.

## 📋 Task Types

### 1. Daily Tasks (To-Do List)
- **Assigned to**: Yuwon
- **Icon**: 📋
- **Behavior**: One-time tasks that are deleted when completed
- **Use for**: Normal daily to-dos, errands, work tasks, one-off activities
- **Example**: "Buy groceries", "Finish report", "Call dentist"

### 2. Habit Tasks
- **Assigned to**: Jaehyun
- **Icon**: ✅
- **Behavior**: Permanent tasks that stay in your list when logged
- **Completion**: Use "Log" button instead of "Done" - tracks completion without deleting
- **Use for**: Recurring healthy habits you want to track
- **Example**: "Drink 8 glasses of water", "Exercise 30 min", "Meditate"
- **Note**: Habits don't cause overwork - they're healthy activities!

### 3. Recurring Tasks
- **Assigned to**: Noah (the CEO)
- **Icon**: 🔄
- **Behavior**: Tasks that repeat on a schedule
- **Recurrence Types**:
  - **Daily**: Every day
  - **Weekly**: Specific day of the week (Monday, Tuesday, etc.)
  - **Monthly**: Specific date of the month (1st, 15th, etc.)
  - **Bi-monthly**: Two specific dates per month (e.g., 1st and 15th)
- **Use for**: Bills, subscriptions, regular appointments, scheduled chores
- **Example**: "Pay rent (monthly, 1st)", "Team meeting (weekly, Monday)", "Water plants (daily)"

### 4. Finance Tasks
- **Assigned to**: Minkyu
- **Icon**: 💰
- **Behavior**: Special tasks that track income (+) and spending (-)
- **Amount**: Can be positive (income) or negative (expense)
- **Tracking**: Displayed on Record page with totals and budget goals
- **Use for**: Money tracking, purchases, income, expenses
- **Example**: "Freelance payment +₩50000", "Coffee purchase -₩5000"

### 5. Impossible Tasks
- **Assigned to**: All employees (universal)
- **Icon**: 🌟
- **Behavior**: Big, challenging tasks that everyone can nag about
- **Energy**: Usually HIGH energy (3 points)
- **Use for**: Major projects, difficult goals, things you've been putting off
- **Example**: "Write entire thesis", "Clean entire house", "File taxes"

## ⚡ Energy Levels

Each task has an energy level that determines rewards and workload:

| Energy Level | Energy Cost | EXP Earned | Won Earned | Use For |
|--------------|-------------|------------|------------|---------|
| **Low** | 1 point | 1 exp | 10 won | Quick tasks (5-15 min) |
| **Med** | 2 points | 2 exp | 25 won | Medium tasks (15-45 min) |
| **High** | 3 points | 3 exp | 50 won | Long tasks (45+ min) |

**Important:**
- Employees have 10 energy points per day
- Going over 10 energy causes overwork and angry employees!
- Energy resets when you take a break or at midnight

## ✨ Task Creation

**Auto-Assignment:**
Tasks are automatically assigned to employees based on type:
- Daily → Yuwon
- Habit → Jaehyun
- Finance → Minkyu
- Recurring → Noah
- Impossible → All

**Required Fields:**
- Task text/description
- Task type (daily/habit/finance/recurring/impossible)
- Energy level (low/med/high)

**Optional Fields:**
- For Recurring: Recurrence pattern (daily/weekly/monthly/bi-monthly)
- For Recurring: Specific day or date(s)
- For Finance: Amount (positive or negative number)
- For Impossible: Can add URGENT flag (auto-assigns high energy)

## ✅ Task Completion

### Completing Daily/Finance/Impossible Tasks
1. Click the "Done" ✓ button
2. Task is marked complete and **removed from list**
3. Earns EXP and Won based on energy level
4. Has chance to drop a card (see Card Collection docs)
5. Added to completed tasks history
6. Updates employee morale and energy

### Logging Habits
1. Click the "Log" button
2. Task is marked complete but **stays in your list**
3. Earns EXP and Won based on energy level
4. Can be logged multiple times per day
5. Each log is tracked separately in history
6. Updates Jaehyun's morale and energy

### Recurring Tasks
1. Click "Done" ✓ button
2. Task is completed for this occurrence
3. Task may reappear based on schedule (to be implemented)
4. Currently works like daily tasks (deleted on completion)
5. Updates Noah's morale and energy

## 🎁 Rewards System

**Every task completion earns:**
- **EXP**: Based on energy level (1-3 exp)
- **Won**: Company currency based on energy level (10-50 won)
- **Card Drop Chance**: 10% chance to receive a random office card

**Accumulation:**
- Won accumulates in "Accumulated Won" (company earnings)
- Use "Give Paycheck" button to convert to spendable YuCash
- EXP is added to total EXP (shared across all employees)

## 📊 Task Sorting & Filtering

**Sort Options** (on Dashboard):
- Energy Level (Low → Med → High)
- Creation Date (Newest first / Oldest first)
- URGENT tasks always appear at top

**Filter Options:**
- Show All Tasks
- Filter by Energy Level (Low, Med, High)
- Filter by Task Type (Daily, Habit, Finance, Recurring, Impossible)

## 🚨 URGENT System

Tasks marked as URGENT:
- Automatically set to HIGH energy (3 points)
- Always sorted to the top of the list
- Visual indicator (red flag or special styling)
- Use for: Time-sensitive tasks, deadlines, emergencies

## 📝 Editing & Deleting Tasks

- **Edit**: Update task text, energy level, or other properties
- **Delete**: Remove task without completion (no rewards earned)
- Tasks can be edited at any time before completion
- Completed tasks can be deleted from Record page

## 🗓️ Task History

All completed tasks are stored with:
- Completion timestamp
- EXP earned
- Won earned
- Employee who completed it
- Original task properties

View history on:
- **Record Page**: Full history with calendar view
- **Dashboard**: Today's completed tasks

## 💡 Task Strategy Tips

1. **Balance Energy**: Don't exceed 10 energy per day per employee
2. **Use Low Energy**: Break big tasks into smaller low-energy tasks
3. **Habits Don't Overwork**: Log habits freely - they don't cause stress
4. **Finance Tracking**: Log expenses as negative, income as positive
5. **Recurring Setup**: Set up bills and appointments as recurring to not forget
6. **URGENT Flag**: Only use for truly urgent tasks to maintain priority system
7. **Task Batching**: Group similar tasks together for efficiency

## 🔮 Planned Features

- [ ] Recurring tasks auto-regenerate on schedule
- [ ] Task templates for common tasks
- [ ] Task categories/tags
- [ ] Subtasks/checklists
- [ ] Task dependencies (Task B unlocks after Task A)
- [ ] Task notes/descriptions
- [ ] Attach images to tasks
- [ ] Task reminders/notifications
