import { getTransactions } from './transactionService';

describe('transactionService', () => {

  test('resolves to an array of transactions', async () => {
    const transactions = await getTransactions();
    expect(Array.isArray(transactions)).toBe(true);
    expect(transactions.length).toBeGreaterThan(0);
  });

  test('every transaction has the required fields', async () => {
    const transactions = await getTransactions();
    transactions.forEach((t) => {
      expect(t).toHaveProperty('transactionId');
      expect(t).toHaveProperty('customerId');
      expect(t).toHaveProperty('amount');
      expect(t).toHaveProperty('date');
      expect(typeof t.amount).toBe('number');
    });
  });

  test('covers at least three months of data', async () => {
    const transactions = await getTransactions();
    const months = new Set(
      transactions.map((t) => t.date.slice(0, 7)) // "YYYY-MM"
    );
    expect(months.size).toBeGreaterThanOrEqual(3);
  });
});
