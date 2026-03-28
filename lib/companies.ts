import { companies } from "../data/companies";
import { Company } from "../types/companies";

/* This file serves as backend service layer  */
export function getCompanies(): Company[] {
  return companies;
}
