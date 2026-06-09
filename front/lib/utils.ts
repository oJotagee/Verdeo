import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, decimalPlaces: number = 2) {
  return new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
}

export const formatInt = (value: number) => {
  return new Intl.NumberFormat("pt-br", 
    {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      
    }
  ).format(value);
};
