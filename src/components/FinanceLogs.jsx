import { useState } from 'react';
import { useApp } from '../context/AppContext';
import InfoPopup from './InfoPopup';

function FinanceLogs() {
  const { getTasksByType, addTask, deleteTask, completeTask } = useApp();

  const financeLogs = getTasksByType('finance');

  const [newLog, setNewLog] = useState({
    text: '',
    amount: '',
    deadline: new Date().toISOString().split('T')[0], // Today's date
    taskType: 'finance',
    energy: 'low',
    financeType: 'outcome',
    financeCategory: 'food-beverages',
  });

  const financeCategories = {
    income: [
      { value: 'salary', label: '💼 Salary' },
      { value: 'freelance', label: '💻 Freelance' },
      { value: 'gift', label: '🎁 Gift' },
      { value: 'other-income', label: '➕ Other Income' }
    ],
    outcome: [
      { value: 'food-beverages', label: '🍔 Food & Beverages' },
      { value: 'life', label: '🏠 Life (Bills, Rent)' },
      { value: 'pets', label: '🐾 Pets' },
      { value: 'fun-games', label: '🎮 Fun & Games' },
      { value: 'gacha', label: '🎰 Gacha & Gambling' },
      { value: 'impulse', label: '💸 Impulse Buy' },
      { value: 'transport', label: '🚗 Transport' },
      { value: 'other-outcome', label: '➖ Other Outcome' }
    ]
  };

  const handleAddLog = () => {
    if (newLog.text.trim() && newLog.amount) {
      const amountValue = newLog.financeType === 'income'
        ? Math.abs(parseFloat(newLog.amount))
        : -Math.abs(parseFloat(newLog.amount));

      addTask({
        ...newLog,
        amount: amountValue,
        category: 'business',
      });
      setNewLog({
        text: '',
        amount: '',
        deadline: new Date().toISOString().split('T')[0],
        taskType: 'finance',
        energy: 'low',
        financeType: 'outcome',
        financeCategory: 'food-beverages',
      });
    }
  };

  const handleRecordAll = () => {
    financeLogs.forEach(log => {
      completeTask(log.id);
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddLog();
    }
  };

  const getCategoryLabel = (type, category) => {
    const categories = financeCategories[type] || [];
    const found = categories.find(c => c.value === category);
    return found ? found.label : category;
  };

  return (
    <div className="task-section section-finance" style={{ marginBottom: '30px' }}>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/images/Minkyu_1.png" alt="Minkyu" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'contain', border: '3px solid #c2185b', padding: '3px', background: 'white' }} />
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', color: '#c2185b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              💰 Finance Logs (Draft)
              <InfoPopup
                title="📝 Finance Draft System"
                content={
                  <>
                    <p style={{ marginBottom: '8px' }}><strong>How it works:</strong></p>
                    <p style={{ marginBottom: '8px' }}>• Add expenses/income here as <strong>drafts</strong></p>
                    <p style={{ marginBottom: '8px' }}>• Drafts are <strong>NOT permanent</strong> - edit/delete anytime</p>
                    <p style={{ marginBottom: '8px' }}>• Click "📋 Record" to move to Record tab</p>
                    <p style={{ marginBottom: '0' }}>• Recording gives Minkyu <strong>EXP points!</strong> 💪</p>
                  </>
                }
              />
            </h3>
            <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Track expenses & income, then record them!</p>
          </div>
        </div>
        {financeLogs.length > 0 && (
          <button
            onClick={handleRecordAll}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
            }}
          >
            📋 Record All ({financeLogs.length})
          </button>
        )}
      </div>

      <div className="tasks-table">
        <div className="table-header">
          <div className="col-task">Description</div>
          <div className="col-deadline" style={{ minWidth: '100px' }}>Date</div>
          <div className="col-deadline" style={{ minWidth: '150px' }}>Category</div>
          <div className="col-deadline">Amount</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="table-body">
          {financeLogs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💰</div>
              <p>No finance logs yet! Add expenses or income below.</p>
            </div>
          ) : (
            financeLogs.map(log => (
              <div key={log.id} className="task-row">
                <div className="col-task">
                  <span className="task-text">{log.text}</span>
                </div>
                <div className="col-deadline" style={{ fontSize: '12px', color: '#666' }}>
                  {log.deadline || 'No date'}
                </div>
                <div className="col-deadline" style={{ fontSize: '12px', color: '#666' }}>
                  {getCategoryLabel(log.financeType || 'outcome', log.financeCategory || 'other-outcome')}
                </div>
                <div className="col-deadline" style={{ fontSize: '16px', fontWeight: '700', color: log.amount > 0 ? '#4caf50' : '#ff5252' }}>
                  {log.amount > 0 ? '+' : ''}{log.amount} ₩
                </div>
                <div className="col-actions">
                  <button
                    className="done-btn task-btn"
                    onClick={() => completeTask(log.id)}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    📋 Record
                  </button>
                  <button
                    className="delete-btn task-btn"
                    onClick={() => deleteTask(log.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Add Row */}
        <div className="quick-add-row" style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 1fr 1.5fr 1fr auto', gap: '10px', alignItems: 'center' }}>
          <input
            type="text"
            className="quick-input"
            placeholder="Description..."
            value={newLog.text}
            onChange={(e) => setNewLog({ ...newLog, text: e.target.value })}
            onKeyPress={handleKeyPress}
            style={{ width: '100%' }}
          />

          <input
            type="date"
            value={newLog.deadline}
            onChange={(e) => setNewLog({ ...newLog, deadline: e.target.value })}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '13px',
              backgroundColor: '#fff',
              width: '100%'
            }}
          />

          <select
            value={newLog.financeType}
            onChange={(e) => setNewLog({
              ...newLog,
              financeType: e.target.value,
              financeCategory: e.target.value === 'income' ? 'salary' : 'food-beverages'
            })}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '13px',
              backgroundColor: '#fff'
            }}
          >
            <option value="income">💰 Income</option>
            <option value="outcome">💸 Outcome</option>
          </select>

          <select
            value={newLog.financeCategory}
            onChange={(e) => setNewLog({ ...newLog, financeCategory: e.target.value })}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '13px',
              backgroundColor: '#fff'
            }}
          >
            {financeCategories[newLog.financeType].map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <input
            type="number"
            className="quick-input"
            placeholder="Amount"
            value={newLog.amount}
            onChange={(e) => setNewLog({ ...newLog, amount: e.target.value })}
            onKeyPress={handleKeyPress}
            style={{ width: '100%' }}
          />

          <button className="quick-add-btn" onClick={handleAddLog}>
            ➕ Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default FinanceLogs;
