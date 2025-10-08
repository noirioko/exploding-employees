import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getItemsByShop, itemCategories } from '../data/shopItems';

function Supermarket() {
  const { yuCash, buyIngredient } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [notification, setNotification] = useState(null);

  // Room dimensions - same as Yuwon's room
  const roomWidth = 640;
  const roomHeight = 360;

  // Get shop items from config
  const allItems = getItemsByShop('supermarket');
  const items = selectedCategory === 'ALL'
    ? allItems
    : allItems.filter(item => item.category === selectedCategory);

  const handleBuy = (item) => {
    const success = buyIngredient(item.id, 1, item.price);
    if (success) {
      setNotification({ message: `✅ Bought ${item.name}!`, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } else {
      setNotification({ message: `❌ Not enough YuCash!`, type: 'error' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div>
      <div className="current-date">
        🛒 Supermarket
      </div>

      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: notification.type === 'success'
            ? 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)'
            : 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)',
          color: 'white',
          padding: '14px 28px',
          borderRadius: '30px',
          fontSize: '15px',
          fontWeight: '700',
          zIndex: 2000,
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
          animation: 'slideDown 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55), fadeOut 0.3s ease-in-out 2.7s forwards',
          border: '2px solid rgba(255, 255, 255, 0.3)'
        }}>
          {notification.message}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translate(-50%, -30px) scale(0.8);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translate(-50%, 0) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -20px) scale(0.9);
          }
        }
      `}</style>

      <div className="content">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', padding: '20px' }}>

          {/* Placeholder Room/Store Box */}
          <div
            style={{
              width: `${roomWidth}px`,
              height: `${roomHeight}px`,
              background: '#f5f5f5',
              border: '3px solid #81c784',
              borderRadius: '12px',
              position: 'relative',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ textAlign: 'center', color: '#999' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🏪</div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>Supermarket Pixel Art</div>
              <div style={{ fontSize: '12px', marginTop: '5px' }}>Coming Soon...</div>
            </div>
          </div>

          {/* Shop Section - Below Room */}
          <div style={{ marginTop: '40px', width: '100%', maxWidth: '900px' }}>
            <h3 style={{ fontSize: '18px', color: '#2e7d32', marginBottom: '20px', textAlign: 'center' }}>
              🛍️ SHOP
            </h3>

            {/* Category Filter Buttons */}
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <button
                onClick={() => setSelectedCategory('ALL')}
                style={{
                  padding: '8px 16px',
                  background: selectedCategory === 'ALL' ? 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)' : '#e0e0e0',
                  color: selectedCategory === 'ALL' ? 'white' : '#666',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedCategory === 'ALL' ? '0 2px 8px rgba(76, 175, 80, 0.3)' : 'none'
                }}
              >
                ALL
              </button>
              {Object.values(itemCategories).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    padding: '8px 16px',
                    background: selectedCategory === category ? 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)' : '#e0e0e0',
                    color: selectedCategory === category ? 'white' : '#666',
                    border: 'none',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedCategory === category ? '0 2px 8px rgba(76, 175, 80, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category) {
                      e.target.style.background = '#d0d0d0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category) {
                      e.target.style.background = '#e0e0e0';
                    }
                  }}
                >
                  {category}
                </button>
              ))}
            </div>

            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: '15px'
              }}>
                {items.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: '#fafafa',
                      borderRadius: '10px',
                      padding: '15px',
                      textAlign: 'center',
                      border: '2px solid #e0e0e0',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '64px' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          maxWidth: '64px',
                          maxHeight: '64px',
                          imageRendering: 'pixelated',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                    <h4 style={{ fontSize: '14px', color: '#333', marginBottom: '4px', fontWeight: '600' }}>
                      {item.name}
                    </h4>
                    <div style={{
                      fontSize: '10px',
                      color: '#999',
                      marginBottom: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {item.category}
                    </div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: '900',
                      color: '#ff9800',
                      marginBottom: '10px'
                    }}>
                      {item.price} YC
                    </div>
                    <button
                      onClick={() => handleBuy(item)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      Buy
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => window.location.href = '/#/room'}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          padding: '12px 24px',
          background: 'white',
          color: '#666',
          border: '2px solid #e0e0e0',
          borderRadius: '25px',
          fontSize: '14px',
          fontWeight: '700',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = '#f5f5f5';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'white';
          e.target.style.transform = 'scale(1)';
        }}
      >
        ← Back to Room
      </button>
    </div>
  );
}

export default Supermarket;
