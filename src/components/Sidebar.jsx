import { useState } from 'react';
import './Sidebar.css';

function Sidebar({ activeSection, onSectionChange }) {
  const [financeExpanded, setFinanceExpanded] = useState(false);

  const sections = [
    { id: 'todolist', icon: '✅', label: 'TodoList', employee: 'Yuwon' },
    { id: 'impossible', icon: '💀', label: 'Impossible', employee: 'Yuwon' },
    { id: 'habits', icon: '🔄', label: 'Habits', employee: 'Jaehyun' },
    { id: 'recurring', icon: '📅', label: 'Recurring', employee: 'Noah' },
    {
      id: 'finance',
      icon: '💰',
      label: 'Finance',
      employee: 'Minkyu',
      hasSubcategories: true,
      subcategories: [
        { id: 'finance-transactions', icon: '💸', label: 'Transactions' },
        { id: 'finance-wishlist', icon: '🛍️', label: 'Wishlist' },
        { id: 'finance-overview', icon: '📊', label: 'Overview' }
      ]
    },
    { id: 'timer', icon: '⏱️', label: 'Timer', employee: 'Noah' },
    { id: 'record', icon: '📝', label: 'Record', employee: 'Minkyu' }
  ];

  const handleSectionClick = (sectionId) => {
    if (sectionId === 'finance') {
      setFinanceExpanded(!financeExpanded);
      // If finance is being opened for first time, default to transactions
      if (!financeExpanded) {
        onSectionChange('finance-transactions');
      }
    } else {
      onSectionChange(sectionId);
      // Close finance submenu when clicking other sections
      if (sectionId !== 'finance-transactions' && sectionId !== 'finance-wishlist' && sectionId !== 'finance-budget') {
        setFinanceExpanded(false);
      }
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>📋 Work</h3>
      </div>

      <nav className="sidebar-nav">
        {sections.map(section => (
          <div key={section.id}>
            <button
              className={`sidebar-item ${activeSection === section.id || (section.hasSubcategories && activeSection.startsWith('finance-')) ? 'active' : ''}`}
              onClick={() => handleSectionClick(section.id)}
            >
              <span className="sidebar-icon">{section.icon}</span>
              <span className="sidebar-label">{section.label}</span>
              {section.hasSubcategories && (
                <span className="sidebar-arrow">{financeExpanded ? '▼' : '▶'}</span>
              )}
            </button>

            {/* Finance Subcategories */}
            {section.hasSubcategories && financeExpanded && (
              <div className="sidebar-subcategories">
                {section.subcategories.map(sub => (
                  <button
                    key={sub.id}
                    className={`sidebar-subitem ${activeSection === sub.id ? 'active' : ''}`}
                    onClick={() => onSectionChange(sub.id)}
                  >
                    <span className="sidebar-icon">{sub.icon}</span>
                    <span className="sidebar-label">{sub.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer with employee avatar for active section */}
      <div className="sidebar-footer">
        {activeSection === 'todolist' && (
          <div className="sidebar-employee">
            <img src="/images/Yuwon_1.png" alt="Yuwon" />
            <span>Yuwon</span>
          </div>
        )}
        {activeSection === 'impossible' && (
          <div className="sidebar-employee">
            <img src="/images/Yuwon_1.png" alt="Everyone" />
            <span>Everyone</span>
          </div>
        )}
        {activeSection === 'habits' && (
          <div className="sidebar-employee">
            <img src="/images/Jaehyun_1.png" alt="Jaehyun" />
            <span>Jaehyun</span>
          </div>
        )}
        {activeSection === 'recurring' && (
          <div className="sidebar-employee">
            <img src="/images/Noah_1.png" alt="Noah" />
            <span>Noah</span>
          </div>
        )}
        {(activeSection.startsWith('finance-') || activeSection === 'finance') && (
          <div className="sidebar-employee">
            <img src="/images/Minkyu_1.png" alt="Minkyu" />
            <span>Minkyu</span>
          </div>
        )}
        {activeSection === 'timer' && (
          <div className="sidebar-employee">
            <img src="/images/Noah_1.png" alt="Noah" />
            <span>Boss Mode</span>
          </div>
        )}
        {activeSection === 'record' && (
          <div className="sidebar-employee">
            <img src="/images/Minkyu_1.png" alt="Minkyu" />
            <span>Record Book</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
