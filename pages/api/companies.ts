// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { CompaniesApiResponse } from "../../types/companies";
import { getCompanies } from "../../lib/companies";

export default function handler(
  _: NextApiRequest,
  res: NextApiResponse<CompaniesApiResponse>,
) {
  const companies = getCompanies();

  res.status(200).json({ data: companies });
}
