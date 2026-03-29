import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../companies";
import { ApiResponse, CompaniesPagination } from "../../../types/companies";
import { DEFAULT_PAGE_SIZE } from "../../../constants";

function buildMockRes() {
  const res = {
    statusCode: 0,
    body: null as unknown,
    status(this: { statusCode: number }, code: number) {
      this.statusCode = code;
      return this;
    },
    json(this: { body: unknown }, data: unknown) {
      this.body = data;
      return this;
    },
  } as unknown as NextApiResponse<ApiResponse<CompaniesPagination>>;
  return res as typeof res & {
    statusCode: number;
    body: ApiResponse<CompaniesPagination>;
  };
}

const req = { query: {} } as unknown as NextApiRequest;

describe("GET /api/companies with query params", () => {
  describe("successful status codes", () => {
    it("when no query params, should respond with valid json with expected properties", () => {
      const res = buildMockRes();
      handler(req, res);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data.companies)).toBe(true);
      // page 1 with default PAGE_SIZE returns a subset of the total
      expect(res.body.data.companies.length).toBeLessThanOrEqual(3);
      expect(res.body.data.totalCount).toBe(5);

      for (const company of res.body.data.companies) {
        expect(company).toHaveProperty("companyId");
        expect(company).toHaveProperty("companyName");
        expect(company).toHaveProperty("displayName");
        expect(company).toHaveProperty("companyCountry");
        expect(company).toHaveProperty("companyTicker");
        expect(company).toHaveProperty("events");
        expect(Array.isArray(company.events)).toBe(true);
      }
    });
    it("filters results as expected with search query", () => {
      const res = buildMockRes();
      const searchReq = {
        query: { search: "okea" },
      } as unknown as NextApiRequest;
      handler(searchReq, res);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.companies).toHaveLength(1);
      expect(res.body.data.companies[0].companyName).toBe("OKEA");
      // verify pagination data
      expect(res.body.data.totalCount).toBe(1);
      expect(res.body.data.totalPages).toBe(1);
    });

    describe("when using query params", () => {
      it("supports  page  param", () => {
        const res = buildMockRes();
        const pageReq = { query: { page: "2" } } as unknown as NextApiRequest;
        handler(pageReq, res);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.companies.length).toBe(2); // 5 companies, page 2
      });

      it("supports limit query param", () => {
        const res = buildMockRes();
        const limitReq = { query: { limit: "5" } } as unknown as NextApiRequest;
        handler(limitReq, res);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.companies.length).toBe(5);
        expect(res.body.data.totalPages).toBe(1); // ceil(5 / 5)
      });

      it("falls back to default limit when limit is invalid", () => {
        const res = buildMockRes();
        const badReq = { query: { limit: "abc" } } as unknown as NextApiRequest;
        handler(badReq, res);

        expect(res.statusCode).toBe(200);
        expect(res.body.data.companies.length).toBeLessThanOrEqual(
          DEFAULT_PAGE_SIZE,
        );
      });
    });
  });

  describe("error status codes", () => {
    it("returns 404 when search query has no matches", () => {
      const res = buildMockRes();
      const searchReq = {
        query: { search: "zzznomatch" },
      } as unknown as NextApiRequest;
      handler(searchReq, res);

      expect(res.statusCode).toBe(404);
      expect(res.body.data.companies).toHaveLength(0);
    });
  });
});
