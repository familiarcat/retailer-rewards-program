import React, { useState, useEffect } from 'react';
import { useRewards } from '../features/rewards/hooks/useRewards';
import { getTransactions } from '../features/rewards/services/transactionService';

// ── Navigation modules ────────────────────────────────────────────────────────

const MODULES = [
  {
    id: 'rewards',
    icon: '⭐',
    title: 'Rewards Catalog',
    tagline: 'Customer points, monthly breakdowns, and loyalty totals',
    accent: '#a5b4fc',
    glow: 'rgba(165,180,252,0.11)',
  },
  {
    id: 'transactions',
    icon: '🗄️',
    title: 'Transaction Log',
    tagline: 'Sortable, filterable raw purchase records',
    accent: '#5eead4',
    glow: 'rgba(94,234,212,0.10)',
  },
];

const PTS_GRADIENT = 'linear-gradient(90deg, #fbbf24 0%, #34d399 100%)';

// ── KPI configuration ─────────────────────────────────────────────────────────

const KPI_DEFS = [
  { label: 'Customers',            accent: '#a5b4fc', navigateTo: 'rewards',       hint: 'View rewards catalog' },
  { label: 'Transactions',         accent: '#5eead4', navigateTo: 'transactions',  hint: 'View transaction log' },
  { label: 'Total Points Awarded', accent: '#34d399', navigateTo: 'rewards',       hint: 'View rewards catalog' },
  { label: 'Months Tracked',       accent: '#fcd34d', navigateTo: 'monthly',       hint: 'View monthly breakdown' },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

// animIndex drives the stagger delay: each card enters 80ms after the previous.
const KpiCard = ({ label, value, loading, accent, navigateTo, hint, onNavigate, animIndex = 0 }) => (
  <div
    className="kpi-card kpi-card--clickable anim-fade-up"
    style={{
      '--kpi-accent': accent,
      borderTopColor: accent,
      '--anim-delay': `${animIndex * 80}ms`,
    }}
    onClick={() => onNavigate(navigateTo)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate(navigateTo)}
    aria-label={`${label}${!loading ? `: ${value}` : ''}. ${hint}.`}
  >
    {loading ? (
      <span className="kpi-value kpi-value--loading">
        <span className="skeleton" style={{ display: 'inline-block', width: '3rem', height: '2.2rem', borderRadius: 6 }} />
      </span>
    ) : (
      <span className="kpi-value">{value}</span>
    )}
    <span className="kpi-label">{label}</span>
    <span className="kpi-card__hint" aria-hidden="true">{hint} →</span>
  </div>
);

const CustomerPointsChart = ({ rewards, loading, onNavigate }) => {
  if (loading) {
    return (
      <div className="points-chart">
        {[1, 2, 3].map((i) => (
          <div key={i} className="pchart-row pchart-skeleton">
            <div className="pchart-label skeleton" />
            <div className="pchart-track skeleton" />
            <div className="pchart-val skeleton" />
          </div>
        ))}
      </div>
    );
  }

  if (!rewards.length) return null;

  const max = Math.max(...rewards.map((r) => r.totalPoints), 1);

  return (
    <div className="points-chart">
      {rewards.map((r, i) => {
        const pct = Math.round((r.totalPoints / max) * 100);
        return (
          <div
            key={r.customerId}
            className="pchart-row pchart-row--clickable anim-fade-up"
            style={{ '--anim-delay': `${i * 70 + 160}ms` }}
            onClick={() => onNavigate('rewards', r.customerId)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('rewards', r.customerId)}
            aria-label={`${r.customerId}: ${r.totalPoints} points. Click to view their rewards.`}
          >
            <span className="pchart-label">{r.customerId}</span>
            <div className="pchart-track" aria-hidden="true">
              <div
                className="pchart-fill"
                style={{ width: `${pct}%`, background: PTS_GRADIENT }}
              />
            </div>
            <span className="pchart-val" style={{ color: '#34d399' }}>{r.totalPoints.toLocaleString()}</span>
          </div>
        );
      })}
    </div>
  );
};

// animIndex drives the stagger; modules enter after the KPI row settles.
const ModuleTile = ({ mod, onNavigate, animIndex = 0 }) => (
  <div
    className="mod-tile anim-glass-reveal"
    style={{
      '--tile-accent': mod.accent,
      '--tile-glow': mod.glow,
      '--anim-delay': `${animIndex * 100 + 80}ms`,
    }}
    onClick={() => onNavigate(mod.id)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate(mod.id)}
    aria-label={`Open ${mod.title}`}
  >
    <div className="mod-tile__top">
      <span className="mod-tile__icon">{mod.icon}</span>
      <span className="mod-tile__badge mod-tile__badge--live">Live</span>
    </div>
    <h3 className="mod-tile__title">{mod.title}</h3>
    <p className="mod-tile__tagline">{mod.tagline}</p>
    <div className="mod-tile__footer">
      <span className="mod-tile__cta">
        Open module <span aria-hidden="true">→</span>
      </span>
    </div>
  </div>
);

// ── Dashboard ──────────────────────────────────────────────────────────────────

const Dashboard = ({ onNavigate }) => {
  const { rewards, loading: rewardsLoading } = useRewards();
  const [transactions, setTransactions]       = useState([]);
  const [txLoading, setTxLoading]             = useState(true);

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .finally(() => setTxLoading(false));
  }, []);

  const totalPoints = rewards.reduce((sum, r) => sum + r.totalPoints, 0);
  const monthCount  = new Set(transactions.map((t) => t.date.slice(0, 7))).size;
  const recent      = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  const kpiValues  = [rewards.length, transactions.length, totalPoints.toLocaleString(), monthCount];
  const kpiLoading = [rewardsLoading, txLoading, rewardsLoading, txLoading];

  return (
    <div className="dashboard">

      {/* ── KPI strip — cards stagger in 80ms apart ── */}
      <div className="kpi-row">
        {KPI_DEFS.map((def, i) => (
          <KpiCard
            key={def.label}
            label={def.label}
            value={kpiValues[i]}
            loading={kpiLoading[i]}
            accent={def.accent}
            navigateTo={def.navigateTo}
            hint={def.hint}
            onNavigate={onNavigate}
            animIndex={i}
          />
        ))}
      </div>

      {/* ── Body: modules + points chart ── */}
      <div className="dash-body">

        <section className="dash-section">
          {/* Heading slides in from the left, slightly after the KPI strip */}
          <h2 className="dash-section__heading anim-slide-left" style={{ '--anim-delay': '100ms' }}>
            Portal Modules
          </h2>
          <div className="mod-grid">
            {MODULES.map((mod, i) => (
              <ModuleTile key={mod.id} mod={mod} onNavigate={onNavigate} animIndex={i} />
            ))}
          </div>
        </section>

        <section className="dash-section">
          <h2 className="dash-section__heading anim-slide-left" style={{ '--anim-delay': '120ms' }}>
            Points by Customer
          </h2>
          {/* Glass panel fades in as a unit */}
          <div className="glass-panel anim-glass-reveal" style={{ '--anim-delay': '160ms' }}>
            <CustomerPointsChart
              rewards={rewards}
              loading={rewardsLoading}
              onNavigate={onNavigate}
            />
          </div>
        </section>

      </div>

      {/* ── Recent transactions — rows stagger in after the body section ── */}
      <section className="dash-section">
        <h2 className="dash-section__heading anim-slide-left" style={{ '--anim-delay': '200ms' }}>
          Recent Transactions
        </h2>
        {txLoading ? (
          <p className="loading">Loading…</p>
        ) : (
          <div className="recent-table-outer anim-glass-reveal" style={{ '--anim-delay': '240ms' }}>
            <div className="recent-table-wrap">
              <table className="recent-table">
                <caption className="rw-caption">Recent Transactions</caption>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((tx, i) => (
                    <tr
                      key={tx.transactionId}
                      className="recent-row recent-row--clickable anim-fade-up"
                      style={{ '--anim-delay': `${i * 50 + 300}ms` }}
                      onClick={() => onNavigate('transactions')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('transactions')}
                      aria-label={`${tx.product} by ${tx.customerId}, $${tx.amount.toFixed(2)}. Click to view all transactions.`}
                    >
                      <td className="recent-cell recent-cell--product">{tx.product}</td>
                      <td className="recent-cell recent-cell--customer">{tx.customerId}</td>
                      <td className="recent-cell recent-cell--amount">${tx.amount.toFixed(2)}</td>
                      <td className="recent-cell recent-cell--date">{tx.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="recent-view-all"
              onClick={() => onNavigate('transactions')}
            >
              View all transactions →
            </button>
          </div>
        )}
      </section>

    </div>
  );
};

export default Dashboard;
