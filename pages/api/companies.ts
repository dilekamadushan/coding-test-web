import type { NextApiRequest, NextApiResponse } from "next";
import { CompaniesApiResponse } from "../../types/companies";
import { getCompanies } from "../../lib/companies";
import { HTTP_STATUS } from "../../constants";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CompaniesApiResponse>,
) {
  const searchQuery = req.query.search as string | undefined;
  const companies = getCompanies(searchQuery);

  if (companies.length === 0)
    return res.status(HTTP_STATUS.NOT_FOUND).json({ data: [] });

  res.status(HTTP_STATUS.OK).json({ data: companies });
}
