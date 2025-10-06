import { useState, useEffect, useRef } from 'react';

function RoomTest() {
  const [yuwonPosition, setYuwonPosition] = useState({ x: 320, y: 180 }); // Center of room
  const [purchasedFurniture, setPurchasedFurniture] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState('down'); // 'up', 'down', 'left', 'right'
  const [collisionZones, setCollisionZones] = useState([]);
  const [roomData, setRoomData] = useState(null);
  const positionRef = useRef({ x: 320, y: 180 });
  const directionRef = useRef('down');
  const isWalkingRef = useRef(false);

  // Hitbox drawing mode
  const [drawMode, setDrawMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentZone, setCurrentZone] = useState(null);

  // Room dimensions
  const roomWidth = 640;
  const roomHeight = 360;

  // Load collision zones from JSON file
  useEffect(() => {
    fetch('/data/yuwon-room-layout.json')
      .then(response => response.json())
      .then(data => {
        setRoomData(data);
        // Convert JSON format to simple format for collision detection
        const zones = data.collisionZones.map(zone => ({
          name: zone.name,
          left: parseInt(zone.position.pixel.left),
          top: parseInt(zone.position.pixel.top),
          width: parseInt(zone.size.pixel.width),
          height: parseInt(zone.size.pixel.height)
        }));
        setCollisionZones(zones);
      })
      .catch(error => {
        console.error('Failed to load collision zones:', error);
        // Fallback to hardcoded zones
        setCollisionZones([
          { name: 'bed', left: 50, top: 80, width: 180, height: 120 },
          { name: 'desk', left: 450, top: 200, width: 150, height: 100 },
          { name: 'shelf', left: 400, top: 50, width: 100, height: 80 }
        ]);
      });
  }, []);

  // WASD keyboard controls - continuous movement
  useEffect(() => {
    const keysPressed = {};
    let animationFrameId;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 's', 'a', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        keysPressed[key] = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      delete keysPressed[key];
    };

    const updatePosition = () => {
      const speed = 1.08; // pixels per frame (reduced by 40% from 1.8)
      let newX = positionRef.current.x;
      let newY = positionRef.current.y;
      let newDirection = directionRef.current;
      let moved = false;

      if (keysPressed['w'] || keysPressed['arrowup']) {
        newY -= speed;
        newDirection = 'up'; // walking away (back view)
        moved = true;
      }
      if (keysPressed['s'] || keysPressed['arrowdown']) {
        newY += speed;
        newDirection = 'down'; // walking towards (front view)
        moved = true;
      }
      if (keysPressed['a'] || keysPressed['arrowleft']) {
        newX -= speed;
        newDirection = 'left';
        moved = true;
      }
      if (keysPressed['d'] || keysPressed['arrowright']) {
        newX += speed;
        newDirection = 'right';
        moved = true;
      }

      if (moved) {
        // Keep within room bounds
        newX = Math.max(30, Math.min(roomWidth - 30, newX));
        newY = Math.max(30, Math.min(roomHeight - 30, newY));

        // Check for collision
        if (!checkCollision(newX, newY)) {
          positionRef.current = { x: newX, y: newY };
          directionRef.current = newDirection;
          isWalkingRef.current = true;
          setYuwonPosition({ x: newX, y: newY });
          setDirection(newDirection);
          setIsWalking(true);
        }
      } else {
        isWalkingRef.current = false;
        setIsWalking(false);
      }

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [collisionZones, purchasedFurniture, roomWidth, roomHeight]);

  // Check if a position collides with any furniture
  const checkCollision = (x, y) => {
    if (!purchasedFurniture) return false; // No collision if no furniture

    const characterSize = 7; // Hitbox radius
    const spriteHeight = 60;
    const yOffset = 10; // Center offset
    const feetY = y + yOffset + (spriteHeight / 2); // Actual feet position (center + half height)

    for (const zone of collisionZones) {
      if (
        x + characterSize > zone.left &&
        x - characterSize < zone.left + zone.width &&
        feetY + characterSize > zone.top &&
        feetY - characterSize < zone.top + zone.height
      ) {
        return true; // Collision detected
      }
    }
    return false;
  };

  // Removed click teleport - WASD only movement

  const buyAllFurniture = () => {
    setPurchasedFurniture(true);
  };

  // Hitbox drawing handlers
  const handleMouseDown = (e) => {
    if (!drawMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentZone({ startX: x, startY: y, endX: x, endY: y });
  };

  const handleMouseMove = (e) => {
    if (!drawMode || !isDrawing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentZone(prev => ({ ...prev, endX: x, endY: y }));
  };

  const handleMouseUp = () => {
    if (!drawMode || !isDrawing || !currentZone) return;

    const left = Math.min(currentZone.startX, currentZone.endX);
    const top = Math.min(currentZone.startY, currentZone.endY);
    const width = Math.abs(currentZone.endX - currentZone.startX);
    const height = Math.abs(currentZone.endY - currentZone.startY);

    if (width > 5 && height > 5) {
      const newZone = {
        name: `Zone ${collisionZones.length + 1}`,
        position: {
          pixel: { left: String(Math.round(left)), top: String(Math.round(top)) },
          percent: { left: ((left / roomWidth) * 100).toFixed(2), top: ((top / roomHeight) * 100).toFixed(2) }
        },
        size: {
          pixel: { width: String(Math.round(width)), height: String(Math.round(height)) },
          percent: { width: ((width / roomWidth) * 100).toFixed(2), height: ((height / roomHeight) * 100).toFixed(2) }
        }
      };

      setCollisionZones([...collisionZones, {
        name: newZone.name,
        left: Math.round(left),
        top: Math.round(top),
        width: Math.round(width),
        height: Math.round(height),
        leftPercent: newZone.position.percent.left,
        topPercent: newZone.position.percent.top,
        widthPercent: newZone.size.percent.width,
        heightPercent: newZone.size.percent.height
      }]);
    }

    setIsDrawing(false);
    setCurrentZone(null);
  };

  const exportHitboxes = () => {
    const data = {
      roomDimensions: { width: roomWidth, height: roomHeight },
      decorations: [],
      collisionZones: collisionZones.map(zone => ({
        name: zone.name,
        position: {
          pixel: { left: String(zone.left), top: String(zone.top) },
          percent: { left: zone.leftPercent, top: zone.topPercent }
        },
        size: {
          pixel: { width: String(zone.width), height: String(zone.height) },
          percent: { width: zone.widthPercent, height: zone.heightPercent }
        }
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yuwon-room-layout.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllZones = () => {
    setCollisionZones([]);
  };

  const getZoneRect = (zone) => {
    if (!zone) return null;
    const left = Math.min(zone.startX, zone.endX);
    const top = Math.min(zone.startY, zone.endY);
    const width = Math.abs(zone.endX - zone.startX);
    const height = Math.abs(zone.endY - zone.startY);
    return { left, top, width, height };
  };

  return (
    <div style={{ padding: '20px 20px 120px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#e91e63', marginBottom: '10px' }}>🧪 Room Decoration Test - Yuwon's Room</h1>
      <p style={{ color: '#666', marginBottom: '10px', fontSize: '14px' }}>
        Use <strong>WASD/Arrow Keys</strong> to walk around and test collision detection!
      </p>
      <div style={{
        background: '#e3f2fd',
        padding: '10px 15px',
        borderRadius: '8px',
        marginBottom: '20px',
        fontSize: '13px',
        color: '#1565c0',
        border: '2px solid #1976d2'
      }}>
        <strong>⌨️ Controls:</strong> W/↑ = Up | S/↓ = Down | A/← = Left | D/→ = Right | Continuous smooth movement
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {!purchasedFurniture && (
          <button
            onClick={buyAllFurniture}
            style={{
              background: '#4caf50',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.3)'
            }}
          >
            🛒 Buy All Sample Furniture
          </button>
        )}
        <button
          onClick={() => setDrawMode(!drawMode)}
          style={{
            background: drawMode ? '#f44336' : '#ff9800',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: `0 2px 8px ${drawMode ? 'rgba(244, 67, 54, 0.3)' : 'rgba(255, 152, 0, 0.3)'}`
          }}
        >
          {drawMode ? '✓ Drawing Mode ON' : '📦 Draw Hitboxes'}
        </button>
        {collisionZones.length > 0 && (
          <>
            <button
              onClick={exportHitboxes}
              style={{
                background: '#2196f3',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)'
              }}
            >
              💾 Export Hitboxes ({collisionZones.length})
            </button>
            <button
              onClick={clearAllZones}
              style={{
                background: '#757575',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(117, 117, 117, 0.3)'
              }}
            >
              🗑️ Clear All
            </button>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Room */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{
            width: `${roomWidth}px`,
            height: `${roomHeight}px`,
            background: '#f5f5f5',
            border: '3px solid #e91e63',
            borderRadius: '12px',
            position: 'relative',
            cursor: drawMode ? 'crosshair' : 'default',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Room Background */}
          <img
            src="/images/game-rooms/room_bg.png"
            alt="Room background"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${roomWidth}px`,
              height: `${roomHeight}px`,
              objectFit: 'fill',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          {/* Yuwon - Below furniture layer */}
          <img
            key={`${direction}-${isWalking}`}
            src={
              isWalking
                ? direction === 'down'
                  ? "/images/yuwon_walk_front.gif"
                  : direction === 'up'
                  ? "/images/yuwon_walk_back.gif"
                  : "/images/yuwon_walk_side.gif"
                : "/images/idle_yuwon_outfit1.gif"
            }
            alt="Yuwon"
            style={{
              position: 'absolute',
              left: `${yuwonPosition.x}px`,
              top: `${yuwonPosition.y + 10}px`,
              transform: `translate(-50%, -50%) ${direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'} ${(direction === 'down' || direction === 'up') && isWalking ? 'scale(1.20)' : 'scale(1.05)'}`,
              width: 'auto',
              height: '60px',
              objectFit: 'contain',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
              zIndex: 15, // Temporarily above furniture to test hitbox (change back to 5 for behind furniture)
              filter: isWalking ? 'drop-shadow(0 4px 8px rgba(233, 30, 99, 0.5))' : 'none'
            }}
          />

          {/* DEBUG: Show Yuwon's actual collision point */}
          <div
            style={{
              position: 'absolute',
              left: `${yuwonPosition.x}px`,
              top: `${yuwonPosition.y + 10 + 30}px`,
              width: '14px',
              height: '14px',
              background: 'rgba(0, 255, 0, 0.8)',
              border: '2px solid lime',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 20
            }}
          />

          {/* Collision Zones Debug Overlay (optional - shows collision areas) */}
          {purchasedFurniture && collisionZones.map((zone, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${zone.left}px`,
                top: `${zone.top}px`,
                width: `${zone.width}px`,
                height: `${zone.height}px`,
                border: '2px dashed rgba(255, 0, 0, 0.3)',
                background: 'rgba(255, 0, 0, 0.1)',
                pointerEvents: 'none',
                zIndex: 15
              }}
            >
              <div style={{
                fontSize: '10px',
                color: '#f44336',
                background: 'rgba(255,255,255,0.8)',
                padding: '2px 4px',
                borderRadius: '3px',
                position: 'absolute',
                top: '-20px'
              }}>
                {zone.name}
              </div>
            </div>
          ))}

          {/* Furniture Layer */}
          <img
            src="/images/game-rooms/Furnitures.png"
            alt="Furniture"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${roomWidth}px`,
              height: `${roomHeight}px`,
              objectFit: 'fill',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
              zIndex: 10,
              display: purchasedFurniture ? 'block' : 'none'
            }}
          />

          {/* Current drawing zone */}
          {currentZone && (() => {
            const rect = getZoneRect(currentZone);
            if (!rect) return null;
            return (
              <div
                style={{
                  position: 'absolute',
                  left: `${rect.left}px`,
                  top: `${rect.top}px`,
                  width: `${rect.width}px`,
                  height: `${rect.height}px`,
                  background: 'rgba(255, 152, 0, 0.3)',
                  border: '2px dashed #ff9800',
                  zIndex: 100,
                  pointerEvents: 'none'
                }}
              />
            );
          })()}

          {/* Position indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              zIndex: 100,
              pointerEvents: 'none'
            }}
          >
            Yuwon: ({yuwonPosition.x.toFixed(0)}, {yuwonPosition.y.toFixed(0)})
          </div>
        </div>

        {/* Info Panel */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              background: '#fff',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #e0e0e0'
            }}
          >
            <h3 style={{ color: '#e91e63', marginTop: 0 }}>📋 Test Info</h3>

            <div style={{ marginBottom: '15px' }}>
              <strong>Room Dimensions:</strong> {roomWidth} × {roomHeight}px
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Yuwon Position:</strong><br />
              X: {yuwonPosition.x.toFixed(0)}px, Y: {yuwonPosition.y.toFixed(0)}px
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Furniture Status:</strong><br />
              {purchasedFurniture ? '✅ Purchased (visible)' : '❌ Not purchased'}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Walking Status:</strong><br />
              {isWalking ? '🚶 Walking...' : '🧍 Standing'}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <strong>Collision Zones:</strong><br />
              {collisionZones.length === 0 ? '⏳ Loading...' : purchasedFurniture ? `✅ ${collisionZones.length} zones active (from JSON)` : `📄 ${collisionZones.length} zones loaded (inactive)`}
            </div>

            <div style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '8px',
              marginTop: '20px'
            }}>
              <h4 style={{ marginTop: 0, color: '#666' }}>✨ Features:</h4>
              <ul style={{ fontSize: '13px', lineHeight: '1.8', paddingLeft: '20px', marginBottom: 0 }}>
                <li><strong>WASD/Arrow Keys</strong> - Walk around (20px/step)</li>
                <li><strong>Click to move</strong> - Instant teleport</li>
                <li>Smooth walking animation (0.3s)</li>
                <li>Collision detection (can't walk on furniture)</li>
                <li>Boundary detection (stays within room)</li>
                <li>Pink glow while walking</li>
                <li>Red zones show collision areas</li>
                <li>Yuwon walks <strong>behind</strong> furniture (z-index layering)</li>
              </ul>
            </div>

            {purchasedFurniture && (
              <button
                onClick={() => setPurchasedFurniture(false)}
                style={{
                  width: '100%',
                  marginTop: '15px',
                  background: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600'
                }}
              >
                🗑️ Remove Furniture (Reset)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomTest;
