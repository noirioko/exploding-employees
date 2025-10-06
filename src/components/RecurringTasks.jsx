import { useState } from 'react';
import { useApp } from '../context/AppContext';
import EditTaskModal from './EditTaskModal';

function RecurringTasks() {
  const { getTasksByType, addTask, completeTask, deleteTask, updateTask, logHabit } = useApp();

  const recurringTasks = getTasksByType('recurring');

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
  const [completedTaskId, setCompletedTaskId] = useState(null);

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

  const handleComplete = (taskId) => {
    setCompletedTaskId(taskId);
    setTimeout(() => {
      logHabit(taskId);
      setCompletedTaskId(null);
    }, 500);
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

  return (
    <div className="task-section section-recurring" style={{ marginBottom: '30px' }}>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', justifyContent: 'flex-start' }}>
        <img src="/images/Noah_1.png" alt="Noah" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'contain', border: '3px solid #e65100', padding: '3px', background: 'white' }} />
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '18px', color: '#f57c00', margin: 0 }}>🔄 Recurring Tasks</h3>
          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Noah oversees recurring responsibilities!</p>
        </div>
      </div>

      <div className="tasks-table">
        <div className="table-header">
          <div className="col-task">Task</div>
          <div className="col-category">Category</div>
          <div className="col-deadline">Recurrence</div>
          <div className="col-energy">Energy</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="table-body">
          {recurringTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔄</div>
              <p>No recurring tasks yet! Add weekly or monthly tasks below.</p>
            </div>
          ) : (
            recurringTasks.map(task => {
              const isDueToday = isTaskDueToday(task);
              const isCompleting = completedTaskId === task.id;
              return (
              <div
                key={task.id}
                className={`task-row ${isCompleting ? 'task-completing' : (isDueToday ? 'task-due-today' : '')}`}
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
                <div className="col-actions">
                  <button className="edit-btn task-btn" onClick={() => handleEditTask(task)}>
                    ✏️
                  </button>
                  <button className="done-btn task-btn" onClick={() => handleComplete(task.id)}>
                    ✓ Done
                  </button>
                  <button className="delete-btn task-btn" onClick={() => deleteTask(task.id)}>
                    ✕
                  </button>
                </div>
              </div>
              );
            })
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
