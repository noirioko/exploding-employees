import { useState } from 'react';

/**
 * Reusable Visual Novel Modal Component
 * Displays a visual novel-style scene with dialogue, characters, and backgrounds
 *
 * Props:
 * - isOpen: boolean - whether the modal is visible
 * - onClose: function - callback when user closes the modal
 * - scenes: array - array of scene objects with dialogue, character images, backgrounds
 * - title: string - title of the visual novel
 */
function VisualNovelModal({ isOpen, onClose, scenes, title }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  if (!isOpen || !scenes || scenes.length === 0) return null;

  const currentScene = scenes[currentSceneIndex];
  const isLastScene = currentSceneIndex === scenes.length - 1;

  const handleNext = () => {
    if (isLastScene) {
      // Close the modal and reset
      setCurrentSceneIndex(0);
      onClose();
    } else {
      setCurrentSceneIndex(currentSceneIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    }
  };

  const handleClose = () => {
    setCurrentSceneIndex(0);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={handleClose}
    >
      <div
        style={{
          position: 'relative',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          background: '#2a2a2a',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 10px 50px rgba(0,0,0,0.8)',
          animation: 'scaleIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Image */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${currentScene.background})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: 'fadeIn 0.5s ease-out'
          }}
        />

        {/* Character Sprite */}
        {currentScene.characterImage && (
          <div
            style={{
              position: 'absolute',
              bottom: '150px',
              left: currentScene.characterPosition === 'left' ? '10%' :
                    currentScene.characterPosition === 'right' ? '60%' : '50%',
              transform: currentScene.characterPosition === 'center' ? 'translateX(-50%)' : 'none',
              maxWidth: '400px',
              maxHeight: '500px',
              animation: 'slideUp 0.5s ease-out'
            }}
          >
            <img
              src={currentScene.characterImage}
              alt={currentScene.character}
              style={{
                width: '100%',
                height: 'auto',
                filter: 'drop-shadow(0 5px 20px rgba(0,0,0,0.5))'
              }}
            />
          </div>
        )}

        {/* Dialogue Box */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%)',
            padding: '25px 40px',
            minHeight: '140px',
            animation: 'slideUpDialogue 0.4s ease-out'
          }}
        >
          {/* Speaker Name */}
          {currentScene.speaker && (
            <div
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#e91e63',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              {currentScene.speaker}
            </div>
          )}

          {/* Dialogue Text */}
          <div
            style={{
              fontSize: '18px',
              lineHeight: '1.7',
              color: '#fff',
              marginBottom: '20px'
            }}
          >
            {currentScene.dialogue}
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {currentSceneIndex > 0 && (
                <button
                  onClick={handlePrevious}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                  }}
                >
                  ← Back
                </button>
              )}
            </div>

            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>
              {currentSceneIndex + 1} / {scenes.length}
            </div>

            <button
              onClick={handleNext}
              style={{
                padding: '12px 30px',
                background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                transition: 'transform 0.2s ease',
                boxShadow: '0 4px 15px rgba(233,30,99,0.4)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isLastScene ? 'Finish ✨' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Close Button (X) */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            background: 'rgba(0,0,0,0.7)',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '20px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ✕
        </button>

        {/* Title (optional) */}
        {title && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '40px',
              background: 'rgba(0,0,0,0.7)',
              padding: '10px 20px',
              borderRadius: '8px',
              border: '2px solid rgba(233,30,99,0.5)'
            }}
          >
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#e91e63' }}>
              {title}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUpDialogue {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default VisualNovelModal;
