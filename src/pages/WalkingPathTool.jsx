import { useState, useEffect } from 'react';
import './WalkingPathTool.css';

function WalkingPathTool() {
  const [waypoints, setWaypoints] = useState([]);
  const [characterName, setCharacterName] = useState('');
  const [routeType, setRouteType] = useState('patrol');
  const [showGrid, setShowGrid] = useState(true);
  const [collisionZones, setCollisionZones] = useState([]);
  const [showCollisionZones, setShowCollisionZones] = useState(true);

  // Room dimensions (same as actual game room)
  const ROOM_WIDTH = 608;
  const ROOM_HEIGHT = 352;

  // Load collision zones from JSON
  useEffect(() => {
    fetch('/data/yuwon-room-layout.json')
      .then(response => response.json())
      .then(data => {
        const zones = data.collisionZones.map(zone => ({
          name: zone.name,
          left: parseInt(zone.position.pixel.left),
          top: parseInt(zone.position.pixel.top),
          width: parseInt(zone.size.pixel.width),
          height: parseInt(zone.size.pixel.height)
        }));
        setCollisionZones(zones);
      })
      .catch(error => console.error('Error loading collision zones:', error));
  }, []);

  const handleRoomClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Determine direction based on previous waypoint
    let direction = 'down';
    if (waypoints.length > 0) {
      const prev = waypoints[waypoints.length - 1];
      const dx = x - prev.x;
      const dy = y - prev.y;

      if (Math.abs(dx) > Math.abs(dy)) {
        direction = dx > 0 ? 'right' : 'left';
      } else {
        direction = dy > 0 ? 'down' : 'up';
      }
    }

    const newWaypoint = {
      x,
      y,
      direction,
      pauseDuration: 0,
      action: 'walk'
    };

    setWaypoints([...waypoints, newWaypoint]);
  };

  const removeLastWaypoint = () => {
    setWaypoints(waypoints.slice(0, -1));
  };

  const clearAll = () => {
    setWaypoints([]);
  };

  const updateWaypoint = (index, field, value) => {
    const updated = [...waypoints];
    updated[index] = { ...updated[index], [field]: value };
    setWaypoints(updated);
  };

  const generateCode = () => {
    let suffix = '';
    if (routeType === 'going_home') suffix = 'GoingHome';
    else if (routeType === 'just_invited') suffix = 'JustInvited';

    const varName = `${characterName}${suffix}Route`;

    let code = `export const ${varName} = {\n`;
    code += `  character: '${characterName}',\n`;
    code += `  type: '${routeType}',\n`;
    code += `  waypoints: [\n`;

    waypoints.forEach((wp, i) => {
      code += `    { x: ${wp.x}, y: ${wp.y}, direction: '${wp.direction}', pauseDuration: ${wp.pauseDuration}, action: '${wp.action}' }`;
      if (i < waypoints.length - 1) code += ',';
      code += '\n';
    });

    code += `  ],\n`;
    code += `  startWaypointIndex: 0\n`;
    code += `};\n`;

    return code;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCode());
    alert('✅ Route code copied to clipboard!');
  };

  return (
    <div className="walking-path-tool">
      <div className="tool-header">
        <h1>🚶 Walking Path Tool</h1>
        <p>Click on the room to place waypoints. Design your character's walking route!</p>
      </div>

      <div className="tool-controls">
        <div className="control-group">
          <label>Character Name:</label>
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="e.g., noah, jaehyun"
          />
        </div>

        <div className="control-group">
          <label>Route Type:</label>
          <select value={routeType} onChange={(e) => setRouteType(e.target.value)}>
            <option value="patrol">Patrol (loops)</option>
            <option value="just_invited">Just Invited (one-way enter)</option>
            <option value="going_home">Going Home (one-way exit)</option>
            <option value="static">Static (stays in place)</option>
          </select>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
            />
            Show Grid
          </label>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showCollisionZones}
              onChange={(e) => setShowCollisionZones(e.target.checked)}
            />
            Show Collision Zones
          </label>
        </div>

        <div className="button-group">
          <button onClick={removeLastWaypoint} disabled={waypoints.length === 0}>
            ↶ Undo Last
          </button>
          <button onClick={clearAll} disabled={waypoints.length === 0}>
            🗑️ Clear All
          </button>
          <button onClick={copyToClipboard} disabled={waypoints.length === 0 || !characterName}>
            📋 Copy Code
          </button>
        </div>
      </div>

      <div className="tool-main">
        {/* Visual Room Canvas */}
        <div className="room-canvas-container">
          <h3>Click to Place Waypoints</h3>
          <div
            className={`room-canvas ${showGrid ? 'show-grid' : ''}`}
            onClick={handleRoomClick}
            style={{
              width: `${ROOM_WIDTH}px`,
              height: `${ROOM_HEIGHT}px`,
              position: 'relative',
              border: '4px solid #e91e63',
              cursor: 'crosshair',
              backgroundColor: '#000',
              imageRendering: 'pixelated'
            }}
          >
            {/* Room Background */}
            <img
              src="/images/game-rooms/room_bg.png"
              alt="Room Background"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />

            {/* Furniture Base Layer */}
            <img
              src="/images/game-rooms/furniture_base.png"
              alt="Furniture Base"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                zIndex: 50
              }}
            />

            {/* Furniture Tops Layer */}
            <img
              src="/images/game-rooms/furniture_tops.png"
              alt="Furniture Tops"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                pointerEvents: 'none',
                zIndex: 700,
                opacity: 0.7
              }}
            />

            {/* Collision Zones */}
            {showCollisionZones && collisionZones.map((zone, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `${zone.left}px`,
                  top: `${zone.top}px`,
                  width: `${zone.width}px`,
                  height: `${zone.height}px`,
                  backgroundColor: 'rgba(255, 0, 0, 0.3)',
                  border: '2px solid rgba(255, 0, 0, 0.6)',
                  pointerEvents: 'none',
                  zIndex: 750,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <span style={{
                  fontSize: '10px',
                  color: 'white',
                  fontWeight: 'bold',
                  textShadow: '0 0 3px black',
                  pointerEvents: 'none'
                }}>
                  {zone.name}
                </span>
              </div>
            ))}

            {/* Grid Overlay */}
            {showGrid && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg,
                    rgba(200, 200, 200, 0.3) 0px,
                    transparent 1px,
                    transparent 50px,
                    rgba(200, 200, 200, 0.3) 51px
                  ),
                  repeating-linear-gradient(
                    90deg,
                    rgba(200, 200, 200, 0.3) 0px,
                    transparent 1px,
                    transparent 50px,
                    rgba(200, 200, 200, 0.3) 51px
                  )
                `,
                backgroundSize: '50px 50px',
                pointerEvents: 'none',
                zIndex: 800
              }} />
            )}

            {/* Draw waypoints and paths */}
            {waypoints.map((wp, i) => (
              <div key={i}>
                {/* Draw line to previous waypoint */}
                {i > 0 && (
                  <svg
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 900
                    }}
                  >
                    <line
                      x1={waypoints[i - 1].x}
                      y1={waypoints[i - 1].y}
                      x2={wp.x}
                      y2={wp.y}
                      stroke="#4caf50"
                      strokeWidth="3"
                      strokeDasharray={wp.action === 'walk' ? '0' : '5,5'}
                    />
                  </svg>
                )}

                {/* Draw waypoint dot */}
                <div
                  className="waypoint-dot"
                  style={{
                    position: 'absolute',
                    left: `${wp.x}px`,
                    top: `${wp.y}px`,
                    transform: 'translate(-50%, -50%)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: wp.action === 'pause' ? '#ff9800' : '#4caf50',
                    border: '3px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    color: 'white',
                    zIndex: 1000
                  }}
                >
                  {i + 1}
                </div>

                {/* Direction arrow */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${wp.x}px`,
                    top: `${wp.y}px`,
                    transform: 'translate(-50%, -50%)',
                    fontSize: '16px',
                    pointerEvents: 'none',
                    zIndex: 1001,
                    textShadow: '0 0 3px white'
                  }}
                >
                  {wp.direction === 'up' && '⬆️'}
                  {wp.direction === 'down' && '⬇️'}
                  {wp.direction === 'left' && '⬅️'}
                  {wp.direction === 'right' && '➡️'}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            Room dimensions: {ROOM_WIDTH}x{ROOM_HEIGHT}px | Waypoints: {waypoints.length}
          </p>
        </div>

        {/* Waypoint Editor */}
        <div className="waypoint-editor">
          <h3>Waypoints</h3>
          {waypoints.length === 0 ? (
            <p style={{ color: '#999', fontStyle: 'italic' }}>
              Click on the room to add waypoints
            </p>
          ) : (
            <div className="waypoint-list">
              {waypoints.map((wp, i) => (
                <div key={i} className="waypoint-item">
                  <div className="waypoint-header">
                    <strong>#{i + 1}</strong>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      ({wp.x}, {wp.y})
                    </span>
                  </div>
                  <div className="waypoint-controls">
                    <div className="field">
                      <label>Direction:</label>
                      <select
                        value={wp.direction}
                        onChange={(e) => updateWaypoint(i, 'direction', e.target.value)}
                      >
                        <option value="up">⬆️ Up</option>
                        <option value="down">⬇️ Down</option>
                        <option value="left">⬅️ Left</option>
                        <option value="right">➡️ Right</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Action:</label>
                      <select
                        value={wp.action}
                        onChange={(e) => updateWaypoint(i, 'action', e.target.value)}
                      >
                        <option value="walk">🚶 Walk</option>
                        <option value="pause">⏸️ Pause</option>
                        <option value="idle">🧍 Idle</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Pause (frames @ 60fps):</label>
                      <input
                        type="number"
                        value={wp.pauseDuration}
                        onChange={(e) => updateWaypoint(i, 'pauseDuration', parseInt(e.target.value) || 0)}
                        min="0"
                        step="60"
                      />
                      <small>{Math.round(wp.pauseDuration / 60)}s</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Generated Code Preview */}
      {waypoints.length > 0 && characterName && (
        <div className="code-preview">
          <h3>Generated Code</h3>
          <pre>{generateCode()}</pre>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
            Click "Copy Code" to copy this to your clipboard, then paste it into characterRoutes.js
          </p>
        </div>
      )}
    </div>
  );
}

export default WalkingPathTool;
