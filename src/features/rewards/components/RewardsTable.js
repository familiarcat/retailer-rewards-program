import React from 'react';
import useAnimateIn from '../../../hooks/useAnimateIn';

/**
 * Presentational component that displays monthly reward breakdown
 * and total points for a single customer.
 *
 * @param {{
 *   rewards: Array<{ month: string, points: number }>,
 *   totalPoints: number,
 *   customerId?: string,
 *   onMonthClick?: (customerId: string, month: string) => void
 * }} props
 *   When onMonthClick is provided each row becomes interactive:
 *   clicking navigates to the Transaction Log filtered to that customer + month.
 */
const RewardsTable = ({ rewards = [], totalPoints = 0, customerId = null, onMonthClick = null }) => {
  // Triggers after the first two animation frames so CSS transition animates
  // the bar from width: 0 → target width rather than jumping to final state.
  const animated = useAnimateIn();

  if (!rewards.length) {
    return (
      <div className="rewards-table">
        <p className="empty">No rewards data available</p>
      </div>
    );
  }

  const maxPts = Math.max(...rewards.map((r) => r.points), 1);

  return (
    <div className="rewards-table">
      <table>
        <caption className="rw-caption">Rewards Table</caption>
        <thead>
          <tr>
            <th>Month</th>
            <th>Points Earned</th>
          </tr>
        </thead>
        <tbody>
          {rewards.map(({ month, points }, idx) => {
            // rawPct = true proportion of this row's points vs the highest month.
            // barPct = visual bar width (minimum 4px-equivalent so zero shows a stub).
            const rawPct = Math.round((points / maxPts) * 100);
            const barPct = Math.max(rawPct, 4);

            // backgroundSize trick: the gradient is always drawn at full-track width,
            // so the bar's clipped width reveals only the correct amber→green slice.
            const bgSize = rawPct > 0
              ? `${Math.round(10000 / rawPct)}% 100%`
              : '10000% 100%';

            const isClickable = Boolean(onMonthClick && customerId);

            return (
              <tr
                key={month}
                className={`anim-fade-up${isClickable ? ' rw-row--clickable' : ''}`}
                style={{ '--anim-delay': `${idx * 40}ms` }}
                onClick={isClickable ? () => onMonthClick(customerId, month) : undefined}
                role={isClickable ? 'button' : undefined}
                tabIndex={isClickable ? 0 : undefined}
                onKeyDown={isClickable
                  ? (e) => (e.key === 'Enter' || e.key === ' ') && onMonthClick(customerId, month)
                  : undefined}
                aria-label={isClickable ? `View ${month} transactions for ${customerId}` : undefined}
              >
                <td>
                  <span className="rw-month-label">{month}</span>
                  {isClickable && <span className="rw-month-chevron" aria-hidden="true">›</span>}
                </td>
                <td className="rw-td-pts">
                  <div className="pts-visual">
                    <div
                      className="pts-bar"
                      style={{
                        width: animated ? `${barPct}%` : '0%',
                        backgroundSize: bgSize,
                      }}
                      aria-hidden="true"
                    />
                    <span className="pts-num">{points}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="total-points">Total Points: {totalPoints}</p>
    </div>
  );
};

export default RewardsTable;
