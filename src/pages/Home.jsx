import { useState } from 'react';
import { useApp } from '../context/AppContext';
import DailyTasks from '../components/DailyTasks';
import Habits from '../components/Habits';
import FinanceLogs from '../components/FinanceLogs';
import RecurringTasks from '../components/RecurringTasks';
import ImpossibleTasks from '../components/ImpossibleTasks';

function Home() {
  const { completedTasks, floatingEmployee, setFloatingEmployee } = useApp();

  const [energyLevel, setEnergyLevel] = useState(5);
  const [selectedCoach, setSelectedCoach] = useState('yuwon');

  // Filter tasks based on energy level and filter
  const getEnergyIcon = () => {
    if (energyLevel <= 3) return '🔋';
    if (energyLevel <= 6) return '☕';
    return '⚡';
  };

  return (
    <div>
      <div className="current-date">
        📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
            min="1"
            max="10"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(Number(e.target.value))}
            style={{ width: '100%' }}
          />
          <p style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
            🔋 1-3: low energy tasks only | ☕ 4-6: low + medium tasks | ⚡ 7-10: all tasks shown
          </p>
        </div>

        {/* Progress Bar */}
        <div className="marathon-bar-only">
          <div className="simple-progress-bar">
            <div
              className="simple-progress-fill"
              style={{ width: `${Math.min((completedTasks.length / 10) * 100, 100)}%` }}
            ></div>
            <div
              className="top-character-runner"
              style={{ left: `${Math.min((completedTasks.length / 10) * 100, 100)}%` }}
            >
              <img src="/images/Yuwon_1.png" alt="Yuwon" />
            </div>
          </div>
          <div className="mini-stat">
            <span className="mini-stat-label">Total Completed:</span>
            <span className="mini-stat-value">{completedTasks.length}</span>
          </div>
        </div>
        {/* All 5 Task Sections */}
        <div className="employee-section-outer">
          <DailyTasks />
        </div>

        <div className="section-separator"></div>

        <div className="employee-section-outer">
          <Habits />
        </div>

        <div className="section-separator"></div>

        <div className="employee-section-outer">
          <FinanceLogs />
        </div>

        <div className="section-separator"></div>

        <div className="employee-section-outer">
          <RecurringTasks />
        </div>

        <div className="section-separator"></div>

        <div className="employee-section-outer">
          <ImpossibleTasks />
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
