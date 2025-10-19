import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ENERGY_REWARDS } from '../constants/gameConstants';
import EditTaskModal from './EditTaskModal';

function Habits({ energyLevel, onSwitchToRecord }) {
  const { getTasksByType, addTask, deleteTask, updateTask, logHabit, completedTasks } = useApp();

  const allHabits = getTasksByType('habit');

  // Filter tasks based on energy level
  const habits = allHabits.filter(task => {
    if (energyLevel <= 3) return task.energy === 'low';
    if (energyLevel <= 6) return task.energy === 'low' || task.energy === 'med';
    return true; // 7-10: show all tasks
  });

  // Get today's habit logs count for each habit
  const getHabitLogsToday = (habitId) => {
    const today = new Date().toDateString();
    return completedTasks.filter(task =>
      task.id === habitId &&
      task.taskType === 'habit' &&
      new Date(task.completedAt).toDateString() === today
    ).length;
  };

  const [newHabit, setNewHabit] = useState({
    text: '',
    taskType: 'habit',
    energy: 'low',
  });

  const [showEnergyPicker, setShowEnergyPicker] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleHabitLog = (habitId) => {
    logHabit(habitId);
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

  const handleAddHabit = () => {
    if (newHabit.text.trim()) {
      addTask({
        ...newHabit,
        category: 'life', // Default category for habits
      });
      setNewHabit({
        text: '',
        taskType: 'habit',
        energy: 'low',
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddHabit();
    }
  };

  return (
    <div className="task-section section-habits" style={{ marginBottom: '30px' }}>
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
          background: '#2e7d32',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <img src="/images/Jaehyun_1.png" alt="Jaehyun" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'contain' }} />
        </div>
        <div style={{ padding: '12px 20px', background: '#e8f5e9' }}>
          <h3 style={{ fontSize: '18px', color: '#2e7d32', margin: 0, fontWeight: 700 }}>✅ Habits</h3>
          <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>Jaehyun tracks your daily habits!</p>
        </div>
      </div>

      <div className="tasks-table">
        <div className="table-header">
          <div className="col-task">Habit</div>
          <div className="col-energy">Energy</div>
          <div className="col-count">Today</div>
          <div className="col-check">Check!</div>
          <div className="col-actions">Settings</div>
        </div>

        <div className="table-body">
          {habits.length === 0 ? (
            <div className="empty-state">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <img
                  src="/images/cat_habit.png"
                  alt="Cat habit"
                  style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                />
                <p>No habits yet! Add one below to start tracking.</p>
              </div>
            </div>
          ) : (
            <>
              {habits.map(habit => {
              const logsToday = getHabitLogsToday(habit.id);
              return (
                <div key={habit.id} className="task-row">
                  <div className="col-task">
                    <span className="task-text">{habit.text}</span>
                  </div>
                  <div className="col-energy">
                    <span style={{
                      background: habit.energy === 'low' ? '#e3f2fd' : habit.energy === 'med' ? '#fff3e0' : '#fce4ec',
                      color: habit.energy === 'low' ? '#1976d2' : habit.energy === 'med' ? '#f57c00' : '#c2185b',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      whiteSpace: 'nowrap'
                    }}>
                      {habit.energy === 'low' ? '🔋 LOW' : habit.energy === 'med' ? '☕ MED' : '⚡ HIGH'} (+{ENERGY_REWARDS[habit.energy || 'low'].exp})
                    </span>
                  </div>
                  <div className="col-count">
                    <span style={{
                      background: logsToday > 0 ? '#e8f5e9' : '#f5f5f5',
                      color: logsToday > 0 ? '#2e7d32' : '#999',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '12px'
                    }}>
                      {logsToday > 0 ? `✓ ${logsToday}x` : '0x'}
                    </span>
                  </div>
                  <div className="col-check">
                    <button
                      className="done-btn task-btn"
                      onClick={() => handleHabitLog(habit.id)}
                      style={{
                        position: 'relative',
                        opacity: logsToday > 0 ? 0.6 : 1
                      }}
                    >
                      <span style={{ filter: logsToday > 0 ? 'grayscale(100%)' : 'none' }}>
                        +1
                      </span>
                      {logsToday > 0 && (
                        <img
                          key={logsToday}
                          src="/images/stamp_tea.png"
                          alt="Tea stamp"
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
                    <button className="edit-btn task-btn" onClick={() => handleEditTask(habit)}>
                      ✏️
                    </button>
                    <button className="delete-btn task-btn" onClick={() => deleteTask(habit.id)}>
                      ✕
                    </button>
                  </div>
                </div>
              );
              })}

              {/* Cat at bottom when habits exist */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
                borderTop: '2px dashed #e0e0e0'
              }}>
                <img
                  src={habits.some(h => getHabitLogsToday(h.id) > 0) ? '/images/cat_onsen.png' : '/images/cat_habit.png'}
                  alt="Cat"
                  style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Add Section */}
      <div style={{
        background: 'white',
        border: '2px dashed #e0e0e0',
        borderRadius: '12px',
        padding: '15px'
      }}>
        {/* Preset buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              addTask({ text: 'Drink water 💧', taskType: 'habit', energy: 'low', category: 'life' });
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#e3f2fd',
              color: '#1976d2',
              border: '2px solid #1976d2',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            + Drink water 💧
          </button>
          <button
            onClick={() => {
              addTask({ text: 'Take vitamins 💊', taskType: 'habit', energy: 'low', category: 'life' });
            }}
            style={{
              padding: '6px 12px',
              backgroundColor: '#fff3e0',
              color: '#f57c00',
              border: '2px solid #f57c00',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            + Take vitamins 💊
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Type new habit..."
            value={newHabit.text}
            onChange={(e) => setNewHabit({ ...newHabit, text: e.target.value })}
            onKeyPress={handleKeyPress}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '10px 15px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none'
            }}
          />

          {/* Energy Level Selector */}
          <div style={{ display: 'flex', gap: '5px' }}>
            {['low', 'med', 'high'].map(level => (
              <button
                key={level}
                onClick={() => setNewHabit({ ...newHabit, energy: level })}
                style={{
                  padding: '8px 12px',
                  border: newHabit.energy === level ? '2px solid' : '2px solid transparent',
                  borderColor: level === 'low' ? '#1976d2' : level === 'med' ? '#f57c00' : '#c2185b',
                  background: newHabit.energy === level
                    ? (level === 'low' ? '#e3f2fd' : level === 'med' ? '#fff3e0' : '#fce4ec')
                    : '#f5f5f5',
                  color: newHabit.energy === level
                    ? (level === 'low' ? '#1976d2' : level === 'med' ? '#f57c00' : '#c2185b')
                    : '#999',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {level === 'low' ? '🔋' : level === 'med' ? '☕' : '⚡'}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddHabit}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)'
            }}
          >
            ➕ Add Habit
          </button>
        </div>
        <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
          💡 Choose energy level: 🔋 Low (+{ENERGY_REWARDS.low.exp} exp) • ☕ Med (+{ENERGY_REWARDS.med.exp} exp) • ⚡ High (+{ENERGY_REWARDS.high.exp} exp)
        </div>
      </div>

      {/* Today's Progress - History Section */}
      <div style={{
        marginTop: '30px',
        background: 'white',
        border: '2px solid #e8f5e9',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#2e7d32', margin: 0 }}>
              ✅ Today's Progress
            </h4>
            <p style={{ fontSize: '11px', color: '#4caf50', margin: '2px 0 0 0' }}>
              You logged {completedTasks.filter(t => {
                const completedDate = new Date(t.completedAt).toDateString();
                const today = new Date().toDateString();
                return completedDate === today && t.taskType === 'habit';
              }).length} habit checks today!
            </p>
          </div>
          <button
            onClick={() => onSwitchToRecord && onSwitchToRecord('habit')}
            style={{
              padding: '8px 16px',
              background: '#2e7d32',
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
              return completedDate === today && t.taskType === 'habit';
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
            return completedDate === today && t.taskType === 'habit';
          }).length === 0 && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#999'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
              <p style={{ fontSize: '14px' }}>No habits logged yet today!</p>
              <p style={{ fontSize: '12px', color: '#bbb' }}>Log some habits to see them here</p>
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

export default Habits;
