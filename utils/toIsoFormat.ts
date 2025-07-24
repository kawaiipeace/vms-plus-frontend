export function toISODateTime(date: string, time: string): string {
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
  
    // Create date in UTC directly
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  
    // Format manually to remove milliseconds
    const iso = utcDate.toISOString(); // e.g. "2025-07-31T08:30:00.000Z"
  
    return iso.replace('.000Z', 'Z'); // final: "2025-07-31T08:30:00Z"
  }
  