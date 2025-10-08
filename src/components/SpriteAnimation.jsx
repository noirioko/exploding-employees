import { useState, useEffect, useRef } from 'react';

function SpriteAnimation({
  spriteSheet,
  rows = 1,
  columns = 1,
  frameDelay = 100,
  selectedFrames = [0],
  scale = 1,
  style = {}
}) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const canvasRef = useRef(null);
  const [spriteImage, setSpriteImage] = useState(null);

  // Load sprite sheet image
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setSpriteImage(img);
      setCurrentFrame(0); // Reset animation when sprite sheet changes
    };
    img.src = spriteSheet;
  }, [spriteSheet]);

  // Animation loop
  useEffect(() => {
    if (selectedFrames.length === 0) return;

    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % selectedFrames.length);
    }, frameDelay);

    return () => clearInterval(interval);
  }, [selectedFrames, frameDelay]);

  // Draw current frame
  useEffect(() => {
    if (!spriteImage || !canvasRef.current || selectedFrames.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const frameWidth = Math.floor(spriteImage.width / columns);
    const frameHeight = Math.floor(spriteImage.height / rows);

    canvas.width = frameWidth;
    canvas.height = frameHeight;

    const frameIndex = selectedFrames[currentFrame];
    const row = Math.floor(frameIndex / columns);
    const col = frameIndex % columns;

    ctx.clearRect(0, 0, frameWidth, frameHeight);
    ctx.drawImage(
      spriteImage,
      col * frameWidth,
      row * frameHeight,
      frameWidth,
      frameHeight,
      0,
      0,
      frameWidth,
      frameHeight
    );
  }, [spriteImage, currentFrame, selectedFrames, rows, columns]);

  if (!spriteImage) return null;

  const frameWidth = Math.floor(spriteImage.width / columns);
  const frameHeight = Math.floor(spriteImage.height / rows);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${frameWidth * scale}px`,
        height: `${frameHeight * scale}px`,
        imageRendering: 'pixelated',
        ...style
      }}
    />
  );
}

export default SpriteAnimation;
