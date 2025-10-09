import { createContext, useContext, useState, useEffect } from 'react';
import { rollCard } from '../data/cards';
import { ENERGY_REWARDS, CARD_DROP_CHANCE } from '../constants/gameConstants';

const AppContext = createContext();

// Unified task system with exp and currency
export const AppProvider = ({ children, floatingEmployee, setFloatingEmployee }) => {
  // Load data from localStorage
  const loadFromStorage = (key, defaultValue) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return defaultValue;
    }
  };

  // Tasks state - unified system (low=1 exp, med=2 exp, high=3 exp)
  const [tasks, setTasks] = useState(() => loadFromStorage('tasks', []));

  // Completed tasks with history
  const [completedTasks, setCompletedTasks] = useState(() => loadFromStorage('completedTasks', []));

  // Track last active date to detect day changes
  const [lastDate, setLastDate] = useState(() => loadFromStorage('lastDate', new Date().toDateString()));

  // Currency system
  const [accumulatedWon, setAccumulatedWon] = useState(() => loadFromStorage('accumulatedWon', 0)); // Company earnings (not converted yet)
  const [yuCash, setYuCash] = useState(() => loadFromStorage('yuCash', 0)); // Spendable currency (converted from Won)
  const [noahCreditCard, setNoahCreditCard] = useState(() => loadFromStorage('noahCreditCard', 0)); // Special currency
  const [won, setWon] = useState(() => loadFromStorage('won', 0)); // Legacy - will migrate to accumulatedWon

  // Total exp across all characters
  const [totalExp, setTotalExp] = useState(() => loadFromStorage('totalExp', 0));

  // Employee morale tracking
  const [employeeMorale, setEmployeeMorale] = useState(() => loadFromStorage('employeeMorale', {
    yuwon: { mood: 'happy', overworked: false, bored: false, lastTaskCompletedAt: null, lastRestAt: null },
    jaehyun: { mood: 'happy', overworked: false, bored: false, lastTaskCompletedAt: null, lastRestAt: null },
    minkyu: { mood: 'happy', overworked: false, bored: false, lastTaskCompletedAt: null, lastRestAt: null },
    noah: { mood: 'happy', overworked: false, bored: false, lastTaskCompletedAt: null, lastRestAt: null },
  }));

  // Self care tracking
  const [hydrationLog, setHydrationLog] = useState(() => loadFromStorage('hydrationLog', []));
  const [restLog, setRestLog] = useState(() => loadFromStorage('restLog', []));

  // Fake productivity items
  const [fakeProductivity, setFakeProductivity] = useState(() => loadFromStorage('fakeProductivity', []));

  // Budget goals tracking
  const [budgetGoals, setBudgetGoals] = useState(() => loadFromStorage('budgetGoals', {
    period: 'monthly', // 'weekly', 'monthly', 'yearly'
    incomeGoal: 0,
    spendingBudget: 0,
    startDate: new Date().toISOString()
  }));

  // Card collection system (100 canon office cards from task drops)
  const [collectedCards, setCollectedCards] = useState(() => loadFromStorage('collectedCards', []));
  const [lastCardDrop, setLastCardDrop] = useState(null);
  const [gachaHistory, setGachaHistory] = useState(() => loadFromStorage('gachaHistory', []));

  // AU Books system (20 books unlocked via gacha)
  const [unlockedAUs, setUnlockedAUs] = useState(() => loadFromStorage('unlockedAUs', [])); // Array of AU IDs
  const [auProgress, setAuProgress] = useState(() => loadFromStorage('auProgress', {})); // {auId: {revealedSnippets: [indices], juiceSpent: amount}}

  // Cooking & Inventory system
  const [ingredients, setIngredients] = useState(() => loadFromStorage('ingredients', {})); // {itemId: quantity}
  const [cookedDishes, setCookedDishes] = useState(() => loadFromStorage('cookedDishes', {})); // {recipeId: quantity}
  const [discoveredRecipes, setDiscoveredRecipes] = useState(() => loadFromStorage('discoveredRecipes', [])); // Array of recipe IDs

  // Friendship system
  const [friendshipPoints, setFriendshipPoints] = useState(() => loadFromStorage('friendshipPoints', {
    yuwon: 0,
    noah: 0,
    jaehyun: 0,
    minkyu: 0
  }));

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('accumulatedWon', JSON.stringify(accumulatedWon));
  }, [accumulatedWon]);

  useEffect(() => {
    localStorage.setItem('yuCash', JSON.stringify(yuCash));
  }, [yuCash]);

  useEffect(() => {
    localStorage.setItem('noahCreditCard', JSON.stringify(noahCreditCard));
  }, [noahCreditCard]);

  useEffect(() => {
    localStorage.setItem('won', JSON.stringify(won));
  }, [won]);

  useEffect(() => {
    localStorage.setItem('totalExp', JSON.stringify(totalExp));
  }, [totalExp]);

  useEffect(() => {
    localStorage.setItem('employeeMorale', JSON.stringify(employeeMorale));
  }, [employeeMorale]);

  useEffect(() => {
    localStorage.setItem('hydrationLog', JSON.stringify(hydrationLog));
  }, [hydrationLog]);

  useEffect(() => {
    localStorage.setItem('restLog', JSON.stringify(restLog));
  }, [restLog]);

  useEffect(() => {
    localStorage.setItem('fakeProductivity', JSON.stringify(fakeProductivity));
  }, [fakeProductivity]);

  useEffect(() => {
    localStorage.setItem('budgetGoals', JSON.stringify(budgetGoals));
  }, [budgetGoals]);

  useEffect(() => {
    localStorage.setItem('collectedCards', JSON.stringify(collectedCards));
  }, [collectedCards]);

  useEffect(() => {
    localStorage.setItem('gachaHistory', JSON.stringify(gachaHistory));
  }, [gachaHistory]);

  useEffect(() => {
    localStorage.setItem('unlockedAUs', JSON.stringify(unlockedAUs));
  }, [unlockedAUs]);

  useEffect(() => {
    localStorage.setItem('auProgress', JSON.stringify(auProgress));
  }, [auProgress]);

  useEffect(() => {
    localStorage.setItem('lastDate', JSON.stringify(lastDate));
  }, [lastDate]);

  useEffect(() => {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('cookedDishes', JSON.stringify(cookedDishes));
  }, [cookedDishes]);

  useEffect(() => {
    localStorage.setItem('discoveredRecipes', JSON.stringify(discoveredRecipes));
  }, [discoveredRecipes]);

  useEffect(() => {
    localStorage.setItem('friendshipPoints', JSON.stringify(friendshipPoints));
  }, [friendshipPoints]);

  // Check if date has changed and clean up today's completed tasks
  useEffect(() => {
    const currentDate = new Date().toDateString();
    if (lastDate !== currentDate) {
      // Date has changed - remove tasks completed on the old date
      const tasksToKeep = completedTasks.filter(task => {
        const taskDate = new Date(task.completedAt).toDateString();
        return taskDate !== lastDate; // Keep tasks that weren't from the old date
      });
      setCompletedTasks(tasksToKeep);
      setLastDate(currentDate);
    }
  }, [completedTasks, lastDate]);

  // Add task with auto-assignment based on taskType
  const addTask = (task) => {
    // Auto-assign employee based on task type
    let assignedEmployee = 'yuwon'; // default
    switch(task.taskType) {
      case 'daily':
        assignedEmployee = 'yuwon';
        break;
      case 'habit':
        assignedEmployee = 'jaehyun';
        break;
      case 'finance':
        assignedEmployee = 'minkyu';
        break;
      case 'recurring':
        assignedEmployee = 'noah';
        break;
      case 'impossible':
        assignedEmployee = 'all'; // All can nag about these
        break;
      default:
        assignedEmployee = 'yuwon';
    }

    const newTask = {
      id: Date.now(),
      ...task,
      createdAt: new Date().toISOString(),
      assignedEmployee: assignedEmployee,
      taskType: task.taskType || 'daily', // default to daily if not specified
    };
    setTasks(prev => [...prev, newTask]);
  };

  // Update task
  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Complete task - unified exp and won calculation
  const completeTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    // Calculate exp and won based on energy level
    const energyLevel = task.energy || 'low';
    const rewards = ENERGY_REWARDS[energyLevel] || ENERGY_REWARDS.low;
    const exp = rewards.exp;
    const wonEarned = rewards.won;

    // Card drop chance
    const cardDropChance = Math.random();
    if (cardDropChance < CARD_DROP_CHANCE) {
      const droppedCard = rollCard();
      // Only add if not already collected
      if (!collectedCards.find(c => c.id === droppedCard.id)) {
        setCollectedCards(prev => [...prev, droppedCard]);
        setLastCardDrop(droppedCard);
      }
    }

    // Add to completed tasks with completion date
    const completedTask = {
      ...task,
      completedAt: new Date().toISOString(),
      expEarned: exp,
      wonEarned: wonEarned,
    };

    setCompletedTasks(prev => [completedTask, ...prev]);
    setTotalExp(prev => prev + exp);
    setAccumulatedWon(prev => prev + wonEarned); // Add to company earnings (not converted yet)
    setWon(prev => prev + wonEarned); // Keep legacy for now

    // Update employee morale - mark when they last completed a task
    if (task.assignedEmployee && task.assignedEmployee !== 'all') {
      setEmployeeMorale(prev => ({
        ...prev,
        [task.assignedEmployee]: {
          ...prev[task.assignedEmployee],
          lastTaskCompletedAt: new Date().toISOString(),
        }
      }));
    }

    deleteTask(id);
  };

  // Log habit completion without deleting the habit
  const logHabit = (id) => {
    const habit = tasks.find(t => t.id === id);
    if (!habit) return;

    // Calculate exp and won based on energy level
    const energyLevel = habit.energy || 'low';
    const rewards = ENERGY_REWARDS[energyLevel] || ENERGY_REWARDS.low;
    const exp = rewards.exp;
    const wonEarned = rewards.won;

    // Add to completed tasks log but keep the habit in tasks
    const completedHabit = {
      ...habit,
      completedAt: new Date().toISOString(),
      expEarned: exp,
      wonEarned: wonEarned,
    };

    setCompletedTasks(prev => [completedHabit, ...prev]);
    setTotalExp(prev => prev + exp);
    setAccumulatedWon(prev => prev + wonEarned);
    setWon(prev => prev + wonEarned);

    // Update employee morale
    if (habit.assignedEmployee && habit.assignedEmployee !== 'all') {
      setEmployeeMorale(prev => ({
        ...prev,
        [habit.assignedEmployee]: {
          ...prev[habit.assignedEmployee],
          lastTaskCompletedAt: new Date().toISOString(),
        }
      }));
    }

    // Don't delete the habit - it stays permanent!
  };

  // Delete a completed task from the record
  const deleteCompletedTask = (id) => {
    setCompletedTasks(prev => prev.filter(task => task.id !== id));
  };

  // Get tasks completed on a specific date
  const getTasksByDate = (date) => {
    const dateStr = new Date(date).toDateString();
    return completedTasks.filter(task => {
      const taskDate = new Date(task.completedAt).toDateString();
      return taskDate === dateStr;
    });
  };

  // Get tasks completed today
  const getTodaysTasks = () => {
    return getTasksByDate(new Date());
  };

  // Fake productivity functions
  const addFakeProductivity = (item) => {
    const newItem = {
      id: Date.now(),
      ...item,
      date: new Date().toISOString(),
    };
    setFakeProductivity(prev => [newItem, ...prev]);
  };

  const deleteFakeProductivity = (id) => {
    setFakeProductivity(prev => prev.filter(item => item.id !== id));
  };

  // Convert accumulated won to YuCash (paycheck)
  const givePaycheck = () => {
    setYuCash(prev => prev + accumulatedWon);
    setAccumulatedWon(0); // Reset company earnings after paying out
  };

  // Add hydration log
  const addHydration = (glasses) => {
    setHydrationLog(prev => [...prev, {
      id: Date.now(),
      glasses: glasses,
      timestamp: new Date().toISOString()
    }]);
  };

  // Get today's hydration count
  const getTodaysHydration = () => {
    const today = new Date().toDateString();
    return hydrationLog.filter(log => new Date(log.timestamp).toDateString() === today).length;
  };

  // Add rest activity - restores ALL energy for ALL employees
  const addRest = (type) => {
    const restTime = new Date().toISOString();
    setRestLog(prev => [...prev, { id: Date.now(), type, timestamp: restTime }]);

    // Reset all employees' energy by recording rest time
    setEmployeeMorale(prev => {
      const updated = {};
      Object.keys(prev).forEach(employee => {
        updated[employee] = {
          ...prev[employee],
          overworked: false, // Reset overworked status
          lastRestAt: restTime, // Record when they rested
        };
      });
      return updated;
    });
  };

  // Get tasks by type
  const getTasksByType = (taskType) => {
    return tasks.filter(task => task.taskType === taskType);
  };

  // Get employee morale status
  const getMoraleStatus = (employee) => {
    const employeeTasks = tasks.filter(t => {
      if (employee === 'yuwon') return t.taskType === 'daily';
      if (employee === 'jaehyun') return t.taskType === 'habit';
      if (employee === 'minkyu') return t.taskType === 'finance';
      if (employee === 'noah') return t.taskType === 'recurring';
      return false;
    });

    const employeeCompletedTasks = completedTasks.filter(t => {
      if (employee === 'yuwon') return t.taskType === 'daily';
      if (employee === 'jaehyun') return t.taskType === 'habit';
      if (employee === 'minkyu') return t.taskType === 'finance';
      if (employee === 'noah') return t.taskType === 'recurring';
      return false;
    });

    // Get today's completed tasks for this employee
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get employee-specific rest time
    const lastRest = employeeMorale[employee]?.lastRestAt;

    const todaysTasks = employeeCompletedTasks.filter(task => {
      const taskDate = new Date(task.completedAt);
      taskDate.setHours(0, 0, 0, 0);
      const isToday = taskDate.getTime() === today.getTime();

      // If they rested today, only count tasks completed AFTER the rest
      if (isToday && lastRest) {
        const restDate = new Date(lastRest);
        const taskCompleted = new Date(task.completedAt);
        return taskCompleted > restDate;
      }

      return isToday;
    });

    // Calculate energy points (low=1, med=2, high=3)
    const energyPoints = todaysTasks.reduce((sum, task) => {
      const points = task.energy === 'low' ? 1 : task.energy === 'med' ? 2 : 3;
      return sum + points;
    }, 0);

    const remainingEnergy = Math.max(0, 10 - energyPoints); // Cap at 0
    const pendingTasks = employeeTasks.length;
    const completedCount = todaysTasks.length;

    // Calculate consistency rank based on last 7 days
    const last7Days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayTasks = employeeCompletedTasks.filter(task => {
        const taskDate = new Date(task.completedAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === date.getTime();
      });

      last7Days.push(dayTasks.length > 0 ? 1 : 0);
    }

    const daysWorked = last7Days.reduce((sum, day) => sum + day, 0);

    // Special logic for Noah (Recurring tasks) - only decrease if tasks are missed
    const isNoah = employee === 'noah';
    const isFinance = employee === 'minkyu';
    let rank, rankColor;

    if (isNoah) {
      // Noah: Check if recurring tasks were missed
      // For each day in last 7 days, check if there were due recurring tasks and if they were completed
      let missedDays = 0;

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
        const dayOfMonth = date.getDate();

        // Check if any recurring tasks were due on this day
        const dueTasks = tasks.filter(t => {
          if (t.taskType !== 'recurring') return false;

          switch(t.recurrence) {
            case 'daily':
              return true;
            case 'weekly':
              return t.recurDay === dayOfWeek;
            case 'monthly':
              return Number(t.recurDate) === dayOfMonth;
            case 'bi-monthly':
              return t.recurDates && t.recurDates.some(d => Number(d) === dayOfMonth);
            default:
              return false;
          }
        });

        // If tasks were due but none completed, count as missed
        if (dueTasks.length > 0 && last7Days[i] === 0) {
          missedDays++;
        }
      }

      // Noah's rank based on missed days (more forgiving - only penalize on misses)
      if (missedDays === 0) { rank = 'S'; rankColor = '#f39c12'; }
      else if (missedDays <= 1) { rank = 'A'; rankColor = '#3498db'; }
      else if (missedDays <= 2) { rank = 'B'; rankColor = '#2ecc71'; }
      else if (missedDays <= 4) { rank = 'C'; rankColor = '#95a5a6'; }
      else { rank = 'F'; rankColor = '#e74c3c'; }
    } else if (isFinance) {
      // Finance: More forgiving thresholds
      if (daysWorked >= 5) { rank = 'S'; rankColor = '#f39c12'; }
      else if (daysWorked >= 3) { rank = 'A'; rankColor = '#3498db'; }
      else if (daysWorked >= 2) { rank = 'B'; rankColor = '#2ecc71'; }
      else if (daysWorked >= 1) { rank = 'C'; rankColor = '#95a5a6'; }
      else { rank = 'F'; rankColor = '#e74c3c'; }
    } else {
      // Others: Standard thresholds
      if (daysWorked === 7) { rank = 'S'; rankColor = '#f39c12'; }
      else if (daysWorked >= 5) { rank = 'A'; rankColor = '#3498db'; }
      else if (daysWorked >= 3) { rank = 'B'; rankColor = '#2ecc71'; }
      else if (daysWorked >= 1) { rank = 'C'; rankColor = '#95a5a6'; }
      else { rank = 'F'; rankColor = '#e74c3c'; }
    }

    // Determine mood based on workload
    let mood, moodEmoji, moodLevel, overworkWarning = null;

    // Special case for Noah - he's happy when Yuwon is overworked
    if (employee === 'noah') {
      // Check if Yuwon is overworked
      const yuwonTasks = completedTasks.filter(t => t.taskType === 'daily');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yuwonTodayTasks = yuwonTasks.filter(task => {
        const taskDate = new Date(task.completedAt);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });
      const yuwonEnergyPoints = yuwonTodayTasks.reduce((sum, task) => {
        const points = task.energy === 'low' ? 1 : task.energy === 'med' ? 2 : 3;
        return sum + points;
      }, 0);

      if (yuwonEnergyPoints >= 10) {
        mood = 'delighted';
        moodEmoji = '😏';
        moodLevel = 80; // Happy when Yuwon overworks
      } else if (employeeTasks.length === 0 && employeeCompletedTasks.length === 0) {
        mood = 'bored';
        moodEmoji = '😐';
        moodLevel = 25;
      } else if (completedCount > 0) {
        mood = 'satisfied';
        moodEmoji = '🙂';
        moodLevel = 50;
      } else {
        mood = 'okay';
        moodEmoji = '😐';
        moodLevel = 40;
      }
    } else if (employee === 'jaehyun') {
      // Special logic for Jaehyun (habits) - habits are good, shouldn't cause overwork
      if (employeeTasks.length === 0 && employeeCompletedTasks.length === 0) {
        mood = 'neglected';
        moodEmoji = '😢';
        moodLevel = 10; // Very low
      } else if (completedCount === 0 && (pendingTasks > 0 || employeeCompletedTasks.length > 0)) {
        mood = 'bored';
        moodEmoji = '😐';
        moodLevel = 25; // 25%
      } else if (completedCount >= 5) {
        mood = 'thriving';
        moodEmoji = '🌟';
        moodLevel = 90; // High but healthy
      } else if (completedCount >= 3) {
        mood = 'happy';
        moodEmoji = '😊';
        moodLevel = 70; // 70%
      } else if (completedCount > 0) {
        mood = 'content';
        moodEmoji = '🙂';
        moodLevel = 50; // 50%
      } else {
        mood = 'okay';
        moodEmoji = '😌';
        moodLevel = 40; // 40%
      }
    } else {
      // Normal mood logic for other employees (Yuwon, Minkyu)
      if (employeeTasks.length === 0 && employeeCompletedTasks.length === 0) {
        mood = 'extremely bored';
        moodEmoji = '😴';
        moodLevel = 0; // 0%
      } else if (pendingTasks === 0 && completedCount === 0) {
        mood = 'bored';
        moodEmoji = '😐';
        moodLevel = 25; // 25%
      } else if (energyPoints >= 10) {
        mood = 'extremely tired & angry';
        moodEmoji = '😡';
        moodLevel = 120; // Over 100%!
        overworkWarning = '⚠️ STOP! Time to rest immediately!';
      } else if (energyPoints >= 9) {
        mood = 'overworked';
        moodEmoji = '😵';
        moodLevel = 100; // 100%
        overworkWarning = '⚠️ Feeling overworked, should rest soon!';
      } else if (energyPoints >= 6) {
        mood = 'stressed';
        moodEmoji = '😰';
        moodLevel = 80; // 80%
      } else if (completedCount > 0) {
        mood = 'content';
        moodEmoji = '😊';
        moodLevel = 50; // 50%
      } else {
        mood = 'okay';
        moodEmoji = '🙂';
        moodLevel = 40; // 40%
      }
    }

    // Determine performance (kinerja) - character-specific messages
    let performance, performanceEmoji, performanceLevel;
    if (employeeTasks.length === 0 && employeeCompletedTasks.length === 0) {
      performance = 'absolutely nothing to do';
      performanceEmoji = '💤';
      performanceLevel = 0; // 0%
    } else if (completedCount === 0 && pendingTasks > 0) {
      // Character-specific lazy messages
      if (employee === 'yuwon') {
        performance = 'procrastinating like a pro';
      } else if (employee === 'noah') {
        performance = 'ongkang ongkang kaki only (what kind of CEO?!)';
      } else if (employee === 'jaehyun') {
        performance = 'flirting instead of working';
      } else if (employee === 'minkyu') {
        performance = 'staring at the ceiling';
      }
      performanceEmoji = '🦥';
      performanceLevel = 20; // 20%
    } else if (completedCount >= 5 && energyPoints >= 7) {
      // Character-specific excellent messages
      if (employee === 'yuwon') {
        performance = 'overachiever mode activated!';
      } else if (employee === 'noah') {
        performance = 'actually being a CEO for once';
      } else if (employee === 'jaehyun') {
        performance = 'chaotic but productive';
      } else if (employee === 'minkyu') {
        performance = 'quietly crushing it';
      }
      performanceEmoji = '⭐';
      performanceLevel = 100; // 100%
    } else if (completedCount >= 3 || energyPoints >= 4) {
      performance = 'good';
      performanceEmoji = '👍';
      performanceLevel = 70; // 70%
    } else if (completedCount > 0) {
      performance = 'okay';
      performanceEmoji = '👌';
      performanceLevel = 50; // 50%
    } else {
      performance = 'lacking';
      performanceEmoji = '😬';
      performanceLevel = 30; // 30%
    }

    // Generate character-specific status message
    let statusMessage = '';
    const employeeName = employee.charAt(0).toUpperCase() + employee.slice(1);
    const pronoun = employee === 'yuwon' || employee === 'noah' ? 'He' : 'They';

    // Mood part
    statusMessage += `${employeeName} is feeling ${mood}. `;

    // Performance part with character flavor
    if (employee === 'jaehyun') {
      // Special messages for Jaehyun (habits)
      if (employeeTasks.length === 0 && employeeCompletedTasks.length === 0) {
        statusMessage += `${pronoun} feel neglected with no habits to track.`;
      } else if (completedCount === 0 && pendingTasks > 0) {
        statusMessage += `${pronoun} are bored and want you to log some habits!`;
      } else if (completedCount >= 5) {
        statusMessage += `${pronoun} are thriving with all these healthy habits!`;
      } else if (completedCount >= 3) {
        statusMessage += `${pronoun} are happy you're building good habits.`;
      } else if (completedCount > 0) {
        statusMessage += `${pronoun} are content with your progress.`;
      } else {
        statusMessage += `${pronoun} are waiting for habit logs.`;
      }
    } else if (completedCount === 0 && pendingTasks > 0) {
      // Lazy status for other employees
      if (employee === 'yuwon') {
        statusMessage += `${pronoun} is procrastinating like a pro.`;
      } else if (employee === 'noah') {
        statusMessage += `${pronoun} is being a do-nothing CEO (ongkang ongkang kaki only).`;
      } else if (employee === 'minkyu') {
        statusMessage += `${pronoun} are just staring at the ceiling.`;
      }
    } else if (completedCount >= 5 && energyPoints >= 7) {
      // Excellent status for other employees
      if (employee === 'yuwon') {
        statusMessage += `${pronoun} is in overachiever mode!`;
      } else if (employee === 'noah') {
        statusMessage += `${pronoun} is actually being a CEO for once.`;
      } else if (employee === 'minkyu') {
        statusMessage += `${pronoun} are quietly crushing it.`;
      }
    } else if (completedCount > 0) {
      statusMessage += `${pronoun} ${employee === 'yuwon' || employee === 'noah' ? 'is' : 'are'} doing ${performance} work.`;
    } else {
      statusMessage += `${pronoun} ${employee === 'yuwon' || employee === 'noah' ? 'has' : 'have'} nothing to do.`;
    }

    return {
      mood,
      moodEmoji,
      moodLevel,
      performance,
      performanceEmoji,
      performanceLevel,
      rank,
      rankColor,
      daysWorked,
      message: `${moodEmoji} Mood: ${mood} | ${performanceEmoji} Performance: ${performance}`,
      statusMessage: statusMessage,
      doneToday: completedCount,
      energyPoints: energyPoints,
      remainingEnergy: remainingEnergy,
      pendingTasks,
      overworkWarning: overworkWarning
    };
  };

  // Get company-wide rank based on all employees' performance
  const getCompanyRank = () => {
    const employees = ['yuwon', 'jaehyun', 'minkyu', 'noah'];
    const employeeRanks = employees.map(emp => getMoraleStatus(emp));

    // Calculate average rank score (S=5, A=4, B=3, C=2, F=1)
    const rankScores = { 'S': 5, 'A': 4, 'B': 3, 'C': 2, 'F': 1 };
    const totalScore = employeeRanks.reduce((sum, emp) => sum + rankScores[emp.rank], 0);
    const avgScore = totalScore / employees.length;

    // Determine company rank
    let companyRank, companyRankColor;
    if (avgScore >= 4.5) { companyRank = 'S'; companyRankColor = '#f39c12'; }
    else if (avgScore >= 3.5) { companyRank = 'A'; companyRankColor = '#3498db'; }
    else if (avgScore >= 2.5) { companyRank = 'B'; companyRankColor = '#2ecc71'; }
    else if (avgScore >= 1.5) { companyRank = 'C'; companyRankColor = '#95a5a6'; }
    else { companyRank = 'F'; companyRankColor = '#e74c3c'; }

    return {
      rank: companyRank,
      color: companyRankColor,
      avgScore: avgScore.toFixed(1),
      employeeRanks: employeeRanks.map((emp, idx) => ({
        name: employees[idx],
        rank: emp.rank,
        color: emp.rankColor
      }))
    };
  };

  // Seed test data for rank verification (DEV ONLY)
  const seedTestRankData = () => {
    const now = new Date();
    const testTasks = [];

    // Yuwon - S Rank (7 days completed)
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      testTasks.push({
        id: Date.now() + i * 1000,
        text: `Test daily task ${i}`,
        taskType: 'daily',
        energy: 'low',
        assignedEmployee: 'yuwon',
        completedAt: date.toISOString(),
        expEarned: 1,
        wonEarned: 10
      });
    }

    // Jaehyun - A Rank (5 days completed)
    for (let i = 0; i < 5; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      testTasks.push({
        id: Date.now() + 10000 + i * 1000,
        text: `Test habit ${i}`,
        taskType: 'habit',
        energy: 'med',
        assignedEmployee: 'jaehyun',
        completedAt: date.toISOString(),
        expEarned: 2,
        wonEarned: 25
      });
    }

    // Minkyu - B Rank (2 days completed - Finance is forgiving)
    for (let i = 0; i < 2; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      testTasks.push({
        id: Date.now() + 20000 + i * 1000,
        text: `Test finance task ${i}`,
        taskType: 'finance',
        energy: 'high',
        assignedEmployee: 'minkyu',
        completedAt: date.toISOString(),
        expEarned: 3,
        wonEarned: 50
      });
    }

    // Noah - C Rank (1 day completed)
    const date = new Date(now);
    testTasks.push({
      id: Date.now() + 30000,
      text: 'Test recurring task',
      taskType: 'recurring',
      energy: 'med',
      assignedEmployee: 'noah',
      completedAt: date.toISOString(),
      expEarned: 2,
      wonEarned: 25
    });

    setCompletedTasks(testTasks);
    console.log('✅ Test rank data seeded! Yuwon=S, Jaehyun=A, Minkyu=B, Noah=C');
  };

  // AU Book functions
  const unlockAU = (auId) => {
    if (!unlockedAUs.includes(auId)) {
      setUnlockedAUs([...unlockedAUs, auId]);
      // Initialize progress for this AU
      setAuProgress({
        ...auProgress,
        [auId]: { revealedSnippets: [], juiceSpent: 0 }
      });
    }
  };

  const revealSnippet = (auId, snippetIndex, cost) => {
    if (yuCash < cost) return false;

    const currentProgress = auProgress[auId] || { revealedSnippets: [], juiceSpent: 0 };

    if (!currentProgress.revealedSnippets.includes(snippetIndex)) {
      setYuCash(yuCash - cost);
      setAuProgress({
        ...auProgress,
        [auId]: {
          revealedSnippets: [...currentProgress.revealedSnippets, snippetIndex].sort((a, b) => a - b),
          juiceSpent: currentProgress.juiceSpent + cost
        }
      });
      return true;
    }
    return false;
  };

  // Cooking & Inventory functions
  const buyIngredient = (itemId, quantity = 1, price) => {
    if (yuCash < price * quantity) return false; // Not enough money

    setYuCash(prev => prev - (price * quantity));
    setIngredients(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + quantity
    }));
    return true;
  };

  const cookRecipe = (recipeId, recipe) => {
    // Check if we have all ingredients
    const hasIngredients = recipe.ingredients.every(reqIngredient => {
      const playerAmount = ingredients[reqIngredient.id] || 0;
      return playerAmount >= reqIngredient.amount;
    });

    if (!hasIngredients) return false;

    // Deduct ingredients
    const newIngredients = { ...ingredients };
    recipe.ingredients.forEach(reqIngredient => {
      newIngredients[reqIngredient.id] -= reqIngredient.amount;
      if (newIngredients[reqIngredient.id] <= 0) {
        delete newIngredients[reqIngredient.id];
      }
    });
    setIngredients(newIngredients);

    // Add cooked dish
    setCookedDishes(prev => ({
      ...prev,
      [recipeId]: (prev[recipeId] || 0) + 1
    }));

    // Discover recipe if not already discovered
    if (!discoveredRecipes.includes(recipeId)) {
      setDiscoveredRecipes(prev => [...prev, recipeId]);
    }

    return true;
  };

  // Gift dish to character
  const giftDish = (character, dishId) => {
    // Remove one dish from inventory
    const newDishes = { ...cookedDishes };
    if (newDishes[dishId] && newDishes[dishId] > 0) {
      newDishes[dishId] -= 1;
      if (newDishes[dishId] <= 0) {
        delete newDishes[dishId];
      }
      setCookedDishes(newDishes);
      return true;
    }
    return false;
  };

  // Add friendship points
  const addFriendshipPoints = (character, points) => {
    setFriendshipPoints(prev => ({
      ...prev,
      [character]: Math.min(Math.max(prev[character] + points, 0), 2500) // Cap at 10 hearts (2500 points)
    }));
  };

  const consumeDish = (recipeId, quantity = 1) => {
    const currentAmount = cookedDishes[recipeId] || 0;
    if (currentAmount < quantity) return false;

    setCookedDishes(prev => {
      const newDishes = { ...prev };
      newDishes[recipeId] -= quantity;
      if (newDishes[recipeId] <= 0) {
        delete newDishes[recipeId];
      }
      return newDishes;
    });
    return true;
  };

  // Reset all data
  const resetAllData = () => {
    // Clear localStorage
    localStorage.clear();

    // Reset all state to defaults
    setTasks([]);
    setCompletedTasks([]);
    setAccumulatedWon(0);
    setYuCash(0);
    setNoahCreditCard(0);
    setWon(0);
    setTotalExp(0);
    setEmployeeMorale({
      yuwon: { mood: 'happy', overworked: false, bored: false, lastTaskCompletedAt: null, lastRestAt: null },
      jaehyun: { mood: 'happy', overworked: false, bored: false, lastTaskCompletedAt: null, lastRestAt: null },
      minkyu: { mood: 'happy', overworked: false, bored: false, lastTaskCompletedAt: null, lastRestAt: null },
      noah: { mood: 'happy', overworked: false, bored: false, lastTaskCompletedAt: null, lastRestAt: null },
    });
    setHydrationLog([]);
    setRestLog([]);
    setFakeProductivity([]);
    setCollectedCards([]);
    setLastCardDrop(null);
    setGachaHistory([]);
    setUnlockedAUs([]);
    setAuProgress({});
    setIngredients({});
    setCookedDishes({});
    setDiscoveredRecipes([]);
    setFriendshipPoints({
      yuwon: 0,
      noah: 0,
      jaehyun: 0,
      minkyu: 0
    });
    setLastDate(new Date().toDateString());
  };

  const value = {
    tasks,
    completedTasks,
    won,
    accumulatedWon,
    yuCash,
    setYuCash,
    noahCreditCard,
    setNoahCreditCard,
    totalExp,
    fakeProductivity,
    employeeMorale,
    hydrationLog,
    restLog,
    collectedCards,
    setCollectedCards,
    lastCardDrop,
    setLastCardDrop,
    gachaHistory,
    setGachaHistory,
    unlockedAUs,
    setUnlockedAUs,
    auProgress,
    setAuProgress,
    floatingEmployee,
    setFloatingEmployee,
    addTask,
    updateTask,
    deleteTask,
    deleteCompletedTask,
    completeTask,
    logHabit,
    getTasksByDate,
    getTodaysTasks,
    getTasksByType,
    addFakeProductivity,
    deleteFakeProductivity,
    givePaycheck,
    addHydration,
    getTodaysHydration,
    addRest,
    getMoraleStatus,
    getCompanyRank,
    seedTestRankData,
    unlockAU,
    revealSnippet,
    ingredients,
    setIngredients,
    cookedDishes,
    setCookedDishes,
    discoveredRecipes,
    setDiscoveredRecipes,
    buyIngredient,
    cookRecipe,
    giftDish,
    friendshipPoints,
    addFriendshipPoints,
    consumeDish,
    resetAllData,
    budgetGoals,
    setBudgetGoals,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
