import { useState, useEffect, useRef } from 'react';
import SpriteAnimation from '../components/SpriteAnimation';

function NoahWalkingTest() {
  const [position, setPosition] = useState({ x: 320, y: 180 });
  const [direction, setDirection] = useState('down'); // 'up', 'down', 'left', 'right'
  const [isWalking, setIsWalking] = useState(false);
  const keysPressed = useRef({});

  // WASD controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      let newDirection = direction;
      let moving = false;

      if (keysPressed.current['w']) {
        newDirection = 'up';
        moving = true;
      } else if (keysPressed.current['s']) {
        newDirection = 'down';
        moving = true;
      } else if (keysPressed.current['a']) {
        newDirection = 'left';
        moving = true;
      } else if (keysPressed.current['d']) {
        newDirection = 'right';
        moving = true;
      }

      if (newDirection !== direction) {
        setDirection(newDirection);
      }
      setIsWalking(moving);
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;

      // Check if any movement keys are still pressed
      const stillMoving = keysPressed.current['w'] || keysPressed.current['s'] ||
                         keysPressed.current['a'] || keysPressed.current['d'];

      if (!stillMoving) {
        setIsWalking(false);
      } else {
        // Update direction based on remaining pressed keys
        if (keysPressed.current['w']) setDirection('up');
        else if (keysPressed.current['s']) setDirection('down');
        else if (keysPressed.current['a']) setDirection('left');
        else if (keysPressed.current['d']) setDirection('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [direction]);

  // Movement loop
  useEffect(() => {
    if (!isWalking) return;

    const moveSpeed = 2;
    let animationFrameId;

    const move = () => {
      setPosition(prev => {
        let newX = prev.x;
        let newY = prev.y;

        if (direction === 'up') newY -= moveSpeed;
        else if (direction === 'down') newY += moveSpeed;
        else if (direction === 'left') newX -= moveSpeed;
        else if (direction === 'right') newX += moveSpeed;

        // Keep within canvas bounds (640x360)
        newX = Math.max(45, Math.min(595, newX));
        newY = Math.max(45, Math.min(315, newY));

        return { x: newX, y: newY };
      });

      animationFrameId = requestAnimationFrame(move);
    };

    animationFrameId = requestAnimationFrame(move);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isWalking, direction]);

  // Get GIF based on direction
  const getGif = () => {
    if (!isWalking) {
      if (direction === 'up') return '/images/Noah/Idle/Noah_Idle_Back_Outfit1animation.gif';
      if (direction === 'down') return '/images/Noah/Idle/Noah_Idle_Front_Outfit1animation.gif';
      if (direction === 'left') return '/images/Noah/Idle/Noah_Idle_Left_Outfit1animation.gif';
      return '/images/Noah/Idle/Noah_Idle_Left_Outfit1animation.gif'; // right uses left flipped
    } else {
      if (direction === 'up') return '/images/Noah/Walking/walkback_noah.gif';
      if (direction === 'down') return '/images/Noah/Walking/walkfront_noah.gif';
      if (direction === 'left') return '/images/Noah/Walking/walkside_noah.gif';
      return '/images/Noah/Walking/walkside_noah.gif'; // right uses left flipped
    }
  };

  const shouldFlip = direction === 'left'; // Flip when going left

  return (
    <div style={{ padding: '40px', background: '#f0f0f0', minHeight: '100vh' }}>
      <h1>Noah Walking Animation Test</h1>

      <div style={{ marginBottom: '20px' }}>
        <p><strong>Controls:</strong> Use WASD to move Noah</p>
        <p>Direction: <strong>{direction.toUpperCase()}</strong> | Walking: <strong>{isWalking ? 'YES' : 'NO'}</strong> | Position: ({Math.round(position.x)}, {Math.round(position.y)})</p>
      </div>

      {/* Canvas Game View */}
      <div style={{
        width: '640px',
        height: '360px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: '3px solid #333',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '40px'
      }}>
        {/* Noah Character */}
        <div style={{
          position: 'absolute',
          left: `${position.x - 45}px`,
          top: `${position.y - 45}px`,
          width: '90px',
          height: '90px',
          transform: shouldFlip ? 'scaleX(-1)' : 'scaleX(1)',
          transition: 'none'
        }}>
          <img
            src={getGif()}
            alt="Noah"
            style={{
              imageRendering: 'pixelated'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Idle Sprite - No Flip */}
        <div style={{ textAlign: 'center' }}>
          <h3>Idle - No Flip</h3>
          <div style={{ border: '2px solid red', padding: '20px', background: 'white' }}>
            <SpriteAnimation
              spriteSheet="/images/Idle-noah/Noah_Idle_Left_Outfit 1.png"
              rows={1}
              columns={8}
              frameDelay={100}
              selectedFrames={[0, 1, 2, 3, 4, 5, 6, 7]}
              scale={1.4}
            />
          </div>
          <p>Path: /images/Idle-noah/Noah_Idle_Left_Outfit 1.png</p>
        </div>

        {/* Idle Sprite - Flipped */}
        <div style={{ textAlign: 'center' }}>
          <h3>Idle - Flipped</h3>
          <div style={{ border: '2px solid blue', padding: '20px', background: 'white' }}>
            <SpriteAnimation
              spriteSheet="/images/Idle-noah/Noah_Idle_Left_Outfit 1.png"
              rows={1}
              columns={8}
              frameDelay={100}
              selectedFrames={[0, 1, 2, 3, 4, 5, 6, 7]}
              scale={1.4}
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
        </div>

        {/* Walking Sprite - No Flip */}
        <div style={{ textAlign: 'center' }}>
          <h3>Walking - No Flip</h3>
          <div style={{ border: '2px solid green', padding: '20px', background: 'white' }}>
            <SpriteAnimation
              spriteSheet="/images/Noah/Walking/Noah_Walking_Left_Outfit 1.png"
              rows={1}
              columns={8}
              frameDelay={80}
              selectedFrames={[0, 1, 2, 3, 4, 5, 6, 7]}
              scale={1.4}
            />
          </div>
          <p>Path: /images/Noah/Walking/Noah_Walking_Left_Outfit 1.png</p>
        </div>

        {/* Walking Sprite - Flipped */}
        <div style={{ textAlign: 'center' }}>
          <h3>Walking - Flipped</h3>
          <div style={{ border: '2px solid purple', padding: '20px', background: 'white' }}>
            <SpriteAnimation
              spriteSheet="/images/Noah/Walking/Noah_Walking_Left_Outfit 1.png"
              rows={1}
              columns={8}
              frameDelay={80}
              selectedFrames={[0, 1, 2, 3, 4, 5, 6, 7]}
              scale={1.4}
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
        </div>

        {/* Dynamic - Based on State */}
        <div style={{ textAlign: 'center' }}>
          <h3>Dynamic (from canvas above)</h3>
          <div style={{ border: '2px solid orange', padding: '20px', background: 'white' }}>
            <img
              src={getGif()}
              alt="Noah Dynamic"
              style={{
                width: '90px',
                height: '90px',
                imageRendering: 'pixelated',
                transform: shouldFlip ? 'scaleX(-1)' : 'scaleX(1)'
              }}
            />
          </div>
          <p>State: {isWalking ? 'WALKING' : 'IDLE'} - {direction.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}

export default NoahWalkingTest;
