import React, { useState, useEffect } from 'react';
import { getTransactions } from '../features/rewards/services/transactionService';
import { calculateRewardPoints } from '../features/rewards/utils/rewardCalculator';

/**
 * MonthlyTransactionView
 * ----------------------
 * Displays the full transaction history grouped and summarised by calendar
 * month.  Each month section contains:
 *   • A header with the month name, year label, and a three-stat strip
 *     (transaction count / total spend / total points earned)
 *   • A sortable transaction table (Customer · Product · Amount · Points · Date)
 *
 * Animation — mirrors the CustomerRewards / TransactionView pattern:
 *   entering  → month sections cascade in with anim-fade-up stagger
 *   exiting   → sections swap to anim-exit-down with a compressed stagger
 */
const MonthlyTransactionView = ({ phase = 'idle' }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading transaction data…</div>;

  // ── Group by YYYY-MM, sort chronologically ──────────────────────────────
  const monthMap = {};
  transactions.forEach((tx) => {
    const key = tx.date.slice(0, 7); // "2025-01"
    if (!monthMap[key]) monthMap[key] = [];
    monthMap[key].push(tx);
  });

  const months = Object.keys(monthMap)
    .sort() // YYYY-MM is lexicographically sortable
    .map((key) => {
      const txs = monthMap[key].map((tx) => ({
        ...tx,
        points: calculateRewardPoints(tx.amount),
      }));
      const date = new Date(`${key}-01T00:00:00`);
      return {
        key,
        label:       date.toLocaleString('en-US', { month: 'long' }),
        year:        date.getFullYear(),
        transactions: txs,
        totalAmount: txs.reduce((s, t) => s + t.amount, 0),
        totalPoints: txs.reduce((s, t) => s + t.points, 0),
      };
    });

  const isExiting = phase === 'exiting';

  return (
    <div className="mv-view">
      {months.map((month, idx) => {
        // Intro: sections cascade in 70 ms apart.
        // Outro: same direction but compressed to 20 ms so all finish within
        //        the 230 ms outro window.
        const sectionDelay = isExiting ? `${idx * 20}ms` : `${idx * 70}ms`;
        const sectionAnim  = isExiting ? 'anim-exit-down' : 'anim-fade-up';
        const maxRowAmt    = Math.max(...month.transactions.map((t) => t.amount), 1);

        return (
          <section
            key={month.key}
            className={`mv-month-section ${sectionAnim}`}
            style={{ '--anim-delay': sectionDelay }}
          >
            {/* ── Month heading + stats strip ─────────────────────────── */}
            <div
              className={`mv-month-header ${isExiting ? 'anim-exit-left' : 'anim-slide-left'}`}
              style={{ '--anim-delay': sectionDelay }}
            >
              <h2 className="mv-month-title">
                {month.label}
                <span className="mv-month-year">{month.year}</span>
              </h2>
              <div className="mv-stats-strip">
                <span className="mv-stat mv-stat--count">
                  <span className="mv-stat__val">{month.transactions.length}</span>
                  <span className="mv-stat__lbl">transactions</span>
                </span>
                <span className="mv-stat mv-stat--amount">
                  <span className="mv-stat__val">${month.totalAmount.toFixed(2)}</span>
                  <span className="mv-stat__lbl">total spend</span>
                </span>
                <span className="mv-stat mv-stat--points">
                  <span className="mv-stat__val">{month.totalPoints.toLocaleString()}</span>
                  <span className="mv-stat__lbl">pts earned</span>
                </span>
              </div>
            </div>

            {/* ── Transaction table ────────────────────────────────────── */}
            <div
              className="mv-table-wrap anim-glass-reveal"
              style={{ '--anim-delay': `${idx * 70 + 30}ms` }}
            >
              <table className="mv-table">
                <thead>
                  <tr>
                    <th className="tx-th mv-th--customer">Customer</th>
                    <th className="tx-th mv-th--product">Product</th>
                    <th className="tx-th mv-th--amount">Amount</th>
                    <th className="tx-th mv-th--points">Points</th>
                    <th className="tx-th mv-th--date">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {month.transactions.map((tx, rowIdx) => {
                    // Micro amount bar — same backgroundSize trick as TransactionView
                    const rawPct  = Math.round((tx.amount / maxRowAmt) * 100);
                    const barPct  = Math.max(rawPct, 3);
                    const bgSize  = rawPct > 0
                      ? `${Math.round(10000 / rawPct)}% 100%`
                      : '10000% 100%';
                    // Rows stagger from (sectionDelay + 50 ms) + 28 ms per row,
                    // capped so long months don't drag on past the intro.
                    const rowDelay = `${idx * 70 + 50 + Math.min(rowIdx * 28, 150)}ms`;
                    return (
                      <tr
                        key={tx.transactionId}
                        className="mv-row anim-fade-up"
                        style={{ '--anim-delay': rowDelay }}
                      >
                        <td className="mv-cell mv-cell--customer">{tx.customerId}</td>
                        <td className="mv-cell mv-cell--product">{tx.product || '—'}</td>
                        <td className="mv-cell">
                          <div className="amt-cell">
                            <div
                              className="amt-bar"
                              style={{ width: `${barPct}%`, backgroundSize: bgSize }}
                              aria-hidden="true"
                            />
                            <span className="amt-num">${tx.amount.toFixed(2)}</span>
                          </div>
                        </td>
                        <td className="mv-cell mv-cell--pts">
                          <span className={`pts-badge${tx.points === 0 ? ' pts-badge--zero' : ''}`}>
                            {tx.points} pts
                          </span>
                        </td>
                        <td className="mv-cell mv-cell--date">{tx.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default MonthlyTransactionView;
