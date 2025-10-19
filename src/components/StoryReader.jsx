import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useApp } from '../context/AppContext';

function StoryReader({ book, onClose, unlockedChapters, onUnlockChapter }) {
  const { yuCash, setYuCash } = useApp();
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterContent, setChapterContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [navbarHidden, setNavbarHidden] = useState(false);

  const unlockChapter = (chapter) => {
    if (yuCash >= chapter.cost && !unlockedChapters.includes(chapter.id)) {
      setYuCash(yuCash - chapter.cost);
      onUnlockChapter(chapter);
    }
  };

  useEffect(() => {
    const fetchChapter = async () => {
      if (!selectedChapter?.mdPath) {
        setChapterContent('');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(selectedChapter.mdPath);
        if (!response.ok) {
          throw new Error('Failed to load chapter');
        }
        const text = await response.text();
        setChapterContent(text);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [selectedChapter]);

  // Hide/show the bottom navbar using CSS
  useEffect(() => {
    const navbar = document.querySelector('.bottom-navbar');
    if (navbar) {
      if (navbarHidden) {
        navbar.style.transform = 'translateY(100%)';
        navbar.style.transition = 'transform 0.3s ease';
      } else {
        navbar.style.transform = 'translateY(0)';
        navbar.style.transition = 'transform 0.3s ease';
      }
    }

    // Cleanup on unmount - restore navbar
    return () => {
      const navbar = document.querySelector('.bottom-navbar');
      if (navbar) {
        navbar.style.transform = 'translateY(0)';
      }
    };
  }, [navbarHidden]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#f5f5f5',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      {/* Top Currency Bar (like CompactEnergyHeader) */}
      <div style={{
        background: 'white',
        borderBottom: '2px solid #e0e0e0',
        padding: '8px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        animation: 'slideDown 0.3s ease',
        flexShrink: 0
      }}>
        {/* Back Button */}
        <button
          onClick={onClose}
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'rgba(233,30,99,0.1)',
            border: '2px solid #e91e63',
            color: '#e91e63',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            flexShrink: 0,
            padding: 0,
            lineHeight: 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e91e63';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(233,30,99,0.1)';
            e.currentTarget.style.color = '#e91e63';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div style={{ height: '20px', width: '1px', background: '#e0e0e0', flexShrink: 0 }} />

        {/* Story Reader Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '16px' }}>📖</span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#333' }}>Story Reader</span>
        </div>

        <div style={{ flex: 1 }} />

        {/* YuCash Display */}
        <div style={{
          background: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)',
          padding: '8px 16px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          border: '2px solid #4fc3f7',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '16px' }}>💰</span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: '#0277bd' }}>
            YuCash: {yuCash}
          </span>
        </div>
      </div>

      {/* Main Reader Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        {/* Minimized Sidebar Toggle Ball */}
        {sidebarCollapsed && (
          <div
            onClick={() => setSidebarCollapsed(false)}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
              boxShadow: '0 4px 12px rgba(233,30,99,0.4)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              zIndex: 10,
              transition: 'all 0.3s ease',
              animation: 'slideInLeft 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(233,30,99,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(233,30,99,0.4)';
            }}
          >
            {/* Three horizontal stripes */}
            <div style={{ width: '24px', height: '3px', background: 'white', borderRadius: '2px' }} />
            <div style={{ width: '24px', height: '3px', background: 'white', borderRadius: '2px' }} />
            <div style={{ width: '24px', height: '3px', background: 'white', borderRadius: '2px' }} />
          </div>
        )}

        {/* Left Sidebar - Book Cover + Chapter List */}
        {!sidebarCollapsed && (
          <div
            style={{
              width: '280px',
              background: 'white',
              borderRight: '2px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
              animation: 'slideInLeft 0.4s ease',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Minimize Button */}
            <button
              className="pushback-btn"
              onClick={() => setSidebarCollapsed(true)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          {/* Book Cover - Compact */}
          <div
            style={{
              padding: '15px',
              borderBottom: '2px solid #f0f0f0',
              animation: 'slideDown 0.5s ease 0.2s backwards',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0
            }}
          >

          <img
            src={book.coverImage}
            alt={book.title}
            style={{
              width: '50%',
              height: 'auto',
              aspectRatio: '2/3',
              objectFit: 'contain',
              borderRadius: '10px',
              boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
              marginBottom: '12px',
              background: '#f9f9f9'
            }}
          />
          <h2 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#333',
            marginBottom: '4px',
            textAlign: 'center'
          }}>
            {book.title}
          </h2>
          <p style={{
            fontSize: '11px',
            color: '#666',
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            {book.description}
          </p>
        </div>

        {/* Chapter List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: navbarHidden ? '15px 10px 20px 10px' : '15px 10px 80px 10px',
            transition: 'padding 0.3s ease'
          }}
        >
          <div style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#999',
            textTransform: 'uppercase',
            marginBottom: '8px',
            paddingLeft: '10px',
            letterSpacing: '0.5px'
          }}>
            Chapters
          </div>

          {/* Unlock All Button */}
          {unlockedChapters.length < book.chapters.length && (
            <button
              onClick={() => {
                const totalCost = book.chapters.reduce((sum, ch) => {
                  return !unlockedChapters.includes(ch.id) ? sum + ch.cost : sum;
                }, 0);

                if (yuCash >= totalCost) {
                  setYuCash(yuCash - totalCost);
                  const allChapterIds = book.chapters.map(ch => ch.id);
                  onUnlockChapter({ id: allChapterIds });
                }
              }}
              disabled={yuCash < book.chapters.reduce((sum, ch) => !unlockedChapters.includes(ch.id) ? sum + ch.cost : sum, 0)}
              style={{
                width: '100%',
                padding: '10px',
                marginBottom: '12px',
                background: yuCash >= book.chapters.reduce((sum, ch) => !unlockedChapters.includes(ch.id) ? sum + ch.cost : sum, 0)
                  ? 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)'
                  : '#bdbdbd',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: yuCash >= book.chapters.reduce((sum, ch) => !unlockedChapters.includes(ch.id) ? sum + ch.cost : sum, 0)
                  ? 'pointer'
                  : 'not-allowed',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 6px rgba(233,30,99,0.3)'
              }}
              onMouseEnter={(e) => {
                if (yuCash >= book.chapters.reduce((sum, ch) => !unlockedChapters.includes(ch.id) ? sum + ch.cost : sum, 0)) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 10px rgba(233,30,99,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(233,30,99,0.3)';
              }}
            >
              ✨ Unlock All ({book.chapters.reduce((sum, ch) => !unlockedChapters.includes(ch.id) ? sum + ch.cost : sum, 0)} YC)
            </button>
          )}

          {book.chapters.map((chapter, index) => {
            const isUnlocked = unlockedChapters.includes(chapter.id);
            const canAfford = yuCash >= chapter.cost;

            return (
              <div
                key={chapter.id}
                style={{
                  padding: '10px 12px',
                  marginBottom: '6px',
                  borderRadius: '8px',
                  background: selectedChapter?.id === chapter.id ? '#e91e63' : (isUnlocked ? 'white' : '#f9f9f9'),
                  color: selectedChapter?.id === chapter.id ? 'white' : (isUnlocked ? '#333' : '#999'),
                  border: `2px solid ${selectedChapter?.id === chapter.id ? '#e91e63' : (isUnlocked ? '#f0f0f0' : '#e0e0e0')}`,
                  transition: 'all 0.2s ease',
                  animation: `slideDown 0.4s ease ${0.3 + index * 0.05}s backwards`
                }}
              >
                <div
                  onClick={() => isUnlocked && setSelectedChapter(chapter)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: isUnlocked ? 'pointer' : 'default',
                    marginBottom: isUnlocked ? '0' : '6px'
                  }}
                  onMouseEnter={(e) => {
                    if (isUnlocked && selectedChapter?.id !== chapter.id) {
                      e.currentTarget.parentElement.style.background = '#fff5f8';
                      e.currentTarget.parentElement.style.borderColor = '#ffc1e3';
                      e.currentTarget.parentElement.style.transform = 'translateX(3px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isUnlocked && selectedChapter?.id !== chapter.id) {
                      e.currentTarget.parentElement.style.background = 'white';
                      e.currentTarget.parentElement.style.borderColor = '#f0f0f0';
                      e.currentTarget.parentElement.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <div style={{ fontSize: '16px' }}>
                    {isUnlocked ? '📖' : '🔒'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      lineHeight: '1.3'
                    }}>
                      {chapter.title}
                    </div>
                  </div>
                </div>

                {/* Unlock Button */}
                {!isUnlocked && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      unlockChapter(chapter);
                    }}
                    disabled={!canAfford}
                    style={{
                      width: '100%',
                      padding: '6px',
                      marginTop: '6px',
                      background: canAfford ? 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)' : '#bdbdbd',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: '600',
                      cursor: canAfford ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {canAfford ? `Unlock (${chapter.cost} YC)` : `Need ${chapter.cost} YC`}
                  </button>
                )}
              </div>
            );
          })}
        </div>
          </div>
        )}

        {/* Right Main Content Area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            background: 'white',
            animation: 'fadeIn 0.5s ease 0.3s backwards',
            overflow: 'hidden'
          }}
        >
        {!selectedChapter ? (
          /* Welcome State */
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            padding: '40px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📚</div>
            <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '10px', color: '#666' }}>
              Select a chapter to start reading
            </div>
            <div style={{ fontSize: '14px', textAlign: 'center', maxWidth: '400px', lineHeight: '1.6' }}>
              Choose from the chapter list on the left to begin your journey through "{book.title}"
            </div>
          </div>
        ) : (
          /* Chapter Content */
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '60px 80px',
            maxWidth: '900px',
            margin: '0 auto',
            width: '100%'
          }}>
            {loading && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#666' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>📖</div>
                <div>Loading chapter...</div>
              </div>
            )}

            {error && (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#e91e63' }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>❌</div>
                <div>{error}</div>
              </div>
            )}

            {!loading && !error && chapterContent && (
              <div
                style={{
                  animation: 'fadeIn 0.4s ease'
                }}
              >
                {/* Chapter Header */}
                <div style={{
                  marginBottom: '40px',
                  paddingBottom: '25px',
                  borderBottom: '2px solid #f0f0f0'
                }}>
                  <div style={{
                    fontSize: '14px',
                    color: '#e91e63',
                    fontWeight: '700',
                    marginBottom: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}>
                    {book.title}
                  </div>
                  <h1 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#333',
                    margin: 0
                  }}>
                    {selectedChapter.title}
                  </h1>
                </div>

                {/* Markdown Content */}
                <div
                  style={{
                    fontSize: '17px',
                    lineHeight: '1.9',
                    color: '#333',
                    fontFamily: 'Georgia, "Times New Roman", serif'
                  }}
                  className="story-markdown-content"
                >
                  <Markdown>{chapterContent}</Markdown>
                </div>
              </div>
            )}
          </div>
        )}
        </div>

        {/* Bottom Navbar Toggle Button - Tiny & Cute! */}
        <button
          onClick={() => setNavbarHidden(!navbarHidden)}
          style={{
            position: 'fixed',
            bottom: navbarHidden ? '15px' : '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
            border: '2px solid white',
            boxShadow: '0 3px 8px rgba(233,30,99,0.3)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2px',
            zIndex: 1001,
            transition: 'all 0.3s ease',
            animation: 'fadeIn 0.5s ease 0.5s backwards',
            padding: 0,
            lineHeight: 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(1.15)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(233,30,99,0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
            e.currentTarget.style.boxShadow = '0 3px 8px rgba(233,30,99,0.3)';
          }}
        >
          {navbarHidden ? (
            /* Show navbar - chevron up */
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 10L8 6L4 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            /* Hide navbar - three horizontal stripes */
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="2" y1="4" x2="14" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="2" y1="8" x2="14" y2="8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <line x1="2" y1="12" x2="14" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </div>

      <style>{`
        /* Pushback Button - perfectly centered circle */
        .pushback-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          z-index: 10;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(233,30,99,0.1);
          border: 2px solid #e91e63;
          color: #e91e63;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          vertical-align: middle;
          transition: all 0.2s ease;
          font-size: 20px;
          font-weight: 700;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          padding: 0 !important;
          margin: 0 !important;
          line-height: 1 !important;
          box-sizing: border-box;
        }

        .pushback-btn:hover {
          background: #e91e63;
          color: white;
          transform: scale(1.1);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .story-markdown-content p {
          margin-bottom: 1.4em;
          text-indent: 2em;
        }

        .story-markdown-content h1,
        .story-markdown-content h2,
        .story-markdown-content h3 {
          color: #e91e63;
          margin-top: 2em;
          margin-bottom: 0.8em;
          font-weight: 700;
          text-indent: 0;
        }

        .story-markdown-content h1 {
          font-size: 28px;
        }

        .story-markdown-content h2 {
          font-size: 24px;
        }

        .story-markdown-content h3 {
          font-size: 20px;
        }

        .story-markdown-content em {
          font-style: italic;
          color: #666;
        }

        .story-markdown-content strong {
          font-weight: 700;
          color: #e91e63;
        }

        .story-markdown-content hr {
          border: none;
          border-top: 1px solid #f0f0f0;
          margin: 2.5em 0;
        }

        .story-markdown-content blockquote {
          border-left: 4px solid #fce4ec;
          padding-left: 20px;
          margin: 2em 0;
          color: #666;
          font-style: italic;
        }

        /* Smooth scrollbar */
        .story-markdown-content::-webkit-scrollbar {
          width: 8px;
        }

        .story-markdown-content::-webkit-scrollbar-track {
          background: #f5f5f5;
        }

        .story-markdown-content::-webkit-scrollbar-thumb {
          background: #e0e0e0;
          border-radius: 4px;
        }

        .story-markdown-content::-webkit-scrollbar-thumb:hover {
          background: #ccc;
        }
      `}</style>
    </div>
  );
}

export default StoryReader;
