import { useState } from 'react';

function YuwonDesktop({ onClose }) {
  const [openGame, setOpenGame] = useState(null);
  const [showStartMenu, setShowStartMenu] = useState(false);

  const desktopIcons = [
    {
      id: 'browser',
      name: 'AXIS Portal',
      icon: '🌐',
      color: '#5b4a7d',
      isBrowser: true
    },
    {
      id: 'employee-invaders',
      name: 'Employee Invaders',
      icon: '👔',
      color: '#00ff00',
      path: '/employee-invaders?embedded=true'
    },
    {
      id: 'underboss',
      name: 'Underboss',
      icon: '📄',
      color: '#ff6b9d',
      path: '/shoot-em-up?embedded=true'
    },
  ];

  const handleIconClick = (icon) => {
    if (icon.isBrowser) {
      onClose(); // Restore the browser
    } else {
      setOpenGame(icon);
    }
  };

  const handleCloseGame = () => {
    setOpenGame(null);
  };

  const handleStartMenuClick = (icon) => {
    setShowStartMenu(false);
    handleIconClick(icon);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      borderRadius: '15px',
      overflow: 'hidden',
      border: '4px solid #d4c5f0',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '800px',
      position: 'relative'
    }}>

      {/* Desktop Content Area */}
      <div style={{
        flex: 1,
        padding: '20px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Desktop Icons - Left aligned vertical list */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'flex-start'
        }}>
          {desktopIcons.map(icon => (
            <div
              key={icon.id}
              onClick={() => handleIconClick(icon)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                width: '80px'
              }}
            >
              {/* Icon */}
              <div style={{
                fontSize: '48px',
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
              }}>
                {icon.icon}
              </div>
              {/* Icon Name - Simple text with shadow */}
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: 'white',
                textAlign: 'center',
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)',
                lineHeight: '1.2',
                wordWrap: 'break-word',
                width: '100%'
              }}>
                {icon.isBrowser ? icon.name : `${icon.name}.exe`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Windows-style Taskbar at Bottom */}
      <div style={{
        background: 'linear-gradient(180deg, #ffc8dd 0%, #ffb3cc 100%)',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderTop: '2px solid #ff9cbd',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.2)',
        minHeight: '50px',
        position: 'relative'
      }}>
        {/* Start Menu Button */}
        <div
          onClick={() => setShowStartMenu(!showStartMenu)}
          style={{
            background: 'linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%)',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '700',
            color: 'white',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(233, 30, 99, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ fontSize: '16px' }}>🌸</span>
          <span>Start</span>
        </div>

        {/* Start Menu Popup */}
        {showStartMenu && (
          <div style={{
            position: 'absolute',
            bottom: '100%',
            left: '12px',
            marginBottom: '8px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            border: '2px solid #ff9cbd',
            minWidth: '250px',
            overflow: 'hidden',
            zIndex: 100
          }}>
            {/* Start Menu Header */}
            <div style={{
              background: 'linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%)',
              padding: '15px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>🌸</span>
              <span>Yuwon's Programs</span>
            </div>

            {/* Menu Items */}
            <div style={{ padding: '8px' }}>
              {desktopIcons.map(icon => (
                <div
                  key={icon.id}
                  onClick={() => handleStartMenuClick(icon)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontSize: '24px' }}>{icon.icon}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>
                      {icon.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#999' }}>
                      {icon.isBrowser ? 'Web Browser' : 'Game'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Minimized AXIS Portal Button */}
        <div
          onClick={onClose}
          style={{
            background: 'white',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: '600',
            color: '#333',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            border: '2px solid #e0e0e0',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f5f5';
            e.currentTarget.style.borderColor = '#ff9cbd';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.borderColor = '#e0e0e0';
          }}
          title="Click to restore AXIS Portal"
        >
          <span style={{ fontSize: '14px' }}>🌐</span>
          <span>AXIS Portal</span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* System Tray / Clock */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          color: '#333'
        }}>
          {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Game Mini Browser Popup */}
      {openGame && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '650px',
          maxWidth: '95%',
          height: '520px',
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

          {/* Game Content Area - Load the actual game via iframe */}
          <div style={{
            flex: 1,
            overflow: 'hidden',
            background: '#000'
          }}>
            <iframe
              src={openGame.path}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block'
              }}
              title={openGame.name}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default YuwonDesktop;
