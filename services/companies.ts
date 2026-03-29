import type { CompaniesPagination } from "../types/companies";
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  HTTP_STATUS,
} from "../constants";

export async function fetchCompanies(
  query?: string,
  page = DEFAULT_PAGE_NUMBER,
  limit = DEFAULT_PAGE_SIZE,
): Promise<CompaniesPagination> {
  const params: Record<string, string> = { page: String(page) };
  if (query) params.search = query;
  params.limit = String(limit);
  const url = `/api/companies?${new URLSearchParams(params)}`;

  const response = await fetch(url);
  // no companies found for the search query
  if (response.status === HTTP_STATUS.NOT_FOUND)
    return { companies: [], totalCount: 0, totalPages: 0 };

  if (!response.ok)
    // show a generic error message instead of internal status codes
    throw new Error(`Failed to load companies, Please try again`);

  const { data } = await response.json();

  return data;
}
