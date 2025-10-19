import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Calendar from '../components/Calendar';

function Record() {
  const { completedTasks, getTodaysTasks, getTasksByDate, fakeProductivity, addFakeProductivity, deleteFakeProductivity, updateFakeProductivity } = useApp();
  const [selectedDate, setSelectedDate] = useState(null);
  const [fakeFilter, setFakeFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('daily');
  const [newFakeItem, setNewFakeItem] = useState({
    activity: '',
    category: 'cleaning',
  });
  const [editingFakeId, setEditingFakeId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    activity: '',
    category: 'cleaning',
  });

  const todaysTasks = getTodaysTasks();
  const selectedDateTasks = selectedDate ? getTasksByDate(selectedDate) : [];

  // Filter completed tasks by type (excluding finance - that's in Finance Overview now)
  const getDailyTasks = () => completedTasks.filter(t => t.taskType === 'daily');
  const getHabitTasks = () => completedTasks.filter(t => t.taskType === 'habit');
  const getRecurringTasks = () => completedTasks.filter(t => t.taskType === 'recurring');
  const getImpossibleTasks = () => completedTasks.filter(t => t.taskType === 'impossible');

  // Get tasks for selected date by type
  const getSelectedDateTasksByType = (taskType) => {
    if (!selectedDate) return [];
    return selectedDateTasks.filter(t => t.taskType === taskType);
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

  const handleEditFake = (item) => {
    setEditingFakeId(item.id);
    setEditFormData({
      activity: item.activity,
      category: item.category,
    });
  };

  const handleSaveFake = (id) => {
    updateFakeProductivity(id, editFormData);
    setEditingFakeId(null);
  };

  const handleCancelEdit = () => {
    setEditingFakeId(null);
  };

  // Get color coding for task types matching section headers
  const getTaskTypeColor = (taskType) => {
    const colors = {
      'daily': { bg: '#e8eaf6', border: '#9fa8da', text: '#5e35b1' },     // Indigo (Yuwon)
      'habit': { bg: '#e8f5e9', border: '#a5d6a7', text: '#2e7d32' },     // Green (Jaehyun)
      'finance': { bg: '#f8e5ef', border: '#f48fb1', text: '#c2185b' },   // Burgundy (Minkyu)
      'recurring': { bg: '#fff3e0', border: '#ffb74d', text: '#f57c00' }, // Orange (Noah)
      'impossible': { bg: '#ffebee', border: '#ef5350', text: '#c62828' } // Red (Impossible)
    };
    return colors[taskType] || { bg: '#e0e0e0', border: '#bdbdbd', text: '#666' };
  };

  const filteredFakeItems = fakeProductivity.filter(item => {
    if (fakeFilter === 'all') return true;
    return item.category === fakeFilter;
  });

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
            <div className="browser-container" style={{
              marginTop: 0,
              border: '3px solid #ffc1e3',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(233, 30, 99, 0.1)'
            }}>
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
              <div className="browser-content" style={{
                maxHeight: '600px',
                overflowY: 'auto',
                padding: '20px',
                background: 'linear-gradient(135deg, #fff 0%, #fff9fc 100%)'
              }}>
                {activeTab === 'daily' && (
                  <div>
                    {(selectedDate ? getSelectedDateTasksByType('daily') : getDailyTasks()).length === 0 ? (
                      <div className="empty-state">
                        <div className="empty-icon">📋</div>
                        <p>{selectedDate ? 'No to-do list tasks on this date!' : 'No to-do list tasks completed yet!'}</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(selectedDate ? getSelectedDateTasksByType('daily') : getDailyTasks()).map(task => {
                          const colors = getTaskTypeColor(task.taskType);
                          return (
                            <div key={task.id} style={{
                              background: colors.bg,
                              border: `2px solid ${colors.border}`,
                              borderRadius: '8px',
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span style={{ color: colors.text, fontSize: '16px', fontWeight: '700' }}>✓</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', color: '#333', fontWeight: '500' }}>{task.text}</div>
                                <div style={{ fontSize: '11px', color: colors.text, opacity: 0.7, marginTop: '2px' }}>
                                  {new Date(task.completedAt).toLocaleDateString()} • +{task.expEarned} exp, +{task.wonEarned} won
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(selectedDate ? getSelectedDateTasksByType('habit') : getHabitTasks()).map(task => {
                          const colors = getTaskTypeColor(task.taskType);
                          return (
                            <div key={task.id} style={{
                              background: colors.bg,
                              border: `2px solid ${colors.border}`,
                              borderRadius: '8px',
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span style={{ color: colors.text, fontSize: '16px', fontWeight: '700' }}>✓</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', color: '#333', fontWeight: '500' }}>{task.text}</div>
                                <div style={{ fontSize: '11px', color: colors.text, opacity: 0.7, marginTop: '2px' }}>
                                  {new Date(task.completedAt).toLocaleDateString()} • +{task.expEarned} exp, +{task.wonEarned} won
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(selectedDate ? getSelectedDateTasksByType('recurring') : getRecurringTasks()).map(task => {
                          const colors = getTaskTypeColor(task.taskType);
                          return (
                            <div key={task.id} style={{
                              background: colors.bg,
                              border: `2px solid ${colors.border}`,
                              borderRadius: '8px',
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span style={{ color: colors.text, fontSize: '16px', fontWeight: '700' }}>✓</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', color: '#333', fontWeight: '500' }}>{task.text}</div>
                                <div style={{ fontSize: '11px', color: colors.text, opacity: 0.7, marginTop: '2px' }}>
                                  {new Date(task.completedAt).toLocaleDateString()} • +{task.expEarned} exp, +{task.wonEarned} won
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {(selectedDate ? getSelectedDateTasksByType('impossible') : getImpossibleTasks()).map(task => {
                          const colors = getTaskTypeColor(task.taskType);
                          return (
                            <div key={task.id} style={{
                              background: colors.bg,
                              border: `2px solid ${colors.border}`,
                              borderRadius: '8px',
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span style={{ color: colors.text, fontSize: '16px', fontWeight: '700' }}>✓</span>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', color: '#333', fontWeight: '500' }}>{task.text}</div>
                                <div style={{ fontSize: '11px', color: colors.text, opacity: 0.7, marginTop: '2px' }}>
                                  {new Date(task.completedAt).toLocaleDateString()} • +{task.expEarned} exp, +{task.wonEarned} won
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
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
          <div className="tasks-table">
            <div className="table-header" style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr' }}>
              <div>Activity</div>
              <div>Category</div>
              <div>Date</div>
              <div>Actions</div>
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
                    editingFakeId === item.id ? (
                      // Edit Mode
                      <div key={item.id} className="task-row" style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr' }}>
                        <div className="col-task">
                          <input
                            type="text"
                            className="quick-input"
                            value={editFormData.activity}
                            onChange={(e) => setEditFormData({ ...editFormData, activity: e.target.value })}
                          />
                        </div>
                        <div>
                          <select
                            className="quick-select"
                            value={editFormData.category}
                            onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                          >
                            <option value="cleaning">🧹 Cleaning</option>
                            <option value="work">💼 Actual Work</option>
                            <option value="fake">✨ Fake Productivity</option>
                          </select>
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                        <div className="col-actions">
                          <button className="edit-btn task-btn" onClick={() => handleSaveFake(item.id)}>
                            ✓
                          </button>
                          <button className="delete-btn task-btn" onClick={handleCancelEdit}>
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div key={item.id} className="task-row" style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr' }}>
                        <div className="col-task">
                          <span className="task-text">{item.activity}</span>
                        </div>
                        <div style={{ fontSize: '13px' }}>
                          <span className={`category-badge ${item.category}`} style={{
                            background: item.category === 'cleaning' ? '#4caf50' : item.category === 'work' ? '#2196f3' : '#ff9800'
                          }}>
                            {item.category === 'cleaning' && '🧹 Cleaning'}
                            {item.category === 'work' && '💼 Actual Work'}
                            {item.category === 'fake' && '✨ Fake'}
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#666' }}>
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                        <div className="col-actions">
                          <button className="edit-btn task-btn" onClick={() => handleEditFake(item)}>
                            ✏️
                          </button>
                          <button className="delete-btn task-btn" onClick={() => deleteFakeProductivity(item.id)}>
                            ✕
                          </button>
                        </div>
                      </div>
                    )
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
                      src='/images/diving_cat.png'
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
            <div className="quick-add-row" style={{ gridTemplateColumns: '2fr 1.2fr 1fr 1fr' }}>
              <input
                type="text"
                className="quick-input"
                placeholder="What did you pretend to do productively?..."
                value={newFakeItem.activity}
                onChange={(e) => setNewFakeItem({ ...newFakeItem, activity: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleAddFakeItem()}
              />
              <select
                className="quick-select"
                value={newFakeItem.category}
                onChange={(e) => setNewFakeItem({ ...newFakeItem, category: e.target.value })}
              >
                <option value="cleaning">🧹 Cleaning</option>
                <option value="work">💼 Actual Work</option>
                <option value="fake">✨ Fake Productivity</option>
              </select>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '13px' }}>
                (auto: today)
              </div>
              <button className="quick-add-btn" onClick={handleAddFakeItem}>
                ➕ Add
              </button>
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
