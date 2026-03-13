import { getTransactions } from './transactionService';

describe('transactionService', () => {
  /**
   * This test verifies the actual implementation of the transaction service.
   * It ensures the service resolves a promise and returns the expected data
   * structure from the embedded dataset.
   */
  test('should resolve with the transaction data after a delay', async () => {
    const transactions = await getTransactions();
    // Check that it returns an array of objects
    expect(Array.isArray(transactions)).toBe(true);
    // Based on the data in transactionService.js, there are 22 transactions.
    expect(transactions.length).toBe(22);
    // Check the structure of the first item to be sure
    expect(transactions[0]).toHaveProperty('transactionId');
    expect(transactions[0]).toHaveProperty('customerId');
    expect(transactions[0]).toHaveProperty('amount');
    expect(transactions[0]).toHaveProperty('date');
    expect(transactions[0]).toHaveProperty('product');
  });
});
