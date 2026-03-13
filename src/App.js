import React, { useState, useEffect } from 'react';
import Dashboard       from './components/Dashboard';
import TransactionView from './components/TransactionView';
import CustomerRewards from './features/rewards/components/CustomerRewards';
import AppLogo         from './components/AppLogo';
import useViewTransition from './hooks/useViewTransition';
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

  // Animation hook — single source of view transition behaviour.
  const { phase, wrap, enter } = useViewTransition();

  // ── History API bootstrap ────────────────────────────────────────────────
  useEffect(() => {
    window.history.replaceState(
      { view: 'home', filter: null },
      '',
      window.location.href
    );
  }, []);

  // Handle browser Back / Forward buttons.
  // State changes immediately (browser already moved); we just trigger the intro.
  useEffect(() => {
    const onPopState = (e) => {
      const state = e.state || { view: 'home', filter: null };
      setView(state.view   || 'home');
      setFilter(state.filter || null);
      enter(); // play the intro animation on the newly revealed content
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [enter]);

  // Keep the browser tab title in sync with the current view.
  useEffect(() => {
    const label = VIEW_LABELS[view];
    document.title = label
      ? `${label} — Retailer Rewards`
      : 'Retailer Rewards';
  }, [view]);

  // ── Navigation ────────────────────────────────────────────────────────────
  // wrap() plays the outro on current content, then executes the state change,
  // then plays the intro on the new content — all co-ordinated by the hook.
  // `viewFilter` can be a string (customerFilter for rewards) or an object
  // { customerId, month } for a month-scoped transaction drill-through.
  const navigate = (target, viewFilter = null) => {
    wrap(() => {
      const nextView = target || 'home';
      window.history.pushState(
        { view: nextView, filter: viewFilter },
        '',
        window.location.pathname + (nextView !== 'home' ? `#${nextView}` : '')
      );
      setView(nextView);
      setFilter(viewFilter);
    });
  };

  // Called from CustomerRewards → RewardsTable when a month row is clicked.
  // Navigates to the transaction log pre-filtered to that customer + month.
  const handleMonthClick = (customerId, month) =>
    navigate('transactions', { customerId, month });

  // Clears the transaction month filter while staying on the transaction view.
  const handleClearTxFilter = () => navigate('transactions', null);

  const crumbLabel = VIEW_LABELS[view];
  const crumbIcon  = VIEW_ICONS[view];

  return (
    <div className="app-container">

      {/* ── Breadcrumb — animates in when a sub-view is active ── */}
      {crumbLabel && (
        <nav className="breadcrumb anim-slide-left" aria-label="You are here">
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

      {/* ── App header — anim-header plays once on initial load ── */}
      <header className="app-header anim-header">
        <div className="app-header-left">
          <AppLogo
            size={44}
            className={`app-logo${view !== 'home' ? ' app-logo--link' : ''}`}
            onClick={view !== 'home' ? () => navigate('home') : undefined}
            role={view !== 'home' ? 'button' : undefined}
            tabIndex={view !== 'home' ? 0 : undefined}
            onKeyDown={view !== 'home' ? (e) => e.key === 'Enter' && navigate('home') : undefined}
            title={view !== 'home' ? 'Back to dashboard' : undefined}
          />
          <div className="app-header-text">
            <h1
              className={view !== 'home' ? 'app-title--link' : ''}
              onClick={view !== 'home' ? () => navigate('home') : undefined}
              role={view !== 'home' ? 'button' : undefined}
              tabIndex={view !== 'home' ? 0 : undefined}
              onKeyDown={view !== 'home' ? (e) => e.key === 'Enter' && navigate('home') : undefined}
              title={view !== 'home' ? 'Back to dashboard' : undefined}
            >
              <span className="app-brand__eyebrow">Retailer</span>
              <span className="app-brand__wordmark">Rewards</span>
            </h1>
          </div>
        </div>
      </header>

      {/* ── Sub-view page title — slides in from the left when it appears ── */}
      {crumbLabel && (
        <div className="page-header anim-slide-left" style={{ '--anim-delay': '60ms' }}>
          <h2 className="page-title">{crumbLabel}</h2>
        </div>
      )}

      {/* ── Main content — view-wrap class drives the transition phase ── */}
      <main className={`view-wrap view-wrap--${phase}`}>
        {view === 'home'         && <Dashboard onNavigate={navigate} />}
        {view === 'rewards'      && (
          <CustomerRewards
            filterCustomerId={filter}
            onMonthClick={handleMonthClick}
          />
        )}
        {view === 'transactions' && (
          <TransactionView
            txFilter={filter && typeof filter === 'object' ? filter : null}
            onClearFilter={handleClearTxFilter}
          />
        )}
      </main>

    </div>
  );
}

export default App;
