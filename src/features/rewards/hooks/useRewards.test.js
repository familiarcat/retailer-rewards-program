import { renderHook, waitFor } from '@testing-library/react';
import { useRewards } from './useRewards';
import * as transactionService from '../services/transactionService';

// Replace the real async call with a controllable mock
jest.mock('../services/transactionService');

const mockTransactions = [
  { transactionId: 'tx1001', customerId: 'Alice Johnson', amount: 120, date: '2025-01-14' },
  { transactionId: 'tx1002', customerId: 'Alice Johnson', amount: 75,  date: '2025-02-14' },
  { transactionId: 'tx1003', customerId: 'Alice Johnson', amount: 50,  date: '2025-03-14' },
  { transactionId: 'tx1004', customerId: 'Marcus Reid', amount: 200, date: '2025-01-16' },
  { transactionId: 'tx1005', customerId: 'Marcus Reid', amount: 80,  date: '2025-02-16' },
  { transactionId: 'tx1006', customerId: 'Marcus Reid', amount: 100, date: '2025-03-16' },
];

describe('useRewards hook', () => {

  beforeEach(() => {
    transactionService.getTransactions.mockClear();
  });

  it('starts in a loading state', () => {
    transactionService.getTransactions.mockResolvedValue(mockTransactions);
    const { result } = renderHook(() => useRewards());
    expect(result.current.loading).toBe(true);
    expect(result.current.rewards).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('resolves rewards for all customers after loading', async () => {
    transactionService.getTransactions.mockResolvedValue(mockTransactions);
    const { result } = renderHook(() => useRewards());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.rewards).toHaveLength(2);
  });

  it('calculates correct totals for Alice Johnson', async () => {
    transactionService.getTransactions.mockResolvedValue(mockTransactions);
    const { result } = renderHook(() => useRewards());

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Alice Johnson: Jan $120 → 90 pts | Feb $75 → 25 pts | Mar $50 → 0 pts
    const c1 = result.current.rewards.find((r) => r.customerId === 'Alice Johnson');
    expect(c1.totalPoints).toBe(115);
    expect(c1.monthlyRewards).toHaveLength(3);
    expect(c1.monthlyRewards.find((m) => m.month === 'January').points).toBe(90);
    expect(c1.monthlyRewards.find((m) => m.month === 'February').points).toBe(25);
    expect(c1.monthlyRewards.find((m) => m.month === 'March').points).toBe(0);
  });

  it('calculates correct totals for Marcus Reid', async () => {
    transactionService.getTransactions.mockResolvedValue(mockTransactions);
    const { result } = renderHook(() => useRewards());

    await waitFor(() => expect(result.current.loading).toBe(false));

    // Marcus Reid: Jan $200 → 250 pts | Feb $80 → 30 pts | Mar $100 → 50 pts
    const c2 = result.current.rewards.find((r) => r.customerId === 'Marcus Reid');
    expect(c2.totalPoints).toBe(330);
    expect(c2.monthlyRewards.find((m) => m.month === 'January').points).toBe(250);
    expect(c2.monthlyRewards.find((m) => m.month === 'February').points).toBe(30);
    expect(c2.monthlyRewards.find((m) => m.month === 'March').points).toBe(50);
  });

  it('surfaces errors returned by the transaction service', async () => {
    transactionService.getTransactions.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useRewards());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toEqual(new Error('Network error'));
    expect(result.current.rewards).toEqual([]);
  });
});
