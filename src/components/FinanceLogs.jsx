import { useState } from 'react';
import { useApp } from '../context/AppContext';
import InfoPopup from './InfoPopup';

function FinanceLogs({ energyLevel }) {
  const { getTasksByType, addTask, deleteTask, updateTask, completeTask, minkyuMode, setMinkyuMode } = useApp();

  // State declarations FIRST
  const [newLog, setNewLog] = useState({
    text: '',
    amount: '',
    deadline: new Date().toISOString().split('T')[0], // Today's date
    taskType: 'finance',
    energy: 'low',
    financeType: 'outcome',
    financeCategory: 'food-beverages',
    currency: 'KRW',
    currencySymbol: '₩',
  });

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [currencySearch, setCurrencySearch] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState('KRW');
  const [defaultCurrencySymbol, setDefaultCurrencySymbol] = useState('₩');
  const [currencyFilter, setCurrencyFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editLog, setEditLog] = useState(null);

  // NOW we can use the state variables
  const allFinanceLogs = getTasksByType('finance');

  // Filter by currency
  const financeLogs = currencyFilter === 'all'
    ? allFinanceLogs
    : allFinanceLogs.filter(log => log.currency === currencyFilter);

  // Get unique currencies from all logs
  const uniqueCurrencies = [...new Set(allFinanceLogs.map(log => log.currency).filter(Boolean))];

  // Popular currencies (shown in dropdown)
  const popularCurrencies = [
    { value: 'KRW', label: 'KRW (South Korean Won)', symbol: '₩', flag: '🇰🇷' },
    { value: 'USD', label: 'USD (US Dollar)', symbol: '$', flag: '🇺🇸' },
    { value: 'EUR', label: 'EUR (Euro)', symbol: '€', flag: '🇪🇺' },
    { value: 'GBP', label: 'GBP (British Pound)', symbol: '£', flag: '🇬🇧' },
    { value: 'JPY', label: 'JPY (Japanese Yen)', symbol: '¥', flag: '🇯🇵' },
    { value: 'CNY', label: 'CNY (Chinese Yuan)', symbol: '¥', flag: '🇨🇳' },
    { value: 'AUD', label: 'AUD (Australian Dollar)', symbol: '$', flag: '🇦🇺' },
    { value: 'CAD', label: 'CAD (Canadian Dollar)', symbol: '$', flag: '🇨🇦' }
  ];

  // Full currency list (for modal)
  const allCurrencies = [
    // Popular (same as above)
    ...popularCurrencies,
    // Asia Pacific
    { value: 'HKD', label: 'HKD (Hong Kong Dollar)', symbol: '$', flag: '🇭🇰' },
    { value: 'SGD', label: 'SGD (Singapore Dollar)', symbol: '$', flag: '🇸🇬' },
    { value: 'TWD', label: 'TWD (Taiwan Dollar)', symbol: 'NT$', flag: '🇹🇼' },
    { value: 'THB', label: 'THB (Thai Baht)', symbol: '฿', flag: '🇹🇭' },
    { value: 'PHP', label: 'PHP (Philippine Peso)', symbol: '₱', flag: '🇵🇭' },
    { value: 'MYR', label: 'MYR (Malaysian Ringgit)', symbol: 'RM', flag: '🇲🇾' },
    { value: 'IDR', label: 'IDR (Indonesian Rupiah)', symbol: 'Rp', flag: '🇮🇩' },
    { value: 'VND', label: 'VND (Vietnamese Dong)', symbol: '₫', flag: '🇻🇳' },
    { value: 'INR', label: 'INR (Indian Rupee)', symbol: '₹', flag: '🇮🇳' },
    { value: 'PKR', label: 'PKR (Pakistani Rupee)', symbol: '₨', flag: '🇵🇰' },
    { value: 'BDT', label: 'BDT (Bangladeshi Taka)', symbol: '৳', flag: '🇧🇩' },
    { value: 'LKR', label: 'LKR (Sri Lankan Rupee)', symbol: 'Rs', flag: '🇱🇰' },
    { value: 'NPR', label: 'NPR (Nepalese Rupee)', symbol: 'Rs', flag: '🇳🇵' },
    { value: 'NZD', label: 'NZD (New Zealand Dollar)', symbol: '$', flag: '🇳🇿' },
    // Middle East
    { value: 'AED', label: 'AED (UAE Dirham)', symbol: 'د.إ', flag: '🇦🇪' },
    { value: 'SAR', label: 'SAR (Saudi Riyal)', symbol: 'ر.س', flag: '🇸🇦' },
    { value: 'ILS', label: 'ILS (Israeli Shekel)', symbol: '₪', flag: '🇮🇱' },
    { value: 'TRY', label: 'TRY (Turkish Lira)', symbol: '₺', flag: '🇹🇷' },
    { value: 'QAR', label: 'QAR (Qatari Riyal)', symbol: 'ر.ق', flag: '🇶🇦' },
    { value: 'KWD', label: 'KWD (Kuwaiti Dinar)', symbol: 'د.ك', flag: '🇰🇼' },
    { value: 'BHD', label: 'BHD (Bahraini Dinar)', symbol: 'د.ب', flag: '🇧🇭' },
    { value: 'OMR', label: 'OMR (Omani Rial)', symbol: 'ر.ع.', flag: '🇴🇲' },
    { value: 'JOD', label: 'JOD (Jordanian Dinar)', symbol: 'د.ا', flag: '🇯🇴' },
    // Europe
    { value: 'CHF', label: 'CHF (Swiss Franc)', symbol: 'Fr.', flag: '🇨🇭' },
    { value: 'SEK', label: 'SEK (Swedish Krona)', symbol: 'kr', flag: '🇸🇪' },
    { value: 'NOK', label: 'NOK (Norwegian Krone)', symbol: 'kr', flag: '🇳🇴' },
    { value: 'DKK', label: 'DKK (Danish Krone)', symbol: 'kr', flag: '🇩🇰' },
    { value: 'PLN', label: 'PLN (Polish Zloty)', symbol: 'zł', flag: '🇵🇱' },
    { value: 'CZK', label: 'CZK (Czech Koruna)', symbol: 'Kč', flag: '🇨🇿' },
    { value: 'HUF', label: 'HUF (Hungarian Forint)', symbol: 'Ft', flag: '🇭🇺' },
    { value: 'RON', label: 'RON (Romanian Leu)', symbol: 'lei', flag: '🇷🇴' },
    { value: 'BGN', label: 'BGN (Bulgarian Lev)', symbol: 'лв', flag: '🇧🇬' },
    { value: 'HRK', label: 'HRK (Croatian Kuna)', symbol: 'kn', flag: '🇭🇷' },
    { value: 'RUB', label: 'RUB (Russian Ruble)', symbol: '₽', flag: '🇷🇺' },
    { value: 'UAH', label: 'UAH (Ukrainian Hryvnia)', symbol: '₴', flag: '🇺🇦' },
    // Americas
    { value: 'MXN', label: 'MXN (Mexican Peso)', symbol: '$', flag: '🇲🇽' },
    { value: 'BRL', label: 'BRL (Brazilian Real)', symbol: 'R$', flag: '🇧🇷' },
    { value: 'ARS', label: 'ARS (Argentine Peso)', symbol: '$', flag: '🇦🇷' },
    { value: 'CLP', label: 'CLP (Chilean Peso)', symbol: '$', flag: '🇨🇱' },
    { value: 'COP', label: 'COP (Colombian Peso)', symbol: '$', flag: '🇨🇴' },
    { value: 'PEN', label: 'PEN (Peruvian Sol)', symbol: 'S/', flag: '🇵🇪' },
    // Africa
    { value: 'ZAR', label: 'ZAR (South African Rand)', symbol: 'R', flag: '🇿🇦' },
    { value: 'EGP', label: 'EGP (Egyptian Pound)', symbol: 'ج.م', flag: '🇪🇬' },
    { value: 'NGN', label: 'NGN (Nigerian Naira)', symbol: '₦', flag: '🇳🇬' },
    { value: 'KES', label: 'KES (Kenyan Shilling)', symbol: 'Sh', flag: '🇰🇪' },
    { value: 'MAD', label: 'MAD (Moroccan Dirham)', symbol: 'د.م.', flag: '🇲🇦' }
  ];

  const financeCategories = {
    income: [
      { value: 'salary', label: '💼 Salary' },
      { value: 'freelance', label: '💻 Freelance' },
      { value: 'gift', label: '🎁 Gift' },
      { value: 'other-income', label: '➕ Other Income' }
    ],
    outcome: [
      { value: 'food-beverages', label: '🍔 Food & Beverages' },
      { value: 'life', label: '🏠 Life (Bills, Rent)' },
      { value: 'pets', label: '🐾 Pets' },
      { value: 'fun-games', label: '🎮 Fun & Games' },
      { value: 'gacha', label: '🎰 Gacha & Gambling' },
      { value: 'impulse', label: '💸 Impulse Buy' },
      { value: 'transport', label: '🚗 Transport' },
      { value: 'other-outcome', label: '➖ Other Outcome' }
    ]
  };

  const handleAddLog = () => {
    if (newLog.text.trim() && newLog.amount) {
      const amountValue = parseFloat(newLog.amount);
      // Make outcome amounts negative, keep income positive
      const finalAmount = newLog.financeType === 'outcome' ? -Math.abs(amountValue) : Math.abs(amountValue);

      addTask({
        ...newLog,
        amount: finalAmount,
        category: 'business',
        currency: defaultCurrency,
        currencySymbol: defaultCurrencySymbol,
      });
      setNewLog({
        text: '',
        amount: '',
        deadline: new Date().toISOString().split('T')[0],
        taskType: 'finance',
        energy: 'low',
        financeType: 'outcome',
        financeCategory: 'food-beverages',
        currency: defaultCurrency,
        currencySymbol: defaultCurrencySymbol,
      });
    }
  };

  const handleRecordAll = () => {
    financeLogs.forEach(log => {
      completeTask(log.id);
    });
  };

  const handleEdit = (log) => {
    setEditingId(log.id);
    setEditLog({ ...log });
  };

  const handleSaveEdit = () => {
    if (editLog && editingId) {
      // Make sure the amount sign matches the finance type
      const correctedAmount = editLog.financeType === 'outcome'
        ? -Math.abs(editLog.amount)
        : Math.abs(editLog.amount);

      updateTask(editingId, { ...editLog, amount: correctedAmount });
      setEditingId(null);
      setEditLog(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditLog(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddLog();
    }
  };

  const getCategoryLabel = (type, category) => {
    const categories = financeCategories[type] || [];
    const found = categories.find(c => c.value === category);
    return found ? found.label : category;
  };

  // Get the current selected currency object
  const getSelectedCurrencyDisplay = () => {
    const curr = allCurrencies.find(c => c.value === newLog.currency);
    return curr ? `${curr.flag} ${curr.value}` : newLog.currency;
  };

  const modes = [
    { value: 'normal', label: '🏠 Normal', desc: 'Track both income & spending' },
    { value: 'no-buy', label: '🚫 No-Buy Challenge', desc: 'Avoid spending this month' },
    { value: 'jobless', label: '💼 Jobless/Break', desc: 'Track expenses only (no income expected)' },
    { value: 'saving', label: '💰 Saving Goal', desc: 'Focus on income & minimizing spending' }
  ];

  const currentMode = modes.find(m => m.value === minkyuMode) || modes[0];

  return (
    <div className="task-section section-finance" style={{ marginBottom: '30px' }}>

      {/* Soft separator above header */}
      <div style={{
        height: '2px',
        background: 'linear-gradient(90deg, transparent 0%, #e0e0e0 10%, #e0e0e0 90%, transparent 100%)',
        backgroundSize: '12px 2px',
        marginBottom: '15px',
        opacity: 0.6
      }} />

      <div style={{
        display: 'inline-flex',
        alignItems: 'stretch',
        marginBottom: '0px',
        marginLeft: '50px',
        borderRadius: '8px 8px 0 0',
        overflow: 'hidden',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '60px',
          background: '#00897b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <img src="/images/Minkyu_1.png" alt="Minkyu" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'contain' }} />
        </div>
        <div style={{ padding: '12px 20px', background: '#e0f2f1' }}>
          {/* Row 1: Title and Currency Settings */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '18px', color: '#00897b', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                💰 Finance Logs (Draft)
                <InfoPopup
                  title="📝 Finance Draft System"
                  content={
                    <>
                      <p style={{ marginBottom: '8px' }}><strong>How it works:</strong></p>
                      <p style={{ marginBottom: '8px' }}>• Add expenses/income here as <strong>drafts</strong></p>
                      <p style={{ marginBottom: '8px' }}>• Drafts are <strong>NOT permanent</strong> - edit/delete anytime</p>
                      <p style={{ marginBottom: '8px' }}>• Click "📋 Record" to move to Record tab</p>
                      <p style={{ marginBottom: '0' }}>• Recording gives Minkyu <strong>EXP points!</strong> 💪</p>
                    </>
                  }
                />
              </h3>
              <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>Track expenses & income, then record them!</p>
            </div>

            {/* Currency Settings Cogwheel - Just Icon */}
            <button
              onClick={() => setShowCurrencyModal(true)}
              title={`Default currency: ${allCurrencies.find(c => c.value === defaultCurrency)?.flag || '💱'} ${defaultCurrency}`}
              style={{
                padding: '8px 12px',
                background: '#00897b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = '#00695c'}
              onMouseOut={(e) => e.currentTarget.style.background = '#00897b'}
            >
              ⚙️
            </button>
          </div>

          {/* Row 2: Minkyu Life Mode Selector */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#00695c', fontWeight: '600' }}>Mode:</span>
            {modes.map(mode => (
              <button
                key={mode.value}
                onClick={() => setMinkyuMode(mode.value)}
                title={mode.desc}
                style={{
                  padding: '6px 12px',
                  background: minkyuMode === mode.value
                    ? 'linear-gradient(135deg, #00897b 0%, #00695c 100%)'
                    : 'white',
                  color: minkyuMode === mode.value ? 'white' : '#00897b',
                  border: `2px solid ${minkyuMode === mode.value ? '#00695c' : '#00897b'}`,
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: minkyuMode === mode.value
                    ? '0 2px 8px rgba(0, 137, 123, 0.4)'
                    : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Soft dashed separator between header and table */}
      <div style={{
        height: '1px',
        background: 'repeating-linear-gradient(90deg, #00897b 0px, #00897b 8px, transparent 8px, transparent 16px)',
        marginLeft: '50px',
        marginRight: '0px',
        opacity: 0.3
      }} />

      <div className="tasks-table finance-logs-table">
        <div className="table-header">
          <div className="col-task">Description</div>
          <div className="col-deadline">Date</div>
          <div className="col-deadline">Category</div>
          <div className="col-deadline">Amount</div>
          <div className="col-check">Log!</div>
          <div className="col-actions">Settings</div>
        </div>

        <div className="table-body">
          {financeLogs.length === 0 ? (
            <div className="empty-state">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <img
                  src="/images/cat_finance1.png"
                  alt="Cat finance"
                  style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                />
                <p>No finance logs yet! Add expenses or income below.</p>
              </div>
            </div>
          ) : (
            <>
              {financeLogs.map(log => (
              <div key={log.id} className="task-row">
                {editingId === log.id ? (
                  // EDIT MODE
                  <>
                    <div className="col-task">
                      <input
                        type="text"
                        value={editLog.text}
                        onChange={(e) => setEditLog({ ...editLog, text: e.target.value })}
                        style={{ width: '100%', padding: '6px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    </div>
                    <div className="col-deadline">
                      <input
                        type="date"
                        value={editLog.deadline}
                        onChange={(e) => setEditLog({ ...editLog, deadline: e.target.value })}
                        style={{ width: '100%', padding: '6px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                      />
                    </div>
                    <div className="col-deadline">
                      <select
                        value={editLog.financeCategory}
                        onChange={(e) => setEditLog({ ...editLog, financeCategory: e.target.value })}
                        style={{ width: '100%', padding: '6px', fontSize: '12px', border: '1px solid #ddd', borderRadius: '4px' }}
                      >
                        {financeCategories[editLog.financeType || 'outcome'].map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-deadline">
                      <input
                        type="number"
                        value={editLog.amount}
                        onChange={(e) => setEditLog({ ...editLog, amount: parseFloat(e.target.value) })}
                        style={{ width: '80px', padding: '6px', fontSize: '13px', border: '1px solid #ddd', borderRadius: '4px', fontWeight: 600 }}
                      />
                    </div>
                    <div className="col-check">
                      <button className="done-btn task-btn" onClick={handleSaveEdit} style={{ background: '#4caf50' }}>
                        ✓
                      </button>
                    </div>
                    <div className="col-actions">
                      <button className="delete-btn task-btn" onClick={handleCancelEdit}>
                        ✕
                      </button>
                    </div>
                  </>
                ) : (
                  // VIEW MODE
                  <>
                    <div className="col-task">
                      <span className="task-text">{log.text}</span>
                    </div>
                    <div className="col-deadline" style={{ fontSize: '12px', color: '#666' }}>
                      {log.deadline || 'No date'}
                    </div>
                    <div className="col-deadline" style={{ fontSize: '12px', color: '#666' }}>
                      {getCategoryLabel(log.financeType || 'outcome', log.financeCategory || 'other-outcome')}
                    </div>
                    <div className="col-deadline" style={{ fontSize: '16px', fontWeight: '700', color: log.amount > 0 ? '#4caf50' : '#ff5252' }}>
                      {log.currencySymbol || '₩'} {log.amount > 0 ? '+' : ''}{Math.round(log.amount)}
                    </div>
                    <div className="col-check">
                      <button className="done-btn task-btn" onClick={() => completeTask(log.id)}>
                        📋
                      </button>
                    </div>
                    <div className="col-actions">
                      <button className="edit-btn task-btn" onClick={() => handleEdit(log)}>
                        ✏️
                      </button>
                      <button className="delete-btn task-btn" onClick={() => deleteTask(log.id)}>
                        ✕
                      </button>
                    </div>
                  </>
                )}
              </div>
              ))}

              {/* Cat at bottom based on progress */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
                borderTop: '2px dashed #e0e0e0'
              }}>
                <img
                  src={
                    financeLogs.length === 0 ? '/images/cat_finance1.png' :
                    financeLogs.length <= 5 ? '/images/cat_finance2.png' :
                    '/images/cat_finance3.png'
                  }
                  alt="Cat"
                  style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                />
              </div>
            </>
          )}
        </div>

        {/* Action Bar - Like invoice totals */}
        {financeLogs.length > 0 && (
          <div style={{
            marginTop: '15px',
            padding: '15px 20px',
            background: '#f5f5f5',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '20px'
          }}>
            <div style={{ fontSize: '14px', color: '#666', fontWeight: 600 }}>
              Record now?
            </div>
            <button
              onClick={handleRecordAll}
              style={{
                padding: '10px 24px',
                background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(76, 175, 80, 0.4)',
              }}
            >
              📋 Record All ({financeLogs.length})
            </button>
          </div>
        )}

        {/* Currency Filter Tags */}
        {uniqueCurrencies.length > 0 && (
          <div style={{
            marginTop: '15px',
            padding: '12px 15px',
            background: '#f9f9f9',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>Filter by currency:</span>
            <button
              onClick={() => setCurrencyFilter('all')}
              style={{
                padding: '6px 12px',
                background: currencyFilter === 'all' ? '#00897b' : 'white',
                color: currencyFilter === 'all' ? 'white' : '#666',
                border: `2px solid ${currencyFilter === 'all' ? '#00897b' : '#e0e0e0'}`,
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              All ({allFinanceLogs.length})
            </button>
            {uniqueCurrencies.map(curr => {
              const currObj = allCurrencies.find(c => c.value === curr);
              const count = allFinanceLogs.filter(log => log.currency === curr).length;
              return (
                <button
                  key={curr}
                  onClick={() => setCurrencyFilter(curr)}
                  style={{
                    padding: '6px 12px',
                    background: currencyFilter === curr ? '#00897b' : 'white',
                    color: currencyFilter === curr ? 'white' : '#666',
                    border: `2px solid ${currencyFilter === curr ? '#00897b' : '#e0e0e0'}`,
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{currObj?.flag || '💱'}</span>
                  <span>{curr}</span>
                  <span style={{ opacity: 0.7 }}>({count})</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Soft separator before add row */}
        {uniqueCurrencies.length > 0 && (
          <div style={{
            height: '1px',
            background: 'repeating-linear-gradient(90deg, #e0e0e0 0px, #e0e0e0 6px, transparent 6px, transparent 12px)',
            marginTop: '15px',
            marginBottom: '0px',
            opacity: 0.5
          }} />
        )}

        {/* Quick Add Row - Currency removed, HUGE amount field! */}
        <div className="quick-add-row" style={{ display: 'grid', gridTemplateColumns: '50px 2fr 0.9fr 1.3fr 2fr auto', gap: '12px', alignItems: 'center', marginTop: '15px' }}>
          {/* Income/Outcome Dropdown - Better Icons */}
          <select
            value={newLog.financeType}
            onChange={(e) => setNewLog({
              ...newLog,
              financeType: e.target.value,
              financeCategory: e.target.value === 'income' ? 'salary' : 'food-beverages'
            })}
            title={newLog.financeType === 'income' ? 'Income' : 'Outcome'}
            style={{
              padding: '8px 5px',
              borderRadius: '6px',
              border: `2px solid ${newLog.financeType === 'income' ? '#4caf50' : '#ff5252'}`,
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: newLog.financeType === 'income' ? '#e8f5e9' : '#ffebee',
              color: newLog.financeType === 'income' ? '#2e7d32' : '#c62828',
              cursor: 'pointer',
              textAlign: 'center',
              width: '50px'
            }}
          >
            <option value="income">💰 Income</option>
            <option value="outcome">💸 Outcome</option>
          </select>

          {/* Description */}
          <input
            type="text"
            className="quick-input"
            placeholder="Description..."
            value={newLog.text}
            onChange={(e) => setNewLog({ ...newLog, text: e.target.value })}
            onKeyPress={handleKeyPress}
            style={{ width: '100%' }}
          />

          {/* Date */}
          <input
            type="date"
            value={newLog.deadline}
            onChange={(e) => setNewLog({ ...newLog, deadline: e.target.value })}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '13px',
              backgroundColor: '#fff',
              width: '100%'
            }}
          />

          {/* Category */}
          <select
            value={newLog.financeCategory}
            onChange={(e) => setNewLog({ ...newLog, financeCategory: e.target.value })}
            style={{
              padding: '8px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '13px',
              backgroundColor: '#fff'
            }}
          >
            {financeCategories[newLog.financeType].map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* HUGE Amount Field - uses default currency */}
          <input
            type="number"
            className="quick-input"
            placeholder={`Amount (${defaultCurrencySymbol})`}
            value={newLog.amount}
            onChange={(e) => setNewLog({ ...newLog, amount: e.target.value })}
            onKeyPress={handleKeyPress}
            style={{
              width: '100%',
              fontSize: '14px',
              fontWeight: 600,
              padding: '10px 12px'
            }}
          />

          {/* Add Button */}
          <button className="quick-add-btn" onClick={handleAddLog}>
            ➕ Add
          </button>
        </div>
      </div>

      {/* Currency Selection Modal */}
      {showCurrencyModal && (
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
          zIndex: 10000
        }}
        onClick={() => { setShowCurrencyModal(false); setCurrencySearch(''); }}
        >
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '24px', color: '#00897b', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                🌍 Set Default Currency
              </h3>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '15px' }}>
                This currency will be used for all new finance logs
              </p>
              <input
                type="text"
                placeholder="Search currencies... (e.g., PHP, Philippine)"
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #e0e0e0',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00897b'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
              {/* Popular Currencies Section */}
              {!currencySearch && (
                <>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#00897b', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    ⭐ Most Popular
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px', marginBottom: '20px' }}>
                    {popularCurrencies.map(curr => (
                      <button
                        key={curr.value}
                        onClick={() => {
                          setDefaultCurrency(curr.value);
                          setDefaultCurrencySymbol(curr.symbol);
                          setShowCurrencyModal(false);
                          setCurrencySearch('');
                        }}
                        style={{
                          padding: '10px',
                          background: defaultCurrency === curr.value ? '#e0f2f1' : 'white',
                          border: `2px solid ${defaultCurrency === curr.value ? '#00897b' : '#e0e0e0'}`,
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        onMouseOver={(e) => {
                          if (defaultCurrency !== curr.value) {
                            e.target.style.borderColor = '#00897b';
                            e.target.style.background = '#f5f5f5';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (defaultCurrency !== curr.value) {
                            e.target.style.borderColor = '#e0e0e0';
                            e.target.style.background = 'white';
                          }
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>{curr.flag}</span>
                        <span>{curr.value}</span>
                      </button>
                    ))}
                  </div>
                  <div style={{ height: '2px', background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)', margin: '20px 0' }} />
                </>
              )}

              {/* All Currencies (filtered) */}
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#666', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {currencySearch ? `Search Results` : '🌏 All Currencies'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {allCurrencies
                  .filter(curr => {
                    if (!currencySearch) return true;
                    const search = currencySearch.toLowerCase();
                    return curr.value.toLowerCase().includes(search) ||
                           curr.label.toLowerCase().includes(search);
                  })
                  .map(curr => (
                    <button
                      key={curr.value}
                      onClick={() => {
                        setDefaultCurrency(curr.value);
                        setDefaultCurrencySymbol(curr.symbol);
                        setShowCurrencyModal(false);
                        setCurrencySearch('');
                      }}
                      style={{
                        padding: '12px',
                        background: defaultCurrency === curr.value ? '#e0f2f1' : 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'background 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                      onMouseOver={(e) => e.target.style.background = defaultCurrency === curr.value ? '#e0f2f1' : '#f5f5f5'}
                      onMouseOut={(e) => e.target.style.background = defaultCurrency === curr.value ? '#e0f2f1' : 'white'}
                    >
                      <span style={{ fontSize: '20px' }}>{curr.flag}</span>
                      <span style={{ flex: 1 }}>{curr.label}</span>
                      <span style={{ fontSize: '11px', color: '#999', fontWeight: 600 }}>{curr.symbol}</span>
                    </button>
                  ))}
              </div>
            </div>

            <button
              onClick={() => { setShowCurrencyModal(false); setCurrencySearch(''); }}
              style={{
                padding: '12px 24px',
                background: '#00897b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.3s'
              }}
              onMouseOver={(e) => e.target.style.background = '#00695c'}
              onMouseOut={(e) => e.target.style.background = '#00897b'}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FinanceLogs;
