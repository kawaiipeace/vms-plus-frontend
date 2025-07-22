export function toISODateTime(date: string, time: string): string {
    // Combine date and time, assume local time
    const localDate = new Date(`${date}T${time}:00`);
    return localDate.toISOString(); // Converts to UTC format with .000Z
  }
  