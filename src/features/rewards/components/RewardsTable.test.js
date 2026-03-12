import React from 'react';
import { render, screen } from '@testing-library/react';
import RewardsTable from './RewardsTable';

describe('RewardsTable component', () => {

  const sampleRewards = [
    { month: 'January',  points: 90 },
    { month: 'February', points: 25 },
    { month: 'March',    points: 0  },
  ];

  test('renders the "Rewards Table" heading', () => {
    render(<RewardsTable rewards={sampleRewards} totalPoints={115} />);
    expect(screen.getByText(/Rewards Table/i)).toBeInTheDocument();
  });

  test('renders a row for every month in the dataset', () => {
    render(<RewardsTable rewards={sampleRewards} totalPoints={115} />);
    sampleRewards.forEach(({ month }) => {
      expect(screen.getByText(month)).toBeInTheDocument();
    });
  });

  test('displays the correct points for each month', () => {
    render(<RewardsTable rewards={sampleRewards} totalPoints={115} />);
    // Each points value is in its own <td>
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('shows the total points summary', () => {
    render(<RewardsTable rewards={sampleRewards} totalPoints={115} />);
    expect(screen.getByText(/Total Points: 115/i)).toBeInTheDocument();
  });

  test('shows an empty-state message when no rewards are provided', () => {
    render(<RewardsTable rewards={[]} totalPoints={0} />);
    expect(screen.getByText(/No rewards data available/i)).toBeInTheDocument();
  });
});
