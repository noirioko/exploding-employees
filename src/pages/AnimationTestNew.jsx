import { useState, useEffect, useRef } from 'react';

function AnimationTestNew() {
  const [currentTest, setCurrentTest] = useState('idle');
  const [sleepFrame, setSleepFrame] = useState(1);
  const [blinkFrame, setBlinkFrame] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [stage, setStage] = useState('idle');

  const sleepAnimationTimerRef = useRef(null);
  const blinkTimerRef = useRef(null);

  // Sleep animation (123321, pause 2-3s, repeat)
  useEffect(() => {
    if (currentTest !== 'sleep') return;

    const animateSleep = async () => {
      // 1 → 2 → 3 → 2 → 1 (no pause in between)
      setSleepFrame(1);
      await new Promise(resolve => setTimeout(resolve, 300));
      setSleepFrame(2);
      await new Promise(resolve => setTimeout(resolve, 300));
      setSleepFrame(3);
      await new Promise(resolve => setTimeout(resolve, 300));
      setSleepFrame(2);
      await new Promise(resolve => setTimeout(resolve, 300));
      setSleepFrame(1);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Pause 2-3 seconds
      const pauseDuration = 2000 + Math.random() * 1000; // 2-3 seconds
      await new Promise(resolve => setTimeout(resolve, pauseDuration));

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

  // Explosion sequence - based on explode-sample.html
  const startExplosion = async () => {
    setStage('idle');
    setIsShaking(false);

    await new Promise(resolve => setTimeout(resolve, 100));

    // Enlarge and tremble simultaneously (1.5 seconds)
    setStage('enlargeAndTremble');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // EXPLOSION - create confetti, show gif, hide Yuwon
    setStage('explode');
    playSound('roblox-explosion-sounds');
    createConfetti();

    await new Promise(resolve => setTimeout(resolve, 2000));

    setStage('idle');
  };

  const createConfetti = () => {
    const colors = ['#ff0000', '#ff4444', '#ff6666', '#cc0000', '#ff8888'];
    const confettiCount = 40;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.borderRadius = i % 5 === 0 ? '50%' : '2px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = centerX + 'px';
      confetti.style.top = centerY + 'px';
      confetti.style.zIndex = '999';
      confetti.style.pointerEvents = 'none';

      const angle = (Math.PI * 2 * i) / confettiCount + (Math.random() - 0.5) * 0.5;
      const distance = 150 + Math.random() * 200;
      const deltaX = Math.cos(angle) * distance;
      const deltaY = Math.sin(angle) * distance;

      confetti.style.animation = 'confetti-explode 2s ease-out forwards';
      confetti.style.setProperty('--confetti-x', `${deltaX}px`);
      confetti.style.setProperty('--confetti-y', `${deltaY}px`);
      confetti.style.animationDelay = Math.random() * 0.3 + 's';

      document.body.appendChild(confetti);

      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.remove();
        }
      }, 3000);
    }
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
        if (stage === 'enlargeAndTremble') {
          return '/images/working_employees/corneryuwon_verysad.png';
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
    if (currentTest === 'explode' && stage === 'explode') {
      return 3;
    }
    return 1;
  };

  const getOpacity = () => {
    if (currentTest === 'explode' && stage === 'explode') {
      return 0;
    }
    return 1;
  };

  const getAnimation = () => {
    if (currentTest === 'shake-normal') return isShaking ? 'shake 0.5s' : 'none';
    if (currentTest === 'shake-angry') return isShaking ? 'shakeAngry 1s' : 'none';
    if (currentTest === 'float') return 'float 3s ease-in-out infinite';
    if (currentTest === 'explode') {
      if (stage === 'enlargeAndTremble') return 'enlargeAndTremble 1.5s ease-in-out forwards';
    }
    if (currentTest === 'spin') {
      if (stage === 'spin') return 'spin 2s forwards';
      if (stage === 'spinback') return 'spinback 2s forwards';
    }
    return 'none';
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>All Animation Tests - FIXED VERSION</h1>

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

          @keyframes enlargeAndTremble {
            0% { transform: scale(1); }
            60% { transform: scale(1.3) rotate(-2deg); }
            70% { transform: scale(1.35) rotate(2deg); }
            80% { transform: scale(1.4) rotate(-3deg); }
            90% { transform: scale(1.45) rotate(3deg); }
            100% { transform: scale(1.5) rotate(0deg); }
          }

          @keyframes confetti-explode {
            0% {
              transform: translate(0, 0) rotate(0deg) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(var(--confetti-x), var(--confetti-y)) rotate(720deg) scale(0.5);
              opacity: 0;
            }
          }

          @keyframes spin {
            0% { transform: rotate(0deg) scale(1); opacity: 1; }
            100% { transform: rotate(720deg) scale(0); opacity: 0; }
          }

          @keyframes spinback {
            0% { transform: rotate(-720deg) scale(0); opacity: 0; }
            100% { transform: rotate(0deg) scale(1); opacity: 1; }
          }

          @keyframes sleepBubble {
            0% { opacity: 0; transform: translateY(0) scale(0.5); }
            50% { opacity: 1; transform: translateY(-20px) scale(1); }
            100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
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
              animation: getAnimation()
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
        <p><strong>Sleep:</strong> Uses corneryuwon_sleep1.png, sleep2.png, sleep3.png (1→2→3→2→1, pause 2-3s, repeat)</p>
        <p><strong>Blink:</strong> Uses corneryuwon_blink1.png, blink2.png, blink3.png</p>
        <p><strong>Explode:</strong> Enlarge & Tremble (1.5s) → Explosion GIF + Confetti (2s)</p>
        <p><strong>Spin:</strong> Spin away (2s) → Gone (2s) → Spin back (2s)</p>
      </div>
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

export default AnimationTestNew;
