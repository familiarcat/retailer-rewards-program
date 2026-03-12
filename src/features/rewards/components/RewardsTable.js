import React from 'react';

/**
 * Presentational component that displays monthly reward breakdown
 * and total points for a single customer.
 *
 * @param {{ rewards: Array<{ month: string, points: number }>, totalPoints: number }} props
 */
const RewardsTable = ({ rewards = [], totalPoints = 0 }) => {
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
          {rewards.map(({ month, points }) => {
            // rawPct = true proportion of this row's points vs the highest month.
            // barPct = visual bar width (minimum 4px-equivalent so zero shows a stub).
            const rawPct = Math.round((points / maxPts) * 100);
            const barPct = Math.max(rawPct, 4);

            // backgroundSize trick: the gradient is always drawn at full-track width,
            // so the bar's clipped width reveals only the correct amber→green slice.
            // A 100-pt bar (100%) shows the full amber→green span.
            // A 25-pt bar (28%) shows only the amber→pale-yellow slice.
            // A 0-pt bar (min stub) shows pure amber — no green reached yet.
            const bgSize = rawPct > 0
              ? `${Math.round(10000 / rawPct)}% 100%`
              : '10000% 100%';

            return (
              <tr key={month}>
                <td>{month}</td>
                <td className="rw-td-pts">
                  <div className="pts-visual">
                    <div
                      className="pts-bar"
                      style={{ width: `${barPct}%`, backgroundSize: bgSize }}
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
