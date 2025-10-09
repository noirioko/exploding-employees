import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Calendar from '../components/Calendar';

function Record() {
  const { completedTasks, getTodaysTasks, getTasksByDate, fakeProductivity, addFakeProductivity, deleteFakeProductivity, deleteCompletedTask, budgetGoals, setBudgetGoals } = useApp();
  const [selectedDate, setSelectedDate] = useState(null);
  const [fakeFilter, setFakeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('daily');
  const [financeMonth, setFinanceMonth] = useState(new Date());
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [newFakeItem, setNewFakeItem] = useState({
    activity: '',
    category: 'cleaning',
  });

  const todaysTasks = getTodaysTasks();
  const selectedDateTasks = selectedDate ? getTasksByDate(selectedDate) : [];

  // Filter completed tasks by type
  const getDailyTasks = () => completedTasks.filter(t => t.taskType === 'daily');
  const getHabitTasks = () => completedTasks.filter(t => t.taskType === 'habit');
  const getRecurringTasks = () => completedTasks.filter(t => t.taskType === 'recurring');
  const getImpossibleTasks = () => completedTasks.filter(t => t.taskType === 'impossible');
  const getFinanceTasks = () => completedTasks.filter(t => t.taskType === 'finance');

  // Get tasks for selected date by type
  const getSelectedDateTasksByType = (taskType) => {
    if (!selectedDate) return [];
    return selectedDateTasks.filter(t => t.taskType === taskType);
  };

  // Get finance tasks for selected month
  const getFinanceByMonth = () => {
    return getFinanceTasks().filter(task => {
      const taskDate = new Date(task.completedAt);
      return taskDate.getMonth() === financeMonth.getMonth() &&
             taskDate.getFullYear() === financeMonth.getFullYear();
    });
  };

  const changeMonth = (direction) => {
    const newMonth = new Date(financeMonth);
    newMonth.setMonth(financeMonth.getMonth() + direction);
    setFinanceMonth(newMonth);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleAddFakeItem = () => {
    if (newFakeItem.activity.trim()) {
      addFakeProductivity(newFakeItem);
      setNewFakeItem({
        activity: '',
        category: 'cleaning',
      });
    }
  };

  const filteredFakeItems = fakeProductivity.filter(item => {
    if (fakeFilter === 'all') return true;
    return item.category === fakeFilter;
  });

  // Calculate actual income/spending for current period
  const calculatePeriodTotals = () => {
    const startDate = new Date(budgetGoals.startDate);

    // Calculate period end based on goal period
    let periodEnd = new Date(startDate);
    if (budgetGoals.period === 'weekly') {
      periodEnd.setDate(startDate.getDate() + 7);
    } else if (budgetGoals.period === 'monthly') {
      periodEnd.setMonth(startDate.getMonth() + 1);
    } else if (budgetGoals.period === 'yearly') {
      periodEnd.setFullYear(startDate.getFullYear() + 1);
    }

    // Filter completed finance tasks in current period
    const periodTasks = completedTasks.filter(task => {
      if (task.taskType !== 'finance') return false;
      const taskDate = new Date(task.completedAt);
      return taskDate >= startDate && taskDate <= periodEnd;
    });

    const totalIncome = periodTasks
      .filter(t => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalSpending = Math.abs(periodTasks
      .filter(t => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0));

    return { totalIncome, totalSpending, periodEnd };
  };

  const { totalIncome, totalSpending, periodEnd } = calculatePeriodTotals();
  const incomeProgress = budgetGoals.incomeGoal > 0 ? (totalIncome / budgetGoals.incomeGoal) * 100 : 0;
  const spendingProgress = budgetGoals.spendingBudget > 0 ? (totalSpending / budgetGoals.spendingBudget) * 100 : 0;

  // Determine cat state for budget
  const getBudgetCatState = () => {
    if (budgetGoals.incomeGoal === 0 && budgetGoals.spendingBudget === 0) {
      return '/images/cat_finance1.png'; // No goals set
    }

    const incomeGood = budgetGoals.incomeGoal === 0 || totalIncome >= budgetGoals.incomeGoal;
    const spendingGood = budgetGoals.spendingBudget === 0 || totalSpending <= budgetGoals.spendingBudget;

    if (incomeGood && spendingGood) {
      return '/images/cat_finance3.png'; // Goals met!
    } else if (incomeProgress >= 50 || (spendingProgress <= 75 && budgetGoals.spendingBudget > 0)) {
      return '/images/cat_finance2.png'; // On track
    } else {
      return '/images/cat_sad.png'; // Behind
    }
  };

  return (
    <div>
      <div className="content">
        {/* Done List Title */}
        <h2 style={{ fontSize: '24px', color: '#e91e63', marginBottom: '20px', fontWeight: 700 }}>
          📝 Done List
        </h2>

        {/* Today's Wins - Full Width Compact */}
        <div style={{
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
          padding: '15px 20px',
          borderRadius: '8px',
          border: '2px solid #c5e1a5'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '16px', color: '#558b2f', margin: 0, fontWeight: 700 }}>Today's Wins 🎉</h3>
            <span style={{ color: '#558b2f', fontWeight: 700, fontSize: '14px' }}>{todaysTasks.length} wins!!</span>
          </div>

          {todaysTasks.length === 0 ? (
            <div style={{ fontSize: '13px', color: '#7cb342', fontStyle: 'italic', textAlign: 'center', padding: '10px 0' }}>
              No completed tasks today yet!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {todaysTasks.map(task => (
                <div key={task.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'white',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  fontSize: '13px'
                }}>
                  <span style={{ color: '#4caf50', marginRight: '8px', fontWeight: 700 }}>✓</span>
                  <span style={{ flex: 1, color: '#333' }}>{task.text}</span>
                  <span style={{
                    padding: '2px 8px',
                    background: '#e3f2fd',
                    color: '#1976d2',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    marginLeft: '10px',
                    whiteSpace: 'nowrap'
                  }}>
                    +{task.expEarned} exp
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    background: '#fff3e0',
                    color: '#f57c00',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 700,
                    marginLeft: '6px',
                    whiteSpace: 'nowrap'
                  }}>
                    +{task.wonEarned} won
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Two-column layout: Calendar + Task Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          {/* Left: Calendar */}
          <div>
            <Calendar completedTasks={completedTasks} onDateSelect={handleDateSelect} />
          </div>

          {/* Right: Task Tabs (Browser-style) */}
          <div>
            <h3 style={{ fontSize: '16px', color: '#666', marginBottom: '15px', fontWeight: 600 }}>
              {selectedDate
                ? `📅 ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : '📅 All Time'}
            </h3>
            <div className="browser-container" style={{ marginTop: 0 }}>
              {/* Browser Tabs */}
              <div className="browser-tabs">
                <div
                  className={`browser-tab ${activeTab === 'daily' ? 'active' : ''}`}
                  onClick={() => setActiveTab('daily')}
                >
                  <span className="tab-icon">📋</span>
                  <span className="tab-title">To-Do List</span>
                </div>
                <div
                  className={`browser-tab ${activeTab === 'habits' ? 'active' : ''}`}
                  onClick={() => setActiveTab('habits')}
                >
                  <span className="tab-icon">✅</span>
                  <span className="tab-title">Habits</span>
                </div>
                <div
                  className={`browser-tab ${activeTab === 'recurring' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recurring')}
                >
                  <span className="tab-icon">🔄</span>
                  <span className="tab-title">Recurring</span>
                </div>
                <div
                  className={`browser-tab ${activeTab === 'impossible' ? 'active' : ''}`}
                  onClick={() => setActiveTab('impossible')}
                >
                  <span className="tab-icon">🌟</span>
                  <span className="tab-title">Impossible</span>
                </div>
              </div>

              {/* Browser Content */}
              <div className="browser-content" style={{ maxHeight: '600px', overflowY: 'auto', padding: '20px' }}>
                {activeTab === 'daily' && (
                  <div>
                    {(selectedDate ? getSelectedDateTasksByType('daily') : getDailyTasks()).length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <p>{selectedDate ? 'No to-do list tasks on this date!' : 'No to-do list tasks completed yet!'}</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {(selectedDate ? getSelectedDateTasksByType('daily') : getDailyTasks()).map(task => (
                          <div key={task.id} className="done-item">
                            <div className="done-header">
                              <span className="done-icon">✓</span>
                              <span className="done-text">{task.text}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>
                              {new Date(task.completedAt).toLocaleDateString()} • +{task.expEarned} exp, +{task.wonEarned} won
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'habits' && (
                  <div>
                    {(selectedDate ? getSelectedDateTasksByType('habit') : getHabitTasks()).length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">✅</div>
                        <p>{selectedDate ? 'No habits logged on this date!' : 'No habits logged yet!'}</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {(selectedDate ? getSelectedDateTasksByType('habit') : getHabitTasks()).map(task => (
                          <div key={task.id} className="done-item">
                            <div className="done-header">
                              <span className="done-icon">✓</span>
                              <span className="done-text">{task.text}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>
                              {new Date(task.completedAt).toLocaleDateString()} • +{task.expEarned} exp, +{task.wonEarned} won
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'recurring' && (
                  <div>
                    {(selectedDate ? getSelectedDateTasksByType('recurring') : getRecurringTasks()).length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">🔄</div>
                        <p>{selectedDate ? 'No recurring tasks on this date!' : 'No recurring tasks completed yet!'}</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {(selectedDate ? getSelectedDateTasksByType('recurring') : getRecurringTasks()).map(task => (
                          <div key={task.id} className="done-item">
                            <div className="done-header">
                              <span className="done-icon">✓</span>
                              <span className="done-text">{task.text}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>
                              {new Date(task.completedAt).toLocaleDateString()} • +{task.expEarned} exp, +{task.wonEarned} won
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'impossible' && (
                  <div>
                    {(selectedDate ? getSelectedDateTasksByType('impossible') : getImpossibleTasks()).length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">🌟</div>
                        <p>{selectedDate ? 'No impossible tasks on this date!' : 'No impossible tasks completed yet!'}</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {(selectedDate ? getSelectedDateTasksByType('impossible') : getImpossibleTasks()).map(task => (
                          <div key={task.id} className="done-item">
                            <div className="done-header">
                              <span className="done-icon">✓</span>
                              <span className="done-text">{task.text}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#999', marginTop: '3px' }}>
                              {new Date(task.completedAt).toLocaleDateString()} • +{task.expEarned} exp, +{task.wonEarned} won
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Finance Section with Month Navigation */}
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', color: '#e91e63' }}>💰 Finance Records</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button
                onClick={() => changeMonth(-1)}
                style={{
                  background: 'white',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  padding: '8px 15px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                ←
              </button>
              <span style={{ fontSize: '16px', fontWeight: 600, color: '#666', minWidth: '150px', textAlign: 'center' }}>
                {financeMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={() => changeMonth(1)}
                style={{
                  background: 'white',
                  border: '2px solid #e0e0e0',
                  borderRadius: '6px',
                  padding: '8px 15px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                →
              </button>
            </div>
          </div>

          {/* Finance Table */}
          <div className="tasks-table">
            <div className="table-header">
              <div className="col-task">Description</div>
              <div className="col-deadline" style={{ minWidth: '150px' }}>Category</div>
              <div className="col-deadline">Amount</div>
              <div className="col-category">Date</div>
              <div className="col-actions">Actions</div>
            </div>

            <div className="table-body">
              {getFinanceByMonth().length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">💰</div>
                  <p>No finance records for this month.</p>
                </div>
              ) : (
                getFinanceByMonth().map(log => {
                  const getCategoryLabel = () => {
                    const categories = {
                      'salary': '💼 Salary',
                      'freelance': '💻 Freelance',
                      'gift': '🎁 Gift',
                      'other-income': '➕ Other Income',
                      'food-beverages': '🍔 Food & Beverages',
                      'life': '🏠 Life (Bills, Rent)',
                      'pets': '🐾 Pets',
                      'fun-games': '🎮 Fun & Games',
                      'gacha': '🎰 Gacha & Gambling',
                      'impulse': '💸 Impulse Buy',
                      'transport': '🚗 Transport',
                      'other-outcome': '➖ Other Outcome'
                    };
                    return categories[log.financeCategory] || log.financeCategory || 'No category';
                  };

                  return (
                    <div key={log.id} className="task-row">
                      <div className="col-task">
                        <span className="task-text">{log.text}</span>
                      </div>
                      <div className="col-deadline" style={{ fontSize: '12px', color: '#666' }}>
                        {getCategoryLabel()}
                      </div>
                      <div className="col-deadline" style={{ fontSize: '16px', fontWeight: '700', color: log.amount > 0 ? '#4caf50' : '#ff5252' }}>
                        {log.amount > 0 ? '+' : ''}{log.amount} ₩
                      </div>
                      <div className="col-category">
                        {new Date(log.completedAt).toLocaleDateString()}
                      </div>
                      <div className="col-actions">
                        <button
                          className="delete-btn task-btn"
                          onClick={() => deleteCompletedTask(log.id)}
                          style={{ fontSize: '12px', padding: '6px 10px' }}
                        >
                          ✕ Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Finance Summary */}
          <div style={{ marginTop: '15px', display: 'flex', gap: '20px', justifyContent: 'flex-end' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <strong>Total Income:</strong> <span style={{ color: '#4caf50', fontWeight: 700 }}>
                +{getFinanceByMonth().filter(t => t.amount > 0).reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)} ₩
              </span>
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <strong>Total Expenses:</strong> <span style={{ color: '#ff5252', fontWeight: 700 }}>
                {getFinanceByMonth().filter(t => t.amount < 0).reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)} ₩
              </span>
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              <strong>Net:</strong> <span style={{ fontWeight: 700, color: getFinanceByMonth().reduce((sum, t) => sum + parseFloat(t.amount || 0), 0) >= 0 ? '#4caf50' : '#ff5252' }}>
                {getFinanceByMonth().reduce((sum, t) => sum + parseFloat(t.amount || 0), 0)} ₩
              </span>
            </div>
          </div>

          {/* Budget Goals Tracker */}
          <div style={{
            background: 'linear-gradient(135deg, #fff9e6 0%, #ffe6f0 100%)',
            border: '3px solid #ffd93d',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '30px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '18px', color: '#c2185b', margin: 0 }}>
                💰 Budget Goals ({budgetGoals.period.charAt(0).toUpperCase() + budgetGoals.period.slice(1)})
              </h3>
              <button
                onClick={() => setShowBudgetModal(!showBudgetModal)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#c2185b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600
                }}
              >
                ⚙️ {showBudgetModal ? 'Close' : 'Set Goals'}
              </button>
            </div>

            {/* Budget Settings Modal */}
            {showBudgetModal && (
              <div style={{
                background: 'white',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '15px',
                border: '2px solid #e0e0e0'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Period:</label>
                    <select
                      value={budgetGoals.period}
                      onChange={(e) => setBudgetGoals({ ...budgetGoals, period: e.target.value, startDate: new Date().toISOString() })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                    >
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Income Goal (₩):</label>
                    <input
                      type="number"
                      value={budgetGoals.incomeGoal}
                      onChange={(e) => setBudgetGoals({ ...budgetGoals, incomeGoal: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '6px',
                        fontSize: '14px'
                      }}
                      placeholder="e.g., 10000"
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#666', marginBottom: '5px' }}>Spending Budget (₩):</label>
                  <input
                    type="number"
                    value={budgetGoals.spendingBudget}
                    onChange={(e) => setBudgetGoals({ ...budgetGoals, spendingBudget: Number(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                    placeholder="e.g., 5000"
                  />
                </div>
              </div>
            )}

            {/* Progress Display */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              {/* Income Progress */}
              <div style={{ background: 'white', padding: '15px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>💵 Income</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#4caf50', marginBottom: '8px' }}>
                  {totalIncome.toLocaleString()} ₩
                </div>
                {budgetGoals.incomeGoal > 0 && (
                  <>
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '5px' }}>
                      Goal: {budgetGoals.incomeGoal.toLocaleString()} ₩
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(incomeProgress, 100)}%`,
                        height: '100%',
                        background: incomeProgress >= 100 ? '#4caf50' : '#ffa726',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                      {incomeProgress.toFixed(0)}%
                    </div>
                  </>
                )}
              </div>

              {/* Spending Progress */}
              <div style={{ background: 'white', padding: '15px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>💸 Spending</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#ff5252', marginBottom: '8px' }}>
                  {totalSpending.toLocaleString()} ₩
                </div>
                {budgetGoals.spendingBudget > 0 && (
                  <>
                    <div style={{ fontSize: '11px', color: '#999', marginBottom: '5px' }}>
                      Budget: {budgetGoals.spendingBudget.toLocaleString()} ₩
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(spendingProgress, 100)}%`,
                        height: '100%',
                        background: spendingProgress > 100 ? '#ff5252' : spendingProgress > 75 ? '#ffa726' : '#4caf50',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '5px' }}>
                      {spendingProgress.toFixed(0)}%
                    </div>
                  </>
                )}
              </div>

              {/* Cat State */}
              <div style={{
                background: 'white',
                padding: '15px',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={getBudgetCatState()}
                  alt="Cat status"
                  style={{ width: '80px', height: '80px', objectFit: 'contain' }}
                />
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#999', textAlign: 'center' }}>
              Period ends: {periodEnd.toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ margin: '40px 0', textAlign: 'center' }}>
          <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #ffd6a5, transparent)', margin: '20px 0' }}></div>
        </div>

        {/* Fake Productivity Record Book */}
        <div className="fake-productivity-section">
          <div className="fake-prod-header">
            <h2>📝 Fake Productivity Record Book</h2>
            <p className="fake-prod-tagline">
              Did you do fake productivity like arranging your spices? you can write that down too so you feel like you did something :p
            </p>
          </div>

          <div className="section-header">
            <div className="filter-buttons">
              <button
                className={`filter-btn ${fakeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setFakeFilter('all')}
              >
                all
              </button>
              <button
                className={`filter-btn ${fakeFilter === 'cleaning' ? 'active' : ''}`}
                onClick={() => setFakeFilter('cleaning')}
              >
                🧹 cleaning
              </button>
              <button
                className={`filter-btn ${fakeFilter === 'work' ? 'active' : ''}`}
                onClick={() => setFakeFilter('work')}
              >
                💼 actual work
              </button>
              <button
                className={`filter-btn ${fakeFilter === 'fake' ? 'active' : ''}`}
                onClick={() => setFakeFilter('fake')}
              >
                ✨ fake productivity
              </button>
            </div>
          </div>

          {/* Fake Productivity Table */}
          <div className="fake-prod-table">
            <div className="table-header">
              <div className="col-fake-activity">Activity</div>
              <div className="col-fake-category">Category</div>
              <div className="col-fake-date">Date</div>
              <div className="col-fake-actions">Actions</div>
            </div>
            <div className="table-body">
              {filteredFakeItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">✨</div>
                  <p>{fakeProductivity.length === 0 ? 'No fake productivity yet!' : 'No items match this filter.'}</p>
                </div>
              ) : (
                <>
                  {filteredFakeItems.map(item => (
                    <div key={item.id} className="fake-prod-item">
                      <div className="fake-prod-text">{item.activity}</div>
                      <span className={`fake-prod-category ${item.category}`}>
                        {item.category === 'cleaning' && '🧹 Cleaning'}
                        {item.category === 'work' && '💼 Actual Work'}
                        {item.category === 'fake' && '✨ Fake Productivity'}
                      </span>
                      <div className="fake-prod-date">
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                      <div className="col-fake-actions">
                        <button
                          className="delete-btn task-btn"
                          onClick={() => deleteFakeProductivity(item.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Cat at bottom when items exist */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '20px',
                    borderTop: '2px dashed #e0e0e0'
                  }}>
                    <img
                      src='/images/cat_productivity.png'
                      alt="Cat"
                      style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                    />
                    {fakeProductivity.length >= 15 && (
                      <div style={{
                        fontSize: '13px',
                        color: '#999',
                        fontStyle: 'italic',
                        textAlign: 'center'
                      }}>
                        🎉 {fakeProductivity.length} fake productivity activities logged!
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Quick Add Row */}
            <div className="quick-add-row">
              <input
                type="text"
                className="quick-input col-fake-activity"
                placeholder="What did you pretend to do productively?..."
                value={newFakeItem.activity}
                onChange={(e) => setNewFakeItem({ ...newFakeItem, activity: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleAddFakeItem()}
              />
              <select
                className="quick-select col-fake-category"
                value={newFakeItem.category}
                onChange={(e) => setNewFakeItem({ ...newFakeItem, category: e.target.value })}
              >
                <option value="cleaning">🧹 Cleaning</option>
                <option value="work">💼 Actual Work</option>
                <option value="fake">✨ Fake Productivity</option>
              </select>
              <div className="col-fake-date" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '13px' }}>
                (auto: today)
              </div>
              <div className="col-fake-actions">
                <button className="quick-add-btn" onClick={handleAddFakeItem}>
                  ➕ Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer">
        <span>💕 you're doing amazing babe! even tiny steps count! 🌸</span>
      </div>
    </div>
  );
}

export default Record;
