import React from 'react';
import { useRewards } from '../hooks/useRewards';
import RewardsTable from './RewardsTable';

/**
 * Container component that drives the rewards dashboard.
 * Delegates all data-fetching and computation to the useRewards hook.
 *
 * @param {{ filterCustomerId?: string|null, onMonthClick?: (customerId: string, month: string) => void }} props
 *   filterCustomerId — when set only that customer's record is shown.
 *   onMonthClick     — called when a month row in any RewardsTable is clicked,
 *                      enabling drill-through to the filtered Transaction Log.
 */
const CustomerRewards = ({ filterCustomerId = null, onMonthClick = null }) => {
  const { rewards, loading, error } = useRewards();

  if (loading) {
    return <div className="loading">Loading rewards data...</div>;
  }

  if (error) {
    const message = error instanceof Error ? error.message : String(error);
    return <div className="error">{message}</div>;
  }

  const visible = filterCustomerId
    ? rewards.filter((r) =>
        r.customerId.toLowerCase().includes(filterCustomerId.toLowerCase())
      )
    : rewards;

  if (!visible.length) {
    return (
      <div className="empty">
        {filterCustomerId
          ? `No customer found matching "${filterCustomerId}".`
          : 'No rewards data available.'}
      </div>
    );
  }

  return (
    <div className="customer-rewards">
      {filterCustomerId && (
        <p className="filter-notice">
          Showing results for <strong>{filterCustomerId}</strong>
        </p>
      )}
      {visible.map((customer, i) => (
        <section
          key={customer.customerId}
          className="customer-section anim-fade-up"
          style={{ '--anim-delay': `${i * 120}ms` }}
        >
          <h2 className="customer-id">{customer.customerId}</h2>
          <RewardsTable
            rewards={customer.monthlyRewards}
            totalPoints={customer.totalPoints}
            customerId={customer.customerId}
            onMonthClick={onMonthClick}
          />
        </section>
      ))}
    </div>
  );
};

export default CustomerRewards;
