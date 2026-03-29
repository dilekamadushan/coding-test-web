export const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
} as const;

export const DEFAULT_PAGE_SIZE = 3;
export const DEFAULT_PAGE_NUMBER = 1;
export const PAGE_SIZE_OPTIONS = [DEFAULT_PAGE_SIZE, 5, 10] as const;
