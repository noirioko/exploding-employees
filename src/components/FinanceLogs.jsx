import { useState } from 'react';
import { useApp } from '../context/AppContext';
import InfoPopup from './InfoPopup';

function FinanceLogs({ energyLevel }) {
  const { getTasksByType, addTask, deleteTask, completeTask } = useApp();

  // Finance logs don't typically need energy filtering, but keep for consistency
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

      <div style={{
        display: 'inline-flex',
        alignItems: 'stretch',
        marginBottom: '0px',
        marginLeft: '50px',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '60px',
          background: '#00897b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <img src="/images/Minkyu_1.png" alt="Minkyu" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'contain' }} />
        </div>
        <div style={{ padding: '12px 20px', background: '#e0f2f1' }}>
          <h3 style={{ fontSize: '18px', color: '#00897b', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>Track expenses & income, then record them!</p>
        </div>
      </div>

      <div className="tasks-table">
        <div className="table-header">
          <div className="col-task">Description</div>
          <div className="col-deadline" style={{ minWidth: '100px' }}>Date</div>
          <div className="col-deadline" style={{ minWidth: '150px' }}>Category</div>
          <div className="col-deadline">Amount</div>
          <div className="col-check">Log!</div>
          <div className="col-actions">Settings</div>
        </div>

        <div className="table-body">
          {financeLogs.length === 0 ? (
            <div className="empty-state">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <img
                  src="/images/cat_finance1.png"
                  alt="Cat finance"
                  style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                />
                <p>No finance logs yet! Add expenses or income below.</p>
              </div>
            </div>
          ) : (
            <>
              {financeLogs.map(log => (
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
                <div className="col-check">
                  <button
                    className="done-btn task-btn"
                    onClick={() => completeTask(log.id)}
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    📋 Record
                  </button>
                </div>
                <div className="col-actions">
                  <button
                    className="delete-btn task-btn"
                    onClick={() => deleteTask(log.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
              ))}

              {/* Cat at bottom based on progress */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
                borderTop: '2px dashed #e0e0e0'
              }}>
                <img
                  src={
                    financeLogs.length === 0 ? '/images/cat_finance1.png' :
                    financeLogs.length <= 5 ? '/images/cat_finance2.png' :
                    '/images/cat_finance3.png'
                  }
                  alt="Cat"
                  style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Action Bar - Like invoice totals */}
        {financeLogs.length > 0 && (
          <div style={{
            marginTop: '15px',
            padding: '15px 20px',
            background: '#f5f5f5',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{ fontSize: '14px', color: '#666', fontWeight: 600 }}>
              Record now?
            </div>
            <button
              onClick={handleRecordAll}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
              }}
            >
              📋 Record All ({financeLogs.length})
            </button>
          </div>
        )}

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
