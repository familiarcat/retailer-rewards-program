import { useState, useEffect } from 'react';
import { getTransactions } from '../services/transactionService';
import { calculateRewards } from '../utils/rewardCalculator';
import { getMonthName } from '../utils/dateUtils';

/**
 * Custom hook that loads transaction data and aggregates reward points
 * by customer and month.
 *
 * @returns {{ rewards: Array, loading: boolean, error: Error|null }}
 */
export const useRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    getTransactions()
      .then((transactions) => {
        const customerMap = {};

        transactions.forEach((t) => {
          if (!t.customerId || typeof t.amount !== 'number') return;

          const points = calculateRewards(t.amount);
          const month  = getMonthName(t.date);

          if (!customerMap[t.customerId]) {
            customerMap[t.customerId] = { totalPoints: 0, monthly: {} };
          }

          customerMap[t.customerId].totalPoints += points;
          customerMap[t.customerId].monthly[month] =
            (customerMap[t.customerId].monthly[month] || 0) + points;
        });

        const result = Object.entries(customerMap).map(([customerId, data]) => ({
          customerId,
          monthlyRewards: Object.entries(data.monthly)
            .map(([month, points]) => ({ month, points }))
            .sort((a, b) => new Date(`1 ${a.month} 2025`) - new Date(`1 ${b.month} 2025`)),
          totalPoints: data.totalPoints,
        }));

        setRewards(result);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { rewards, loading, error };
};

export default useRewards;
