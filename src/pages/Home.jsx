import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import DailyTasks from '../components/DailyTasks';
import Habits from '../components/Habits';
import FinanceLogs from '../components/FinanceLogs';
import RecurringTasks from '../components/RecurringTasks';
import ImpossibleTasks from '../components/ImpossibleTasks';

function Home() {
  const { completedTasks, floatingEmployee, setFloatingEmployee, resetAllData, getTodaysTasks } = useApp();

  // Load energy level from localStorage, or default to 5
  const [energyLevel, setEnergyLevel] = useState(() => {
    const saved = localStorage.getItem('energyLevel');
    const lastDate = localStorage.getItem('energyLastDate');
    const today = new Date().toDateString();

    // If it's a new day, reset to 5
    if (lastDate !== today) {
      localStorage.setItem('energyLastDate', today);
      localStorage.setItem('energyLevel', '5');
      return 5;
    }

    return saved ? parseInt(saved, 10) : 5;
  });

  const [selectedCoach, setSelectedCoach] = useState('yuwon');
  const [showResetModal, setShowResetModal] = useState(false);

  const todaysTasks = getTodaysTasks();

  // Save energy level to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('energyLevel', energyLevel.toString());
  }, [energyLevel]);

  // Check for date change every minute
  useEffect(() => {
    const checkDateChange = () => {
      const lastDate = localStorage.getItem('energyLastDate');
      const today = new Date().toDateString();

      if (lastDate !== today) {
        console.log('🌅 New day detected! Resetting energy to 5');
        localStorage.setItem('energyLastDate', today);
        localStorage.setItem('energyLevel', '5');
        setEnergyLevel(5);
      }
    };

    // Check immediately
    checkDateChange();

    // Check every minute
    const interval = setInterval(checkDateChange, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleResetData = () => {
    if (window.confirm('⚠️ Are you ABSOLUTELY SURE you want to delete ALL your data? This cannot be undone!\n\nThis will reset:\n• All tasks and completed tasks\n• All currency (YuCash, Noah Credit Card)\n• All experience and levels\n• All friendship points\n• All cooking ingredients and recipes\n• All logs and records\n\nType "DELETE" in the next prompt to confirm.')) {
      const confirmation = window.prompt('Type DELETE to confirm data reset:');
      if (confirmation === 'DELETE') {
        resetAllData();
        alert('✅ All data has been reset!');
        window.location.reload();
      } else {
        alert('❌ Reset cancelled - incorrect confirmation.');
      }
    }
  };

  // Filter tasks based on energy level and filter
  const getEnergyIcon = () => {
    if (energyLevel <= 3) return '🔋';
    if (energyLevel <= 6) return '☕';
    return '⚡';
  };

  // Get daily goal based on energy level
  // Goal represents realistic task count that won't cause overwork
  // Max 10 energy points per day = safe limit
  const getDailyGoal = () => {
    if (energyLevel === 0) return 1;   // 1 low task = 1 energy
    if (energyLevel === 1) return 1;   // 1 low task = 1 energy
    if (energyLevel === 2) return 2;   // 2 low tasks = 2 energy
    if (energyLevel === 3) return 3;   // 3 low tasks = 3 energy
    if (energyLevel === 4) return 4;   // 4 low tasks = 4 energy
    if (energyLevel === 5) return 5;   // 5 low tasks = 5 energy
    if (energyLevel === 6) return 6;   // 6 low OR 3 med tasks = 6 energy
    if (energyLevel === 7) return 7;   // 7 low OR 3-4 med tasks = 7 energy
    if (energyLevel === 8) return 8;   // 8 low OR 4 med tasks = 8 energy
    if (energyLevel === 9) return 9;   // 9 low OR 4-5 med tasks = 9 energy
    if (energyLevel === 10) return 10; // 10 low OR 5 med OR 3 high tasks = 10 energy (max safe)
    return 6; // Default fallback
  };

  return (
    <div>
      <div className="current-date" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <button
          onClick={handleResetData}
          style={{
            padding: '8px 16px',
            backgroundColor: '#ff5252',
            color: 'white',
            border: '2px solid #d32f2f',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#d32f2f'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#ff5252'}
        >
          ⚙️ Reset All Data
        </button>
      </div>

      <div className="content">
        {/* Energy Slider Section */}
        <div style={{
          background: 'linear-gradient(135deg, #fff9e6 0%, #ffe6f0 100%)',
          borderBottom: '3px solid #ffc1e3',
          padding: '20px 30px',
          marginBottom: '20px',
          borderRadius: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '32px' }}>{getEnergyIcon()}</span>
            <span style={{ fontSize: '18px', fontWeight: '600', color: '#e91e63' }}>
              My Energy Today: <span style={{ fontSize: '24px' }}>{energyLevel}/10</span>
            </span>
          </div>
          <input
            type="range"
            className="energy-slider"
            min="0"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <p style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
            🔋 0-3: low energy tasks only ({getDailyGoal()} tasks/day) | ☕ 4-6: low + medium tasks ({getDailyGoal()} tasks/day) | ⚡ 7-10: all tasks shown ({getDailyGoal()} tasks/day)
          </p>
        </div>

        {/* Progress Bar */}
        <div className="marathon-bar-only">
          <div className="simple-progress-bar">
            <div
              className="simple-progress-fill"
              style={{ width: `${Math.min((todaysTasks.length / getDailyGoal()) * 100, 100)}%` }}
            ></div>
            <div
              className="top-character-runner"
              style={{ left: `${Math.min((todaysTasks.length / getDailyGoal()) * 100, 100)}%` }}
            >
              <img src="/images/walking-sprites/Yuwon/Walking/Yuwon_Walking_Outfit1animation.gif" alt="Yuwon" />
            </div>
          </div>
          <div className="mini-stat" style={{ display: 'flex', gap: '20px' }}>
            <div>
              <span className="mini-stat-label">Daily Goal ({getEnergyIcon()}):</span>
              <span className="mini-stat-value">{todaysTasks.length}/{getDailyGoal()}</span>
            </div>
            <div>
              <span className="mini-stat-label">Total All-Time:</span>
              <span className="mini-stat-value">{completedTasks.length}</span>
            </div>
          </div>
        </div>
        {/* All 5 Task Sections */}
        <div className="employee-section-outer">
          <DailyTasks energyLevel={energyLevel} />
        </div>

        <div className="section-separator"></div>

        <div className="employee-section-outer">
          <Habits energyLevel={energyLevel} />
        </div>

        <div className="section-separator"></div>

        <div className="employee-section-outer">
          <FinanceLogs energyLevel={energyLevel} />
        </div>

        <div className="section-separator"></div>

        <div className="employee-section-outer">
          <RecurringTasks energyLevel={energyLevel} />
        </div>

        <div className="section-separator"></div>

        <div className="employee-section-outer">
          <ImpossibleTasks energyLevel={energyLevel} />
        </div>
      </div>

      {/* Coach Selector */}
      <div className="coach-selector">
        <div className="coach-header">
          <span className="coach-title">✨ Pick Your Employees!</span>
          <span className="coach-subtitle">(they'll complain about work, and possibly cheer you on)</span>
        </div>
        <div className="coach-grid">
          <div
            className={`coach-card ${floatingEmployee === 'yuwon' ? 'active' : ''}`}
            onClick={() => setFloatingEmployee(floatingEmployee === 'yuwon' ? null : 'yuwon')}
          >
            <div className="coach-avatar-img">
              <img src="/images/Yuwon_1.png" alt="Yuwon" />
            </div>
            <div className="coach-name">Yuwon</div>
          </div>
          <div
            className="coach-card disabled"
            style={{ opacity: 0.5, cursor: 'not-allowed', position: 'relative' }}
          >
            <div className="coach-avatar-img" style={{ filter: 'grayscale(100%)' }}>
              <img src="/images/Noah_1.png" alt="Noah" />
            </div>
            <div className="coach-name">Noah</div>
            <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>Coming Soon</div>
            <div style={{ fontSize: '9px', color: '#aaa' }}>50% done</div>
          </div>
          <div
            className={`coach-card ${floatingEmployee === 'minkyu' ? 'active' : ''}`}
            onClick={() => setFloatingEmployee(floatingEmployee === 'minkyu' ? null : 'minkyu')}
          >
            <div className="coach-avatar-img">
              <img src="/images/Minkyu_1.png" alt="Minkyu" />
            </div>
            <div className="coach-name">Minkyu</div>
          </div>
          <div
            className="coach-card disabled"
            style={{ opacity: 0.5, cursor: 'not-allowed', position: 'relative' }}
          >
            <div className="coach-avatar-img" style={{ filter: 'grayscale(100%)' }}>
              <img src="/images/Jaehyun_1.png" alt="Jaehyun" />
            </div>
            <div className="coach-name">Jaehyun</div>
            <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>Coming Soon</div>
            <div style={{ fontSize: '9px', color: '#aaa' }}>50% done</div>
          </div>
        </div>
      </div>

      <div className="footer">
        <span>💕 you're doing amazing babe! even tiny steps count! 🌸</span>
      </div>
    </div>
  );
}

export default Home;
