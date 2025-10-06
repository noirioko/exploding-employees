import { useState, useRef, useEffect } from 'react';

function RoomDecorHelper() {
  const [clickedPosition, setClickedPosition] = useState(null);
  const [savedPositions, setSavedPositions] = useState([]);
  const [decorName, setDecorName] = useState('');
  const [decorSize, setDecorSize] = useState({ width: 50, height: 50 });

  // Background image - Yuwon's room hardcoded
  const [bgImage, setBgImage] = useState('/images/game-rooms/room_bg.png');
  const [furnitureLayer, setFurnitureLayer] = useState('/images/game-rooms/Furnitures.png');
  const fileInputRef = useRef(null);

  // Collision zones
  const [collisionZones, setCollisionZones] = useState([]);
  const [isDrawingZone, setIsDrawingZone] = useState(false);
  const [currentZone, setCurrentZone] = useState(null);
  const [zoneName, setZoneName] = useState('');
  const [zoneType, setZoneType] = useState('wall'); // 'hitbox', 'wall', or 'wallzone'

  // Furniture placement
  const [placedFurniture, setPlacedFurniture] = useState([]);
  const [draggingFurniture, setDraggingFurniture] = useState(null);
  const [draggingPlacedFurniture, setDraggingPlacedFurniture] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState('furniture'); // 'furniture', 'zones', or 'test'
  const [showFurnitureOverlay, setShowFurnitureOverlay] = useState(true);
  const [furnitureImageSizes, setFurnitureImageSizes] = useState({});

  // Yuwon test mode
  const [showYuwon, setShowYuwon] = useState(false);
  const [yuwonPosition, setYuwonPosition] = useState({ x: 320, y: 180 });
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState('down');
  const positionRef = useRef({ x: 320, y: 180 });
  const directionRef = useRef('down');
  const isWalkingRef = useRef(false);

  // Room dimensions - matching Yuwon's room from Vanity page
  const roomWidth = 640;
  const roomHeight = 360;

  // Furniture library - sizes will be loaded from actual images
  const furnitureLibrary = [
    { id: 'bed', name: 'Bed', image: '/images/game-rooms/Bed.png' },
    { id: 'sofa', name: 'Sofa', image: '/images/game-rooms/Sofa.png' },
    { id: 'fridge', name: 'Fridge', image: '/images/game-rooms/Fridge.png' },
    { id: 'tv_table', name: 'TV Table', image: '/images/game-rooms/TV Table.png' },
    { id: 'computer_desk', name: 'Computer Desk', image: '/images/game-rooms/Computer Desk.png' },
    { id: 'kitchen_counter_empty', name: 'Kitchen Counter (Empty)', image: '/images/game-rooms/Kitchen Counter_Empty.png' },
    { id: 'kitchen_counter_decorated', name: 'Kitchen Counter (Decorated)', image: '/images/game-rooms/Kitchen Counter_Decorated.png' },
    { id: 'kitchen_island_empty', name: 'Kitchen Island (Empty)', image: '/images/game-rooms/Kitchen Island_Empty.png' },
    { id: 'kitchen_island_decorated', name: 'Kitchen Island (Decorated)', image: '/images/game-rooms/Kitchen Island_Decorated.png' },
    { id: 'kitchen_upper_shelves', name: 'Kitchen Upper Shelves', image: '/images/game-rooms/Kitchen Upper Shelves.png' },
    { id: 'tv_shelf_empty', name: 'TV Shelf (Empty)', image: '/images/game-rooms/TV Shelf_Empty.png' },
    { id: 'tv_shelf_decorated', name: 'TV Shelf (Decorated)', image: '/images/game-rooms/TV Shelf_Decorated.png' },
    { id: 'cabinet_1_empty', name: 'Cabinet 1 (Empty)', image: '/images/game-rooms/Cabinet_1_Empty.png' },
    { id: 'cabinet_1_decorated', name: 'Cabinet 1 (Decorated)', image: '/images/game-rooms/Cabinet_1_Decorated.png' },
    { id: 'cabinet_2', name: 'Cabinet 2', image: '/images/game-rooms/Cabinet_2.png' },
    { id: 'bookshelve_empty', name: 'Bookshelve (Empty)', image: '/images/game-rooms/Bookshelve_Empty.png' },
    { id: 'bookshelve_decorated', name: 'Bookshelve (Decorated)', image: '/images/game-rooms/Bookshelve_Decorated.png' },
    { id: 'wall_shelf_empty', name: 'Wall Shelf (Empty)', image: '/images/game-rooms/Wall Shelf_Empty.png' },
    { id: 'wall_shelf_decorated', name: 'Wall Shelf (Decorated)', image: '/images/game-rooms/Wall Shelf_Decorated.png' },
    { id: 'carpet_1', name: 'Carpet 1', image: '/images/game-rooms/Carpet_1.png' },
    { id: 'carpet_2', name: 'Carpet 2', image: '/images/game-rooms/Carpet_2.png' },
    { id: 'carpet_3', name: 'Carpet 3', image: '/images/game-rooms/Carpet_3.png' },
    { id: 'carpet_4', name: 'Carpet 4', image: '/images/game-rooms/Carpet_4.png' },
    { id: 'painting_1', name: 'Painting 1', image: '/images/game-rooms/Painting_1.png' },
    { id: 'painting_2', name: 'Painting 2', image: '/images/game-rooms/Painting_2.png' },
    { id: 'painting_3', name: 'Painting 3', image: '/images/game-rooms/Painting_3.png' },
  ];

  // Load actual image dimensions
  useEffect(() => {
    const loadImageSizes = async () => {
      const sizes = {};
      for (const furniture of furnitureLibrary) {
        const img = new Image();
        img.src = furniture.image;
        await new Promise((resolve) => {
          img.onload = () => {
            sizes[furniture.id] = { width: img.naturalWidth, height: img.naturalHeight };
            resolve();
          };
          img.onerror = () => {
            sizes[furniture.id] = { width: 100, height: 100 }; // fallback
            resolve();
          };
        });
      }
      setFurnitureImageSizes(sizes);
    };
    loadImageSizes();
  }, []);

  // WASD keyboard controls for Yuwon
  useEffect(() => {
    if (mode !== 'test') return;

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

    const checkCollision = (x, y) => {
      const characterSize = 5;
      for (const zone of collisionZones) {
        // Only check collision for zones that block movement (wall and hitbox)
        // Wall decoration zones (wallzone) don't block movement
        if (zone.type === 'wallzone') continue;

        if (
          x + characterSize > zone.left &&
          x - characterSize < zone.left + zone.width &&
          y + characterSize > zone.top &&
          y - characterSize < zone.top + zone.height
        ) {
          return true;
        }
      }
      return false;
    };

    const updatePosition = () => {
      const speed = 1.08;
      let newX = positionRef.current.x;
      let newY = positionRef.current.y;
      let newDirection = directionRef.current;
      let moved = false;

      if (keysPressed['w'] || keysPressed['arrowup']) {
        newY -= speed;
        newDirection = 'up';
        moved = true;
      }
      if (keysPressed['s'] || keysPressed['arrowdown']) {
        newY += speed;
        newDirection = 'down';
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
        newX = Math.max(30, Math.min(roomWidth - 30, newX));
        newY = Math.max(30, Math.min(roomHeight - 30, newY));

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
  }, [mode, collisionZones, roomWidth, roomHeight]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBgImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoomClick = (e) => {
    if (isDrawingZone) return; // Don't add decorations while drawing zones

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentage positions (more flexible for different screen sizes)
    const xPercent = ((x / roomWidth) * 100).toFixed(2);
    const yPercent = ((y / roomHeight) * 100).toFixed(2);

    setClickedPosition({
      x: x.toFixed(0),
      y: y.toFixed(0),
      xPercent,
      yPercent
    });
  };

  const handleZoneMouseDown = (e) => {
    if (!isDrawingZone) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentZone({
      startX: x,
      startY: y,
      endX: x,
      endY: y
    });
  };

  const handleZoneMouseMove = (e) => {
    if (!isDrawingZone || !currentZone) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentZone({
      ...currentZone,
      endX: x,
      endY: y
    });
  };

  const handleZoneMouseUp = () => {
    if (!isDrawingZone || !currentZone) return;

    // Calculate zone dimensions
    const left = Math.min(currentZone.startX, currentZone.endX);
    const top = Math.min(currentZone.startY, currentZone.endY);
    const width = Math.abs(currentZone.endX - currentZone.startX);
    const height = Math.abs(currentZone.endY - currentZone.startY);

    if (width > 5 && height > 5) { // Minimum size
      const newZone = {
        id: Date.now(),
        name: zoneName || `${zoneType === 'wall' ? 'Wall' : 'Zone'} ${collisionZones.length + 1}`,
        type: zoneType,
        left: left.toFixed(0),
        top: top.toFixed(0),
        width: width.toFixed(0),
        height: height.toFixed(0),
        leftPercent: ((left / roomWidth) * 100).toFixed(2),
        topPercent: ((top / roomHeight) * 100).toFixed(2),
        widthPercent: ((width / roomWidth) * 100).toFixed(2),
        heightPercent: ((height / roomHeight) * 100).toFixed(2)
      };
      setCollisionZones([...collisionZones, newZone]);
    }

    // Reset current zone but KEEP drawing mode active for continuous drawing
    setCurrentZone(null);
    // Don't reset isDrawingZone - let user draw multiple zones
    // Don't reset zoneName - keep the same name for multiple zones
  };

  const savePosition = () => {
    if (clickedPosition && decorName.trim()) {
      setSavedPositions([...savedPositions, {
        name: decorName,
        ...clickedPosition,
        width: decorSize.width,
        height: decorSize.height,
        id: Date.now()
      }]);
      setDecorName('');
      setClickedPosition(null);
    }
  };

  const deletePosition = (id) => {
    setSavedPositions(savedPositions.filter(p => p.id !== id));
  };

  const deleteZone = (id) => {
    setCollisionZones(collisionZones.filter(z => z.id !== id));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const getZoneRect = (zone) => {
    if (!zone) return null;
    const left = Math.min(zone.startX, zone.endX);
    const top = Math.min(zone.startY, zone.endY);
    const width = Math.abs(zone.endX - zone.startX);
    const height = Math.abs(zone.endY - zone.startY);
    return { left, top, width, height };
  };

  // Furniture drag and drop handlers
  const handleFurnitureDragStart = (e, furniture) => {
    setDraggingFurniture(furniture);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleRoomDrop = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Dropping new furniture from library
    if (draggingFurniture) {
      const imageSize = furnitureImageSizes[draggingFurniture.id] || { width: 100, height: 100 };

      const newFurniture = {
        id: `${draggingFurniture.id}-${Date.now()}`,
        furnitureId: draggingFurniture.id,
        name: draggingFurniture.name,
        image: draggingFurniture.image,
        x: Math.max(0, Math.min(roomWidth - imageSize.width, x)),
        y: Math.max(0, Math.min(roomHeight - imageSize.height, y)),
        width: imageSize.width,
        height: imageSize.height,
        xPercent: ((x / roomWidth) * 100).toFixed(2),
        yPercent: ((y / roomHeight) * 100).toFixed(2)
      };

      setPlacedFurniture([...placedFurniture, newFurniture]);
      setDraggingFurniture(null);
    }
    // Dropping already-placed furniture (repositioning)
    else if (draggingPlacedFurniture) {
      const newX = Math.max(0, Math.min(roomWidth - draggingPlacedFurniture.width, x - dragOffset.x));
      const newY = Math.max(0, Math.min(roomHeight - draggingPlacedFurniture.height, y - dragOffset.y));

      // Update furniture position
      setPlacedFurniture(placedFurniture.map(f =>
        f.id === draggingPlacedFurniture.id
          ? {
              ...f,
              x: newX,
              y: newY,
              xPercent: ((newX / roomWidth) * 100).toFixed(2),
              yPercent: ((newY / roomHeight) * 100).toFixed(2)
            }
          : f
      ));

      // Update associated collision zone if it exists
      const associatedZoneName = `${draggingPlacedFurniture.name} Hitbox`;
      const shrinkPixels = 2;
      const zoneLeft = newX + shrinkPixels;
      const zoneTop = newY + shrinkPixels;
      const zoneWidth = draggingPlacedFurniture.width - (shrinkPixels * 2);
      const zoneHeight = draggingPlacedFurniture.height - (shrinkPixels * 2);

      setCollisionZones(collisionZones.map(zone =>
        zone.name === associatedZoneName
          ? {
              ...zone,
              startX: zoneLeft,
              startY: zoneTop,
              endX: zoneLeft + zoneWidth,
              endY: zoneTop + zoneHeight,
              left: Math.round(zoneLeft),
              top: Math.round(zoneTop),
              width: Math.round(zoneWidth),
              height: Math.round(zoneHeight),
              leftPercent: ((zoneLeft / roomWidth) * 100).toFixed(2),
              topPercent: ((zoneTop / roomHeight) * 100).toFixed(2),
              widthPercent: ((zoneWidth / roomWidth) * 100).toFixed(2),
              heightPercent: ((zoneHeight / roomHeight) * 100).toFixed(2)
            }
          : zone
      ));

      setDraggingPlacedFurniture(null);
    }
  };

  const handleRoomDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = draggingFurniture ? 'copy' : 'move';
  };

  const handlePlacedFurnitureDragStart = (e, furniture) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setDraggingPlacedFurniture(furniture);
    setDragOffset({ x: offsetX, y: offsetY });
    e.dataTransfer.effectAllowed = 'move';
  };

  const removeFurniture = (id) => {
    setPlacedFurniture(placedFurniture.filter(f => f.id !== id));
  };

  const autoAssignCollisionZone = (furniture) => {
    // Shrink the collision zone by 2 pixels on all sides
    const shrinkPixels = 2;

    const zoneLeft = furniture.x + shrinkPixels;
    const zoneTop = furniture.y + shrinkPixels;
    const zoneWidth = furniture.width - (shrinkPixels * 2);
    const zoneHeight = furniture.height - (shrinkPixels * 2);

    const newZone = {
      id: Date.now(),
      name: `${furniture.name} Hitbox`,
      type: 'hitbox',
      startX: zoneLeft,
      startY: zoneTop,
      endX: zoneLeft + zoneWidth,
      endY: zoneTop + zoneHeight,
      left: Math.round(zoneLeft),
      top: Math.round(zoneTop),
      width: Math.round(zoneWidth),
      height: Math.round(zoneHeight),
      leftPercent: ((zoneLeft / roomWidth) * 100).toFixed(2),
      topPercent: ((zoneTop / roomHeight) * 100).toFixed(2),
      widthPercent: ((zoneWidth / roomWidth) * 100).toFixed(2),
      heightPercent: ((zoneHeight / roomHeight) * 100).toFixed(2)
    };
    setCollisionZones([...collisionZones, newZone]);
  };

  const exportToJSON = (exportType = 'all') => {
    let data;
    let filename;

    if (exportType === 'walls') {
      // Export only wall/room boundary zones
      data = {
        roomDimensions: {
          width: roomWidth,
          height: roomHeight
        },
        collisionZones: collisionZones
          .filter(zone => zone.type === 'wall')
          .map(zone => ({
            name: zone.name,
            type: zone.type || 'wall',
            position: {
              pixel: { left: Math.round(zone.left), top: Math.round(zone.top) },
              percent: { left: zone.leftPercent, top: zone.topPercent }
            },
            size: {
              pixel: { width: Math.round(zone.width), height: Math.round(zone.height) },
              percent: { width: zone.widthPercent, height: zone.heightPercent }
            }
          }))
      };
      filename = 'yuwon-room-wallcollision.json';
    } else {
      // Export all data (furniture and zones)
      data = {
        roomDimensions: {
          width: roomWidth,
          height: roomHeight
        },
        furniture: placedFurniture.map(f => ({
          id: f.furnitureId,
          name: f.name,
          image: f.image,
          position: {
            pixel: { left: Math.round(f.x), top: Math.round(f.y) },
            percent: { left: f.xPercent, top: f.yPercent }
          },
          size: { width: f.width, height: f.height }
        })),
        decorations: savedPositions.map(pos => ({
          name: pos.name,
          position: {
            pixel: { left: pos.x, top: pos.y },
            percent: { left: pos.xPercent, top: pos.yPercent }
          },
          size: { width: pos.width, height: pos.height }
        })),
        collisionZones: collisionZones.map(zone => ({
          name: zone.name,
          type: zone.type || 'hitbox',
          position: {
            pixel: { left: Math.round(zone.left), top: Math.round(zone.top) },
            percent: { left: zone.leftPercent, top: zone.topPercent }
          },
          size: {
            pixel: { width: Math.round(zone.width), height: Math.round(zone.height) },
            percent: { width: zone.widthPercent, height: zone.heightPercent }
          }
        }))
      };
      filename = 'yuwon-room-layout.json';
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveForTesting = () => {
    // Save to the public/data folder path for testing
    const data = {
      roomDimensions: {
        width: roomWidth,
        height: roomHeight
      },
      decorations: [],
      collisionZones: collisionZones.map(zone => ({
        name: zone.name,
        type: zone.type || 'hitbox',
        position: {
          pixel: { left: String(Math.round(zone.left)), top: String(Math.round(zone.top)) },
          percent: { left: zone.leftPercent, top: zone.topPercent }
        },
        size: {
          pixel: { width: String(Math.round(zone.width)), height: String(Math.round(zone.height)) },
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

    alert('💾 Saved! Copy this file to /public/data/yuwon-room-layout.json to test with Yuwon');
  };

  return (
    <div style={{ padding: '20px 20px 120px 20px', maxWidth: '1600px', margin: '0 auto' }}>
      <h1 style={{ color: '#e91e63', marginBottom: '10px' }}>🎨 Room Decoration Helper - Yuwon's Room (640×360)</h1>
      <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
        Drag furniture from the library to place them, then draw collision zones or auto-assign them!
      </p>

      {/* Mode Toggle */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button
          onClick={() => setMode('furniture')}
          style={{
            padding: '10px 20px',
            background: mode === 'furniture' ? '#e91e63' : '#fff',
            color: mode === 'furniture' ? '#fff' : '#666',
            border: '2px solid #e91e63',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          🪑 Place Furniture
        </button>
        <button
          onClick={() => setMode('zones')}
          style={{
            padding: '10px 20px',
            background: mode === 'zones' ? '#e91e63' : '#fff',
            color: mode === 'zones' ? '#fff' : '#666',
            border: '2px solid #e91e63',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          ⬜ Draw Collision Zones
        </button>
        <button
          onClick={() => setMode('test')}
          style={{
            padding: '10px 20px',
            background: mode === 'test' ? '#ff9800' : '#fff',
            color: mode === 'test' ? '#fff' : '#666',
            border: '2px solid #ff9800',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          🚶 Test with Yuwon (WASD)
        </button>
        {mode === 'furniture' && (
          <button
            onClick={() => setShowFurnitureOverlay(!showFurnitureOverlay)}
            style={{
              padding: '10px 20px',
              background: showFurnitureOverlay ? '#4caf50' : '#fff',
              color: showFurnitureOverlay ? '#fff' : '#666',
              border: '2px solid #4caf50',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              marginLeft: 'auto'
            }}
          >
            {showFurnitureOverlay ? '👁️ Hide' : '👁️ Show'} Furniture Overlay
          </button>
        )}
      </div>

      {/* Zone Type Selector - Only show in zones mode */}
      {mode === 'zones' && (
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          background: '#f9f9f9',
          borderRadius: '8px',
          border: '2px solid #e0e0e0'
        }}>
          <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
            🎯 Zone Type:
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 15px',
              background: zoneType === 'wall' ? '#e3f2fd' : '#fff',
              border: `2px solid ${zoneType === 'wall' ? '#2196f3' : '#ddd'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}>
              <input
                type="radio"
                name="zoneType"
                value="wall"
                checked={zoneType === 'wall'}
                onChange={(e) => setZoneType(e.target.value)}
                style={{ cursor: 'pointer' }}
              />
              🧱 Wall Collision (Blue)
            </label>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 15px',
              background: zoneType === 'wallzone' ? '#e8f5e9' : '#fff',
              border: `2px solid ${zoneType === 'wallzone' ? '#4caf50' : '#ddd'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}>
              <input
                type="radio"
                name="zoneType"
                value="wallzone"
                checked={zoneType === 'wallzone'}
                onChange={(e) => setZoneType(e.target.value)}
                style={{ cursor: 'pointer' }}
              />
              🖼️ Wall Decoration Zone (Green)
            </label>
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px', marginBottom: 0 }}>
            💡 Wall Collision = Blocks Yuwon | Wall Decoration Zone = Paintings/shelves can be placed here (no collision)
          </p>
        </div>
      )}

      {/* Hitbox Mode - Only show in furniture mode */}
      {mode === 'furniture' && (
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          background: '#fff9e6',
          borderRadius: '8px',
          border: '2px solid #ffd93d'
        }}>
          <div style={{ marginBottom: '10px', fontSize: '14px', fontWeight: '600', color: '#333' }}>
            📦 Furniture Hitbox Maker
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
            Click "Auto Hitbox" on placed furniture to generate collision zones (2px smaller on all sides)
          </p>
          <div style={{ fontSize: '11px', color: '#999' }}>
            ✨ Hitboxes automatically follow furniture when repositioned
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '200px 640px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* LEFT: Furniture Library */}
        {mode === 'furniture' && (
          <div style={{
            background: '#fff',
            padding: '15px',
            borderRadius: '12px',
            border: '2px solid #e0e0e0',
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#e91e63' }}>Furniture Library</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {furnitureLibrary.map(furniture => (
                <div
                  key={furniture.id}
                  draggable
                  onDragStart={(e) => handleFurnitureDragStart(e, furniture)}
                  style={{
                    padding: '8px',
                    background: '#f9f9f9',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'grab',
                    fontSize: '12px',
                    fontWeight: '500',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#e91e63'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
                >
                  <img src={furniture.image} alt={furniture.name} style={{ width: '100%', height: 'auto', marginBottom: '5px', imageRendering: 'pixelated' }} />
                  {furniture.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MIDDLE: Room Preview */}
        <div style={{ gridColumn: mode === 'furniture' ? '2' : '1 / span 2' }}>
          <div
            onClick={mode === 'zones' ? handleRoomClick : undefined}
            onMouseDown={mode === 'zones' ? handleZoneMouseDown : undefined}
            onMouseMove={mode === 'zones' ? handleZoneMouseMove : undefined}
            onMouseUp={mode === 'zones' ? handleZoneMouseUp : undefined}
            onDrop={mode === 'furniture' ? handleRoomDrop : undefined}
            onDragOver={mode === 'furniture' ? handleRoomDragOver : undefined}
            style={{
              width: `${roomWidth}px`,
              height: `${roomHeight}px`,
              background: '#f5f5f5',
              border: '3px solid #e91e63',
              borderRadius: '12px',
              position: 'relative',
              cursor: mode === 'zones' ? 'crosshair' : mode === 'furniture' ? 'default' : 'default',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              userSelect: 'none',
              overflow: 'hidden'
            }}
          >
            {/* Grid lines */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`v-${i}`}
                style={{
                  position: 'absolute',
                  left: `${(i + 1) * 10}%`,
                  top: 0,
                  bottom: 0,
                  width: '1px',
                  background: '#ddd',
                  opacity: 0.5
                }}
              />
            ))}
            {[...Array(5)].map((_, i) => (
              <div
                key={`h-${i}`}
                style={{
                  position: 'absolute',
                  top: `${(i + 1) * 10}%`,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: '#ddd',
                  opacity: 0.5
                }}
              />
            ))}

            {/* Room background */}
            {bgImage && (
              <img
                src={bgImage}
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
            )}

            {/* Furniture Overlay (from Furnitures.png) */}
            {mode === 'furniture' && showFurnitureOverlay && (
              <img
                src="/images/game-rooms/Furnitures.png"
                alt="Furniture overlay reference"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${roomWidth}px`,
                  height: `${roomHeight}px`,
                  objectFit: 'fill',
                  imageRendering: 'pixelated',
                  pointerEvents: 'none',
                  zIndex: 3,
                  opacity: 0.3
                }}
              />
            )}

            {/* Placed Furniture */}
            {placedFurniture.map(furniture => (
              <div
                key={furniture.id}
                draggable
                onDragStart={(e) => handlePlacedFurnitureDragStart(e, furniture)}
                style={{
                  position: 'absolute',
                  left: `${furniture.x}px`,
                  top: `${furniture.y}px`,
                  width: `${furniture.width}px`,
                  height: `${furniture.height}px`,
                  zIndex: 10,
                  pointerEvents: 'auto',
                  cursor: mode === 'furniture' ? 'move' : 'default',
                  border: mode === 'furniture' ? '2px dashed rgba(233, 30, 99, 0.5)' : 'none',
                  background: mode === 'furniture' ? 'rgba(233, 30, 99, 0.05)' : 'transparent'
                }}
              >
                <img
                  src={furniture.image}
                  alt={furniture.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    imageRendering: 'pixelated',
                    pointerEvents: 'none'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '-20px',
                  left: '0',
                  fontSize: '10px',
                  background: 'rgba(233, 30, 99, 0.9)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none'
                }}>
                  {furniture.name}
                </div>
              </div>
            ))}

            {/* Yuwon Test Character */}
            {mode === 'test' && (
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
                  top: `${yuwonPosition.y}px`,
                  transform: `translate(-50%, -50%) ${direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'} ${(direction === 'down' || direction === 'up') && isWalking ? 'scale(1.05)' : 'scale(1)'}`,
                  width: 'auto',
                  height: '60px',
                  objectFit: 'contain',
                  imageRendering: 'pixelated',
                  pointerEvents: 'none',
                  zIndex: 500,
                  filter: isWalking ? 'drop-shadow(0 4px 8px rgba(233, 30, 99, 0.5))' : 'none'
                }}
              />
            )}

            {/* Coordinate labels */}
            <div style={{ position: 'absolute', top: '5px', left: '5px', fontSize: '10px', color: '#999', zIndex: 200, pointerEvents: 'none', background: 'rgba(255,255,255,0.7)', padding: '2px 4px', borderRadius: '3px' }}>
              0,0
            </div>
            <div style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '10px', color: '#999', zIndex: 200, pointerEvents: 'none', background: 'rgba(255,255,255,0.7)', padding: '2px 4px', borderRadius: '3px' }}>
              {roomWidth},0
            </div>
            <div style={{ position: 'absolute', bottom: '5px', left: '5px', fontSize: '10px', color: '#999', zIndex: 200, pointerEvents: 'none', background: 'rgba(255,255,255,0.7)', padding: '2px 4px', borderRadius: '3px' }}>
              0,{roomHeight}
            </div>
            <div style={{ position: 'absolute', bottom: '5px', right: '5px', fontSize: '10px', color: '#999', zIndex: 200, pointerEvents: 'none', background: 'rgba(255,255,255,0.7)', padding: '2px 4px', borderRadius: '3px' }}>
              {roomWidth},{roomHeight}
            </div>

            {/* Clicked position marker */}
            {clickedPosition && (
              <div
                style={{
                  position: 'absolute',
                  left: `${clickedPosition.x}px`,
                  top: `${clickedPosition.y}px`,
                  width: '12px',
                  height: '12px',
                  background: '#e91e63',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 0 3px rgba(233, 30, 99, 0.3)',
                  zIndex: 100
                }}
              />
            )}

            {/* Collision Zones */}
            {collisionZones.map(zone => {
              const isWallZone = zone.type === 'wall';
              const isHitbox = zone.type === 'hitbox';
              const isWallDecoZone = zone.type === 'wallzone';
              const zoneColor = isWallZone ? '#2196f3' : isHitbox ? '#ff9800' : isWallDecoZone ? '#4caf50' : '#f44336';
              const zoneEmoji = isWallZone ? '🧱' : isHitbox ? '📦' : isWallDecoZone ? '🖼️' : '🪑';
              const bgColor = isWallZone ? 'rgba(33, 150, 243, 0.2)' : isHitbox ? 'rgba(255, 152, 0, 0.2)' : isWallDecoZone ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 0, 0, 0.2)';
              const labelBg = isWallZone ? 'rgba(33, 150, 243, 0.9)' : isHitbox ? 'rgba(255, 152, 0, 0.9)' : isWallDecoZone ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)';

              return (
                <div
                  key={zone.id}
                  style={{
                    position: 'absolute',
                    left: `${zone.left}px`,
                    top: `${zone.top}px`,
                    width: `${zone.width}px`,
                    height: `${zone.height}px`,
                    background: bgColor,
                    border: `2px dashed ${zoneColor}`,
                    zIndex: 150,
                    pointerEvents: 'none'
                  }}
                >
                  <div style={{
                    fontSize: '10px',
                    background: labelBg,
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                    position: 'absolute',
                    top: '-20px',
                    zIndex: 151
                  }}>
                    {zone.name} {zoneEmoji}
                  </div>
                </div>
              );
            })}

            {/* Current drawing zone */}
            {currentZone && (() => {
              const rect = getZoneRect(currentZone);
              if (!rect) return null;
              const isWallZone = zoneType === 'wall';
              const isWallDecoZone = zoneType === 'wallzone';
              const previewColor = isWallZone ? '#2196f3' : isWallDecoZone ? '#4caf50' : '#ff9800';
              const previewBg = isWallZone ? 'rgba(33, 150, 243, 0.3)' : isWallDecoZone ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)';
              return (
                <div
                  style={{
                    position: 'absolute',
                    left: `${rect.left}px`,
                    top: `${rect.top}px`,
                    width: `${rect.width}px`,
                    height: `${rect.height}px`,
                    background: previewBg,
                    border: `2px dashed ${previewColor}`,
                    zIndex: 100,
                    pointerEvents: 'none'
                  }}
                />
              );
            })()}

            {/* Saved positions markers with size */}
            {savedPositions.map(pos => (
              <div
                key={pos.id}
                style={{
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 50
                }}
              >
                {/* Size preview box */}
                <div style={{
                  width: `${pos.width}px`,
                  height: `${pos.height}px`,
                  border: '2px solid #4caf50',
                  background: 'rgba(76, 175, 80, 0.1)',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none'
                }} />
                {/* Center dot */}
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#4caf50',
                  borderRadius: '50%',
                  border: '2px solid white',
                  position: 'relative',
                  zIndex: 51
                }} />
                {/* Label */}
                <div style={{
                  fontSize: '10px',
                  background: 'rgba(76, 175, 80, 0.9)',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  marginTop: '4px'
                }}>
                  {pos.name} ({pos.width}×{pos.height})
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT: Controls Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Mode Selector */}
          <div style={{
            background: '#fff',
            padding: '15px',
            borderRadius: '12px',
            border: '3px solid #e91e63'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#e91e63', fontSize: '18px' }}>🎯 Mode</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setIsDrawingZone(false);
                  setCurrentZone(null);
                }}
                style={{
                  flex: 1,
                  background: !isDrawingZone ? '#4caf50' : '#e0e0e0',
                  color: !isDrawingZone ? 'white' : '#666',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                📍 Place Decorations
              </button>
              <button
                onClick={() => setIsDrawingZone(true)}
                style={{
                  flex: 1,
                  background: isDrawingZone ? '#ff9800' : '#e0e0e0',
                  color: isDrawingZone ? 'white' : '#666',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                🚫 Draw Zones
              </button>
            </div>
            {isDrawingZone && (
              <div style={{ marginTop: '10px' }}>
                <div style={{
                  background: '#fff3e0',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#e65100',
                  textAlign: 'center',
                  marginBottom: '10px'
                }}>
                  ✏️ Click & drag on room to draw collision zones
                </div>
                <input
                  type="text"
                  placeholder="Zone name (e.g., desk, bed)"
                  value={zoneName}
                  onChange={(e) => setZoneName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '2px solid #e0e0e0',
                    fontSize: '14px'
                  }}
                />
              </div>
            )}
          </div>

          {/* Place Decoration Controls */}
          {!isDrawingZone && clickedPosition && (
            <div style={{
              background: '#fff',
              padding: '15px',
              borderRadius: '12px',
              border: '2px solid #4caf50'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#4caf50', fontSize: '16px' }}>📍 Place Decoration</h3>
              <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                <strong>Pixel:</strong> left: {clickedPosition.x}px, top: {clickedPosition.y}px
              </div>
              <div style={{ fontSize: '14px', marginBottom: '15px' }}>
                <strong>Percent:</strong> left: {clickedPosition.xPercent}%, top: {clickedPosition.yPercent}%
              </div>

              <input
                type="text"
                placeholder="Decoration name (e.g., plant_1)"
                value={decorName}
                onChange={(e) => setDecorName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && savePosition()}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '2px solid #e0e0e0',
                  fontSize: '14px',
                  marginBottom: '10px'
                }}
              />
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Width (px)</label>
                  <input
                    type="number"
                    value={decorSize.width}
                    onChange={(e) => setDecorSize({ ...decorSize, width: parseInt(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '2px solid #e0e0e0',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>Height (px)</label>
                  <input
                    type="number"
                    value={decorSize.height}
                    onChange={(e) => setDecorSize({ ...decorSize, height: parseInt(e.target.value) || 0 })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '2px solid #e0e0e0',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              <button
                onClick={savePosition}
                disabled={!decorName.trim()}
                style={{
                  background: decorName.trim() ? '#4caf50' : '#ccc',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: decorName.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                💾 Save Position
              </button>
            </div>
          )}

          {/* Saved Items List */}
          <div style={{
            background: '#fff',
            padding: '20px',
            borderRadius: '12px',
            border: '2px solid #e0e0e0',
            maxHeight: '700px',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#e91e63' }}>💾 Saved Positions ({savedPositions.length})</h3>

            {savedPositions.length === 0 ? (
              <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic' }}>
                No saved positions yet. Click on the room and save!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {savedPositions.map(pos => (
                  <div
                    key={pos.id}
                    style={{
                      background: '#f5f5f5',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <strong style={{ color: '#4caf50', fontSize: '14px' }}>{pos.name}</strong>
                      <button
                        onClick={() => deletePosition(pos.id)}
                        style={{
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                      <strong>Size:</strong> {pos.width}×{pos.height}px
                    </div>

                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                      <strong>Pixel:</strong> left: {pos.x}px, top: {pos.y}px
                      <button
                        onClick={() => copyToClipboard(`left: '${pos.x}px', top: '${pos.y}px'`)}
                        style={{
                          marginLeft: '8px',
                          background: '#2196f3',
                          color: 'white',
                          border: 'none',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        📋
                      </button>
                    </div>

                    <div style={{ fontSize: '12px', color: '#666' }}>
                      <strong>Percent:</strong> left: {pos.xPercent}%, top: {pos.yPercent}%
                      <button
                        onClick={() => copyToClipboard(`left: '${pos.xPercent}%', top: '${pos.yPercent}%'`)}
                        style={{
                          marginLeft: '8px',
                          background: '#2196f3',
                          color: 'white',
                          border: 'none',
                          padding: '2px 6px',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          fontSize: '11px'
                        }}
                      >
                        📋
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Collision Zones List */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #e0e0e0' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#f44336' }}>🚫 Collision Zones ({collisionZones.length})</h3>

              {collisionZones.length === 0 ? (
                <p style={{ color: '#999', fontSize: '14px', fontStyle: 'italic' }}>
                  No collision zones yet. Draw some on the room!
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {collisionZones.map(zone => (
                    <div
                      key={zone.id}
                      style={{
                        background: '#ffebee',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #f44336'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <strong style={{ color: '#f44336', fontSize: '14px' }}>{zone.name}</strong>
                        <button
                          onClick={() => deleteZone(zone.id)}
                          style={{
                            background: '#f44336',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          ✕
                        </button>
                      </div>

                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        <strong>Position:</strong> left: {zone.left}px, top: {zone.top}px
                      </div>

                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                        <strong>Size:</strong> {zone.width}×{zone.height}px
                      </div>

                      <div style={{ fontSize: '12px', color: '#666' }}>
                        <strong>Percent:</strong> {zone.leftPercent}%, {zone.topPercent}% ({zone.widthPercent}%×{zone.heightPercent}%)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Placed Furniture List */}
            {mode === 'furniture' && placedFurniture.length > 0 && (
              <div style={{
                background: '#fff',
                padding: '15px',
                borderRadius: '12px',
                border: '2px solid #e0e0e0',
                marginBottom: '15px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#e91e63', fontSize: '14px' }}>🪑 Placed Furniture ({placedFurniture.length})</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {placedFurniture.map(furniture => (
                    <div
                      key={furniture.id}
                      style={{
                        padding: '10px',
                        background: '#f9f9f9',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '13px', color: '#333' }}>{furniture.name}</strong>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => autoAssignCollisionZone(furniture)}
                            style={{
                              background: '#2196f3',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '11px'
                            }}
                          >
                            ✓ Add Zone
                          </button>
                          <button
                            onClick={() => removeFurniture(furniture.id)}
                            style={{
                              background: '#f44336',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '11px'
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>

                      <div style={{ fontSize: '11px', color: '#666', marginBottom: '3px' }}>
                        <strong>Position:</strong> ({Math.round(furniture.x)}, {Math.round(furniture.y)})px
                      </div>

                      <div style={{ fontSize: '11px', color: '#666' }}>
                        <strong>Size:</strong> {furniture.width}×{furniture.height}px
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export Buttons */}
            {(savedPositions.length > 0 || collisionZones.length > 0 || placedFurniture.length > 0) && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #e0e0e0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => exportToJSON('all')}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    💾 Export All (Furniture + Hitboxes + Walls)
                  </button>
                  <button
                    onClick={() => exportToJSON('walls')}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)'
                    }}
                  >
                    🧱 Export Wall Boundaries Only
                  </button>
                  <button
                    onClick={saveForTesting}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(255, 152, 0, 0.4)'
                    }}
                  >
                    🚶 Save for Testing (All Zones)
                  </button>
                </div>
                <p style={{ fontSize: '11px', color: '#999', marginTop: '10px', textAlign: 'center' }}>
                  📦 Orange = Furniture Hitboxes | 🧱 Blue = Wall Collision | 🖼️ Green = Wall Decoration Zones<br />
                  • All: yuwon-room-layout.json<br />
                  • Walls: yuwon-room-wallcollision.json<br />
                  • Testing: Copy downloaded file to /public/data/
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomDecorHelper;
