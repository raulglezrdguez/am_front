import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(lastIndex: number = 9) {
  return Math.random().toString(36).slice(2, lastIndex);
}
