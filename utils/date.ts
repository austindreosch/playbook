import { format, isThisYear } from 'date-fns';

export function formatRelativeDate(date: Date | string): string {
  const formatString = isThisYear(date) ? 'MMM dd' : 'MMMM dd, yyyy';
  return format(date, formatString);
}

export function formatRelativeDateShortMonth(date: Date | string): string {
  const formatString = isThisYear(date) ? 'MMM dd' : 'MMMM dd, yyyy';
  return format(date, formatString);
}
