import { useState } from 'react';
import { useApp } from '../context/AppContext';

function ImpossibleTasks({ energyLevel }) {
  const { getTasksByType, addTask, completeTask, deleteTask, updateTask } = useApp();

  const allImpossibleTasks = getTasksByType('impossible');

  // Filter tasks based on energy level
  const impossibleTasks = allImpossibleTasks.filter(task => {
    if (energyLevel <= 3) return task.energy === 'low';
    if (energyLevel <= 6) return task.energy === 'low' || task.energy === 'med';
    return true; // 7-10: show all tasks
  });
  const [stampedTasks, setStampedTasks] = useState(new Set());
  const [sortBy, setSortBy] = useState('none');

  const [newTask, setNewTask] = useState({
    text: '',
    category: 'life',
    energy: 'high',
    taskType: 'impossible',
  });

  const handleDone = (taskId) => {
    setStampedTasks(prev => new Set(prev).add(taskId));
  };

  const handleComplete = () => {
    stampedTasks.forEach(taskId => {
      completeTask(taskId);
    });
    setStampedTasks(new Set());
  };


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

  // Sort tasks
  const getSortedTasks = () => {
    let sorted = [...impossibleTasks];

    if (sortBy === 'energy') {
      const energyOrder = { low: 1, med: 2, high: 3 };
      sorted.sort((a, b) => energyOrder[a.energy || 'med'] - energyOrder[b.energy || 'med']);
    }

    return sorted;
  };

  const sortedTasks = getSortedTasks();

  return (
    <div className="task-section section-impossible" style={{ marginBottom: '30px' }}>
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
            background: '#c62828',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              <img src="/images/Yuwon_1.png" alt="Yuwon" style={{ width: '18px', height: '18px', objectFit: 'contain', borderRadius: '50%' }} />
              <img src="/images/Noah_1.png" alt="Noah" style={{ width: '18px', height: '18px', objectFit: 'contain', borderRadius: '50%' }} />
              <img src="/images/Minkyu_1.png" alt="Minkyu" style={{ width: '18px', height: '18px', objectFit: 'contain', borderRadius: '50%' }} />
              <img src="/images/Jaehyun_1.png" alt="Jaehyun" style={{ width: '18px', height: '18px', objectFit: 'contain', borderRadius: '50%' }} />
            </div>
          </div>
          <div style={{ padding: '12px 20px', background: '#ffebee' }}>
            <h3 style={{ fontSize: '18px', color: '#c62828', margin: 0, fontWeight: 700 }}>⏰ Impossible Tasks</h3>
            <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>Everyone's watching these... and judging. 👀</p>
          </div>
        </div>

        {/* Sort Tabs - Right Side */}
        {impossibleTasks.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', paddingBottom: '8px' }}>
            <button
              onClick={() => setSortBy('none')}
              style={{
                padding: '6px 12px',
                background: sortBy === 'none' ? '#c62828' : '#ffebee',
                color: sortBy === 'none' ? 'white' : '#c62828',
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
                background: sortBy === 'energy' ? '#c62828' : '#ffebee',
                color: sortBy === 'energy' ? 'white' : '#c62828',
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
        )}
      </div>

      <div className="tasks-table">
        <div className="table-header">
          <div className="col-task">Impossible Task</div>
          <div className="col-check">Check!</div>
          <div className="col-actions">Settings</div>
        </div>

        <div className="table-body">
          {impossibleTasks.length === 0 ? (
            <div className="empty-state">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <img
                  src="/images/cat_impossibletask.png"
                  alt="Cat waiting"
                  style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                />
                <p>No impossible tasks! (That's probably good... right?)</p>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '15px' }}>
              {sortedTasks.map(task => {
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

                    <div className="col-check">
                      <button
                        className="done-btn task-btn"
                        onClick={() => handleDone(task.id)}
                        disabled={stampedTasks.has(task.id)}
                        style={{
                          fontSize: '12px',
                          padding: '6px 12px',
                          position: 'relative',
                          opacity: stampedTasks.has(task.id) ? 0.6 : 1
                        }}
                      >
                        <span style={{ filter: stampedTasks.has(task.id) ? 'grayscale(100%)' : 'none' }}>
                          ✓ Done
                        </span>
                        {stampedTasks.has(task.id) && (
                          <img
                            src="/images/stamp_catbank.png"
                            alt="Cat bank stamp"
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

              {/* Cat at bottom */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
                borderTop: '2px dashed #e0e0e0'
              }}>
                <img
                  src={impossibleTasks.length > 0 ? '/images/cat_impossibletask_2.png' : '/images/cat_impossibletask.png'}
                  alt="Cat"
                  style={{ width: '200px', height: '200px', objectFit: 'contain' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Action Bar - Complete All */}
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
              Complete now?
            </div>
            <button
              onClick={handleComplete}
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
              🎉 Complete All ({stampedTasks.size})
            </button>
          </div>
        )}

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
