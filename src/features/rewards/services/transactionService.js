/**
 * Simulated transaction data representing three months of customer activity.
 * In a real application this would come from a backend API.
 */
const transactions = [
  { transactionId: 'tx1001', customerId: 'Alice Johnson', product: 'Wireless Headphones',  amount: 120,  date: '2025-01-14' },
  { transactionId: 'tx1002', customerId: 'Alice Johnson', product: 'Smart Watch Band',      amount: 75,   date: '2025-02-14' },
  { transactionId: 'tx1003', customerId: 'Alice Johnson', product: 'Phone Case',            amount: 50,   date: '2025-03-14' },
  { transactionId: 'tx1004', customerId: 'Marcus Reid',   product: 'Running Shoes',         amount: 200,  date: '2025-01-16' },
  { transactionId: 'tx1005', customerId: 'Marcus Reid',   product: 'Gym Bag',               amount: 80,   date: '2025-02-16' },
  { transactionId: 'tx1006', customerId: 'Marcus Reid',   product: 'Fitness Tracker',       amount: 100,  date: '2025-03-16' },
  { transactionId: 'tx1007', customerId: 'Priya Patel',   product: 'Yoga Mat',              amount: 55,   date: '2025-01-20' },
  { transactionId: 'tx1008', customerId: 'Priya Patel',   product: 'Bluetooth Speaker',     amount: 110,  date: '2025-02-20' },
  { transactionId: 'tx1009', customerId: 'Priya Patel',   product: 'Air Purifier',          amount: 130,  date: '2025-03-20' },
];

/**
 * Simulates an asynchronous GET /transactions API call.
 * @returns {Promise<Array>} Resolves to the full transaction list.
 */
export const getTransactions = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(transactions), 500);
  });
