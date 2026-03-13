/**
 * Calculates reward points based on the transaction amount.
 *
 * Business Rules:
 * - 2 points for every dollar spent over $100.
 * - 1 point for every dollar spent between $50 and $100.
 *
 * @param {number} amount - The transaction amount.
 * @returns {number} The calculated reward points.
 */
export const calculateRewardPoints = (amount) => {
  // Defensive check for invalid inputs
  if (typeof amount !== 'number' || amount <= 50) {
    return 0;
  }

  // Use Math.floor to treat "every dollar spent" as whole integers
  const totalAmount = Math.floor(amount);

  if (totalAmount > 100) {
    return (totalAmount - 100) * 2 + 50;
  }

  return totalAmount - 50;
};