export const MATRIX_PAGE_SIZE = 20;

export function getPageCount(total: number, pageSize = MATRIX_PAGE_SIZE): number {
  if (total <= 0) return 1;
  return Math.ceil(total / pageSize);
}

export function clampPage(page: number, pageCount: number): number {
  if (pageCount <= 0) return 1;
  return Math.min(Math.max(1, page), pageCount);
}

export type PaginatedResult<T> = {
  items: T[];
  startIndex: number;
  endIndex: number;
  page: number;
  pageCount: number;
  total: number;
};

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize = MATRIX_PAGE_SIZE,
): PaginatedResult<T> {
  const total = items.length;
  const pageCount = getPageCount(total, pageSize);
  const safePage = clampPage(page, pageCount);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  return {
    items: items.slice(startIndex, endIndex),
    startIndex: total === 0 ? 0 : startIndex + 1,
    endIndex,
    page: safePage,
    pageCount,
    total,
  };
}
