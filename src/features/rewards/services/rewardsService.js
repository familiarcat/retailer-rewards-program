import { getTransactions } from './transactionService';
import { calculateRewards } from '../utils/rewardCalculator';
import { getMonthName } from '../utils/dateUtils';

/**
 * Fetches all transactions and aggregates reward points by customer and month.
 * Simulates a GET /rewards endpoint.
 *
 * @returns {Promise<Array<{
 *   customerId: string,
 *   monthlyRewards: Array<{ month: string, points: number }>,
 *   totalPoints: number
 * }>>}
 */
export const getRewardsData = async () => {
  const transactions = await getTransactions();

  const customerMap = new Map();

  transactions.forEach((t) => {
    // Skip transactions with missing or invalid fields
    if (!t.customerId || typeof t.amount !== 'number') return;

    const points = calculateRewards(t.amount);
    const month  = getMonthName(t.date);

    if (!customerMap.has(t.customerId)) {
      customerMap.set(t.customerId, { totalPoints: 0, monthlyPoints: {} });
    }

    const data = customerMap.get(t.customerId);
    data.totalPoints += points;
    data.monthlyPoints[month] = (data.monthlyPoints[month] || 0) + points;
  });

  // Convert internal Map to a UI-friendly array, months sorted chronologically
  return Array.from(customerMap.entries()).map(([customerId, data]) => {
    const monthlyRewards = Object.entries(data.monthlyPoints)
      .map(([month, points]) => ({ month, points }))
      .sort((a, b) => new Date(`1 ${a.month} 2025`) - new Date(`1 ${b.month} 2025`));

    return { customerId, monthlyRewards, totalPoints: data.totalPoints };
  });
};
