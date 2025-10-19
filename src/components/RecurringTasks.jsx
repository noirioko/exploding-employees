import { useState } from 'react';
import { useApp } from '../context/AppContext';
import EditTaskModal from './EditTaskModal';

function RecurringTasks({ energyLevel, onSwitchToRecord }) {
  const { getTasksByType, addTask, completeTask, deleteTask, updateTask, logHabit, completedTasks } = useApp();

  const allRecurringTasks = getTasksByType('recurring');

  // Filter tasks based on energy level
  const recurringTasks = allRecurringTasks.filter(task => {
    if (energyLevel <= 3) return task.energy === 'low';
    if (energyLevel <= 6) return task.energy === 'low' || task.energy === 'med';
    return true; // 7-10: show all tasks
  });

  const [newTask, setNewTask] = useState({
    text: '',
    category: 'business',
    recurrence: 'weekly',
    recurDay: 'sunday', // For weekly: day of week
    recurDate: '1', // For monthly: day of month (1-31)
    recurDates: ['1', '15'], // For bi-monthly: array of dates
    energy: 'med',
    taskType: 'recurring',
  });

  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('none');

  // Check if a recurring task was logged today
  const isLoggedToday = (taskId) => {
    const today = new Date().toDateString();
    return completedTasks.some(task =>
      task.id === taskId &&
      task.taskType === 'recurring' &&
      new Date(task.completedAt).toDateString() === today
    );
  };

  const handleTaskLog = (taskId) => {
    logHabit(taskId);
  };

  const handleAddTask = () => {
    if (newTask.text.trim()) {
      addTask(newTask);
      setNewTask({
        text: '',
        category: 'business',
        recurrence: 'weekly',
        recurDay: 'sunday',
        recurDate: '1',
        recurDates: ['1', '15'],
        energy: 'med',
        taskType: 'recurring',
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

  // Check if any task was logged today
  const hasLoggedToday = () => {
    const today = new Date().toDateString();
    return completedTasks.some(task =>
      task.taskType === 'recurring' &&
      new Date(task.completedAt).toDateString() === today
    );
  };

  // Check if a task is due today
  const isTaskDueToday = (task) => {
    const today = new Date();
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][today.getDay()];
    const dayOfMonth = today.getDate();

    let isDue = false;
    switch(task.recurrence) {
      case 'daily':
        isDue = true;
        break;
      case 'weekly':
        isDue = task.recurDay === dayOfWeek;
        break;
      case 'monthly':
        isDue = Number(task.recurDate) === dayOfMonth;
        break;
      case 'bi-monthly':
        isDue = task.recurDates && task.recurDates.some(date => Number(date) === dayOfMonth);
        break;
      default:
        isDue = false;
    }

    console.log(`Task "${task.text}" - recurrence: ${task.recurrence}, recurDate: ${task.recurDate}, isDue: ${isDue}, today: ${dayOfWeek}/${dayOfMonth}, task:`, task);
    return isDue;
  };

  // Sort tasks
  const getSortedTasks = () => {
    let sorted = [...recurringTasks];

    if (sortBy === 'energy') {
      const energyOrder = { low: 1, med: 2, high: 3 };
      sorted.sort((a, b) => energyOrder[a.energy || 'med'] - energyOrder[b.energy || 'med']);
    } else if (sortBy === 'category') {
      sorted.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    }

    return sorted;
  };

  const sortedTasks = getSortedTasks();

  return (
    <div className="task-section section-recurring" style={{ marginBottom: '30px' }}>
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
            background: '#e65100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <img src="/images/Noah_1.png" alt="Noah" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'contain' }} />
          </div>
          <div style={{ padding: '12px 20px', background: '#fff3e0' }}>
            <h3 style={{ fontSize: '18px', color: '#f57c00', margin: 0, fontWeight: 700 }}>🔄 Recurring Tasks</h3>
            <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>Noah oversees recurring responsibilities!</p>
          </div>
        </div>

        {/* Sort Tabs - Right Side */}
        {recurringTasks.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', paddingBottom: '8px' }}>
            <button
              onClick={() => setSortBy('none')}
              style={{
                padding: '6px 12px',
                background: sortBy === 'none' ? '#e65100' : '#fff3e0',
                color: sortBy === 'none' ? 'white' : '#f57c00',
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
              onClick={() => setSortBy('energy')}
              style={{
                padding: '6px 12px',
                background: sortBy === 'energy' ? '#e65100' : '#fff3e0',
                color: sortBy === 'energy' ? 'white' : '#f57c00',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              ⚡ Energy
            </button>
            <button
              onClick={() => setSortBy('category')}
              style={{
                padding: '6px 12px',
                background: sortBy === 'category' ? '#e65100' : '#fff3e0',
                color: sortBy === 'category' ? 'white' : '#f57c00',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              🏷️ Category
            </button>
          </div>
        )}
      </div>

      <div className="tasks-table">
        <div className="table-header">
          <div className="col-task">Task</div>
          <div className="col-category">Category</div>
          <div className="col-deadline">Recurrence</div>
          <div className="col-energy">Energy</div>
          <div className="col-check">Check!</div>
          <div className="col-actions">Settings</div>
        </div>

        <div className="table-body">
          {recurringTasks.length === 0 ? (
            <div className="empty-state">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <img
                  src="/images/cat_recurring.png"
                  alt="Cat waiting"
                  style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                />
                <p>No recurring tasks yet! Add weekly or monthly tasks below.</p>
              </div>
            </div>
          ) : (
            <>
              {sortedTasks.map(task => {
              const isDueToday = isTaskDueToday(task);
              const isLogged = isLoggedToday(task.id);
              return (
              <div
                key={task.id}
                className={`task-row ${isDueToday ? 'task-due-today' : ''}`}
              >
                <div className="col-task">
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
                <div className="col-deadline">
                  <span style={{ padding: '4px 8px', background: '#e3f2fd', color: '#1976d2', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                    {task.recurrence === 'daily' && '📅 Daily'}
                    {task.recurrence === 'weekly' && `📅 Every ${task.recurDay ? task.recurDay.charAt(0).toUpperCase() + task.recurDay.slice(1) : 'week'}`}
                    {task.recurrence === 'monthly' && `📅 Every ${task.recurDate ? task.recurDate + (task.recurDate == '1' ? 'st' : task.recurDate == '2' ? 'nd' : task.recurDate == '3' ? 'rd' : 'th') : 'month'}`}
                    {task.recurrence === 'bi-monthly' && task.recurDates && `📅 ${task.recurDates.map(d => d + (d == '1' ? 'st' : d == '2' ? 'nd' : d == '3' ? 'rd' : 'th')).join(' & ')}`}
                  </span>
                </div>
                <div className="col-energy">
                  <div className={`energy-dot ${task.energy}`}></div>
                  {task.energy === 'low' && '🔋 Low (1 exp)'}
                  {task.energy === 'med' && '☕ Med (2 exp)'}
                  {task.energy === 'high' && '⚡ High (3 exp)'}
                </div>
                <div className="col-check">
                  <button
                    className="done-btn task-btn"
                    onClick={() => handleTaskLog(task.id)}
                    style={{
                      position: 'relative',
                      opacity: isLogged ? 0.6 : 1
                    }}
                  >
                    <span style={{ filter: isLogged ? 'grayscale(100%)' : 'none' }}>
                      ✓ Done
                    </span>
                    {isLogged && (
                      <img
                        src="/images/stamp_chick.png"
                        alt="Chick stamp"
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
              );
              })}

              {/* Cat at bottom */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
                borderTop: '2px dashed #e0e0e0'
              }}>
                <img
                  src={hasLoggedToday() ? '/images/cat_recurring2.png' : '/images/cat_recurring.png'}
                  alt="Cat"
                  style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Quick Add Row */}
        <div className="quick-add-row">
          <input
            type="text"
            className="quick-input col-task"
            placeholder="Type recurring task (e.g., Weekly review, Monthly budget)..."
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
          <div className="col-deadline" style={{ display: 'flex', gap: '4px', flexDirection: 'column' }}>
            <select
              className="quick-select"
              value={newTask.recurrence}
              onChange={(e) => setNewTask({ ...newTask, recurrence: e.target.value })}
              style={{ marginBottom: '2px' }}
            >
              <option value="daily">📅 Daily</option>
              <option value="weekly">📅 Weekly</option>
              <option value="bi-monthly">📅 Bi-monthly</option>
              <option value="monthly">📅 Monthly</option>
            </select>
            {newTask.recurrence === 'weekly' && (
              <select
                className="quick-select"
                value={newTask.recurDay}
                onChange={(e) => setNewTask({ ...newTask, recurDay: e.target.value })}
                style={{ fontSize: '10px' }}
              >
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
              </select>
            )}
            {newTask.recurrence === 'monthly' && (
              <select
                className="quick-select"
                value={newTask.recurDate}
                onChange={(e) => setNewTask({ ...newTask, recurDate: e.target.value })}
                style={{ fontSize: '10px' }}
              >
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
                  return <option key={day} value={day}>{day}{suffix}</option>;
                })}
              </select>
            )}
            {newTask.recurrence === 'bi-monthly' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {newTask.recurDates.map((date, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <select
                      className="quick-select"
                      value={date}
                      onChange={(e) => {
                        const newDates = [...newTask.recurDates];
                        newDates[idx] = e.target.value;
                        setNewTask({ ...newTask, recurDates: newDates });
                      }}
                      style={{ fontSize: '10px', width: '60px' }}
                    >
                      {[...Array(31)].map((_, i) => {
                        const day = i + 1;
                        const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
                        return <option key={day} value={day}>{day}{suffix}</option>;
                      })}
                    </select>
                    {newTask.recurDates.length > 1 && (
                      <button
                        onClick={() => {
                          const newDates = newTask.recurDates.filter((_, i) => i !== idx);
                          setNewTask({ ...newTask, recurDates: newDates });
                        }}
                        style={{
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          fontSize: '10px',
                          padding: '2px 4px',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => setNewTask({ ...newTask, recurDates: [...newTask.recurDates, '1'] })}
                  style={{
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    fontSize: '10px',
                    padding: '2px 6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  +
                </button>
              </div>
            )}
          </div>
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

      {/* Today's Completions - History Section */}
      <div style={{
        marginTop: '30px',
        background: 'white',
        border: '2px solid #fff3e0',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#e65100', margin: 0 }}>
              🔄 Today's Completions
            </h4>
            <p style={{ fontSize: '11px', color: '#f57c00', margin: '2px 0 0 0' }}>
              You logged {completedTasks.filter(t => {
                const completedDate = new Date(t.completedAt).toDateString();
                const today = new Date().toDateString();
                return completedDate === today && t.taskType === 'recurring';
              }).length} recurring tasks today!
            </p>
          </div>
          <button
            onClick={() => onSwitchToRecord && onSwitchToRecord('recurring')}
            style={{
              padding: '8px 16px',
              background: '#e65100',
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
              return completedDate === today && t.taskType === 'recurring';
            })
            .slice(0, 7)
            .map((task, index) => (
              <div
                key={index}
                style={{
                  padding: '12px 15px',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  marginBottom: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>
                    ✓ {task.text}
                  </span>
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                    {task.recurrence === 'daily' && '📅 Daily'}
                    {task.recurrence === 'weekly' && `📅 Every ${task.recurDay ? task.recurDay.charAt(0).toUpperCase() + task.recurDay.slice(1) : 'week'}`}
                    {task.recurrence === 'monthly' && `📅 Monthly`}
                    {task.recurrence === 'bi-monthly' && `📅 Bi-monthly`}
                    {' • '}
                    {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <span style={{
                  fontSize: '11px',
                  padding: '4px 8px',
                  background: task.energy === 'low' ? '#e3f2fd' : task.energy === 'med' ? '#fff3e0' : '#fce4ec',
                  color: task.energy === 'low' ? '#1976d2' : task.energy === 'med' ? '#f57c00' : '#c2185b',
                  borderRadius: '4px',
                  fontWeight: 600
                }}>
                  {task.energy === 'low' ? '+1 exp' : task.energy === 'med' ? '+2 exp' : '+3 exp'}
                </span>
              </div>
            ))}

          {completedTasks.filter(t => {
            const completedDate = new Date(t.completedAt).toDateString();
            const today = new Date().toDateString();
            return completedDate === today && t.taskType === 'recurring';
          }).length === 0 && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#999'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔄</div>
              <p style={{ fontSize: '14px' }}>No recurring tasks completed yet today!</p>
              <p style={{ fontSize: '12px', color: '#bbb' }}>Complete some to see them here</p>
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

export default RecurringTasks;
