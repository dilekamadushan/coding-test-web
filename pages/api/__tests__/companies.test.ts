import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../companies";
import { CompaniesApiResponse } from "../../../types/companies";

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
  } as unknown as NextApiResponse<CompaniesApiResponse>;
  return res as typeof res & { statusCode: number; body: CompaniesApiResponse };
}

const req = {} as NextApiRequest;

describe("GET /api/companies", () => {
  it("responds with valid json with expected properties", () => {
    const res = buildMockRes();
    handler(req, res);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toEqual(5);

    for (const company of res.body.data) {
      expect(company).toHaveProperty("companyId");
      expect(company).toHaveProperty("companyName");
      expect(company).toHaveProperty("displayName");
      expect(company).toHaveProperty("companyCountry");
      expect(company).toHaveProperty("companyTicker");
      expect(company).toHaveProperty("events");
      expect(Array.isArray(company.events)).toBe(true);
    }
  });

  it("nullable fields are either string or null, never undefined", () => {
    const res = buildMockRes();
    handler(req, res);
    for (const company of res.body.data) {
      expect(
        company.iconUrl === null || typeof company.iconUrl === "string",
      ).toBe(true);
      expect(
        company.logoLightUrl === null ||
          typeof company.logoLightUrl === "string",
      ).toBe(true);
      expect(
        company.logoDarkUrl === null || typeof company.logoDarkUrl === "string",
      ).toBe(true);
      for (const event of company.events) {
        expect(
          event.qnaTimestamp === null || typeof event.qnaTimestamp === "number",
        ).toBe(true);
        expect(event.pdfUrl === null || typeof event.pdfUrl === "string").toBe(
          true,
        );
        expect(
          event.reportUrl === null || typeof event.reportUrl === "string",
        ).toBe(true);
      }
    }
  });
});
