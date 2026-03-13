import React from 'react';

const TransactionModal = ({ isOpen, onClose, title, transactions, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop anim-fade-in" onClick={onClose}>
      <div className="modal-panel anim-glass-reveal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">×</button>
        </header>
        <div className="modal-body">
          {loading ? (
            <p className="modal-loading">Loading records...</p>
          ) : transactions.length === 0 ? (
            <p className="empty">No transactions found.</p>
          ) : (
            <ul className="modal-list">
              {transactions.map((tx) => (
                <li key={tx.transactionId} className="modal-item">
                  <div className="modal-item-main">
                    <span className="modal-product">{tx.product || 'Unknown Product'}</span>
                    <span className="modal-date">{tx.date}</span>
                  </div>
                  <div className="modal-item-meta">
                    <span className="modal-amt">${tx.amount.toFixed(2)}</span>
                    <span className={`modal-pts${tx.points === 0 ? ' modal-pts--zero' : ''}`}>
                       {/* Points aren't passed raw here usually, but if we wanted them we'd need to calc them. 
                           For now, focusing on product access. */}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;