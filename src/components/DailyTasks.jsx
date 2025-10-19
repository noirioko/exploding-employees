import { useState } from 'react';
import { useApp } from '../context/AppContext';
import EditTaskModal from './EditTaskModal';

function DailyTasks({ energyLevel, onSwitchToRecord }) {
  const { getTasksByType, addTask, completeTask, deleteTask, updateTask, completedTasks } = useApp();

  const allDailyTasks = getTasksByType('daily');

  // Filter tasks based on energy level
  const dailyTasks = allDailyTasks.filter(task => {
    if (energyLevel <= 3) return task.energy === 'low';
    if (energyLevel <= 6) return task.energy === 'low' || task.energy === 'med';
    return true; // 7-10: show all tasks
  });
  const [stampedTasks, setStampedTasks] = useState(new Set());

  const [newTask, setNewTask] = useState({
    text: '',
    category: 'art',
    deadline: '',
    energy: 'med',
    taskType: 'daily',
  });

  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('none');
  const [categoryFilter, setCategoryFilter] = useState(new Set(['art', 'webtoon', 'business', 'life'])); // All categories visible by default

  const handleDone = (taskId) => {
    setStampedTasks(prev => new Set(prev).add(taskId));
  };

  const handleLogAll = () => {
    stampedTasks.forEach(taskId => {
      completeTask(taskId);
    });
    setStampedTasks(new Set());
  };

  const getCatImage = () => {
    if (dailyTasks.length === 0) {
      return '/images/cat_lyingdown.png';
    }

    // All tasks are stamped
    if (stampedTasks.size === dailyTasks.length && dailyTasks.length > 0) {
      return '/images/cat_finish_alltask.png';
    }

    return '/images/cat_task_true_nothingdone.png';
  };

  const handleAddTask = () => {
    if (newTask.text.trim()) {
      addTask(newTask);
      setNewTask({
        text: '',
        category: 'art',
        deadline: '',
        energy: 'med',
        taskType: 'daily',
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedData) => {
    updateTask(editingTask.id, updatedData);
    setIsEditModalOpen(false);
    setEditingTask(null);
  };

  // Check if task is urgent (manually marked OR deadline within 2 days)
  const isUrgent = (task) => {
    // Check manual priority flag first
    if (task.priority) return true;

    // Check deadline proximity
    if (!task.deadline) return false;
    const deadlineDate = new Date(task.deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2; // Today, tomorrow, or day after
  };

  // Toggle category filter
  const toggleCategory = (category) => {
    setCategoryFilter(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Filter and sort tasks
  const getFilteredAndSortedTasks = () => {
    // First filter by category
    let filtered = dailyTasks.filter(task => categoryFilter.has(task.category));

    // Always sort urgent tasks to the top first, regardless of sort option
    filtered.sort((a, b) => {
      const aUrgent = isUrgent(a);
      const bUrgent = isUrgent(b);
      if (aUrgent && !bUrgent) return -1;
      if (!aUrgent && bUrgent) return 1;
      return 0; // Keep relative order if both urgent or both not urgent
    });

    // Then apply secondary sort if not in default mode
    if (sortBy === 'dueDate') {
      filtered.sort((a, b) => {
        // Keep urgent at top
        const aUrgent = isUrgent(a);
        const bUrgent = isUrgent(b);
        if (aUrgent && !bUrgent) return -1;
        if (!aUrgent && bUrgent) return 1;

        // Sort by deadline
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });
    } else if (sortBy === 'energy') {
      const energyOrder = { low: 1, med: 2, high: 3 };
      filtered.sort((a, b) => {
        // Keep urgent at top
        const aUrgent = isUrgent(a);
        const bUrgent = isUrgent(b);
        if (aUrgent && !bUrgent) return -1;
        if (!aUrgent && bUrgent) return 1;

        return energyOrder[a.energy || 'med'] - energyOrder[b.energy || 'med'];
      });
    }

    return filtered;
  };

  const sortedTasks = getFilteredAndSortedTasks();

  return (
    <div className="task-section section-todolist" style={{ marginBottom: '30px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginBottom: '0px',
        marginLeft: '50px',
        marginRight: '50px'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'stretch',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
          boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '60px',
            background: '#5e35b1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <img src="/images/Yuwon_1.png" alt="Yuwon" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'contain' }} />
          </div>
          <div style={{ padding: '12px 20px', background: '#e8eaf6' }}>
            <h3 style={{ fontSize: '18px', color: '#5e35b1', margin: 0, fontWeight: 700 }}>📝 To Do List</h3>
            <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>Yuwon handles these!</p>
          </div>
        </div>

        {/* Sort Tabs - Right Side */}
        {dailyTasks.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '8px', alignItems: 'flex-end' }}>
            {/* Sort Options */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSortBy('none')}
                style={{
                  padding: '6px 12px',
                  background: sortBy === 'none' ? '#5e35b1' : '#e8eaf6',
                  color: sortBy === 'none' ? 'white' : '#5e35b1',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Default
              </button>
              <button
                onClick={() => setSortBy('dueDate')}
                style={{
                  padding: '6px 12px',
                  background: sortBy === 'dueDate' ? '#5e35b1' : '#e8eaf6',
                  color: sortBy === 'dueDate' ? 'white' : '#5e35b1',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                📅 Due Date
              </button>
              <button
                onClick={() => setSortBy('energy')}
                style={{
                  padding: '6px 12px',
                  background: sortBy === 'energy' ? '#5e35b1' : '#e8eaf6',
                  color: sortBy === 'energy' ? 'white' : '#5e35b1',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                ⚡ Energy
              </button>
            </div>

            {/* Category Filters */}
            <div style={{ display: 'flex', gap: '6px', fontSize: '11px' }}>
              <span style={{ color: '#999', fontWeight: 600, marginRight: '4px', alignSelf: 'center' }}>Show:</span>
              <button
                onClick={() => toggleCategory('art')}
                style={{
                  padding: '4px 10px',
                  background: categoryFilter.has('art') ? '#ffebee' : '#f5f5f5',
                  color: categoryFilter.has('art') ? '#c62828' : '#999',
                  border: categoryFilter.has('art') ? '2px solid #c62828' : '2px solid transparent',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: categoryFilter.has('art') ? 1 : 0.5
                }}
              >
                🎨 Art
              </button>
              <button
                onClick={() => toggleCategory('webtoon')}
                style={{
                  padding: '4px 10px',
                  background: categoryFilter.has('webtoon') ? '#e8f5e9' : '#f5f5f5',
                  color: categoryFilter.has('webtoon') ? '#2e7d32' : '#999',
                  border: categoryFilter.has('webtoon') ? '2px solid #2e7d32' : '2px solid transparent',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: categoryFilter.has('webtoon') ? 1 : 0.5
                }}
              >
                📖 Webtoon
              </button>
              <button
                onClick={() => toggleCategory('business')}
                style={{
                  padding: '4px 10px',
                  background: categoryFilter.has('business') ? '#fff3e0' : '#f5f5f5',
                  color: categoryFilter.has('business') ? '#f57c00' : '#999',
                  border: categoryFilter.has('business') ? '2px solid #f57c00' : '2px solid transparent',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: categoryFilter.has('business') ? 1 : 0.5
                }}
              >
                💼 Business
              </button>
              <button
                onClick={() => toggleCategory('life')}
                style={{
                  padding: '4px 10px',
                  background: categoryFilter.has('life') ? '#e3f2fd' : '#f5f5f5',
                  color: categoryFilter.has('life') ? '#1976d2' : '#999',
                  border: categoryFilter.has('life') ? '2px solid #1976d2' : '2px solid transparent',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: categoryFilter.has('life') ? 1 : 0.5
                }}
              >
                🏠 Life
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="tasks-table">
        <div className="table-header">
          <div className="col-task">Task</div>
          <div className="col-category">Category</div>
          <div className="col-deadline">Deadline</div>
          <div className="col-energy">Energy</div>
          <div className="col-check">Check!</div>
          <div className="col-actions">Settings</div>
        </div>

        <div className="table-body">
          {dailyTasks.length === 0 ? (
            <div className="empty-state">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <img
                  src="/images/cat_lyingdown.png"
                  alt="Cat lying down"
                  style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                />
                <p>No daily tasks yet! Add one below to get started.</p>
              </div>
            </div>
          ) : (
            <>
              {sortedTasks.map(task => (
              <div key={task.id} className="task-row">
                <div className="col-task">
                  {isUrgent(task) && <span className="priority-badge">URGENT</span>}
                  <span className="task-text">{task.text}</span>
                </div>
                <div className="col-category">
                  <span className={`category-badge ${task.category}`}>
                    {task.category === 'art' && '🎨 Art'}
                    {task.category === 'webtoon' && '📖 Webtoon'}
                    {task.category === 'business' && '💼 Business'}
                    {task.category === 'life' && '🏠 Life'}
                  </span>
                </div>
                <div className="col-deadline">{task.deadline || 'No deadline'}</div>
                <div className="col-energy">
                  <div className={`energy-dot ${task.energy}`}></div>
                  {task.energy === 'low' && '🔋 Low (1 exp)'}
                  {task.energy === 'med' && '☕ Med (2 exp)'}
                  {task.energy === 'high' && '⚡ High (3 exp)'}
                </div>
                <div className="col-check">
                  <button
                    className="done-btn task-btn"
                    onClick={() => handleDone(task.id)}
                    disabled={stampedTasks.has(task.id)}
                    style={{
                      position: 'relative',
                      opacity: stampedTasks.has(task.id) ? 0.6 : 1
                    }}
                  >
                    <span style={{ filter: stampedTasks.has(task.id) ? 'grayscale(100%)' : 'none' }}>
                      ✓ Done
                    </span>
                    {stampedTasks.has(task.id) && (
                      <img
                        src="/images/stamp_fish.png"
                        alt="Fish stamp"
                        style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          width: '35px',
                          height: '35px',
                          objectFit: 'contain',
                          transform: 'rotate(-15deg)',
                          pointerEvents: 'none',
                          animation: 'stamp 0.5s ease-out'
                        }}
                      />
                    )}
                  </button>
                </div>
                <div className="col-actions">
                  <button className="edit-btn task-btn" onClick={() => handleEditTask(task)}>
                    ✏️
                  </button>
                  <button className="delete-btn task-btn" onClick={() => deleteTask(task.id)}>
                    ✕
                  </button>
                </div>
              </div>
              ))}

              {/* Cat at bottom */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
                borderTop: '2px dashed #e0e0e0'
              }}>
                <img
                  src={getCatImage()}
                  alt="Cat"
                  style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Action Bar - Log All */}
        {stampedTasks.size > 0 && (
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
              Log now?
            </div>
            <button
              onClick={handleLogAll}
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
              📋 Log All ({stampedTasks.size})
            </button>
          </div>
        )}

        {/* Quick Add Row */}
        <div className="quick-add-row">
          <input
            type="text"
            className="quick-input col-task"
            placeholder="Type new daily task and press Enter..."
            value={newTask.text}
            onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
            onKeyPress={handleKeyPress}
          />
          <select
            className="quick-select col-category"
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          >
            <option value="art">🎨 Art</option>
            <option value="webtoon">📖 Webtoon</option>
            <option value="business">💼 Business</option>
            <option value="life">🏠 Life</option>
          </select>
          <input
            type="date"
            className="quick-input col-deadline"
            value={newTask.deadline}
            onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
          />
          <select
            className="quick-select col-energy"
            value={newTask.energy}
            onChange={(e) => setNewTask({ ...newTask, energy: e.target.value })}
          >
            <option value="low">🔋 Low</option>
            <option value="med">☕ Med</option>
            <option value="high">⚡ High</option>
          </select>
          <div className="col-actions">
            <button className="quick-add-btn" onClick={handleAddTask}>
              ➕ Add
            </button>
          </div>
        </div>
      </div>

      {/* Today's Wins - History Section */}
      <div style={{
        marginTop: '30px',
        background: 'white',
        border: '2px solid #e8eaf6',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #e8eaf6 0%, #d1c4e9 100%)',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#5e35b1', margin: 0 }}>
              🎉 Today's Wins
            </h4>
            <p style={{ fontSize: '11px', color: '#7e57c2', margin: '2px 0 0 0' }}>
              You completed {completedTasks.filter(t => {
                const completedDate = new Date(t.completedAt).toDateString();
                const today = new Date().toDateString();
                return completedDate === today && t.taskType === 'daily';
              }).length} tasks today!
            </p>
          </div>
          <button
            onClick={() => onSwitchToRecord && onSwitchToRecord('daily')}
            style={{
              padding: '8px 16px',
              background: '#5e35b1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            📊 See All Records
          </button>
        </div>

        {/* Scrollable history list - max 7 items */}
        <div style={{
          maxHeight: '280px',
          overflowY: 'auto',
          padding: '10px'
        }}>
          {completedTasks
            .filter(t => {
              const completedDate = new Date(t.completedAt).toDateString();
              const today = new Date().toDateString();
              return completedDate === today && t.taskType === 'daily';
            })
            .slice(0, 7)
            .map((task, index) => (
              <div
                key={index}
                style={{
                  padding: '8px 12px',
                  background: '#f5f5f5',
                  borderRadius: '6px',
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '13px', color: '#333', fontWeight: 500 }}>
                    ✓ {task.text}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {task.category && (
                    <span className={`category-badge ${task.category}`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                      {task.category === 'art' && '🎨'}
                      {task.category === 'webtoon' && '📖'}
                      {task.category === 'business' && '💼'}
                      {task.category === 'life' && '🏠'}
                    </span>
                  )}
                  <span style={{ fontSize: '10px', color: '#999', whiteSpace: 'nowrap' }}>
                    {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    padding: '6px 12px',
                    background: task.energy === 'low' ? '#e3f2fd' : task.energy === 'med' ? '#fff3e0' : '#fce4ec',
                    color: task.energy === 'low' ? '#1976d2' : task.energy === 'med' ? '#f57c00' : '#c2185b',
                    borderRadius: '6px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}>
                    {task.energy === 'low' ? '+1' : task.energy === 'med' ? '+2' : '+3'} exp
                  </span>
                </div>
              </div>
            ))}

          {completedTasks.filter(t => {
            const completedDate = new Date(t.completedAt).toDateString();
            const today = new Date().toDateString();
            return completedDate === today && t.taskType === 'daily';
          }).length === 0 && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#999'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
              <p style={{ fontSize: '14px' }}>No tasks completed yet today!</p>
              <p style={{ fontSize: '12px', color: '#bbb' }}>Complete some tasks to see them here</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      <EditTaskModal
        task={editingTask}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

export default DailyTasks;
