import { useState } from 'react';
import { useApp } from '../context/AppContext';

function BudgetGoals() {
  const { budgetGoals, setBudgetGoals, completedTasks } = useApp();
  const [showBudgetModal, setShowBudgetModal] = useState(false);

  // Calculate budget period totals
  const calculatePeriodTotals = () => {
    const startDate = new Date(budgetGoals.startDate);
    let periodEnd = new Date(startDate);

    if (budgetGoals.period === 'weekly') {
      periodEnd.setDate(startDate.getDate() + 7);
    } else if (budgetGoals.period === 'monthly') {
      periodEnd.setMonth(startDate.getMonth() + 1);
    } else if (budgetGoals.period === 'yearly') {
      periodEnd.setFullYear(startDate.getFullYear() + 1);
    }

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

  const getBudgetCatState = () => {
    if (budgetGoals.incomeGoal === 0 && budgetGoals.spendingBudget === 0) {
      return '/images/cat_finance1.png';
    }
    const incomeGood = budgetGoals.incomeGoal === 0 || totalIncome >= budgetGoals.incomeGoal;
    const spendingGood = budgetGoals.spendingBudget === 0 || totalSpending <= budgetGoals.spendingBudget;

    if (incomeGood && spendingGood) {
      return '/images/cat_finance3.png';
    } else if (incomeProgress >= 50 || (spendingProgress <= 75 && budgetGoals.spendingBudget > 0)) {
      return '/images/cat_finance2.png';
    } else {
      return '/images/cat_sad.png';
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Budget Goals Tracker */}
      <div style={{
        background: 'linear-gradient(135deg, #fff9e6 0%, #ffe6f0 100%)',
        border: '3px solid #ffd93d',
        borderRadius: '12px',
        padding: '20px'
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
  );
}

export default BudgetGoals;
