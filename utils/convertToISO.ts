export function convertToISO(dateStr: string, timeStr: string): string {
    const [day, month, buddhistYear] = dateStr.split('/').map(Number);
    const gregorianYear = buddhistYear - 543;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date(Date.UTC(gregorianYear, month - 1, day, hours, minutes));
    return date.toISOString();
  }