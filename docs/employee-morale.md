# Employee Morale & Performance System

The employee morale system tracks how each of the four employees is performing based on their assigned task types.

## 👥 The Four Employees

Each employee is automatically assigned to manage specific task types:

| Employee | Task Type | Personality |
|----------|-----------|-------------|
| **Yuwon** | Daily Tasks (To-Do List) | Hardworking protagonist, prone to overwork |
| **Jaehyun** | Habits | Charismatic, thrives on healthy routines |
| **Minkyu** | Finance Tasks | Quiet but reliable, handles money matters |
| **Noah** | Recurring Tasks | CEO who prefers to slack off, smug when Yuwon overworks |

## 📊 Performance Metrics

Each employee's performance is tracked using several metrics:

### 1. Energy System (10 points total)

Energy is consumed when completing tasks based on their energy level:
- **Low energy task**: 1 point
- **Med energy task**: 2 points
- **High energy task**: 3 points

**Energy Calculation:**
- Each employee starts with 10 energy points per day
- Energy points = Sum of all completed tasks' energy costs today
- Remaining Energy = 10 - Energy Points used
- Energy resets when you use the "Take a Break" feature

**Energy Thresholds:**
- 0-5 points: Normal range
- 6-8 points: Getting stressed
- 9 points: Overworked (⚠️ warning)
- 10+ points: Extremely tired & angry (⚠️ STOP! Rest immediately!)

### 2. Mood System

Mood is determined by workload and task completion:

#### Yuwon & Minkyu (Standard Employees)
- **Extremely bored** 😴 (0% mood): No tasks exist at all
- **Bored** 😐 (25%): No pending tasks, nothing done today
- **Okay** 🙂 (40%): Minimal work done
- **Content** 😊 (50%): Some tasks completed
- **Stressed** 😰 (80%): 6+ energy points used
- **Overworked** 😵 (100%): 9 energy points used
- **Extremely tired & angry** 😡 (120%): 10+ energy points used (RED ALERT!)

#### Jaehyun (Habits)
- **Neglected** 😢 (10%): No habits exist at all
- **Bored** 😐 (25%): No habits logged today
- **Okay** 😌 (40%): Minimal habit logs
- **Content** 🙂 (50%): 1+ habits logged
- **Happy** 😊 (70%): 3+ habits logged
- **Thriving** 🌟 (90%): 5+ habits logged

*Note: Jaehyun doesn't get overworked from habits - they're healthy activities!*

#### Noah (Recurring Tasks)
- **Bored** 😐 (25%): No recurring tasks exist or completed
- **Okay** 😐 (40%): Minimal work done
- **Satisfied** 🙂 (50%): 1+ recurring task completed
- **Delighted** 😏 (80%): **SPECIAL** - Yuwon is overworked (Noah is smug about it!)

*Note: Noah is the CEO and prefers minimal work. He's happiest when Yuwon does all the work.*

### 3. Performance (Kinerja)

Performance reflects actual work output:

**General Performance Levels:**
- **Absolutely nothing to do** 💤 (0%): No tasks exist
- **Lacking** 😬 (30%): Tasks exist but nothing done
- **Okay** 👌 (50%): 1+ task completed
- **Good** 👍 (70%): 3+ tasks completed OR 4+ energy used
- **Excellent** ⭐ (100%): 5+ tasks completed AND 7+ energy used

**Character-Specific Performance Messages:**

When slacking (0 tasks completed):
- **Yuwon**: "procrastinating like a pro" 🦥
- **Noah**: "ongkang ongkang kaki only (what kind of CEO?!)" 🦥
- **Jaehyun**: "flirting instead of working" 🦥
- **Minkyu**: "staring at the ceiling" 🦥

When excelling (5+ tasks, 7+ energy):
- **Yuwon**: "overachiever mode activated!" ⭐
- **Noah**: "actually being a CEO for once" ⭐
- **Jaehyun**: "chaotic but productive" ⭐
- **Minkyu**: "quietly crushing it" ⭐

### 4. Consistency Rank (Weekly Performance)

Ranks are based on the last 7 days of work:

#### Yuwon & Jaehyun (Standard Grading)
- **S Rank** 🏆 (Gold): Worked all 7 days
- **A Rank** (Blue): Worked 5-6 days
- **B Rank** (Green): Worked 3-4 days
- **C Rank** (Gray): Worked 1-2 days
- **F Rank** ❌ (Red): Worked 0 days

#### Minkyu (Finance - More Forgiving)
- **S Rank** 🏆: Worked 5+ days (finance isn't daily)
- **A Rank**: Worked 3-4 days
- **B Rank**: Worked 2 days
- **C Rank**: Worked 1 day
- **F Rank** ❌: Worked 0 days

#### Noah (Recurring - Same as Standard)
- **S Rank** 🏆: Completed recurring tasks on all 7 days
- **A Rank**: Completed on 5-6 days
- **B Rank**: Completed on 3-4 days
- **C Rank**: Completed on 1-2 days
- **F Rank** ❌: No recurring tasks completed in 7 days

**Note**: A "worked day" = at least 1 task completed that day (regardless of energy level)

## 🏢 Company Rank

The overall company rank is calculated by averaging all four employees' individual ranks:

- Company ranks use the same S/A/B/C/F scale
- Each rank has a point value: S=5, A=4, B=3, C=2, F=1
- Company rank = Average of all 4 employee rank points

**Example:**
- Yuwon: S (5 points)
- Jaehyun: A (4 points)
- Minkyu: B (3 points)
- Noah: C (2 points)
- Average = 14/4 = 3.5 → **A Rank** company

## 💤 Rest & Energy Reset

**Taking a Break:**
- Use the "Take a Break" button on the Company page
- Choose activity: Short Break, Long Break, or Sleep
- **Resets ALL employees' energy to 10** (full energy restored)
- Clears "overworked" status for all employees
- Only counts tasks completed AFTER the rest for energy calculation

**Important:** The rest system resets energy for everyone, not just one employee. This represents a team-wide rest period.

## 📅 Daily Reset

At midnight (day change):
- Energy calculations reset to 0 for the new day
- Completed tasks from previous day are kept in history
- "Days worked" counter updates for consistency rank
- Employee morale recalculates based on new day's tasks

## 🐛 Known Issues (As of this documentation)

1. **Energy Display Bug**: Energy bars may not accurately reflect the 10-point system
2. **Rank Calculation Issues**: Some employees may show incorrect ranks despite completing tasks
3. **Rest System**: Need to verify rest properly resets energy calculations

## 💡 Tips for Managing Morale

1. **Don't overwork Yuwon** - He's prone to burnout. Keep daily tasks under 10 energy total
2. **Log habits regularly for Jaehyun** - He's happiest with consistent habit tracking
3. **Finance tasks are flexible** - Minkyu doesn't need daily work, more forgiving schedule
4. **Noah is special** - He's lazy but that's part of his character. Recurring tasks should be done consistently
5. **Take breaks** - When ANY employee hits 9+ energy, use the rest feature immediately
6. **Balance workload** - Try to spread tasks across days rather than cramming everything into one day

## 🔍 Viewing Employee Status

You can check employee morale on:
- **Company Page** (`/company`): Full detailed view with all metrics
- **Dashboard** (Coming soon): Quick status indicators

The Company page shows:
- Current mood & emoji
- Performance description
- Consistency rank (S/A/B/C/F)
- Energy used today / Remaining energy
- Tasks completed today
- Days worked in last 7 days
- Overwork warnings (if any)
