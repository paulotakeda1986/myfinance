/**
 * Parses a "YYYY-MM-DD" date string into a local Date object.
 * This avoids the UTC shift issue when using new Date("YYYY-MM-DD").
 */
export function parseDateOnly(dateStr: string): Date {
  if (!dateStr) return new Date();
  
  // If it's already a full ISO string with time, we might still have issues, 
  // but the backend returns DateOnly as "YYYY-MM-DD".
  const parts = dateStr.split('T')[0].split('-');
  if (parts.length !== 3) return new Date(dateStr);
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  return new Date(year, month, day);
}

/**
 * Formats a Date object to "YYYY-MM-DD" (Local).
 */
export function formatDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}
