import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Reusable Info Popup Component
 * Shows an (i) icon that displays a tooltip/popup when clicked
 */
function InfoPopup({ title, content }) {
  const [showPopup, setShowPopup] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);

  useEffect(() => {
    if (showPopup && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 10,
        left: rect.left + rect.width / 2,
      });
    }
  }, [showPopup]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={buttonRef}
        onClick={() => setShowPopup(!showPopup)}
        className="info-popup-button"
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '50%',
          border: '2px solid #e91e63',
          background: showPopup ? '#e91e63' : '#ffffff',
          color: showPopup ? '#ffffff' : '#e91e63',
          fontSize: '14px',
          fontWeight: '400',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0',
          transition: 'all 0.2s ease',
          fontFamily: 'Arial, sans-serif',
          WebkitTextFillColor: showPopup ? '#ffffff' : '#e91e63',
        }}
        onMouseEnter={(e) => {
          if (!showPopup) {
            e.currentTarget.style.background = '#fce4ec';
            e.currentTarget.style.color = '#c2185b';
            e.currentTarget.style.WebkitTextFillColor = '#c2185b';
            const span = e.currentTarget.querySelector('span');
            if (span) {
              span.style.color = '#c2185b';
              span.style.WebkitTextFillColor = '#c2185b';
            }
          }
        }}
        onMouseLeave={(e) => {
          if (!showPopup) {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#e91e63';
            e.currentTarget.style.WebkitTextFillColor = '#e91e63';
            const span = e.currentTarget.querySelector('span');
            if (span) {
              span.style.color = '#e91e63';
              span.style.WebkitTextFillColor = '#e91e63';
            }
          }
        }}
      >
        <span style={{
          color: showPopup ? '#ffffff' : '#e91e63',
          WebkitTextFillColor: showPopup ? '#ffffff' : '#e91e63',
          display: 'block',
        }}>i</span>
      </button>

      {showPopup && createPortal(
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9998,
            }}
            onClick={() => setShowPopup(false)}
          />

          {/* Popup */}
          <div
            style={{
              position: 'fixed',
              top: `${position.top}px`,
              left: `${position.left}px`,
              transform: 'translateX(-50%)',
              background: 'white',
              border: '3px solid #e91e63',
              borderRadius: '12px',
              padding: '15px',
              minWidth: '250px',
              maxWidth: '350px',
              boxShadow: '0 8px 24px rgba(233, 30, 99, 0.2)',
              zIndex: 9999,
              animation: 'popupSlideIn 0.2s ease-out',
            }}
          >
            {title && (
              <div style={{
                fontSize: '14px',
                fontWeight: '700',
                color: '#e91e63',
                marginBottom: '10px',
                borderBottom: '2px solid #fce4ec',
                paddingBottom: '8px',
              }}>
                {title}
              </div>
            )}
            <div style={{
              fontSize: '13px',
              lineHeight: '1.6',
              color: '#333',
            }}>
              {content}
            </div>

            {/* Arrow */}
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderBottom: '10px solid #e91e63',
            }} />
          </div>

          <style>{`
            @keyframes popupSlideIn {
              from {
                opacity: 0;
                transform: translateX(-50%) translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
              }
            }
          `}</style>
        </>,
        document.body
      )}
    </div>
  );
}

export default InfoPopup;
