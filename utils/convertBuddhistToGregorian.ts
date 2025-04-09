export const buddhistToGregorian = (buddhistDateStr: string): string => {
    const parts = buddhistDateStr.split("/");
    if (parts.length !== 3) return buddhistDateStr;
    const [day, month, buddhistYear] = parts;
    const gregorianYear = (parseInt(buddhistYear, 10) - 543).toString();
    return `${day}/${month}/${gregorianYear}`;
  };
  