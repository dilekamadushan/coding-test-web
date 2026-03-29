import type { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse, CompaniesPagination } from "../../types/companies";
import { getCompanies } from "../../lib/companies";
import {
  HTTP_STATUS,
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_NUMBER,
} from "../../constants";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<CompaniesPagination>>,
) {
  const searchQuery = req.query.search as string | undefined;
  // extract query params
  const page = Math.max(
    DEFAULT_PAGE_NUMBER,
    parseInt(req.query.page as string) || 1,
  );
  const limit = Math.max(
    DEFAULT_PAGE_SIZE,
    parseInt(req.query.limit as string) || DEFAULT_PAGE_SIZE,
  );

  const { companies, totalCount, totalPages } = getCompanies(searchQuery, page, limit);

  if (companies.length === 0)
    return res.status(HTTP_STATUS.NOT_FOUND).json({ data: { companies: [], totalCount, totalPages } });

  res.status(HTTP_STATUS.OK).json({ data: { companies, totalCount, totalPages } });
}
