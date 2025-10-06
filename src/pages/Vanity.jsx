import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { furnitureCatalog } from '../data/furniture';
import { outfitsCatalog } from '../data/outfits';

function Vanity() {
  const { yuCash, setYuCash } = useApp();

  // Room state
  const [placedFurniture, setPlacedFurniture] = useState([]);
  const [placedCharacters, setPlacedCharacters] = useState([]);
  const [showSampleRoom, setShowSampleRoom] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [ownedFurniture, setOwnedFurniture] = useState([]); // Array of {id, quantity}
  const [ownedOutfits, setOwnedOutfits] = useState({
    yuwon: ['yuwon_outfit_1'],
    noah: ['noah_outfit_1'],
    jaehyun: ['Jaehyun_outfit_1'],
    minkyu: ['minkyu_outfit_1']
  });

  // Playable character selection (locked to Yuwon since it's Yuwon's room)
  const playableCharacter = 'yuwon'; // Always Yuwon in Yuwon's room
  const [showDialogue, setShowDialogue] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState({ character: '', text: '', isClosing: false });
  const [dialogueTimeouts, setDialogueTimeouts] = useState({ fadeOut: null, hide: null });

  // Paired bond system - Fire Emblem style!
  // Each pair has one shared bond level regardless of who's talking
  const [pairedBonds, setPairedBonds] = useState({
    'yuwon_noah': 0,
    'yuwon_jaehyun': 0,
    'yuwon_minkyu': 0,
    'noah_jaehyun': 0,
    'noah_minkyu': 0,
    'jaehyun_minkyu': 0
  });

  const [lastTalkDate, setLastTalkDate] = useState({
    'yuwon_noah': null,
    'yuwon_jaehyun': null,
    'yuwon_minkyu': null,
    'noah_jaehyun': null,
    'noah_minkyu': null,
    'jaehyun_minkyu': null
  });

  // Helper function to get pair key (always in alphabetical order)
  const getPairKey = (char1, char2) => {
    return [char1, char2].sort().join('_');
  };
  const [inventory, setInventory] = useState([]); // Array of {id, name, image, quantity}
  const [showGiftPopup, setShowGiftPopup] = useState(false);
  const [selectedGiftCharacter, setSelectedGiftCharacter] = useState(null);

  // Gift shop catalog
  const giftCatalog = [
    { id: 'apple', name: 'Apple', image: '🍎', price: 50, currency: 'yuCash' },
    { id: 'pen', name: 'Pen', image: '🖊️', price: 30, currency: 'yuCash' },
    { id: 'tie', name: 'Tie', image: '👔', price: 100, currency: 'ncc' },
    { id: 'book', name: 'Book', image: '📚', price: 80, currency: 'yuCash' },
    { id: 'burger', name: 'Burger', image: '🍔', price: 60, currency: 'yuCash' }
  ];

  // Relationship types (who can the playable character romance?)
  const relationshipTypes = {
    yuwon: { noah: 'romance', jaehyun: 'romance', minkyu: 'friendship' },
    noah: { yuwon: 'romance', jaehyun: 'friendship', minkyu: 'friendship' },
    minkyu: { jaehyun: 'romance', yuwon: 'friendship', noah: 'friendship' },
    jaehyun: { yuwon: 'romance', minkyu: 'romance', noah: 'friendship' }
  };

  // Dialogue library based on character dynamics
  const dialogueLibrary = {
    // Yuwon (gay chaos tsundere) talking to others
    yuwon: {
      noah: {
        0: ["...What do you want?", "I'm busy.", "Oh. It's you."],
        20: ["Don't get the wrong idea.", "I-I wasn't waiting for you!", "Tch, whatever."],
        40: ["You're... actually not that annoying.", "I guess you're okay.", "...Thanks for earlier."],
        60: ["Stop looking at me like that...", "Why do you care so much?", "You're too close..."],
        80: ["I... I like when you're around.", "Maybe I do care about you.", "Don't leave, okay?"],
        100: ["I love you, idiot.", "You're mine.", "Kiss me already."]
      },
      jaehyun: {
        0: ["Yooo bestie!", "What's the chaos today?", "Jae! My guy!"],
        20: ["Bro you're unhinged lmao", "Stop flirting with everyone!", "You're such a mess"],
        40: ["Love you bro, no homo— wait full homo", "You're my ride or die", "Chaotic besties forever!"],
        60: ["I trust you with my life", "Thanks for always having my back", "You really get me"],
        80: ["You mean everything to me", "I don't know what I'd do without you", "My forever person"],
        100: ["I'm so in love with you", "Let's get married for tax benefits lmao jk unless", "You're the one"]
      },
      minkyu: {
        0: ["Hey new guy!", "Settling in okay?", "Sup Minkyu!"],
        20: ["You're pretty chill", "Wanna grab lunch?", "How's work going?"],
        40: ["You're a good friend", "Glad you joined the team", "You fit right in!"],
        60: ["I really appreciate you", "You're one of my best friends now", "Thanks for being here"],
        80: ["You're like family to me", "I'm so glad we met", "Best coworker ever!"],
        100: ["Ride or die friend!", "You're stuck with me forever", "Found family vibes 💕"]
      }
    },
    // Noah (cool CEO, cold to Yuwon) talking to others
    noah: {
      yuwon: {
        0: ["...", "What is it?", "Make it quick."],
        20: ["I'm busy.", "Did you need something?", "...Fine."],
        40: ["You seem... happier lately.", "I suppose that's fine.", "Hmm."],
        60: ["Why do I feel like this around you?", "You're different from them.", "I... don't understand."],
        80: ["Maybe I was wrong about you.", "I want to understand you better.", "Stay close to me."],
        100: ["I love you. I always have.", "You're the only one I see.", "Be mine."]
      },
      jaehyun: {
        0: ["Jaehyun.", "Status report?", "Keep up the good work."],
        20: ["You're reliable.", "Good job today.", "I appreciate your work."],
        40: ["You're a good friend.", "Thanks for everything.", "Let's grab a drink."],
        60: ["I trust you completely.", "You're important to me.", "Thank you, friend."],
        80: ["You're like a brother to me.", "I value our friendship deeply.", "Always got your back."],
        100: ["Best friend for life.", "Brotherhood forever.", "My most trusted ally."]
      },
      minkyu: {
        0: ["New hire, correct?", "Welcome aboard.", "Work hard."],
        20: ["You're doing well.", "Keep it up.", "Good progress."],
        40: ["I respect your work ethic.", "You're a solid team member.", "Well done."],
        60: ["You've earned my respect.", "Glad to have you on the team.", "You're talented."],
        80: ["You're one of the best.", "I'm impressed with your growth.", "Valuable member."],
        100: ["A true friend and colleague.", "I'm proud to work with you.", "You're family now."]
      }
    },
    // Jaehyun (Hongdae fuckboy, loves Yuwon, flirty with Minkyu) talking to others
    jaehyun: {
      yuwon: {
        0: ["Yooo baby!", "My favorite person!", "There's my sunshine!"],
        20: ["You look cute today", "Missed you~", "Let's cause chaos together!"],
        40: ["You know I adore you right?", "You're my favorite human", "I'm here for you always"],
        60: ["I care about you so much", "You mean the world to me", "I'd do anything for you"],
        80: ["I love you, you know that?", "You're my person", "I've loved you for years"],
        100: ["I'm completely in love with you", "Please be mine", "You're my everything"]
      },
      minkyu: {
        0: ["Hey there, cutie~", "Well hello handsome", "New guy looking good!"],
        20: ["You're pretty interesting~", "Wanna hang out sometime?", "Those eyes though 👀"],
        40: ["You're really something special", "I like spending time with you", "You're gorgeous"],
        60: ["Can't stop thinking about you", "You drive me crazy", "Come closer~"],
        80: ["I really like you", "You're so beautiful", "Want to be more than friends?"],
        100: ["I'm falling for you", "Be with me", "You're perfect"]
      },
      noah: {
        0: ["Boss man!", "What's up Noah?", "Yo CEO!"],
        20: ["Thanks for the opportunity!", "You're a great boss", "Respect!"],
        40: ["Glad we're friends outside work", "You're cool people", "Brotherhood!"],
        60: ["You're a real one", "Thanks for having my back", "Loyal friend"],
        80: ["You're like a brother", "I trust you completely", "Friends for life"],
        100: ["Best friend forever", "My ride or die", "Brotherhood eternal"]
      }
    },
    // Minkyu (kuudere newbie, crushing on Jaehyun) talking to others
    minkyu: {
      jaehyun: {
        0: ["...Hi.", "Oh. Hey.", "Jaehyun."],
        20: ["You're... not bad.", "I guess you're okay.", "...Whatever."],
        40: ["I don't mind your company.", "You're interesting.", "...Thanks."],
        60: ["Why do you make me feel like this?", "I... like talking to you.", "Don't go."],
        80: ["I think I... like you.", "You're special to me.", "Stay with me."],
        100: ["I love you.", "Be mine.", "You're everything."]
      },
      yuwon: {
        0: ["Hey Yuwon.", "What's up?", "Oh, hi."],
        20: ["You're pretty fun.", "I like your energy.", "You're cool."],
        40: ["You're a good friend.", "Thanks for being nice to me.", "I appreciate you."],
        60: ["You really get me.", "Glad we're friends.", "You're important to me."],
        80: ["You're one of my best friends.", "I trust you completely.", "Thank you for everything."],
        100: ["Best friends forever.", "You're family.", "My closest friend."]
      },
      noah: {
        0: ["Mr. Noah.", "Sir.", "Hello."],
        20: ["Thank you for the opportunity.", "I'll work hard.", "I appreciate it."],
        40: ["You're a good boss.", "I respect you.", "Thank you, Noah."],
        60: ["I'm grateful for your guidance.", "You've helped me grow.", "I value our relationship."],
        80: ["You're more than a boss to me.", "I consider you a friend.", "Thank you for everything."],
        100: ["You're a true friend.", "I'm honored to know you.", "Friends for life."]
      }
    }
  };

  // Gift preferences (like: +2, neutral: +1, dislike: -1)
  const giftPreferences = {
    yuwon: { apple: 2, pen: 1, tie: -1, book: 2, burger: 1 },
    jaehyun: { apple: 1, pen: 2, tie: 1, book: 2, burger: -1 },
    minkyu: { apple: 1, pen: 1, tie: 2, book: 2, burger: 1 },
    noah: { apple: -1, pen: 1, tie: 2, book: 1, burger: 2 }
  };

  // Dragging state
  const [draggingItem, setDraggingItem] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });


  const [activeTab, setActiveTab] = useState('room');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characterOutfits, setCharacterOutfits] = useState({
    yuwon: 'yuwon_outfit_1',
    noah: 'noah_outfit_1',
    jaehyun: 'Jaehyun_outfit_1',
    minkyu: 'minkyu_outfit_1'
  });

  // Cheat: Add YP
  const addCheatYP = () => {
    setYuCash(yuCash + 10000000);
  };

  // Reset room - clear all furniture and characters
  const resetRoom = () => {
    if (window.confirm('Are you sure you want to reset the room? This will remove all placed furniture and characters.')) {
      setPlacedFurniture([]);
      setPlacedCharacters([]);
    }
  };

  // Buy furniture
  const buyFurniture = (furniture) => {
    if (yuCash >= furniture.price) {
      const existing = ownedFurniture.find(f => f.id === furniture.id);
      if (existing) {
        // Increase quantity
        setOwnedFurniture(ownedFurniture.map(f =>
          f.id === furniture.id ? { ...f, quantity: f.quantity + 1 } : f
        ));
      } else {
        // First purchase
        setOwnedFurniture([...ownedFurniture, { ...furniture, quantity: 1 }]);
      }
      setYuCash(yuCash - furniture.price);
    }
  };

  // Buy outfit
  const buyOutfit = (character, outfit) => {
    if (yuCash >= outfit.price && !ownedOutfits[character].includes(outfit.id)) {
      setOwnedOutfits({
        ...ownedOutfits,
        [character]: [...ownedOutfits[character], outfit.id]
      });
      setYuCash(yuCash - outfit.price);
    }
  };

  // Change character outfit
  const changeOutfit = (character, outfitId) => {
    setCharacterOutfits({
      ...characterOutfits,
      [character]: outfitId
    });
    // Update placed characters with new outfit
    setPlacedCharacters(placedCharacters.map(char =>
      char.character === character ? { ...char, outfit: outfitId } : char
    ));
  };

  // Remove character from room
  const removeCharacter = (id) => {
    setPlacedCharacters(placedCharacters.filter(c => c.id !== id));
  };

  // Place character in center of room
  const placeCharacter = (character) => {
    // Check if character is already placed
    const alreadyPlaced = placedCharacters.some(char => char.character === character);
    if (alreadyPlaced) {
      alert(`${character} is already in the room!`);
      return;
    }

    const newChar = {
      character: character,
      outfit: characterOutfits[character],
      x: 270, // Center of 640px room
      y: 130, // Center of 360px room
      id: `${character}-${Date.now()}`
    };
    setPlacedCharacters([...placedCharacters, newChar]);
  };

  // Check if character is placed
  const isCharacterPlaced = (character) => {
    return placedCharacters.some(char => char.character === character);
  };

  // Get character sprite image path (animated GIF if available)
  const getCharacterSprite = (character, outfit) => {
    // Check for animated idle sprite first
    if (character === 'yuwon' && outfit === 'yuwon_outfit_1') {
      return '/images/game-rooms/animation/idle_yuwon_outfit1.gif';
    }
    // Fall back to static PNG
    return `/images/game-rooms/char-outfits/${outfit}.png`;
  };

  // Friendship functions
  const getHeartLevel = (points) => {
    if (points >= 100) return { color: 'red', emoji: '❤️', level: 6 };
    if (points >= 80) return { color: 'orange', emoji: '🧡', level: 5 };
    if (points >= 60) return { color: 'yellow', emoji: '💛', level: 4 };
    if (points >= 40) return { color: 'green', emoji: '💚', level: 3 };
    if (points >= 20) return { color: 'blue', emoji: '💙', level: 2 };
    return { color: 'black', emoji: '🖤', level: 1 };
  };

  const canTalkToday = (character) => {
    const pairKey = getPairKey(playableCharacter, character);
    const lastTalk = lastTalkDate[pairKey];
    if (!lastTalk) return true;
    const today = new Date().toDateString();
    const lastTalkDay = new Date(lastTalk).toDateString();
    return today !== lastTalkDay;
  };

  const getDialogue = (speaker, target, points) => {
    const dialogueSet = dialogueLibrary[speaker]?.[target];
    if (!dialogueSet) return "Hey, what's up?";

    // Find the appropriate dialogue tier
    let tier = 0;
    if (points >= 100) tier = 100;
    else if (points >= 80) tier = 80;
    else if (points >= 60) tier = 60;
    else if (points >= 40) tier = 40;
    else if (points >= 20) tier = 20;

    const options = dialogueSet[tier];
    return options[Math.floor(Math.random() * options.length)];
  };

  const talkToCharacter = (character) => {
    if (!canTalkToday(character)) {
      alert(`You already talked to ${character} today! Come back tomorrow.`);
      return;
    }

    // Clear any existing timeouts to prevent conflicts
    if (dialogueTimeouts.fadeOut) clearTimeout(dialogueTimeouts.fadeOut);
    if (dialogueTimeouts.hide) clearTimeout(dialogueTimeouts.hide);

    const pairKey = getPairKey(playableCharacter, character);
    const bondLevel = pairedBonds[pairKey] || 0;

    // IMPORTANT: The character being talked to responds TO the player
    // So if playing as Jaehyun talking to Yuwon, use Yuwon's dialogue talking to Jaehyun
    const dialogue = getDialogue(character, playableCharacter, bondLevel);
    setCurrentDialogue({ character, text: dialogue, isClosing: false });

    setShowDialogue(true);

    // Start fade-out animation after 4.5 seconds
    const fadeOutTimeout = setTimeout(() => {
      setCurrentDialogue(prev => ({ ...prev, isClosing: true }));
    }, 4500);

    // Fully hide dialogue after 5 seconds
    const hideTimeout = setTimeout(() => {
      setShowDialogue(false);
    }, 5000);

    // Store timeouts for cleanup
    setDialogueTimeouts({ fadeOut: fadeOutTimeout, hide: hideTimeout });

    // Update paired bond (same bond regardless of who's talking!)
    setPairedBonds(prev => ({
      ...prev,
      [pairKey]: (prev[pairKey] || 0) + 1
    }));

    setLastTalkDate(prev => ({
      ...prev,
      [pairKey]: new Date().toISOString()
    }));
  };

  const buyGift = (gift) => {
    // Check if user has enough currency
    if (gift.currency === 'yuCash' && yuCash < gift.price) {
      alert('Not enough YuCash!');
      return;
    }
    if (gift.currency === 'ncc' && yuCash < gift.price) {
      alert('Not enough Noah Credit Card!');
      return;
    }

    // Deduct currency
    setYuCash(prev => prev - gift.price);

    // Add to inventory
    const existing = inventory.find(item => item.id === gift.id);
    if (existing) {
      setInventory(inventory.map(item =>
        item.id === gift.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setInventory([...inventory, { ...gift, quantity: 1 }]);
    }
  };

  const giveGift = (character, giftId) => {
    const gift = inventory.find(item => item.id === giftId);
    if (!gift || gift.quantity === 0) return;

    const pairKey = getPairKey(playableCharacter, character);

    // Get preference
    const preference = giftPreferences[character][giftId];
    let pointsGained = preference;

    // Update paired bond
    setPairedBonds(prev => ({
      ...prev,
      [pairKey]: Math.max(0, (prev[pairKey] || 0) + pointsGained)
    }));

    // Remove from inventory
    if (gift.quantity === 1) {
      setInventory(inventory.filter(item => item.id !== giftId));
    } else {
      setInventory(inventory.map(item =>
        item.id === giftId ? { ...item, quantity: item.quantity - 1 } : item
      ));
    }

    // Show feedback
    if (preference === 2) {
      alert(`${character} loved the ${gift.name}! +2 friendship points ❤️`);
    } else if (preference === 1) {
      alert(`${character} likes the ${gift.name}. +1 friendship point`);
    } else {
      alert(`${character} didn't really like the ${gift.name}... -1 friendship point`);
    }

    setShowGiftPopup(false);
  };

  // Handle mouse down on furniture/character in shop or room
  const handleMouseDown = (e, item, source) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDraggingItem({ ...item, source });
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  // Move placed character
  const moveCharacter = (id, newX, newY) => {
    setPlacedCharacters(placedCharacters.map(char =>
      char.id === id ? { ...char, x: newX, y: newY } : char
    ));
  };

  // Handle mouse move
  const handleMouseMove = (e) => {
    if (!draggingItem) return;
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Handle mouse up - place item in room
  const handleMouseUp = (e) => {
    if (!draggingItem) return;

    const roomContainer = document.getElementById('room-container');
    if (!roomContainer) return;

    const rect = roomContainer.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    // Only place if within room bounds
    if (x >= 0 && y >= 0 && x <= rect.width - 50 && y <= rect.height - 50) {
      if (draggingItem.type === 'character') {
        if (draggingItem.source === 'room') {
          // Moving existing character
          setPlacedCharacters(placedCharacters.map(char =>
            char.id === draggingItem.id ? { ...char, x, y } : char
          ));
        } else {
          // Placing new character (shouldn't happen now with Place button)
          const alreadyPlaced = placedCharacters.some(char => char.character === draggingItem.character);
          if (!alreadyPlaced) {
            const newChar = {
              character: draggingItem.character,
              outfit: characterOutfits[draggingItem.character],
              x,
              y,
              id: `${draggingItem.character}-${Date.now()}`
            };
            setPlacedCharacters([...placedCharacters, newChar]);
          }
        }
      } else {
        // Furniture
        if (draggingItem.source === 'room') {
          // Moving existing furniture
          setPlacedFurniture(placedFurniture.map(item =>
            item.id === draggingItem.id ? { ...item, x, y } : item
          ));
        } else {
          // Placing new furniture (shouldn't happen now with Place button)
          const newItem = {
            ...draggingItem,
            x,
            y,
            id: `${draggingItem.id}-${Date.now()}`
          };
          setPlacedFurniture([...placedFurniture, newItem]);
          setShowSampleRoom(false); // Auto-hide sample room when placing furniture
        }
      }
    }

    setDraggingItem(null);
  };

  // Remove furniture from room
  const removeFurniture = (id) => {
    setPlacedFurniture(placedFurniture.filter(f => f.id !== id));
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div className="current-date">
        🏠 Customize Your Space!
      </div>

      <div className="content">
        {/* Room Display */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', color: '#e91e63', marginBottom: '15px', textAlign: 'center' }}>
            Yuwon's Room
          </h2>

          {/* Sample Room Toggle */}
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <button
              onClick={() => setShowSampleRoom(!showSampleRoom)}
              style={{
                padding: '8px 16px',
                background: showSampleRoom ? '#e91e63' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              {showSampleRoom ? '🚪 Hide Sample Room' : '🏠 Show Sample Room'}
            </button>
          </div>

          <div
            id="room-container"
            style={{
              position: 'relative',
              width: '640px',
              height: '360px',
              margin: '0 auto',
              backgroundImage: 'url(/images/game-rooms/room_bg.png)',
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              border: '3px solid #e91e63',
              borderRadius: '15px',
              overflow: 'visible',
              cursor: draggingItem ? 'grabbing' : 'default',
              imageRendering: 'pixelated'
            }}
          >
            {/* Sample room overlay */}
            {showSampleRoom && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url(/images/game-rooms/Furnitures.png)',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                pointerEvents: 'none',
                imageRendering: 'pixelated'
              }} />
            )}
            {/* Placed furniture */}
            {placedFurniture.map(item => (
              <div
                key={item.id}
                style={{
                  position: 'absolute',
                  left: `${item.x}px`,
                  top: `${item.y}px`,
                  cursor: 'grab'
                }}
                onMouseDown={(e) => handleMouseDown(e, item, 'room')}
                onDoubleClick={() => removeFurniture(item.id)}
                title="Drag to move, double-click to remove"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  draggable="false"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    imageRendering: 'pixelated'
                  }}
                />
              </div>
            ))}

            {/* Placed characters */}
            {placedCharacters.map(char => (
              <div
                key={char.id}
                style={{
                  position: 'absolute',
                  left: `${char.x}px`,
                  top: `${char.y}px`,
                  cursor: 'grab'
                }}
                onMouseDown={(e) => handleMouseDown(e, { ...char, type: 'character', character: char.character }, 'room')}
                onDoubleClick={() => removeCharacter(char.id)}
                title="Drag to move • Double-click to remove"
              >
                <img
                  src={getCharacterSprite(char.character, char.outfit)}
                  alt={char.character}
                  draggable="false"
                  style={{
                    width: '40px',
                    height: 'auto',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    imageRendering: 'pixelated'
                  }}
                />
              </div>
            ))}

            {/* Dragging preview */}
            {draggingItem && (
              <div
                style={{
                  position: 'fixed',
                  pointerEvents: 'none',
                  zIndex: 9999,
                  opacity: 0.7
                }}
              >
                <img
                  src={draggingItem.type === 'character' ? getCharacterSprite(draggingItem.character, characterOutfits[draggingItem.character]) : draggingItem.image}
                  alt={draggingItem.name || draggingItem.character}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    imageRendering: 'pixelated'
                  }}
                />
              </div>
            )}
          </div>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '10px' }}>
            💡 Drag furniture from the shop below • Double-click placed items to remove
          </p>
        </div>

        {/* Room Header */}
        {/* Tabs */}
        <div className="browser-tabs" style={{ marginBottom: '20px' }}>
          <button
            className={`browser-tab ${activeTab === 'room' ? 'active' : ''}`}
            onClick={() => setActiveTab('room')}
          >
            🛋️ Furniture Shop
          </button>
          <button
            className={`browser-tab ${activeTab === 'outfits' ? 'active' : ''}`}
            onClick={() => setActiveTab('outfits')}
          >
            👥 Characters
          </button>
          <button
            className={`browser-tab ${activeTab === 'friendship' ? 'active' : ''}`}
            onClick={() => setActiveTab('friendship')}
          >
            💕 Friendship
          </button>
        </div>

        {/* Furniture Shop */}
        {activeTab === 'room' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '18px', color: '#e91e63', marginBottom: '15px' }}>
              Furniture Shop
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
              {furnitureCatalog.map(furniture => {
                const owned = ownedFurniture.find(f => f.id === furniture.id);
                return (
                  <div
                    key={furniture.id}
                    style={{
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '10px',
                      textAlign: 'center',
                      background: owned ? '#f0f0f0' : 'white',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    {owned && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#e91e63',
                        color: 'white',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: '700',
                        border: '2px solid white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        zIndex: 1
                      }}>
                        {owned.quantity}
                      </div>
                    )}
                    <img
                      src={furniture.image}
                      alt={furniture.name}
                      style={{ maxWidth: '80px', height: 'auto', objectFit: 'contain', marginBottom: '8px', imageRendering: 'pixelated' }}
                    />
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>
                      {furniture.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#ff9800', fontWeight: '700', marginBottom: '8px' }}>
                      {furniture.price} YP
                    </div>
                    <button
                      onClick={() => buyFurniture(furniture)}
                      style={{
                        background: yuCash >= furniture.price ? '#4caf50' : '#ccc',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        cursor: yuCash >= furniture.price ? 'pointer' : 'not-allowed',
                        fontSize: '12px',
                        marginBottom: owned ? '5px' : '0'
                      }}
                      disabled={yuCash < furniture.price}
                    >
                      Buy
                    </button>
                    {owned && (
                      <>
                        <button
                          onClick={() => {
                            const newItem = {
                              ...furniture,
                              x: 270,
                              y: 130,
                              id: `${furniture.id}-${Date.now()}`
                            };
                            setPlacedFurniture([...placedFurniture, newItem]);
                            setShowSampleRoom(false); // Auto-hide sample room when placing furniture
                          }}
                          style={{
                            background: '#2196f3',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            marginBottom: furniture.upgradeable ? '5px' : '0'
                          }}
                        >
                          📍 Place
                        </button>
                        {furniture.upgradeable && (
                          <button
                            onClick={() => {
                              const upgradedItem = furnitureCatalog.find(f => f.id === furniture.upgradesTo);
                              if (upgradedItem && yuCash >= upgradedItem.price) {
                                // Remove the old version
                                setOwnedFurniture(ownedFurniture.map(f =>
                                  f.id === furniture.id && f.quantity > 0
                                    ? { ...f, quantity: f.quantity - 1 }
                                    : f
                                ).filter(f => f.quantity > 0));

                                // Add the upgraded version
                                const existing = ownedFurniture.find(f => f.id === upgradedItem.id);
                                if (existing) {
                                  setOwnedFurniture(ownedFurniture.map(f =>
                                    f.id === upgradedItem.id ? { ...f, quantity: f.quantity + 1 } : f
                                  ));
                                } else {
                                  setOwnedFurniture([...ownedFurniture, { ...upgradedItem, quantity: 1 }]);
                                }

                                setYuCash(yuCash - upgradedItem.price);
                              }
                            }}
                            style={{
                              background: '#ff9800',
                              color: 'white',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            ⬆️ Upgrade
                          </button>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Outfits Tab */}
        {activeTab === 'outfits' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            {/* Room Header */}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '18px', color: '#e91e63', margin: 0 }}>
                Characters & Outfits
              </h3>
              <div
                onClick={() => setShowInfoPopup(true)}
                style={{
                  cursor: 'pointer',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#2196f3',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  border: '2px solid #1976d2',
                  userSelect: 'none',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                i
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              {/* All Characters Listed */}
              {[
                { name: 'yuwon', unlocked: true, friendshipRequired: 0 },
                { name: 'jaehyun', unlocked: false, friendshipRequired: 20 },
                { name: 'minkyu', unlocked: false, friendshipRequired: 50 },
                { name: 'noah', unlocked: false, friendshipRequired: 100 }
              ].map(({ name: char, unlocked, friendshipRequired }) => (
                <div key={char} style={{ display: 'flex', gap: '30px', padding: '20px', background: '#fafafa', borderRadius: '12px', opacity: unlocked ? 1 : 0.6 }}>
                  {/* Character Avatar & Name */}
                  <div style={{ textAlign: 'center', minWidth: '150px' }}>
                    <img
                      src={`/images/avatar_${char}.jpg`}
                      alt={char}
                      style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px', border: '3px solid #e91e63', filter: unlocked ? 'none' : 'grayscale(100%)' }}
                    />
                    <h2 style={{ fontSize: '18px', textTransform: 'capitalize', marginBottom: '4px', color: '#333' }}>
                      {char}
                    </h2>
                    <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>
                      {unlocked ? '✓ Unlocked' : `🔒 ${friendshipRequired} Friendship Points`}
                    </div>
                  </div>

                  {/* Default Character & Place Button */}
                  <div style={{ textAlign: 'center', minWidth: '120px' }}>
                    <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px', fontWeight: '600' }}>
                      Default Outfit
                    </div>
                    <img
                      src={getCharacterSprite(char, characterOutfits[char])}
                      alt={char}
                      style={{ width: '60px', height: 'auto', objectFit: 'contain', imageRendering: 'pixelated', marginBottom: '8px', opacity: unlocked ? 1 : 0.4 }}
                    />
                    {unlocked && (
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
                    )}
                  </div>

                  {/* Outfit Gallery */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '8px' }}>
                      {unlocked && outfitsCatalog[char]?.map(outfit => {
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
        )}

        {/* Friendship Tab */}
        {activeTab === 'friendship' && (
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <h3 style={{ fontSize: '18px', color: '#e91e63', marginBottom: '15px' }}>
              Friendship & Gift Shop
            </h3>

            {/* Bonds Overview */}
            <div style={{ background: '#fff0f5', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '2px solid #e91e63' }}>
              <h4 style={{ fontSize: '16px', color: '#e91e63', marginBottom: '15px', textAlign: 'center' }}>
                💕 All Character Bonds
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { char1: 'yuwon', char2: 'jaehyun', display1: 'Yuwon', display2: 'Jaehyun' },
                  { char1: 'yuwon', char2: 'minkyu', display1: 'Yuwon', display2: 'Minkyu' },
                  { char1: 'yuwon', char2: 'noah', display1: 'Yuwon', display2: 'Noah' },
                  { char1: 'jaehyun', char2: 'minkyu', display1: 'Jaehyun', display2: 'Minkyu' },
                  { char1: 'jaehyun', char2: 'noah', display1: 'Jaehyun', display2: 'Noah' },
                  { char1: 'minkyu', char2: 'noah', display1: 'Minkyu', display2: 'Noah' }
                ].map(({ char1, char2, display1, display2 }) => {
                  const pairKey = getPairKey(char1, char2);
                  const bondLevel = pairedBonds[pairKey] || 0;
                  const heart = getHeartLevel(bondLevel);

                  return (
                    <div
                      key={pairKey}
                      style={{
                        background: 'white',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '12px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '11px', fontWeight: '600', color: '#666', marginBottom: '5px' }}>
                        {char1} ↔ {char2}
                      </div>
                      <div style={{ fontSize: '20px', marginBottom: '5px' }}>
                        {heart.emoji}
                      </div>
                      <div style={{ fontSize: '11px', color: '#999' }}>
                        {bondLevel} points
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gift Shop */}
            <div style={{ marginBottom: '30px', padding: '20px', background: '#fafafa', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '16px', color: '#333', marginBottom: '15px' }}>🎁 Gift Shop</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                {giftCatalog.map(gift => (
                  <div
                    key={gift.id}
                    style={{
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center',
                      background: 'white'
                    }}
                  >
                    <div style={{ fontSize: '48px', marginBottom: '8px' }}>{gift.image}</div>
                    <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '5px' }}>{gift.name}</div>
                    <div style={{ fontSize: '11px', color: '#ff9800', fontWeight: '700', marginBottom: '8px' }}>
                      {gift.price} {gift.currency === 'yuCash' ? 'YP' : 'NCC'}
                    </div>
                    <button
                      onClick={() => buyGift(gift)}
                      style={{
                        background: '#4caf50',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        width: '100%'
                      }}
                    >
                      Buy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory */}
            <div style={{ marginBottom: '30px', padding: '20px', background: '#f5f5f5', borderRadius: '12px' }}>
              <h4 style={{ fontSize: '16px', color: '#333', marginBottom: '15px' }}>🎒 Your Inventory</h4>
              {inventory.length === 0 ? (
                <p style={{ fontSize: '12px', color: '#999', textAlign: 'center' }}>No items yet. Buy some gifts above!</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                  {inventory.map(item => (
                    <div
                      key={item.id}
                      style={{
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        padding: '10px',
                        textAlign: 'center',
                        background: 'white',
                        position: 'relative'
                      }}
                    >
                      <div style={{ fontSize: '36px', marginBottom: '5px' }}>{item.image}</div>
                      <div style={{ fontSize: '11px', fontWeight: '600' }}>{item.name}</div>
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: '#e91e63',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: '700',
                        border: '2px solid white'
                      }}>
                        {item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Characters with Friendship Levels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {['yuwon', 'jaehyun', 'minkyu', 'noah'].filter(char => char !== playableCharacter).map(char => {
                const pairKey = getPairKey(playableCharacter, char);
                const bondLevel = pairedBonds[pairKey] || 0;
                const heart = getHeartLevel(bondLevel);
                const canTalk = canTalkToday(char);
                const relationshipType = relationshipTypes[playableCharacter]?.[char];
                const isRomance = relationshipType === 'romance';

                return (
                  <div
                    key={char}
                    data-character-card
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                      padding: '20px',
                      background: '#fafafa',
                      borderRadius: '12px',
                      border: '2px solid #e0e0e0',
                      position: 'relative'
                    }}
                  >
                    {/* Character Avatar */}
                    <img
                      src={`/images/avatar_${char}.jpg`}
                      alt={char}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `3px solid ${isRomance ? '#e91e63' : '#4caf50'}`
                      }}
                    />

                    {/* Speech Bubble for this character */}
                    {showDialogue && currentDialogue.character === char && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '110px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'white',
                          padding: '15px 20px',
                          borderRadius: '15px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          zIndex: 10,
                          maxWidth: '280px',
                          border: '2px solid #e91e63',
                          animation: currentDialogue.isClosing ? 'dialogueFadeOut 0.5s ease-out forwards' : 'dialogueSlideIn 0.3s ease-out',
                          opacity: currentDialogue.isClosing ? 0 : 1,
                          transition: 'opacity 0.5s ease-out'
                        }}
                      >
                        <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.4' }}>
                          {currentDialogue.text}
                        </div>
                        {/* Tail pointing left to avatar */}
                        <div
                          style={{
                            position: 'absolute',
                            left: '-12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 0,
                            height: 0,
                            borderTop: '10px solid transparent',
                            borderBottom: '10px solid transparent',
                            borderRight: '12px solid #e91e63'
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            left: '-8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: 0,
                            height: 0,
                            borderTop: '8px solid transparent',
                            borderBottom: '8px solid transparent',
                            borderRight: '10px solid white'
                          }}
                        />
                      </div>
                    )}

                    {/* Character Info */}
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', textTransform: 'capitalize', marginBottom: '5px', color: '#333' }}>
                        {char} {isRomance ? '❤️' : '💙'}
                      </h3>
                      <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>
                        {isRomance ? 'Romance' : 'Friendship'}: {bondLevel} points
                      </div>
                      {isRomance && (
                        <div style={{ fontSize: '12px', marginBottom: '8px' }}>
                          {heart.emoji} {heart.color.charAt(0).toUpperCase() + heart.color.slice(1)} Heart (Level {heart.level}/6)
                        </div>
                      )}
                    </div>

                    {/* Talk Button */}
                    <button
                      onClick={() => talkToCharacter(char)}
                      disabled={!canTalk}
                      style={{
                        padding: '10px 20px',
                        background: canTalk ? '#2196f3' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: canTalk ? 'pointer' : 'not-allowed',
                        fontSize: '12px',
                        fontWeight: '600',
                        minWidth: '100px'
                      }}
                    >
                      {canTalk ? '💬 Talk' : '✓ Talked Today'}
                    </button>

                    {/* Gift Button */}
                    <button
                      onClick={() => {
                        setSelectedGiftCharacter(char);
                        setShowGiftPopup(true);
                      }}
                      disabled={inventory.length === 0}
                      style={{
                        padding: '10px 20px',
                        background: inventory.length > 0 ? '#ff9800' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: inventory.length > 0 ? 'pointer' : 'not-allowed',
                        fontSize: '12px',
                        fontWeight: '600',
                        minWidth: '100px'
                      }}
                    >
                      🎁 Gift
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="footer">
        <span>💕 you're doing amazing babe! even tiny steps count! 🌸</span>
      </div>

      {/* Gift Popup */}
      {showGiftPopup && selectedGiftCharacter && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={() => setShowGiftPopup(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '320px',
              width: '90%',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '14px', color: '#e91e63', marginBottom: '12px', textAlign: 'center' }}>
              🎁 Give Gift to {selectedGiftCharacter}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
              {inventory.map(item => (
                <div
                  key={item.id}
                  onClick={() => giveGift(selectedGiftCharacter, item.id)}
                  style={{
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    padding: '8px',
                    textAlign: 'center',
                    background: 'white',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#e91e63'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}
                >
                  <div style={{ fontSize: '28px', marginBottom: '4px' }}>{item.image}</div>
                  <div style={{ fontSize: '9px', fontWeight: '600' }}>{item.name}</div>
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    background: '#e91e63',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    fontWeight: '700',
                    border: '2px solid white'
                  }}>
                    {item.quantity}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowGiftPopup(false)}
              style={{
                padding: '6px 12px',
                background: '#999',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: '600',
                width: '100%'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Floating drag preview */}
      {draggingItem && (
        <div
          style={{
            position: 'fixed',
            left: `${mousePos.x - dragOffset.x}px`,
            top: `${mousePos.y - dragOffset.y}px`,
            pointerEvents: 'none',
            opacity: 0.7,
            zIndex: 9999,
            imageRendering: 'pixelated'
          }}
        >
          {draggingItem.type === 'character' ? (
            <img
              src={`/images/game-rooms/char-outfits/${draggingItem.outfit}.png`}
              alt="Dragging"
              style={{ width: '100px', height: 'auto', imageRendering: 'pixelated' }}
            />
          ) : (
            <img
              src={draggingItem.image}
              alt="Dragging"
              style={{ maxWidth: '80px', height: 'auto', imageRendering: 'pixelated' }}
            />
          )}
        </div>
      )}

      {/* Info Popup */}
      {showInfoPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={() => setShowInfoPopup(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '400px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInfoPopup(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#999',
                padding: '5px'
              }}
            >
              ×
            </button>
            <h3 style={{ fontSize: '20px', color: '#e91e63', marginBottom: '15px', marginTop: '0' }}>
              🏠 About This Room
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#333', marginBottom: '0' }}>
              This is <strong>Yuwon's room</strong>! Other locations are coming soon.
              <br /><br />
              For now, you can only play as <strong>Yuwon</strong>. You can invite other characters to the room, but the friendship interactions reflect from <strong>Yuwon's perspective</strong> to them.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vanity;
