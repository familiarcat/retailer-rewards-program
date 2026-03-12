import { useState, useEffect } from 'react';
import { getRewardsData } from '../services/rewardsService';

/**
 * Custom hook that fetches and manages the state for aggregated rewards data.
 *
 * @returns {{ rewards: Array, loading: boolean, error: Error | null }}
 */
export const useRewards = () => {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setLoading(true);
        const rewardsData = await getRewardsData();
        setRewards(rewardsData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  return { rewards, loading, error };
};

export default useRewards;
