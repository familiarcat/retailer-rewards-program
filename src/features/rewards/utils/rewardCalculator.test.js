import { calculateRewardPoints } from './rewardCalculator';

describe('rewardCalculator', () => {
  describe('Standard Reward Logic', () => {
    test('calculates correct points for amounts > $100', () => {
      // $120 -> (20 * 2) + 50 = 90 points
      expect(calculateRewardPoints(120)).toBe(90);
      // $101 -> (1 * 2) + 50 = 52 points
      expect(calculateRewardPoints(101)).toBe(52);
    });

    test('calculates correct points for amounts between $50 and $100', () => {
      // $51 -> (51 - 50) * 1 = 1 point
      expect(calculateRewardPoints(51)).toBe(1);
      // $99 -> (99 - 50) * 1 = 49 points
      expect(calculateRewardPoints(99)).toBe(49);
    });
  });

  describe('Edge Cases', () => {
    test('returns 50 points for exactly $100', () => {
      // $100 -> (100 - 50) * 1 = 50 points (no 2x bonus yet)
      expect(calculateRewardPoints(100)).toBe(50);
    });

    test('returns 0 points for exactly $50', () => {
      expect(calculateRewardPoints(50)).toBe(0);
    });

    test('returns 0 points for amounts < $50', () => {
      expect(calculateRewardPoints(49)).toBe(0);
      expect(calculateRewardPoints(1)).toBe(0);
      expect(calculateRewardPoints(0)).toBe(0);
    });

    test('handles decimal values by flooring input', () => {
      // $120.99 -> treats as $120 -> 90 points
      expect(calculateRewardPoints(120.99)).toBe(90);
      // $50.99 -> treats as $50 -> 0 points
      expect(calculateRewardPoints(50.99)).toBe(0);
    });
  });

  describe('Defensive Coding', () => {
    test('returns 0 for invalid types or negative numbers', () => {
      expect(calculateRewardPoints(-100)).toBe(0);
      expect(calculateRewardPoints(null)).toBe(0);
      expect(calculateRewardPoints(undefined)).toBe(0);
      expect(calculateRewardPoints('100')).toBe(0); // Strings should not be parsed implicitly
    });
  });
});