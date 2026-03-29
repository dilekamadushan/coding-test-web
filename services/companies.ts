import type { CompaniesApiResponse } from "../types/companies";
import { HTTP_STATUS } from "../constants";

export async function fetchCompanies(
  query?: string,
): Promise<CompaniesApiResponse> {
  const params = query ? `?${new URLSearchParams({ search: query })}` : "";
  const url = `/api/companies${params}`;

  const response = await fetch(url);
  // no companies found for the search query
  if (response.status === HTTP_STATUS.NOT_FOUND) return { data: [] };

  if (!response.ok)
    // show a generic error message instead of internal status codes
    throw new Error(`Failed to load companies, Please try again`);

  return response.json() as Promise<CompaniesApiResponse>;
}
