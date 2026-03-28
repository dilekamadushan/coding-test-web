import type { CompaniesApiResponse } from "../types/companies";

export async function fetchCompanies(): Promise<CompaniesApiResponse> {
  const response = await fetch("/api/companies");
  if (!response.ok)
    // show a generic error message instead of internal status codes
    throw new Error(`Failed to load companies, Please try again`);

  return response.json() as Promise<CompaniesApiResponse>;
}
