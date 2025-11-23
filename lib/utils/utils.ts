import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(lastIndex: number = 9) {
  return Math.random().toString(36).slice(2, lastIndex);
}

/**
 * Recursivamente elimina todas las propiedades `__typename` de un objeto o array.
 * Útil para limpiar datos de GraphQL antes de enviarlos en mutaciones.
 */
export function removeTypename<T>(obj: T): T {
  // Maneja null, undefined o valores primitivos
  if (obj === null || obj === undefined || typeof obj !== "object") {
    return obj;
  }

  // Maneja arrays
  if (Array.isArray(obj)) {
    return obj.map(removeTypename) as T;
  }

  // Maneja objetos
  const newObj = {} as T;
  for (const key in obj) {
    if (key !== "__typename") {
      const typedKey = key as keyof T;
      newObj[typedKey] = removeTypename(obj[typedKey]);
    }
  }

  return newObj;
}
