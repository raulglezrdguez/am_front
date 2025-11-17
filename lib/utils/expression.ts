import { ExpressionInput } from "../types/exam";

export const displayValue = (val: ExpressionInput["value"]): string => {
  if (typeof val === "boolean") return val ? "true" : "false";
  return String(val ?? "");
};

export const parseValue = (
  val: string,
  prevValue: ExpressionInput["value"]
): ExpressionInput["value"] => {
  // Intenta mantener el tipo anterior
  if (typeof prevValue === "boolean") return val === "true";
  if (typeof prevValue === "number") return Number(val);
  return val; // string por defecto
};
