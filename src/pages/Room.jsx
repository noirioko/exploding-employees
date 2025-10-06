import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { outfitsCatalog } from '../data/outfits';
import SpriteAnimation from '../components/SpriteAnimation';

function Room() {
  const { yuCash, setYuCash } = useApp();

  // Add CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -100%) translateY(-5px); }
        to { opacity: 0.9; transform: translate(-50%, -100%) translateY(0); }
      }
      @keyframes bounce {
        0%, 100% { transform: translate(-50%, -100%) translateY(0); }
        50% { transform: translate(-50%, -100%) translateY(-3px); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);


  const [yuwonPosition, setYuwonPosition] = useState({ x: 320, y: 180 }); // Center of room
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState('down'); // 'up', 'down', 'left', 'right'
  const [collisionZones, setCollisionZones] = useState([]);
  const [hoveredInteractable, setHoveredInteractable] = useState(null); // 'stove' or 'fridge' or null
  const [showVNDialogue, setShowVNDialogue] = useState(false);
  const [vnDialogueType, setVNDialogueType] = useState(null); // 'stove' or 'fridge'
  const [showCookingGame, setShowCookingGame] = useState(false);
  const [showFridge, setShowFridge] = useState(false);
  const [ingredients, setIngredients] = useState({ milk: 2, flour: 3, apple: 1 }); // Starting ingredients

  // Friend invitation system
  const [placedCharacters, setPlacedCharacters] = useState([]); // Array of {character, outfit, x, y, id}
  const [ownedOutfits, setOwnedOutfits] = useState({
    yuwon: ['yuwon_outfit_1'],
    noah: ['noah_outfit_1'],
    jaehyun: ['Jaehyun_outfit_1'],
    minkyu: ['minkyu_outfit_1']
  });
  const [characterOutfits, setCharacterOutfits] = useState({
    yuwon: 'yuwon_outfit_1',
    noah: 'noah_outfit_1',
    jaehyun: 'Jaehyun_outfit_1',
    minkyu: 'minkyu_outfit_1'
  });

  // Visual Helper Mode
  const [helperMode, setHelperMode] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const [editingName, setEditingName] = useState(null);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [isDrawingNew, setIsDrawingNew] = useState(false);
  const [newZoneStart, setNewZoneStart] = useState(null);
  const [currentMousePos, setCurrentMousePos] = useState(null);
  const [showHitbox, setShowHitbox] = useState(false);
  const positionRef = useRef({ x: 320, y: 180 });
  const directionRef = useRef('down');
  const isWalkingRef = useRef(false);

  // Room dimensions
  const roomWidth = 640;
  const roomHeight = 360;

  // Interaction zones (stove and fridge)
  const interactionZones = {
    stove: { left: 332, top: 90, width: 30, height: 42 }, // Zone 18
    fridge: { left: 269, top: 75, width: 34, height: 55 }  // Zone 19 - moved down 5px from top, reduced height
  };

  // Load collision zones from JSON file
  useEffect(() => {
    fetch('/data/yuwon-room-layout.json')
      .then(response => response.json())
      .then(data => {
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
      });
  }, []);

  // Outfit management functions
  const buyOutfit = (character, outfit) => {
    if (yuCash >= outfit.price && !ownedOutfits[character].includes(outfit.id)) {
      setOwnedOutfits({
        ...ownedOutfits,
        [character]: [...ownedOutfits[character], outfit.id]
      });
      setYuCash(yuCash - outfit.price);
    }
  };

  const changeOutfit = (character, outfitId) => {
    setCharacterOutfits({
      ...characterOutfits,
      [character]: outfitId
    });
    setPlacedCharacters(placedCharacters.map(char =>
      char.character === character ? { ...char, outfit: outfitId } : char
    ));
  };

  const placeCharacter = (character) => {
    const alreadyPlaced = placedCharacters.some(char => char.character === character);
    if (alreadyPlaced) {
      alert(`${character} is already in the room!`);
      return;
    }
    const newChar = {
      character: character,
      outfit: characterOutfits[character],
      x: 270,
      y: 130,
      id: `${character}-${Date.now()}`
    };
    setPlacedCharacters([...placedCharacters, newChar]);
  };

  const isCharacterPlaced = (character) => {
    return placedCharacters.some(char => char.character === character);
  };

  const getCharacterSprite = (character, outfit) => {
    if (character === 'yuwon' && outfit === 'yuwon_outfit_1') {
      return '/images/game-rooms/animation/idle_yuwon_outfit1.gif';
    }
    return `/images/game-rooms/char-outfits/${outfit}.png`;
  };

  const removeCharacter = (id) => {
    setPlacedCharacters(placedCharacters.filter(c => c.id !== id));
  };

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
      const speed = 1.08; // pixels per frame
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
  }, [collisionZones, roomWidth, roomHeight]);

  // Check if a position collides with any furniture
  const checkCollision = (x, y) => {
    const characterSize = 6; // Hitbox radius (reduced by 1px)
    const spriteHeight = 60;
    const yOffset = 6; // Center offset (raised by 4px: 10 - 4 = 6)
    const feetY = y + yOffset + (spriteHeight / 2); // Actual feet position

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


  // Helper mode: Save zones to JSON
  const saveZonesToJSON = () => {
    const data = {
      roomDimensions: { width: roomWidth, height: roomHeight },
      decorations: [],
      collisionZones: collisionZones.map(zone => ({
        name: zone.name,
        position: {
          pixel: { left: String(zone.left), top: String(zone.top) },
          percent: { left: ((zone.left / roomWidth) * 100).toFixed(2), top: ((zone.top / roomHeight) * 100).toFixed(2) }
        },
        size: {
          pixel: { width: String(zone.width), height: String(zone.height) },
          percent: { width: ((zone.width / roomWidth) * 100).toFixed(2), height: ((zone.height / roomHeight) * 100).toFixed(2) }
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

  // Helper mode: Zone drag handlers
  const handleZoneMouseDown = (e, index) => {
    if (!helperMode) return;
    e.stopPropagation();
    setSelectedZone(index);
    setIsDragging(true);
    const zone = collisionZones[index];
    setDragStart({
      offsetX: e.nativeEvent.offsetX,
      offsetY: e.nativeEvent.offsetY
    });
  };

  const handleResizeMouseDown = (e, index, direction) => {
    if (!helperMode) return;
    e.stopPropagation();
    setSelectedZone(index);
    setIsResizing(direction);
    const zone = collisionZones[index];
    const rect = e.currentTarget.parentElement.parentElement.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      startLeft: zone.left,
      startTop: zone.top,
      startWidth: zone.width,
      startHeight: zone.height
    });
  };

  const handleZoneMouseMove = (e) => {
    if (!helperMode || selectedZone === null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const updatedZones = [...collisionZones];

    if (isDragging) {
      const newLeft = mouseX - dragStart.offsetX;
      const newTop = mouseY - dragStart.offsetY;
      updatedZones[selectedZone] = {
        ...updatedZones[selectedZone],
        left: Math.round(Math.max(0, Math.min(roomWidth - updatedZones[selectedZone].width, newLeft))),
        top: Math.round(Math.max(0, Math.min(roomHeight - updatedZones[selectedZone].height, newTop)))
      };
      setCollisionZones(updatedZones);
    } else if (isResizing) {
      const zone = updatedZones[selectedZone];
      const dx = mouseX - dragStart.x;
      const dy = mouseY - dragStart.y;

      if (isResizing === 'se') {
        zone.width = Math.max(10, dragStart.startWidth + dx);
        zone.height = Math.max(10, dragStart.startHeight + dy);
      } else if (isResizing === 'sw') {
        const newWidth = Math.max(10, dragStart.startWidth - dx);
        zone.left = dragStart.startLeft + (dragStart.startWidth - newWidth);
        zone.width = newWidth;
        zone.height = Math.max(10, dragStart.startHeight + dy);
      } else if (isResizing === 'ne') {
        zone.width = Math.max(10, dragStart.startWidth + dx);
        const newHeight = Math.max(10, dragStart.startHeight - dy);
        zone.top = dragStart.startTop + (dragStart.startHeight - newHeight);
        zone.height = newHeight;
      } else if (isResizing === 'nw') {
        const newWidth = Math.max(10, dragStart.startWidth - dx);
        const newHeight = Math.max(10, dragStart.startHeight - dy);
        zone.left = dragStart.startLeft + (dragStart.startWidth - newWidth);
        zone.top = dragStart.startTop + (dragStart.startHeight - newHeight);
        zone.width = newWidth;
        zone.height = newHeight;
      }
      setCollisionZones(updatedZones);
    }
  };

  const handleZoneMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleNameChange = (index, newName) => {
    const updatedZones = [...collisionZones];
    updatedZones[index].name = newName;
    setCollisionZones(updatedZones);
  };

  // Draw new zone handlers
  const handleRoomMouseDown = (e) => {
    if (!helperMode || !isDrawingNew) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setNewZoneStart({ x, y });
  };

  const handleRoomMouseMove = (e) => {
    if (!helperMode || !isDrawingNew || !newZoneStart) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCurrentMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleRoomMouseUp = (e) => {
    if (!helperMode || !isDrawingNew || !newZoneStart) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const left = Math.min(newZoneStart.x, x);
    const top = Math.min(newZoneStart.y, y);
    const width = Math.abs(x - newZoneStart.x);
    const height = Math.abs(y - newZoneStart.y);

    if (width > 5 && height > 5) {
      const newZone = {
        name: `Zone ${collisionZones.length + 1}`,
        left: Math.round(left),
        top: Math.round(top),
        width: Math.round(width),
        height: Math.round(height)
      };
      setCollisionZones([...collisionZones, newZone]);
    }
    setNewZoneStart(null);
    setCurrentMousePos(null);
    setIsDrawingNew(false);
  };

  return (
    <div>
      <div className="current-date">
        🏠 Yuwon's Room
      </div>

      <div className="content">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '20px 20px 120px 20px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <p style={{ color: '#666', fontSize: '13px', margin: 0, textAlign: 'center' }}>
            Use <strong>WASD/Arrow Keys</strong> to walk around • <strong>Click</strong> objects to interact
          </p>
          <button
            onClick={() => setHelperMode(!helperMode)}
            style={{
              background: helperMode ? '#f44336' : '#2196f3',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {helperMode ? '✓ Helper ON' : '🛠️ Edit Zones'}
          </button>
          {helperMode && (
            <>
              <button
                onClick={() => setIsDrawingNew(!isDrawingNew)}
                style={{
                  background: isDrawingNew ? '#ff9800' : '#9c27b0',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {isDrawingNew ? '✓ Drawing...' : '➕ Draw New'}
              </button>
              <button
                onClick={() => setShowCoordinates(!showCoordinates)}
                style={{
                  background: showCoordinates ? '#607d8b' : '#757575',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {showCoordinates ? '📍 Hide Coords' : '📍 Show Coords'}
              </button>
              <button
                onClick={saveZonesToJSON}
                style={{
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                💾 Save JSON
              </button>
            </>
          )}
          <button
            onClick={() => setShowHitbox(!showHitbox)}
            style={{
              background: showHitbox ? '#00bcd4' : '#009688',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {showHitbox ? '👤 Hide Hitbox' : '👤 Show Hitbox'}
          </button>
        </div>
        {/* Room */}
        <div
          onMouseDown={handleRoomMouseDown}
          onMouseMove={isDrawingNew ? handleRoomMouseMove : handleZoneMouseMove}
          onMouseUp={isDrawingNew ? handleRoomMouseUp : handleZoneMouseUp}
          style={{
            width: `${roomWidth}px`,
            height: `${roomHeight}px`,
            background: '#f5f5f5',
            border: '3px solid #e91e63',
            borderRadius: '12px',
            position: 'relative',
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

          {/* Rugs/Carpets */}
          <img
            src="/images/game-rooms/Carpet_1.png"
            alt="Carpet 1"
            style={{
              position: 'absolute',
              left: '63px',
              top: '134px',
              width: 'auto',
              height: 'auto',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
              zIndex: 2
            }}
          />
          <img
            src="/images/game-rooms/Carpet_2.png"
            alt="Carpet 2"
            style={{
              position: 'absolute',
              left: '19px',
              top: '278px',
              width: 'auto',
              height: 'auto',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
              zIndex: 2
            }}
          />
          <img
            src="/images/game-rooms/Carpet_3.png"
            alt="Carpet 3"
            style={{
              position: 'absolute',
              left: '327px',
              top: '172px',
              width: 'auto',
              height: 'auto',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
              zIndex: 2
            }}
          />
          <img
            src="/images/game-rooms/Carpet_4.png"
            alt="Carpet 4"
            style={{
              position: 'absolute',
              left: '508px',
              top: '132px',
              width: 'auto',
              height: 'auto',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
              zIndex: 2
            }}
          />

          {/* Placed Characters */}
          {placedCharacters.map((char) => (
            <img
              key={char.id}
              src={getCharacterSprite(char.character, char.outfit)}
              alt={char.character}
              style={{
                position: 'absolute',
                left: `${char.x}px`,
                top: `${char.y}px`,
                transform: 'translate(-50%, -50%) scale(1.5)',
                width: 'auto',
                height: '60px',
                objectFit: 'contain',
                imageRendering: 'pixelated',
                pointerEvents: 'none',
                zIndex: 14
              }}
            />
          ))}

          {/* Noah - Animated Character */}
          <div
            onMouseEnter={() => setHoveredInteractable('noah')}
            onMouseLeave={() => setHoveredInteractable(null)}
            onClick={() => {
              setVNDialogueType('noah');
              setShowVNDialogue(true);
            }}
            style={{
              position: 'absolute',
              left: '80px',
              top: '69px',
              width: '90px',
              height: '90px',
              cursor: 'pointer',
              zIndex: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SpriteAnimation
              spriteSheet="/images/Idle-noah/Noah_Idle_Left_Outfit 1.png"
              rows={1}
              columns={8}
              frameDelay={100}
              selectedFrames={[0, 1, 2, 3, 4, 5, 6, 7]}
              scale={1.4}
              style={{
                pointerEvents: 'none'
              }}
            />
          </div>

          {/* Yuwon */}
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
              zIndex: 15,
              filter: 'none'
            }}
          />

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
              zIndex: 10
            }}
          />

          {/* Clickable Stove Zone */}
          <div
            onMouseEnter={() => setHoveredInteractable('stove')}
            onMouseLeave={() => setHoveredInteractable(null)}
            onClick={() => {
              setVNDialogueType('stove');
              setShowVNDialogue(true);
            }}
            style={{
              position: 'absolute',
              left: `${interactionZones.stove.left}px`,
              top: `${interactionZones.stove.top}px`,
              width: `${interactionZones.stove.width}px`,
              height: `${interactionZones.stove.height}px`,
              cursor: 'pointer',
              zIndex: 11
            }}
          />

          {/* Clickable Fridge Zone */}
          <div
            onMouseEnter={() => setHoveredInteractable('fridge')}
            onMouseLeave={() => setHoveredInteractable(null)}
            onClick={() => {
              setVNDialogueType('fridge');
              setShowVNDialogue(true);
            }}
            style={{
              position: 'absolute',
              left: `${interactionZones.fridge.left}px`,
              top: `${interactionZones.fridge.top}px`,
              width: `${interactionZones.fridge.width}px`,
              height: `${interactionZones.fridge.height}px`,
              cursor: 'pointer',
              zIndex: 11
            }}
          />

          {/* Kitchen Island Overlay - cropped to show only top 20px */}
          <img
            src="/images/game-rooms/Kitchen Island_Decorated.png"
            alt="Kitchen Island"
            style={{
              position: 'absolute',
              left: '253px',
              top: '147px',
              width: 'auto',
              height: 'auto',
              transform: 'scaleX(1.05) scaleY(1.04)',
              transformOrigin: 'top left',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
              zIndex: 20,
              clipPath: 'inset(0 0 calc(100% - 20px) 0)'
            }}
          />

          {/* Sofa Overlay - cropped to show only top 20px, cut 10px from left */}
          <img
            src="/images/game-rooms/Sofa.png"
            alt="Sofa"
            style={{
              position: 'absolute',
              left: '152px',
              top: '131px',
              width: 'auto',
              height: 'auto',
              transform: 'scaleX(1.04) scaleY(1.03)',
              transformOrigin: 'top left',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
              zIndex: 20,
              clipPath: 'inset(0 0 calc(100% - 20px) 10px)'
            }}
          />

          {/* Collision Zones - Helper Mode */}
          {helperMode && collisionZones.map((zone, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${zone.left}px`,
                top: `${zone.top}px`,
                width: `${zone.width}px`,
                height: `${zone.height}px`,
                border: selectedZone === index ? '3px solid #2196f3' : '2px dashed rgba(255, 152, 0, 0.8)',
                background: selectedZone === index ? 'rgba(33, 150, 243, 0.3)' : 'rgba(255, 152, 0, 0.2)',
                zIndex: 25
              }}
            >
              {/* Draggable area */}
              <div
                onMouseDown={(e) => handleZoneMouseDown(e, index)}
                style={{
                  width: '100%',
                  height: '100%',
                  cursor: 'move'
                }}
              />

              {/* Delete button */}
              {selectedZone === index && (
                <button
                  onClick={() => {
                    const updatedZones = collisionZones.filter((_, i) => i !== index);
                    setCollisionZones(updatedZones);
                    setSelectedZone(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: '-28px',
                    right: 0,
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  🗑️ Delete
                </button>
              )}

              {/* Editable name label */}
              <div style={{
                position: 'absolute',
                top: '-22px',
                left: 0,
                whiteSpace: 'nowrap'
              }}>
                {editingName === index ? (
                  <input
                    type="text"
                    value={zone.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    onBlur={() => setEditingName(null)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingName(null)}
                    autoFocus
                    style={{
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid #2196f3',
                      fontWeight: '600'
                    }}
                  />
                ) : (
                  <div
                    onDoubleClick={() => setEditingName(index)}
                    style={{
                      fontSize: '11px',
                      color: '#ff9800',
                      background: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: '600',
                      cursor: 'text'
                    }}
                  >
                    {zone.name}{showCoordinates ? ` (${zone.left}, ${zone.top}, ${zone.width}×${zone.height})` : ''}
                  </div>
                )}
              </div>

              {/* Resize handles */}
              {selectedZone === index && (
                <>
                  <div onMouseDown={(e) => handleResizeMouseDown(e, index, 'nw')} style={{ position: 'absolute', top: -4, left: -4, width: 8, height: 8, background: '#2196f3', cursor: 'nw-resize', borderRadius: '50%' }} />
                  <div onMouseDown={(e) => handleResizeMouseDown(e, index, 'ne')} style={{ position: 'absolute', top: -4, right: -4, width: 8, height: 8, background: '#2196f3', cursor: 'ne-resize', borderRadius: '50%' }} />
                  <div onMouseDown={(e) => handleResizeMouseDown(e, index, 'sw')} style={{ position: 'absolute', bottom: -4, left: -4, width: 8, height: 8, background: '#2196f3', cursor: 'sw-resize', borderRadius: '50%' }} />
                  <div onMouseDown={(e) => handleResizeMouseDown(e, index, 'se')} style={{ position: 'absolute', bottom: -4, right: -4, width: 8, height: 8, background: '#2196f3', cursor: 'se-resize', borderRadius: '50%' }} />
                </>
              )}
            </div>
          ))}

          {/* Drawing new zone preview */}
          {helperMode && isDrawingNew && newZoneStart && currentMousePos && (
            <div
              style={{
                position: 'absolute',
                left: `${Math.min(newZoneStart.x, currentMousePos.x)}px`,
                top: `${Math.min(newZoneStart.y, currentMousePos.y)}px`,
                width: `${Math.abs(currentMousePos.x - newZoneStart.x)}px`,
                height: `${Math.abs(currentMousePos.y - newZoneStart.y)}px`,
                border: '2px dashed #9c27b0',
                background: 'rgba(156, 39, 176, 0.2)',
                pointerEvents: 'none',
                zIndex: 30
              }}
            />
          )}

          {/* Yuwon's Hitbox Visualizer */}
          {showHitbox && (
            <>
              {/* Hitbox circle */}
              <div
                style={{
                  position: 'absolute',
                  left: `${yuwonPosition.x}px`,
                  top: `${yuwonPosition.y + 6 + 30}px`,
                  transform: 'translate(-50%, -50%)',
                  width: '12px',
                  height: '12px',
                  border: '2px solid #4caf50',
                  borderRadius: '50%',
                  background: 'rgba(76, 175, 80, 0.3)',
                  zIndex: 25,
                  pointerEvents: 'none'
                }}
              />
              {/* Center dot */}
              <div
                style={{
                  position: 'absolute',
                  left: `${yuwonPosition.x}px`,
                  top: `${yuwonPosition.y + 6 + 30}px`,
                  transform: 'translate(-50%, -50%)',
                  width: '4px',
                  height: '4px',
                  background: '#4caf50',
                  borderRadius: '50%',
                  zIndex: 26,
                  pointerEvents: 'none'
                }}
              />
            </>
          )}

          {/* Hover indicator on interactable zones */}
          {hoveredInteractable === 'stove' && (
            <div
              style={{
                position: 'absolute',
                left: `${interactionZones.stove.left + interactionZones.stove.width / 2}px`,
                top: `${interactionZones.stove.top - 10}px`,
                transform: 'translate(-50%, -100%)',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#e91e63',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                zIndex: 20,
                pointerEvents: 'none',
                border: '2px solid #e91e63',
                boxShadow: '0 2px 8px rgba(233, 30, 99, 0.3)',
                animation: 'fadeIn 0.2s ease-in-out, bounce 0.6s ease-in-out infinite',
                opacity: 0.9
              }}
            >
              🍳 Stove
            </div>
          )}
          {hoveredInteractable === 'fridge' && (
            <div
              style={{
                position: 'absolute',
                left: `${interactionZones.fridge.left + interactionZones.fridge.width / 2}px`,
                top: `${interactionZones.fridge.top - 10}px`,
                transform: 'translate(-50%, -100%)',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#2196f3',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                zIndex: 20,
                pointerEvents: 'none',
                border: '2px solid #2196f3',
                boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                animation: 'fadeIn 0.2s ease-in-out, bounce 0.6s ease-in-out infinite',
                opacity: 0.9
              }}
            >
              🧊 Fridge
            </div>
          )}
          {hoveredInteractable === 'noah' && (
            <div
              style={{
                position: 'absolute',
                left: '130px',
                top: '84px',
                transform: 'translate(-50%, -100%)',
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#673ab7',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                zIndex: 20,
                pointerEvents: 'none',
                border: '2px solid #673ab7',
                boxShadow: '0 2px 8px rgba(103, 58, 183, 0.3)',
                animation: 'fadeIn 0.2s ease-in-out, bounce 0.6s ease-in-out infinite',
                opacity: 0.9
              }}
            >
              💼 Noah
            </div>
          )}
        </div>
      </div>

      {/* VN-Style Dialogue Box */}
      {showVNDialogue && (
        <>
          {/* Backdrop to close on click */}
          <div
            onClick={() => setShowVNDialogue(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              bottom: '90px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '85%',
              maxWidth: '550px',
              background: 'linear-gradient(135deg, #fff9f0 0%, #ffe6f5 100%)',
              border: '3px solid #ffc1e3',
              borderRadius: '16px',
              padding: '0',
              paddingRight: '12px',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(233, 30, 99, 0.15)',
              display: 'flex',
              gap: '12px',
              alignItems: 'stretch'
            }}
          >
          {/* Character Portrait */}
          <img
            src={
              vnDialogueType === 'noah'
                ? "/images/avatar_noah.jpg"
                : vnDialogueType === 'stove'
                ? "/images/vn_sprites_head/portrait_yuwon_smile.png"
                : "/images/vn_sprites_head/portrait_yuwon_normal.png"
            }
            alt={vnDialogueType === 'noah' ? 'Noah' : 'Yuwon'}
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '13px 0 0 13px',
              objectFit: 'cover',
              flexShrink: 0
            }}
          />

          {/* Dialogue Content */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 0' }}>
            <div style={{
              color: vnDialogueType === 'noah' ? '#673ab7' : '#e91e63',
              fontSize: '11px',
              fontWeight: '600',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {vnDialogueType === 'noah' ? '💼 Noah' : '💕 Yuwon'}
            </div>
            <div style={{
              color: '#666',
              fontSize: '13px',
              lineHeight: '1.5',
              marginBottom: '10px',
              fontWeight: '500',
              background: 'rgba(255, 255, 255, 0.6)',
              padding: '10px 12px',
              borderRadius: '8px',
              border: vnDialogueType === 'noah' ? '2px solid rgba(103, 58, 183, 0.2)' : '2px solid rgba(233, 30, 99, 0.2)',
              flex: 1
            }}>
              {vnDialogueType === 'noah'
                ? "Your room is... quaint. Is that... plushies?"
                : vnDialogueType === 'stove'
                ? "I'm feeling like cooking! ✨"
                : "Let me see what's inside~ 🌸"}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {vnDialogueType !== 'noah' && (
                <button
                  onClick={() => {
                    setShowVNDialogue(false);
                    if (vnDialogueType === 'stove') {
                      setShowCookingGame(true);
                    } else {
                      setShowFridge(true);
                    }
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  style={{
                    background: 'linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(233, 30, 99, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                >
                  {vnDialogueType === 'stove' ? '🍳 Cook' : '🧊 Fridge'}
                </button>
              )}
              <button
                onClick={() => setShowVNDialogue(false)}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                style={{
                  background: 'linear-gradient(135deg, #d4a5ff 0%, #b18cdb 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(180, 140, 219, 0.3)',
                  transition: 'transform 0.2s'
                }}
              >
                Later~
              </button>
            </div>
          </div>
        </div>
        </>
      )}

      {/* Cooking Game Popup */}
      {showCookingGame && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowCookingGame(false)}
        >
          <div
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: '#e91e63', marginTop: 0 }}>🍳 Cooking - Apple Pie</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Let's make an apple pie! You need:
            </p>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ marginBottom: '10px' }}>🥛 Milk: {ingredients.milk} {ingredients.milk > 0 ? '✓' : '✗'}</div>
              <div style={{ marginBottom: '10px' }}>🌾 Flour: {ingredients.flour} {ingredients.flour > 0 ? '✓' : '✗'}</div>
              <div style={{ marginBottom: '10px' }}>🍎 Apple: {ingredients.apple} {ingredients.apple > 0 ? '✓' : '✗'}</div>
            </div>
            {ingredients.milk > 0 && ingredients.flour > 0 && ingredients.apple > 0 ? (
              <button
                onClick={() => {
                  setIngredients({ milk: ingredients.milk - 1, flour: ingredients.flour - 1, apple: ingredients.apple - 1 });
                  alert('🥧 Apple Pie crafted!');
                  setShowCookingGame(false);
                }}
                style={{
                  width: '100%',
                  background: '#4caf50',
                  color: 'white',
                  border: 'none',
                  padding: '15px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🥧 Cook Apple Pie
              </button>
            ) : (
              <div style={{ padding: '15px', background: '#ffebee', borderRadius: '8px', color: '#c62828', textAlign: 'center' }}>
                ❌ Not enough ingredients! Check the fridge.
              </div>
            )}
            <button
              onClick={() => setShowCookingGame(false)}
              style={{
                width: '100%',
                marginTop: '10px',
                background: '#757575',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Fridge Popup */}
      {showFridge && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowFridge(false)}
        >
          <div
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '16px',
              maxWidth: '400px',
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: '#2196f3', marginTop: 0 }}>🧊 Fridge - Ingredients</h2>
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                padding: '15px',
                background: '#e3f2fd',
                borderRadius: '8px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>🥛 Milk</span>
                <span style={{ fontWeight: '600', fontSize: '18px' }}>{ingredients.milk}</span>
              </div>
              <div style={{
                padding: '15px',
                background: '#fff3e0',
                borderRadius: '8px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>🌾 Flour</span>
                <span style={{ fontWeight: '600', fontSize: '18px' }}>{ingredients.flour}</span>
              </div>
              <div style={{
                padding: '15px',
                background: '#ffebee',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>🍎 Apple</span>
                <span style={{ fontWeight: '600', fontSize: '18px' }}>{ingredients.apple}</span>
              </div>
            </div>
            <button
              onClick={() => setShowFridge(false)}
              style={{
                width: '100%',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Characters & Outfits Section - Below Room */}
      <div className="content" style={{ marginTop: '40px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div style={{
            background: '#fff0f5',
            borderRadius: '8px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              🏠 <span style={{ fontWeight: '600', color: '#333' }}>Yuwon's Room</span>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', color: '#e91e63', marginBottom: '15px' }}>
            Characters & Outfits
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            {[
              { name: 'yuwon', unlocked: true },
              { name: 'jaehyun', unlocked: true },
              { name: 'minkyu', unlocked: true },
              { name: 'noah', unlocked: true }
            ].map(({ name: char, unlocked }) => (
              <div key={char} style={{ display: 'flex', gap: '30px', padding: '20px', background: '#fafafa', borderRadius: '12px', opacity: unlocked ? 1 : 0.6 }}>
                <div style={{ textAlign: 'center', minWidth: '150px' }}>
                  <img
                    src={`/images/avatar_${char}.jpg`}
                    alt={char}
                    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px', border: '3px solid #e91e63' }}
                  />
                  <h2 style={{ fontSize: '18px', textTransform: 'capitalize', marginBottom: '4px', color: '#333' }}>
                    {char}
                  </h2>
                </div>

                <div style={{ textAlign: 'center', minWidth: '120px' }}>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px', fontWeight: '600' }}>
                    Default Outfit
                  </div>
                  <img
                    src={getCharacterSprite(char, characterOutfits[char])}
                    alt={char}
                    style={{ width: '60px', height: 'auto', objectFit: 'contain', imageRendering: 'pixelated', marginBottom: '8px' }}
                  />
                  <button
                    onClick={() => placeCharacter(char)}
                    disabled={isCharacterPlaced(char)}
                    style={{
                      padding: '8px 16px',
                      background: isCharacterPlaced(char) ? '#999' : '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: isCharacterPlaced(char) ? 'not-allowed' : 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                      width: '100%'
                    }}
                  >
                    {isCharacterPlaced(char) ? '✓ In Room' : '📍 Place'}
                  </button>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
                    {outfitsCatalog[char]?.map(outfit => {
                      const owned = ownedOutfits[char]?.includes(outfit.id);
                      const isActive = characterOutfits[char] === outfit.id;

                      return (
                        <div
                          key={outfit.id}
                          style={{
                            border: isActive ? '2px solid #e91e63' : '1px solid #e0e0e0',
                            borderRadius: '6px',
                            padding: '6px',
                            textAlign: 'center',
                            background: owned ? (isActive ? '#fff0f5' : 'white') : 'white',
                            cursor: owned ? 'pointer' : 'default'
                          }}
                          onClick={() => owned && changeOutfit(char, outfit.id)}
                          title={outfit.name}
                        >
                          <img
                            src={outfit.image}
                            alt={outfit.name}
                            style={{ width: '100%', height: 'auto', objectFit: 'contain', marginBottom: '4px', imageRendering: 'pixelated', opacity: owned ? 1 : 0.6 }}
                          />
                          <div style={{ fontSize: '9px', fontWeight: '600', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {outfit.name}
                          </div>
                          {!owned && outfit.price > 0 && (
                            <>
                              <div style={{ fontSize: '10px', color: '#ff9800', fontWeight: '700', marginBottom: '4px' }}>
                                {outfit.price} YP
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  buyOutfit(char, outfit);
                                }}
                                style={{
                                  background: '#4caf50',
                                  color: 'white',
                                  border: 'none',
                                  padding: '3px 6px',
                                  borderRadius: '3px',
                                  cursor: 'pointer',
                                  fontSize: '9px',
                                  width: '100%'
                                }}
                              >
                                Buy
                              </button>
                            </>
                          )}
                          {owned && (
                            <div style={{ fontSize: '8px', color: isActive ? '#e91e63' : '#4caf50', fontWeight: '600' }}>
                              {isActive ? '✓ Wearing' : '✓ Owned'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Room;
