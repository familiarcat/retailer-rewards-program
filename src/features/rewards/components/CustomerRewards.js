import React from 'react';
import { useRewards } from '../hooks/useRewards';
import RewardsTable from './RewardsTable';

/**
 * Container component that drives the rewards dashboard.
 * Delegates all data-fetching and computation to the useRewards hook.
 *
 * @param {{ filterCustomerId?: string|null, phase?: string }} props
 *   phase — forwarded from useViewTransition so sections can play their
 *   exit animation ('exiting') in addition to their entry animation.
 */
const CustomerRewards = ({ filterCustomerId = null, phase = 'idle' }) => {
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

  const isExiting = phase === 'exiting';

  return (
    <div className="customer-rewards">
      {filterCustomerId && (
        <p
          className={`filter-notice ${isExiting ? 'anim-exit-fade' : 'anim-fade-in'}`}
          style={{ '--anim-delay': '0ms' }}
        >
          Showing results for <strong>{filterCustomerId}</strong>
        </p>
      )}
      {visible.map((customer, idx) => {
        // Intro: sections cascade in with 60 ms stagger.
        // Outro: same stagger direction but compressed to 20 ms so all sections
        //        finish well within the 230 ms outro window.
        const delay = isExiting ? `${idx * 20}ms` : `${idx * 60}ms`;
        const sectionAnim = isExiting ? 'anim-exit-down' : 'anim-fade-up';

        return (
          <section
            key={customer.customerId}
            className={`customer-section ${sectionAnim}`}
            style={{ '--anim-delay': delay }}
          >
            {/* Heading slides in from the left independently for visual depth */}
            <h2
              className={`customer-id ${isExiting ? 'anim-exit-left' : 'anim-slide-left'}`}
              style={{ '--anim-delay': delay }}
            >
              {customer.customerId}
            </h2>
            <RewardsTable
              rewards={customer.monthlyRewards}
              totalPoints={customer.totalPoints}
              customerId={customer.customerId}
              sectionDelay={idx * 60}
            />
          </section>
        );
      })}
    </div>
  );
};

export default CustomerRewards;
