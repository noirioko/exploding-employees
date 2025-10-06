import { useState, useEffect, useRef } from 'react';

function AnimationTest() {
  const [currentTest, setCurrentTest] = useState('idle');
  const [sleepFrame, setSleepFrame] = useState(1);
  const [blinkFrame, setBlinkFrame] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [stage, setStage] = useState('idle');

  const sleepAnimationTimerRef = useRef(null);
  const blinkTimerRef = useRef(null);

  // Sleep animation (123, pause, 321, pause, repeat)
  useEffect(() => {
    if (currentTest !== 'sleep') return;

    const animateSleep = async () => {
      // 1 → 2 → 3
      setSleepFrame(1);
      await new Promise(resolve => setTimeout(resolve, 400));
      setSleepFrame(2);
      await new Promise(resolve => setTimeout(resolve, 400));
      setSleepFrame(3);
      await new Promise(resolve => setTimeout(resolve, 400));

      // Pause
      await new Promise(resolve => setTimeout(resolve, 4000));

      // 3 → 2 → 1
      setSleepFrame(3);
      await new Promise(resolve => setTimeout(resolve, 400));
      setSleepFrame(2);
      await new Promise(resolve => setTimeout(resolve, 400));
      setSleepFrame(1);
      await new Promise(resolve => setTimeout(resolve, 400));

      // Pause, then play sound and repeat
      await new Promise(resolve => setTimeout(resolve, 4000));
      playSound('sleepy');
      animateSleep();
    };

    playSound('sleep');
    animateSleep();

    return () => {
      if (sleepAnimationTimerRef.current) {
        clearInterval(sleepAnimationTimerRef.current);
      }
    };
  }, [currentTest]);

  // Blink animation (3 frames)
  useEffect(() => {
    if (currentTest !== 'blink') return;

    const performBlink = async () => {
      // Blink down
      for (let i = 1; i <= 3; i++) {
        setBlinkFrame(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      // Blink up
      for (let i = 2; i >= 0; i--) {
        setBlinkFrame(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Pause then repeat
      setTimeout(performBlink, 2000);
    };

    performBlink();
  }, [currentTest]);

  // Explosion sequence
  const startExplosion = async () => {
    setStage('idle');
    setIsShaking(false);

    await new Promise(resolve => setTimeout(resolve, 100));

    // Step 1: Shake all around (1 second)
    setStage('shake');
    setIsShaking(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsShaking(false);

    // Step 2: Grow smoothly to 1.2x (0.5 seconds)
    setStage('grow1');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Step 3: Continue growing to 1.4x (0.5 seconds)
    setStage('grow2');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Step 4: EXPLOSION - show gif and fade Yuwon
    setStage('explode');
    playSound('roblox-explosion-sounds');
    await new Promise(resolve => setTimeout(resolve, 1000));

    setStage('idle');
  };

  useEffect(() => {
    if (currentTest === 'explode') {
      startExplosion();
    }
  }, [currentTest]);

  // Spin animation
  const startSpin = () => {
    setStage('spin');
    setTimeout(() => {
      setStage('gone');
      setTimeout(() => {
        setStage('spinback');
        setTimeout(() => {
          setStage('idle');
        }, 2000);
      }, 2000);
    }, 2000);
  };

  useEffect(() => {
    if (currentTest === 'spin') {
      startSpin();
    }
  }, [currentTest]);

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
    switch (currentTest) {
      case 'sleep':
        return `/images/working_employees/corneryuwon_sleep${sleepFrame}.png`;
      case 'blink':
        if (blinkFrame > 0) {
          return `/images/working_employees/corneryuwon_blink${blinkFrame}.png`;
        }
        return '/images/working_employees/corneryuwon_neutral.png';
      case 'shake-normal':
        return '/images/working_employees/corneryuwon_oh.png';
      case 'shake-angry':
        return '/images/working_employees/corneryuwon_superangry.png';
      case 'explode':
        if (stage === 'shake' || stage === 'grow1' || stage === 'grow2') {
          return '/images/working_employees/corneryuwon_superangry.png';
        }
        if (stage === 'explode') {
          return `/images/working_employees/explode.gif?t=${Date.now()}`;
        }
        return '/images/working_employees/corneryuwon_neutral.png';
      case 'spin':
        if (stage === 'gone') return '';
        return '/images/working_employees/corneryuwon_neutral.png';
      case 'float':
        return '/images/working_employees/corneryuwon_neutral.png';
      default:
        return '/images/working_employees/corneryuwon_neutral.png';
    }
  };

  const getScale = () => {
    if (currentTest === 'sleep') return 1.2;
    if (currentTest === 'explode') {
      if (stage === 'shake') return 1;
      if (stage === 'grow1') return 1.2;
      if (stage === 'grow2') return 1.4;
      if (stage === 'explode') return 3;
    }
    return 1;
  };

  const getOpacity = () => {
    if (currentTest === 'explode') {
      if (stage === 'explode') return 0.2; // Fade but keep slight visibility
    }
    return 1;
  };

  const getAnimation = () => {
    if (currentTest === 'shake-normal') return isShaking ? 'shake 0.5s' : 'none';
    if (currentTest === 'shake-angry') return isShaking ? 'shakeAngry 1s' : 'none';
    if (currentTest === 'float') return 'float 3s ease-in-out infinite';
    if (currentTest === 'explode') {
      if (isShaking) return 'shakeAngry 1s';
    }
    if (currentTest === 'spin') {
      if (stage === 'spin') return 'spin 2s forwards';
      if (stage === 'spinback') return 'spinback 2s forwards';
    }
    return 'none';
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>All Animation Tests</h1>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          @keyframes shake {
            0% { transform: translateX(0) rotate(0deg); }
            25% { transform: translateX(-5px) rotate(-3deg); }
            50% { transform: translateX(5px) rotate(3deg); }
            75% { transform: translateX(-3px) rotate(-2deg); }
            100% { transform: translateX(0) rotate(0deg); }
          }

          @keyframes shakeAngry {
            0% { transform: translate(0, 0) rotate(0deg); }
            10% { transform: translate(-8px, -5px) rotate(-8deg); }
            20% { transform: translate(10px, 5px) rotate(8deg); }
            30% { transform: translate(-10px, 8px) rotate(-8deg); }
            40% { transform: translate(8px, -8px) rotate(8deg); }
            50% { transform: translate(-6px, 6px) rotate(-6deg); }
            60% { transform: translate(7px, -7px) rotate(6deg); }
            70% { transform: translate(-5px, -4px) rotate(-4deg); }
            80% { transform: translate(4px, 5px) rotate(4deg); }
            90% { transform: translate(-2px, -2px) rotate(-2deg); }
            100% { transform: translate(0, 0) rotate(0deg); }
          }


          @keyframes spin {
            0% { transform: rotate(0deg) scale(1); opacity: 1; }
            100% { transform: rotate(720deg) scale(0); opacity: 0; }
          }

          @keyframes spinback {
            0% { transform: rotate(-720deg) scale(0); opacity: 0; }
            100% { transform: rotate(0deg) scale(1); opacity: 1; }
          }
        `}
      </style>

      <div style={{
        margin: '40px auto',
        display: 'inline-block',
        position: 'relative',
        minHeight: '200px',
        minWidth: '200px'
      }}>
        {/* Sleep Z's */}
        {currentTest === 'sleep' && (
          <>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '60px',
              fontSize: '24px',
              animation: 'sleepBubble 2s infinite',
              animationDelay: '0s'
            }}>Z</div>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '60px',
              fontSize: '24px',
              animation: 'sleepBubble 2s infinite',
              animationDelay: '0.7s'
            }}>Z</div>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '60px',
              fontSize: '24px',
              animation: 'sleepBubble 2s infinite',
              animationDelay: '1.4s'
            }}>Z</div>
          </>
        )}

        {getImageSrc() && (
          <img
            src={getImageSrc()}
            alt="Yuwon"
            style={{
              width: currentTest === 'sleep' ? '180px' : '150px',
              height: 'auto',
              imageRendering: 'pixelated',
              userSelect: 'none',
              transform: `scale(${getScale()})`,
              opacity: getOpacity(),
              animation: getAnimation(),
              transition: currentTest === 'explode' ? 'transform 0.5s ease-out, opacity 0.3s ease-out' : 'none'
            }}
          />
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        maxWidth: '600px',
        margin: '40px auto'
      }}>
        <button onClick={() => setCurrentTest('idle')} style={buttonStyle(currentTest === 'idle')}>
          Idle
        </button>
        <button onClick={() => setCurrentTest('blink')} style={buttonStyle(currentTest === 'blink')}>
          Blink (3 frames)
        </button>
        <button onClick={() => setCurrentTest('sleep')} style={buttonStyle(currentTest === 'sleep')}>
          Sleep (3 frames)
        </button>
        <button onClick={() => { setCurrentTest('shake-normal'); setIsShaking(true); setTimeout(() => setIsShaking(false), 500); }} style={buttonStyle(currentTest === 'shake-normal')}>
          Shake (Normal)
        </button>
        <button onClick={() => { setCurrentTest('shake-angry'); setIsShaking(true); setTimeout(() => setIsShaking(false), 1000); }} style={buttonStyle(currentTest === 'shake-angry')}>
          Shake (Angry)
        </button>
        <button onClick={() => setCurrentTest('float')} style={buttonStyle(currentTest === 'float')}>
          Float
        </button>
        <button onClick={() => setCurrentTest('explode')} style={buttonStyle(currentTest === 'explode')}>
          Explode Sequence
        </button>
        <button onClick={() => setCurrentTest('spin')} style={buttonStyle(currentTest === 'spin')}>
          Spin Away/Back
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold', color: '#e91e63' }}>
        Current Test: {currentTest.toUpperCase()}
        {currentTest === 'explode' && ` - Stage: ${stage}`}
        {currentTest === 'spin' && ` - Stage: ${stage}`}
        {currentTest === 'sleep' && ` - Frame: ${sleepFrame}/3`}
        {currentTest === 'blink' && ` - Frame: ${blinkFrame}/3`}
      </div>

      <div style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
        <p><strong>Sleep:</strong> Uses corneryuwon_sleep1.png, sleep2.png, sleep3.png (1→2→3, pause 4s, 3→2→1, pause 4s, repeat)</p>
        <p><strong>Blink:</strong> Uses corneryuwon_blink1.png, blink2.png, blink3.png</p>
        <p><strong>Explode:</strong> Shake all around (1s) → Grow 1.2x (0.5s) → Grow 1.4x (0.5s) → Explosion GIF 3x + fade (1s)</p>
        <p><strong>Spin:</strong> Spin away (2s) → Gone (2s) → Spin back (2s)</p>
      </div>

      <style>
        {`
          @keyframes sleepBubble {
            0% { opacity: 0; transform: translateY(0) scale(0.5); }
            50% { opacity: 1; transform: translateY(-20px) scale(1); }
            100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
          }
        `}
      </style>
    </div>
  );
}

function buttonStyle(isActive) {
  return {
    padding: '10px 15px',
    fontSize: '14px',
    background: isActive ? '#e91e63' : '#ccc',
    color: isActive ? 'white' : '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: isActive ? 'bold' : 'normal'
  };
}

export default AnimationTest;
