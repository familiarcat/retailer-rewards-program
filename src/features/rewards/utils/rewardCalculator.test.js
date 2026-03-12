import { calculateRewards } from './rewardCalculator';

describe('calculateRewards', () => {

  // ── Boundary / zero cases ──────────────────────────────────────────────────

  test('returns 0 for amounts at or below $50', () => {
    expect(calculateRewards(0)).toBe(0);
    expect(calculateRewards(49.99)).toBe(0);
    expect(calculateRewards(50)).toBe(0);
  });

  test('returns 0 for $50.99 (floors to $50)', () => {
    expect(calculateRewards(50.99)).toBe(0);
  });

  test('returns 1 for exactly $51', () => {
    expect(calculateRewards(51)).toBe(1);
  });

  // ── $50 – $100 tier: 1 pt per dollar above $50 ───────────────────────────

  test('returns 1 point per dollar between $50 and $100', () => {
    expect(calculateRewards(75)).toBe(25);   // 75 - 50 = 25
    expect(calculateRewards(100)).toBe(50);  // 100 - 50 = 50
  });

  // ── Over $100 tier: 50 pts + 2 pts per dollar above $100 ─────────────────

  test('calculates points correctly for amounts over $100', () => {
    expect(calculateRewards(120)).toBe(90);   // 50 + (20 × 2)
    expect(calculateRewards(200)).toBe(250);  // 50 + (100 × 2)
  });

  // ── Floating-point amounts are floored ────────────────────────────────────

  test('floors fractional dollar amounts before calculating', () => {
    expect(calculateRewards(120.75)).toBe(90);  // floor → 120
    expect(calculateRewards(75.50)).toBe(25);   // floor → 75
  });

  // ── Invalid / edge-case inputs ────────────────────────────────────────────

  test('returns 0 for invalid inputs', () => {
    expect(calculateRewards(null)).toBe(0);
    expect(calculateRewards(undefined)).toBe(0);
    expect(calculateRewards('abc')).toBe(0);
    expect(calculateRewards(-100)).toBe(0);
  });
});
