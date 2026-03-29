import { companies } from "../data/companies";
import { Company, CompaniesPagination } from "../types/companies";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from "../constants";

/* This file serves as backend service layer  */

function filterCompanies(query?: string): Company[] {
  if (!query) return companies;

  const nameQuery = query.toLowerCase();

  return companies.filter(
    (company) =>
      company.companyName.toLowerCase().includes(nameQuery) ||
      company.displayName.toLowerCase().includes(nameQuery) ||
      company.companyTicker.toLowerCase().includes(nameQuery),
  );
}

export function getCompanies(
  query?: string,
  page = DEFAULT_PAGE_NUMBER,
  limit = DEFAULT_PAGE_SIZE,
): CompaniesPagination {
  const filtered = filterCompanies(query);
  const totalCount = filtered.length;
  const totalPages = totalCount > 0 ? Math.ceil(totalCount / limit) : 0;
  const startIndex = Math.max(0, (page - 1) * limit);

  return {
    companies: filtered.slice(startIndex, startIndex + limit),
    totalCount,
    totalPages,
  };
}
