/**
 * Calculates reward points for a given transaction amount.
 *
 * Rules:
 *   - $0 – $50:   0 points
 *   - $51 – $100: 1 point per dollar above $50
 *   - $100+:      50 points + 2 points per dollar above $100
 *
 * Fractional dollars are floored before calculation.
 *
 * @param {number} amount - The transaction amount in dollars.
 * @returns {number} The reward points earned.
 */
export const calculateRewards = (amount) => {
  if (amount == null || typeof amount !== 'number' || isNaN(amount) || amount < 0) {
    return 0;
  }

  const dollars = Math.floor(amount);

  if (dollars <= 50) return 0;
  if (dollars <= 100) return dollars - 50;
  return 50 + (dollars - 100) * 2;
};
