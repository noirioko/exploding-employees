import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import DailyTasks from '../components/DailyTasks';
import Habits from '../components/Habits';
import FinanceLogs from '../components/FinanceLogs';
import RecurringTasks from '../components/RecurringTasks';
import ImpossibleTasks from '../components/ImpossibleTasks';
import Timer from '../components/Timer';
import Sidebar from '../components/Sidebar';
import CompactEnergyHeader from '../components/CompactEnergyHeader';
import WishlistDreams from '../components/WishlistDreams';
import FinanceOverview from '../components/FinanceOverview';
import Record from './Record';

function Home() {
  const { completedTasks, floatingEmployee, setFloatingEmployee, resetAllData, getTodaysTasks } = useApp();

  // Active section state for sidebar navigation
  const [activeSection, setActiveSection] = useState('todolist');

  const [selectedCoach, setSelectedCoach] = useState('yuwon');
  const [showResetModal, setShowResetModal] = useState(false);

  // Energy level state - lifted from CompactEnergyHeader to share with task components
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
        {/* Compact Energy Header with Progress Bar */}
        <CompactEnergyHeader energyLevel={energyLevel} setEnergyLevel={setEnergyLevel} />

        {/* Work Dashboard with Sidebar */}
        <div className="work-dashboard">
          <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />

          <div className="main-content">
            {activeSection === 'todolist' && <DailyTasks energyLevel={energyLevel} onSwitchToRecord={(filter) => setActiveSection('record')} />}
            {activeSection === 'impossible' && <ImpossibleTasks energyLevel={energyLevel} onSwitchToRecord={(filter) => setActiveSection('record')} />}
            {activeSection === 'habits' && <Habits energyLevel={energyLevel} onSwitchToRecord={(filter) => setActiveSection('record')} />}
            {activeSection === 'recurring' && <RecurringTasks energyLevel={energyLevel} onSwitchToRecord={(filter) => setActiveSection('record')} />}
            {activeSection === 'finance-transactions' && <FinanceLogs energyLevel={energyLevel} onSwitchToRecord={(filter) => setActiveSection('record')} />}
            {activeSection === 'finance-wishlist' && <WishlistDreams />}
            {activeSection === 'finance-overview' && <FinanceOverview />}
            {activeSection === 'timer' && <Timer />}
            {activeSection === 'record' && <Record />}
          </div>
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
