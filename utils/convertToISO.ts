export function convertToISO(dateStr: string, timeStr: string): string {
  console.log("Converting date and time to ISO format:", dateStr, timeStr);
  
  // Determine separator
  const separator = dateStr.includes("/") ? "/" : "-";
  const parts = dateStr.split(separator).map(Number);

  let day: number, month: number, year: number;

  if (separator === "/" && parts[2] > 2500) {
    // Format: dd/mm/yyyy (Buddhist calendar)
    [day, month, year] = parts;
    year -= 543; // Convert to Gregorian
  } else if (separator === "/" || separator === "-") {
    // Format: yyyy-mm-dd or yyyy/mm/dd
    [year, month, day] = parts;
  } else {
    throw new Error("Unsupported date format.");
  }

  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  return date.toISOString();
}
