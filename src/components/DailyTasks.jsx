import { useState } from 'react';
import { useApp } from '../context/AppContext';
import EditTaskModal from './EditTaskModal';

function DailyTasks({ energyLevel }) {
  const { getTasksByType, addTask, completeTask, deleteTask, updateTask } = useApp();

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

  // Sort tasks
  const getSortedTasks = () => {
    let sorted = [...dailyTasks];

    // Always sort urgent tasks to the top first, regardless of sort option
    sorted.sort((a, b) => {
      const aUrgent = isUrgent(a);
      const bUrgent = isUrgent(b);
      if (aUrgent && !bUrgent) return -1;
      if (!aUrgent && bUrgent) return 1;
      return 0; // Keep relative order if both urgent or both not urgent
    });

    // Then apply secondary sort if not in default mode
    if (sortBy === 'dueDate') {
      sorted.sort((a, b) => {
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
      sorted.sort((a, b) => {
        // Keep urgent at top
        const aUrgent = isUrgent(a);
        const bUrgent = isUrgent(b);
        if (aUrgent && !bUrgent) return -1;
        if (!aUrgent && bUrgent) return 1;

        return energyOrder[a.energy || 'med'] - energyOrder[b.energy || 'med'];
      });
    } else if (sortBy === 'category') {
      sorted.sort((a, b) => {
        // Keep urgent at top
        const aUrgent = isUrgent(a);
        const bUrgent = isUrgent(b);
        if (aUrgent && !bUrgent) return -1;
        if (!aUrgent && bUrgent) return 1;

        return (a.category || '').localeCompare(b.category || '');
      });
    }

    return sorted;
  };

  const sortedTasks = getSortedTasks();

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
          <div style={{ display: 'flex', gap: '8px', paddingBottom: '8px' }}>
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
            <button
              onClick={() => setSortBy('category')}
              style={{
                padding: '6px 12px',
                background: sortBy === 'category' ? '#5e35b1' : '#e8eaf6',
                color: sortBy === 'category' ? 'white' : '#5e35b1',
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
