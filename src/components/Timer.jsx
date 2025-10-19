import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

function Timer() {
  const { addTask, completeTask, tasks, logHabit } = useApp();

  // Timer states
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timerMode, setTimerMode] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTaskType, setSelectedTaskType] = useState(null);
  const [completedPomodoros, setCompletedPomodoros] = useState([]);
  const [showLogPrompt, setShowLogPrompt] = useState(false);
  const [showTaskPicker, setShowTaskPicker] = useState(false);

  const intervalRef = useRef(null);
  const notificationSoundRef = useRef(null);

  // Timer presets
  const timerPresets = {
    work: 25,
    shortBreak: 5,
    longBreak: 15
  };

  // Start/Resume timer
  const startTimer = () => {
    if (!currentTask.trim()) {
      alert('⚠️ Please enter a task name before starting!');
      return;
    }
    setIsActive(true);
    setIsPaused(false);
  };

  // Pause timer
  const pauseTimer = () => {
    setIsPaused(true);
  };

  // Resume timer
  const resumeTimer = () => {
    setIsPaused(false);
  };

  // Reset timer
  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setMinutes(timerPresets[timerMode]);
    setSeconds(0);
  };

  // Switch timer mode
  const switchMode = (mode) => {
    setTimerMode(mode);
    setMinutes(timerPresets[mode]);
    setSeconds(0);
    setIsActive(false);
    setIsPaused(false);
  };

  // Timer countdown logic
  useEffect(() => {
    if (isActive && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer finished!
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, minutes, seconds]);

  // Get all available tasks
  const getAvailableTasks = () => {
    return tasks.filter(task =>
      task.taskType === 'daily' ||
      task.taskType === 'impossible' ||
      task.taskType === 'habit' ||
      task.taskType === 'recurring'
    );
  };

  // Select task from list
  const selectTask = (task) => {
    setCurrentTask(task.text);
    setSelectedTaskId(task.id);
    setSelectedTaskType(task.taskType);
    setShowTaskPicker(false);
  };

  // Handle timer completion
  const handleTimerComplete = () => {
    setIsActive(false);
    setIsPaused(false);

    if (timerMode === 'work') {
      // Completed a work session
      const newCount = pomodoroCount + 1;
      setPomodoroCount(newCount);

      // Log completed pomodoro
      const completedPomodoro = {
        task: currentTask,
        taskId: selectedTaskId,
        taskType: selectedTaskType,
        timestamp: new Date().toISOString(),
        duration: timerPresets.work
      };
      setCompletedPomodoros([...completedPomodoros, completedPomodoro]);

      // Show log prompt instead of auto-completing
      setShowLogPrompt(true);

      // Play notification sound if available
      if (notificationSoundRef.current) {
        notificationSoundRef.current.play().catch(err => console.log('Sound play failed:', err));
      }
    } else {
      // Completed a break
      switchMode('work');
      alert('⏰ Break is over! Ready to focus again?');
    }
  };

  // Handle log decision
  const handleLogTask = () => {
    if (selectedTaskId && selectedTaskType) {
      if (selectedTaskType === 'habit') {
        logHabit(selectedTaskId);
      } else if (selectedTaskType === 'daily' || selectedTaskType === 'impossible' || selectedTaskType === 'recurring') {
        completeTask(selectedTaskId);
      }
    }

    // Reset task selection
    setSelectedTaskId(null);
    setSelectedTaskType(null);
    setCurrentTask('');
    setShowLogPrompt(false);

    // Auto-switch to break
    const newCount = pomodoroCount;
    if (newCount % 4 === 0) {
      switchMode('longBreak');
      alert('🎉 Great work! Time for a long break! (15 minutes)');
    } else {
      switchMode('shortBreak');
      alert('✨ Work session complete! Time for a short break! (5 minutes)');
    }
  };

  const handleSkipLog = () => {
    // Don't log, just reset
    setSelectedTaskId(null);
    setSelectedTaskType(null);
    setCurrentTask('');
    setShowLogPrompt(false);

    // Auto-switch to break
    const newCount = pomodoroCount;
    if (newCount % 4 === 0) {
      switchMode('longBreak');
      alert('🎉 Time for a long break! (15 minutes)');
    } else {
      switchMode('shortBreak');
      alert('✨ Time for a short break! (5 minutes)');
    }
  };

  // Format time display
  const formatTime = (mins, secs) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const getProgress = () => {
    const totalSeconds = timerPresets[timerMode] * 60;
    const currentSeconds = minutes * 60 + seconds;
    return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  };

  return (
    <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '0px', marginLeft: '50px', marginRight: '50px' }}>
        {/* Header with Noah */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'stretch',
          borderRadius: '8px 8px 0 0',
          overflow: 'hidden',
          boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '60px',
            background: '#d32f2f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <img src="/images/Noah_1.png" alt="Noah" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'contain' }} />
          </div>
          <div style={{ padding: '12px 20px', background: '#ffebee' }}>
            <h3 style={{ fontSize: '18px', color: '#d32f2f', margin: 0, fontWeight: 700 }}>⏱️ Boss Mode Timer</h3>
            <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>Noah is watching your productivity... 👀</p>
          </div>
        </div>
      </div>

      {/* Browser-style Container with Pink Bar */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '2px solid #ffc1e3'
      }}>
        {/* Mode Tabs (Browser-style tabs) - ON TOP */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '10px 20px 0 20px',
          background: '#f5f5f5',
          justifyContent: 'space-between',
          alignItems: 'flex-end'
        }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() => switchMode('work')}
              disabled={isActive}
              style={{
                padding: '10px 20px',
                background: timerMode === 'work' ? 'white' : '#e0e0e0',
                color: timerMode === 'work' ? '#d32f2f' : '#999',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                fontSize: '14px',
                fontWeight: 700,
                cursor: isActive ? 'not-allowed' : 'pointer',
                opacity: isActive && timerMode !== 'work' ? 0.5 : 1,
                borderTop: timerMode === 'work' ? '3px solid #d32f2f' : '3px solid transparent',
                transition: 'all 0.2s',
                boxShadow: timerMode === 'work' ? '0 -2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              🍅 Work (25min)
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              disabled={isActive}
              style={{
                padding: '10px 20px',
                background: timerMode === 'shortBreak' ? 'white' : '#e0e0e0',
                color: timerMode === 'shortBreak' ? '#4caf50' : '#999',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                fontSize: '14px',
                fontWeight: 700,
                cursor: isActive ? 'not-allowed' : 'pointer',
                opacity: isActive && timerMode !== 'shortBreak' ? 0.5 : 1,
                borderTop: timerMode === 'shortBreak' ? '3px solid #4caf50' : '3px solid transparent',
                transition: 'all 0.2s',
                boxShadow: timerMode === 'shortBreak' ? '0 -2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              ☕ Short Break (5min)
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              disabled={isActive}
              style={{
                padding: '10px 20px',
                background: timerMode === 'longBreak' ? 'white' : '#e0e0e0',
                color: timerMode === 'longBreak' ? '#1976d2' : '#999',
                border: 'none',
                borderRadius: '8px 8px 0 0',
                fontSize: '14px',
                fontWeight: 700,
                cursor: isActive ? 'not-allowed' : 'pointer',
                opacity: isActive && timerMode !== 'longBreak' ? 0.5 : 1,
                borderTop: timerMode === 'longBreak' ? '3px solid #1976d2' : '3px solid transparent',
                transition: 'all 0.2s',
                boxShadow: timerMode === 'longBreak' ? '0 -2px 4px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              🌙 Long Break (15min)
            </button>
          </div>

          {/* Cute dots on the right */}
          <div style={{ display: 'flex', gap: '6px', paddingBottom: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></div>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></div>
          </div>
        </div>

        {/* Pink Bar - just a pretty bar for the tabs */}
        <div style={{
          background: 'linear-gradient(135deg, #ffc1e3 0%, #ffb3d9 100%)',
          height: '8px'
        }}></div>

        {/* Tab Content */}
        <div style={{ padding: '30px', background: 'white' }}>

      {/* Main Timer Display */}
      <div style={{
        background: 'linear-gradient(135deg, #fff9f0 0%, #ffebee 100%)',
        border: '3px solid #d32f2f',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        marginBottom: '30px',
        boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)'
      }}>
        {/* Progress Circle */}
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke="#e0e0e0"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              stroke={timerMode === 'work' ? '#d32f2f' : timerMode === 'shortBreak' ? '#4caf50' : '#1976d2'}
              strokeWidth="10"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgress() / 100)}`}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '48px',
            fontWeight: 700,
            color: '#333'
          }}>
            {formatTime(minutes, seconds)}
          </div>
        </div>

        {/* Task Input */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="What are you working on?"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              disabled={isActive}
              style={{
                flex: 1,
                padding: '12px 20px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                textAlign: 'center',
                outline: 'none',
                opacity: isActive ? 0.7 : 1
              }}
            />
            <button
              onClick={() => setShowTaskPicker(!showTaskPicker)}
              disabled={isActive}
              style={{
                padding: '12px 20px',
                background: showTaskPicker ? '#d32f2f' : '#5e35b1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: isActive ? 'not-allowed' : 'pointer',
                opacity: isActive ? 0.5 : 1,
                whiteSpace: 'nowrap'
              }}
            >
              📋 Pick Task
            </button>
          </div>

          {/* Task Picker Dropdown */}
          {showTaskPicker && !isActive && (
            <div style={{
              marginTop: '10px',
              background: 'white',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              maxHeight: '300px',
              overflowY: 'auto',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              {getAvailableTasks().length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                  No tasks available. Add some tasks first!
                </div>
              ) : (
                getAvailableTasks().map(task => (
                  <button
                    key={task.id}
                    onClick={() => selectTask(task)}
                    style={{
                      width: '100%',
                      padding: '12px 20px',
                      background: 'white',
                      border: 'none',
                      borderBottom: '1px solid #f0f0f0',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background 0.2s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <span>{task.text}</span>
                    <span style={{
                      fontSize: '11px',
                      padding: '4px 8px',
                      background: task.taskType === 'daily' ? '#e8eaf6' : task.taskType === 'impossible' ? '#ffebee' : task.taskType === 'habit' ? '#e8f5e9' : '#fff3e0',
                      color: task.taskType === 'daily' ? '#5e35b1' : task.taskType === 'impossible' ? '#c62828' : task.taskType === 'habit' ? '#2e7d32' : '#f57c00',
                      borderRadius: '4px',
                      fontWeight: 600,
                      pointerEvents: 'none'
                    }}>
                      {task.taskType === 'daily' && '📝 Daily'}
                      {task.taskType === 'impossible' && '💀 Impossible'}
                      {task.taskType === 'habit' && '✅ Habit'}
                      {task.taskType === 'recurring' && '📅 Recurring'}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          {!isActive ? (
            <button
              onClick={startTimer}
              style={{
                padding: '15px 40px',
                background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
              }}
            >
              ▶️ Start
            </button>
          ) : isPaused ? (
            <button
              onClick={resumeTimer}
              style={{
                padding: '15px 40px',
                background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
              }}
            >
              ▶️ Resume
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              style={{
                padding: '15px 40px',
                background: 'linear-gradient(135deg, #ff9800 0%, #ffa726 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(255, 152, 0, 0.4)'
              }}
            >
              ⏸️ Pause
            </button>
          )}
          <button
            onClick={resetTimer}
            style={{
              padding: '15px 40px',
              background: 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Pomodoro Counter */}
      <div style={{
        background: 'white',
        border: '2px solid #e0e0e0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '14px', color: '#999', marginBottom: '10px' }}>
          🍅 Pomodoros Today
        </div>
        <div style={{ fontSize: '36px', fontWeight: 700, color: '#d32f2f' }}>
          {pomodoroCount}
        </div>
        <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
          {pomodoroCount % 4 === 0 && pomodoroCount > 0
            ? '🎉 Time for a long break!'
            : `${4 - (pomodoroCount % 4)} until long break`}
        </div>
      </div>

      {/* Completed Sessions */}
      {completedPomodoros.length > 0 && (
        <div style={{
          background: 'white',
          border: '2px solid #e0e0e0',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#333', marginBottom: '15px' }}>
            📋 Completed Sessions Today
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {completedPomodoros.slice(-5).reverse().map((pomodoro, index) => (
              <div
                key={index}
                style={{
                  padding: '12px',
                  background: '#f5f5f5',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span style={{ fontSize: '14px', color: '#333' }}>
                  🍅 {pomodoro.task}
                </span>
                <span style={{ fontSize: '12px', color: '#999' }}>
                  {new Date(pomodoro.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Prompt Modal */}
      {showLogPrompt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎉</div>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#333', marginBottom: '10px' }}>
                Work Session Complete!
              </h3>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
                You worked on: <strong>{currentTask}</strong>
              </p>
              <p style={{ fontSize: '14px', color: '#999' }}>
                Did you finish this task?
              </p>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={handleLogTask}
                style={{
                  padding: '15px 30px',
                  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)'
                }}
              >
                ✅ Yes, Log It!
              </button>
              <button
                onClick={handleSkipLog}
                style={{
                  padding: '15px 30px',
                  background: 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                  color: '#333',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              >
                ❌ Not Yet
              </button>
            </div>

            {selectedTaskId && (
              <div style={{
                marginTop: '20px',
                padding: '15px',
                background: '#f5f5f5',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#666',
                textAlign: 'center'
              }}>
                💡 Clicking "Yes, Log It!" will mark this task as complete in your {selectedTaskType === 'habit' ? 'Habits' : selectedTaskType === 'daily' ? 'To Do List' : selectedTaskType === 'impossible' ? 'Impossible Tasks' : 'Recurring Tasks'}
              </div>
            )}
          </div>
        </div>
      )}

        </div>
      </div>

      {/* Hidden audio element for notification */}
      <audio ref={notificationSoundRef} preload="auto">
        <source src="/sounds/notification.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default Timer;
