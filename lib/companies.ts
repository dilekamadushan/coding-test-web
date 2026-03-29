import { companies } from "../data/companies";
import { Company } from "../types/companies";

/* This file serves as backend service layer  */
export function getCompanies(query?: string): Company[] {
  if (!query) return companies;

  const nameQuery = query.toLowerCase();

  return companies.filter(
    (company) =>
      company.companyName.toLowerCase().includes(nameQuery) ||
      company.displayName.toLowerCase().includes(nameQuery) ||
      company.companyTicker.toLowerCase().includes(nameQuery),
  );
}
