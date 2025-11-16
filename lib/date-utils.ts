/**
 * Get the current period (month and year) in format "MMM YYYY"
 * Example: "Nov 2025"
 */
export function getCurrentPeriod(): string {
  return new Date().toLocaleDateString('en-US', { 
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
