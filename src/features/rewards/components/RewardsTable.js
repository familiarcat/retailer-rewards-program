import React, { useState } from 'react';
import { getTransactions } from '../services/transactionService';
import { getMonthName } from '../utils/dateUtils';
import { calculateRewardPoints } from '../utils/rewardCalculator';

const getMonthNumber = (monthName) => new Date(Date.parse(`${monthName} 1, 2023`)).getMonth();

const RewardsTable = ({ 
  rewards, 
  totalPoints, 
  customerId, 
  sectionDelay = 0, 
  expandedMonths: propExpandedMonths, 
  onToggleMonth 
}) => {
  // Fallback state for uncontrolled usage (if parent doesn't provide expandedMonths)
  const [localExpandedMonths, setLocalExpandedMonths] = useState(new Set());
  const expandedMonths = propExpandedMonths || localExpandedMonths;

  const [details, setDetails] = useState({}); // Cache for fetched transactions
  const [loadingMap, setLoadingMap] = useState({});
  const [errorMap, setErrorMap] = useState({});
  const [rewardsSort, setRewardsSort] = useState({ key: 'month', dir: 'asc' });
  const [detailsSort, setDetailsSort] = useState({}); // { [month]: { key, dir } }

  const handleRewardsSort = (key) => {
    setRewardsSort(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDetailsSort = (month, key) => {
    setDetailsSort(prev => ({
      ...prev,
      [month]: {
        key,
        dir: prev[month]?.key === key && prev[month]?.dir === 'asc' ? 'desc' : 'asc'
      }
    }));
  };

  const handleToggle = async (month) => {
    const isExpanding = !expandedMonths.has(month);

    if (onToggleMonth) {
      onToggleMonth(month);
    } else {
      setLocalExpandedMonths(prev => {
        const next = new Set(prev);
        if (isExpanding) next.add(month);
        else next.delete(month);
        return next;
      });
    }

    // If expanding and we don't have data yet, fetch it
    if (isExpanding && !details[month]) {
      setLoadingMap((prev) => ({ ...prev, [month]: true }));
      setErrorMap((prev) => ({ ...prev, [month]: null }));
      try {
        const allTx = await getTransactions();
        const filtered = allTx.filter(
          (tx) => tx.customerId === customerId && getMonthName(tx.date) === month
        );
        setDetails((prev) => ({ ...prev, [month]: filtered }));
      } catch (err) {
        console.error('Failed to load transaction details for accordion', err);
        setErrorMap((prev) => ({ ...prev, [month]: 'Failed to load transaction details.' }));
      } finally {
        setLoadingMap((prev) => ({ ...prev, [month]: false }));
      }
    }
  };

  const sortedRewards = [...rewards].sort((a, b) => {
    const dir = rewardsSort.dir === 'asc' ? 1 : -1;
    if (rewardsSort.key === 'month') {
      return (getMonthNumber(a.month) - getMonthNumber(b.month)) * dir;
    }
    return (a.points - b.points) * dir;
  });

  return (
    // Glass-reveal on the table panel; base delay is offset by the parent
    // section's own stagger so the panel appears just after its heading.
    <div
      className={`rewards-table anim-glass-reveal ${expandedMonths.size > 0 ? 'has-expanded-row' : ''}`}
      style={{ '--anim-delay': `${sectionDelay + 30}ms` }}
    >
      <table>
        <caption className="rw-caption">Rewards Table</caption>
        <thead>
          <tr>
            <th scope="col" className={`tx-th ${rewardsSort.key === 'month' ? 'tx-th--sorted' : ''}`} onClick={() => handleRewardsSort('month')}>
              Month
              {rewardsSort.key === 'month' && <span aria-hidden="true">{rewardsSort.dir === 'asc' ? ' ↑' : ' ↓'}</span>}
            </th>
            <th scope="col" className={`tx-th ${rewardsSort.key === 'points' ? 'tx-th--sorted' : ''}`} onClick={() => handleRewardsSort('points')}>
              Points Earned
              {rewardsSort.key === 'points' && <span aria-hidden="true">{rewardsSort.dir === 'asc' ? ' ↑' : ' ↓'}</span>}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRewards.map(({ month, points }, rowIdx) => {
            const isExpanded = expandedMonths.has(month);
            const isLoading = loadingMap[month];
            const monthError = errorMap[month];
            const monthTx = details[month] || [];
            const monthSort = detailsSort[month] || { key: 'date', dir: 'desc' };

            // Rows stagger from sectionDelay + 50 ms (after the panel glass-reveal)
            // at 30 ms per row. The heading and panel reveal happen first,
            // then rows cascade in beneath them.
            const rowDelay = `${sectionDelay + 50 + rowIdx * 30}ms`;

            return (
              <React.Fragment key={month}>
                <tr
                  className={`rw-row--clickable anim-fade-up${isExpanded ? ' rw-row--expanded' : ''}`}
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
                        ) : monthError ? (
                          <div className="accordion-error">{monthError}</div>
                        ) : monthTx.length === 0 ? (
                          <div className="accordion-empty">No transactions recorded.</div>
                        ) : (
                          <>
                            <table className="accordion-table">
                              <thead>
                                <tr>
                                  <th className={`tx-th ${monthSort.key === 'product' ? 'tx-th--sorted' : ''}`} onClick={() => handleDetailsSort(month, 'product')}>
                                    Product {monthSort.key === 'product' && <span aria-hidden="true">{monthSort.dir === 'asc' ? ' ↑' : ' ↓'}</span>}
                                  </th>
                                  <th className={`tx-th ${monthSort.key === 'amount' ? 'tx-th--sorted' : ''}`} onClick={() => handleDetailsSort(month, 'amount')}>
                                    Amount {monthSort.key === 'amount' && <span aria-hidden="true">{monthSort.dir === 'asc' ? ' ↑' : ' ↓'}</span>}
                                  </th>
                                  <th className={`tx-th ${monthSort.key === 'points' ? 'tx-th--sorted' : ''}`} onClick={() => handleDetailsSort(month, 'points')}>
                                    Points {monthSort.key === 'points' && <span aria-hidden="true">{monthSort.dir === 'asc' ? ' ↑' : ' ↓'}</span>}
                                  </th>
                                  <th className={`tx-th ${monthSort.key === 'date' ? 'tx-th--sorted' : ''}`} onClick={() => handleDetailsSort(month, 'date')}>
                                    Date {monthSort.key === 'date' && <span aria-hidden="true">{monthSort.dir === 'asc' ? ' ↑' : ' ↓'}</span>}
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {[...monthTx]
                                  .sort((a, b) => {
                                    const dir = monthSort.dir === 'asc' ? 1 : -1;
                                    const va = a[monthSort.key] || '';
                                    const vb = b[monthSort.key] || '';
                                    if (va < vb) return -1 * dir;
                                    if (va > vb) return 1 * dir;
                                    return 0;
                                  })
                                  .map((tx) => {
                                    const pts = calculateRewardPoints(tx.amount);
                                    return (
                                      <tr key={tx.transactionId}>
                                        <td>{tx.product || 'Unknown Item'}</td>
                                        <td>${tx.amount.toFixed(2)}</td>
                                        <td>
                                          <span className={`pts-badge${pts === 0 ? ' pts-badge--zero' : ''}`}>{pts} pts</span>
                                        </td>
                                        <td>{tx.date}</td>
                                      </tr>
                                    );
                                  })}
                              </tbody>
                            </table>
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
            style={{ '--anim-delay': `${sectionDelay + 50 + sortedRewards.length * 30}ms` }}
          >
            <td colSpan="2" style={{ textAlign: 'left', paddingTop: '1rem' }}>
              <div className="total-points">Total: {totalPoints} Points</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RewardsTable;