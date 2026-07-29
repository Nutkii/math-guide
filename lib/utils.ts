import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGEL(amount: number) {
  // Intl.NumberFormat's GEL currency-symbol resolution differs between
  // Node's ICU data and browsers (falls back to "GEL" vs "₾"), which caused
  // a hydration mismatch once tutor cards started rendering inside a client
  // boundary. Format manually so server and client always agree.
  return `₾${Math.round(amount).toLocaleString("en-US")}`;
}
