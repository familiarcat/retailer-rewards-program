import React, { useState, useEffect } from 'react';
import { getTransactions } from '../features/rewards/services/transactionService';
import { calculateRewards } from '../features/rewards/utils/rewardCalculator';
import { getMonthName } from '../features/rewards/utils/dateUtils';
import useAnimateIn from '../hooks/useAnimateIn';

const COLUMNS = [
  { key: 'product',    label: 'Product'   },
  { key: 'customerId', label: 'Customer'  },
  { key: 'amount',     label: 'Amount'    },
  { key: 'date',       label: 'Date'      },
  { key: 'points',     label: 'Points'    },
];

/**
 * @param {{
 *   txFilter?: { customerId: string, month: string } | null,
 *   onClearFilter?: () => void
 * }} props
 *   txFilter      — when set, pre-filters rows to that customer + month.
 *   onClearFilter — called when the user dismisses the active filter.
 */
const TransactionView = ({ txFilter = null, onClearFilter = null }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('');
  const [sortKey, setSortKey]           = useState('date');
  const [sortDir, setSortDir]           = useState('desc');

  // Triggers after the first two animation frames so amt-bar CSS transition
  // animates from width 0 → target width rather than snapping to final state.
  const animated = useAnimateIn();

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key) => {
    if (key === 'points') return; // derived column — skip sorting
    setSortDir((d) => (sortKey === key ? (d === 'asc' ? 'desc' : 'asc') : 'asc'));
    setSortKey(key);
  };

  const rows = transactions
    .map((tx) => ({ ...tx, points: calculateRewards(tx.amount) }))
    .filter((tx) => {
      // Month-scoped drill-through filter (from clicking a RewardsTable row)
      if (txFilter?.customerId && tx.customerId !== txFilter.customerId) return false;
      if (txFilter?.month && getMonthName(tx.date) !== txFilter.month) return false;
      // Free-text search filter (toolbar input)
      if (!filter) return true;
      const q = filter.toLowerCase();
      return (
        tx.product.toLowerCase().includes(q) ||
        tx.customerId.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      if (va < vb) return sortDir === 'asc' ? -1 :  1;
      if (va > vb) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });

  // Max amount across the visible rows, for the micro-bar scale
  const maxAmount = rows.length ? Math.max(...rows.map((r) => r.amount), 1) : 1;

  if (loading) return <div className="loading">Loading transaction data…</div>;

  return (
    <div className="tx-view">

      {/* ── Month drill-through context bar ──────────────────────────── */}
      {txFilter && (
        <div className="tx-filter-bar anim-slide-left">
          <span className="tx-filter-bar__label">
            <span className="tx-filter-bar__icon" aria-hidden="true">◈</span>
            <strong className="tx-filter-bar__customer">{txFilter.customerId}</strong>
            <span className="tx-filter-bar__sep" aria-hidden="true">·</span>
            <span className="tx-filter-bar__month">{txFilter.month}</span>
          </span>
          <button
            className="tx-filter-bar__clear"
            onClick={onClearFilter}
            aria-label="Clear filter and show all transactions"
          >
            View all transactions ×
          </button>
        </div>
      )}

      <div className="tx-toolbar">
        <input
          type="search"
          className="tx-toolbar__search"
          placeholder="Filter by product or customer…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter transactions"
        />
        <span className="tx-toolbar__count">
          {rows.length} / {transactions.length} records
        </span>
      </div>

      <div className="tx-table-wrap">
        <table className="tx-table">
          <thead>
            <tr>
              {COLUMNS.map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className={[
                    'tx-th',
                    sortKey === key  ? 'tx-th--sorted'  : '',
                    key === 'points' ? 'tx-th--nodrop'  : '',
                  ].filter(Boolean).join(' ')}
                  aria-sort={sortKey === key ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                >
                  {label}
                  {sortKey === key && (
                    <span aria-hidden="true">{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((tx, idx) => {
              // Mirror the pts-bar backgroundSize trick: the gradient spans the
              // full column width so a $55 bar shows amber-to-slight-yellow while
              // a $200 bar (the max) shows the full amber→green arc.
              const rawAmtPct = Math.round((tx.amount / maxAmount) * 100);
              const barPct    = Math.max(rawAmtPct, 3);
              const amtBgSize = rawAmtPct > 0
                ? `${Math.round(10000 / rawAmtPct)}% 100%`
                : '10000% 100%';
              return (
                <tr
                  key={tx.transactionId}
                  className="tx-row anim-fade-up"
                  style={{ '--anim-delay': `${idx * 25}ms` }}
                >
                  <td className="tx-cell tx-cell--product">{tx.product}</td>
                  <td className="tx-cell">{tx.customerId}</td>
                  <td className="tx-cell">
                    <div className="amt-cell">
                      <div
                        className="amt-bar"
                        style={{ width: animated ? `${barPct}%` : '0%', backgroundSize: amtBgSize }}
                        aria-hidden="true"
                      />
                      <span className="amt-num">${tx.amount.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="tx-cell tx-cell--date">{tx.date}</td>
                  <td className="tx-cell tx-cell--pts">
                    <span className={`pts-badge${tx.points === 0 ? ' pts-badge--zero' : ''}`}>
                      {tx.points} pts
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default TransactionView;
