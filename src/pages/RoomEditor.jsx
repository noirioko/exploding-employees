import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { placesConfig } from '../data/places';
import { recipes, canCookRecipe, getRecipeById } from '../data/recipes';
import { getItemById } from '../data/shopItems';
import { getGiftReaction, getHeartCount } from '../data/giftPreferences';

function RoomEditor() {
  const {
    yuCash,
    setYuCash,
    ingredients,
    cookedDishes,
    discoveredRecipes,
    cookRecipe,
    giftDish,
    friendshipPoints,
    addFriendshipPoints
  } = useApp();

  const navigate = useNavigate();

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
      @keyframes bounceItem {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(-3px); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Player state
  const [yuwonPosition, setYuwonPosition] = useState({ x: 320, y: 180 });
  const [isWalking, setIsWalking] = useState(false);
  const [direction, setDirection] = useState('down');
  const [collisionZones, setCollisionZones] = useState([]);

  // Interaction state
  const [hoveredInteractable, setHoveredInteractable] = useState(null);
  const [showVNDialogue, setShowVNDialogue] = useState(false);
  const [vnDialogueType, setVNDialogueType] = useState(null); // 'noah', 'stove', 'fridge', 'table'
  const [dialogueMode, setDialogueMode] = useState('menu'); // 'menu', 'talk'

  // Modal state
  const [showFridgeModal, setShowFridgeModal] = useState(false);
  const [showStoveModal, setShowStoveModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);

  // Tooltip state
  const [hoveredRecipe, setHoveredRecipe] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Gifting system
  const [heldItem, setHeldItem] = useState(null); // { type: 'dish', id: 'apple_pie', name: 'Apple Pie', image: '...' }
  const [nearbyCharacter, setNearbyCharacter] = useState(null);
  const [giftReaction, setGiftReaction] = useState(null);

  // Visual helpers
  const [showHelpers, setShowHelpers] = useState(false);
  const [showHitbox, setShowHitbox] = useState(false);
  const [showCoordinates, setShowCoordinates] = useState(false);

  // Zone editor state
  const [editMode, setEditMode] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedInteractionZone, setSelectedInteractionZone] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState(null);
  const [currentMouse, setCurrentMouse] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState(null);

  // Furniture placement editor state
  const [furnitureMode, setFurnitureMode] = useState(false);
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [isDraggingFurniture, setIsDraggingFurniture] = useState(false);
  const [isCroppingFurniture, setIsCroppingFurniture] = useState(false);
  const [furnitureDragOffset, setFurnitureDragOffset] = useState({ x: 0, y: 0 });
  const [showFurnitureOverlay, setShowFurnitureOverlay] = useState(true);
  const [cropMode, setCropMode] = useState(false);
  const [cropDragHandle, setCropDragHandle] = useState(null);

  // Kitchen island state (food status)
  const hasFood = cookedDishes && cookedDishes.length > 0;

  // NPC dialogue messages
  const noahMessages = [
    "Your room is... quaint. Is that... plushies?",
    "I suppose this is... cozy. For you.",
    "Don't get used to me being here.",
    "...It's not as bad as I thought it would be.",
    "If you tell anyone I was here, I'll deny it."
  ];
  const [currentNoahMessage, setCurrentNoahMessage] = useState(0);

  // Noah character state
  const [noah, setNoah] = useState({
    x: 54,
    y: 112,
    collisionWidth: 12,
    collisionHeight: 12,
    originalX: 54,
    facingLeft: false,
    isWalking: false,
    direction: 'down'
  });

  // Refs for game loop
  const positionRef = useRef({ x: 320, y: 180 });
  const directionRef = useRef('down');
  const isWalkingRef = useRef(false);
  const proximityCheckCounter = useRef(0);
  const noahRef = useRef(noah);
  const collisionZonesRef = useRef(collisionZones);
  const nearbyCharacterRef = useRef(nearbyCharacter);

  // Room dimensions
  const roomWidth = 608;
  const roomHeight = 352;

  // Interaction zones (now editable state)
  const [interactionZones, setInteractionZones] = useState({
    stove: { left: 332, top: 90, width: 30, height: 42 },
    fridge: { left: 269, top: 75, width: 34, height: 55 },
    table: { left: 252, top: 147, width: 50, height: 40 }
  });

  // Sync refs with state
  useEffect(() => {
    noahRef.current = noah;
  }, [noah]);

  useEffect(() => {
    collisionZonesRef.current = collisionZones;
  }, [collisionZones]);

  useEffect(() => {
    nearbyCharacterRef.current = nearbyCharacter;
  }, [nearbyCharacter]);

  // Load collision zones
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
      .catch(error => {
        console.error('Failed to load collision zones:', error);
      });
  }, []);

  // Keyboard movement with collision detection
  useEffect(() => {
    const keysPressed = {};
    let animationFrameId;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        keysPressed[key] = true;
        e.preventDefault();
      }

      // E key interaction
      if (key === 'e' && nearbyCharacterRef.current) {
        if (nearbyCharacterRef.current === 'noah') {
          const yuwonX = positionRef.current.x;
          const noahX = noahRef.current.x;
          const faceDirection = yuwonX > noahX ? 'right' : 'left';

          setNoah(prev => ({
            ...prev,
            direction: faceDirection,
            isWalking: false
          }));
        }

        setVNDialogueType(nearbyCharacterRef.current);
        setDialogueMode('menu');
        setShowVNDialogue(true);
        e.preventDefault();
      }

      // Toggle helpers with H key
      if (key === 'h') {
        setShowHelpers(prev => !prev);
        setShowHitbox(prev => !prev);
      }

      // Toggle coordinates with C key
      if (key === 'c') {
        setShowCoordinates(prev => !prev);
        e.preventDefault();
      }

      // Toggle edit mode with E key (when not near character)
      if (key === 'e' && !nearbyCharacterRef.current) {
        setEditMode(prev => !prev);
        setSelectedZone(null);
        e.preventDefault();
      }

      // Delete selected zone with Delete key
      if ((key === 'delete' || e.key === 'Delete') && selectedZone !== null && editMode) {
        setCollisionZones(prev => prev.filter((_, i) => i !== selectedZone));
        setSelectedZone(null);
        e.preventDefault();
      }

      // Save zones with S key (when in edit mode)
      if (key === 's' && editMode) {
        e.preventDefault();
        saveZonesToFile();
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (keysPressed[key]) {
        delete keysPressed[key];
      }
    };

    const checkCollision = (newX, newY) => {
      const hitboxSize = 8;
      const hitboxOffsetX = 4;
      const hitboxOffsetY = 18; // Changed from 8 to 18 (10px lower)

      const playerLeft = newX - hitboxSize / 2 + hitboxOffsetX;
      const playerRight = newX + hitboxSize / 2 + hitboxOffsetX;
      const playerTop = newY - hitboxSize / 2 + hitboxOffsetY;
      const playerBottom = newY + hitboxSize / 2 + hitboxOffsetY;

      // Check collision with Noah
      const currentNoah = noahRef.current;
      const noahLeft = currentNoah.x - currentNoah.collisionWidth / 2;
      const noahRight = currentNoah.x + currentNoah.collisionWidth / 2;
      const noahTop = currentNoah.y - currentNoah.collisionHeight / 2 + 10; // 10px lower
      const noahBottom = currentNoah.y + currentNoah.collisionHeight / 2 + 10; // 10px lower

      if (playerRight > noahLeft && playerLeft < noahRight &&
          playerBottom > noahTop && playerTop < noahBottom) {
        return true;
      }

      // Check collision with zones
      for (const zone of collisionZonesRef.current) {
        if (playerRight > zone.left &&
            playerLeft < zone.left + zone.width &&
            playerBottom > zone.top &&
            playerTop < zone.top + zone.height) {
          return true;
        }
      }

      return false;
    };

    const updatePosition = () => {
      let dx = 0;
      let dy = 0;
      const speed = 1.5;

      if (keysPressed['w'] || keysPressed['arrowup']) { dy -= speed; directionRef.current = 'up'; }
      if (keysPressed['s'] || keysPressed['arrowdown']) { dy += speed; directionRef.current = 'down'; }
      if (keysPressed['a'] || keysPressed['arrowleft']) { dx -= speed; directionRef.current = 'left'; }
      if (keysPressed['d'] || keysPressed['arrowright']) { dx += speed; directionRef.current = 'right'; }

      if (dx !== 0 || dy !== 0) {
        if (dx !== 0 && dy !== 0) {
          dx *= 0.707;
          dy *= 0.707;
        }

        let newX = positionRef.current.x + dx;
        let newY = positionRef.current.y + dy;

        newX = Math.max(8, Math.min(roomWidth - 8, newX));
        newY = Math.max(8, Math.min(roomHeight - 8, newY));

        if (!checkCollision(newX, newY)) {
          positionRef.current = { x: newX, y: newY };
          setYuwonPosition({ x: newX, y: newY });
        }

        if (!isWalkingRef.current) {
          isWalkingRef.current = true;
          setIsWalking(true);
        }
        setDirection(directionRef.current);
      } else {
        if (isWalkingRef.current) {
          isWalkingRef.current = false;
          setIsWalking(false);
        }
      }

      // Check proximity to Noah (throttled)
      proximityCheckCounter.current++;
      if (proximityCheckCounter.current >= 10) {
        proximityCheckCounter.current = 0;

        const currentNoah = noahRef.current;
        const distanceToNoah = Math.sqrt(
          Math.pow(positionRef.current.x - currentNoah.x, 2) +
          Math.pow(positionRef.current.y - currentNoah.y, 2)
        );

        const wasNearby = nearbyCharacterRef.current === 'noah';
        const enterDistance = 45;
        const exitDistance = 60;

        if (wasNearby) {
          if (distanceToNoah > exitDistance) {
            setNearbyCharacter(null);
          }
        } else {
          if (distanceToNoah < enterDistance) {
            setNearbyCharacter('noah');
          }
        }
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
  }, []);

  // Noah's idle pacing AI
  useEffect(() => {
    if (showVNDialogue && vnDialogueType === 'noah') {
      return;
    }

    let phase = 'paused-left-down'; // Start facing down at left position
    let pauseTimer = 0;
    let animationFrameId;

    const updateNoah = () => {
      setNoah(prev => {
        let newX = prev.x;
        let newDirection = prev.direction;
        let newIsWalking = false;

        // Left position - face down (front)
        if (phase === 'paused-left-down') {
          pauseTimer++;
          newDirection = 'down';
          newIsWalking = false;
          if (pauseTimer > 180) { // 3 seconds
            phase = 'walking-right';
            pauseTimer = 0;
          }
        }
        // Walking right
        else if (phase === 'walking-right') {
          newX += 0.3;
          newDirection = 'right';
          newIsWalking = true;
          if (newX >= 125) {
            phase = 'paused-right-side';
            pauseTimer = 0;
            newX = 125;
          }
        }
        // Right position - look right for 3 seconds
        else if (phase === 'paused-right-side') {
          pauseTimer++;
          newDirection = 'right';
          newIsWalking = false;
          if (pauseTimer > 180) { // 3 seconds
            phase = 'paused-right-up';
            pauseTimer = 0;
          }
        }
        // Right position - look up for 10 seconds
        else if (phase === 'paused-right-up') {
          pauseTimer++;
          newDirection = 'up';
          newIsWalking = false;
          if (pauseTimer > 600) { // 10 seconds
            phase = 'walking-left';
            pauseTimer = 0;
          }
        }
        // Walking left
        else if (phase === 'walking-left') {
          newX -= 0.3;
          newDirection = 'left';
          newIsWalking = true;
          if (newX <= 54) {
            phase = 'paused-left-down';
            pauseTimer = 0;
            newX = 54;
          }
        }

        return {
          ...prev,
          x: newX,
          direction: newDirection,
          isWalking: newIsWalking
        };
      });

      animationFrameId = requestAnimationFrame(updateNoah);
    };

    animationFrameId = requestAnimationFrame(updateNoah);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [showVNDialogue, vnDialogueType]);

  // Furniture placement handlers
  const handleAddFurniture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const newFurniture = {
              id: Date.now(),
              src: event.target.result,
              x: 100,
              y: 100,
              width: img.width,
              height: img.height,
              zIndex: 500,
              crop: { x: 0, y: 0, width: img.width, height: img.height },
              originalWidth: img.width,
              originalHeight: img.height
            };
            setFurnitureItems(prev => [...prev, newFurniture]);
            setSelectedFurniture(furnitureItems.length);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleFurnitureMouseDown = (e, index) => {
    if (!furnitureMode || cropMode) return;
    e.stopPropagation();
    setSelectedFurniture(index);
    setIsDraggingFurniture(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setFurnitureDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCropHandleMouseDown = (e, handle) => {
    e.stopPropagation();
    setCropDragHandle(handle);
  };

  const handleFurnitureMouseMove = (e) => {
    if (!furnitureMode || selectedFurniture === null) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Handle crop dragging
    if (cropMode && cropDragHandle) {
      setFurnitureItems(prev => {
        const updated = [...prev];
        const item = updated[selectedFurniture];
        const newCrop = { ...item.crop };

        const itemRect = {
          left: item.x,
          top: item.y,
          right: item.x + item.crop.width,
          bottom: item.y + item.crop.height
        };

        if (cropDragHandle.includes('left')) {
          const newLeft = Math.max(0, Math.min(mouseX - item.x + item.crop.x, item.originalWidth - 10));
          const widthChange = newLeft - item.crop.x;
          newCrop.x = newLeft;
          newCrop.width = Math.max(10, item.crop.width - widthChange);
        }
        if (cropDragHandle.includes('right')) {
          newCrop.width = Math.max(10, Math.min(mouseX - item.x, item.originalWidth - item.crop.x));
        }
        if (cropDragHandle.includes('top')) {
          const newTop = Math.max(0, Math.min(mouseY - item.y + item.crop.y, item.originalHeight - 10));
          const heightChange = newTop - item.crop.y;
          newCrop.y = newTop;
          newCrop.height = Math.max(10, item.crop.height - heightChange);
        }
        if (cropDragHandle.includes('bottom')) {
          newCrop.height = Math.max(10, Math.min(mouseY - item.y, item.originalHeight - item.crop.y));
        }

        updated[selectedFurniture] = {
          ...item,
          crop: newCrop
        };
        return updated;
      });
    }
    // Handle furniture dragging
    else if (isDraggingFurniture) {
      setFurnitureItems(prev => {
        const updated = [...prev];
        updated[selectedFurniture] = {
          ...updated[selectedFurniture],
          x: Math.round(mouseX - furnitureDragOffset.x),
          y: Math.round(mouseY - furnitureDragOffset.y)
        };
        return updated;
      });
    }
  };

  const handleFurnitureMouseUp = () => {
    setIsDraggingFurniture(false);
    setCropDragHandle(null);
  };

  const saveFurnitureToCode = () => {
    const codeOutput = furnitureItems.map((item, index) => {
      const hasCrop = item.crop.x !== 0 || item.crop.y !== 0 ||
                      item.crop.width !== item.originalWidth ||
                      item.crop.height !== item.originalHeight;

      return `{/* Furniture Item ${index + 1} - Replace src with your image path */}
<img
  src="/images/your-furniture-${index + 1}.png"
  alt="Furniture ${index + 1}"
  style={{
    position: 'absolute',
    left: '${item.x}px',
    top: '${item.y}px',
    width: '${Math.round(item.crop.width)}px',
    height: '${Math.round(item.crop.height)}px',${hasCrop ? `
    clipPath: 'inset(${item.crop.y}px ${item.originalWidth - item.crop.x - item.crop.width}px ${item.originalHeight - item.crop.y - item.crop.height}px ${item.crop.x}px)',` : ''}
    imageRendering: 'pixelated',
    pointerEvents: 'none',
    zIndex: ${item.zIndex}
  }}
/>`;
    }).join('\n\n');

    const jsonOutput = JSON.stringify(furnitureItems.map((item, index) => ({
      itemNumber: index + 1,
      imagePath: `/images/your-furniture-${index + 1}.png`,
      x: Math.round(item.x),
      y: Math.round(item.y),
      width: Math.round(item.crop.width),
      height: Math.round(item.crop.height),
      cropX: Math.round(item.crop.x),
      cropY: Math.round(item.crop.y),
      zIndex: item.zIndex,
      note: "Upload your image and replace 'imagePath' with actual path"
    })), null, 2);

    console.log('=== FURNITURE CODE (Copy this into Room.jsx) ===');
    console.log(codeOutput);
    console.log('\n=== FURNITURE JSON (Reference data) ===');
    console.log(jsonOutput);
    console.log('\n💡 INSTRUCTIONS:');
    console.log('1. Save your furniture images to /public/images/');
    console.log('2. Replace "/images/your-furniture-X.png" with actual filenames');
    console.log('3. Paste the code into Room.jsx after the furniture overlay');

    alert('✅ Furniture code exported to console!\n\nPress F12 to open console and copy:\n\n1. The React <img> tags\n2. Save your images to /public/images/\n3. Replace the placeholder paths');
  };

  // Save zones to JSON file
  const saveZonesToFile = () => {
    const jsonData = {
      collisionZones: collisionZones.map(zone => ({
        name: zone.name,
        position: {
          pixel: {
            left: zone.left.toString(),
            top: zone.top.toString()
          }
        },
        size: {
          pixel: {
            width: zone.width.toString(),
            height: zone.height.toString()
          }
        }
      })),
      interactionZones: Object.entries(interactionZones).reduce((acc, [name, zone]) => {
        acc[name] = {
          left: zone.left,
          top: zone.top,
          width: zone.width,
          height: zone.height
        };
        return acc;
      }, {})
    };

    const dataStr = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'yuwon-room-layout.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Visual confirmation
    console.log('✅ Saved zones to yuwon-room-layout.json');
    alert('✅ Zones saved to yuwon-room-layout.json!\n\nCheck your Downloads folder.');
  };

  // Helper functions for resize handles
  const getHandlePosition = (handle) => {
    const positions = {
      nw: { top: '-4px', left: '-4px' },
      ne: { top: '-4px', right: '-4px' },
      sw: { bottom: '-4px', left: '-4px' },
      se: { bottom: '-4px', right: '-4px' },
      n: { top: '-4px', left: '0', width: '100%', height: '8px' },
      s: { bottom: '-4px', left: '0', width: '100%', height: '8px' },
      e: { right: '-4px', top: '0', width: '8px', height: '100%' },
      w: { left: '-4px', top: '0', width: '8px', height: '100%' }
    };
    return positions[handle];
  };

  const getResizeCursor = (handle) => {
    const cursors = {
      nw: 'nw-resize',
      ne: 'ne-resize',
      sw: 'sw-resize',
      se: 'se-resize',
      n: 'n-resize',
      s: 's-resize',
      e: 'e-resize',
      w: 'w-resize'
    };
    return cursors[handle];
  };

  // Mouse handlers for zone editor
  const handleRoomMouseDown = (e) => {
    if (!editMode || isDrawing || isDragging || isResizing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setDrawStart({ x, y });
    setSelectedZone(null);
  };

  const handleRoomMouseMove = (e) => {
    if (!editMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Update current mouse position for drawing preview
    setCurrentMouse({ x: mouseX, y: mouseY });

    // Handle drawing new zone
    if (isDrawing && drawStart) {
      // Preview is rendered below
    }

    // Handle dragging collision zone
    if (isDragging && selectedZone !== null) {
      const newLeft = mouseX - dragOffset.x;
      const newTop = mouseY - dragOffset.y;

      setCollisionZones(prev => {
        const updated = [...prev];
        updated[selectedZone] = {
          ...updated[selectedZone],
          left: Math.max(0, Math.min(roomWidth - updated[selectedZone].width, newLeft)),
          top: Math.max(0, Math.min(roomHeight - updated[selectedZone].height, newTop))
        };
        return updated;
      });
    }

    // Handle dragging interaction zone
    if (isDragging && selectedInteractionZone !== null) {
      const newLeft = mouseX - dragOffset.x;
      const newTop = mouseY - dragOffset.y;

      setInteractionZones(prev => ({
        ...prev,
        [selectedInteractionZone]: {
          ...prev[selectedInteractionZone],
          left: Math.max(0, Math.min(roomWidth - prev[selectedInteractionZone].width, newLeft)),
          top: Math.max(0, Math.min(roomHeight - prev[selectedInteractionZone].height, newTop))
        }
      }));
    }

    // Handle resizing collision zone
    if (isResizing && selectedZone !== null && resizeHandle) {
      setCollisionZones(prev => {
        const updated = [...prev];
        const zone = updated[selectedZone];
        const newZone = { ...zone };

        if (resizeHandle.includes('e')) {
          newZone.width = Math.max(10, mouseX - zone.left);
        }
        if (resizeHandle.includes('w')) {
          const newWidth = zone.width + (zone.left - mouseX);
          if (newWidth >= 10) {
            newZone.left = mouseX;
            newZone.width = newWidth;
          }
        }
        if (resizeHandle.includes('s')) {
          newZone.height = Math.max(10, mouseY - zone.top);
        }
        if (resizeHandle.includes('n')) {
          const newHeight = zone.height + (zone.top - mouseY);
          if (newHeight >= 10) {
            newZone.top = mouseY;
            newZone.height = newHeight;
          }
        }

        updated[selectedZone] = newZone;
        return updated;
      });
    }

    // Handle resizing interaction zone
    if (isResizing && selectedInteractionZone !== null && resizeHandle) {
      setInteractionZones(prev => {
        const zone = prev[selectedInteractionZone];
        const newZone = { ...zone };

        if (resizeHandle.includes('e')) {
          newZone.width = Math.max(10, mouseX - zone.left);
        }
        if (resizeHandle.includes('w')) {
          const newWidth = zone.width + (zone.left - mouseX);
          if (newWidth >= 10) {
            newZone.left = mouseX;
            newZone.width = newWidth;
          }
        }
        if (resizeHandle.includes('s')) {
          newZone.height = Math.max(10, mouseY - zone.top);
        }
        if (resizeHandle.includes('n')) {
          const newHeight = zone.height + (zone.top - mouseY);
          if (newHeight >= 10) {
            newZone.top = mouseY;
            newZone.height = newHeight;
          }
        }

        return {
          ...prev,
          [selectedInteractionZone]: newZone
        };
      });
    }
  };

  const handleRoomMouseUp = (e) => {
    if (isDrawing && drawStart) {
      const rect = e.currentTarget.getBoundingClientRect();
      const endX = e.clientX - rect.left;
      const endY = e.clientY - rect.top;

      const left = Math.min(drawStart.x, endX);
      const top = Math.min(drawStart.y, endY);
      const width = Math.abs(endX - drawStart.x);
      const height = Math.abs(endY - drawStart.y);

      if (width > 5 && height > 5) {
        const newZone = {
          name: `Zone ${collisionZones.length}`,
          left: Math.round(left),
          top: Math.round(top),
          width: Math.round(width),
          height: Math.round(height)
        };
        setCollisionZones(prev => [...prev, newZone]);
        setSelectedZone(collisionZones.length);
      }
    }

    setIsDrawing(false);
    setDrawStart(null);
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  return (
    <div>
      <div className="current-date">
        🏠 MY ROOM
      </div>

      {/* Main container */}
      <div style={{
        maxWidth: '1200px',
        margin: '20px auto',
        padding: '0 20px'
      }}>
        {/* Room container */}
        <div
          onMouseDown={(e) => {
            handleRoomMouseDown(e);
          }}
          onMouseMove={(e) => {
            handleRoomMouseMove(e);
            handleFurnitureMouseMove(e);
          }}
          onMouseUp={(e) => {
            handleRoomMouseUp(e);
            handleFurnitureMouseUp();
          }}
          onMouseLeave={(e) => {
            handleRoomMouseUp(e);
            handleFurnitureMouseUp();
          }}
          style={{
            width: `${roomWidth}px`,
            height: `${roomHeight}px`,
            margin: '0 auto',
            position: 'relative',
            backgroundColor: '#000',
            imageRendering: 'pixelated',
            border: editMode ? '4px solid #ff9800' : '4px solid #e91e63',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: editMode ? '0 8px 32px rgba(255, 152, 0, 0.5)' : '0 8px 32px rgba(233, 30, 99, 0.3)',
            cursor: editMode ? 'crosshair' : 'default'
          }}
        >
          {/* Room background */}
          <img
            src="/images/game-rooms/room_bg.png"
            alt="Room Background"
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              imageRendering: 'pixelated',
              pointerEvents: 'none',
              zIndex: 1
            }}
          />

          {/* Furniture base layer - always behind Yuwon */}
          {!furnitureMode && (
            <img
              src="/images/game-rooms/furniture_base.png"
              alt="Furniture Base"
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                imageRendering: 'pixelated',
                pointerEvents: 'none',
                zIndex: 50
              }}
            />
          )}

          {/* Furniture tops layer - always in front of Yuwon */}
          {!furnitureMode && (
            <img
              src="/images/game-rooms/furniture_tops.png"
              alt="Furniture Tops"
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                imageRendering: 'pixelated',
                pointerEvents: 'none',
                zIndex: 700
              }}
            />
          )}

          {/* Furniture overlay guide in furniture mode */}
          {furnitureMode && showFurnitureOverlay && (
            <>
              <img
                src="/images/game-rooms/furniture_base.png"
                alt="Furniture Base Guide"
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  imageRendering: 'pixelated',
                  pointerEvents: 'none',
                  opacity: 0.5,
                  zIndex: 450
                }}
              />
              <img
                src="/images/game-rooms/furniture_tops.png"
                alt="Furniture Tops Guide"
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  width: '100%',
                  height: '100%',
                  imageRendering: 'pixelated',
                  pointerEvents: 'none',
                  opacity: 0.5,
                  zIndex: 450
                }}
              />
            </>
          )}

          {/* Custom furniture pieces (placed with furniture editor) */}
          {!furnitureMode && (
            <>
              {/* Carpets */}
              {[
                { src: '/images/game-rooms/Carpet_1.png', x: 64, y: 136, w: 80, h: 96, z: 1 },
                { src: '/images/game-rooms/Carpet_2.png', x: 17, y: 279, w: 64, h: 32, z: 1 },
                { src: '/images/game-rooms/Carpet_3.png', x: 317, y: 138, w: 48, h: 64, z: 1 },
                { src: '/images/game-rooms/Carpet_4.png', x: 500, y: 125, w: 64, h: 32, z: 1 }
              ].map((item, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`,
                zIndex: item.z
              }}
              title={item.src.split('/').pop()}
            >
              <img
                src={item.src}
                alt={item.src.split('/').pop()}
                style={{
                  width: `${item.w}px`,
                  height: `${item.h}px`,
                  imageRendering: 'pixelated',
                  pointerEvents: 'none',
                  display: 'block'
                }}
              />
              {showHelpers && (
                <div style={{
                  position: 'absolute',
                  bottom: '-18px',
                  left: '0',
                  fontSize: '8px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: 'lime',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none'
                }}>
                  {item.src.split('/').pop()}
                </div>
              )}
            </div>
              ))}

              {/* Sofa - at base furniture level */}
              <div style={{ position: 'absolute', left: '152px', top: '128px', zIndex: 50 }} title="Sofa.png">
                <img src="/images/game-rooms/Sofa.png" alt="Sofa" style={{ imageRendering: 'pixelated', pointerEvents: 'none', display: 'block' }} />
                {showHelpers && (
                  <div style={{ position: 'absolute', bottom: '-18px', left: '0', fontSize: '8px', background: 'rgba(0, 0, 0, 0.8)', color: 'lime', padding: '2px 4px', borderRadius: '3px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
                    Sofa.png
                  </div>
                )}
              </div>

              {/* Kitchen Island - at base furniture level */}
              <div style={{ position: 'absolute', left: '251px', top: '143px', zIndex: 50 }} title={hasFood ? 'Kitchen Island_Decorated.png' : 'Kitchen Island_Empty.png'}>
                <img
                  src={hasFood ? '/images/game-rooms/Kitchen Island_Decorated.png' : '/images/game-rooms/Kitchen Island_Empty.png'}
                  alt={hasFood ? 'Kitchen Island Decorated' : 'Kitchen Island Empty'}
                  style={{ imageRendering: 'pixelated', pointerEvents: 'none', display: 'block' }}
                />
                {showHelpers && (
                  <div style={{ position: 'absolute', bottom: '-18px', left: '0', fontSize: '8px', background: 'rgba(0, 0, 0, 0.8)', color: 'lime', padding: '2px 4px', borderRadius: '3px', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
                    {hasFood ? 'Kitchen Island_Decorated.png' : 'Kitchen Island_Empty.png'}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Furniture items in editor */}
          {furnitureMode && furnitureItems.map((item, index) => (
            <div
              key={item.id}
              onMouseDown={(e) => handleFurnitureMouseDown(e, index)}
              style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`,
                width: `${item.crop.width}px`,
                height: `${item.crop.height}px`,
                border: selectedFurniture === index ? '3px solid cyan' : '2px solid rgba(0, 255, 255, 0.3)',
                cursor: cropMode ? 'default' : 'move',
                zIndex: item.zIndex,
                pointerEvents: 'auto',
                boxSizing: 'border-box'
              }}
            >
              <img
                src={item.src}
                alt="Furniture"
                style={{
                  position: 'absolute',
                  left: `-${item.crop.x}px`,
                  top: `-${item.crop.y}px`,
                  width: `${item.originalWidth}px`,
                  height: `${item.originalHeight}px`,
                  imageRendering: 'pixelated',
                  pointerEvents: 'none'
                }}
              />
              {selectedFurniture === index && !cropMode && (
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  right: '-30px',
                  background: 'white',
                  padding: '4px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  whiteSpace: 'nowrap',
                  border: '2px solid cyan',
                  zIndex: 10001
                }}>
                  x:{item.x} y:{item.y} z:{item.zIndex}
                </div>
              )}

              {/* Crop handles */}
              {selectedFurniture === index && cropMode && (
                <>
                  {/* Corner handles */}
                  {['topleft', 'topright', 'bottomleft', 'bottomright'].map(handle => (
                    <div
                      key={handle}
                      onMouseDown={(e) => handleCropHandleMouseDown(e, handle)}
                      style={{
                        position: 'absolute',
                        width: '12px',
                        height: '12px',
                        background: 'yellow',
                        border: '2px solid black',
                        cursor: handle.includes('top') && handle.includes('left') ? 'nw-resize'
                          : handle.includes('top') && handle.includes('right') ? 'ne-resize'
                          : handle.includes('bottom') && handle.includes('left') ? 'sw-resize'
                          : 'se-resize',
                        zIndex: 10002,
                        ...(handle === 'topleft' && { top: '-6px', left: '-6px' }),
                        ...(handle === 'topright' && { top: '-6px', right: '-6px' }),
                        ...(handle === 'bottomleft' && { bottom: '-6px', left: '-6px' }),
                        ...(handle === 'bottomright' && { bottom: '-6px', right: '-6px' })
                      }}
                    />
                  ))}
                  {/* Edge handles */}
                  {['top', 'bottom', 'left', 'right'].map(handle => (
                    <div
                      key={handle}
                      onMouseDown={(e) => handleCropHandleMouseDown(e, handle)}
                      style={{
                        position: 'absolute',
                        background: 'yellow',
                        border: '2px solid black',
                        cursor: handle === 'top' || handle === 'bottom' ? 'ns-resize' : 'ew-resize',
                        zIndex: 10002,
                        ...(handle === 'top' && { top: '-6px', left: '50%', transform: 'translateX(-50%)', width: '12px', height: '12px' }),
                        ...(handle === 'bottom' && { bottom: '-6px', left: '50%', transform: 'translateX(-50%)', width: '12px', height: '12px' }),
                        ...(handle === 'left' && { left: '-6px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px' }),
                        ...(handle === 'right' && { right: '-6px', top: '50%', transform: 'translateY(-50%)', width: '12px', height: '12px' })
                      }}
                    />
                  ))}
                  {/* Crop info */}
                  <div style={{
                    position: 'absolute',
                    top: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'yellow',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    whiteSpace: 'nowrap',
                    border: '2px solid black',
                    color: 'black',
                    fontWeight: 'bold',
                    zIndex: 10001
                  }}>
                    ✂️ CROP MODE
                  </div>
                </>
              )}
            </div>
          ))}

          {/* Collision zones visualization/editing */}
          {(showHelpers || showCoordinates) && collisionZones.map((zone, index) => (
            <div
              key={index}
              onClick={(e) => {
                if (editMode) {
                  e.stopPropagation();
                  setSelectedZone(index);
                }
              }}
              onMouseDown={(e) => {
                if (editMode && !isResizing) {
                  e.stopPropagation();
                  setSelectedZone(index);
                  setIsDragging(true);
                  const rect = e.currentTarget.getBoundingClientRect();
                  const parentRect = e.currentTarget.parentElement.getBoundingClientRect();
                  setDragOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                }
              }}
              style={{
                position: 'absolute',
                left: `${zone.left}px`,
                top: `${zone.top}px`,
                width: `${zone.width}px`,
                height: `${zone.height}px`,
                border: selectedZone === index ? '3px solid rgba(255, 0, 0, 0.9)' : showHelpers ? '2px solid rgba(255, 0, 0, 0.5)' : '2px solid rgba(255, 0, 0, 0.3)',
                background: selectedZone === index ? 'rgba(255, 0, 0, 0.25)' : showHelpers ? 'rgba(255, 0, 0, 0.1)' : 'rgba(255, 0, 0, 0.05)',
                pointerEvents: editMode ? 'auto' : 'none',
                cursor: editMode ? 'move' : 'default',
                zIndex: selectedZone === index ? 10000 : 9999,
                fontSize: '10px',
                color: 'red',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {zone.name || index}

              {/* Zone coordinates */}
              {showCoordinates && (
                <div style={{
                  position: 'absolute',
                  bottom: '-22px',
                  left: '0',
                  fontSize: '9px',
                  color: 'white',
                  fontWeight: 'bold',
                  background: 'rgba(0, 0, 0, 0.8)',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap'
                }}>
                  L:{zone.left} T:{zone.top} W:{zone.width} H:{zone.height}
                </div>
              )}

              {/* Delete button */}
              {editMode && selectedZone === index && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCollisionZones(prev => prev.filter((_, i) => i !== selectedZone));
                    setSelectedZone(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: '-30px',
                    right: '-30px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid red',
                    background: 'white',
                    color: 'red',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10002
                  }}
                >
                  ×
                </button>
              )}

              {/* Resize handles */}
              {editMode && selectedZone === index && (
                <>
                  {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map(handle => (
                    <div
                      key={handle}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setIsResizing(true);
                        setResizeHandle(handle);
                      }}
                      style={{
                        position: 'absolute',
                        width: handle.length === 1 ? '100%' : '8px',
                        height: handle.length === 1 ? '100%' : '8px',
                        background: 'white',
                        border: '2px solid red',
                        ...getHandlePosition(handle),
                        cursor: getResizeCursor(handle),
                        zIndex: 10001
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          ))}

          {/* Interaction zones visualization */}
          {showHelpers && Object.entries(interactionZones).map(([name, zone]) => (
            <div
              key={name}
              onClick={(e) => {
                if (editMode) {
                  e.stopPropagation();
                  setSelectedInteractionZone(name);
                  setSelectedZone(null);
                }
              }}
              onMouseDown={(e) => {
                if (editMode && !isResizing) {
                  e.stopPropagation();
                  setSelectedInteractionZone(name);
                  setSelectedZone(null);
                  setIsDragging(true);
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDragOffset({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                  });
                }
              }}
              style={{
                position: 'absolute',
                left: `${zone.left}px`,
                top: `${zone.top}px`,
                width: `${zone.width}px`,
                height: `${zone.height}px`,
                border: selectedInteractionZone === name ? '3px solid rgba(0, 255, 0, 0.9)' : '2px solid rgba(0, 255, 0, 0.7)',
                background: selectedInteractionZone === name ? 'rgba(0, 255, 0, 0.25)' : 'rgba(0, 255, 0, 0.15)',
                pointerEvents: editMode ? 'auto' : 'none',
                cursor: editMode ? 'move' : 'default',
                zIndex: selectedInteractionZone === name ? 10000 : 9999,
                fontSize: '10px',
                color: 'lime',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {name}

              {/* Coordinates display */}
              {showCoordinates && (
                <div style={{
                  position: 'absolute',
                  bottom: '-22px',
                  left: '0',
                  fontSize: '9px',
                  color: 'white',
                  fontWeight: 'bold',
                  background: 'rgba(0, 0, 0, 0.8)',
                  padding: '2px 4px',
                  borderRadius: '3px',
                  whiteSpace: 'nowrap'
                }}>
                  L:{zone.left} T:{zone.top} W:{zone.width} H:{zone.height}
                </div>
              )}

              {/* Resize handles for interaction zones */}
              {editMode && selectedInteractionZone === name && (
                <>
                  {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map(handle => (
                    <div
                      key={handle}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setIsResizing(true);
                        setResizeHandle(handle);
                      }}
                      style={{
                        position: 'absolute',
                        width: handle.length === 1 ? '100%' : '8px',
                        height: handle.length === 1 ? '100%' : '8px',
                        background: 'lime',
                        border: '2px solid darkgreen',
                        ...getHandlePosition(handle),
                        cursor: getResizeCursor(handle),
                        zIndex: 10001
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          ))}

          {/* Yuwon hitbox visualization */}
          {showHitbox && (
            <div
              style={{
                position: 'absolute',
                left: `${yuwonPosition.x - 4 + 4}px`,
                top: `${yuwonPosition.y - 4 + 18}px`,
                width: '8px',
                height: '8px',
                border: '2px solid rgba(0, 150, 255, 0.8)',
                background: 'rgba(0, 150, 255, 0.2)',
                pointerEvents: 'none',
                zIndex: 10000
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '12px',
                fontSize: '10px',
                color: 'cyan',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '2px 4px',
                borderRadius: '4px'
              }}>
                ({Math.round(yuwonPosition.x)}, {Math.round(yuwonPosition.y)})
              </div>
            </div>
          )}

          {/* Noah hitbox visualization */}
          {showHitbox && (
            <div
              style={{
                position: 'absolute',
                left: `${noah.x - noah.collisionWidth / 2}px`,
                top: `${noah.y - noah.collisionHeight / 2 + 10}px`,
                width: `${noah.collisionWidth}px`,
                height: `${noah.collisionHeight}px`,
                border: '2px solid rgba(255, 150, 0, 0.8)',
                background: 'rgba(255, 150, 0, 0.2)',
                pointerEvents: 'none',
                zIndex: 10000
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-20px',
                left: '16px',
                fontSize: '10px',
                color: 'orange',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '2px 4px',
                borderRadius: '4px'
              }}>
                ({Math.round(noah.x)}, {Math.round(noah.y)})
              </div>
            </div>
          )}

          {/* Drawing preview */}
          {isDrawing && drawStart && currentMouse && (
            <div
              style={{
                position: 'absolute',
                left: `${Math.min(drawStart.x, currentMouse.x)}px`,
                top: `${Math.min(drawStart.y, currentMouse.y)}px`,
                width: `${Math.abs(currentMouse.x - drawStart.x)}px`,
                height: `${Math.abs(currentMouse.y - drawStart.y)}px`,
                border: '2px dashed yellow',
                background: 'rgba(255, 255, 0, 0.2)',
                pointerEvents: 'none',
                zIndex: 10002
              }}
            />
          )}

          {/* Helper toggle hint */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: editMode ? 'rgba(255, 152, 0, 0.9)' : 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: '600',
            zIndex: 10001,
            pointerEvents: editMode ? 'auto' : 'none',
            textAlign: 'right'
          }}>
            {editMode ? (
              <>
                <div>🔧 EDIT MODE</div>
                <div style={{ fontSize: '9px', marginTop: '4px' }}>
                  Draw: Click & drag | Move: Drag zone | Resize: Drag handles | Delete: × button
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    saveZonesToFile();
                  }}
                  style={{
                    marginTop: '8px',
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  💾 Save Zones
                </button>
              </>
            ) : (
              <>
                <div>Press H for helpers</div>
                <div style={{ fontSize: '9px', marginTop: '4px' }}>Press E for edit mode | Press C for coordinates</div>
              </>
            )}
          </div>

          {/* Noah sprite */}
          <div style={{
            position: 'absolute',
            left: `${noah.x}px`,
            top: `${noah.y}px`,
            transform: 'translate(-50%, -50%)',
            imageRendering: 'pixelated',
            pointerEvents: 'none',
            zIndex: noah.y
          }}>
            <img
              src={noah.direction === 'up'
                ? '/images/walking-sprites/Noah/Noah_Walking_Back.gif'
                : noah.direction === 'down'
                ? '/images/walking-sprites/Noah/Noah_Walking_Front.gif'
                : '/images/walking-sprites/Noah/Noah_Walking_Side.gif'}
              alt="Noah"
              style={{
                height: 'auto',
                imageRendering: 'pixelated',
                display: noah.isWalking ? 'block' : 'none',
                transform: noah.direction === 'left' ? 'scaleX(-1)' : 'none'
              }}
            />
            <img
              src={noah.direction === 'up'
                ? '/images/walking-sprites/Noah/Noah_Idle_Back.gif'
                : noah.direction === 'down'
                ? '/images/walking-sprites/Noah/Noah_Idle_Front.gif'
                : '/images/walking-sprites/Noah/Noah_Idle_Side.gif'}
              alt="Noah idle"
              style={{
                height: 'auto',
                imageRendering: 'pixelated',
                display: noah.isWalking ? 'none' : 'block',
                transform: noah.direction === 'left' ? 'scaleX(-1)' : 'none'
              }}
            />
          </div>

          {/* Yuwon sprite with item on head */}
          <div style={{
            position: 'absolute',
            left: `${yuwonPosition.x}px`,
            top: `${yuwonPosition.y}px`,
            transform: 'translate(-50%, -50%)',
            imageRendering: 'pixelated',
            pointerEvents: 'none',
            zIndex: (() => {
              const y = yuwonPosition.y;

              // Yuwon's z-index is always between furniture_base (50) and furniture_tops (700)
              // Dynamic based on Y position for proper depth sorting with Noah
              const baseZ = Math.max(200, Math.min(600, y + 200));

              // Adjust relative to Noah for proper layering
              if (y < noah.y) {
                return Math.min(baseZ, noah.y - 1);
              } else {
                return Math.max(baseZ, noah.y + 1);
              }
            })()
          }}>
            {/* Held item on head */}
            {heldItem && (
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '-12px',
                transform: 'translateX(-50%)',
                width: '16px',
                height: '16px',
                animation: 'bounceItem 1s ease-in-out infinite',
                zIndex: 1000
              }}>
                <img
                  src={heldItem.image}
                  alt={heldItem.name}
                  style={{
                    width: '16px',
                    height: '16px',
                    imageRendering: 'pixelated'
                  }}
                />
              </div>
            )}

            {/* Yuwon sprite */}
            <img
              src={direction === 'up'
                ? '/images/walking-sprites/Yuwon/Yuwon_Walking_Back.gif'
                : direction === 'down'
                ? '/images/walking-sprites/Yuwon/Yuwon_Walking_Front.gif'
                : '/images/walking-sprites/Yuwon/Yuwon_Walking_Side.gif'}
              alt="Yuwon"
              style={{
                height: 'auto',
                imageRendering: 'pixelated',
                display: isWalking ? 'block' : 'none',
                transform: direction === 'left' ? 'scaleX(-1)' : 'none'
              }}
            />
            <img
              src={direction === 'up'
                ? '/images/walking-sprites/Yuwon/Yuwon_Idle_Back.gif'
                : direction === 'down'
                ? '/images/walking-sprites/Yuwon/Yuwon_Idle_Front.gif'
                : '/images/walking-sprites/Yuwon/Yuwon_Idle_Side.gif'}
              alt="Yuwon idle"
              style={{
                height: 'auto',
                imageRendering: 'pixelated',
                display: isWalking ? 'none' : 'block',
                transform: direction === 'left' ? 'scaleX(-1)' : 'none'
              }}
            />
          </div>

          {/* E prompt for Noah */}
          {nearbyCharacter === 'noah' && !showVNDialogue && (
            <div style={{
              position: 'absolute',
              left: '50%',
              top: `${noah.y - 30}px`,
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 10000,
              animation: 'bounce 1s ease-in-out infinite',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              Press <span style={{ background: 'rgba(255, 255, 255, 0.3)', padding: '2px 6px', borderRadius: '4px', fontWeight: '900' }}>E</span> to Talk
            </div>
          )}

          {/* VN Dialogue */}
          {showVNDialogue && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '85%',
                maxWidth: '500px',
                zIndex: 1000,
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-end',
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              }}
            >
              {/* Character portrait */}
              <div style={{ flexShrink: 0, width: '90px' }}>
                <img
                  src={vnDialogueType === 'noah'
                    ? "/images/vn_sprites_head/portrait_noah_neutral.png"
                    : "/images/vn_sprites_head/portrait_yuwon_smile.png"}
                  alt={vnDialogueType === 'noah' ? 'Noah' : 'Yuwon'}
                  style={{
                    width: '90px',
                    height: 'auto',
                    display: 'block'
                  }}
                />
              </div>

              {/* Dialogue content */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* Character name */}
                <div style={{
                  background: vnDialogueType === 'noah'
                    ? 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)'
                    : 'linear-gradient(135deg, #e1bee7 0%, #ce93d8 100%)',
                  color: vnDialogueType === 'noah' ? 'white' : '#4a148c',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '700',
                  alignSelf: 'flex-start'
                }}>
                  {vnDialogueType === 'noah' ? 'Noah' : 'Yuwon'}
                </div>

                {/* Dialogue text */}
                <div style={{
                  color: '#666',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  fontWeight: '500'
                }}>
                  {vnDialogueType === 'noah' && dialogueMode === 'menu'
                    ? "What do you want?"
                    : vnDialogueType === 'noah' && dialogueMode === 'talk'
                    ? noahMessages[currentNoahMessage]
                    : vnDialogueType === 'stove'
                    ? "I'm feeling like cooking! ✨"
                    : vnDialogueType === 'fridge'
                    ? "Let me see what's inside~ 🌸"
                    : "Let's see what I cooked! 🍽️"}
                </div>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {vnDialogueType === 'noah' && dialogueMode === 'menu' && (
                    <>
                      <button
                        onClick={() => {
                          setDialogueMode('talk');
                          setCurrentNoahMessage(Math.floor(Math.random() * noahMessages.length));
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #673ab7 0%, #512da8 100%)',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'transform 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      >
                        💬 Talk
                      </button>
                      {heldItem && (
                        <button
                          onClick={() => {
                            const reaction = getGiftReaction('noah', heldItem.id);
                            giftDish('noah', heldItem.id);
                            addFriendshipPoints('noah', reaction.points);
                            setGiftReaction(reaction);
                            setHeldItem(null);
                            setDialogueMode('talk');
                          }}
                          style={{
                            background: 'linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                        >
                          🎁 Gift {heldItem.name}
                        </button>
                      )}
                    </>
                  )}

                  {vnDialogueType !== 'noah' && (
                    <button
                      onClick={() => {
                        setShowVNDialogue(false);
                        if (vnDialogueType === 'stove') setShowStoveModal(true);
                        else if (vnDialogueType === 'fridge') setShowFridgeModal(true);
                        else if (vnDialogueType === 'table') setShowTableModal(true);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #ff6b9d 0%, #e91e63 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      {vnDialogueType === 'stove' ? '🍳 Cook' : vnDialogueType === 'fridge' ? '🧊 Fridge' : '🍽️ Table'}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowVNDialogue(false);
                      setDialogueMode('menu');
                      setGiftReaction(null);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #d4a5ff 0%, #b18cdb 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {giftReaction ? '✓ Close' : 'Later~'}
                  </button>
                </div>

                {/* Gift reaction */}
                {giftReaction && (
                  <div style={{
                    marginTop: '8px',
                    padding: '8px 12px',
                    background: giftReaction.points >= 15 ? '#e8f5e9' : giftReaction.points >= 5 ? '#fff8e1' : '#ffebee',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#333'
                  }}>
                    <div style={{ fontWeight: '700', marginBottom: '4px' }}>
                      {giftReaction.points >= 15 ? '💖 Loved it!' : giftReaction.points >= 5 ? '😊 Liked it' : '😐 Not a fan'} (+{giftReaction.points} points)
                    </div>
                    <div>{giftReaction.message}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Furniture Mode Toggle Button */}
        {!editMode && !furnitureMode && (
          <button
            onClick={() => setFurnitureMode(true)}
            style={{
              position: 'fixed',
              left: '20px',
              bottom: '20px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 188, 212, 0.4)',
              zIndex: 10001
            }}
          >
            🪑 Furniture Editor
          </button>
        )}

        {/* Furniture Editor Panel */}
        {furnitureMode && (
          <div style={{
            position: 'fixed',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 255, 255, 0.95)',
            padding: '16px',
            borderRadius: '12px',
            zIndex: 10002,
            minWidth: '200px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '12px', color: '#000' }}>
              🪑 FURNITURE EDITOR
            </div>

            <button
              onClick={handleAddFurniture}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '8px',
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              + Add Image
            </button>

            <button
              onClick={() => setShowFurnitureOverlay(prev => !prev)}
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '8px',
                background: showFurnitureOverlay ? '#ff9800' : '#757575',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {showFurnitureOverlay ? '👁️ Hide' : '👁️ Show'} Overlay
            </button>

            {selectedFurniture !== null && furnitureItems[selectedFurniture] && (
              <div style={{
                marginTop: '12px',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '6px',
                fontSize: '11px'
              }}>
                <div style={{ fontWeight: '700', marginBottom: '8px' }}>Selected Item</div>

                <button
                  onClick={() => setCropMode(prev => !prev)}
                  style={{
                    width: '100%',
                    padding: '6px',
                    marginBottom: '8px',
                    background: cropMode ? '#ffeb3b' : '#9c27b0',
                    color: cropMode ? 'black' : 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {cropMode ? '✂️ Crop Mode ON' : '✂️ Enable Crop Mode'}
                </button>

                <div style={{ marginBottom: '4px' }}>
                  <label style={{ display: 'block', fontWeight: '600' }}>Z-Index:</label>
                  <input
                    type="number"
                    value={furnitureItems[selectedFurniture].zIndex}
                    onChange={(e) => {
                      const newZ = parseInt(e.target.value);
                      setFurnitureItems(prev => {
                        const updated = [...prev];
                        updated[selectedFurniture] = {
                          ...updated[selectedFurniture],
                          zIndex: newZ
                        };
                        return updated;
                      });
                    }}
                    style={{
                      width: '100%',
                      padding: '4px',
                      marginTop: '2px',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                </div>

                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>Crop:</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                    <div>
                      <label style={{ fontSize: '10px' }}>X:</label>
                      <input
                        type="number"
                        value={furnitureItems[selectedFurniture].crop.x}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setFurnitureItems(prev => {
                            const updated = [...prev];
                            updated[selectedFurniture].crop.x = val;
                            return updated;
                          });
                        }}
                        style={{ width: '100%', padding: '2px', fontSize: '10px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px' }}>Y:</label>
                      <input
                        type="number"
                        value={furnitureItems[selectedFurniture].crop.y}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setFurnitureItems(prev => {
                            const updated = [...prev];
                            updated[selectedFurniture].crop.y = val;
                            return updated;
                          });
                        }}
                        style={{ width: '100%', padding: '2px', fontSize: '10px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px' }}>W:</label>
                      <input
                        type="number"
                        value={furnitureItems[selectedFurniture].crop.width}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setFurnitureItems(prev => {
                            const updated = [...prev];
                            updated[selectedFurniture].crop.width = val;
                            return updated;
                          });
                        }}
                        style={{ width: '100%', padding: '2px', fontSize: '10px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '10px' }}>H:</label>
                      <input
                        type="number"
                        value={furnitureItems[selectedFurniture].crop.height}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setFurnitureItems(prev => {
                            const updated = [...prev];
                            updated[selectedFurniture].crop.height = val;
                            return updated;
                          });
                        }}
                        style={{ width: '100%', padding: '2px', fontSize: '10px' }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFurnitureItems(prev => prev.filter((_, i) => i !== selectedFurniture));
                    setSelectedFurniture(null);
                  }}
                  style={{
                    width: '100%',
                    padding: '6px',
                    marginTop: '8px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Delete Item
                </button>
              </div>
            )}

            <button
              onClick={saveFurnitureToCode}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '12px',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              💾 Export Code
            </button>

            <button
              onClick={() => setFurnitureMode(false)}
              style={{
                width: '100%',
                padding: '8px',
                marginTop: '8px',
                background: '#9e9e9e',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Close Editor
            </button>
          </div>
        )}

        {/* Places section */}
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ fontSize: '18px', color: '#e91e63', marginBottom: '20px', textAlign: 'center' }}>
            🏪 PLACES
          </h3>
          <div style={{
            display: 'flex',
            gap: '25px',
            justifyContent: 'center',
            alignItems: 'flex-end',
            flexWrap: 'wrap'
          }}>
            {placesConfig.map(place => (
              <div
                key={place.id}
                onClick={() => navigate(place.route)}
                style={{
                  width: '140px',
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1.15)';
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector('img');
                  if (img) img.style.transform = 'scale(1)';
                }}
              >
                <div style={{
                  width: '100%',
                  height: '140px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'visible',
                  position: 'relative'
                }}>
                  <img
                    src={place.icon}
                    alt={place.name}
                    style={{
                      width: '80%',
                      height: '80%',
                      objectFit: 'contain',
                      imageRendering: 'pixelated',
                      transition: 'transform 0.3s'
                    }}
                  />
                </div>
                <div style={{
                  marginTop: '12px',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: '#333'
                }}>
                  {place.name}
                </div>
                <div style={{
                  marginTop: '4px',
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#666'
                }}>
                  {place.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODALS WILL GO HERE - To be added next */}
    </div>
  );
}

export default RoomEditor;
