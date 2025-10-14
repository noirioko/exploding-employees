import { useState } from 'react';
import { useApp } from '../context/AppContext';
import InfoPopup from '../components/InfoPopup';
import './Company.css';

function Company() {
  const { completedTasks, won, totalExp, accumulatedWon, yuCash, noahCreditCard, givePaycheck, getMoraleStatus, getCompanyRank, seedTestRankData, minkyuMode } = useApp();
  const [activeTab, setActiveTab] = useState('achievement');
  const [selectedCouple, setSelectedCouple] = useState('noah-yuwon');

  // Mode labels for display
  const modeLabels = {
    'normal': '🏠 Normal',
    'no-buy': '🚫 No-Buy Challenge',
    'jobless': '💼 Jobless/Break',
    'saving': '💰 Saving Goal'
  };

  const renderAchievement = () => {

    const couples = {
      'noah-yuwon': {
        name: 'Noah × Yuwon',
        char1: 'Noah',
        char2: 'Yuwon',
        color: '#e91e63',
        employees: ['yuwon', 'noah'],
        runner: 'Yuwon'
      },
      'jaehyun-minkyu': {
        name: 'Jaehyun × Minkyu',
        char1: 'Jaehyun',
        char2: 'Minkyu',
        color: '#9c27b0',
        employees: ['jaehyun', 'minkyu'],
        runner: 'Minkyu'
      },
    };

    // Filter completed tasks by selected couple's employees
    const currentCouple = couples[selectedCouple] || couples['noah-yuwon'];
    const coupleTasks = completedTasks.filter(task =>
      currentCouple.employees.includes(task.assignedEmployee)
    );
    const totalCompleted = coupleTasks.length;

    const milestones = [5, 10, 30, 50, 100];
    const progressPercentage = Math.min((totalCompleted / 100) * 100, 100);

    return (
      <div>
        {/* Marathon Progress Bar */}
        <div style={{
          background: 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)',
          border: '4px solid #ffd54f',
          borderRadius: '25px',
          padding: '30px',
          position: 'relative',
          overflow: 'visible',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h2 style={{
              fontSize: '26px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #ff6f00 0%, #ff9800 50%, #ffc107 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
            }}>
              🏆 ACHIEVEMENT MARATHON 🏆
            </h2>
            <p style={{ fontSize: '14px', color: '#f57c00', fontWeight: '600' }}>
              Complete tasks to unlock couple rewards! 💕
            </p>
          </div>

          {/* Couple Selector */}
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <h3 style={{ fontSize: '14px', color: '#f57c00', marginBottom: '12px', fontWeight: '600' }}>
              💕 Select Your Couple
            </h3>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '15px' }}>
              {Object.entries(couples).map(([key, couple]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCouple(key)}
                  style={{
                    padding: '12px 24px',
                    background: selectedCouple === key
                      ? 'linear-gradient(135deg, #ff4081 0%, #f50057 100%)'
                      : 'white',
                    color: selectedCouple === key ? 'white' : '#666',
                    border: `3px solid ${selectedCouple === key ? '#f50057' : '#ffd54f'}`,
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedCouple === key ? '0 4px 15px rgba(245, 0, 87, 0.4)' : 'none',
                  }}
                >
                  {couple.name}
                </button>
              ))}
            </div>

            {/* Couple Character Icons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '4px solid white',
                boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)',
                overflow: 'hidden',
                background: 'white',
              }}>
                <img
                  src={`/images/${currentCouple.char1}_1.png`}
                  alt={currentCouple.char1}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ fontSize: '28px', animation: 'heartbeat 1.5s ease-in-out infinite' }}>💕</div>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                border: '4px solid white',
                boxShadow: '0 4px 15px rgba(255, 152, 0, 0.4)',
                overflow: 'hidden',
                background: 'white',
              }}>
                <img
                  src={`/images/${currentCouple.char2}_1.png`}
                  alt={currentCouple.char2}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'space-around', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center', background: 'white', padding: '15px 25px', borderRadius: '15px', flex: '1', minWidth: '100px', border: '2px solid #ffd54f' }}>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '5px' }}>Total Tasks</div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#ff9800' }}>{totalCompleted}</div>
            </div>
            <div style={{ textAlign: 'center', background: 'white', padding: '15px 25px', borderRadius: '15px', flex: '1', minWidth: '100px', border: '2px solid #ffd54f' }}>
              <div style={{ fontSize: '12px', color: '#999', marginBottom: '5px' }}>Rewards</div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#e91e63' }}>
                {milestones.filter(m => totalCompleted >= m).length}/5
              </div>
            </div>
          </div>

          {/* Progress Track with Rainbow */}
          <div style={{ position: 'relative', paddingTop: '50px', paddingBottom: '20px' }}>
            {/* Character Runner - outside bar container */}
            <div style={{
              position: 'absolute',
              top: '0px',
              left: `${Math.min(progressPercentage, 100)}%`,
              transform: 'translateX(-50%)',
              transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 20,
              width: '50px',
              height: '50px',
              filter: 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.3))',
            }}>
              <img
                src={currentCouple.runner === 'Yuwon' ? '/images/Yuwon_side_walk.gif' : '/images/Minkyu_side_walk.gif'}
                alt={`${currentCouple.runner} walking`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  imageRendering: 'pixelated',
                }}
                onError={(e) => {
                  // Fallback to static image if gif doesn't exist
                  e.target.src = `/images/${currentCouple.runner}_1.png`;
                }}
              />
            </div>

            {/* Milestone Icons - outside bar container */}
            {milestones.map((milestone, idx) => {
              const position = (milestone / 100) * 100;
              const isCompleted = totalCompleted >= milestone;
              const isLast = idx === milestones.length - 1;

              return (
                <div
                  key={milestone}
                  style={{
                    position: 'absolute',
                    top: '50px',
                    left: `${position}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    filter: isCompleted ? 'brightness(1.2) drop-shadow(0 2px 6px rgba(233, 30, 99, 0.6))' : 'grayscale(0.5) opacity(0.7)',
                    transition: 'all 0.5s ease',
                  }}
                >
                  <img
                    src={isLast ? '/images/icon_love.png' : '/images/icon_star.png'}
                    alt={isLast ? 'love' : 'star'}
                    style={{ width: isLast ? '32px' : '28px', height: 'auto' }}
                  />
                </div>
              );
            })}

            {/* The Progress Bar */}
            <div style={{
              position: 'relative',
              height: '20px',
              background: '#f5f5f5',
              borderRadius: '12px',
              overflow: 'hidden',
              border: '2px solid #e0e0e0',
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
            }}>
              {/* Full rainbow background - always full width */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                background: 'linear-gradient(to right, #66bb6a 0%, #42a5f5 16.67%, #ffee58 33.33%, #ffa726 50%, #ef5350 66.67%, #ec407a 83.33%, #ec407a 100%)',
                opacity: 1,
              }} />

              {/* Overlay to hide unrevealed portion */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: `${progressPercentage}%`,
                height: '100%',
                width: `${100 - progressPercentage}%`,
                background: '#f5f5f5',
                transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1), width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            </div>

            <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px', color: '#666' }}>
              <strong style={{ color: '#e91e63', fontSize: '18px' }}>{totalCompleted}</strong> / 100 tasks completed
              {totalCompleted < 100 && ` • ${100 - totalCompleted} more to go!`}
            </div>
          </div>

          <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '20px', fontStyle: 'italic' }}>
            💡 Milestones: 5, 10, 30, 50, 100 tasks completed!
          </p>
        </div>
      </div>
    );
  };

  const renderPromotion = () => {
    const employees = {
      yuwon: {
        name: 'Yuwon',
        color: '#e91e63',
        image: 'Yuwon_1.png',
        titles: {
          1: 'Graphic Design Intern',
          3: 'Junior Graphic Designer',
          6: 'Senior Designer',
          10: 'Creative Project Manager'
        }
      },
      jaehyun: {
        name: 'Jaehyun',
        color: '#9c27b0',
        image: 'Jaehyun_1.png',
        titles: {
          1: 'Marketing Intern',
          3: 'Marketing Specialist',
          6: 'Marketing Lead',
          10: 'Head of Marketing'
        }
      },
      minkyu: {
        name: 'Minkyu',
        color: '#ff9800',
        image: 'Minkyu_1.png',
        titles: {
          1: 'Operations Intern',
          3: 'Operations Coordinator',
          6: 'Operations Manager',
          10: 'Chief Operations Officer'
        }
      },
      noah: {
        name: 'Noah',
        color: '#2196f3',
        image: 'Noah_1.png',
        titles: {
          1: 'Management Trainee',
          3: 'Project Manager',
          6: 'Senior Manager',
          10: 'Director'
        }
      },
    };

    // Calculate exp for each employee from completed tasks
    const employeeExp = {};
    Object.keys(employees).forEach(empId => {
      const empTasks = completedTasks.filter(task => task.assignedEmployee === empId);
      employeeExp[empId] = empTasks.reduce((sum, task) => sum + (task.expEarned || 0), 0);
    });

    // Calculate level (10 exp per level)
    const calculateLevel = (exp) => Math.floor(exp / 10) + 1;
    const calculateProgress = (exp) => (exp % 10) / 10 * 100;

    // Get current title based on level
    const getTitle = (employee, level) => {
      const titleLevels = [10, 6, 3, 1];
      for (let titleLevel of titleLevels) {
        if (level >= titleLevel) {
          return employee.titles[titleLevel];
        }
      }
      return employee.titles[1];
    };

    return (
      <div>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '24px', color: '#e91e63', marginBottom: '10px' }}>⭐ Employee Promotion System</h3>
          <p style={{ fontSize: '14px', color: '#666' }}>Each employee gains EXP when you complete tasks with them selected! Level them up! 💪</p>
        </div>

        {/* Employee Cards */}
        <div className="employee-progress-container">
          {Object.entries(employees).map(([empId, emp]) => {
            const exp = employeeExp[empId] || 0;
            const level = calculateLevel(exp);
            const progress = calculateProgress(exp);

            return (
              <div key={empId} className="employee-card">
                {/* Employee Header */}
                <div className="employee-header">
                  <img
                    src={`/images/${emp.image}`}
                    alt={emp.name}
                    className="employee-avatar"
                  />
                  <div className="employee-info">
                    <h4 className="employee-name">
                      {emp.name}
                    </h4>
                    <div className="employee-title">
                      {getTitle(emp, level)}
                    </div>
                  </div>
                  <div className="employee-level">
                    <div className="level-label">Level</div>
                    <div className="level-value">{level}</div>
                  </div>
                </div>

                {/* EXP Bar */}
                <div className="exp-bar-container">
                  <div className="exp-bar" style={{ width: `${progress}%` }} />
                </div>
                <div className="exp-text">
                  {exp % 10} / 10 EXP
                </div>
              </div>
            );
          })}
        </div>

        {/* How to Earn EXP */}
        <div style={{
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          border: '3px solid #90caf9',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '25px',
          textAlign: 'center',
        }}>
          <h3 style={{ fontSize: '18px', color: '#1976d2', marginBottom: '15px' }}>💡 How to Earn EXP</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '15px',
            marginBottom: '15px',
          }}>
            <div style={{
              background: 'white',
              padding: '15px',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                padding: '5px 10px',
                borderRadius: '10px',
                display: 'inline-block',
                background: '#e8f5e9',
                color: '#2e7d32',
              }}>
                🔋 Low Energy
              </div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#ff9800' }}>+1 EXP</div>
            </div>
            <div style={{
              background: 'white',
              padding: '15px',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                padding: '5px 10px',
                borderRadius: '10px',
                display: 'inline-block',
                background: '#fff3e0',
                color: '#e65100',
              }}>
                ☕ Med Energy
              </div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#ff9800' }}>+2 EXP</div>
            </div>
            <div style={{
              background: 'white',
              padding: '15px',
              borderRadius: '15px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px',
                padding: '5px 10px',
                borderRadius: '10px',
                display: 'inline-block',
                background: '#fce4ec',
                color: '#c2185b',
              }}>
                ⚡ High Energy
              </div>
              <div style={{ fontSize: '20px', fontWeight: '900', color: '#ff9800' }}>+3 EXP</div>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic', margin: 0 }}>
            💡 Complete tasks to give their assigned employee EXP!
          </p>
        </div>

        {/* Career Progression Paths */}
        <div style={{
          background: 'linear-gradient(135deg, #fff9e6 0%, #ffe6f0 100%)',
          border: '3px solid #ffd6a5',
          borderRadius: '20px',
          padding: '20px',
        }}>
          <h3 style={{ fontSize: '18px', color: '#ff9800', marginBottom: '10px', textAlign: 'center' }}>📊 Promotion Paths</h3>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px', textAlign: 'center' }}>
            Each character has their own unique career journey!
          </p>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {Object.entries(employees).map(([empId, emp]) => (
              <div key={empId} style={{
                background: 'white',
                padding: '15px',
                borderRadius: '15px',
                border: '2px solid #ffd6a5',
                width: '250px',
                maxWidth: '250px',
                minWidth: '200px',
                flex: '0 0 250px',
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#ff9800',
                  marginBottom: '10px',
                  textAlign: 'center'
                }}>
                  {emp.name}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{
                    fontSize: '12px',
                    color: '#666',
                    padding: '6px 10px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    borderLeft: '3px solid #ff9800',
                    display: 'block'
                  }}>
                    Lv 1-2: {emp.titles[1]}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#666',
                    padding: '6px 10px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    borderLeft: '3px solid #ff9800',
                    display: 'block'
                  }}>
                    Lv 3-5: {emp.titles[3]}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#666',
                    padding: '6px 10px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    borderLeft: '3px solid #ff9800',
                    display: 'block'
                  }}>
                    Lv 6-9: {emp.titles[6]}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    color: '#666',
                    padding: '6px 10px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    borderLeft: '3px solid #ff9800',
                    display: 'block'
                  }}>
                    Lv 10+: {emp.titles[10]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  };

  const renderMoral = () => {
    return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '24px', color: '#e91e63', marginBottom: '10px' }}>💚 Employee Morale</h2>
        <p style={{ fontSize: '14px', color: '#999' }}>Check how your employees are feeling!</p>
        <button
          onClick={seedTestRankData}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#9c27b0',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          🧪 Seed Test Data (S, A, B, C)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', padding: '0 20px' }}>
        {['yuwon', 'jaehyun', 'minkyu', 'noah'].map(employee => {
          const morale = getMoraleStatus(employee);
          // Map moods to yuyumojis
          let moodEmoji;
          if (morale.mood === 'extremely tired & angry') moodEmoji = 'yuwon_superangry.png';
          else if (morale.mood === 'overworked') moodEmoji = 'yuwon_superangry.png';
          else if (morale.mood === 'stressed') moodEmoji = 'yuwon_angry.png';
          else if (morale.mood === 'content') moodEmoji = 'yuwon_happy.png';
          else if (morale.mood === 'delighted') moodEmoji = 'yuwon_happy.png'; // Noah being evil
          else if (morale.mood === 'satisfied') moodEmoji = 'yuwon_neutral.png';
          else if (morale.mood === 'okay') moodEmoji = 'yuwon_neutral.png';
          else if (morale.mood === 'bored') moodEmoji = 'yuwon_sad.png';
          else if (morale.mood === 'extremely bored') moodEmoji = 'yuwon_verysad.png';
          else moodEmoji = 'yuwon_neutral.png';

          const isSRank = morale.rank === 'S';

          return (
            <div key={employee} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              position: 'relative',
              border: '3px solid transparent',
              backgroundImage: isSRank
                ? 'linear-gradient(white, white), linear-gradient(90deg, #ff6ec4, #7873f5, #4facfe, #00f2fe, #ff6ec4)'
                : 'none',
              backgroundOrigin: 'border-box',
              backgroundClip: isSRank ? 'padding-box, border-box' : 'padding-box',
              backgroundSize: isSRank ? '100% 100%, 200% 100%' : 'auto',
              animation: isSRank ? 'shimmer 3s linear infinite' : 'none',
              overflow: 'visible'
            }}>
              {/* Rank Badge - Top Right Corner (Trading Card Style) */}
              <div style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: morale.rankColor,
                color: 'white',
                width: morale.rank === 'S' ? '60px' : '50px',
                height: morale.rank === 'S' ? '60px' : '50px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: morale.rank === 'S' ? '32px' : '24px',
                fontWeight: '900',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                border: '4px solid white',
                zIndex: 10,
                animation: morale.rank === 'S' ? 'sparkle 1.5s ease-in-out infinite' : 'none',
                textShadow: morale.rank === 'S' ? '0 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 215, 0, 0.8)' : 'none'
              }}>
                {morale.rank}
                {morale.rank === 'S' && (
                  <>
                    <span style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      fontSize: '20px',
                      animation: 'twinkle 1s ease-in-out infinite'
                    }}>✨</span>
                    <span style={{
                      position: 'absolute',
                      bottom: '-5px',
                      left: '-5px',
                      fontSize: '20px',
                      animation: 'twinkle 1s ease-in-out infinite 0.5s'
                    }}>✨</span>
                  </>
                )}
              </div>

              <img
                src={`/images/avatar_${employee}.jpg`}
                alt={employee}
                style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', marginBottom: '10px' }}
              />

              {/* Minkyu Life Mode Badge */}
              {employee === 'minkyu' && (
                <div style={{
                  background: 'linear-gradient(135deg, #00897b 0%, #00695c 100%)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  display: 'inline-block',
                  boxShadow: '0 2px 6px rgba(0, 137, 123, 0.4)'
                }}>
                  {modeLabels[minkyuMode] || '🏠 Normal'}
                </div>
              )}

              <h4 style={{ fontSize: '16px', color: '#333', marginBottom: '8px', textTransform: 'capitalize', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {employee}
                <InfoPopup
                  title="📊 Employee Rank System"
                  content={
                    <div>
                      <p style={{ marginBottom: '8px' }}><strong>Based on last 7 days consistency:</strong></p>
                      <p style={{ marginBottom: '4px' }}>🏆 <strong>S Rank:</strong> {employee === 'minkyu' ? '5+ days' : employee === 'noah' ? '0 missed tasks' : '7 days'} logged</p>
                      <p style={{ marginBottom: '4px' }}>⭐ <strong>A Rank:</strong> {employee === 'minkyu' ? '3+ days' : employee === 'noah' ? '1 missed task' : '5+ days'} logged</p>
                      <p style={{ marginBottom: '4px' }}>👍 <strong>B Rank:</strong> {employee === 'minkyu' ? '2+ days' : employee === 'noah' ? '2 missed tasks' : '3+ days'} logged</p>
                      <p style={{ marginBottom: '4px' }}>😐 <strong>C Rank:</strong> {employee === 'noah' ? '3-4 missed tasks' : '1+ day logged'}</p>
                      <p>❌ <strong>F Rank:</strong> {employee === 'noah' ? '5+ missed tasks' : '0 days logged'}</p>
                      {employee === 'minkyu' && <p style={{ marginTop: '8px', fontStyle: 'italic', fontSize: '11px' }}>💰 Finance is more forgiving!</p>}
                      {employee === 'noah' && <p style={{ marginTop: '8px', fontStyle: 'italic', fontSize: '11px' }}>📅 Noah only loses rank on missed recurring tasks!</p>}
                    </div>
                  }
                />
              </h4>
              <img
                src={`/images/yuyu_mojis/${moodEmoji}`}
                alt={morale.mood}
                style={{ width: '75px', height: '75px', objectFit: 'contain', marginBottom: '8px' }}
              />

              {/* Overwork Warning Badge */}
              {(morale.mood === 'overworked' || morale.mood === 'extremely tired & angry') && (
                <div style={{
                  background: 'linear-gradient(135deg, #ff5252 0%, #f44336 100%)',
                  color: 'white',
                  fontWeight: '900',
                  fontSize: '12px',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  marginBottom: '10px',
                  letterSpacing: '1px',
                  boxShadow: '0 2px 8px rgba(244, 67, 54, 0.4)',
                  animation: 'pulse 1.5s ease-in-out infinite'
                }}>
                  ⚠️ OVERWORKED
                </div>
              )}

              {/* Character Status Message */}
              <div style={{
                background: '#f5f5f5',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '12px',
                fontSize: '11px',
                color: '#666',
                lineHeight: '1.5',
                fontStyle: 'italic',
                textAlign: 'center'
              }}>
                {morale.statusMessage}
              </div>

              {/* Today's Stats */}
              <div style={{
                borderTop: '2px solid #e0e0e0',
                paddingTop: '10px',
                fontSize: '12px'
              }}>
                <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                  <div style={{ color: '#999', marginBottom: '3px' }}>Done Today</div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#4caf50' }}>
                    {morale.doneToday}
                  </div>
                </div>

                {/* Energy Bar */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ color: '#999', marginBottom: '5px', textAlign: 'center' }}>Energy ⚡</div>
                  <div style={{
                    width: '100%',
                    height: '20px',
                    background: '#e0e0e0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${(morale.remainingEnergy || 10) * 10}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #81c784 0%, #4caf50 100%)',
                      transition: 'width 0.3s ease'
                    }}></div>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '11px',
                      fontWeight: '700',
                      color: '#333'
                    }}>
                      {morale.remainingEnergy || 10}/10
                    </div>
                  </div>
                </div>

                {/* Mood Bar */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ color: '#999', marginBottom: '5px', textAlign: 'center', fontSize: '11px' }}>
                    Mood: <span style={{ color: '#e91e63', fontWeight: '600' }}>{morale.mood}</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '20px',
                    background: '#e0e0e0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${morale.moodLevel}%`,
                      height: '100%',
                      background: morale.moodLevel >= 80 ? 'linear-gradient(90deg, #ff6b6b, #ee5a6f)' :
                                 morale.moodLevel >= 40 ? 'linear-gradient(90deg, #4ecdc4, #44a08d)' :
                                 'linear-gradient(90deg, #bdc3c7, #95a5a6)',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>

                {/* Performance Bar */}
                <div>
                  <div style={{ color: '#999', marginBottom: '5px', textAlign: 'center', fontSize: '11px' }}>
                    Performance: <span style={{ color: '#ff9800', fontWeight: '600' }}>{morale.performance}</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '20px',
                    background: '#e0e0e0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: `${morale.performanceLevel}%`,
                      height: '100%',
                      background: morale.performanceLevel >= 70 ? 'linear-gradient(90deg, #f39c12, #f1c40f)' :
                                 morale.performanceLevel >= 40 ? 'linear-gradient(90deg, #3498db, #2980b9)' :
                                 'linear-gradient(90deg, #e74c3c, #c0392b)',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>

                {/* Simple Score Breakdown */}
                <div style={{
                  marginTop: '12px',
                  padding: '10px',
                  background: '#f9f9f9',
                  borderRadius: '8px',
                  fontSize: '11px'
                }}>
                  <div style={{
                    fontWeight: '700',
                    color: '#666',
                    marginBottom: '6px',
                    textAlign: 'center',
                    fontSize: '12px'
                  }}>
                    📊 Last 7 Days
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#999' }}>Days Worked:</span>
                    <span style={{ fontWeight: '700', color: '#4caf50' }}>{morale.daysWorked}/7</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#999' }}>Today Energy:</span>
                    <span style={{ fontWeight: '700', color: morale.energyPoints >= 9 ? '#e74c3c' : morale.energyPoints >= 6 ? '#ff9800' : '#4caf50' }}>
                      {morale.energyPoints}/10
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#999' }}>Today Tasks:</span>
                    <span style={{ fontWeight: '700', color: '#2196f3' }}>{morale.doneToday}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Company Rank Section */}
      {(() => {
        const companyRank = getCompanyRank();
        const isSRank = companyRank.rank === 'S';

        return (
          <div style={{
            background: 'linear-gradient(135deg, #f3e5f5 0%, #e8eaf6 100%)',
            border: '4px solid transparent',
            borderRadius: '25px',
            padding: '30px',
            marginTop: '30px',
            textAlign: 'center',
            position: 'relative',
            backgroundImage: isSRank
              ? 'linear-gradient(135deg, #f3e5f5 0%, #e8eaf6 100%), linear-gradient(90deg, #ff6ec4, #7873f5, #4facfe, #00f2fe, #ff6ec4)'
              : 'none',
            backgroundOrigin: 'border-box',
            backgroundClip: isSRank ? 'padding-box, border-box' : 'padding-box',
            backgroundSize: isSRank ? '100% 100%, 200% 100%' : 'auto',
            animation: isSRank ? 'shimmer 3s linear infinite' : 'none',
          }}>
            <h3 style={{ fontSize: '22px', color: '#7b1fa2', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              🏢 Company Overall Rank
              <InfoPopup
                title="🏢 Company Rank System"
                content={
                  <div>
                    <p style={{ marginBottom: '8px' }}><strong>Based on average of all employee ranks:</strong></p>
                    <p style={{ marginBottom: '4px' }}>🏆 <strong>S Rank:</strong> Average 4.5+ (mostly S/A employees)</p>
                    <p style={{ marginBottom: '4px' }}>⭐ <strong>A Rank:</strong> Average 3.5+ (mostly A/B employees)</p>
                    <p style={{ marginBottom: '4px' }}>👍 <strong>B Rank:</strong> Average 2.5+ (mostly B/C employees)</p>
                    <p style={{ marginBottom: '4px' }}>😐 <strong>C Rank:</strong> Average 1.5+ (mostly C/F employees)</p>
                    <p>❌ <strong>F Rank:</strong> Average below 1.5</p>
                    <p style={{ marginTop: '12px', fontSize: '11px', fontStyle: 'italic', color: '#666' }}>
                      💡 Improve individual employee ranks to boost company rank!
                    </p>
                  </div>
                }
              />
            </h3>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                background: companyRank.color,
                color: 'white',
                width: companyRank.rank === 'S' ? '100px' : '80px',
                height: companyRank.rank === 'S' ? '100px' : '80px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: companyRank.rank === 'S' ? '48px' : '36px',
                fontWeight: '900',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                border: '5px solid white',
                animation: companyRank.rank === 'S' ? 'sparkle 1.5s ease-in-out infinite' : 'none',
                textShadow: companyRank.rank === 'S' ? '0 3px 6px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 215, 0, 1)' : 'none',
                position: 'relative'
              }}>
                {companyRank.rank}
                {companyRank.rank === 'S' && (
                  <>
                    <span style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      fontSize: '30px',
                      animation: 'twinkle 1s ease-in-out infinite'
                    }}>✨</span>
                    <span style={{
                      position: 'absolute',
                      bottom: '-10px',
                      left: '-10px',
                      fontSize: '30px',
                      animation: 'twinkle 1s ease-in-out infinite 0.5s'
                    }}>✨</span>
                  </>
                )}
              </div>

              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>
                  Average Score: <span style={{ fontSize: '24px', fontWeight: '700', color: companyRank.color }}>{companyRank.avgScore}</span>/5.0
                </div>
                <div style={{ fontSize: '13px', color: '#999' }}>Based on all employee performance</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {companyRank.employeeRanks.map(emp => (
                <div key={emp.name} style={{
                  background: 'white',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  border: '2px solid #e0e0e0'
                }}>
                  <span style={{ textTransform: 'capitalize', fontSize: '14px', fontWeight: '600', color: '#666' }}>
                    {emp.name}
                  </span>
                  <span style={{
                    background: emp.color,
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '900'
                  }}>
                    {emp.rank}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
  };

  const renderFinance = () => (
    <div>
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '30px', color: '#e91e63' }}>💰 Company Finance</h2>

        {/* Currency Display */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)',
            border: '3px solid #ffd54f',
            borderRadius: '20px',
            padding: '30px',
          }}>
            <div style={{ fontSize: '14px', color: '#f57c00', marginBottom: '10px' }}>Accumulated Won</div>
            <div style={{ fontSize: '48px', fontWeight: '900', color: '#ff9800' }}>{accumulatedWon}</div>
            <div style={{ fontSize: '12px', color: '#f57c00', marginTop: '5px' }}>ready to convert</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)',
            border: '3px solid #4fc3f7',
            borderRadius: '20px',
            padding: '30px',
          }}>
            <div style={{ fontSize: '14px', color: '#0277bd', marginBottom: '10px' }}>YuCash (YC)</div>
            <div style={{ fontSize: '48px', fontWeight: '900', color: '#0288d1' }}>{yuCash}</div>
            <div style={{ fontSize: '12px', color: '#0277bd', marginTop: '5px' }}>spendable currency</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
            border: '3px solid #f48fb1',
            borderRadius: '20px',
            padding: '30px',
          }}>
            <div style={{ fontSize: '14px', color: '#c2185b', marginBottom: '10px' }}>Noah's Credit Card</div>
            <div style={{ fontSize: '48px', fontWeight: '900', color: '#e91e63' }}>{noahCreditCard}</div>
            <div style={{ fontSize: '12px', color: '#c2185b', marginTop: '5px' }}>special currency</div>
          </div>
        </div>

        {/* Give Paycheck Button */}
        <div style={{
          background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)',
          border: '3px solid #81c784',
          borderRadius: '20px',
          padding: '30px',
          marginBottom: '30px',
        }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '15px', fontSize: '22px' }}>💵 Convert Won to YuCash</h3>
          <p style={{ fontSize: '14px', color: '#558b2f', marginBottom: '20px' }}>
            Click below to convert your accumulated Won into spendable YuCash!
          </p>
          <button
            onClick={givePaycheck}
            disabled={accumulatedWon === 0}
            style={{
              padding: '15px 40px',
              background: accumulatedWon === 0
                ? '#bdbdbd'
                : 'linear-gradient(135deg, #ff6f00 0%, #ff9800 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '25px',
              fontSize: '18px',
              fontWeight: '700',
              cursor: accumulatedWon === 0 ? 'not-allowed' : 'pointer',
              boxShadow: accumulatedWon === 0 ? 'none' : '0 6px 20px rgba(255, 152, 0, 0.4)',
              transition: 'all 0.3s ease',
            }}
          >
            💸 Give Paycheck ({accumulatedWon} Won → {accumulatedWon} YC)
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '30px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
            border: '2px solid #ffb74d',
            borderRadius: '15px',
            padding: '20px',
          }}>
            <div style={{ fontSize: '13px', color: '#f57c00', marginBottom: '8px' }}>Total Won Earned</div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#ff9800' }}>{won}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
            border: '2px solid #90caf9',
            borderRadius: '15px',
            padding: '20px',
          }}>
            <div style={{ fontSize: '13px', color: '#1976d2', marginBottom: '8px' }}>Total EXP</div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#2196f3' }}>{totalExp}</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
            border: '2px solid #ce93d8',
            borderRadius: '15px',
            padding: '20px',
          }}>
            <div style={{ fontSize: '13px', color: '#8e24aa', marginBottom: '8px' }}>Tasks Done</div>
            <div style={{ fontSize: '36px', fontWeight: '900', color: '#9c27b0' }}>{completedTasks.length}</div>
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)',
          border: '3px solid #81c784',
          borderRadius: '20px',
          padding: '25px',
          marginTop: '30px',
        }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '15px' }}>💡 How it works</h3>
          <div style={{ fontSize: '14px', color: '#558b2f', textAlign: 'left', lineHeight: '1.8' }}>
            <p>🔋 <strong>Low energy tasks:</strong> 1 exp + 10 won</p>
            <p>☕ <strong>Medium energy tasks:</strong> 2 exp + 25 won</p>
            <p>⚡ <strong>High energy tasks:</strong> 3 exp + 50 won</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="current-date">
        📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>

      <div className="content">
        {/* Browser-style window */}
        <div style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', border: '4px solid #d4c5f0' }}>

          {/* Browser Tab Bar (Pink!) */}
          <div style={{
            background: 'linear-gradient(180deg, #ffc8dd 0%, #ffb3cc 100%)',
            padding: '8px 12px 0 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            minHeight: '48px'
          }}>
            {/* Fake Browser Tab with Chrome-style rounded corners */}
            <div style={{
              background: 'white',
              borderRadius: '12px 12px 0 0',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              minWidth: '200px',
              position: 'relative',
              zIndex: 1,
              alignSelf: 'flex-end'
            }}>
              {/* Left curve */}
              <img
                src="/images/ui/round_corner_outward.png"
                alt=""
                style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '-11px',
                  width: '12px',
                  height: '12px',
                  pointerEvents: 'none'
                }}
              />

              {/* Right curve - flipped */}
              <img
                src="/images/ui/round_corner_outward.png"
                alt=""
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '-12px',
                  width: '12px',
                  height: '12px',
                  transform: 'scaleX(-1)',
                  pointerEvents: 'none'
                }}
              />

              <img
                src="/images/ui/icon_axis_logo.png"
                alt="favicon"
                style={{ width: '16px', height: '16px', objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>AXIS Portal</span>
            </div>

            {/* Window Controls - centered in pink bar */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginLeft: 'auto',
              alignItems: 'center'
            }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#baffc9',
                border: '1px solid #99ffaa',
                cursor: 'not-allowed'
              }} title="Maximize" />
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#ffffba',
                border: '1px solid #ffff99',
                cursor: 'not-allowed'
              }} title="Minimize" />
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#ffb3ba',
                border: '1px solid #ff9999',
                cursor: 'not-allowed'
              }} title="Close" />
            </div>
          </div>

          {/* Browser Navigation Bar */}
          <div style={{
            background: '#f8f8f8',
            padding: '10px 15px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            {/* Back/Forward/Refresh buttons */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: '#999',
                userSelect: 'none'
              }}>◀</div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: '#999',
                userSelect: 'none'
              }}>▶</div>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#999',
                userSelect: 'none'
              }}>⟳</div>
            </div>

            {/* URL Bar */}
            <div style={{
              flex: 1,
              background: 'white',
              borderRadius: '20px',
              padding: '8px 16px',
              border: '1px solid #ddd',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '14px', color: '#999' }}>🔒</span>
              <span style={{ fontSize: '13px', color: '#333' }}>
                axis-portal.com/{activeTab === 'achievement' ? 'achievement-marathon' :
                                 activeTab === 'promotion' ? 'employee-promotion' :
                                 activeTab === 'moral' ? 'employee-morale' :
                                 'finance'}
              </span>
            </div>

            {/* Bookmark Icon */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              background: 'white',
              border: '1px solid #ddd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'not-allowed',
              fontSize: '16px'
            }}>⭐</div>
          </div>

          {/* AXIS Logo and Header */}
          <div style={{
            background: '#e6e0f5',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '0'
          }}>
            <img
              src="/images/ui/icon_axis_logo.png"
              alt="AXIS Logo"
              style={{ height: '60px', width: 'auto', objectFit: 'contain' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <h2 style={{ margin: 0, fontSize: '24px', color: '#5b4a7d' }}>AXIS Company Portal</h2>
              <p style={{ fontSize: '13px', color: '#7b68a0', margin: '5px 0 0 0' }}>Employee Management System</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="browser-tabs">
            <button
              className={`browser-tab ${activeTab === 'achievement' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievement')}
            >
              🏆 Achievement Marathon
            </button>
            <button
              className={`browser-tab ${activeTab === 'promotion' ? 'active' : ''}`}
              onClick={() => setActiveTab('promotion')}
            >
              ⭐ Employee Promotion
            </button>
            <button
              className={`browser-tab ${activeTab === 'moral' ? 'active' : ''}`}
              onClick={() => setActiveTab('moral')}
            >
              💚 Employee Moral
            </button>
            <button
              className={`browser-tab ${activeTab === 'finance' ? 'active' : ''}`}
              onClick={() => setActiveTab('finance')}
            >
              💰 Finance
            </button>
          </div>

          {/* Tab content */}
          <div style={{ padding: '20px', background: 'white' }}>
            {activeTab === 'achievement' && renderAchievement()}
            {activeTab === 'promotion' && renderPromotion()}
            {activeTab === 'moral' && renderMoral()}
            {activeTab === 'finance' && renderFinance()}
          </div>
        </div>
      </div>

      <div className="footer">
        <span>💕 you're doing amazing babe! even tiny steps count! 🌸</span>
      </div>

      <style>{`
        @keyframes shine {
          0% {
            left: -100%;
          }
          50%, 100% {
            left: 100%;
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 200% 0%;
          }
        }

        @keyframes sparkle {
          0%, 100% {
            transform: scale(1) rotate(0deg);
            filter: brightness(1);
          }
          25% {
            transform: scale(1.1) rotate(5deg);
            filter: brightness(1.3);
          }
          50% {
            transform: scale(1.15) rotate(-5deg);
            filter: brightness(1.5);
          }
          75% {
            transform: scale(1.1) rotate(5deg);
            filter: brightness(1.3);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0.5);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}

export default Company;
