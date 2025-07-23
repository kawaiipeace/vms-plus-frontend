export function toISODateTime(date: string, time: string): string {
    const localDate = new Date(`${date}T${time}:00`);
    return localDate.toISOString().replace('.000', '');
  }
  