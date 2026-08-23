import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases condicionales y resuelve conflictos de Tailwind - usado por todos los componentes de ui/. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
