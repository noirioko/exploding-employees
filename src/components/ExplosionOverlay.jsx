import { useEffect, useState } from 'react';

function ExplosionOverlay({ onComplete, position }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in
    requestAnimationFrame(() => {
      setVisible(true);
    });

    // Create confetti from Yuwon's position
    if (position) {
      createConfetti(position.x, position.y);
    }

    // Hide overlay after 2 seconds
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const createConfetti = (centerX, centerY) => {
    const colors = ['#ff0000', '#ff4444', '#ff6666', '#cc0000', '#ff8888'];
    const confettiCount = 40;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.borderRadius = i % 5 === 0 ? '50%' : '2px';
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

  return (
    <>
      <style>
        {`
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
        `}
      </style>
      {/* Fullscreen transparent overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10000,
        pointerEvents: 'none',
        background: 'transparent',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.1s ease-in'
      }}>
        {/* Explosion GIF positioned at Yuwon's location */}
        {position && (
          <img
            src={`/images/working_employees/explode.gif?t=${Date.now()}`}
            alt="Explosion"
            style={{
              position: 'fixed',
              left: `${position.x}px`,
              top: `${position.y - 100}px`,
              transform: 'translate(-50%, -50%)',
              width: '308px',
              height: '308px',
              imageRendering: 'pixelated',
              zIndex: 10001
            }}
          />
        )}
      </div>
    </>
  );
}

export default ExplosionOverlay;
