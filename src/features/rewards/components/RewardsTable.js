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
          {rewards.map(({ month, points }) => (
            <tr key={month}>
              <td>{month}</td>
              <td className="rw-td-pts">
                <div className="pts-visual">
                  <div
                    className="pts-bar"
                    style={{ width: `${Math.max(Math.round((points / maxPts) * 100), 4)}%` }}
                    aria-hidden="true"
                  />
                  <span className="pts-num">{points}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="total-points">Total Points: {totalPoints}</p>
    </div>
  );
};

export default RewardsTable;
