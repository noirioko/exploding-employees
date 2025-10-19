import { useApp } from '../context/AppContext';
import { useNotification } from '../context/NotificationContext';
import { useState, useEffect, useRef } from 'react';
import { getCurrentSeason, defaultDecorations, defaultBannerDecorations } from '../config/seasonalConfig';

function Header() {
  const { yuCash, noahCreditCard, setNoahCreditCard } = useApp();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  // Get current season decorations
  const currentSeason = getCurrentSeason();
  const decorations = defaultDecorations; // Star explosion around logo
  const bannerEmojis = defaultBannerDecorations; // Hearts and stars across banner background
  const backgroundDecorations = currentSeason?.backgroundDecorations || [];
  const bannerDecorations = currentSeason?.bannerDecorations || [];
  const headerBackground = currentSeason?.backgroundColor || 'linear-gradient(135deg, #ffd6e8 0%, #e8d6ff 100%)';

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header>
      {/* Top HUD Bar */}
      <div style={{
        background: headerBackground,
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 10,
        overflow: 'visible',
        minHeight: '80px'
      }}>
        {/* Background Layer - BEHIND everything */}
        {backgroundDecorations.map((deco, index) => (
          <img
            key={`background-${index}`}
            src={deco.image}
            alt=""
            className={`banner-decoration ${deco.animation}`}
            style={{
              position: 'absolute',
              ...deco.position,
              width: deco.size,
              height: deco.size,
              objectFit: 'contain',
              pointerEvents: 'none',
              zIndex: 1,
              opacity: deco.opacity !== undefined ? deco.opacity : 1,
              filter: deco.filter || 'none',
              animationDelay: deco.delay || '0s'
            }}
          />
        ))}

        {/* Background Banner Emojis (hearts & stars) - very back layer */}
        {bannerEmojis.map((deco, index) => (
          <span
            key={`emoji-${index}`}
            className="banner-emoji-background"
            style={{
              position: 'absolute',
              ...deco.position,
              fontSize: deco.size,
              pointerEvents: 'none',
              zIndex: 1,
              opacity: 0.6,
              animationDelay: deco.delay || '0s'
            }}
          >
            {deco.emoji}
          </span>
        ))}

        {/* Foreground Seasonal Decorations */}
        {bannerDecorations.map((deco, index) => (
          <img
            key={`banner-${index}`}
            src={deco.image}
            alt=""
            className={`banner-decoration ${deco.animation}`}
            style={{
              position: 'absolute',
              ...deco.position,
              width: deco.size,
              height: deco.size,
              objectFit: 'contain',
              pointerEvents: 'none',
              zIndex: 5,
              opacity: deco.opacity !== undefined ? deco.opacity : 1,
              filter: deco.filter || 'none',
              animationDelay: deco.delay || '0s'
            }}
          />
        ))}
        {/* Website Navigation Links - Left Side */}
        <div style={{
          display: 'flex',
          gap: '15px',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10
        }}>
          <a
            href="#"
            style={{
              color: '#6b4f8a',
              textDecoration: 'none',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              opacity: 0.6,
              cursor: 'not-allowed',
              pointerEvents: 'none',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
          >
            News
          </a>
          <span style={{ color: '#e0b3d6', opacity: 0.4 }}>|</span>
          <a
            href="#"
            style={{
              color: '#6b4f8a',
              textDecoration: 'none',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              opacity: 0.6,
              cursor: 'not-allowed',
              pointerEvents: 'none',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
          >
            Shop
          </a>
          <span style={{ color: '#e0b3d6', opacity: 0.4 }}>|</span>
          <a
            href="#"
            style={{
              color: '#6b4f8a',
              textDecoration: 'none',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              opacity: 0.6,
              cursor: 'not-allowed',
              pointerEvents: 'none',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
          >
            About
          </a>
          <span style={{ color: '#e0b3d6', opacity: 0.4 }}>|</span>
          <a
            href="#"
            style={{
              color: '#6b4f8a',
              textDecoration: 'none',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              opacity: 0.6,
              cursor: 'not-allowed',
              pointerEvents: 'none',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
          >
            Donate
          </a>
        </div>

        {/* Logo Section with Star Explosion - Centered, Overlaps into navbar below */}
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20
        }}>
          <img
            src="/images/logo_explodingemployee.png"
            alt="Exploding Employee"
            style={{
              height: '90px',
              width: 'auto',
              objectFit: 'contain',
              animation: 'pulse 2s ease-in-out infinite',
              position: 'relative',
              zIndex: 2,
              marginBottom: '-40px'
            }}
          />
          {/* Star explosion around logo */}
          {decorations.map((deco, index) => (
            <img
              key={index}
              src={deco.image}
              alt=""
              className="sparkle-burst"
              style={{
                ...deco.position,
                animationDelay: deco.delay,
                width: deco.size,
                height: deco.size
              }}
            />
          ))}
        </div>

        {/* Currency Boxes + Profile - Right Side */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          {/* Yu₩Cash Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #ffc1e3',
            borderRadius: '50px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontSize: '18px' }}>💰</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#e91e63' }}>{yuCash.toLocaleString()}</span>
          </div>

          {/* NCC Box with Cheat Button */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #b3c6ff',
            borderRadius: '50px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}>
            <span style={{ fontSize: '18px' }}>💳</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#3f51b5' }}>{noahCreditCard.toLocaleString()}</span>
            {/* Cheat Button */}
            <button
              onClick={() => setNoahCreditCard(prev => prev + 1000)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '10px',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.1s',
                marginLeft: '2px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              title="Add 1000 NCC (Cheat)"
            >
              +
            </button>
          </div>

          {/* Notification Bell with Dropdown */}
          <div style={{ position: 'relative' }} ref={notificationDropdownRef}>
            <div
              onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #ffc1e3',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s',
                position: 'relative'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '20px' }}>🔔</span>
              {/* Unread Count Badge */}
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #c92a2a 100%)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: '700',
                  border: '2px solid white',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  animation: 'pulse-badge 1.5s ease-in-out infinite'
                }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </div>
              )}
            </div>

            {/* Notification Dropdown */}
            {showNotificationDropdown && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: '0',
                background: 'white',
                border: '2px solid #ffc1e3',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                width: '340px',
                maxHeight: '480px',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                {/* Header */}
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '2px solid #ffc1e3',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #ffd6e8 0%, #ffe8f7 100%)'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#e91e63' }}>
                    🔔 Notifications
                  </div>
                  {notifications.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markAllAsRead();
                      }}
                      style={{
                        background: 'rgba(233,30,99,0.1)',
                        border: '1px solid #e91e63',
                        borderRadius: '6px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: '#e91e63',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e91e63';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(233,30,99,0.1)';
                        e.currentTarget.style.color = '#e91e63';
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div style={{
                  flex: 1,
                  overflowY: 'auto',
                  maxHeight: '420px'
                }}>
                  {notifications.length === 0 ? (
                    <div style={{
                      padding: '40px 20px',
                      textAlign: 'center',
                      color: '#999',
                      fontSize: '13px'
                    }}>
                      <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔕</div>
                      <div>No notifications yet!</div>
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        style={{
                          padding: '12px 16px',
                          borderBottom: '1px solid #f0f0f0',
                          background: notification.read ? 'white' : 'rgba(255,209,231,0.1)',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                        onMouseLeave={(e) => e.currentTarget.style.background = notification.read ? 'white' : 'rgba(255,209,231,0.1)'}
                      >
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                          {/* Icon */}
                          <div style={{ fontSize: '18px', flexShrink: 0 }}>
                            {notification.type === 'exp' ? '⭐' :
                             notification.type === 'reward' ? '💰' :
                             notification.type === 'cursed' ? '💀' :
                             notification.type === 'success' ? '✅' : '🎉'}
                          </div>

                          {/* Content */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {notification.title && (
                              <div style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#333',
                                marginBottom: '4px'
                              }}>
                                {notification.title}
                              </div>
                            )}
                            <div style={{
                              fontSize: '12px',
                              color: '#666',
                              lineHeight: '1.4',
                              marginBottom: '6px'
                            }}>
                              {notification.message}
                            </div>

                            {/* Rewards */}
                            {(notification.exp || notification.yuCash || notification.card) && (
                              <div style={{
                                display: 'flex',
                                gap: '8px',
                                fontSize: '11px',
                                fontWeight: '600',
                                color: '#e91e63',
                                flexWrap: 'wrap'
                              }}>
                                {notification.exp && <span>+{notification.exp} EXP</span>}
                                {notification.yuCash && <span>+{notification.yuCash} YC</span>}
                                {notification.card && <span>{notification.card.name}</span>}
                              </div>
                            )}

                            {/* Timestamp */}
                            <div style={{
                              fontSize: '10px',
                              color: '#999',
                              marginTop: '4px'
                            }}>
                              {new Date(notification.timestamp).toLocaleTimeString()}
                            </div>
                          </div>

                          {/* Unread indicator */}
                          {!notification.read && (
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#e91e63',
                              flexShrink: 0,
                              marginTop: '4px'
                            }} />
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Button with Dropdown */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <div
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #ffc1e3',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '20px' }}>👤</span>
            </div>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div style={{
                position: 'absolute',
                top: '48px',
                right: '0',
                background: 'white',
                border: '2px solid #ffc1e3',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                minWidth: '140px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#999',
                    cursor: 'not-allowed',
                    opacity: 0.5,
                    borderBottom: '1px solid #f0f0f0',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Profile
                </div>
                <div
                  style={{
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#999',
                    cursor: 'not-allowed',
                    opacity: 0.5,
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9f9f9'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  Support
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Thin Lavender Navbar with Scallops */}
      <nav style={{
        background: '#c0d7ff',
        padding: '0',
        position: 'relative',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        height: '5px',
        zIndex: 5
      }}>

        {/* Cute Half-Circle Scallops Bottom (Shop Roof Style) */}
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: 0,
          right: 0,
          height: '20px',
          background: '#babdf6',
          WebkitMaskImage: 'radial-gradient(circle at 50% 0%, black 20px, transparent 20px)',
          maskImage: 'radial-gradient(circle at 50% 0%, black 20px, transparent 20px)',
          WebkitMaskSize: '40px 20px',
          maskSize: '40px 20px',
          WebkitMaskRepeat: 'repeat-x',
          maskRepeat: 'repeat-x',
          WebkitMaskPosition: 'center bottom',
          maskPosition: 'center bottom'
        }}></div>
      </nav>

      {/* Spacer for the scallops */}
      <div style={{ height: '30px' }}></div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes pulse-badge {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .sparkle-burst {
          position: absolute;
          opacity: 0;
          animation: sparkle-radiate 2.4s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
          object-fit: contain;
        }

        @keyframes sparkle-radiate {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.3) rotate(0deg);
          }
          15% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
            transform: translate(0, 0) scale(1) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: translate(0, 0) scale(0.3) rotate(360deg);
          }
        }

        /* Seasonal decoration animations */
        .banner-decoration.float {
          animation: float-decoration 3s ease-in-out infinite;
        }

        .banner-decoration.pulse {
          animation: pulse-decoration 2s ease-in-out infinite;
        }

        .banner-decoration.glow {
          animation: glow-decoration 2.5s ease-in-out infinite;
        }

        .banner-decoration.haunt {
          animation: haunt-decoration 4s ease-in-out infinite;
        }

        @keyframes float-decoration {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulse-decoration {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .banner-emoji-background {
          animation: emoji-float-fade 4s ease-in-out infinite;
        }

        @keyframes emoji-float-fade {
          0% {
            opacity: 0.3;
            transform: translateY(0px) rotate(0deg) scale(0.8);
          }
          25% {
            opacity: 0.6;
            transform: translateY(-3px) rotate(90deg) scale(1);
          }
          50% {
            opacity: 0.4;
            transform: translateY(-5px) rotate(180deg) scale(0.9);
          }
          75% {
            opacity: 0.7;
            transform: translateY(-3px) rotate(270deg) scale(1.05);
          }
          100% {
            opacity: 0.3;
            transform: translateY(0px) rotate(360deg) scale(0.8);
          }
        }

        @keyframes glow-decoration {
          0%, 100% {
            filter: brightness(1);
            transform: scale(1);
          }
          50% {
            filter: brightness(1.3);
            transform: scale(1.05);
          }
        }

        @keyframes haunt-decoration {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.8;
          }
          25% {
            transform: translateY(-6px) translateX(-3px);
            opacity: 0.95;
          }
          50% {
            transform: translateY(-10px) translateX(0px);
            opacity: 1;
          }
          75% {
            transform: translateY(-6px) translateX(3px);
            opacity: 0.95;
          }
        }
      `}</style>
    </header>
  );
}

export default Header;
