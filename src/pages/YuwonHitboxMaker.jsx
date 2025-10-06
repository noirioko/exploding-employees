import { useState } from 'react';

function YuwonHitboxMaker() {
  const [hitboxOffset, setHitboxOffset] = useState({ x: 0, y: 15 }); // Current offset (Yuwon's perfect: 15, 6)
  const [hitboxSize, setHitboxSize] = useState(6); // Radius of hitbox (Yuwon's perfect: 6)
  const [itemType, setItemType] = useState('yuwon'); // 'yuwon' or 'furniture'

  // Sprite dimensions
  const spriteWidth = 60;
  const spriteHeight = 60;

  return (
    <div style={{ padding: '20px 20px 120px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#e91e63', marginBottom: '10px' }}>📦 Item Hitbox Maker</h1>
      <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>
        Define collision hitboxes for sprites. For Yuwon: use circle at feet. For furniture: use square rectangle.
      </p>

      {/* Type Toggle */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setItemType('yuwon')}
          style={{
            padding: '10px 20px',
            background: itemType === 'yuwon' ? '#e91e63' : '#fff',
            color: itemType === 'yuwon' ? '#fff' : '#666',
            border: '2px solid #e91e63',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          👤 Yuwon (Circle)
        </button>
        <button
          onClick={() => setItemType('furniture')}
          style={{
            padding: '10px 20px',
            background: itemType === 'furniture' ? '#ff9800' : '#fff',
            color: itemType === 'furniture' ? '#fff' : '#666',
            border: '2px solid #ff9800',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          🪑 Furniture (Square)
        </button>
      </div>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'start' }}>
        {/* Left: Visual Preview */}
        <div>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>Visual Preview</h3>
          <div style={{
            position: 'relative',
            width: '300px',
            height: '300px',
            background: '#f5f5f5',
            border: '3px solid #e91e63',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Yuwon sprite */}
            <div style={{ position: 'relative' }}>
              <img
                src="/images/idle_yuwon_outfit1.gif"
                alt="Yuwon"
                style={{
                  width: 'auto',
                  height: `${spriteHeight}px`,
                  imageRendering: 'pixelated'
                }}
              />

              {/* Hitbox indicator */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: `${50 + (hitboxOffset.y / spriteHeight * 100)}%`,
                  transform: `translate(-50%, -50%)`,
                  width: `${hitboxSize * 2}px`,
                  height: `${hitboxSize * 2}px`,
                  background: itemType === 'furniture' ? 'rgba(255, 152, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)',
                  border: `2px solid ${itemType === 'furniture' ? '#ff9800' : '#f44336'}`,
                  borderRadius: itemType === 'furniture' ? '0' : '50%',
                  pointerEvents: 'none'
                }}
              />

              {/* Center crosshair */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: `${50 + (hitboxOffset.y / spriteHeight * 100)}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '2px',
                  height: '20px',
                  background: '#f44336',
                  pointerEvents: 'none'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: `${50 + (hitboxOffset.y / spriteHeight * 100)}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '20px',
                  height: '2px',
                  background: '#f44336',
                  pointerEvents: 'none'
                }}
              />
            </div>
          </div>

          <div style={{
            marginTop: '15px',
            padding: '15px',
            background: '#fff9e6',
            borderRadius: '8px',
            border: '2px solid #ffd93d'
          }}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
              <strong>Current Settings:</strong>
            </div>
            <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.8' }}>
              • Y Offset: {hitboxOffset.y}px (positive = lower on sprite)<br />
              • Hitbox Radius: {hitboxSize}px
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div style={{ flex: 1 }}>
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #e0e0e0'
          }}>
            <h3 style={{ color: '#e91e63', marginTop: 0 }}>Hitbox Settings</h3>

            {/* Y Offset Control */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Y Offset (Vertical Position)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={hitboxOffset.y}
                  onChange={(e) => setHitboxOffset({ ...hitboxOffset, y: parseInt(e.target.value) })}
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  value={hitboxOffset.y}
                  onChange={(e) => setHitboxOffset({ ...hitboxOffset, y: parseInt(e.target.value) || 0 })}
                  style={{
                    width: '60px',
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    textAlign: 'center'
                  }}
                />
                <span style={{ fontSize: '13px', color: '#666' }}>px</span>
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '5px' }}>
                Positive values move hitbox lower (towards feet), negative values move it higher (towards head)
              </div>
            </div>

            {/* Hitbox Size Control */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
                Hitbox Radius
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={hitboxSize}
                  onChange={(e) => setHitboxSize(parseInt(e.target.value))}
                  style={{ flex: 1 }}
                />
                <input
                  type="number"
                  value={hitboxSize}
                  onChange={(e) => setHitboxSize(parseInt(e.target.value) || 1)}
                  style={{
                    width: '60px',
                    padding: '6px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    textAlign: 'center'
                  }}
                />
                <span style={{ fontSize: '13px', color: '#666' }}>px</span>
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '5px' }}>
                Size of the collision detection area around the hitbox point
              </div>
            </div>

            {/* Code Output */}
            <div style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '25px'
            }}>
              <h4 style={{ marginTop: 0, color: '#666', fontSize: '14px' }}>💻 Code to Use:</h4>

              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  <strong>Sprite Position (add to top):</strong>
                </div>
                <code style={{
                  display: 'block',
                  background: '#fff',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#e91e63',
                  overflowX: 'auto'
                }}>
                  {`top: \`\${yuwonPosition.y + ${hitboxOffset.y}}\`px`}
                </code>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  <strong>Collision Detection Radius:</strong>
                </div>
                <code style={{
                  display: 'block',
                  background: '#fff',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: '#2196f3',
                  overflowX: 'auto'
                }}>
                  const characterSize = {hitboxSize};
                </code>
              </div>
            </div>

            {/* Presets */}
            <div style={{ marginTop: '25px' }}>
              <h4 style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Quick Presets:</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => { setHitboxOffset({ x: 0, y: 0 }); setHitboxSize(5); }}
                  style={{
                    padding: '8px 16px',
                    background: '#fff',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Center (0, 5px)
                </button>
                <button
                  onClick={() => { setHitboxOffset({ x: 0, y: 6 }); setHitboxSize(5); }}
                  style={{
                    padding: '8px 16px',
                    background: '#fff',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Current (6, 5px)
                </button>
                <button
                  onClick={() => { setHitboxOffset({ x: 0, y: 10 }); setHitboxSize(5); }}
                  style={{
                    padding: '8px 16px',
                    background: '#fff',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Feet (10, 5px)
                </button>
                <button
                  onClick={() => { setHitboxOffset({ x: 0, y: 15 }); setHitboxSize(3); }}
                  style={{
                    padding: '8px 16px',
                    background: '#fff',
                    border: '2px solid #ddd',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Tiny Feet (15, 3px)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YuwonHitboxMaker;
