import { useState } from 'react';
import { useApp } from '../context/AppContext';

function SelfCare() {
  const { hydrationLog, restLog, addHydration, addRest } = useApp();
  const [glasses, setGlasses] = useState(0);

  const today = new Date().toLocaleDateString();
  const todayHydration = hydrationLog.filter(log =>
    new Date(log.timestamp).toLocaleDateString() === today
  );
  const todayRest = restLog.filter(log =>
    new Date(log.timestamp).toLocaleDateString() === today
  );

  const totalGlassesToday = todayHydration.reduce((sum, log) => sum + log.glasses, 0);

  const handleAddWater = () => {
    if (glasses > 0 && glasses <= 7) {
      addHydration(glasses);
      setGlasses(0);
    }
  };

  const handleAddRest = (type) => {
    addRest(type);
  };

  return (
    <div>
      <div className="current-date">
        💖 Self Care Corner
      </div>

      <div className="content">
        {/* Hydration Tracker */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', color: '#e91e63', marginBottom: '20px' }}>💧 Hydration Tracker</h2>

          <div style={{ background: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)', border: '3px solid #4fc3f7', borderRadius: '20px', padding: '30px' }}>
            {/* Glass Display */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <div key={num} style={{
                  width: '50px',
                  height: '70px',
                  background: num <= totalGlassesToday
                    ? 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)'
                    : '#e0e0e0',
                  borderRadius: '0 0 10px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  transition: 'all 0.3s ease',
                  boxShadow: num <= totalGlassesToday ? '0 4px 15px rgba(79, 195, 247, 0.4)' : 'none'
                }}>
                  {num <= totalGlassesToday ? '💧' : '🥤'}
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#0277bd' }}>
                {totalGlassesToday} / 7 glasses today
              </div>
              <div style={{ fontSize: '13px', color: '#0277bd', marginTop: '5px' }}>
                {totalGlassesToday >= 7 ? '🎉 Goal achieved!' : `${7 - totalGlassesToday} more to go!`}
              </div>
            </div>

            {/* Add Water */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
              <input
                type="number"
                min="1"
                max="7"
                value={glasses || ''}
                onChange={(e) => setGlasses(Number(e.target.value))}
                placeholder="Glasses"
                style={{
                  padding: '12px',
                  border: '2px solid #4fc3f7',
                  borderRadius: '10px',
                  fontSize: '14px',
                  width: '120px',
                  outline: 'none',
                  background: 'white'
                }}
              />
              <button
                onClick={handleAddWater}
                disabled={glasses <= 0 || glasses > 7}
                style={{
                  padding: '12px 24px',
                  background: (glasses > 0 && glasses <= 7)
                    ? 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)'
                    : '#bdbdbd',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  cursor: (glasses > 0 && glasses <= 7) ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
              >
                💧 Log Water
              </button>
            </div>
          </div>
        </div>

        {/* Rest Tracker */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '24px', color: '#e91e63', marginBottom: '20px' }}>😴 Rest & Breaks</h2>

          <div style={{ background: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)', border: '3px solid #ce93d8', borderRadius: '20px', padding: '30px' }}>
            {/* Info Box */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '20px',
              border: '2px solid #ce93d8'
            }}>
              <p style={{ fontSize: '13px', color: '#8e24aa', marginBottom: '8px', fontWeight: '600' }}>
                ✨ Resting restores ALL energy for ALL employees, regardless of rest type!
              </p>
              <p style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>
                <strong>ℹ️ Note:</strong> While you can cheat to restore energy, this app is designed to remind you to actually rest and hydrate. Use responsibly—your well-being matters! 💖
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
              <button
                onClick={() => handleAddRest('short')}
                style={{
                  padding: '20px',
                  background: 'white',
                  border: '2px solid #ce93d8',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>☕</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#8e24aa' }}>Short Break</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>5-15 minutes</div>
              </button>

              <button
                onClick={() => handleAddRest('long')}
                style={{
                  padding: '20px',
                  background: 'white',
                  border: '2px solid #ce93d8',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛋️</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#8e24aa' }}>Long Break</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>30+ minutes</div>
              </button>

              <button
                onClick={() => handleAddRest('sleep')}
                style={{
                  padding: '20px',
                  background: 'white',
                  border: '2px solid #ce93d8',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>😴</div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#8e24aa' }}>Sleep/Nap</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>Full rest</div>
              </button>
            </div>

            {/* Today's rest log */}
            {todayRest.length > 0 && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '15px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#8e24aa', marginBottom: '10px' }}>
                  Today's Breaks: {todayRest.length}
                </div>
                {todayRest.slice(-3).reverse().map((rest, idx) => (
                  <div key={idx} style={{ fontSize: '13px', color: '#666', marginBottom: '5px' }}>
                    {rest.type === 'short' && '☕ Short break'}
                    {rest.type === 'long' && '🛋️ Long break'}
                    {rest.type === 'sleep' && '😴 Sleep/Nap'}
                    {' - '}
                    {new Date(rest.timestamp).toLocaleTimeString()}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="footer">
        <span>💕 you're doing amazing babe! even tiny steps count! 🌸</span>
      </div>
    </div>
  );
}

export default SelfCare;
