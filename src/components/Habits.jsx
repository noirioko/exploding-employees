import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ENERGY_REWARDS } from '../constants/gameConstants';

function Habits() {
  const { getTasksByType, addTask, deleteTask, logHabit, completedTasks } = useApp();

  const habits = getTasksByType('habit');

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

  // For habits, we log completion but don't delete (can do multiple times)
  const handleHabitPlus = (habitId) => {
    logHabit(habitId);
  };

  return (
    <div className="task-section section-habits" style={{ marginBottom: '30px' }}>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', justifyContent: 'flex-start' }}>
        <img src="/images/Jaehyun_1.png" alt="Jaehyun" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'contain', border: '3px solid #2e7d32', padding: '3px', background: 'white' }} />
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '18px', color: '#2e7d32', margin: 0 }}>✅ Habits</h3>
          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Jaehyun tracks your daily habits!</p>
        </div>
      </div>

      <div className="tasks-table">
        <div className="table-header">
          <div className="col-actions">Actions</div>
          <div className="col-task" style={{ paddingLeft: '20px' }}>Habit</div>
          <div className="col-energy">Energy</div>
          <div className="col-count" style={{ paddingRight: '20px' }}>Today</div>
        </div>

        <div className="table-body">
          {habits.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✅</div>
              <p>No habits yet! Add one below to start tracking.</p>
            </div>
          ) : (
            habits.map(habit => {
              const logsToday = getHabitLogsToday(habit.id);
              return (
                <div key={habit.id} className="task-row" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
                  <div className="col-actions">
                    <button
                      className="done-btn task-btn"
                      onClick={() => handleHabitPlus(habit.id)}
                    >
                      +1
                    </button>
                    <button
                      className="delete-btn task-btn"
                      onClick={() => deleteTask(habit.id)}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="col-task" style={{ paddingLeft: '20px' }}>
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
                  <div className="col-count" style={{ paddingRight: '20px' }}>
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
                </div>
              );
            })
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
    </div>
  );
}

export default Habits;
