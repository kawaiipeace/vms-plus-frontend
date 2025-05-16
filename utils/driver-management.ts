export const convertToISO8601 = (thaiDate: string): string => {
  const [day, month, buddhistYear] = thaiDate.split("/").map(Number);
  const gregorianYear = buddhistYear - 543; // แปลงปีพุทธศักราชเป็นคริสต์ศักราช
  const isoDate = new Date(Date.UTC(gregorianYear, month - 1, day)).toISOString();
  return isoDate.split(".")[0] + "Z";
};

export const convertToThaiDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // เดือนเริ่มจาก 0
  const buddhistYear = date.getFullYear() + 543; // แปลงปีคริสต์ศักราชเป็นพุทธศักราช
  return `${day}/${month}/${buddhistYear}`;
};
