import React, { useState, useEffect } from 'react';
import Dashboard       from './components/Dashboard';
import TransactionView from './components/TransactionView';
import CustomerRewards from './features/rewards/components/CustomerRewards';
import './styles/global.css';

// Human-readable label for every routable sub-view.
const VIEW_LABELS = {
  rewards:      'Rewards Catalog',
  transactions: 'Transaction Log',
};

const VIEW_ICONS = {
  rewards:      '⭐',
  transactions: '🗄️',
};

function App() {
  const [view,   setView]   = useState('home');
  const [filter, setFilter] = useState(null);

  // ── History API bootstrap ────────────────────────────────────────────────
  // Replace the initial browser history entry so that pressing Back on the
  // home view exits the app to whatever page the user came from rather than
  // creating a loop inside the application.
  useEffect(() => {
    window.history.replaceState(
      { view: 'home', filter: null },
      '',
      window.location.href
    );
  }, []);

  // Handle browser Back / Forward buttons.
  useEffect(() => {
    const onPopState = (e) => {
      const state = e.state || { view: 'home', filter: null };
      setView(state.view   || 'home');
      setFilter(state.filter || null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Keep the browser tab title in sync with the current view.
  useEffect(() => {
    const label = VIEW_LABELS[view];
    document.title = label
      ? `${label} — Retailer Rewards`
      : 'Retailer Rewards';
  }, [view]);

  // ── Navigation ────────────────────────────────────────────────────────────
  // Every call to navigate() pushes a new browser history entry so the Back
  // button traverses the in-app history before leaving the application.
  const navigate = (target, customerFilter = null) => {
    const nextView = target || 'home';
    window.history.pushState(
      { view: nextView, filter: customerFilter },
      '',
      window.location.pathname + (nextView !== 'home' ? `#${nextView}` : '')
    );
    setView(nextView);
    setFilter(customerFilter);
  };

  const crumbLabel = VIEW_LABELS[view];
  const crumbIcon  = VIEW_ICONS[view];

  return (
    <div className="app-container">

      {/* ── Breadcrumb — rendered above the header glass panel ── */}
      {crumbLabel && (
        <nav className="breadcrumb" aria-label="You are here">
          <button
            className="breadcrumb__home"
            onClick={() => navigate('home')}
          >
            ← Dashboard
          </button>
          <span className="breadcrumb__sep" aria-hidden="true">/</span>
          <span className="breadcrumb__current" aria-current="page">
            {crumbIcon} {crumbLabel}
          </span>
        </nav>
      )}

      {/* ── App header — always visible ── */}
      <header className="app-header">
        <div className="app-header-left">
          <span className="app-logo" aria-hidden="true">◈</span>
          <div className="app-header-text">
            <h1
              className={view !== 'home' ? 'app-title--link' : ''}
              onClick={view !== 'home' ? () => navigate('home') : undefined}
              role={view !== 'home' ? 'button' : undefined}
              tabIndex={view !== 'home' ? 0 : undefined}
              onKeyDown={view !== 'home' ? (e) => e.key === 'Enter' && navigate('home') : undefined}
              title={view !== 'home' ? 'Back to dashboard' : undefined}
            >
              Rewards
            </h1>
            <p className="app-subtitle">Retailer Rewards Portal</p>
          </div>
        </div>
      </header>

      {/* ── Sub-view page title — shown beneath the header on non-home views ── */}
      {crumbLabel && (
        <div className="page-header">
          <h2 className="page-title">{crumbLabel}</h2>
        </div>
      )}

      {/* ── Main content ── */}
      <main>
        {view === 'home'         && <Dashboard onNavigate={navigate} />}
        {view === 'rewards'      && <CustomerRewards filterCustomerId={filter} />}
        {view === 'transactions' && <TransactionView />}
      </main>

    </div>
  );
}

export default App;
