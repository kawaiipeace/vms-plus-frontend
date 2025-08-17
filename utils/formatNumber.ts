export const formatNumber = (
    input: string | number,
    decimals = 2,
    locale: string = "en-US"
  ): string => {
    if (input === null || input === undefined) return "";
    const n =
      typeof input === "number"
        ? input
        : Number(String(input).replace(/,/g, ""));
  
    if (!Number.isFinite(n)) return String(input);
  
    return n.toLocaleString(locale, {
      useGrouping: true,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };
  