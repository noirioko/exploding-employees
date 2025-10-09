import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TodoList() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes stamp {
        0% { transform: scale(0.5); opacity: 0; }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Sample task 1', completed: false },
    { id: 2, text: 'Sample task 2', completed: false }
  ]);
  const [newTask, setNewTask] = useState('');

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const allTasksCompleted = tasks.length > 0 && tasks.every(task => task.completed);
  const completedCount = tasks.filter(task => task.completed).length;
  const hasNoTasks = tasks.length === 0;

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#E8D4B8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Courier New", monospace',
      position: 'relative',
      paddingTop: '40px',
      paddingBottom: '40px'
    }}>
      {/* Back button */}
      <button
        onClick={() => navigate('/room')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '8px 16px',
          backgroundColor: '#8B7355',
          color: '#FFF8DC',
          border: '2px solid #654321',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: '"Courier New", monospace',
          fontSize: '14px'
        }}
      >
        ← Back
      </button>

      {/* Title */}
      <h1 style={{
        color: '#654321',
        marginBottom: '30px',
        fontSize: '32px'
      }}>
        To-Do List
      </h1>

      {/* Todo list container */}
      <div style={{
        backgroundColor: '#FFF8DC',
        border: '3px solid #8B7355',
        borderRadius: '8px',
        padding: '20px',
        width: '400px',
        minHeight: '300px',
        position: 'relative'
      }}>
        {/* Task list */}
        <div style={{ marginBottom: '20px' }}>
          {tasks.map(task => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px',
                cursor: 'pointer',
                backgroundColor: task.completed ? '#E8D4B8' : 'transparent',
                borderRadius: '4px',
                marginBottom: '8px',
                transition: 'background-color 0.2s'
              }}
            >
              <span style={{ fontSize: '24px' }}>
                {task.completed ? '🐟' : '⬜'}
              </span>
              <span style={{
                color: '#654321',
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.6 : 1,
                flex: 1
              }}>
                {task.text}
              </span>
            </div>
          ))}
        </div>

        {/* Cat at the bottom */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          marginBottom: '20px'
        }}>
          <img
            src={hasNoTasks ? '/images/cat_lyingdown.png' : allTasksCompleted ? '/images/cat_eat_fish.png' : '/images/cat_crouching.png'}
            alt="Cat"
            style={{
              width: '120px',
              height: '120px',
              objectFit: 'contain',
              transition: 'all 0.3s ease'
            }}
          />
        </div>

        {/* Add new task */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
            style={{
              flex: 1,
              padding: '8px',
              border: '2px solid #8B7355',
              borderRadius: '4px',
              fontFamily: '"Courier New", monospace',
              fontSize: '14px',
              backgroundColor: '#FFFAF0'
            }}
          />
          <button
            onClick={addTask}
            style={{
              padding: '8px 16px',
              backgroundColor: '#8B7355',
              color: '#FFF8DC',
              border: '2px solid #654321',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: '"Courier New", monospace',
              fontSize: '14px'
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoList;
