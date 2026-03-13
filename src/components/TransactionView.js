import React, { useState, useEffect } from 'react';
import { getTransactions } from '../features/rewards/services/transactionService';
import { calculateRewardPoints } from '../features/rewards/utils/rewardCalculator';

const COLUMNS = [
  { key: 'customerId', label: 'Customer'  },
  { key: 'product',    label: 'Product'   },
  { key: 'amount',     label: 'Amount'    },
  { key: 'points',     label: 'Points'    },
  { key: 'date',       label: 'Date'      },
];

const TransactionView = ({ phase = 'idle' }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState('');
  const [sortKey, setSortKey]           = useState('date');
  const [sortDir, setSortDir]           = useState('desc');

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key) => {
    setSortDir((d) => (sortKey === key ? (d === 'asc' ? 'desc' : 'asc') : 'asc'));
    setSortKey(key);
  };

  const rows = transactions
    .map((tx) => ({ ...tx, points: calculateRewardPoints(tx.amount) }))
    .filter((tx) => {
      if (!filter) return true;
      const q = filter.toLowerCase();
      return (
        (tx.product || '').toLowerCase().includes(q) ||
        tx.customerId.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      // Use empty string as fallback for safe sorting of missing strings
      const va = a[sortKey] || '';
      const vb = b[sortKey] || '';
      if (va < vb) return sortDir === 'asc' ? -1 :  1;
      if (va > vb) return sortDir === 'asc' ?  1 : -1;
      return 0;
    });

  // Max amount across the visible rows, for the micro-bar scale
  const maxAmount = rows.length ? Math.max(...rows.map((r) => r.amount), 1) : 1;

  if (loading) return <div className="loading">Loading transaction data…</div>;

  const isExiting = phase === 'exiting';

  return (
    <div className="tx-view">

      {/* Toolbar — slides in from the left; exits left on outro */}
      <div
        className={`tx-toolbar ${isExiting ? 'anim-exit-left' : 'anim-slide-left'}`}
        style={{ '--anim-delay': '0ms' }}
      >
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

      {/* Table glass panel — glass-reveals in; fades out on outro with a 25 ms
          offset so it follows just after the toolbar exit starts */}
      <div
        className={`tx-table-wrap ${isExiting ? 'anim-exit-fade' : 'anim-glass-reveal'}`}
        style={{ '--anim-delay': isExiting ? '25ms' : '40ms' }}
      >
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
              // Row stagger: base 60 ms (after table panel), 22 ms per row,
              // capped at 160 ms so long lists don't drag on indefinitely.
              const rowDelay = `${60 + Math.min(idx * 22, 160)}ms`;
              return (
                <tr
                  key={tx.transactionId}
                  className="tx-row anim-fade-up"
                  style={{ '--anim-delay': rowDelay }}
                >
                  <td className="tx-cell tx-cell--customer">{tx.customerId}</td>
                  <td className="tx-cell tx-cell--product">{tx.product || '—'}</td>
                  <td className="tx-cell">
                    <div className="amt-cell">
                      <div className="amt-bar" style={{ width: `${barPct}%`, backgroundSize: amtBgSize }} aria-hidden="true" />
                      <span className="amt-num">${tx.amount.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="tx-cell tx-cell--pts">
                    <span className={`pts-badge${tx.points === 0 ? ' pts-badge--zero' : ''}`}>
                      {tx.points} pts
                    </span>
                  </td>
                  <td className="tx-cell tx-cell--date">{tx.date}</td>
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
