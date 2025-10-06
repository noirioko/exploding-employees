import { useApp } from '../context/AppContext';

function Paycheck() {
  const { won, totalExp, completedTasks, accumulatedWon, yuCash, noahCreditCard, givePaycheck } = useApp();

  return (
    <div>
      <div className="current-date">
        📅 Paycheck Summary
      </div>

      <div className="content">
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

      <div className="footer">
        <span>💕 you're doing amazing babe! even tiny steps count! 🌸</span>
      </div>
    </div>
  );
}

export default Paycheck;
