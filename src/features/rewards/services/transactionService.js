/**
 * Simulated database of transactions covering a 3-month period.
 * Includes various scenarios to demonstrate logic coverage:
 * - Amounts > $100
 * - Amounts between $50 and $100
 * - Edge cases (exactly $100, exactly $50)
 * - Small amounts (< $50)
 */
const TRANSACTIONS = [
  // Customer 1: Alice Johnson (Mixed high/low/edge)
  { transactionId: 'tx_001', customerId: 'Alice Johnson', amount: 120.00, date: '2025-01-15', product: 'Gaming Headset' },       // 90 pts
  { transactionId: 'tx_002', customerId: 'Alice Johnson', amount: 75.50,  date: '2025-02-10', product: 'Wireless Mouse' },       // 25 pts
  { transactionId: 'tx_003', customerId: 'Alice Johnson', amount: 50.00,  date: '2025-03-05', product: 'Digital Gift Card' },    // 0 pts (Edge case)
  { transactionId: 'tx_004', customerId: 'Alice Johnson', amount: 15.00,  date: '2025-03-20', product: 'USB-C Cable' },          // 0 pts
  { transactionId: 'tx_005', customerId: 'Alice Johnson', amount: 12.99,  date: '2025-01-25', product: 'Screen Cleaner' },       // 0 pts

  // Customer 2: Marcus Reid (High spender + edge cases)
  { transactionId: 'tx_006', customerId: 'Marcus Reid', amount: 200.00, date: '2025-01-22', product: 'Mechanical Keyboard' },  // 250 pts
  { transactionId: 'tx_007', customerId: 'Marcus Reid', amount: 100.00, date: '2025-02-14', product: 'External SSD 1TB' },     // 50 pts (Edge case)
  { transactionId: 'tx_008', customerId: 'Marcus Reid', amount: 80.00,  date: '2025-02-28', product: 'Webcam 1080p' },         // 30 pts
  { transactionId: 'tx_009', customerId: 'Marcus Reid', amount: 250.00, date: '2025-03-12', product: '27-inch Monitor' },      // 350 pts
  { transactionId: 'tx_010', customerId: 'Marcus Reid', amount: 25.00,  date: '2025-01-30', product: 'Gaming Mouse Pad' },     // 0 pts

  // Customer 3: Diana Prince (High value items + small accessories)
  { transactionId: 'tx_011', customerId: 'Diana Prince', amount: 500.00, date: '2025-01-05', product: 'Laptop Pro 14' },       // 850 pts
  { transactionId: 'tx_012', customerId: 'Diana Prince', amount: 110.00, date: '2025-02-01', product: 'Docking Station' },     // 70 pts
  { transactionId: 'tx_013', customerId: 'Diana Prince', amount: 55.00,  date: '2025-03-15', product: 'Laptop Sleeve' },       // 5 pts
  { transactionId: 'tx_014', customerId: 'Diana Prince', amount: 5.99,   date: '2025-02-20', product: 'Sticker Pack' },        // 0 pts

  // Customer 4: Evan Wright (Consistent mid-range spender)
  { transactionId: 'tx_015', customerId: 'Evan Wright',  amount: 299.99, date: '2025-01-18', product: 'Smart Watch Gen 5' },   // ~450 pts
  { transactionId: 'tx_016', customerId: 'Evan Wright',  amount: 89.00,  date: '2025-02-10', product: 'Wireless Earbuds' },    // 39 pts
  { transactionId: 'tx_017', customerId: 'Evan Wright',  amount: 29.99,  date: '2025-02-25', product: 'Sport Watch Band' },    // 0 pts
  { transactionId: 'tx_018', customerId: 'Evan Wright',  amount: 19.99,  date: '2025-03-05', product: 'Charging Block' },      // 0 pts

  // Customer 5: Sarah Connor (Mostly low value, one rewardable)
  { transactionId: 'tx_019', customerId: 'Sarah Connor', amount: 95.00,  date: '2025-01-12', product: 'Coffee Maker' },        // 45 pts
  { transactionId: 'tx_020', customerId: 'Sarah Connor', amount: 8.50,   date: '2025-02-02', product: 'Coffee Filters' },      // 0 pts
  { transactionId: 'tx_021', customerId: 'Sarah Connor', amount: 12.00,  date: '2025-02-18', product: 'Descaling Solution' },  // 0 pts
  { transactionId: 'tx_022', customerId: 'Sarah Connor', amount: 50.00,  date: '2025-03-22', product: 'Thermal Travel Mug' },  // 0 pts (Edge case)
];

/**
 * Simulates an asynchronous API call to fetch transaction history.
 *
 * @returns {Promise<Array>} A promise that resolves to the transaction list.
 */
export const getTransactions = () => {
  return new Promise((resolve) => {
    // Simulate network delay (800ms)
    setTimeout(() => {
      resolve(TRANSACTIONS);
    }, 800);
  });
};