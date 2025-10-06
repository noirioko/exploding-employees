import { useState } from 'react';
import { useApp } from '../context/AppContext';

function ImpossibleTasks() {
  const { getTasksByType, addTask, completeTask, deleteTask } = useApp();

  const impossibleTasks = getTasksByType('impossible');

  const [newTask, setNewTask] = useState({
    text: '',
    category: 'life',
    energy: 'high',
    taskType: 'impossible',
  });

  const handleAddTask = () => {
    if (newTask.text.trim()) {
      addTask(newTask);
      setNewTask({
        text: '',
        category: 'life',
        energy: 'high',
        taskType: 'impossible',
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  // Get random employee nag message based on personality
  const getEmployeeNag = (task) => {
    const daysSinceCreated = Math.floor((Date.now() - new Date(task.createdAt)) / (1000 * 60 * 60 * 24));

    if (daysSinceCreated < 7) return null; // No nagging until 7 days

    const nags = {
      yuwon: [
        "You can do it! Break it into smaller steps! 💕",
        "I believe in you! Maybe start with just 10 minutes? 🌸",
        "Don't give up! Every big journey starts with a small step! ✨"
      ],
      noah: [
        "...Are you ever going to do that? 😐",
        `It's been ${daysSinceCreated} days. Just saying.`,
        "I'm not mad, just disappointed. 💼"
      ],
      jaehyun: [
        "Just delete it if you're not gonna do it lol 😅",
        "Be honest with yourself - is this really happening? 🤷",
        `${daysSinceCreated} days and counting... impressive procrastination! ✨`
      ],
      minkyu: [
        `That's been there since ${new Date(task.createdAt).toLocaleDateString()}. Just saying. 📋`,
        `Day ${daysSinceCreated}: Still impossible, apparently. 📊`,
        "My records show this has been pending for quite some time... 📝"
      ]
    };

    const employees = ['yuwon', 'noah', 'jaehyun', 'minkyu'];
    const randomEmployee = employees[Math.floor(Math.random() * employees.length)];
    const employeeNags = nags[randomEmployee];
    const randomNag = employeeNags[Math.floor(Math.random() * employeeNags.length)];

    return {
      employee: randomEmployee,
      message: randomNag
    };
  };

  return (
    <div className="task-section section-impossible" style={{ marginBottom: '30px' }}>
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', justifyContent: 'flex-start' }}>
        <div style={{ display: 'flex', marginLeft: '-10px' }}>
          <img src="/images/Yuwon_1.png" alt="Yuwon" style={{ width: '45px', height: '45px', marginLeft: '10px', objectFit: 'contain', border: '2px solid #c62828', borderRadius: '50%', padding: '2px', background: 'white' }} />
          <img src="/images/Noah_1.png" alt="Noah" style={{ width: '45px', height: '45px', marginLeft: '-8px', objectFit: 'contain', border: '2px solid #c62828', borderRadius: '50%', padding: '2px', background: 'white' }} />
          <img src="/images/Minkyu_1.png" alt="Minkyu" style={{ width: '45px', height: '45px', marginLeft: '-8px', objectFit: 'contain', border: '2px solid #c62828', borderRadius: '50%', padding: '2px', background: 'white' }} />
          <img src="/images/Jaehyun_1.png" alt="Jaehyun" style={{ width: '45px', height: '45px', marginLeft: '-8px', objectFit: 'contain', border: '2px solid #c62828', borderRadius: '50%', padding: '2px', background: 'white' }} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <h3 style={{ fontSize: '18px', color: '#c62828', margin: 0 }}>⏰ Impossible Tasks</h3>
          <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Everyone's watching these... and judging. 👀</p>
        </div>
      </div>

      <div className="tasks-table">
        <div className="table-header">
          <div className="col-task">Impossible Task</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="table-body">
          {impossibleTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">⏰</div>
              <p>No impossible tasks! (That's probably good... right?)</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px' }}>
            {impossibleTasks.map(task => {
              const nag = getEmployeeNag(task);
              const daysSinceCreated = Math.floor((Date.now() - new Date(task.createdAt)) / (1000 * 60 * 60 * 24));

              return (
                <div key={task.id} style={{
                  padding: '20px',
                  background: '#fff9e6',
                  borderRadius: '10px',
                  border: '2px solid #ffd93d',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>
                        {task.text}
                      </div>
                      <div style={{ fontSize: '12px', color: '#999', marginBottom: '10px' }}>
                        Created {daysSinceCreated} days ago • {task.category}
                      </div>

                      {nag && (
                        <div style={{
                          marginTop: '12px',
                          padding: '12px',
                          background: 'white',
                          borderRadius: '8px',
                          borderLeft: '4px solid #e91e63',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <img
                            src={`/images/${nag.employee.charAt(0).toUpperCase() + nag.employee.slice(1)}_1.png`}
                            alt={nag.employee}
                            style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '11px', fontWeight: '600', color: '#e91e63', textTransform: 'uppercase', marginBottom: '3px' }}>
                              {nag.employee} says:
                            </div>
                            <div style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                              "{nag.message}"
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        className="done-btn task-btn"
                        onClick={() => completeTask(task.id)}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        ✓ Finally Done!
                      </button>
                      <button
                        className="delete-btn task-btn"
                        onClick={() => deleteTask(task.id)}
                      >
                        ✕ Give Up
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>

        {/* Quick Add Row */}
        <div className="quick-add-row">
          <input
            type="text"
            className="quick-input col-task"
            placeholder="Add that one task you've been avoiding forever..."
            value={newTask.text}
            onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
            onKeyPress={handleKeyPress}
          />
          <div className="col-actions">
            <button className="quick-add-btn" onClick={handleAddTask}>
              ➕ Add
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '10px', fontSize: '11px', color: '#999', textAlign: 'center', fontStyle: 'italic' }}>
        💡 Tasks sitting here for 7+ days will trigger employee comments
      </div>
    </div>
  );
}

export default ImpossibleTasks;
