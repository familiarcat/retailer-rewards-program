import React, { useState } from 'react';
import { getTransactions } from '../services/transactionService';
import { getMonthName } from '../utils/dateUtils';
import { calculateRewardPoints } from '../utils/rewardCalculator';

const RewardsTable = ({ rewards, totalPoints, customerId, sectionDelay = 0 }) => {
  const [expandedMonths, setExpandedMonths] = useState(new Set());
  const [details, setDetails] = useState({}); // Cache for fetched transactions
  const [loadingMap, setLoadingMap] = useState({});

  const handleToggle = async (month) => {
    const isExpanding = !expandedMonths.has(month);
    
    setExpandedMonths(prev => {
      const next = new Set(prev);
      if (isExpanding) next.add(month);
      else next.delete(month);
      return next;
    });

    // If expanding and we don't have data yet, fetch it
    if (isExpanding && !details[month]) {
      setLoadingMap((prev) => ({ ...prev, [month]: true }));
      try {
        const allTx = await getTransactions();
        const filtered = allTx.filter(
          (tx) => tx.customerId === customerId && getMonthName(tx.date) === month
        );
        setDetails((prev) => ({ ...prev, [month]: filtered }));
      } catch (err) {
        console.error('Failed to load transaction details', err);
      } finally {
        setLoadingMap((prev) => ({ ...prev, [month]: false }));
      }
    }
  };

  return (
    // Glass-reveal on the table panel; base delay is offset by the parent
    // section's own stagger so the panel appears just after its heading.
    <div
      className="rewards-table anim-glass-reveal"
      style={{ '--anim-delay': `${sectionDelay + 30}ms` }}
    >
      <table>
        <caption className="rw-caption">Rewards Table</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Points Earned</th>
          </tr>
        </thead>
        <tbody>
          {rewards.map(({ month, points }, rowIdx) => {
            const isExpanded = expandedMonths.has(month);
            const isLoading = loadingMap[month];
            const monthTx = details[month] || [];
            // Rows stagger from sectionDelay + 50 ms (after the panel glass-reveal)
            // at 30 ms per row. The heading and panel reveal happen first,
            // then rows cascade in beneath them.
            const rowDelay = `${sectionDelay + 50 + rowIdx * 30}ms`;

            return (
              <React.Fragment key={month}>
                <tr
                  className={`rw-row--clickable anim-fade-up ${isExpanded ? 'rw-row--expanded' : ''}`}
                  style={{ '--anim-delay': rowDelay }}
                  onClick={() => handleToggle(month)}
                  tabIndex={0}
                  role="button"
                  aria-expanded={isExpanded}
                >
                  <td>
                    <span className="rw-month-label">{month}</span>
                    <span className="rw-month-chevron" aria-hidden="true">›</span>
                  </td>
                  <td className="rw-td-pts">
                    <div className="pts-visual">
                      <div className="pts-bar" style={{ width: `${Math.min(points, 100)}%` }} />
                      <span className="pts-num">{points}</span>
                    </div>
                  </td>
                </tr>
                {isExpanded && (
                  <tr className="rw-details-row">
                    <td colSpan="2" className="rw-details-cell">
                      <div className="accordion-wrap anim-fade-in">
                        {isLoading ? (
                          <div className="accordion-loading">Loading transactions...</div>
                        ) : monthTx.length === 0 ? (
                          <div className="accordion-empty">No transactions recorded.</div>
                        ) : (
                          <>
                            <div className="accordion-header">
                              <span className="acc-header-label">Product</span>
                              <span className="acc-header-label">Amount</span>
                              <span className="acc-header-label acc-header-label--pts">Points</span>
                              <span className="acc-header-label">Date</span>
                            </div>
                            <ul className="accordion-list">
                              {monthTx.map((tx) => (
                                <li key={tx.transactionId} className="accordion-item">
                                  <span className="acc-prod">{tx.product || 'Unknown Item'}</span>
                                  <span className="acc-amt">${tx.amount.toFixed(2)}</span>
                                  <span className="acc-pts">+{calculateRewardPoints(tx.amount)} pts</span>
                                  <span className="acc-date">{tx.date}</span>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
          <tr
            className="rw-total-row anim-fade-up"
            style={{ '--anim-delay': `${sectionDelay + 50 + rewards.length * 30}ms` }}
          >
            <td colSpan="2" style={{ textAlign: 'left', paddingTop: '1rem' }}>
              <div className="total-points">Total: {totalPoints}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RewardsTable;