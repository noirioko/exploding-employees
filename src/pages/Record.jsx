import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Calendar from '../components/Calendar';

function Record() {
  const { completedTasks, getTodaysTasks, getTasksByDate, fakeProductivity, addFakeProductivity, deleteFakeProductivity, deleteCompletedTask } = useApp();
  const [selectedDate, setSelectedDate] = useState(null);
  const [fakeFilter, setFakeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('daily');
  const [financeMonth, setFinanceMonth] = useState(new Date());
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
  const getFinanceTasks = () => completedTasks.filter(t => t.taskType === 'finance');

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

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <div className="header-left">
            <img
              src="/images/logo_explodingemployee.png"
              alt="Exploding Employee"
              style={{ height: '120px', width: 'auto', objectFit: 'contain', animation: 'pulse 2s ease-in-out infinite' }}
            />
          </div>
          <div className="energy-control">
            <div className="energy-label">
              <span id="energy-icon">📖</span>
              <span>record book</span>
            </div>
          </div>
        </div>
      </div>

      <div className="current-date">
        📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>

      <div className="content">
        {/* Two-column layout: Calendar + Task Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          {/* Left: Calendar */}
          <div>
            <Calendar completedTasks={completedTasks} onDateSelect={handleDateSelect} />

            {/* Today's Wins - Below Calendar */}
            <div style={{ marginTop: '20px' }}>
              <div className="section-header" style={{ marginBottom: '10px' }}>
                <h2 style={{ fontSize: '18px' }}>Today's Wins 🎉</h2>
                <span style={{ color: '#4caf50', fontWeight: 600 }}>{todaysTasks.length} wins!!</span>
              </div>

              <div className="done-list-section" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {todaysTasks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🎯</div>
                    <p>No completed tasks today yet!</p>
                  </div>
                ) : (
                  todaysTasks.map(task => (
                    <div key={task.id} className="done-item">
                      <div className="done-header">
                        <span className="done-icon">✓</span>
                        <span className="done-text">{task.text}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#558b2f', marginTop: '3px' }}>
                        +{task.expEarned} exp, +{task.wonEarned} won
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Task Tabs (Browser-style) */}
          <div>
            <div className="browser-container" style={{ marginTop: 0 }}>
              {/* Browser Tabs */}
              <div className="browser-tabs">
                <div
                  className={`browser-tab ${activeTab === 'daily' ? 'active' : ''}`}
                  onClick={() => setActiveTab('daily')}
                >
                  <span className="tab-icon">📋</span>
                  <span className="tab-title">Daily Tasks</span>
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
              </div>

              {/* Browser Content */}
              <div className="browser-content" style={{ maxHeight: '600px', overflowY: 'auto', padding: '20px' }}>
                {activeTab === 'daily' && (
                  <div>
                    <h3 style={{ fontSize: '16px', color: '#e91e63', marginBottom: '15px' }}>
                      All Daily Tasks ({getDailyTasks().length})
                    </h3>
                    {getDailyTasks().length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <p>No daily tasks completed yet!</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {getDailyTasks().map(task => (
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
                    <h3 style={{ fontSize: '16px', color: '#e91e63', marginBottom: '15px' }}>
                      All Habits ({getHabitTasks().length})
                    </h3>
                    {getHabitTasks().length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">✅</div>
                        <p>No habits logged yet!</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {getHabitTasks().map(task => (
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
                    <h3 style={{ fontSize: '16px', color: '#e91e63', marginBottom: '15px' }}>
                      All Recurring Tasks ({getRecurringTasks().length})
                    </h3>
                    {getRecurringTasks().length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">🔄</div>
                        <p>No recurring tasks completed yet!</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {getRecurringTasks().map(task => (
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
                filteredFakeItems.map(item => (
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
                ))
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
