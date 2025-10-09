# Data Structures & localStorage Schema

Technical documentation for how data is stored and structured in Exploding Employees.

## 💾 Storage Method

**localStorage** is used for all persistent data:
- Browser-based storage (5-10MB limit)
- Data persists between sessions
- Stored as JSON strings
- Keys prefixed for organization
- No backend/server required

## 📊 State Management

### AppContext Provider

All app state is managed by `AppContext.jsx`:
- Centralized state management
- React Context API
- Custom hook: `useApp()`
- Automatic localStorage sync via useEffect

### State Structure

```javascript
{
  // Core task system
  tasks: Task[],
  completedTasks: CompletedTask[],

  // Currency
  won: number,
  accumulatedWon: number,
  yuCash: number,
  noahCreditCard: number,

  // Progression
  totalExp: number,

  // Employee system
  employeeMorale: EmployeeMorale,

  // Self-care
  hydrationLog: HydrationLog[],
  restLog: RestLog[],

  // Productivity tracking
  fakeProductivity: FakeProductivity[],

  // Budget goals
  budgetGoals: BudgetGoals,

  // Collection systems
  collectedCards: Card[],
  lastCardDrop: Card | null,
  gachaHistory: GachaRoll[],

  // AU Books
  unlockedAUs: string[],
  auProgress: AUProgress,

  // Cooking
  ingredients: Ingredients,
  cookedDishes: CookedDishes,
  discoveredRecipes: string[],

  // Friendship
  friendshipPoints: FriendshipPoints,

  // Metadata
  lastDate: string
}
```

## 📋 Type Definitions

### Task

```typescript
interface Task {
  id: number;
  text: string;
  taskType: 'daily' | 'habit' | 'recurring' | 'finance' | 'impossible';
  energy: 'low' | 'med' | 'high';
  createdAt: string; // ISO 8601 timestamp
  assignedEmployee: 'yuwon' | 'jaehyun' | 'minkyu' | 'noah' | 'all';

  // Finance-specific
  amount?: number; // Positive = income, Negative = expense

  // Recurring-specific
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'bi-monthly';
  recurDay?: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  recurDate?: number; // Day of month (1-31)
  recurDates?: number[]; // For bi-monthly

  // Special flags
  isUrgent?: boolean;
}
```

### CompletedTask

```typescript
interface CompletedTask extends Task {
  completedAt: string; // ISO 8601 timestamp
  expEarned: number; // 1, 2, or 3
  wonEarned: number; // 10, 25, or 50
}
```

### EmployeeMorale

```typescript
interface EmployeeMorale {
  yuwon: EmployeeStatus;
  jaehyun: EmployeeStatus;
  minkyu: EmployeeStatus;
  noah: EmployeeStatus;
}

interface EmployeeStatus {
  mood: string; // 'happy', 'stressed', 'bored', etc.
  overworked: boolean;
  bored: boolean;
  lastTaskCompletedAt: string | null; // ISO 8601
  lastRestAt: string | null; // ISO 8601
}
```

### HydrationLog

```typescript
interface HydrationLog {
  id: number;
  glasses: number;
  timestamp: string; // ISO 8601
}
```

### RestLog

```typescript
interface RestLog {
  id: number;
  type: 'short_break' | 'long_break' | 'sleep';
  timestamp: string; // ISO 8601
}
```

### FakeProductivity

```typescript
interface FakeProductivity {
  id: number;
  activity: string;
  category: 'cleaning' | 'work' | 'fake';
  date: string; // ISO 8601
}
```

### BudgetGoals

```typescript
interface BudgetGoals {
  period: 'weekly' | 'monthly' | 'yearly';
  incomeGoal: number;
  spendingBudget: number;
  startDate: string; // ISO 8601
}
```

### Card

```typescript
interface Card {
  id: string;
  title: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  character?: string;
  flavorText?: string;
  collectedAt?: string; // ISO 8601
}
```

### GachaRoll

```typescript
interface GachaRoll {
  id: number;
  auId: string;
  timestamp: string; // ISO 8601
  cost: number;
}
```

### AUProgress

```typescript
interface AUProgress {
  [auId: string]: {
    revealedSnippets: number[]; // Array of snippet indices
    juiceSpent: number; // Total YuCash spent on this AU
  };
}
```

### Ingredients

```typescript
interface Ingredients {
  [ingredientId: string]: number; // ingredient ID → quantity
}
```

### CookedDishes

```typescript
interface CookedDishes {
  [recipeId: string]: number; // recipe ID → quantity cooked
}
```

### FriendshipPoints

```typescript
interface FriendshipPoints {
  yuwon: number; // 0-2500
  jaehyun: number;
  minkyu: number;
  noah: number;
}
```

## 🗄️ localStorage Keys

All data is stored in localStorage with these keys:

```javascript
{
  'tasks': 'Task[]',
  'completedTasks': 'CompletedTask[]',
  'accumulatedWon': 'number',
  'yuCash': 'number',
  'noahCreditCard': 'number',
  'won': 'number', // Legacy, will migrate
  'totalExp': 'number',
  'employeeMorale': 'EmployeeMorale',
  'hydrationLog': 'HydrationLog[]',
  'restLog': 'RestLog[]',
  'fakeProductivity': 'FakeProductivity[]',
  'budgetGoals': 'BudgetGoals',
  'collectedCards': 'Card[]',
  'gachaHistory': 'GachaRoll[]',
  'unlockedAUs': 'string[]',
  'auProgress': 'AUProgress',
  'lastDate': 'string',
  'ingredients': 'Ingredients',
  'cookedDishes': 'CookedDishes',
  'discoveredRecipes': 'string[]',
  'friendshipPoints': 'FriendshipPoints'
}
```

## 🔄 Data Flow

### Loading Data

```javascript
const loadFromStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return defaultValue;
  }
};

// Used in state initialization
const [tasks, setTasks] = useState(() => loadFromStorage('tasks', []));
```

### Saving Data

```javascript
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}, [tasks]);
```

Every state change automatically syncs to localStorage.

### Data Reset

```javascript
const resetAllData = () => {
  localStorage.clear(); // Clear all localStorage
  // Reset all state to defaults
  setTasks([]);
  setCompletedTasks([]);
  // ... reset all other state
};
```

## 📈 Data Size Estimates

### Current Storage Usage

**Per Item Sizes (approximate):**
- Task: ~200 bytes
- CompletedTask: ~250 bytes
- Card: ~300 bytes
- AU Progress: ~100 bytes per AU
- Ingredient entry: ~50 bytes
- Recipe entry: ~50 bytes

**Typical User Storage:**
- 50 active tasks: ~10 KB
- 500 completed tasks: ~125 KB
- 100 cards: ~30 KB
- 20 AU books (full unlock): ~50 KB
- Ingredients/recipes: ~5 KB
- Other data: ~10 KB
- **Total: ~230 KB**

### localStorage Limit

- Browser limit: **5-10 MB**
- Current usage: **~0.2 MB**
- Plenty of room for growth!

### Data Pruning Strategy

If storage gets too large:
- Archive completed tasks older than 6 months
- Compress card data
- Move to IndexedDB for larger storage

## 🔧 Data Migrations

### Version 1 → Version 2 (Example)

```javascript
// Migrate old 'won' to new 'accumulatedWon' system
const migrateWonSystem = () => {
  const oldWon = loadFromStorage('won', 0);
  if (oldWon > 0 && !loadFromStorage('accumulatedWon')) {
    localStorage.setItem('accumulatedWon', JSON.stringify(oldWon));
    console.log('✅ Migrated won system');
  }
};
```

### Future Migrations

- Add data version number
- Check version on load
- Run migrations if needed
- Log migration history

## 💾 Backup & Export

### Export Data

```javascript
const exportData = () => {
  const allData = {};
  const keys = [
    'tasks', 'completedTasks', 'accumulatedWon', 'yuCash',
    'totalExp', 'employeeMorale', 'collectedCards', // ... all keys
  ];

  keys.forEach(key => {
    allData[key] = loadFromStorage(key, null);
  });

  const dataStr = JSON.stringify(allData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Download file
  const a = document.createElement('a');
  a.href = url;
  a.download = `exploding-employees-backup-${Date.now()}.json`;
  a.click();
};
```

### Import Data

```javascript
const importData = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      Object.keys(data).forEach(key => {
        localStorage.setItem(key, JSON.stringify(data[key]));
      });
      window.location.reload(); // Reload to apply changes
    } catch (error) {
      console.error('Import failed:', error);
    }
  };
  reader.readAsText(file);
};
```

## 🐛 Common Data Issues

### Issue: Data Not Persisting

**Causes:**
- Private/incognito mode (localStorage disabled)
- Browser storage quota exceeded
- Browser extensions blocking localStorage
- JSON stringify/parse errors

**Solutions:**
- Check browser console for errors
- Verify localStorage is enabled
- Add error handling to all localStorage operations
- Implement fallback to sessionStorage

### Issue: Corrupted Data

**Causes:**
- App crash during save
- Manual localStorage editing
- Browser bug

**Solutions:**
- Validate data on load
- Provide "Reset Data" option
- Keep backup of last known good state
- Add data integrity checks

### Issue: Date/Timezone Problems

**Causes:**
- Inconsistent date formats
- Timezone differences
- Daylight saving time

**Solutions:**
- Always use ISO 8601 format
- Store dates as UTC
- Use `.setHours(0,0,0,0)` for day comparisons
- Consider using date library (date-fns, day.js)

## 🔐 Data Security

### Current Security

- **No sensitive data**: No passwords, payment info, personal data
- **Local-only**: Data never sent to server
- **Browser sandboxing**: localStorage isolated per domain

### Privacy

- **No tracking**: No analytics or tracking code
- **No server**: All data stays on your device
- **Clear data**: User can delete all data anytime

---

*Understanding your data helps you understand the game!* 💾✨
