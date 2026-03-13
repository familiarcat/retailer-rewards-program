import React from 'react';
import useAnimateIn from '../../../hooks/useAnimateIn';

/**
 * Presentational component that displays monthly reward breakdown
 * and total points for a single customer.
 *
 * @param {{ rewards: Array<{ month: string, points: number }>, totalPoints: number }} props
 */
const RewardsTable = ({ rewards = [], totalPoints = 0 }) => {
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

            return (
              <tr
                key={month}
                className="anim-fade-up"
                style={{ '--anim-delay': `${idx * 40}ms` }}
              >
                <td>{month}</td>
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
