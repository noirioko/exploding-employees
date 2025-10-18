import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './CompactEnergyHeader.css';

function CompactEnergyHeader({ energyLevel, setEnergyLevel }) {
  const { getTodaysTasks, tasks } = useApp();
  const todaysTasks = getTodaysTasks();

  // Force re-render when tasks change
  const [, forceUpdate] = useState({});
  useEffect(() => {
    forceUpdate({});
  }, [tasks]);

  const getEnergyIcon = () => {
    if (energyLevel <= 3) return '🔋';
    if (energyLevel <= 6) return '☕';
    return '⚡';
  };

  const getEnergyColor = () => {
    if (energyLevel <= 3) return '#4caf50'; // Green - low energy
    if (energyLevel <= 6) return '#ff9800'; // Orange - medium
    return '#e91e63'; // Pink - high energy
  };

  const getDailyGoal = () => {
    if (energyLevel === 0) return 1;
    if (energyLevel === 1) return 1;
    if (energyLevel === 2) return 2;
    if (energyLevel === 3) return 3;
    if (energyLevel === 4) return 4;
    if (energyLevel === 5) return 5;
    if (energyLevel === 6) return 6;
    if (energyLevel === 7) return 7;
    if (energyLevel === 8) return 8;
    if (energyLevel === 9) return 9;
    if (energyLevel === 10) return 10;
    return 6;
  };

  return (
    <div className="compact-energy-header">
      <div className="energy-section">
        <span className="energy-icon" style={{ fontSize: '20px' }}>
          {getEnergyIcon()}
        </span>
        <span className="energy-label">Energy:</span>
        <input
          type="range"
          className="energy-slider-compact"
          min="0"
          max="10"
          value={energyLevel}
          onChange={(e) => setEnergyLevel(Number(e.target.value))}
          style={{
            '--slider-color': getEnergyColor()
          }}
        />
        <span className="energy-value" style={{ color: getEnergyColor(), fontWeight: '700' }}>
          {energyLevel}/10
        </span>
      </div>

      <div className="divider">|</div>

      {/* Milestone Progress Bar */}
      <div className="milestone-section">
        <span className="milestone-label">Progress:</span>
        <div className="milestone-wrapper">
          <div className="milestone-progress-bar">
            <div
              className="milestone-progress-fill"
              style={{
                width: `${100 - Math.min((todaysTasks.length / Math.max(1, energyLevel)) * 100, 100)}%`
              }}
            ></div>
          </div>
          <div
            className="milestone-character-runner"
            style={{
              left: `${Math.min((todaysTasks.length / Math.max(1, energyLevel)) * 100, 100)}%`
            }}
          >
            <img src="/images/walking-sprites/Yuwon/Yuwon_Walking_Side.gif" alt="Yuwon" />
          </div>
        </div>
        <span className="milestone-value">{todaysTasks.length}/{getDailyGoal()}</span>
      </div>

      <div className="divider">|</div>

      <div className="goal-section">
        <span className="goal-label">Status:</span>
        <span className="goal-value">
          {todaysTasks.length >= energyLevel * 2 && (
            <span style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#ff5252',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              ⚠️ Whoa there...
            </span>
          )}
          {todaysTasks.length >= energyLevel && todaysTasks.length < energyLevel * 2 && (
            <span style={{
              fontSize: '12px',
              fontWeight: '700',
              color: '#4caf50'
            }}>
              🎉 You did it!
            </span>
          )}
          {todaysTasks.length < energyLevel && (
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#999'
            }}>
              Keep going!
            </span>
          )}
        </span>
      </div>

      <div className="divider">|</div>

      <div className="reset-info">
        <span className="reset-icon">🌙</span>
        <span className="reset-label">Resets at midnight</span>
      </div>
    </div>
  );
}

export default CompactEnergyHeader;
