import { format, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Smart date formatter:
 * - Today    → "17:36"
 * - Yesterday → "Ayer, 17:36"
 * - This year → "19 may, 17:36"
 * - Older     → "19 may 2024, 17:36"
 */
export function formatSmartDate(dateInput: string | Date): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const time = format(d, "HH:mm");
  if (isToday(d)) return time;
  if (isYesterday(d)) return `Ayer, ${time}`;
  const currentYear = new Date().getFullYear();
  if (d.getFullYear() === currentYear) {
    return format(d, "d MMM, HH:mm", { locale: es });
  }
  return format(d, "d MMM yyyy, HH:mm", { locale: es });
}

/**
 * Returns "Hoy", "Ayer" or formatted date without time.
 */
export function formatSmartDateShort(dateInput: string | Date): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isToday(d)) return "Hoy";
  if (isYesterday(d)) return "Ayer";
  const currentYear = new Date().getFullYear();
  if (d.getFullYear() === currentYear) {
    return format(d, "d MMM", { locale: es });
  }
  return format(d, "d MMM yyyy", { locale: es });
}
