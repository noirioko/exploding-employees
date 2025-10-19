import { useState } from 'react';
import { useApp } from '../context/AppContext';

function ImpossibleTasks({ energyLevel, onSwitchToRecord }) {
  const { getTasksByType, addTask, completeTask, deleteTask, updateTask, completedTasks } = useApp();

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
    notes: { whyHard: '', plan: '' }
  });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    text: '',
    category: 'life',
    energy: 'high',
    notes: { whyHard: '', plan: '' }
  });
  const [showNotesModal, setShowNotesModal] = useState(null); // stores task id

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
        notes: { whyHard: '', plan: '' }
      });
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setEditFormData({
      text: task.text,
      category: task.category || 'life',
      energy: task.energy || 'high',
      notes: task.notes || { whyHard: '', plan: '' }
    });
  };

  const handleSaveEdit = (id) => {
    updateTask(id, editFormData);
    setEditingTaskId(null);
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
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
            width: '80px',
            background: '#c62828',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            position: 'relative'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
              <img src="/images/Yuwon_1.png" alt="Yuwon" style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '50%' }} />
              <img src="/images/Noah_1.png" alt="Noah" style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '50%' }} />
              <img src="/images/Minkyu_1.png" alt="Minkyu" style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '50%' }} />
              <img src="/images/Jaehyun_1.png" alt="Jaehyun" style={{ width: '28px', height: '28px', objectFit: 'contain', borderRadius: '50%' }} />
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

      <div className="tasks-table impossible-tasks-table">
        <div className="table-header">
          <div>Task</div>
          <div>Category</div>
          <div>Created</div>
          <div>Energy</div>
          <div>Notes</div>
          <div>Check!</div>
          <div>Actions</div>
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
              {sortedTasks.map(task => {
              const nag = getEmployeeNag(task);
              const daysSinceCreated = Math.floor((Date.now() - new Date(task.createdAt)) / (1000 * 60 * 60 * 24));
              const isEditing = editingTaskId === task.id;
              const categoryEmojis = {
                'life': '🏠',
                'business': '💼',
                'finance': '💰',
                'creative': '🎨',
                'physical': '🏋️'
              };

              return (
                <div key={task.id} className="task-row">
                  {/* Task Name */}
                  <div className="col-task">
                    {isEditing ? (
                      <input
                        type="text"
                        className="quick-input"
                        value={editFormData.text}
                        onChange={(e) => setEditFormData({ ...editFormData, text: e.target.value })}
                      />
                    ) : (
                      <span className="task-text">{task.text}</span>
                    )}
                  </div>

                  {/* Category */}
                  <div style={{ fontSize: '13px' }}>
                    {isEditing ? (
                      <select
                        className="quick-select"
                        value={editFormData.category}
                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      >
                        <option value="life">🏠 Life</option>
                        <option value="business">💼 Business</option>
                        <option value="finance">💰 Finance</option>
                        <option value="creative">🎨 Creative</option>
                        <option value="physical">🏋️ Physical</option>
                      </select>
                    ) : (
                      <span className={`category-badge ${task.category || 'life'}`}>
                        {categoryEmojis[task.category || 'life']} {task.category || 'life'}
                      </span>
                    )}
                  </div>

                  {/* Created */}
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {daysSinceCreated}d ago
                  </div>

                  {/* Energy */}
                  <div style={{ fontSize: '13px' }}>
                    {isEditing ? (
                      <select
                        className="quick-select"
                        value={editFormData.energy}
                        onChange={(e) => setEditFormData({ ...editFormData, energy: e.target.value })}
                      >
                        <option value="low">⚡ Low</option>
                        <option value="med">⚡⚡ Med</option>
                        <option value="high">⚡⚡⚡ High</option>
                      </select>
                    ) : (
                      <span>
                        {task.energy === 'low' && '⚡'}
                        {task.energy === 'med' && '⚡⚡'}
                        {task.energy === 'high' && '⚡⚡⚡'}
                      </span>
                    )}
                  </div>

                  {/* Notes */}
                  <div>
                    <button
                      className="task-btn"
                      onClick={() => setShowNotesModal(task.id)}
                      style={{
                        background: (task.notes?.whyHard || task.notes?.plan) ? '#fff3e0' : 'transparent',
                        border: '1px solid #ccc',
                        fontSize: '16px',
                        padding: '4px 8px'
                      }}
                      title={task.notes?.whyHard ? 'Has notes' : 'Add notes'}
                    >
                      📝
                    </button>
                  </div>

                  {/* Check */}
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
                        ✓
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

                  {/* Actions */}
                  <div className="col-actions">
                    {isEditing ? (
                      <>
                        <button className="edit-btn task-btn" onClick={() => handleSaveEdit(task.id)}>
                          ✓
                        </button>
                        <button className="delete-btn task-btn" onClick={handleCancelEdit}>
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="edit-btn task-btn" onClick={() => handleEdit(task)}>
                          ✏️
                        </button>
                        <button className="delete-btn task-btn" onClick={() => deleteTask(task.id)}>
                          ✕
                        </button>
                      </>
                    )}
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
            className="quick-input"
            placeholder="Add that one task you've been avoiding forever..."
            value={newTask.text}
            onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
            onKeyPress={handleKeyPress}
          />
          <select
            className="quick-select"
            value={newTask.category}
            onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
          >
            <option value="life">🏠 Life</option>
            <option value="business">💼 Business</option>
            <option value="finance">💰 Finance</option>
            <option value="creative">🎨 Creative</option>
            <option value="physical">🏋️ Physical</option>
          </select>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#999' }}>
            (auto: today)
          </div>
          <select
            className="quick-select"
            value={newTask.energy}
            onChange={(e) => setNewTask({ ...newTask, energy: e.target.value })}
          >
            <option value="low">⚡ Low</option>
            <option value="med">⚡⚡ Med</option>
            <option value="high">⚡⚡⚡ High</option>
          </select>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '16px', color: '#ccc' }}>—</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '11px', color: '#999' }}>—</span>
          </div>
          <button className="quick-add-btn" onClick={handleAddTask}>
            ➕ Add
          </button>
        </div>
      </div>

      <div style={{ marginTop: '10px', fontSize: '11px', color: '#999', textAlign: 'center', fontStyle: 'italic' }}>
        💡 <strong>Energy Cost:</strong> Completing impossible tasks costs <strong>5 energy from ALL employees</strong> but gives higher rewards!
        <br/>
        Low: +3 exp, +75₩ | Med: +5 exp, +125₩ | High: +8 exp, +200₩
      </div>

      {/* Notes Modal */}
      {showNotesModal && (() => {
        const task = sortedTasks.find(t => t.id === showNotesModal);
        if (!task) return null;

        return (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowNotesModal(null)}
          >
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#c62828' }}>📝 Task Strategy</h3>
                <button
                  onClick={() => setShowNotesModal(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer',
                    color: '#999'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px', color: '#666' }}>
                  Task: {task.text}
                </label>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px', color: '#c62828' }}>
                  Why is this hard?
                </label>
                <textarea
                  value={task.notes?.whyHard || ''}
                  onChange={(e) => {
                    updateTask(task.id, {
                      notes: { ...task.notes, whyHard: e.target.value }
                    });
                  }}
                  placeholder="What makes this task feel impossible? Be honest..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '2px solid #f0f0f0',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '14px', color: '#4caf50' }}>
                  What's your plan to tackle it?
                </label>
                <textarea
                  value={task.notes?.plan || ''}
                  onChange={(e) => {
                    updateTask(task.id, {
                      notes: { ...task.notes, plan: e.target.value }
                    });
                  }}
                  placeholder="Break it down into small steps. What's step 1?"
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '10px',
                    borderRadius: '6px',
                    border: '2px solid #f0f0f0',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button
                onClick={() => setShowNotesModal(null)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#c62828',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Save & Close
              </button>
            </div>
          </div>
        );
      })()}

      {/* Today's Victories - History Section */}
      <div style={{
        marginTop: '30px',
        background: 'white',
        border: '2px solid #ffebee',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#c62828', margin: 0 }}>
              🎉 Today's Victories
            </h4>
            <p style={{ fontSize: '11px', color: '#e57373', margin: '2px 0 0 0' }}>
              You conquered {completedTasks.filter(t => {
                const completedDate = new Date(t.completedAt).toDateString();
                const today = new Date().toDateString();
                return completedDate === today && t.taskType === 'impossible';
              }).length} impossible tasks today!
            </p>
          </div>
          <button
            onClick={() => onSwitchToRecord && onSwitchToRecord('impossible')}
            style={{
              padding: '8px 16px',
              background: '#c62828',
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
              return completedDate === today && t.taskType === 'impossible';
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
                  background: '#ffebee',
                  color: '#c62828',
                  borderRadius: '4px',
                  fontWeight: 600
                }}>
                  +5 exp
                </span>
              </div>
            ))}

          {completedTasks.filter(t => {
            const completedDate = new Date(t.completedAt).toDateString();
            const today = new Date().toDateString();
            return completedDate === today && t.taskType === 'impossible';
          }).length === 0 && (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: '#999'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>💀</div>
              <p style={{ fontSize: '14px' }}>No impossible tasks conquered yet today!</p>
              <p style={{ fontSize: '12px', color: '#bbb' }}>Complete some to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImpossibleTasks;
