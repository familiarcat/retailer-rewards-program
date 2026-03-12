/**
 * Returns the full month name for a given ISO date string.
 * Uses a fixed timezone offset to avoid UTC boundary issues.
 *
 * @param {string} dateString - ISO date string, e.g. "2025-01-14".
 * @returns {string} Full month name, e.g. "January".
 */
export const getMonthName = (dateString) => {
  if (!dateString) return 'Unknown';
  // Append time to avoid UTC conversion shifting the day
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleString('en-US', { month: 'long' });
};
