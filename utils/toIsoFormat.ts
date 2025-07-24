export function toISODateTime(date: string, time: string): string {
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
  
    // Construct a UTC time directly — treat inputs as UTC
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  
    return utcDate.toISOString(); // Output will be in Z format, no local shift
  }
  