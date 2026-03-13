import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomerRewards from './CustomerRewards';
import * as useRewardsModule from '../hooks/useRewards';

// Mock the hook so components tests stay fast and deterministic
jest.mock('../hooks/useRewards');

const mockRewardsData = [
  {
    customerId: 'Alice Johnson',
    monthlyRewards: [{ month: 'January', points: 90 }],
    totalPoints: 90,
  },
];

describe('CustomerRewards component', () => {

  test('shows a loading indicator while data is being fetched', () => {
    useRewardsModule.useRewards.mockReturnValue({
      rewards: [],
      loading: true,
      error: null,
    });
    render(<CustomerRewards />);
    expect(screen.getByText(/loading rewards data/i)).toBeInTheDocument();
  });

  test('shows an error message when the hook returns an error', () => {
    useRewardsModule.useRewards.mockReturnValue({
      rewards: [],
      loading: false,
      error: new Error('Failed to fetch'),
    });
    render(<CustomerRewards />);
    expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument();
  });

  test('shows an error message when error is a plain string', () => {
    useRewardsModule.useRewards.mockReturnValue({
      rewards: [],
      loading: false,
      error: 'Service unavailable',
    });
    render(<CustomerRewards />);
    expect(screen.getByText(/Service unavailable/i)).toBeInTheDocument();
  });

  test('renders a customer section with rewards when data loads', () => {
    useRewardsModule.useRewards.mockReturnValue({
      rewards: mockRewardsData,
      loading: false,
      error: null,
    });
    render(<CustomerRewards />);
    // Customer heading
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    // Month appears in the table
    expect(screen.getByText('January')).toBeInTheDocument();
    // Points cell
    expect(screen.getByText('90')).toBeInTheDocument();
    // Total points summary
    expect(screen.getByText(/Total: 90/i)).toBeInTheDocument();
  });

  test('shows an empty-state message when rewards list is empty', () => {
    useRewardsModule.useRewards.mockReturnValue({
      rewards: [],
      loading: false,
      error: null,
    });
    render(<CustomerRewards />);
    expect(screen.getByText(/No rewards data available/i)).toBeInTheDocument();
  });
});
