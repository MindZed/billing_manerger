/**
 * Get the *billing* period (which is the *previous* month) in format "MMM YYYY"
 * Example: If it's November, this returns "Oct 2025"
 */
export function getBillingPeriod(): string {
  const date = new Date();
  // Go back to the previous month
  date.setMonth(date.getMonth() - 1);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    year: 'numeric' 
  });
}

/**
 * Format a date to ISO date string (YYYY-MM-DD)
 */
export function formatDateToISO(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get the current month name
 */
export function getCurrentMonth(): string {
  return new Date().toLocaleDateString('en-US', { month: 'long' });
}

/**
 * Get the current year
 */
export function getCurrentYear(): number {
  return new Date().getFullYear();
}
