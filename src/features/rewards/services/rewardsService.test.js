import { getRewardsData } from './rewardsService';
import * as transactionService from './transactionService';

// Isolate the service under test from the real network call
jest.mock('./transactionService', () => ({
  getTransactions: jest.fn(),
}));

const mockTransactions = [
  { customerId: 'c1', amount: 120, date: '2025-01-01' }, // 90 pts
  { customerId: 'c1', amount: 70,  date: '2025-01-20' }, // 20 pts
  { customerId: 'c1', amount: 80,  date: '2025-02-01' }, // 30 pts
  { customerId: 'c2', amount: 200, date: '2025-01-15' }, // 250 pts
];

describe('rewardsService', () => {

  beforeEach(() => {
    transactionService.getTransactions.mockClear();
  });

  test('aggregates points correctly by customer and month', async () => {
    transactionService.getTransactions.mockResolvedValue(mockTransactions);

    const data = await getRewardsData();

    const c1 = data.find((r) => r.customerId === 'c1');
    expect(c1).toBeDefined();
    // c1 Jan: 90 + 20 = 110 | c1 Feb: 30 | c1 total: 140
    expect(c1.totalPoints).toBe(140);
    expect(c1.monthlyRewards.find((m) => m.month === 'January').points).toBe(110);
    expect(c1.monthlyRewards.find((m) => m.month === 'February').points).toBe(30);

    const c2 = data.find((r) => r.customerId === 'c2');
    expect(c2).toBeDefined();
    expect(c2.totalPoints).toBe(250);
    expect(c2.monthlyRewards.find((m) => m.month === 'January').points).toBe(250);
  });

  test('returns an empty array when there are no transactions', async () => {
    transactionService.getTransactions.mockResolvedValue([]);
    const data = await getRewardsData();
    expect(data).toEqual([]);
  });

  test('skips transactions with invalid or missing data', async () => {
    transactionService.getTransactions.mockResolvedValue([
      ...mockTransactions,
      { customerId: 'c3', amount: null,   date: '2025-01-01' }, // bad amount
      { amount: 100,                       date: '2025-01-01' }, // missing customerId
    ]);
    const data = await getRewardsData();
    // Only the two valid customers (c1, c2) should appear
    expect(data.length).toBe(2);
    expect(data.map((r) => r.customerId).sort()).toEqual(['c1', 'c2']);
  });

  test('monthly rewards are sorted chronologically', async () => {
    transactionService.getTransactions.mockResolvedValue(mockTransactions);
    const data = await getRewardsData();
    const c1 = data.find((r) => r.customerId === 'c1');
    const months = c1.monthlyRewards.map((m) => m.month);
    expect(months).toEqual(['January', 'February']);
  });
});
