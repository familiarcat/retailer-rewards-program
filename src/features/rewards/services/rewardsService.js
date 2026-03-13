import { getTransactions } from './transactionService';
import { calculateRewardPoints } from '../utils/rewardCalculator';
import { getMonthName } from '../utils/dateUtils';

// Month ordering helper for sorting results chronologically
const MONTH_ORDER = {
  'January': 1, 'February': 2, 'March': 3, 'April': 4, 'May': 5, 'June': 6,
  'July': 7, 'August': 8, 'September': 9, 'October': 10, 'November': 11, 'December': 12
};

/**
 * Fetches transactions and aggregates reward points by customer and month.
 *
 * @returns {Promise<Array>} Aggregated rewards data sorted by customer and month.
 */
export const getRewardsData = async () => {
  try {
    const transactions = await getTransactions();

    // 1. Group by Customer
    const customerMap = {};

    transactions.forEach((tx) => {
      // Defensive check for malformed data
      if (!tx.customerId || typeof tx.amount !== 'number') return;

      const { customerId, amount, date } = tx;
      const points = calculateRewardPoints(amount);
      const month = getMonthName(date);

      if (!customerMap[customerId]) {
        customerMap[customerId] = {
          totalPoints: 0,
          monthly: {} // Temporary map for aggregation: { "January": 90, "February": 25 }
        };
      }

      // Accumulate totals
      customerMap[customerId].totalPoints += points;

      // Accumulate monthly points
      if (!customerMap[customerId].monthly[month]) {
        customerMap[customerId].monthly[month] = 0;
      }
      customerMap[customerId].monthly[month] += points;
    });

    // 2. Transform to UI-friendly array format
    return Object.keys(customerMap).map((customerId) => {
      const { totalPoints, monthly } = customerMap[customerId];

      const monthlyRewards = Object.keys(monthly)
        .map((month) => ({ month, points: monthly[month] }))
        .sort((a, b) => (MONTH_ORDER[a.month] || 0) - (MONTH_ORDER[b.month] || 0));

      return { customerId, totalPoints, monthlyRewards };
    }).sort((a, b) => b.totalPoints - a.totalPoints);

  } catch (error) {
    console.error('Error calculating rewards:', error);
    throw error; // Re-throw to be handled by the UI/Hook
  }
};