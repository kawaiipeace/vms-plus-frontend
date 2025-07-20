export const formatPhoneNumber = (phone: string | number): string => {
    const digitsOnly = String(phone).replace(/\D/g, ""); // Remove non-digits
    if (digitsOnly.length !== 10) return String(phone); // Return as-is if not 10 digits
  
    return digitsOnly.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };
  