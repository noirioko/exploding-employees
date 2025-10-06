import { useState, useEffect, useRef } from 'react';

function FloatingEmployee({ character = 'yuwon' }) {
  const [currentExpression, setCurrentExpression] = useState('neutral');
  const [isBlinking, setIsBlinking] = useState(false);
  const [blinkFrame, setBlinkFrame] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);
  const [dialogue, setDialogue] = useState('');
  const [dialogueTimeout, setDialogueTimeout] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const [isSleeping, setIsSleeping] = useState(false);
  const [sleepFrame, setSleepFrame] = useState(1);
  const [mentalHealth, setMentalHealth] = useState(100);

  // Explosion states
  const [isExploding, setIsExploding] = useState(false);
  const [explosionStage, setExplosionStage] = useState('idle'); // idle, enlargeAndTremble, explode
  const [showExplosionGif, setShowExplosionGif] = useState(false);
  const [explosionGifPosition, setExplosionGifPosition] = useState(null);
  const [showDeathScreen, setShowDeathScreen] = useState(false);
  const [deathTimer, setDeathTimer] = useState(10);
  const [yuwonHidden, setYuwonHidden] = useState(false);
  const [justAppeared, setJustAppeared] = useState(true);

  // Entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setJustAppeared(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const blinkTimerRef = useRef(null);
  const encouragementTimerRef = useRef(null);
  const clickResetTimerRef = useRef(null);
  const sleepTimerRef = useRef(null);
  const sleepAnimationRef = useRef(null);
  const yuwonRef = useRef(null);
  const reviveTimerRef = useRef(null);
  const preloadedVerySadRef = useRef(null);

  // Preload verysad/sad sprite based on character
  useEffect(() => {
    const img = new Image();
    if (character === 'minkyu') {
      img.src = '/images/working_employees/cornerminkyu_sad.png';
    } else {
      img.src = '/images/working_employees/corneryuwon_verysad.png';
    }
    preloadedVerySadRef.current = img;
  }, [character]);

  const encouragementMessages = [
    "You're doing great! Keep it up! 💪",
    "Remember to take breaks! 🌸",
    "Stay hydrated! 💧",
    "You've got this! ✨",
    "Almost there! Don't give up! 🔥",
    "Take a deep breath~ 🌿",
    "You're amazing! Keep going! ⭐",
    "Stretch a little! Your body will thank you! 🤸",
    "One step at a time! 🚶",
    "Believe in yourself! 💖"
  ];

  const clickSequenceMessages = [
    { text: "Hey there! Need some help with your tasks?", expression: 'oh' },
    { text: "Oh, just checking in on me?", expression: 'smile' },
    { text: "Are you procrastinating by clicking me instead of working?", expression: 'smirking' },
    { text: "*sighs* Okay, that's enough attention for now.", expression: 'neutral' },
    { text: "Seriously, you should be working right now...", expression: 'sad' },
    { text: "I'm getting a bit worried about your productivity...", expression: 'fearful' },
    { text: "I'm starting to get really annoyed now!", expression: 'angry' },
    { text: "This is NOT funny anymore! Stop clicking me!", expression: 'angry' },
    { text: "Why do you keep clicking me?? I'm trying to HELP you!", expression: 'superangry' },
    { text: "I'm about to lose my patience with all this clicking!", expression: 'superangry' },
    { text: "ONE MORE CLICK and I swear I'm leaving!!", expression: 'superangry' },
    { text: "You're REALLY pushing my buttons now! Literally!", expression: 'superangry' },
    { text: "FINE! I'll just ignore you if you keep clicking!", expression: 'superangry' },
    { text: "I WARNED YOU! That's it, I'm GONE!", expression: 'superangry' }
  ];

  const employeeComplaints = [
    { text: "Ugh, I have SO much paperwork to do...", expression: 'verysad' },
    { text: "My manager keeps adding more tasks to my list!", expression: 'angry' },
    { text: "I haven't had a break in hours...", expression: 'verysad' },
    { text: "Why is there ALWAYS another meeting?", expression: 'angry' },
    { text: "I'm drowning in emails...", expression: 'fearful' },
    { text: "This deadline is impossible to meet!", expression: 'fearful' },
    { text: "I need a vacation so badly...", expression: 'verysad' },
    { text: "Coffee isn't helping anymore...", expression: 'sad' },
    { text: "I can't believe I'm working overtime again...", expression: 'sad' },
    { text: "My to-do list just keeps growing!", expression: 'angry' }
  ];

  // Random blink system
  useEffect(() => {
    const scheduleNextBlink = () => {
      const delay = Math.random() * 4000 + 2000;
      blinkTimerRef.current = setTimeout(() => {
        performBlink();
      }, delay);
    };

    const performBlink = async () => {
      setIsBlinking(true);
      const doubleBlink = Math.random() < 0.3;

      for (let i = 1; i <= 3; i++) {
        setBlinkFrame(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      for (let i = 2; i >= 0; i--) {
        setBlinkFrame(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      if (doubleBlink) {
        await new Promise(resolve => setTimeout(resolve, 100));
        for (let i = 1; i <= 3; i++) {
          setBlinkFrame(i);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        for (let i = 2; i >= 0; i--) {
          setBlinkFrame(i);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      setIsBlinking(false);
      setBlinkFrame(0);
      scheduleNextBlink();
    };

    scheduleNextBlink();
    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, []);

  // Periodic messages (disabled - only show on click)
  // useEffect(() => {
  //   if (yuwonHidden) return;

  //   encouragementTimerRef.current = setInterval(() => {
  //     if (isSleeping || yuwonHidden) return;

  //     const isComplaint = Math.random() < 0.5;
  //     let messageObj;

  //     if (isComplaint) {
  //       messageObj = employeeComplaints[Math.floor(Math.random() * employeeComplaints.length)];
  //     } else {
  //       const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
  //       messageObj = { text: randomMessage, expression: 'happy' };
  //     }

  //     showDialogueMessage(messageObj.text, messageObj.expression, 4000);
  //     playSound(messageObj.expression);
  //   }, 10000);

  //   return () => {
  //     if (encouragementTimerRef.current) clearInterval(encouragementTimerRef.current);
  //   };
  // }, [isSleeping, yuwonHidden]);

  const showDialogueMessage = (message, expression = 'smile', duration = 4000) => {
    setDialogue(message);
    setCurrentExpression(expression);
    setShowDialogue(true);

    if (dialogueTimeout) clearTimeout(dialogueTimeout);

    const timeout = setTimeout(() => {
      setShowDialogue(false);
      setCurrentExpression('neutral');
    }, duration);

    setDialogueTimeout(timeout);
  };

  const handleClick = () => {
    if (isSleeping || isExploding) return;

    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);

    const isAngry = newClickCount >= 7;
    setIsShaking(isAngry ? 'angry' : 'normal');
    setTimeout(() => setIsShaking(false), 500);

    setMentalHealth(prev => Math.max(0, prev - 5));

    if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);
    clickResetTimerRef.current = setTimeout(() => setClickCount(0), 30000);

    let messageObj;
    if (newClickCount <= clickSequenceMessages.length) {
      messageObj = clickSequenceMessages[newClickCount - 1];
    } else {
      triggerExplosion();
      return;
    }

    if (newClickCount === clickSequenceMessages.length) {
      showDialogueMessage(messageObj.text, messageObj.expression, 3000);
      playSound(messageObj.expression);
    } else {
      showDialogueMessage(messageObj.text, messageObj.expression, 3000);
      playSound(messageObj.expression);
    }
  };

  const triggerSleep = () => {
    setIsSleeping(true);
    setSleepFrame(1);
    setDialogue("Zzz... *sleeping* ...");
    setShowDialogue(true);
    playSound('sleep');

    const animateSleep = async () => {
      while (sleepAnimationRef.current) {
        setSleepFrame(1);
        await new Promise(resolve => setTimeout(resolve, 300));
        if (!sleepAnimationRef.current) break;
        setSleepFrame(2);
        await new Promise(resolve => setTimeout(resolve, 300));
        if (!sleepAnimationRef.current) break;
        setSleepFrame(3);
        await new Promise(resolve => setTimeout(resolve, 300));
        if (!sleepAnimationRef.current) break;
        setSleepFrame(2);
        await new Promise(resolve => setTimeout(resolve, 300));
        if (!sleepAnimationRef.current) break;
        setSleepFrame(1);
        await new Promise(resolve => setTimeout(resolve, 300));

        const pauseDuration = 2000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, pauseDuration));

        if (sleepAnimationRef.current) {
          playSound('sleepy');
        }
      }
    };

    sleepAnimationRef.current = true;
    animateSleep();

    sleepTimerRef.current = setTimeout(() => wakeUp(), 300000);
  };

  const wakeUp = () => {
    sleepAnimationRef.current = false;
    setIsSleeping(false);
    setShowDialogue(false);
    setSleepFrame(1);
    setClickCount(0);
    setMentalHealth(prev => Math.min(100, prev + 20));
  };

  const explodeSprite = (imageElement, centerX, centerY) => {
    const rect = imageElement.getBoundingClientRect();
    const pieceSize = 20;
    const cols = Math.ceil(rect.width / pieceSize);
    const rows = Math.ceil(rect.height / pieceSize);

    console.log(`Exploding sprite into ${cols * rows} pieces`);

    const canvas = document.createElement('canvas');
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0, rect.width, rect.height);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const piece = document.createElement('div');
        piece.style.position = 'fixed';
        piece.style.pointerEvents = 'none';
        piece.style.zIndex = '10001';

        const x = col * pieceSize;
        const y = row * pieceSize;

        const pieceCanvas = document.createElement('canvas');
        pieceCanvas.width = pieceSize;
        pieceCanvas.height = pieceSize;
        const pieceCtx = pieceCanvas.getContext('2d');
        pieceCtx.drawImage(canvas, x, y, pieceSize, pieceSize, 0, 0, pieceSize, pieceSize);

        piece.style.width = pieceSize + 'px';
        piece.style.height = pieceSize + 'px';
        piece.style.left = (rect.left + x) + 'px';
        piece.style.top = (rect.top + y) + 'px';
        piece.style.backgroundImage = `url(${pieceCanvas.toDataURL()})`;
        piece.style.backgroundSize = 'cover';

        const pieceCenterX = rect.left + x + pieceSize / 2;
        const pieceCenterY = rect.top + y + pieceSize / 2;
        const angle = Math.atan2(pieceCenterY - centerY, pieceCenterX - centerX);
        const distance = 150 + Math.random() * 150;
        const deltaX = Math.cos(angle) * distance;
        const deltaY = Math.sin(angle) * distance;
        const rotation = (Math.random() - 0.5) * 720;

        piece.style.setProperty('--piece-direction', `translate(${deltaX}px, ${deltaY}px)`);
        piece.style.setProperty('--piece-rotation', `${rotation}deg`);
        piece.style.animation = 'sprite-explode 0.8s ease-out forwards';
        piece.style.animationDelay = Math.random() * 0.05 + 's';

        document.body.appendChild(piece);

        setTimeout(() => {
          if (piece.parentNode) {
            piece.remove();
          }
        }, 1000);
      }
    }
  };

  const createConfetti = (centerX, centerY) => {
    const colors = ['#ff0000', '#ff4444', '#ff6666', '#cc0000', '#ff8888'];
    const confettiCount = 40;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '8px';
      confetti.style.height = '8px';
      confetti.style.borderRadius = '2px';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.left = centerX + 'px';
      confetti.style.top = centerY + 'px';
      confetti.style.zIndex = '10001';
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

  const triggerExplosion = async () => {
    if (isExploding) return;
    setIsExploding(true);
    setShowDialogue(false);

    console.log('Step 1: Starting explosion sequence');
    setCurrentExpression('superangry');

    // Add class to trigger animation
    if (yuwonRef.current) {
      yuwonRef.current.classList.add('enlarge-and-tremble');
    }

    await new Promise(resolve => setTimeout(resolve, 850));
    console.log('Step 1c: Changing to crying sprite + slight shrink (dramatic pause!)');
    if (yuwonRef.current && preloadedVerySadRef.current) {
      // Remove enlarge animation and add crying shrink
      yuwonRef.current.classList.remove('enlarge-and-tremble');
      yuwonRef.current.src = preloadedVerySadRef.current.src;
      yuwonRef.current.classList.add('crying-shrink');
    }

    await new Promise(resolve => setTimeout(resolve, 50));
    console.log('Step 1b: Playing sound RIGHT before explosion');
    playSound('roblox-explosion-sound');

    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('Step 2: Capturing position (WHILE STILL ENLARGING)');
    let centerX, centerY, imageRef;
    if (yuwonRef.current) {
      const rect = yuwonRef.current.getBoundingClientRect();
      centerX = rect.left + rect.width / 2;
      centerY = rect.top + rect.height / 2;
      imageRef = yuwonRef.current; // Save reference before hiding
      console.log(`Position: ${centerX}, ${centerY}`);

      setExplosionGifPosition({ x: centerX, y: centerY - 100 });
    }

    console.log('Step 3: BOOM - EVERYTHING HAPPENS NOW (animation still going)');
    setYuwonHidden(true);
    setShowExplosionGif(true);

    // Explode sprite into pieces (use saved ref)
    if (imageRef) {
      explodeSprite(imageRef, centerX, centerY);
    }

    createConfetti(centerX, centerY);

    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('Step 7: Remove GIF');
    setShowExplosionGif(false);

    await new Promise(resolve => setTimeout(resolve, 150));
    console.log('Step 6: Show death screen');
    setShowDeathScreen(true);
    startDeathTimer();
    setExplosionStage('idle');

    // Clean up class
    if (yuwonRef.current) {
      yuwonRef.current.classList.remove('enlarge-and-tremble');
    }
  };

  const startDeathTimer = () => {
    setDeathTimer(10);
    reviveTimerRef.current = setInterval(() => {
      setDeathTimer(prev => {
        if (prev <= 1) {
          clearInterval(reviveTimerRef.current);
          bringBackYuwon();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const bringBackYuwon = () => {
    setShowDeathScreen(false);
    setDeathTimer(10);
    setYuwonHidden(false);
    setIsExploding(false);
    setExplosionStage('spin-in');

    setTimeout(() => {
      setExplosionStage('idle');
      setClickCount(0);
      setMentalHealth(prev => Math.min(100, prev + 10));
      showDialogueMessage("Don't you DARE do that again!", 'superangry', 4000);
      playSound('superangry');
    }, 800);
  };

  const playSound = (emotion) => {
    try {
      const soundPath = `/sounds/${emotion}.mp3`;
      const audio = new Audio(soundPath);
      audio.volume = 0.5;
      audio.play().catch(err => console.log('Sound failed:', err));
    } catch (err) {
      console.log('Sound loading failed:', err);
    }
  };

  const getImageSrc = () => {
    const prefix = character === 'minkyu' ? 'cornerminkyu' : 'corneryuwon';

    // Minkyu doesn't have sleep/blink yet, fallback to neutral
    if (character === 'minkyu') {
      // Available: happy, neutral, oh, sad, smile
      // Fallback mapping for expressions Minkyu doesn't have yet
      const minkyuExpressions = {
        'angry': 'sad',
        'superangry': 'sad',
        'verysad': 'sad',
        'fearful': 'sad',
        'excited': 'happy',
        'smirking': 'smile'
      };

      const expression = minkyuExpressions[currentExpression] || currentExpression;
      return `/images/working_employees/${prefix}_${expression}.png`;
    }

    // Yuwon has full expression set
    if (isSleeping) {
      return `/images/working_employees/corneryuwon_sleep${sleepFrame}.png`;
    }
    if (isBlinking && blinkFrame > 0 && currentExpression === 'neutral') {
      return `/images/working_employees/corneryuwon_blink${blinkFrame}.png`;
    }
    return `/images/working_employees/corneryuwon_${currentExpression}.png`;
  };

  useEffect(() => {
    return () => {
      if (clickResetTimerRef.current) clearTimeout(clickResetTimerRef.current);
      if (sleepTimerRef.current) clearTimeout(sleepTimerRef.current);
      if (reviveTimerRef.current) clearInterval(reviveTimerRef.current);
      sleepAnimationRef.current = false;
    };
  }, []);

  return (
    <div style={{ position: 'fixed', bottom: '90px', right: '20px', zIndex: 9999 }}>
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

          @keyframes dialogueFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .enlarge-and-tremble {
            animation: enlargeAndTremble 1s ease-in-out forwards !important;
          }

          .yuwon-container {
            transition: opacity 0.05s ease-out;
          }

          .yuwon-container.fade-out-fast {
            opacity: 0;
          }

          .yuwon-container.hidden {
            display: none;
          }

          @keyframes enlargeAndTremble {
            0% { transform: scale(1) translate(0, 0); }
            2% { transform: scale(1.02) translate(2px, -3px); }
            4% { transform: scale(1.04) translate(-3px, 1px); }
            6% { transform: scale(1.06) translate(1px, 3px); }
            8% { transform: scale(1.08) translate(3px, -1px); }
            10% { transform: scale(1.1) translate(-2px, -2px); }
            12% { transform: scale(1.12) translate(3px, 2px); }
            14% { transform: scale(1.14) translate(-1px, -3px); }
            16% { transform: scale(1.16) translate(-3px, 3px); }
            18% { transform: scale(1.18) translate(2px, 1px); }
            20% { transform: scale(1.2) translate(-2px, 3px); }
            22% { transform: scale(1.2) translate(3px, -2px); }
            24% { transform: scale(1.2) translate(1px, -1px); }
            26% { transform: scale(1.2) translate(-3px, -2px); }
            28% { transform: scale(1.2) translate(2px, 3px); }
            30% { transform: scale(1.2) translate(3px, 1px); }
            32% { transform: scale(1.18) translate(-1px, 2px); }
            34% { transform: scale(1.16) translate(-3px, -1px); }
            36% { transform: scale(1.14) translate(1px, -3px); }
            38% { transform: scale(1.12) translate(3px, 3px); }
            40% { transform: scale(1.1) translate(-2px, 1px); }
            42% { transform: scale(1.15) translate(2px, -2px); }
            44% { transform: scale(1.2) translate(-3px, 2px); }
            46% { transform: scale(1.25) translate(3px, -3px); }
            48% { transform: scale(1.3) translate(-1px, 1px); }
            50% { transform: scale(1.35) translate(2px, 2px); }
            52% { transform: scale(1.36) translate(-3px, -3px); }
            54% { transform: scale(1.37) translate(3px, -1px); }
            56% { transform: scale(1.38) translate(1px, 3px); }
            58% { transform: scale(1.39) translate(-2px, -1px); }
            60% { transform: scale(1.4) translate(3px, 2px); }
            62% { transform: scale(1.41) translate(-1px, -2px); }
            64% { transform: scale(1.42) translate(-3px, 1px); }
            66% { transform: scale(1.43) translate(2px, -3px); }
            68% { transform: scale(1.44) translate(1px, 2px); }
            70% { transform: scale(1.45) translate(-2px, 3px); }
            72% { transform: scale(1.46) translate(4px, -4px); }
            74% { transform: scale(1.47) translate(-4px, -2px); }
            76% { transform: scale(1.48) translate(3px, 4px); }
            78% { transform: scale(1.49) translate(-3px, -4px); }
            80% { transform: scale(1.5) translate(4px, 3px); }
            82% { transform: scale(1.51) translate(-4px, -3px); }
            84% { transform: scale(1.52) translate(2px, -4px); }
            86% { transform: scale(1.53) translate(-2px, 4px); }
            88% { transform: scale(1.54) translate(4px, -2px); }
            90% { transform: scale(1.55) translate(-4px, 2px); }
            92% { transform: scale(1.56) translate(3px, 4px); }
            94% { transform: scale(1.57) translate(-3px, -4px); }
            96% { transform: scale(1.58) translate(4px, 3px); }
            98% { transform: scale(1.59) translate(-4px, -3px); }
            100% { transform: scale(1.6) translate(0, 0); }
          }

          @keyframes sleepBubble {
            0% { opacity: 0; transform: translateY(0) scale(0.5); }
            50% { opacity: 1; transform: translateY(-20px) scale(1); }
            100% { opacity: 0; transform: translateY(-40px) scale(1.2); }
          }

          @keyframes sprite-explode {
            0% {
              opacity: 1;
              transform: translate(0, 0) rotate(0deg);
            }
            100% {
              opacity: 0;
              transform: var(--piece-direction) rotate(var(--piece-rotation));
            }
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

          @keyframes death-fade-in {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }

          @keyframes spin-in-grow {
            0% { transform: rotate(-1440deg) scale(0); opacity: 0; }
            70% { transform: rotate(0deg) scale(1.3); opacity: 1; }
            85% { transform: rotate(0deg) scale(1.35); opacity: 1; }
            100% { transform: rotate(0deg) scale(1); opacity: 1; }
          }

          @keyframes crying-shrink {
            0% {
              transform: scale(1.6);
            }
            100% {
              transform: scale(1.5);
            }
          }

          .crying-shrink {
            animation: crying-shrink 0.15s ease-out forwards !important;
          }

          @keyframes pop-in {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              transform: scale(1.15);
              opacity: 1;
            }
            70% {
              transform: scale(0.95);
            }
            85% {
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .pop-in {
            animation: pop-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          }
        `}
      </style>

      {/* Test buttons */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        zIndex: 10002
      }}>
        <button onClick={triggerSleep} style={{ padding: '5px 10px', fontSize: '10px', background: '#9c27b0', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Test Sleep</button>
        <button onClick={triggerExplosion} style={{ padding: '5px 10px', fontSize: '10px', background: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Test Explode</button>
        <button onClick={wakeUp} style={{ padding: '5px 10px', fontSize: '10px', background: '#4caf50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Wake Up</button>
      </div>

      {/* Floating container for Yuwon + Dialogue + Sleep Z's */}
      {!yuwonHidden && (
        <div
          className={justAppeared ? 'pop-in' : ''}
          style={{
            position: 'relative',
            animation:
              justAppeared ? 'pop-in 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards' :
              explosionStage === 'spin-in' || isShaking ? 'none' :
              'float 3s ease-in-out infinite'
          }}>
          {/* Dialogue bubble */}
          {showDialogue && (
            <div style={{
              position: 'absolute',
              bottom: '120%',
              right: '0',
              background: 'rgba(255, 255, 255, 0.92)',
              border: '3px solid #FFB3D9',
              borderRadius: '16px',
              padding: '12px 16px',
              maxWidth: '220px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              animation: 'dialogueFadeIn 0.3s ease-out',
              whiteSpace: 'pre-wrap',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              pointerEvents: 'none'
            }}>
              {dialogue}
              <div style={{ position: 'absolute', bottom: '-12px', right: '30px', width: '0', height: '0', borderLeft: '12px solid transparent', borderRight: '12px solid transparent', borderTop: '12px solid #FFB3D9' }} />
              <div style={{ position: 'absolute', bottom: '-8px', right: '32px', width: '0', height: '0', borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '10px solid rgba(255, 255, 255, 0.92)' }} />
            </div>
          )}

          {/* Sleep Z's */}
          {isSleeping && (
            <>
              <div style={{ position: 'absolute', top: '-20px', right: '60px', fontSize: '24px', animation: 'sleepBubble 2s infinite', animationDelay: '0s' }}>Z</div>
              <div style={{ position: 'absolute', top: '-20px', right: '60px', fontSize: '24px', animation: 'sleepBubble 2s infinite', animationDelay: '0.7s' }}>Z</div>
              <div style={{ position: 'absolute', top: '-20px', right: '60px', fontSize: '24px', animation: 'sleepBubble 2s infinite', animationDelay: '1.4s' }}>Z</div>
            </>
          )}

          {/* Character sprite */}
          <img
            ref={yuwonRef}
            src={getImageSrc()}
            alt={character}
            onClick={handleClick}
            style={{
              width: isSleeping ? '232px' : '116px',
              height: 'auto',
              cursor: isSleeping ? 'not-allowed' : 'pointer',
              animation:
                explosionStage === 'spin-in' ? 'spin-in-grow 0.8s ease-out forwards' :
                isShaking === 'angry' ? 'shakeAngry 1s' :
                isShaking === 'normal' ? 'shake 0.5s' :
                'none',
              imageRendering: 'pixelated',
              userSelect: 'none'
            }}
          />
        </div>
      )}

      {/* Explosion GIF */}
      {showExplosionGif && explosionGifPosition && (
        <img
          src={`/images/working_employees/explode.gif?t=${Date.now()}`}
          alt="Explosion"
          style={{
            position: 'fixed',
            left: `${explosionGifPosition.x}px`,
            top: `${explosionGifPosition.y}px`,
            transform: 'translate(-50%, -50%)',
            width: '308px',
            height: '308px',
            imageRendering: 'pixelated',
            zIndex: 10001,
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Death Screen */}
      {showDeathScreen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          zIndex: 10003,
          pointerEvents: 'none',
          opacity: 0,
          animation: 'death-fade-in 2.5s ease-out forwards'
        }}>
          <div style={{
            position: 'relative',
            background: 'rgba(20, 0, 0, 0.95)',
            padding: '20px 50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskComposite: 'source-in',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%), linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            maskComposite: 'intersect'
          }}>
            <div style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#8B0000',
              textShadow: '3px 3px 6px rgba(0, 0, 0, 0.9)',
              letterSpacing: '4px',
              textTransform: 'uppercase'
            }}>HE DIED</div>
            <div style={{
              fontFamily: '"Times New Roman", serif',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#CC0000',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)',
              letterSpacing: '1px'
            }}>Revive in {deathTimer}s</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FloatingEmployee;
