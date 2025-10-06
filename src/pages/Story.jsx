import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { auBooks, rollAU } from '../data/auBooks';
import { chapters, extras } from '../data/storyContent';
import { getAllMilestones, getUnlockedMilestones } from '../data/galleryMilestones';
import VisualNovelModal from '../components/VisualNovelModal';

function Story() {
  const {
    yuCash,
    setYuCash,
    noahCreditCard,
    setNoahCreditCard,
    collectedCards,
    gachaHistory,
    setGachaHistory,
    unlockedAUs,
    unlockAU,
    auProgress,
    revealSnippet,
    completedTasks
  } = useApp();

  const [isPulling, setIsPulling] = useState(false);
  const [lastPull, setLastPull] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState('chapters');
  const [unlockedChapters, setUnlockedChapters] = useState([]);
  const [unlockedExtras, setUnlockedExtras] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedAU, setSelectedAU] = useState(null);
  const [showAUModal, setShowAUModal] = useState(false);
  const [printingSnippet, setPrintingSnippet] = useState(null); // {auId, snippetIndex}
  const [printingState, setPrintingState] = useState(null); // 'printing', 'finished', or null
  const [showVisualNovel, setShowVisualNovel] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedCouple, setSelectedCouple] = useState('noahYuwon'); // For gallery couple filter

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'common': return '#9e9e9e';
      case 'rare': return '#2196f3';
      case 'super': return '#ff5722';
      case 'ultra': return '#9c27b0';
      default: return '#9e9e9e';
    }
  };

  const getRarityIcon = (rarity) => {
    switch(rarity) {
      case 'common': return '⭐️';
      case 'rare': return '💎';
      case 'super': return '🔥';
      case 'ultra': return '🌈💀';
      default: return '⭐️';
    }
  };

  const pullGacha = (type) => {
    const cost = type === 'normal' ? 50 : 1;
    const currency = type === 'normal' ? yuCash : noahCreditCard;

    if (currency < cost) return;

    // Check if all AUs are unlocked
    if (unlockedAUs.length >= auBooks.length) {
      alert(`You've unlocked all ${auBooks.length} AU books! 🎉`);
      return;
    }

    setIsPulling(true);

    if (type === 'normal') {
      setYuCash(yuCash - cost);
    } else {
      setNoahCreditCard(noahCreditCard - cost);
    }

    setTimeout(() => {
      // Roll an AU book
      let pulledAU;
      let attempts = 0;

      // Keep rolling until we get an AU that's not unlocked (prevent duplicates)
      do {
        pulledAU = rollAU(type);
        attempts++;
      } while (unlockedAUs.includes(pulledAU.id) && attempts < 50);

      // If we couldn't find a new AU after 50 attempts, just pick the first locked one
      if (unlockedAUs.includes(pulledAU.id)) {
        pulledAU = auBooks.find(au => !unlockedAUs.includes(au.id));
      }

      // Unlock the AU
      unlockAU(pulledAU.id);

      const pullResult = {
        ...pulledAU,
        type,
        timestamp: Date.now(),
        isNewUnlock: true
      };

      setLastPull(pullResult);
      setGachaHistory([pullResult, ...gachaHistory]);
      setIsPulling(false);
      setShowResult(true);
    }, 2000);
  };

  const unlockChapter = (chapter) => {
    if (yuCash >= chapter.cost) {
      setYuCash(yuCash - chapter.cost);
      setUnlockedChapters([...unlockedChapters, chapter.id]);
    }
  };

  const unlockExtra = (extra) => {
    if (noahCreditCard >= extra.cost) {
      setNoahCreditCard(noahCreditCard - extra.cost);
      setUnlockedExtras([...unlockedExtras, extra.id]);
    }
  };

  return (
    <div>
      <div className="current-date">
        📖 Story & Collections
      </div>

      <div className="content">
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #fce4ec' }}>
          <button
            onClick={() => setActiveTab('chapters')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'chapters' ? 'linear-gradient(135deg, #f8bbd0 0%, #e91e63 100%)' : 'transparent',
              color: activeTab === 'chapters' ? 'white' : '#e91e63',
              border: 'none',
              borderBottom: activeTab === 'chapters' ? 'none' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            📚 Story Chapters
          </button>
          <button
            onClick={() => setActiveTab('gacha')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'gacha' ? 'linear-gradient(135deg, #f8bbd0 0%, #e91e63 100%)' : 'transparent',
              color: activeTab === 'gacha' ? 'white' : '#e91e63',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            🎰 Story Gacha
          </button>
          <button
            onClick={() => setActiveTab('aus')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'aus' ? 'linear-gradient(135deg, #f8bbd0 0%, #e91e63 100%)' : 'transparent',
              color: activeTab === 'aus' ? 'white' : '#e91e63',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            📖 AU Collection
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'cards' ? 'linear-gradient(135deg, #f8bbd0 0%, #e91e63 100%)' : 'transparent',
              color: activeTab === 'cards' ? 'white' : '#e91e63',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            🎴 Card Collection
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            style={{
              padding: '12px 24px',
              background: activeTab === 'gallery' ? 'linear-gradient(135deg, #f8bbd0 0%, #e91e63 100%)' : 'transparent',
              color: activeTab === 'gallery' ? 'white' : '#e91e63',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            🖼️ Gallery
          </button>
        </div>

        {/* Story Chapters Tab */}
        {activeTab === 'chapters' && (
          <div>
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '18px', color: '#e91e63', marginBottom: '15px' }}>📚 Main Story</h3>
              {chapters.map(chapter => (
                <div key={chapter.id} style={{
                  padding: '20px',
                  background: 'white',
                  borderRadius: '12px',
                  border: '2px solid #ffc1e3',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <div style={{ fontSize: '32px' }}>
                    {unlockedChapters.includes(chapter.id) ? '📖' : '🔒'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>
                      Chapter {chapter.id}: {chapter.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#999', marginBottom: '8px' }}>
                      {chapter.description}
                    </div>
                    <div style={{ fontSize: '13px', color: '#0288d1', fontWeight: '600' }}>
                      Cost: {chapter.cost} YC
                    </div>
                  </div>
                  <button
                    onClick={() => unlockChapter(chapter)}
                    disabled={unlockedChapters.includes(chapter.id) || yuCash < chapter.cost}
                    style={{
                      padding: '10px 20px',
                      background: unlockedChapters.includes(chapter.id) ? '#4caf50' : (yuCash >= chapter.cost ? 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)' : '#bdbdbd'),
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: unlockedChapters.includes(chapter.id) || yuCash < chapter.cost ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {unlockedChapters.includes(chapter.id) ? 'Unlocked ✓' : (yuCash >= chapter.cost ? 'Unlock' : 'Not enough YC')}
                  </button>
                </div>
              ))}
            </div>

            <div>
              <h3 style={{ fontSize: '18px', color: '#e91e63', marginBottom: '15px' }}>✨ Extras</h3>
              {extras.map(extra => (
                <div key={extra.id} style={{
                  padding: '20px',
                  background: 'white',
                  borderRadius: '12px',
                  border: '2px solid #f8bbd0',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}>
                  <div style={{ fontSize: '32px' }}>
                    {unlockedExtras.includes(extra.id) ? '💎' : '🔒'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '5px' }}>
                      Premium: {extra.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#999', marginBottom: '8px' }}>
                      {extra.description}
                    </div>
                    <div style={{ fontSize: '13px', color: '#e91e63', fontWeight: '600' }}>
                      Cost: {extra.cost} NCC (Noah's Credit Card)
                    </div>
                  </div>
                  <button
                    onClick={() => unlockExtra(extra)}
                    disabled={unlockedExtras.includes(extra.id) || noahCreditCard < extra.cost}
                    style={{
                      padding: '10px 20px',
                      background: unlockedExtras.includes(extra.id) ? '#4caf50' : (noahCreditCard >= extra.cost ? 'linear-gradient(135deg, #f48fb1 0%, #e91e63 100%)' : '#bdbdbd'),
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      cursor: unlockedExtras.includes(extra.id) || noahCreditCard < extra.cost ? 'not-allowed' : 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {unlockedExtras.includes(extra.id) ? 'Unlocked ✓' : (noahCreditCard >= extra.cost ? 'Unlock' : 'Not enough NCC')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gacha Tab */}
        {activeTab === 'gacha' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '30px' }}>
              {/* Normal Gacha */}
              <div style={{
                padding: '30px',
                background: 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)',
                borderRadius: '20px',
                border: '3px solid #4fc3f7',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '15px' }}>🎰</div>
                <h3 style={{ fontSize: '20px', color: '#0277bd', marginBottom: '10px' }}>Normal Gacha</h3>
                <p style={{ fontSize: '13px', color: '#0288d1', marginBottom: '20px' }}>
                  Wholesome office chaos & cute moments
                </p>
                <div style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Drop Rates:</div>
                  <div style={{ fontSize: '11px', color: '#9e9e9e' }}>⭐️ Common 70%</div>
                  <div style={{ fontSize: '11px', color: '#2196f3' }}>💎 Rare 20%</div>
                  <div style={{ fontSize: '11px', color: '#ff5722' }}>🔥 Super 8%</div>
                  <div style={{ fontSize: '11px', color: '#9c27b0' }}>🌈💀 Ultra 2%</div>
                </div>
                <button
                  onClick={() => pullGacha('normal')}
                  disabled={isPulling || yuCash < 50}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: isPulling || yuCash < 50 ? '#bdbdbd' : 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: isPulling || yuCash < 50 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isPulling ? '🎰 Rolling...' : `Pull (50 YC)`}
                </button>
              </div>

              {/* Spicy Gacha */}
              <div style={{
                padding: '30px',
                background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
                borderRadius: '20px',
                border: '3px solid #f48fb1',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '64px', marginBottom: '15px' }}>🔥</div>
                <h3 style={{ fontSize: '20px', color: '#c2185b', marginBottom: '10px' }}>Spicy Gacha</h3>
                <p style={{ fontSize: '13px', color: '#e91e63', marginBottom: '20px' }}>
                  AU progressions & cursed content
                </p>
                <div style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}>
                  <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Drop Rates:</div>
                  <div style={{ fontSize: '11px', color: '#9e9e9e' }}>⭐️ Common 20%</div>
                  <div style={{ fontSize: '11px', color: '#2196f3' }}>💎 Rare 40%</div>
                  <div style={{ fontSize: '11px', color: '#ff5722' }}>🔥 Super 30%</div>
                  <div style={{ fontSize: '11px', color: '#9c27b0' }}>🌈💀 Ultra 10%</div>
                </div>
                <button
                  onClick={() => pullGacha('spicy')}
                  disabled={isPulling || noahCreditCard < 1}
                  style={{
                    width: '100%',
                    padding: '15px',
                    background: isPulling || noahCreditCard < 1 ? '#bdbdbd' : 'linear-gradient(135deg, #f48fb1 0%, #e91e63 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: isPulling || noahCreditCard < 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {isPulling ? '🔥 Rolling...' : `Pull (1 NCC)`}
                </button>
              </div>
            </div>

            <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: '15px', border: '2px solid #e0e0e0' }}>
              <h3 style={{ fontSize: '16px', color: '#333', marginBottom: '10px' }}>💡 How to Get Currency</h3>
              <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.8' }}>
                <p style={{ marginBottom: '8px' }}>
                  💵 <strong>YuCash (YC):</strong> Complete tasks. Low = +1 YC, Med = +2 YC, High = +3 YC
                </p>
                <p>
                  💳 <strong>Noah's Credit Card (NCC):</strong> Complete Impossible Tasks!
                </p>
              </div>
            </div>

            {/* Gacha History */}
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ fontSize: '18px', color: '#e91e63', marginBottom: '15px' }}>
                📜 Pull History ({gachaHistory.length})
              </h3>
              {gachaHistory.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📜</div>
                  <p>No pulls yet! Start pulling to see your history.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                  {gachaHistory.slice(0, 20).map((pull, idx) => (
                    <div key={idx} style={{
                      padding: '15px',
                      background: 'white',
                      borderRadius: '10px',
                      border: `2px solid ${getRarityColor(pull.rarity)}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <div style={{ fontSize: '24px' }}>{getRarityIcon(pull.rarity)}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '12px',
                          color: getRarityColor(pull.rarity),
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          marginBottom: '5px'
                        }}>
                          {pull.rarity} • {pull.type === 'normal' ? '🎰 Normal' : '🔥 Spicy'}
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '3px' }}>
                          📖 {pull.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                          {pull.description}
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: '#999' }}>
                        {new Date(pull.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* AU Collection Tab */}
        {activeTab === 'aus' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: '#e91e63', marginBottom: '10px' }}>
                📖 AU Book Collection ({unlockedAUs.length}/{auBooks.length})
              </h3>
              <p style={{ fontSize: '13px', color: '#666' }}>
                Unlock AU books through gacha pulls! Click on unlocked books to read and juice the snippets.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
              {auBooks.map((au) => {
                const isUnlocked = unlockedAUs.includes(au.id);
                const progress = auProgress[au.id] || { revealedSnippets: [], juiceSpent: 0 };
                const snippetsRevealed = progress.revealedSnippets.length;

                return (
                  <div
                    key={au.id}
                    style={{
                      background: isUnlocked ? 'white' : '#f5f5f5',
                      border: `3px ${isUnlocked ? 'solid' : 'dashed'} ${getRarityColor(au.rarity)}`,
                      borderRadius: '15px',
                      padding: '15px',
                      transition: 'transform 0.2s ease',
                      cursor: isUnlocked ? 'pointer' : 'default',
                      opacity: isUnlocked ? 1 : 0.6
                    }}
                    onClick={() => {
                      if (isUnlocked) {
                        setSelectedAU(au);
                        setShowAUModal(true);
                      }
                    }}
                    onMouseEnter={(e) => isUnlocked && (e.currentTarget.style.transform = 'translateY(-5px)')}
                    onMouseLeave={(e) => isUnlocked && (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '36px' }}>
                      {isUnlocked ? '📖' : '🔒'}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: getRarityColor(au.rarity),
                      textTransform: 'uppercase',
                      fontWeight: '700',
                      marginBottom: '8px',
                      textAlign: 'center'
                    }}>
                      {getRarityIcon(au.rarity)} {au.rarity}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: isUnlocked ? '#333' : '#999', marginBottom: '8px', textAlign: 'center', minHeight: '40px' }}>
                      {isUnlocked ? au.title : '???'}
                    </div>
                    {isUnlocked && (
                      <>
                        <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.4', marginBottom: '10px', textAlign: 'center', minHeight: '45px' }}>
                          {au.description}
                        </div>
                        <div style={{
                          background: '#f5f5f5',
                          padding: '8px',
                          borderRadius: '8px',
                          textAlign: 'center',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: snippetsRevealed === au.snippets.length ? '#4caf50' : '#e91e63'
                        }}>
                          {snippetsRevealed}/{au.snippets.length} Snippets Revealed
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Cards Tab */}
        {activeTab === 'cards' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: '#e91e63', marginBottom: '10px' }}>
                🎴 Card Collection ({collectedCards.length}/100)
              </h3>
              <p style={{ fontSize: '13px', color: '#666' }}>
                10% chance to get a card when completing any task! Collect all 100 cursed cards.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
              {[...Array(100)].map((_, index) => {
                const cardId = index + 1;
                const collectedCard = collectedCards.find(c => c.id === cardId);

                return (
                  <div
                    key={cardId}
                    style={{
                      background: collectedCard ? 'white' : '#f5f5f5',
                      border: collectedCard ? `3px solid ${getRarityColor(collectedCard.rarity)}` : '3px dashed #ddd',
                      borderRadius: '12px',
                      padding: '12px',
                      transition: 'transform 0.2s ease',
                      cursor: collectedCard ? 'pointer' : 'default',
                      opacity: collectedCard ? 1 : 0.5
                    }}
                    onClick={() => {
                      if (collectedCard) {
                        setSelectedCard(collectedCard);
                        setShowCardModal(true);
                      }
                    }}
                    onMouseEnter={(e) => collectedCard && (e.currentTarget.style.transform = 'translateY(-5px)')}
                    onMouseLeave={(e) => collectedCard && (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <div style={{ textAlign: 'center', marginBottom: '8px', fontSize: '28px' }}>
                      {collectedCard ? '🎴' : '❓'}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: collectedCard ? getRarityColor(collectedCard.rarity) : '#999',
                      textTransform: 'uppercase',
                      fontWeight: '700',
                      marginBottom: '5px',
                      textAlign: 'center'
                    }}>
                      {collectedCard ? collectedCard.rarity : '???'}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: '600', color: collectedCard ? '#333' : '#999', marginBottom: '6px', textAlign: 'center' }}>
                      #{cardId} {collectedCard ? collectedCard.title : '???'}
                    </div>
                    {collectedCard && (
                      <div style={{ fontSize: '9px', color: '#666', lineHeight: '1.3', maxHeight: '45px', overflow: 'hidden', textAlign: 'center' }}>
                        {collectedCard.text.substring(0, 40)}...
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', color: '#e91e63', marginBottom: '10px' }}>
                🖼️ Milestone Gallery ({getUnlockedMilestones(completedTasks.length).length}/10)
              </h3>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
                Complete tasks to unlock romantic milestone scenes! Each milestone reveals a special visual novel moment.
              </p>

              {/* Couple Selector */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
                <button
                  onClick={() => setSelectedCouple('noahYuwon')}
                  style={{
                    padding: '12px 24px',
                    background: selectedCouple === 'noahYuwon' ? 'linear-gradient(135deg, #4fc3f7 0%, #0288d1 100%)' : 'white',
                    color: selectedCouple === 'noahYuwon' ? 'white' : '#0288d1',
                    border: `2px solid ${selectedCouple === 'noahYuwon' ? '#0288d1' : '#4fc3f7'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  💙 Noah × Yuwon
                </button>
                <button
                  onClick={() => setSelectedCouple('jaehyunMinkyu')}
                  style={{
                    padding: '12px 24px',
                    background: selectedCouple === 'jaehyunMinkyu' ? 'linear-gradient(135deg, #f48fb1 0%, #e91e63 100%)' : 'white',
                    color: selectedCouple === 'jaehyunMinkyu' ? 'white' : '#e91e63',
                    border: `2px solid ${selectedCouple === 'jaehyunMinkyu' ? '#e91e63' : '#f48fb1'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  💖 Jaehyun × Minkyu
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {getAllMilestones().filter(m => m.couple === selectedCouple).map((milestone) => {
                const isUnlocked = completedTasks.length >= milestone.milestone;

                return (
                  <div
                    key={milestone.id}
                    style={{
                      background: isUnlocked ? 'white' : '#f5f5f5',
                      border: `3px ${isUnlocked ? 'solid' : 'dashed'} ${isUnlocked ? '#e91e63' : '#ddd'}`,
                      borderRadius: '15px',
                      padding: '20px',
                      transition: 'all 0.3s ease',
                      cursor: isUnlocked ? 'pointer' : 'default',
                      opacity: isUnlocked ? 1 : 0.6,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onClick={() => {
                      if (isUnlocked) {
                        setSelectedMilestone(milestone);
                        setShowVisualNovel(true);
                      }
                    }}
                    onMouseEnter={(e) => {
                      if (isUnlocked) {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(233,30,99,0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isUnlocked) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {/* Milestone Number Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: isUnlocked ? 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)' : '#999',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      fontSize: '16px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      {milestone.id}
                    </div>

                    {/* Thumbnail */}
                    <div style={{
                      width: '100%',
                      height: '150px',
                      borderRadius: '10px',
                      background: isUnlocked ? `url(${milestone.thumbnail})` : '#ddd',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      marginBottom: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px'
                    }}>
                      {!isUnlocked && '🔒'}
                    </div>

                    {/* Title */}
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: isUnlocked ? '#333' : '#999',
                      marginBottom: '8px',
                      textAlign: 'center'
                    }}>
                      {isUnlocked ? milestone.title : '???'}
                    </div>

                    {/* Milestone Requirement */}
                    <div style={{
                      fontSize: '12px',
                      color: isUnlocked ? '#e91e63' : '#999',
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>
                      {isUnlocked ? '✓ Unlocked!' : `Complete ${milestone.milestone} tasks`}
                    </div>

                    {/* Scene Count */}
                    {isUnlocked && (
                      <div style={{
                        marginTop: '10px',
                        fontSize: '11px',
                        color: '#666',
                        textAlign: 'center',
                        background: '#f5f5f5',
                        padding: '6px',
                        borderRadius: '6px'
                      }}>
                        {milestone.scenes.length} scenes
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress Info */}
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: 'white',
              borderRadius: '12px',
              border: '2px solid #fce4ec'
            }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                📊 Your Progress: <strong>{completedTasks.length}</strong> tasks completed
              </div>
              <div style={{
                height: '12px',
                background: '#f5f5f5',
                borderRadius: '6px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  height: '100%',
                  background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
                  width: `${Math.min((completedTasks.length / 100) * 100, 100)}%`,
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <div style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
                Next milestone: {getUnlockedMilestones(completedTasks.length).length < 10
                  ? `${getAllMilestones().find(m => completedTasks.length < m.milestone)?.milestone} tasks`
                  : 'All milestones unlocked! 🎉'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Result Modal (Gacha Pull) */}
      {showResult && lastPull && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '20px',
            maxWidth: '380px',
            width: '90%',
            border: `3px solid ${getRarityColor(lastPull.rarity)}`,
            animation: 'scaleIn 0.3s ease-out'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '15px' }}>
              <div style={{ fontSize: '48px', marginBottom: '8px' }}>
                {getRarityIcon(lastPull.rarity)}
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: getRarityColor(lastPull.rarity),
                marginBottom: '6px',
                textTransform: 'uppercase'
              }}>
                {lastPull.rarity}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#666',
                padding: '4px 12px',
                background: lastPull.type === 'normal' ? '#e1f5fe' : '#fce4ec',
                borderRadius: '15px',
                display: 'inline-block'
              }}>
                {lastPull.type === 'normal' ? '🎰 Normal Pool' : '🔥 Spicy Pool'}
              </div>
            </div>

            <div style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '15px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '32px', marginBottom: '6px' }}>📖</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                  {lastPull.title}
                </div>
                <div style={{ fontSize: '11px', color: '#666', lineHeight: '1.5' }}>
                  {lastPull.description}
                </div>
              </div>
              <div style={{
                background: 'white',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#e91e63', marginBottom: '3px' }}>
                  🎉 AU Book Unlocked!
                </div>
                <div style={{ fontSize: '10px', color: '#999' }}>
                  Click on the book in AU Collection to start reading snippets
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowResult(false)}
              style={{
                width: '100%',
                padding: '10px',
                background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ✨ Awesome!
            </button>
          </div>
        </div>
      )}

      {/* AU Book Detail Modal */}
      {showAUModal && selectedAU && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowAUModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '30px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              border: `5px solid ${getRarityColor(selectedAU.rarity)}`,
              animation: 'scaleIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '2px solid #fce4ec', paddingBottom: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📖</div>
              <div style={{
                fontSize: '11px',
                color: getRarityColor(selectedAU.rarity),
                textTransform: 'uppercase',
                fontWeight: '700',
                marginBottom: '8px'
              }}>
                {getRarityIcon(selectedAU.rarity)} {selectedAU.rarity}
              </div>
              <div style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#333',
                marginBottom: '8px'
              }}>
                {selectedAU.title}
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                {selectedAU.description}
              </div>
              <div style={{
                display: 'inline-block',
                background: '#f5f5f5',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#e91e63'
              }}>
                {(auProgress[selectedAU.id]?.revealedSnippets || []).length}/{selectedAU.snippets.length} Snippets Revealed
              </div>
            </div>

            {/* Snippets - Printer Style */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedAU.snippets.map((snippet, index) => {
                const progress = auProgress[selectedAU.id] || { revealedSnippets: [] };
                const isRevealed = progress.revealedSnippets.includes(index);
                const canReveal = index === 0 || progress.revealedSnippets.includes(index - 1);

                return (
                  <div
                    key={snippet.id}
                    style={{
                      background: isRevealed ? 'white' : '#f9f9f9',
                      border: `2px solid ${isRevealed ? '#e91e63' : '#e0e0e0'}`,
                      borderRadius: '12px',
                      padding: '15px',
                      position: 'relative'
                    }}
                  >
                    {/* Snippet Number */}
                    <div style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '15px',
                      background: isRevealed ? '#e91e63' : '#999',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '700'
                    }}>
                      #{snippet.id}
                    </div>

                    {isRevealed ? (
                      /* Revealed Snippet */
                      <div
                        style={{
                          fontSize: '14px',
                          lineHeight: '1.7',
                          color: '#333',
                          marginTop: '8px',
                          animation: 'textReveal 0.5s ease-out'
                        }}
                      >
                        {snippet.text}
                      </div>
                    ) : printingSnippet?.auId === selectedAU.id && printingSnippet?.snippetIndex === index ? (
                      /* Printing Animation - Multi-stage */
                      printingState === 'printing' ? (
                        /* Stage 1: Printing - Box fills white */
                        <div style={{ position: 'relative', minHeight: '120px', padding: '15px 0' }}>
                          {/* Printer icon at top */}
                          <div style={{
                            textAlign: 'center',
                            fontSize: '24px',
                            marginBottom: '10px',
                            animation: 'printerShake 0.3s infinite'
                          }}>
                            🖨️
                          </div>

                          {/* Empty box that fills with white + printing text inside */}
                          <div style={{
                            position: 'relative',
                            minHeight: '100px',
                            padding: '20px',
                            background: '#f9f9f9',
                            borderRadius: '8px',
                            border: '2px solid #e0e0e0',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {/* Printing text effect INSIDE the box */}
                            <div style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: '#4caf50',
                              animation: 'blink 0.3s infinite',
                              position: 'relative',
                              zIndex: 2
                            }}>
                              det det det... detttt...
                            </div>

                            {/* White fill that goes from top to bottom */}
                            <div style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '0%',
                              background: 'white',
                              animation: 'fillDown 2.5s ease-out forwards',
                              zIndex: 1
                            }} />
                          </div>
                        </div>
                      ) : printingState === 'finished' ? (
                        /* Stage 2: Finished printing! */
                        <div style={{
                          position: 'relative',
                          minHeight: '120px',
                          padding: '15px 0',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div style={{
                            fontSize: '28px',
                            marginBottom: '12px',
                            animation: 'celebrate 0.5s ease-out'
                          }}>
                            ✨
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: '700',
                            color: '#4caf50',
                            animation: 'fadeIn 0.3s ease-in'
                          }}>
                            Finished printing!
                          </div>
                        </div>
                      ) : null
                    ) : (
                      /* Locked Snippet */
                      <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: '32px', marginBottom: '10px' }}>🖨️</div>
                        <div style={{ fontSize: '14px', color: '#999', marginBottom: '15px' }}>
                          {canReveal ? '??? Click to print this snippet ???' : '🔒 Print previous snippets first'}
                        </div>
                        {canReveal && (
                          <button
                            onClick={() => {
                              if (printingSnippet) return; // Prevent multiple clicks during animation

                              setPrintingSnippet({ auId: selectedAU.id, snippetIndex: index });
                              setPrintingState('printing');

                              // After printing animation (2.5s), show "Finished printing!"
                              setTimeout(() => {
                                setPrintingState('finished');

                                // After "Finished printing!" (0.8s), reveal the text
                                setTimeout(() => {
                                  const success = revealSnippet(selectedAU.id, index, snippet.juiceCost);
                                  if (!success) {
                                    alert(`Not enough YuCash! You need ${snippet.juiceCost} YC to juice this snippet.`);
                                  }
                                  setPrintingSnippet(null);
                                  setPrintingState(null);
                                }, 800);
                              }, 2500); // Printer animation time
                            }}
                            disabled={printingSnippet?.auId === selectedAU.id && printingSnippet?.snippetIndex === index}
                            style={{
                              background: printingSnippet?.auId === selectedAU.id && printingSnippet?.snippetIndex === index
                                ? 'linear-gradient(135deg, #999 0%, #666 100%)'
                                : 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '12px 24px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: printingSnippet?.auId === selectedAU.id && printingSnippet?.snippetIndex === index ? 'not-allowed' : 'pointer',
                              boxShadow: '0 2px 8px rgba(76,175,80,0.3)',
                              transition: 'transform 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              if (!(printingSnippet?.auId === selectedAU.id && printingSnippet?.snippetIndex === index)) {
                                e.currentTarget.style.transform = 'scale(1.05)';
                              }
                            }}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                          >
                            {printingSnippet?.auId === selectedAU.id && printingSnippet?.snippetIndex === index
                              ? '🖨️ Printing...'
                              : `🖨️ Print Line (${snippet.juiceCost} YC)`}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowAUModal(false)}
              style={{
                width: '100%',
                padding: '15px',
                background: `linear-gradient(135deg, ${getRarityColor(selectedAU.rarity)} 0%, ${getRarityColor(selectedAU.rarity)}dd 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: '25px'
              }}
            >
              ✨ Close Book
            </button>
          </div>
        </div>
      )}

      {/* Card Detail Modal */}
      {showCardModal && selectedCard && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowCardModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '600px',
              width: '100%',
              border: `5px solid ${getRarityColor(selectedCard.rarity)}`,
              animation: 'scaleIn 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '25px' }}>
              <div style={{ fontSize: '72px', marginBottom: '15px' }}>🎴</div>
              <div style={{
                fontSize: '24px',
                fontWeight: '700',
                color: getRarityColor(selectedCard.rarity),
                marginBottom: '10px',
                textTransform: 'uppercase'
              }}>
                {selectedCard.rarity}
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '5px'
              }}>
                #{selectedCard.id} {selectedCard.title}
              </div>
            </div>

            <div style={{
              background: '#f5f5f5',
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '25px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.8',
                color: '#333',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedCard.text}
              </p>
            </div>

            <button
              onClick={() => setShowCardModal(false)}
              style={{
                width: '100%',
                padding: '15px',
                background: `linear-gradient(135deg, ${getRarityColor(selectedCard.rarity)} 0%, ${getRarityColor(selectedCard.rarity)}dd 100%)`,
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              ✨ Close
            </button>
          </div>
        </div>
      )}

      <div className="footer">
        <span>📖 unlock chapters • 🎰 pull gacha • 🎴 collect cards!</span>
      </div>

      <style>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fillDown {
          0% {
            height: 0%;
          }
          15% {
            height: 15%;
          }
          20% {
            height: 15%;
          }
          35% {
            height: 35%;
          }
          40% {
            height: 35%;
          }
          50% {
            height: 50%;
          }
          55% {
            height: 50%;
          }
          70% {
            height: 70%;
          }
          75% {
            height: 70%;
          }
          90% {
            height: 90%;
          }
          95% {
            height: 90%;
          }
          100% {
            height: 100%;
          }
        }

        @keyframes printerShake {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-2px);
          }
          75% {
            transform: translateY(2px);
          }
        }

        @keyframes blink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes celebrate {
          0% {
            transform: scale(0.5) rotate(0deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.3) rotate(180deg);
          }
          100% {
            transform: scale(1) rotate(360deg);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes textReveal {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      {/* Visual Novel Modal */}
      <VisualNovelModal
        isOpen={showVisualNovel}
        onClose={() => {
          setShowVisualNovel(false);
          setSelectedMilestone(null);
        }}
        scenes={selectedMilestone?.scenes || []}
        title={selectedMilestone?.title}
      />
    </div>
  );
}

export default Story;
