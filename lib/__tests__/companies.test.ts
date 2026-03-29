import { getCompanies } from "../companies";

describe("getCompanies", () => {
  describe("without a query", () => {
    it("returns all companies across pages", () => {
      const { companies, totalCount } = getCompanies();
      expect(totalCount).toBe(5);
      expect(companies.length).toBeGreaterThan(0);
    });

    it("behaves the same when query is empty string", () => {
      const { companies, totalCount } = getCompanies("");
      expect(totalCount).toBe(5);
      expect(companies.length).toBeGreaterThan(0);
    });
  });

  describe("filtering", () => {
    it("matches by companyName (case-insensitive)", () => {
      const { companies } = getCompanies("okea");
      expect(companies).toHaveLength(1);
      expect(companies[0].companyName).toBe("OKEA");
    });

    it("matches by displayName (case-insensitive)", () => {
      const { companies } = getCompanies("atria");
      expect(companies).toHaveLength(1);
      expect(companies[0].displayName.trim()).toBe("Atria");
    });

    it("matches by companyTicker (case-insensitive)", () => {
      const { companies } = getCompanies("mgn");
      expect(companies).toHaveLength(1);
      expect(companies[0].companyTicker).toBe("MGN");
    });

    it("returns multiple results for a partial query", () => {
      const { companies } = getCompanies("m");
      expect(companies.length).toBeGreaterThan(1);
    });

    it("returns an empty result when no match is found", () => {
      const { companies, totalCount } = getCompanies("zzznomatch");
      expect(companies).toHaveLength(0);
      expect(totalCount).toBe(0);
    });
  });

  describe("pagination", () => {
    it("returns items for the requested page", () => {
      const page1 = getCompanies(undefined, 1, 2);
      const page2 = getCompanies(undefined, 2, 2);

      expect(page1.companies).toHaveLength(2);
      expect(page2.companies).toHaveLength(2);
      expect(page1.companies[0].companyId).not.toBe(
        page2.companies[0].companyId,
      );
      expect(getCompanies(undefined, 1, 2).totalCount).toBe(5);
      expect(getCompanies(undefined, 2, 2).totalCount).toBe(5);

      expect(getCompanies(undefined, 1, 3).totalPages).toBe(2);
      expect(getCompanies(undefined, 1, 5).totalPages).toBe(1);
      expect(getCompanies("zzznomatch").totalPages).toBe(0);
    });

    it("returns fewer items on the last page", () => {
      // 5 companies, page 2 with limit 3 → 2 items remaining
      const { companies } = getCompanies(undefined, 2, 3);
      expect(companies).toHaveLength(2);
    });

    it("returns empty data for a page beyond the total", () => {
      const { companies } = getCompanies(undefined, 99, 3);
      expect(companies).toHaveLength(0);
    });
  });
});
