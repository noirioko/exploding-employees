import { useState } from 'react';
import { useApp } from '../context/AppContext';
import EditTaskModal from './EditTaskModal';

function DailyTasks() {
  const { getTasksByType, addTask, completeTask, deleteTask, updateTask } = useApp();

  const dailyTasks = getTasksByType('daily');

  const [newTask, setNewTask] = useState({
    text: '',
    category: 'art',
    deadline: '',
    energy: 'med',
    taskType: 'daily',
  });

  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  return (
    <div className="task-section section-todolist" style={{ marginBottom: '30px' }}>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', justifyContent: 'flex-start' }}>
        <img src="/images/Yuwon_1.png" alt="Yuwon" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'contain', border: '3px solid #5e35b1', padding: '3px', background: 'white' }} />
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '18px', color: '#1976d2', margin: 0 }}>📝 To Do List</h3>
          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Yuwon handles these!</p>
        </div>
      </div>

      <div className="tasks-table">
        <div className="table-header">
          <div className="col-task">Task</div>
          <div className="col-category">Category</div>
          <div className="col-deadline">Deadline</div>
          <div className="col-energy">Energy</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="table-body">
          {dailyTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <p>No daily tasks yet! Add one below to get started.</p>
            </div>
          ) : (
            dailyTasks.map(task => (
              <div key={task.id} className="task-row">
                <div className="col-task">
                  {task.priority && <span className="priority-badge">URGENT</span>}
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
                <div className="col-actions">
                  <button className="edit-btn task-btn" onClick={() => handleEditTask(task)}>
                    ✏️
                  </button>
                  <button className="done-btn task-btn" onClick={() => completeTask(task.id)}>
                    ✓ Done
                  </button>
                  <button className="delete-btn task-btn" onClick={() => deleteTask(task.id)}>
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
