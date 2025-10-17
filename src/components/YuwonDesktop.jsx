import { useState } from 'react';

function YuwonDesktop({ onClose }) {
  const [openGame, setOpenGame] = useState(null);

  const games = [
    {
      id: 'shoot-em-up',
      name: 'Shoot Em Up',
      icon: '🎮',
      color: '#ff6b9d',
      path: '/shoot-em-up'
    },
    // Add more games here later
  ];

  const handleOpenGame = (game) => {
    setOpenGame(game);
  };

  const handleCloseGame = () => {
    setOpenGame(null);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      minHeight: '600px',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '8px',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Desktop Taskbar (top) - Windows-style with Chrome */}
      <div style={{
        background: 'linear-gradient(180deg, #ffc8dd 0%, #ffb3cc 100%)',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderBottom: '2px solid #ff9cbd',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Fake Chrome with Company Tab */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer'
        }}
        onClick={onClose}
        title="Click to go back to Company page"
        >
          <span style={{ fontSize: '14px' }}>🌐</span>
          <span style={{ fontWeight: '500', color: '#333' }}>AXIS Portal</span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Exit button */}
        <button
          onClick={onClose}
          style={{
            background: '#ffb3ba',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 16px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            color: 'white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          ✕ Exit Desktop
        </button>
      </div>

      {/* Desktop Content */}
      <div style={{
        flex: 1,
        padding: '40px',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Desktop Title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          color: 'white',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
        }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '8px' }}>
            💕 Yuwon's Desktop 💕
          </h1>
          <p style={{ fontSize: '14px', opacity: 0.9 }}>
            A hidden treasure of mini games!
          </p>
        </div>

        {/* Game Icons Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '30px',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {games.map(game => (
            <div
              key={game.id}
              onClick={() => handleOpenGame(game)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {/* Game Icon */}
              <div style={{
                width: '80px',
                height: '80px',
                background: `linear-gradient(135deg, ${game.color}dd 0%, ${game.color} 100%)`,
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                border: '3px solid rgba(255, 255, 255, 0.5)'
              }}>
                {game.icon}
              </div>
              {/* Game Name */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#333',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                textAlign: 'center',
                whiteSpace: 'nowrap'
              }}>
                {game.name}.exe
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Mini Browser Popup */}
      {openGame && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          maxWidth: '90%',
          height: '400px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '3px solid #d4c5f0',
          zIndex: 10
        }}>
          {/* Mini Browser Header */}
          <div style={{
            background: 'linear-gradient(180deg, #ffc8dd 0%, #ffb3cc 100%)',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #ff9cbd'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: '#333'
            }}>
              <span>{openGame.icon}</span>
              <span>{openGame.name}</span>
            </div>
            <button
              onClick={handleCloseGame}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: '#ffb3ba',
                border: '1px solid #ff9999',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              ✕
            </button>
          </div>

          {/* Game Content Area */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fff9e6 0%, #ffe6f0 100%)',
            padding: '40px'
          }}>
            <div style={{
              textAlign: 'center',
              maxWidth: '400px'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎮</div>
              <h2 style={{
                fontSize: '24px',
                color: '#e91e63',
                marginBottom: '12px',
                fontWeight: '700'
              }}>
                Coming Soon!
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                This game is still in development! Check back later for updates 💕
              </p>
              <div style={{
                background: 'white',
                padding: '15px',
                borderRadius: '8px',
                border: '2px solid #ffc1e3',
                fontSize: '12px',
                color: '#999'
              }}>
                <strong style={{ color: '#e91e63' }}>Developer Note:</strong><br/>
                Game mechanics and graphics are being polished! ✨
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default YuwonDesktop;
