import type { CompaniesApiResponse } from "../types/companies";

export async function fetchCompanies(): Promise<CompaniesApiResponse> {
  const response = await fetch("/api/companies");
  if (!response.ok)
    throw new Error(`Failed to fetch companies: ${response.status}`);

  return response.json() as Promise<CompaniesApiResponse>;
}
