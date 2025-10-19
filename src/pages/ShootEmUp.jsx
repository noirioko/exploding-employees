import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

function ShootEmUp() {
  const { unlockAchievement } = useApp();
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [playerHP, setPlayerHP] = useState(20);
  const [noahHP, setNoahHP] = useState(100);
  const [wave, setWave] = useState(0);
  const [phase, setPhase] = useState('dodge'); // 'dodge' or 'attack'
  const [noahDialogue, setNoahDialogue] = useState('');
  const [showNoahDialogue, setShowNoahDialogue] = useState(false);
  const [noahDialogueIndex, setNoahDialogueIndex] = useState(0);
  const [yuwonDialogue, setYuwonDialogue] = useState('');
  const [showYuwonDialogue, setShowYuwonDialogue] = useState(false);
  const [yuwonDialogueIndex, setYuwonDialogueIndex] = useState(0);

  // Refs for dialogue to avoid re-render issues when HP changes
  const yuwonDialogueRef = useRef('');
  const showYuwonDialogueRef = useRef(false);
  const [invincible, setInvincible] = useState(false); // Blink state after hit
  const [slacked, setSlacked] = useState(false); // Slacking ending
  const [shownNoahThisWave, setShownNoahThisWave] = useState(false);

  const playerPosRef = useRef({ x: 270, y: 320 }); // Centered in scaled canvas
  const keysRef = useRef({});
  const playerSpriteRef = useRef(null);
  const playerDirectionRef = useRef('down'); // Track which direction player is facing
  const transformingRef = useRef(false); // Heart transformation animation (using ref to avoid useEffect rerun)
  const transformProgressRef = useRef(0); // 0 to 1 (using ref to avoid useEffect rerun)
  const selectedActionRef = useRef(0); // 0 = WORK, 1 = SLACK (using ref to avoid useEffect rerun)

  // We need a state for selectedAction just for rendering updates, but we use the ref for logic
  const [selectedActionDisplay, setSelectedActionDisplay] = useState(0);

  const [showYuwonSprite, setShowYuwonSprite] = useState(true);

  const noahDialogues = [
    "More paperwork!",
    "URGENT!",
    "Deadline is NOW!",
    "ASAP please!",
    "Can you do this?",
    "One more thing...",
    "This is important!",
    "We need this done!"
  ];

  const yuwonWorkDialogues = [
    "I did it!",
    "Done!",
    "Finished!",
    "Got it done!",
    "Task complete!"
  ];

  const yuwonSlackDialogues = [
    "dont wanna",
    "im tired",
    "not now",
    "need a break",
    "cant do this"
  ];

  // Typewriter effect for Noah
  useEffect(() => {
    if (showNoahDialogue && noahDialogueIndex < noahDialogue.length) {
      // Play Noah's dialogue sound (reduced volume by 50%)
      const audio = new Audio('/sounds/pixel/dialogue.wav');
      audio.volume = 0.15; // Reduced from 0.3 to 0.15 (50% reduction)
      audio.play().catch(err => console.log('Audio play failed:', err));

      const timer = setTimeout(() => {
        setNoahDialogueIndex(noahDialogueIndex + 1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [showNoahDialogue, noahDialogueIndex, noahDialogue]);

  // Typewriter effect for Yuwon - DISABLED FOR DEBUGGING
  useEffect(() => {
    // Just play sound once when dialogue appears
    if (showYuwonDialogue && yuwonDialogueIndex === 0) {
      const audio = new Audio('/sounds/pixel/yuwon_dialogue.wav');
      audio.volume = 0.15;
      audio.play().catch(err => {
        // Silently ignore audio errors
      });
    }
  }, [showYuwonDialogue]);

  // Unlock achievements when endings are reached
  useEffect(() => {
    if (gameOver) {
      unlockAchievement('shootEmUp', 'gameOver');
    }
  }, [gameOver, unlockAchievement]);

  useEffect(() => {
    if (victory) {
      unlockAchievement('shootEmUp', 'victory');
    }
  }, [victory, unlockAchievement]);

  useEffect(() => {
    if (slacked) {
      unlockAchievement('shootEmUp', 'slacked');
    }
  }, [slacked, unlockAchievement]);

  useEffect(() => {
    if (!gameStarted || gameOver || victory || slacked) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 600;
    canvas.height = 400;

    // Load Yuwon sprite
    const yuwonSprite = new Image();
    yuwonSprite.src = '/images/walking-sprites/Yuwon/Yuwon_Idle_Front.gif';
    playerSpriteRef.current = yuwonSprite;

    // Load bullet sprites
    const bulletSprites = {
      folder: new Image(),
      drive: new Image(),
      notepad: new Image()
    };
    bulletSprites.folder.src = '/images/underboss-game/folder-03.png';
    bulletSprites.drive.src = '/images/underboss-game/drive-01.png';
    bulletSprites.notepad.src = '/images/underboss-game/notepad-01.png';

    // Battle box dimensions (scaled for 600x400 canvas)
    const boxX = 135;
    const boxY = 200;
    const boxWidth = 270;
    const boxHeight = 135;

    const bullets = [];
    let animationId;
    let phaseTimer = 0;
    let waveTimer = 0;
    const heartSize = 20;

    // Noah is now rendered outside canvas (no movement needed)

    // Keyboard handlers
    const handleKeyDown = (e) => {
      // During attack phase, use arrow keys and Enter
      if (phase === 'attack' && !showYuwonDialogue) {
        // Arrow keys to select action
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') {
          e.preventDefault();
          selectedActionRef.current = selectedActionRef.current === 0 ? 1 : 0; // Toggle between 0 and 1
          setSelectedActionDisplay(selectedActionRef.current); // Update display state
          return;
        }

        // Enter to confirm selection
        if (e.key === 'Enter') {
          e.preventDefault();

          if (selectedActionRef.current === 0) {
            // WORK - Damage Noah
            const damage = Math.floor(Math.random() * 8) + 5; // 5-12 damage
            setNoahHP(prev => {
              const newHP = Math.max(0, prev - damage);
              if (newHP <= 0) {
                setVictory(true);
                cancelAnimationFrame(animationId);
              }
              return newHP;
            });

            // Show Yuwon's work dialogue
            const workMsg = yuwonWorkDialogues[Math.floor(Math.random() * yuwonWorkDialogues.length)];
            yuwonDialogueRef.current = workMsg;
            showYuwonDialogueRef.current = true;
            setTimeout(() => {
              showYuwonDialogueRef.current = false;
            }, 2000);
          } else {
            // SLACK - Damage yourself
            const damage = Math.floor(Math.random() * 5) + 3; // 3-7 damage
            setPlayerHP(prev => {
              const newHP = prev - damage;
              if (newHP <= 0) {
                setSlacked(true);
                cancelAnimationFrame(animationId);
              }
              return newHP;
            });

            // Show Yuwon's slack dialogue
            const slackMsg = yuwonSlackDialogues[Math.floor(Math.random() * yuwonSlackDialogues.length)];
            yuwonDialogueRef.current = slackMsg;
            showYuwonDialogueRef.current = true;
            setTimeout(() => {
              showYuwonDialogueRef.current = false;
            }, 2000);
          }

          // Next wave
          setWave(w => w + 1);
          setPhase('dodge');
          setShownNoahThisWave(false); // Reset Noah dialogue flag
          setShowYuwonSprite(true); // Show sprite again for new wave
          bullets.length = 0;
          phaseTimer = 0;
          waveTimer = 0;
          keysRef.current = {}; // Clear all keys to prevent movement from attack keys
          selectedActionRef.current = 0; // Reset to WORK for next time
          setSelectedActionDisplay(0);
          return;
        }
      }

      // During dodge phase, use WASD for movement
      if (phase === 'dodge') {
        keysRef.current[e.key.toLowerCase()] = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    function spawnWavePattern(waveNum) {
      const playerX = playerPosRef.current.x;
      const playerY = playerPosRef.current.y;
      const centerX = boxX + boxWidth / 2;
      const centerY = boxY;

      // Progressive difficulty scaling
      const difficultyMultiplier = Math.min(1 + (waveNum * 0.08), 2.0); // 8% per wave, max 2.0x
      const speedScale = difficultyMultiplier;
      const countScale = (baseCount) => Math.min(Math.floor(baseCount * difficultyMultiplier), 12); // Cap at 12 bullets

      // Determine bullet type based on wave
      const getBulletType = () => {
        if (waveNum < 3) return 'notepad'; // Early waves: notepad
        if (waveNum < 6) return 'drive'; // Mid waves: drive
        if (waveNum < 9) return 'folder'; // Later waves: folder
        // Wave 9+: Mix all types randomly
        const types = ['notepad', 'drive', 'folder'];
        return types[Math.floor(Math.random() * types.length)];
      };

      const patterns = [
        // Pattern 1: Aimed shots at player (URGENT!)
        () => {
          const count = countScale(5);
          for (let i = 0; i < count; i++) {
            const spawnX = boxX + (boxWidth / count) * i;
            const spawnY = boxY;
            const dx = playerX - spawnX;
            const dy = playerY - spawnY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = 1.0 * speedScale; // Base speed 1.0, scales with difficulty
            bullets.push({
              x: spawnX,
              y: spawnY,
              vx: (dx / distance) * speed,
              vy: (dy / distance) * speed,
              size: 16,
              bulletType: getBulletType()
            });
          }
        },
        // Pattern 2: Spread cone aimed at player
        () => {
          const dx = playerX - centerX;
          const dy = playerY - centerY;
          const baseAngle = Math.atan2(dy, dx);
          const spreadCount = countScale(5);
          const spreadAngle = Math.PI / 3; // 60 degree spread (wider gaps)
          const speed = 1.4 * speedScale; // Base speed 1.4, scales with difficulty

          for (let i = 0; i < spreadCount; i++) {
            const angle = baseAngle - spreadAngle / 2 + (spreadAngle / spreadCount) * i;
            bullets.push({
              x: centerX,
              y: boxY + 20, // Spawn inside box to prevent immediate removal
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              size: 16,
              bulletType: getBulletType()
            });
          }
        },
        // Pattern 3: Homing bullets (track player slightly)
        () => {
          const count = countScale(8);
          const speed = 1.0 * speedScale; // Base speed 1.0, scales with difficulty
          for (let i = 0; i < count; i++) {
            const spawnX = boxX + Math.random() * boxWidth;
            const spawnY = boxY + 20; // Spawn inside box to prevent immediate removal
            bullets.push({
              x: spawnX,
              y: spawnY,
              vx: 0,
              vy: speed,
              size: 16,
              homing: true,
              bulletType: getBulletType()
            });
          }
        },
        // Pattern 4: Mixed - some aimed + some rain
        () => {
          const aimedCount = countScale(3);
          const rainCount = countScale(6);
          const aimedSpeed = 1.1 * speedScale; // Base speed 1.1, scales with difficulty
          const rainSpeed = 1.5 * speedScale; // Base speed 1.5, scales with difficulty

          // Aimed bullets
          for (let i = 0; i < aimedCount; i++) {
            const spawnX = boxX + (boxWidth / (aimedCount + 1)) * (i + 1);
            const spawnY = boxY;
            const dx = playerX - spawnX;
            const dy = playerY - spawnY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            bullets.push({
              x: spawnX,
              y: spawnY,
              vx: (dx / distance) * aimedSpeed,
              vy: (dy / distance) * aimedSpeed,
              size: 16,
              bulletType: getBulletType()
            });
          }
          // Random rain
          for (let i = 0; i < rainCount; i++) {
            bullets.push({
              x: boxX + Math.random() * boxWidth,
              y: boxY + 20, // Spawn inside box to prevent immediate removal
              vx: 0,
              vy: rainSpeed,
              size: 16,
              bulletType: getBulletType()
            });
          }
        }
      ];

      const pattern = patterns[waveNum % patterns.length];
      pattern();
    }

    function gameLoop() {
      phaseTimer++;

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw HP bars (scaled for 600x400 canvas)
      // Noah HP
      ctx.fillStyle = 'white';
      ctx.font = 'bold 13px Arial';
      ctx.fillText(`Noah HP:`, 15, 115);
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(15, 125, 170, 18);
      ctx.fillStyle = '#00ff00';
      ctx.fillRect(15, 125, (noahHP / 100) * 170, 18);

      // Player HP
      ctx.fillStyle = 'white';
      ctx.fillText(`Your HP:`, canvas.width - 185, 115);
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(canvas.width - 185, 125, 170, 18);
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(canvas.width - 185, 125, (playerHP / 20) * 170, 18);

      // Draw battle box
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 4;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      if (phase === 'dodge') {
        waveTimer++;

        // Show Yuwon's dialogue FIRST at start of wave (only once!)
        if (waveTimer === 1 && !shownNoahThisWave) {
          const yuwonMsg = "lets go";
          yuwonDialogueRef.current = yuwonMsg;
          showYuwonDialogueRef.current = true;
          setTimeout(() => {
            showYuwonDialogueRef.current = false;
          }, 1500);
        }

        // Show Noah's demand AFTER Yuwon finishes (at 90 frames = 1.5 seconds)
        if (waveTimer === 90 && !shownNoahThisWave) {
          const randomMsg = noahDialogues[Math.floor(Math.random() * noahDialogues.length)];
          setNoahDialogue(randomMsg);
          setNoahDialogueIndex(0);
          setShowNoahDialogue(true);
          setShownNoahThisWave(true);
          setTimeout(() => setShowNoahDialogue(false), 2000);
        }

        // Start transformation animation shortly after Noah finishes talking (at 150 frames = 2.5 seconds)
        if (waveTimer === 150) {
          transformingRef.current = true;
          transformProgressRef.current = 0;
          setShowYuwonSprite(false); // Hide sprite, show heart
        }

        // Animate transformation over 15 frames (0.25 seconds) - FASTER!
        if (transformingRef.current && transformProgressRef.current < 1) {
          transformProgressRef.current = Math.min(transformProgressRef.current + 0.067, 1); // Faster increment (1/15 instead of 1/30)
        }

        // Spawn bullets AFTER transformation completes (at 165 frames = 2.75 seconds)
        if (waveTimer === 165) {
          spawnWavePattern(wave);
          transformingRef.current = false;
        }

        // Move player with WASD during dodge phase only
        const speed = 1.5;
        let moved = false;

        if (keysRef.current['a']) {
          playerPosRef.current.x -= speed;
          playerDirectionRef.current = 'left';
          moved = true;
        }
        if (keysRef.current['d']) {
          playerPosRef.current.x += speed;
          playerDirectionRef.current = 'right';
          moved = true;
        }
        if (keysRef.current['w']) {
          playerPosRef.current.y -= speed;
          playerDirectionRef.current = 'up';
          moved = true;
        }
        if (keysRef.current['s']) {
          playerPosRef.current.y += speed;
          playerDirectionRef.current = 'down';
          moved = true;
        }

        // Keep player in battle box
        const padding = heartSize / 2;
        if (playerPosRef.current.x < boxX + padding) playerPosRef.current.x = boxX + padding;
        if (playerPosRef.current.x > boxX + boxWidth - padding) playerPosRef.current.x = boxX + boxWidth - padding;
        if (playerPosRef.current.y < boxY + padding) playerPosRef.current.y = boxY + padding;
        if (playerPosRef.current.y > boxY + boxHeight - padding) playerPosRef.current.y = boxY + boxHeight - padding;

        // Update and draw bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
          const bullet = bullets[i];

          // Homing behavior - slightly track player (FIXED to prevent circling)
          if (bullet.homing) {
            const dx = playerPosRef.current.x - bullet.x;
            const dy = playerPosRef.current.y - bullet.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            // Only apply homing if distance is significant and bullet has momentum
            if (distance > 10) {
              const homingStrength = 0.02; // Reduced from 0.05 - gentler homing
              bullet.vx += (dx / distance) * homingStrength;
              bullet.vy += (dy / distance) * homingStrength;

              // Cap velocity to prevent circling
              const speed = Math.sqrt(bullet.vx * bullet.vx + bullet.vy * bullet.vy);
              const maxSpeed = 3;
              if (speed > maxSpeed) {
                bullet.vx = (bullet.vx / speed) * maxSpeed;
                bullet.vy = (bullet.vy / speed) * maxSpeed;
              }
            }
          }

          bullet.x += bullet.vx;
          bullet.y += bullet.vy;

          // Draw bullet sprite
          const bulletSprite = bulletSprites[bullet.bulletType];
          if (bulletSprite && bulletSprite.complete) {
            ctx.save();
            ctx.imageSmoothingEnabled = false; // Pixelated rendering
            ctx.drawImage(
              bulletSprite,
              bullet.x - bullet.size / 2,
              bullet.y - bullet.size / 2,
              bullet.size,
              bullet.size
            );
            ctx.restore();
          } else {
            // Fallback to red circle if sprite not loaded
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Check collision with player heart (only if not invincible and bullet hasn't hit yet)
          if (!invincible && !bullet.hasHit) {
            const dx = bullet.x - playerPosRef.current.x;
            const dy = bullet.y - playerPosRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < bullet.size / 2 + 5) {
              // Hit! Take damage and become invincible briefly
              setPlayerHP(prev => {
                const newHP = prev - 1;
                if (newHP <= 0) {
                  setGameOver(true);
                  cancelAnimationFrame(animationId);
                }
                return newHP;
              });

              // Invincibility frames (blink effect)
              setInvincible(true);
              setTimeout(() => setInvincible(false), 800);

              // Mark bullet as used - disable homing from now on
              bullet.hasHit = true;
              bullet.homing = false;

              // Don't remove bullet - let it pass through!
              continue;
            }
          }

          // Remove bullets outside box
          if (bullet.x < boxX - 50 || bullet.x > boxX + boxWidth + 50 ||
              bullet.y < boxY - 50 || bullet.y > boxY + boxHeight + 50) {
            bullets.splice(i, 1);
          }
        }

        // Draw player (blink if invincible)
        if (!invincible || Math.floor(Date.now() / 100) % 2 === 0) {
          const x = playerPosRef.current.x;
          const y = playerPosRef.current.y;

          // SIMPLE RULE: Sprite ONLY during dialogue (frames 1-165), Heart for everything else
          // Sprite shows: frames 1-165 (dialogue + transformation)
          // Heart shows: frames 165+ AND during attack phase
          // When hit: heart just blinks (invincibility), sprite NEVER comes back until next wave

          const showSprite = phase === 'dodge' && waveTimer <= 165 && showYuwonSprite;
          const showHeart = (phase === 'dodge' && waveTimer >= 165) || (phase === 'attack');

          // Draw Yuwon sprite ONLY during dialogue and transformation
          if (showSprite && playerSpriteRef.current && playerSpriteRef.current.complete) {
            let spriteAlpha = 1;

            // Fade out sprite during transformation (frames 150-165)
            if (transformingRef.current) {
              spriteAlpha = 1 - transformProgressRef.current; // 1 → 0
            }

            ctx.globalAlpha = spriteAlpha;
            ctx.imageSmoothingEnabled = false; // Pixelated rendering

            const spriteHeight = 50; // Scaled down from 60
            const spriteWidth = (spriteHeight / playerSpriteRef.current.height) * playerSpriteRef.current.width;

            ctx.drawImage(
              playerSpriteRef.current,
              x - spriteWidth / 2,
              y - spriteHeight / 2,
              spriteWidth,
              spriteHeight
            );

            ctx.globalAlpha = 1; // Reset alpha
          }

          // Draw heart starting at frame 150 (during transformation)
          if (showHeart) {
            const heartSize = 14; // Scaled down from 16
            ctx.fillStyle = '#ff0000';

            // During transformation, grow and fade in the heart
            let scale = 1;
            let heartAlpha = 1;
            if (transformingRef.current) {
              scale = transformProgressRef.current; // Grow from 0 to 1
              heartAlpha = transformProgressRef.current; // Fade in from 0 to 1
            }

            const actualSize = heartSize * scale;

            ctx.globalAlpha = heartAlpha;

            // Draw chunkier heart shape
            ctx.beginPath();
            const topCurveHeight = actualSize * 0.3;

            // Start at bottom point
            ctx.moveTo(x, y + actualSize / 2);

            // Left side of heart
            ctx.bezierCurveTo(
              x, y + actualSize / 2,
              x - actualSize / 2, y + topCurveHeight,
              x - actualSize / 2, y - topCurveHeight / 2
            );

            // Left top bump
            ctx.bezierCurveTo(
              x - actualSize / 2, y - actualSize / 2,
              x - actualSize / 4, y - actualSize / 2,
              x, y - topCurveHeight / 2
            );

            // Right top bump
            ctx.bezierCurveTo(
              x + actualSize / 4, y - actualSize / 2,
              x + actualSize / 2, y - actualSize / 2,
              x + actualSize / 2, y - topCurveHeight / 2
            );

            // Right side of heart
            ctx.bezierCurveTo(
              x + actualSize / 2, y + topCurveHeight,
              x, y + actualSize / 2,
              x, y + actualSize / 2
            );

            ctx.closePath();
            ctx.fill();

            ctx.globalAlpha = 1; // Reset alpha
          }
        }

        // Phase transition - after 5 seconds, move to attack phase (clear any remaining bullets)
        if (phaseTimer > 300) {
          bullets.length = 0; // Clear any remaining bullets
          setPhase('attack');
          phaseTimer = 0;
        }

      } else if (phase === 'attack') {
        // Attack phase - draw choice prompt (Undertale style, scaled)
        ctx.fillStyle = 'white';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('Choose your action:', canvas.width / 2, boxY + boxHeight / 2 - 35);

        // Draw selection box
        const option1Y = boxY + boxHeight / 2 - 8;
        const option2Y = boxY + boxHeight / 2 + 18;

        // WORK option
        ctx.textAlign = 'left';
        ctx.fillStyle = selectedActionDisplay === 0 ? '#ffff00' : 'white';
        ctx.fillText('* WORK', canvas.width / 2 - 65, option1Y);
        ctx.font = '7px "Press Start 2P"';
        ctx.fillStyle = '#999';
        ctx.fillText('(damage Noah)', canvas.width / 2 - 65, option1Y + 10);

        // SLACK option
        ctx.font = '8px "Press Start 2P"';
        ctx.fillStyle = selectedActionDisplay === 1 ? '#ffff00' : 'white';
        ctx.fillText('* SLACK', canvas.width / 2 - 65, option2Y);
        ctx.font = '7px "Press Start 2P"';
        ctx.fillStyle = '#999';
        ctx.fillText('(damage yourself!)', canvas.width / 2 - 65, option2Y + 10);

        // Draw heart selector
        ctx.fillStyle = '#ff0000';
        const selectorY = selectedActionDisplay === 0 ? option1Y - 2 : option2Y - 2;
        // Draw small heart
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - 78, selectorY);
        ctx.lineTo(canvas.width / 2 - 81, selectorY - 2);
        ctx.lineTo(canvas.width / 2 - 81, selectorY - 4);
        ctx.lineTo(canvas.width / 2 - 78, selectorY - 6);
        ctx.lineTo(canvas.width / 2 - 75, selectorY - 4);
        ctx.lineTo(canvas.width / 2 - 75, selectorY - 2);
        ctx.closePath();
        ctx.fill();

        // Instructions
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '6px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('Arrow keys to select, ENTER to confirm', canvas.width / 2, boxY + boxHeight - 8);
      }

      // Draw Noah's speech bubble (to the right of his sprite) with typewriter effect
      if (showNoahDialogue) {
        const bubbleX = canvas.width / 2 + 60; // To the right of Noah (scaled position)
        const bubbleY = 40; // Moved up
        const bubbleWidth = 150; // Scaled from 180
        const bubbleHeight = 45; // Scaled from 50
        const borderRadius = 8;

        // Draw speech bubble background with rounded corners
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.moveTo(bubbleX + borderRadius, bubbleY);
        ctx.lineTo(bubbleX + bubbleWidth - borderRadius, bubbleY);
        ctx.arcTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + borderRadius, borderRadius);
        ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - borderRadius);
        ctx.arcTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - borderRadius, bubbleY + bubbleHeight, borderRadius);
        ctx.lineTo(bubbleX + borderRadius, bubbleY + bubbleHeight);
        ctx.arcTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - borderRadius, borderRadius);
        ctx.lineTo(bubbleX, bubbleY + borderRadius);
        ctx.arcTo(bubbleX, bubbleY, bubbleX + borderRadius, bubbleY, borderRadius);
        ctx.closePath();
        ctx.fill();

        // Draw tail pointing to Noah (on the left side)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.beginPath();
        ctx.moveTo(bubbleX, bubbleY + 20); // Start from left side of bubble
        ctx.lineTo(bubbleX - 15, bubbleY + 15); // Point to Noah
        ctx.lineTo(bubbleX, bubbleY + 30); // Back to bubble
        ctx.closePath();
        ctx.fill();

        // Draw border around bubble
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bubbleX + borderRadius, bubbleY);
        ctx.lineTo(bubbleX + bubbleWidth - borderRadius, bubbleY);
        ctx.arcTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + borderRadius, borderRadius);
        ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - borderRadius);
        ctx.arcTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - borderRadius, bubbleY + bubbleHeight, borderRadius);
        ctx.lineTo(bubbleX + borderRadius, bubbleY + bubbleHeight);
        ctx.arcTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - borderRadius, borderRadius);
        ctx.lineTo(bubbleX, bubbleY + borderRadius);
        ctx.arcTo(bubbleX, bubbleY, bubbleX + borderRadius, bubbleY, borderRadius);
        ctx.closePath();
        ctx.stroke();

        // Draw tail border
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bubbleX, bubbleY + 20);
        ctx.lineTo(bubbleX - 15, bubbleY + 15);
        ctx.lineTo(bubbleX, bubbleY + 30);
        ctx.stroke();

        // Draw text with typewriter effect - PIXEL FONT (scaled)
        ctx.fillStyle = '#000';
        ctx.font = '7px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(noahDialogue.substring(0, noahDialogueIndex), bubbleX + bubbleWidth / 2, bubbleY + bubbleHeight / 2 + 4);
      }

      // Draw Yuwon's dialogue box - NO ANIMATION, JUST SHOW TEXT (using refs to avoid HP state issue)
      if (showYuwonDialogueRef.current) {
        // Black background box (scaled for 600x400 canvas)
        ctx.fillStyle = '#000000';
        ctx.fillRect(140, 160, 250, 30);

        // White border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(140, 160, 250, 30);

        // White text - NO TYPEWRITER, JUST SHOW THE FULL TEXT
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Show FULL text immediately (no animation)
        ctx.fillText(yuwonDialogueRef.current, 148, 168);
      }

      // Instructions
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText('WASD: Move', 10, canvas.height - 10);

      animationId = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver, victory, phase, wave, showNoahDialogue, noahDialogue, noahDialogueIndex, showYuwonDialogue, yuwonDialogue, yuwonDialogueIndex, invincible, shownNoahThisWave, slacked, selectedActionDisplay, showYuwonSprite]);

  const handleStart = () => {
    setGameStarted(true);
    setGameOver(false);
    setVictory(false);
    setSlacked(false);
    setPlayerHP(20);
    setNoahHP(100);
    setWave(0);
    setPhase('dodge');
    setInvincible(false);
    setNoahDialogue('');
    setShowNoahDialogue(false);
    setNoahDialogueIndex(0);
    setYuwonDialogue('');
    setShowYuwonDialogue(false);
    setYuwonDialogueIndex(0);
    setShownNoahThisWave(false);
    selectedActionRef.current = 0;
    setSelectedActionDisplay(0);
    setShowYuwonSprite(true);
    playerPosRef.current = { x: 270, y: 320 };
    transformingRef.current = false;
    transformProgressRef.current = 0;
  };

  const handleRestart = () => {
    handleStart();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      fontFamily: '"Press Start 2P", cursive'
    }}>
      <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '20px', textShadow: '2px 2px 4px rgba(255,255,255,0.3)', lineHeight: '1.5' }}>
        📄 PAPER HELL! 📄
      </h1>
      <p style={{ color: 'white', fontSize: '12px', marginBottom: '30px', textAlign: 'center', lineHeight: '1.6' }}>
        Noah won't stop giving you work!<br />Dodge and fight back!
      </p>

      {!gameStarted ? (
        <div style={{
          background: '#000000',
          padding: '30px',
          border: '5px solid white',
          boxShadow: '0 10px 40px rgba(255,255,255,0.3)',
          maxWidth: '800px',
          display: 'flex',
          gap: '30px',
          alignItems: 'center'
        }}>
          {/* Left side - Characters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '0 0 auto' }}>
            <div style={{ textAlign: 'center' }}>
              <img src="/images/walking-sprites/Noah/Noah_Idle_Front.gif" alt="Noah" style={{ width: 'auto', height: '100px', marginBottom: '10px', imageRendering: 'pixelated' }} />
              <div style={{ border: '2px solid white', padding: '8px', backgroundColor: 'black' }}>
                <p style={{ fontSize: '8px', color: 'white', marginBottom: '0', lineHeight: '1.5' }}>
                  "Here's more work<br />for you! 💼"
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <img src="/images/walking-sprites/Yuwon/Yuwon_Idle_Front.gif" alt="Yuwon" style={{ width: 'auto', height: '100px', marginBottom: '10px', imageRendering: 'pixelated' }} />
              <div style={{ border: '2px solid white', padding: '8px', backgroundColor: 'black' }}>
                <p style={{ fontSize: '8px', color: 'white', marginBottom: '0', lineHeight: '1.5' }}>
                  "dont wanna!! 😤"
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Instructions and Button */}
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ fontSize: '8px', color: 'white', textAlign: 'left', border: '2px solid white', padding: '15px', lineHeight: '1.6' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>HOW TO PLAY:</p>
              <p style={{ marginBottom: '5px' }}>• DODGE PHASE:<br />Use WASD to dodge<br />paper bullets!</p>
              <p style={{ marginBottom: '5px' }}>• ATTACK PHASE:<br />Choose action:</p>
              <p style={{ marginLeft: '10px', marginBottom: '5px' }}>W = WORK<br />(damage Noah)</p>
              <p style={{ marginLeft: '10px', marginBottom: '5px' }}>S = SLACK<br />(damage yourself!)</p>
              <p style={{ marginTop: '8px', marginBottom: '0', fontWeight: 'bold' }}>* 3 endings!</p>
            </div>
            <button
              onClick={handleStart}
              style={{
                padding: '15px 30px',
                fontSize: '12px',
                fontWeight: 700,
                background: 'black',
                color: 'white',
                border: '3px solid white',
                cursor: 'pointer',
                fontFamily: '"Press Start 2P", cursive',
                lineHeight: '1.5'
              }}
            >
              [START BATTLE]
            </button>
          </div>
        </div>
      ) : (
        <>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            {/* Noah GIF positioned above canvas (hide during endings, scaled) */}
            {!gameOver && !victory && !slacked && (
              <img
                src="/images/walking-sprites/Noah/Noah_Idle_Front.gif"
                alt="Noah"
                style={{
                  position: 'absolute',
                  top: '25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  height: '85px', // Scaled from 100px
                  zIndex: 10,
                  pointerEvents: 'none',
                  imageRendering: 'pixelated'
                }}
              />
            )}
            <canvas
              ref={canvasRef}
              style={{
                border: '5px solid white',
                borderRadius: '10px',
                boxShadow: '0 10px 40px rgba(255,255,255,0.3)',
                background: '#000000'
              }}
            />
          </div>
          {gameOver && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#000000',
              padding: '25px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(255,255,255,0.3)',
              border: '3px solid white',
              minWidth: '280px'
            }}>
              <h2 style={{ fontSize: '28px', color: '#ff5252', marginBottom: '8px' }}>OVERWORKED 😭</h2>
              <p style={{ fontSize: '16px', color: '#cccccc', marginBottom: '15px' }}>
                You got buried under work!
              </p>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Survived {wave} waves
              </p>
              <img
                src="/images/underboss-game/caught.jpg"
                alt="Noah caught you"
                style={{
                  width: '160px',
                  height: 'auto',
                  marginBottom: '15px',
                  borderRadius: '8px',
                  border: '2px solid white'
                }}
              />
              <p style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', marginBottom: '15px' }}>
                "Back to work! There's more coming! 📄📄📄"
              </p>
              <button
                onClick={handleRestart}
                style={{
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontWeight: 700,
                  background: 'white',
                  color: '#000',
                  border: '2px solid white',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
                }}
              >
                🔄 TRY AGAIN
              </button>
            </div>
          )}
          {victory && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#000000',
              padding: '25px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(255,255,255,0.3)',
              border: '3px solid white',
              minWidth: '280px'
            }}>
              <h2 style={{ fontSize: '28px', color: '#4caf50', marginBottom: '8px' }}>WORK COMPLETE! 🎉</h2>
              <p style={{ fontSize: '16px', color: '#cccccc', marginBottom: '15px' }}>
                You finished all the work!
              </p>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Completed {wave} waves
              </p>
              <img
                src="/images/underboss-game/yuwon-win.jpg"
                alt="Yuwon wins!"
                style={{
                  width: '160px',
                  height: 'auto',
                  marginBottom: '15px',
                  borderRadius: '8px',
                  border: '2px solid white'
                }}
              />
              <p style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', marginBottom: '15px' }}>
                "Finally done with work!! 😎"
              </p>
              <button
                onClick={handleRestart}
                style={{
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontWeight: 700,
                  background: 'white',
                  color: '#000',
                  border: '2px solid white',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
                }}
              >
                🔄 PLAY AGAIN
              </button>
            </div>
          )}
          {slacked && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#000000',
              padding: '25px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 10px 40px rgba(255,255,255,0.3)',
              border: '3px solid white',
              minWidth: '280px'
            }}>
              <h2 style={{ fontSize: '28px', color: '#ff9800', marginBottom: '8px' }}>SLACKER 😴</h2>
              <p style={{ fontSize: '16px', color: '#cccccc', marginBottom: '15px' }}>
                You slacked off too much!
              </p>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                Noah choked you with paper! 📄
              </p>
              <img src="/images/Noah_1.png" alt="Noah" style={{ width: '50px', height: '50px', marginBottom: '10px', filter: 'grayscale(100%)' }} />
              <p style={{ fontSize: '11px', color: '#999', fontStyle: 'italic', marginBottom: '15px' }}>
                "Should've done your work instead of slacking! 💼"
              </p>
              <button
                onClick={handleRestart}
                style={{
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontWeight: 700,
                  background: 'white',
                  color: '#000',
                  border: '2px solid white',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255,255,255,0.3)'
                }}
              >
                🔄 TRY AGAIN
              </button>
            </div>
          )}
        </>
      )}

      <button
        onClick={() => window.location.href = '/'}
        style={{
          marginTop: '30px',
          padding: '12px 30px',
          fontSize: '10px',
          fontWeight: 600,
          background: 'white',
          color: '#000',
          border: '2px solid white',
          borderRadius: '10px',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(255,255,255,0.3)',
          fontFamily: '"Press Start 2P", cursive',
          lineHeight: '1.5'
        }}
      >
        ← Back to Work
      </button>
    </div>
  );
}

export default ShootEmUp;
