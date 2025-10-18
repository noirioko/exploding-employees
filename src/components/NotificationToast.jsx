import { useNotification } from '../context/NotificationContext';

function NotificationToast() {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none',
      maxWidth: '90vw',
      width: '500px'
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: 'white',
            color: '#2c3e50',
            padding: '15px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            pointerEvents: 'auto',
            animation: 'slideInDown 0.3s ease, fadeOut 0.3s ease 4.7s',
            border: `3px solid ${getToastBorderColor(toast.type)}`,
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Icon */}
          <div style={{ fontSize: '24px', flexShrink: 0 }}>
            {getToastIcon(toast.type)}
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            {toast.title && (
              <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '4px' }}>
                {toast.title}
              </div>
            )}
            <div style={{ fontSize: '13px', opacity: 0.95 }}>
              {toast.message}
            </div>
            {/* Rewards display */}
            {(toast.exp || toast.yuCash || toast.card) && (
              <div style={{
                display: 'flex',
                gap: '10px',
                marginTop: '8px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {toast.exp && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>⭐</span>
                    <span>+{toast.exp} EXP</span>
                  </div>
                )}
                {toast.yuCash && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>💰</span>
                    <span>+{toast.yuCash} YC</span>
                  </div>
                )}
                {toast.card && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{toast.card.rarity === 'cursed' ? '💀' : '🎴'}</span>
                    <span>{toast.card.name}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'rgba(0,0,0,0.05)',
              border: 'none',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#666',
              fontSize: '16px',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.1)';
              e.currentTarget.style.color = '#333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
              e.currentTarget.style.color = '#666';
            }}
          >
            ×
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

function getToastBorderColor(type) {
  switch (type) {
    case 'success':
      return '#2ecc71'; // Softer green
    case 'reward':
      return '#e91e63'; // Pink
    case 'exp':
      return '#f39c12'; // Golden orange
    case 'cursed':
      return '#34495e'; // Dark gray
    case 'error':
      return '#e74c3c'; // Red
    case 'warning':
      return '#f39c12'; // Orange
    case 'info':
      return '#3498db'; // Blue
    default:
      return '#9b59b6'; // Purple
  }
}

function getToastIcon(type) {
  switch (type) {
    case 'success':
      return '✅';
    case 'reward':
      return '🎉';
    case 'exp':
      return '⭐';
    case 'cursed':
      return '💀';
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '🔔';
  }
}

export default NotificationToast;
