import { getCompanies } from "../companies";

describe("getCompanies", () => {
  describe("without a query", () => {
    it("returns all 5 companies", () => {
      expect(getCompanies()).toHaveLength(5);
    });

    it("returns all 5 companies when query is empty string", () => {
      expect(getCompanies("")).toHaveLength(5);
    });
  });

  describe("filtering", () => {
    it("matches by companyName (case-insensitive)", () => {
      const results = getCompanies("okea");
      expect(results).toHaveLength(1);
      expect(results[0].companyName).toBe("OKEA");
    });

    it("matches by displayName (case-insensitive)", () => {
      const results = getCompanies("atria");
      expect(results).toHaveLength(1);
      expect(results[0].displayName.trim()).toBe("Atria");
    });

    it("matches by companyTicker (case-insensitive)", () => {
      const results = getCompanies("mgn");
      expect(results).toHaveLength(1);
      expect(results[0].companyTicker).toBe("MGN");
    });

    it("returns multiple results for a partial query", () => {
      const results = getCompanies("m");
      expect(results.length).toBeGreaterThan(1);
    });

    it("returns an empty array when no match is found", () => {
      expect(getCompanies("zzznomatch")).toHaveLength(0);
    });
  });
});
