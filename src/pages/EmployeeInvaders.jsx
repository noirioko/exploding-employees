import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

function EmployeeInvaders() {
  const { unlockAchievement } = useApp();
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [victory, setVictory] = useState(false);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);

  // Unlock achievements when endings are reached
  useEffect(() => {
    if (gameOver) {
      unlockAchievement('employeeInvaders', 'gameOver');
    }
  }, [gameOver, unlockAchievement]);

  useEffect(() => {
    if (victory) {
      unlockAchievement('employeeInvaders', 'victory');
    }
  }, [victory, unlockAchievement]);

  useEffect(() => {
    if (!gameStarted || gameOver || victory) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = 600;
    canvas.height = 400;

    // Load sprites
    const yuwonSprite = new Image();
    yuwonSprite.src = '/images/walking-sprites/Yuwon/Yuwon_Idle_Front.gif';

    const noahSprite = new Image();
    noahSprite.src = '/images/walking-sprites/Noah/Noah_Idle_Front.gif';

    // Load paper/folder sprites from Underboss
    const paperImages = {
      folder: new Image(),
      drive: new Image(),
      notepad: new Image()
    };
    paperImages.folder.src = '/images/underboss-game/folder-03.png';
    paperImages.drive.src = '/images/underboss-game/drive-01.png';
    paperImages.notepad.src = '/images/underboss-game/notepad-01.png';

    // Game state
    const player = {
      x: 270,
      y: 350,
      width: 40,
      height: 40,
      speed: 3, // Slower movement for better control
      sprite: yuwonSprite
    };

    const keys = {};
    const bullets = [];
    const enemies = [];
    const enemyBullets = [];
    let animationId;
    let lastShotTime = 0;
    const shootCooldown = 250; // milliseconds

    // Paper/work item sprite types
    const paperSpriteTypes = ['folder', 'drive', 'notepad'];

    // Noah boss at the top
    const noah = {
      x: canvas.width / 2 - 25,
      y: 20,
      width: 50,
      height: 50,
      sprite: noahSprite
    };

    // Create enemy grid (paper/folder icons)
    function spawnEnemies() {
      enemies.length = 0;

      // Wave 1: 1 row, 4 columns, 2 HP each
      // Wave 2+: gradually increase
      let rows, cols, hp;
      if (wave === 1) {
        rows = 1;
        cols = 4;
        hp = 2;
      } else {
        rows = 1 + Math.floor((wave - 1) / 2); // Slower row increase
        cols = 4 + Math.floor((wave - 1) / 2); // Slower column increase
        hp = 2 + Math.floor((wave - 1) / 3); // Slower HP increase
      }

      const enemyWidth = 30;
      const enemyHeight = 30;
      const spacing = 50;
      const startX = (canvas.width - (cols * spacing)) / 2;
      const startY = 80; // Start below Noah

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const spriteType = paperSpriteTypes[Math.floor(Math.random() * paperSpriteTypes.length)];
          enemies.push({
            x: startX + col * spacing,
            y: startY + row * spacing,
            width: enemyWidth,
            height: enemyHeight,
            spriteType: spriteType,
            sprite: paperImages[spriteType],
            hp: hp,
            maxHP: hp,
            alive: true
          });
        }
      }
    }

    spawnEnemies();

    // Controls
    const handleKeyDown = (e) => {
      keys[e.key] = true;
      e.preventDefault();
    };

    const handleKeyUp = (e) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Shoot bullet
    function shoot() {
      const now = Date.now();
      if (now - lastShotTime < shootCooldown) return;

      bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 15,
        speed: 4
      });
      lastShotTime = now;

      // Sound effect (optional)
      const audio = new Audio('/sounds/pixel/dialogue.wav');
      audio.volume = 0.1;
      audio.play().catch(() => {});
    }

    // Paper/folder enemies shoot mini paper bullets
    function enemyShoot() {
      // Get all alive enemies
      const aliveEnemies = enemies.filter(e => e.alive);
      if (aliveEnemies.length === 0) return;

      // Pick a random alive enemy to shoot
      const shooter = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];

      const bulletType = paperSpriteTypes[Math.floor(Math.random() * paperSpriteTypes.length)];
      enemyBullets.push({
        x: shooter.x + shooter.width / 2 - 8,
        y: shooter.y + shooter.height,
        width: 20,
        height: 20,
        speed: 2, // Slower bullet speed
        spriteType: bulletType,
        sprite: paperImages[bulletType]
      });
    }

    let enemyShootTimer = 0;
    const enemyShootInterval = 120; // frames between shots (2 seconds between each shot)
    let enemyMoveTimer = 0;
    const enemyMoveInterval = 300; // Move down every 5 seconds (300 frames at 60fps) - much slower!

    function gameLoop() {
      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move player
      if (keys['ArrowLeft'] || keys['a']) {
        player.x -= player.speed;
      }
      if (keys['ArrowRight'] || keys['d']) {
        player.x += player.speed;
      }

      // Keep player in bounds
      if (player.x < 0) player.x = 0;
      if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

      // Shoot
      if (keys[' '] || keys['ArrowUp'] || keys['w']) {
        shoot();
      }

      // Draw player (Yuwon sprite) - maintain aspect ratio
      if (player.sprite.complete) {
        ctx.imageSmoothingEnabled = false; // Pixelated rendering
        const spriteHeight = 50;
        const spriteWidth = (spriteHeight / player.sprite.height) * player.sprite.width;
        ctx.drawImage(
          player.sprite,
          player.x - spriteWidth / 2 + player.width / 2,
          player.y - spriteHeight / 2 + player.height / 2,
          spriteWidth,
          spriteHeight
        );
      } else {
        // Fallback
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🚀', player.x + player.width / 2, player.y + player.height - 5);
      }

      // Update and draw bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.y -= bullet.speed;

        // Draw bullet
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove if off screen
        if (bullet.y < 0) {
          bullets.splice(i, 1);
          continue;
        }

        // Check collision with enemies
        for (let j = enemies.length - 1; j >= 0; j--) {
          const enemy = enemies[j];
          if (!enemy.alive) continue;

          if (
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          ) {
            // Damage the enemy
            enemy.hp -= 1;
            if (enemy.hp <= 0) {
              enemy.alive = false;
              setScore(prev => prev + 10);
            } else {
              setScore(prev => prev + 2); // Small score for hitting but not destroying
            }
            bullets.splice(i, 1);
            break;
          }
        }
      }

      // Draw Noah boss at the top - maintain aspect ratio
      if (noah.sprite.complete) {
        ctx.imageSmoothingEnabled = false;
        const noahHeight = 60;
        const noahWidth = (noahHeight / noah.sprite.height) * noah.sprite.width;
        ctx.drawImage(
          noah.sprite,
          noah.x - noahWidth / 2 + noah.width / 2,
          noah.y,
          noahWidth,
          noahHeight
        );
      }

      // Move enemies down periodically
      enemyMoveTimer++;
      if (enemyMoveTimer >= enemyMoveInterval) {
        enemies.forEach(enemy => {
          if (enemy.alive) {
            enemy.y += 10; // Move down 10 pixels
          }
        });
        enemyMoveTimer = 0;
      }

      // Check if any enemy reached the bottom (game over)
      for (const enemy of enemies) {
        if (enemy.alive && enemy.y + enemy.height >= canvas.height - 50) {
          setGameOver(true);
          cancelAnimationFrame(animationId);
          return;
        }
      }

      // Draw enemies (paper/folder images)
      enemies.forEach(enemy => {
        if (enemy.alive) {
          // Draw enemy sprite
          if (enemy.sprite && enemy.sprite.complete) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(
              enemy.sprite,
              enemy.x,
              enemy.y,
              enemy.width,
              enemy.height
            );
          } else {
            // Fallback to emoji if image not loaded
            ctx.font = '30px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('📄', enemy.x + enemy.width / 2, enemy.y + enemy.height - 5);
          }

          // Show HP bar if damaged
          if (enemy.hp < enemy.maxHP) {
            const barWidth = 25;
            const barHeight = 3;
            const barX = enemy.x + (enemy.width - barWidth) / 2;
            const barY = enemy.y - 8;

            // Background (red)
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            // HP remaining (green)
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(barX, barY, barWidth * (enemy.hp / enemy.maxHP), barHeight);
          }
        }
      });

      // Enemy bullets
      enemyShootTimer++;
      if (enemyShootTimer >= enemyShootInterval) {
        enemyShoot();
        enemyShootTimer = 0;
      }

      // Update and draw enemy bullets (paper image sprites)
      for (let i = enemyBullets.length - 1; i >= 0; i--) {
        const bullet = enemyBullets[i];
        bullet.y += bullet.speed;

        // Draw paper image bullet
        if (bullet.sprite && bullet.sprite.complete) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(
            bullet.sprite,
            bullet.x,
            bullet.y,
            bullet.width,
            bullet.height
          );
        } else {
          // Fallback to emoji
          ctx.font = '16px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('📄', bullet.x + bullet.width / 2, bullet.y + bullet.height - 2);
        }

        // Remove if off screen
        if (bullet.y > canvas.height) {
          enemyBullets.splice(i, 1);
          continue;
        }

        // Check collision with player
        if (
          bullet.x < player.x + player.width &&
          bullet.x + bullet.width > player.x &&
          bullet.y < player.y + player.height &&
          bullet.y + bullet.height > player.y
        ) {
          setGameOver(true);
          cancelAnimationFrame(animationId);
          return;
        }
      }

      // Check if all enemies dead
      const aliveCount = enemies.filter(e => e.alive).length;
      if (aliveCount === 0) {
        if (wave >= 5) {
          setVictory(true);
          cancelAnimationFrame(animationId);
          return;
        }
        setWave(prev => prev + 1);
        spawnEnemies();
      }

      // Draw score
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${score}`, 10, 20);
      ctx.fillText(`Wave: ${wave}`, 10, 40);

      // Draw controls hint
      ctx.font = '12px Arial';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('Arrow Keys or WASD to move, SPACE to shoot', 10, canvas.height - 10);

      animationId = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gameOver, victory, unlockAchievement]);

  const handleStart = () => {
    setGameStarted(true);
    setGameOver(false);
    setVictory(false);
    setScore(0);
    setWave(1);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      {!gameStarted ? (
        <div style={{
          textAlign: 'center',
          color: 'white',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#00ff00' }}>
            📄 NOAH INVADERS 📄
          </h1>
          <p style={{ fontSize: '16px', marginBottom: '30px', color: '#ccc' }}>
            Noah is invading with his paperwork! Defend yourself!
          </p>
          <div style={{
            background: '#222',
            padding: '20px',
            borderRadius: '10px',
            border: '2px solid #00ff00',
            marginBottom: '30px',
            maxWidth: '400px'
          }}>
            <p style={{ fontSize: '14px', marginBottom: '10px' }}>
              🎮 <strong>Controls:</strong>
            </p>
            <p style={{ fontSize: '13px', marginBottom: '5px' }}>
              Arrow Keys or WASD - Move
            </p>
            <p style={{ fontSize: '13px', marginBottom: '5px' }}>
              SPACE - Shoot
            </p>
            <p style={{ fontSize: '13px', marginTop: '15px', color: '#00ff00' }}>
              💡 Clear 5 waves to win!
            </p>
          </div>
          <button
            onClick={handleStart}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
              color: '#000',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,255,0,0.3)'
            }}
          >
            🚀 START GAME
          </button>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            style={{
              border: '3px solid #00ff00',
              borderRadius: '10px',
              boxShadow: '0 0 20px rgba(0,255,0,0.3)'
            }}
          />
          {gameOver && (
            <div style={{
              position: 'absolute',
              background: 'rgba(0,0,0,0.9)',
              padding: '40px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '3px solid #ff0000',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '36px', color: '#ff0000', marginBottom: '15px' }}>
                DEFEATED! 💀
              </h2>
              <p style={{ fontSize: '20px', marginBottom: '20px' }}>
                Noah buried you in paperwork!
              </p>
              <p style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
                Final Score: {score}
              </p>
              <button
                onClick={handleStart}
                style={{
                  padding: '15px 40px',
                  fontSize: '18px',
                  fontWeight: '700',
                  background: 'white',
                  color: '#000',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                🔄 TRY AGAIN
              </button>
            </div>
          )}
          {victory && (
            <div style={{
              position: 'absolute',
              background: 'rgba(0,0,0,0.9)',
              padding: '40px',
              borderRadius: '20px',
              textAlign: 'center',
              border: '3px solid #00ff00',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '36px', color: '#00ff00', marginBottom: '15px' }}>
                VICTORY! 🎉
              </h2>
              <p style={{ fontSize: '20px', marginBottom: '20px' }}>
                You defeated all the Noahs!
              </p>
              <p style={{ fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
                Final Score: {score}
              </p>
              <button
                onClick={handleStart}
                style={{
                  padding: '15px 40px',
                  fontSize: '18px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}
              >
                🔄 PLAY AGAIN
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EmployeeInvaders;
