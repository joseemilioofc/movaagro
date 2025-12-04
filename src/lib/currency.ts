// Currency formatting utilities for Mozambican Metical (MZN)

export const formatMZN = (value: number): string => {
  return value.toLocaleString("pt-MZ", { 
    style: "currency", 
    currency: "MZN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

export const formatMZNCompact = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M MZN`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K MZN`;
  }
  return formatMZN(value);
};

export const parseMZNInput = (value: string): number => {
  // Remove thousand separators and convert comma to dot for decimal
  return parseFloat(value.replace(/\./g, "").replace(",", "."));
};

export const formatMZNInput = (value: string): string => {
  // Remove everything except digits and comma
  let cleaned = value.replace(/[^\d,]/g, "");
  
  // Ensure only one comma
  const parts = cleaned.split(",");
  if (parts.length > 2) {
    cleaned = parts[0] + "," + parts.slice(1).join("");
  }
  
  // Limit decimals to 2 digits
  if (parts.length === 2 && parts[1].length > 2) {
    cleaned = parts[0] + "," + parts[1].slice(0, 2);
  }
  
  // Add thousand separators
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  return parts.length === 2 ? `${integerPart},${parts[1]}` : integerPart;
};
