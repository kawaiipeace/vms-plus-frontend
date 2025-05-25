export function convertToISO(dateStr: string, timeStr: string): string {
  console.log("Converting date and time to ISO format:", dateStr, timeStr);
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  return date.toISOString();

  // const [day, month, buddhistYear] = dateStr.split("/").map(Number);
  // const gregorianYear = buddhistYear - 543;
  // const [hours, minutes] = timeStr.split(":").map(Number);
  // const date = new Date(Date.UTC(gregorianYear, month - 1, day, hours, minutes));
  // return date.toISOString();
}

export function convertToISOFromValue(value: string, timeStr: string) {
  const [year, month, day] = value.split("-").map(Number);
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  return date.toISOString();
}
