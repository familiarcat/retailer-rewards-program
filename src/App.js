import React, { useState } from 'react';
import Dashboard       from './components/Dashboard';
import TransactionView from './components/TransactionView';
import CustomerRewards from './features/rewards/components/CustomerRewards';
import './styles/global.css';

// Map every routable view to a breadcrumb label.
// 'home' has no label — the header shows the app title only.
const VIEW_LABELS = {
  rewards:      '⭐ Rewards Catalog',
  transactions: '🗄️ Transaction Log',
};

function App() {
  const [view,   setView]   = useState('home');
  const [filter, setFilter] = useState(null);

  const navigate = (target, customerFilter = null) => {
    setView(target || 'home');
    setFilter(customerFilter);
  };

  const crumbLabel = VIEW_LABELS[view];
  const isHome     = view === 'home';

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-logo" aria-hidden="true">◈</span>
          <div className="app-header-text">
            <h1
              className={!isHome ? 'app-title--link' : ''}
              onClick={!isHome ? () => navigate('home') : undefined}
              role={!isHome ? 'button' : undefined}
              tabIndex={!isHome ? 0 : undefined}
              onKeyDown={!isHome ? (e) => e.key === 'Enter' && navigate('home') : undefined}
              title={!isHome ? 'Back to dashboard' : undefined}
            >
              Rewards
            </h1>
            <p className="app-subtitle">Retailer Rewards Portal</p>
          </div>
        </div>

        {crumbLabel && (
          <nav className="app-nav" aria-label="Breadcrumb navigation">
            <button className="nav-tab" onClick={() => navigate('home')}>
              ← Dashboard
            </button>
            <span className="nav-sep" aria-hidden="true">/</span>
            <span className="nav-tab nav-tab--active" aria-current="page">
              {crumbLabel}
            </span>
          </nav>
        )}
      </header>

      <main>
        {view === 'home'         && <Dashboard onNavigate={navigate} />}
        {view === 'rewards'      && <CustomerRewards filterCustomerId={filter} />}
        {view === 'transactions' && <TransactionView />}
      </main>
    </div>
  );
}

export default App;
