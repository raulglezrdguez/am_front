import { ExpressionInput } from "../types/exam";
import { Operator } from "../types/exam_enums";

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

const operatorTextMap: Record<Operator, string> = {
  [Operator.EQ]: "Equal_to",
  [Operator.NE]: "Not_equal_to",
  [Operator.LT]: "Less_than",
  [Operator.GT]: "Greater_than",
  [Operator.LTE]: "Less_than_or_equal_to",
  [Operator.GTE]: "Greater_than_or_equal_to",
};

/**
 * Convierte un valor del enum Operator a texto legible
 * @param operator - Valor del enum Operator
 * @returns Texto descriptivo del operador
 */
export function getOperatorText(operator: Operator): string {
  return operatorTextMap[operator] ?? operator;
}
