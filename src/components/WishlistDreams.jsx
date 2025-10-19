import { useState } from 'react';
import { useApp } from '../context/AppContext';

function WishlistDreams() {
  const {
    wishlistItems,
    addWishlistItem,
    deleteWishlistItem,
    buyWishlistItem,
    resistWishlistItem,
    postponeWishlistItem,
    convertWishlistToDream,
    dreamGoals,
    addDreamGoal,
    deleteDreamGoal,
    addDreamSavings,
    yuCash
  } = useApp();

  const [newWishlistItem, setNewWishlistItem] = useState({
    name: '',
    price: 0,
    url: ''
  });
  const [newDream, setNewDream] = useState({
    name: '',
    targetAmount: 0,
    targetDate: '',
    imageUrl: ''
  });
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [showDreamPopup, setShowDreamPopup] = useState(false);
  const [postponedItem, setPostponedItem] = useState(null);

  const handleBuyItem = (item) => {
    const result = buyWishlistItem(item.id);
    if (result.success) {
      setFeedbackMessage({ type: 'success', text: result.message });
      setTimeout(() => setFeedbackMessage(null), 3000);
    } else {
      setFeedbackMessage({ type: 'error', text: result.message });
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleResistItem = (item) => {
    const result = resistWishlistItem(item.id);
    if (result.success) {
      setFeedbackMessage({ type: 'resist', text: result.message });
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  const handleMaybeLater = (item) => {
    setPostponedItem(item);
    setShowDreamPopup(true);
  };

  const handleConvertToDream = () => {
    if (!postponedItem) return;

    // Calculate target date (3 months from now as default)
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 3);

    const result = convertWishlistToDream(postponedItem.id, targetDate.toISOString().split('T')[0]);

    if (result.success) {
      setFeedbackMessage({ type: 'success', text: `Moved to Dream Planner! 🌟` });
      setTimeout(() => setFeedbackMessage(null), 3000);
    }

    setShowDreamPopup(false);
    setPostponedItem(null);
  };

  const handleJustPostpone = () => {
    if (!postponedItem) return;

    postponeWishlistItem(postponedItem.id);
    setFeedbackMessage({ type: 'info', text: `Saved for later! 📌` });
    setTimeout(() => setFeedbackMessage(null), 3000);

    setShowDreamPopup(false);
    setPostponedItem(null);
  };

  // Calculate total wishlist value
  const totalWishlistValue = wishlistItems
    .filter(item => !item.purchased)
    .reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ padding: '20px' }}>
      {/* Feedback Message */}
      {feedbackMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '15px 25px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          zIndex: 9999,
          background: feedbackMessage.type === 'error' ? '#ff5252' :
                     feedbackMessage.type === 'resist' ? '#7c4dff' :
                     feedbackMessage.type === 'info' ? '#ff9800' : '#4caf50',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          animation: 'slideDown 0.3s ease'
        }}>
          {feedbackMessage.text}
        </div>
      )}

      {/* Dream Planner Conversion Popup */}
      {showDreamPopup && postponedItem && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #fff9e6 0%, #ffe0b2 100%)',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '400px',
            border: '3px solid #ffb74d',
            position: 'relative',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}>
            {/* Cute header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🌟</div>
              <h3 style={{ fontSize: '20px', color: '#f57c00', margin: '0 0 10px 0' }}>
                Hmm, thinking long-term?
              </h3>
              <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>
                "{postponedItem.name}" costs {postponedItem.price.toLocaleString()}₩
              </p>
            </div>

            {/* Question */}
            <div style={{
              background: 'white',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '14px', color: '#333', fontWeight: 600, margin: '0 0 8px 0' }}>
                Want to make this a Dream Goal?
              </p>
              <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>
                It'll move to Dream Planner with progress tracking!
              </p>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleConvertToDream}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f57c00',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#e65100'}
                onMouseOut={(e) => e.target.style.background = '#f57c00'}
              >
                ✨ Ye! Make it a Dream!
              </button>
              <button
                onClick={handleJustPostpone}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#90a4ae',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#78909c'}
                onMouseOut={(e) => e.target.style.background = '#90a4ae'}
              >
                Nah, just save it
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                setShowDreamPopup(false);
                setPostponedItem(null);
              }}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'transparent',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#999',
                padding: '5px'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Wishlist Section */}
      <div style={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
        border: '3px solid #90caf9',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div>
            <h3 style={{ fontSize: '18px', color: '#1976d2', margin: '0 0 5px 0' }}>
              🛍️ Wishlist (Short-term Wants)
            </h3>
            <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
              Buy items or resist temptation for bonus EXP! Current balance: {yuCash.toLocaleString()} ₩
            </p>
          </div>
          {totalWishlistValue > yuCash && totalWishlistValue > 0 && (
            <div style={{
              background: '#fff3e0',
              border: '2px solid #ff9800',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px',
              color: '#e65100',
              fontWeight: 600
            }}>
              ⚠️ Wishlist total ({totalWishlistValue.toLocaleString()} ₩) exceeds budget!
            </div>
          )}
        </div>

        {/* Wishlist Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
          {wishlistItems.filter(item => !item.purchased).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999', fontStyle: 'italic' }}>
              No wishlist items yet! Add something you want below.
            </div>
          ) : (
            wishlistItems.filter(item => !item.purchased).map(item => (
              <div key={item.id} style={{
                background: 'white',
                padding: '12px 15px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#333', marginBottom: '3px' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {item.price.toLocaleString()} ₩
                    {item.url && (
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '10px', color: '#1976d2' }}>
                        🔗 Link
                      </a>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleBuyItem(item)}
                  style={{
                    padding: '6px 12px',
                    background: item.price > yuCash ? '#cccccc' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: item.price > yuCash ? 'not-allowed' : 'pointer',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                  disabled={item.price > yuCash}
                >
                  💰 Buy It
                </button>
                <button
                  onClick={() => handleResistItem(item)}
                  style={{
                    padding: '6px 12px',
                    background: '#7c4dff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  💪 Resist!
                </button>
                <button
                  onClick={() => handleMaybeLater(item)}
                  style={{
                    padding: '6px 12px',
                    background: '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 600
                  }}
                >
                  📌 Later
                </button>
                <button
                  onClick={() => deleteWishlistItem(item.id)}
                  style={{
                    padding: '6px 12px',
                    background: '#ff5252',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add New Wishlist Item */}
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '4px' }}>Item Name</label>
            <input
              type="text"
              value={newWishlistItem.name}
              onChange={(e) => setNewWishlistItem({ ...newWishlistItem, name: e.target.value })}
              placeholder="e.g., New headphones"
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '4px' }}>Price (₩)</label>
            <input
              type="number"
              value={newWishlistItem.price}
              onChange={(e) => setNewWishlistItem({ ...newWishlistItem, price: Number(e.target.value) })}
              placeholder="0"
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '4px' }}>URL (optional)</label>
            <input
              type="text"
              value={newWishlistItem.url}
              onChange={(e) => setNewWishlistItem({ ...newWishlistItem, url: e.target.value })}
              placeholder="https://..."
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            />
          </div>
          <button
            onClick={() => {
              if (newWishlistItem.name && newWishlistItem.price > 0) {
                addWishlistItem(newWishlistItem);
                setNewWishlistItem({ name: '', price: 0, url: '' });
              }
            }}
            style={{
              padding: '8px 16px',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            ➕ Add
          </button>
        </div>

        {/* Maybe Later Section (Collapsed) */}
        {wishlistItems.filter(item => item.purchased && item.action === 'postponed').length > 0 && (
          <details style={{ marginTop: '15px' }}>
            <summary style={{
              cursor: 'pointer',
              fontSize: '13px',
              color: '#ff9800',
              fontWeight: 600,
              padding: '10px',
              background: 'linear-gradient(90deg, #fff3e0 0%, transparent 100%)',
              borderRadius: '6px',
              borderLeft: '4px solid #ff9800'
            }}>
              📌 Maybe Later ({wishlistItems.filter(item => item.purchased && item.action === 'postponed').length})
            </summary>
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {wishlistItems.filter(item => item.purchased && item.action === 'postponed').map(item => (
                <div key={item.id} style={{
                  background: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '2px solid #ff9800',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Decorative bar on the left */}
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: 'linear-gradient(180deg, #ff9800 0%, #ffb74d 100%)'
                  }} />

                  <div style={{ marginLeft: '8px', flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '4px' }}>
                      📌 {item.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#999' }}>
                      {item.price.toLocaleString()} ₩ · <span style={{ color: '#ff9800', fontWeight: 600 }}>Saved for later</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteWishlistItem(item.id)}
                    style={{
                      padding: '4px 8px',
                      background: '#e0e0e0',
                      color: '#666',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => { e.target.style.background = '#ff5252'; e.target.style.color = 'white'; }}
                    onMouseOut={(e) => { e.target.style.background = '#e0e0e0'; e.target.style.color = '#666'; }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Completed Actions (Collapsed) */}
        {wishlistItems.filter(item => item.purchased && item.action !== 'postponed').length > 0 && (
          <details style={{ marginTop: '15px' }}>
            <summary style={{
              cursor: 'pointer',
              fontSize: '13px',
              color: '#666',
              fontWeight: 600,
              padding: '10px',
              background: 'linear-gradient(90deg, #f5f5f5 0%, transparent 100%)',
              borderRadius: '6px',
              borderLeft: '4px solid #999'
            }}>
              ✓ Completed Actions ({wishlistItems.filter(item => item.purchased && item.action !== 'postponed').length})
            </summary>
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {wishlistItems.filter(item => item.purchased && item.action !== 'postponed').map(item => {
                const isResisted = item.action === 'resisted';
                const isBought = item.action === 'bought';

                return (
                  <div key={item.id} style={{
                    background: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: isResisted ? '2px solid #7c4dff' : '2px solid #e0e0e0',
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: isBought ? 0.7 : 1
                  }}>
                    {/* Decorative bar on the left */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      background: isResisted
                        ? 'linear-gradient(180deg, #7c4dff 0%, #b388ff 100%)'
                        : 'linear-gradient(180deg, #4caf50 0%, #81c784 100%)'
                    }} />

                    <div style={{ marginLeft: '8px', flex: 1 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#333',
                        marginBottom: '4px',
                        textDecoration: isBought ? 'line-through' : 'none'
                      }}>
                        {isResisted ? '💪' : '💰'} {item.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#999' }}>
                        {item.price.toLocaleString()} ₩ ·
                        <span style={{
                          color: isResisted ? '#7c4dff' : '#4caf50',
                          fontWeight: 600,
                          marginLeft: '4px'
                        }}>
                          {isResisted ? 'Resisted!' : 'Bought'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteWishlistItem(item.id)}
                      style={{
                        padding: '4px 8px',
                        background: '#e0e0e0',
                        color: '#666',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => { e.target.style.background = '#ff5252'; e.target.style.color = 'white'; }}
                      onMouseOut={(e) => { e.target.style.background = '#e0e0e0'; e.target.style.color = '#666'; }}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </details>
        )}
      </div>

      {/* Dream Planner Section */}
      <div style={{
        background: 'linear-gradient(135deg, #fff4e6 0%, #ffe0b2 100%)',
        border: '3px solid #ffb74d',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <h3 style={{ fontSize: '18px', color: '#f57c00', margin: '0 0 15px 0' }}>
          ✨ Dream Planner (Long-term Goals)
        </h3>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
          Plan and track your long-term financial goals ($1000+) like buying a house, traveling the world, or starting a business!
        </p>

        {/* Dream Goals List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '15px' }}>
          {dreamGoals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999', fontStyle: 'italic' }}>
              No dream goals yet! Add your first big dream below.
            </div>
          ) : (
            dreamGoals.map(dream => {
              const progress = (dream.currentSavings / dream.targetAmount) * 100;
              const daysRemaining = Math.ceil((new Date(dream.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
              const monthsRemaining = Math.max(0, Math.ceil(daysRemaining / 30));
              const amountRemaining = dream.targetAmount - dream.currentSavings;
              const neededPerMonth = monthsRemaining > 0 ? Math.ceil(amountRemaining / monthsRemaining) : amountRemaining;

              return (
                <div key={dream.id} style={{
                  background: 'white',
                  padding: '15px',
                  borderRadius: '8px',
                  border: progress >= 100 ? '2px solid #4caf50' : '2px solid #e0e0e0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '16px', color: '#333', marginBottom: '5px' }}>
                        {dream.name}
                        {progress >= 100 && <span style={{ marginLeft: '10px' }}>🎉</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        Target: {dream.targetAmount.toLocaleString()} ₩ by {new Date(dream.targetDate).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteDreamGoal(dream.id)}
                      style={{
                        padding: '4px 8px',
                        background: '#ff5252',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                      <span>Saved: {dream.currentSavings.toLocaleString()} ₩</span>
                      <span>{Math.min(progress, 100).toFixed(0)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: '#e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(progress, 100)}%`,
                        height: '100%',
                        background: progress >= 100 ? '#4caf50' : progress >= 75 ? '#8bc34a' : progress >= 50 ? '#ffa726' : '#ff9800',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#999' }}>Remaining</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#333' }}>
                        {amountRemaining.toLocaleString()} ₩
                      </div>
                    </div>
                    <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#999' }}>Months Left</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: daysRemaining < 0 ? '#ff5252' : '#333' }}>
                        {daysRemaining < 0 ? 'Overdue!' : `${monthsRemaining}m`}
                      </div>
                    </div>
                    <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#999' }}>Need/Month</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#f57c00' }}>
                        {neededPerMonth.toLocaleString()} ₩
                      </div>
                    </div>
                  </div>

                  {/* Add Savings Button */}
                  {progress < 100 && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input
                        type="number"
                        placeholder="Amount to add..."
                        id={`savings-input-${dream.id}`}
                        style={{
                          flex: 1,
                          padding: '8px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}
                      />
                      <button
                        onClick={() => {
                          const input = document.getElementById(`savings-input-${dream.id}`);
                          const amount = Number(input.value);
                          if (amount > 0) {
                            addDreamSavings(dream.id, amount);
                            input.value = '';
                          }
                        }}
                        style={{
                          padding: '8px 16px',
                          background: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        💰 Add Savings
                      </button>
                    </div>
                  )}

                  {/* Milestone Celebrations */}
                  {progress >= 100 && (
                    <div style={{
                      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
                      padding: '10px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#2e7d32'
                    }}>
                      🎉 Goal Achieved! You did it! 🎉
                    </div>
                  )}
                  {progress >= 75 && progress < 100 && (
                    <div style={{
                      background: '#fff9c4',
                      padding: '8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: '#f57f17'
                    }}>
                      🌟 75% milestone! Almost there!
                    </div>
                  )}
                  {progress >= 50 && progress < 75 && (
                    <div style={{
                      background: '#ffe0b2',
                      padding: '8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: '#e65100'
                    }}>
                      🔥 Halfway there! Keep going!
                    </div>
                  )}
                  {progress >= 25 && progress < 50 && (
                    <div style={{
                      background: '#ffccbc',
                      padding: '8px',
                      borderRadius: '6px',
                      textAlign: 'center',
                      fontSize: '12px',
                      color: '#bf360c'
                    }}>
                      💪 25% done! Great start!
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Add New Dream Goal */}
        <div style={{ background: 'white', padding: '15px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '10px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '4px' }}>Dream Goal Name</label>
            <input
              type="text"
              value={newDream.name}
              onChange={(e) => setNewDream({ ...newDream, name: e.target.value })}
              placeholder="e.g., Buy a house"
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '4px' }}>Target (₩)</label>
            <input
              type="number"
              value={newDream.targetAmount}
              onChange={(e) => setNewDream({ ...newDream, targetAmount: Number(e.target.value) })}
              placeholder="0"
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '4px' }}>Target Date</label>
            <input
              type="date"
              value={newDream.targetDate}
              onChange={(e) => setNewDream({ ...newDream, targetDate: e.target.value })}
              style={{
                width: '100%',
                padding: '8px',
                border: '2px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '13px'
              }}
            />
          </div>
          <button
            onClick={() => {
              if (newDream.name && newDream.targetAmount > 0 && newDream.targetDate) {
                addDreamGoal(newDream);
                setNewDream({ name: '', targetAmount: 0, targetDate: '', imageUrl: '' });
              }
            }}
            style={{
              padding: '8px 16px',
              background: '#f57c00',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            ✨ Add Dream
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistDreams;
