import { useState } from 'react';

function ExplosionTest() {
  const [stage, setStage] = useState('idle'); // idle, shake, grow, explode
  const [isShaking, setIsShaking] = useState(false);

  const startExplosion = () => {
    // Reset
    setStage('idle');
    setIsShaking(false);

    // Step 1: Angry shake (1 second)
    setTimeout(() => {
      setStage('shake');
      setIsShaking(true);

      setTimeout(() => setIsShaking(false), 1000);

      // Step 2: Growing (1 second)
      setTimeout(() => {
        setStage('grow');

        // Step 3: Explosion (0.6 seconds)
        setTimeout(() => {
          setStage('explode');
          playSound('roblox-explosion-sounds');

          // Step 4: Reset after explosion
          setTimeout(() => {
            setStage('idle');
          }, 600);
        }, 1000);
      }, 1000);
    }, 100);
  };

  const playSound = (emotion) => {
    try {
      const audio = new Audio(`/sounds/${emotion}.mp3`);
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Sound play failed:', err));
    } catch (err) {
      console.log('Sound loading failed:', err);
    }
  };

  const getImageSrc = () => {
    switch (stage) {
      case 'shake':
        return '/images/working_employees/corneryuwon_superangry.png';
      case 'grow':
        return '/images/working_employees/corneryuwon_superangry.png';
      case 'explode':
        return `/images/working_employees/explode.gif?t=${Date.now()}`;
      default:
        return '/images/working_employees/corneryuwon_neutral.png';
    }
  };

  const getScale = () => {
    switch (stage) {
      case 'grow':
        return 1.3;
      case 'explode':
        return 1.5;
      default:
        return 1;
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Explosion Animation Test</h1>

      <style>
        {`
          @keyframes shakeAngry {
            0% { transform: rotate(0deg) scale(1); }
            10% { transform: translateX(-10px) rotate(-8deg) scale(1); }
            20% { transform: translateX(10px) rotate(8deg) scale(1); }
            30% { transform: translateX(-10px) rotate(-8deg) scale(1); }
            40% { transform: translateX(10px) rotate(8deg) scale(1); }
            50% { transform: translateX(-8px) rotate(-6deg) scale(1); }
            60% { transform: translateX(8px) rotate(6deg) scale(1); }
            70% { transform: translateX(-5px) rotate(-4deg) scale(1); }
            80% { transform: translateX(5px) rotate(4deg) scale(1); }
            90% { transform: translateX(-2px) rotate(-2deg) scale(1); }
            100% { transform: translateX(0) rotate(0deg) scale(1); }
          }

          @keyframes grow {
            0% { transform: scale(1); }
            100% { transform: scale(1.3); }
          }
        `}
      </style>

      <div style={{
        margin: '40px auto',
        display: 'inline-block',
        position: 'relative'
      }}>
        <img
          src={getImageSrc()}
          alt="Yuwon"
          style={{
            width: '150px',
            height: 'auto',
            imageRendering: 'pixelated',
            userSelect: 'none',
            transform: `scale(${getScale()})`,
            animation:
              isShaking ? 'shakeAngry 1s' :
              stage === 'grow' ? 'grow 1s forwards' :
              'none',
            transition: stage === 'explode' ? 'transform 0.1s ease-out' : 'none'
          }}
        />
      </div>

      <div style={{ marginTop: '40px' }}>
        <button
          onClick={startExplosion}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Test Explosion
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '20px', fontWeight: 'bold', color: '#e91e63' }}>
        Current Stage: {stage.toUpperCase()}
      </div>

      <div style={{ marginTop: '20px', color: '#666' }}>
        <p>Sequence:</p>
        <ol style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
          <li>Idle (neutral face)</li>
          <li>Shake (1 second) - angry face + shake</li>
          <li>Grow (1 second) - slowly grow to 1.3x</li>
          <li>Explode (0.6 seconds) - explosion GIF at 1.5x + sound</li>
          <li>Reset to idle</li>
        </ol>
      </div>
    </div>
  );
}

export default ExplosionTest;
