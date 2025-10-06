import { useState, useRef, useEffect } from 'react';

function SpriteSheetViewer() {
  const [spriteSheet, setSpriteSheet] = useState(null);
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);
  const [frameDelay, setFrameDelay] = useState(100);
  const [selectedFrames, setSelectedFrames] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const canvasRef = useRef(null);
  const animationCanvasRef = useRef(null);
  const animationIntervalRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setSpriteSheet(img);
          setSelectedFrames([]);
          setIsPlaying(false);
          setCurrentFrame(0);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawGridPreview = () => {
    if (!spriteSheet || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = spriteSheet.width;
    canvas.height = spriteSheet.height;

    // Draw sprite sheet
    ctx.drawImage(spriteSheet, 0, 0);

    // Draw grid
    if (showGrid) {
      const frameWidth = spriteSheet.width / columns;
      const frameHeight = spriteSheet.height / rows;

      ctx.strokeStyle = '#e91e63';
      ctx.lineWidth = 2;

      // Vertical lines
      for (let i = 0; i <= columns; i++) {
        ctx.beginPath();
        ctx.moveTo(i * frameWidth, 0);
        ctx.lineTo(i * frameWidth, spriteSheet.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * frameHeight);
        ctx.lineTo(spriteSheet.width, i * frameHeight);
        ctx.stroke();
      }

      // Highlight selected frames
      selectedFrames.forEach(frameIndex => {
        const row = Math.floor(frameIndex / columns);
        const col = frameIndex % columns;
        ctx.fillStyle = 'rgba(233, 30, 99, 0.3)';
        ctx.fillRect(col * frameWidth, row * frameHeight, frameWidth, frameHeight);
      });
    }
  };

  useEffect(() => {
    drawGridPreview();
  }, [spriteSheet, rows, columns, showGrid, selectedFrames]);

  const handleCanvasClick = (e) => {
    if (!spriteSheet) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const frameWidth = spriteSheet.width / columns;
    const frameHeight = spriteSheet.height / rows;

    const col = Math.floor(x / frameWidth);
    const row = Math.floor(y / frameHeight);
    const frameIndex = row * columns + col;

    if (selectedFrames.includes(frameIndex)) {
      setSelectedFrames(selectedFrames.filter(f => f !== frameIndex));
    } else {
      setSelectedFrames([...selectedFrames, frameIndex].sort((a, b) => a - b));
    }
  };

  // Animation loop
  useEffect(() => {
    if (isPlaying && selectedFrames.length > 0) {
      animationIntervalRef.current = setInterval(() => {
        setCurrentFrame(prev => (prev + 1) % selectedFrames.length);
      }, frameDelay);

      return () => {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
        }
      };
    }
  }, [isPlaying, selectedFrames, frameDelay]);

  // Draw current animation frame
  useEffect(() => {
    if (!spriteSheet || !animationCanvasRef.current || selectedFrames.length === 0) return;

    const canvas = animationCanvasRef.current;
    const ctx = canvas.getContext('2d');

    const frameWidth = Math.floor(spriteSheet.width / columns);
    const frameHeight = Math.floor(spriteSheet.height / rows);

    canvas.width = frameWidth;
    canvas.height = frameHeight;

    const frameIndex = selectedFrames[currentFrame];
    const row = Math.floor(frameIndex / columns);
    const col = frameIndex % columns;

    ctx.clearRect(0, 0, frameWidth, frameHeight);
    ctx.drawImage(
      spriteSheet,
      col * frameWidth,
      row * frameHeight,
      frameWidth,
      frameHeight,
      0,
      0,
      frameWidth,
      frameHeight
    );
  }, [spriteSheet, currentFrame, selectedFrames, rows, columns]);

  return (
    <div>
      <div className="current-date">
        🎨 Sprite Sheet Viewer
      </div>

      <div className="content">
        <div style={{ background: 'white', borderRadius: '12px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '20px' }}>
          <h2 style={{ color: '#e91e63', marginTop: 0 }}>Upload Sprite Sheet</h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{
              marginBottom: '20px',
              padding: '10px',
              border: '2px solid #e91e63',
              borderRadius: '8px',
              width: '100%'
            }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#666' }}>
                Rows: {rows}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#666' }}>
                Columns: {columns}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={columns}
                onChange={(e) => setColumns(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#666' }}>
                Frame Delay (ms): {frameDelay}
              </label>
              <input
                type="range"
                min="30"
                max="500"
                step="10"
                value={frameDelay}
                onChange={(e) => setFrameDelay(parseInt(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                id="showGrid"
              />
              <label htmlFor="showGrid" style={{ fontWeight: '600', color: '#666' }}>
                Show Grid
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Selected frames: {selectedFrames.length > 0 ? selectedFrames.join(', ') : 'None'}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  const total = rows * columns;
                  setSelectedFrames(Array.from({ length: total }, (_, i) => i));
                }}
                style={{
                  padding: '8px 16px',
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Select All
              </button>
              <button
                onClick={() => setSelectedFrames([])}
                style={{
                  padding: '8px 16px',
                  background: '#757575',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Clear Selection
              </button>
            </div>
          </div>

          {spriteSheet && (
            <div style={{
              border: '3px solid #e91e63',
              borderRadius: '12px',
              padding: '20px',
              background: '#f5f5f5',
              overflowX: 'auto',
              marginBottom: '20px'
            }}>
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                style={{
                  maxWidth: '100%',
                  cursor: 'pointer',
                  imageRendering: 'pixelated',
                  display: 'block'
                }}
              />
              <p style={{ color: '#666', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>
                Click on frames to select/deselect them
              </p>
            </div>
          )}

          {selectedFrames.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ color: '#e91e63', marginBottom: '15px' }}>Animation Preview</h3>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{
                  border: '3px solid #4caf50',
                  borderRadius: '12px',
                  padding: '20px',
                  background: '#f5f5f5',
                  display: 'inline-block'
                }}>
                  <canvas
                    ref={animationCanvasRef}
                    style={{
                      imageRendering: 'pixelated',
                      display: 'block',
                      background: 'repeating-conic-gradient(#ddd 0% 25%, white 0% 50%) 50% / 20px 20px'
                    }}
                  />
                  <p style={{ color: '#666', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>
                    Frame {currentFrame + 1} / {selectedFrames.length} (Index: {selectedFrames[currentFrame]})
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{
                      padding: '12px 24px',
                      background: isPlaying ? '#f44336' : '#4caf50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginBottom: '10px',
                      width: '100%'
                    }}
                  >
                    {isPlaying ? '⏸️ Pause' : '▶️ Play'}
                  </button>

                  <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                    <strong>Frame Size:</strong> {Math.floor(spriteSheet.width / columns)} x {Math.floor(spriteSheet.height / rows)}px
                  </p>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '20px', padding: '15px', background: '#fff3e0', borderRadius: '8px', border: '2px solid #ff9800' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#f57c00' }}>💡 How to use:</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', fontSize: '14px' }}>
              <li>Upload your sprite sheet image (PNG with transparency supported)</li>
              <li>Adjust rows and columns to match your sprite sheet layout</li>
              <li>Click on individual frames to select them (pink highlight)</li>
              <li>Use "Select All" to include all frames in order</li>
              <li>Click "Play" to preview your animation looping forever!</li>
              <li>Adjust frame delay to change animation speed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpriteSheetViewer;
