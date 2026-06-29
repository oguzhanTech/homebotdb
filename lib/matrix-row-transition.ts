export type MatrixTransitionDirection = "forward" | "back" | "reset";

export const MATRIX_ROW_STAGGER_MS = 26;
export const MATRIX_ROW_MAX_STAGGER_INDEX = 9;

export function matrixRowEnterClass(
  signal: number,
  direction: MatrixTransitionDirection,
): string | undefined {
  if (signal === 0) return undefined;
  return `matrix-row-enter matrix-row-enter--${direction}`;
}

export function matrixRowDelayStyle(
  rowIndex: number,
  signal: number,
): { animationDelay: string } | undefined {
  if (signal === 0) return undefined;
  const capped = Math.min(rowIndex, MATRIX_ROW_MAX_STAGGER_INDEX);
  return { animationDelay: `${capped * MATRIX_ROW_STAGGER_MS}ms` };
}
