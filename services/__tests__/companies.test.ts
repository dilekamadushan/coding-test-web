import { fetchCompanies } from "../companies";
import { companies } from "../../data/companies";

describe("getCompanies", () => {
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: { companies: companies },
          }),
      }),
    ) as jest.Mock;
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("when the API call is successful", () => {
    describe("when an empty string query is provided (initial load)", () => {
      it("calls the API with only the page param", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: { companies: companies } }),
        });

        const apiResponse = await fetchCompanies("");

        expect(global.fetch).toHaveBeenCalledWith(
          "/api/companies?page=1&limit=3",
        );

        expect(Array.isArray(apiResponse.companies)).toBe(true);
        expect(apiResponse.companies.length).toEqual(5);

        for (const company of apiResponse.companies) {
          expect(company).toHaveProperty("companyId");
          expect(company).toHaveProperty("companyName");
          expect(company).toHaveProperty("displayName");
          expect(company).toHaveProperty("companyCountry");
          expect(company).toHaveProperty("companyTicker");
          expect(company).toHaveProperty("events");
          expect(Array.isArray(company.events)).toBe(true);
        }
      });
    });

    describe("when a search query is provided", () => {
      it("calls the API with the search param", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: { companies: [] } }),
        });

        await fetchCompanies("okea");

        expect(global.fetch).toHaveBeenCalledWith(
          "/api/companies?page=1&search=okea&limit=3",
        );
      });
    });

    describe("when a page number is provided", () => {
      it("includes the page as a query param", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: { companies: [] } }),
        });

        await fetchCompanies(undefined, 2);

        expect(global.fetch).toHaveBeenCalledWith(
          "/api/companies?page=2&limit=3",
        );
      });
    });

    describe("when a limit is provided", () => {
      it("includes the limit as a query param", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: { companies: [] } }),
        });

        await fetchCompanies(undefined, 1, 5);

        expect(global.fetch).toHaveBeenCalledWith(
          "/api/companies?page=1&limit=5",
        );
      });
    });
  });

  describe("when the API call fails", () => {
    let jsonMock: jest.Mock;
    beforeAll(() => {
      jsonMock = jest.fn().mockResolvedValue({});

      (global.fetch as jest.Mock).mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: jsonMock,
        }),
      );
    });

    it("throws an error with the status code", async () => {
      await expect(fetchCompanies()).rejects.toThrow(
        "Failed to load companies, Please try again",
      );

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/companies?page=1&limit=3",
      );
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

    describe("when the API returns 404", () => {
      it("returns empty data without throwing", async () => {
        const emptyMeta = { totalCount: 0, totalPages: 0 };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: jest.fn().mockResolvedValue({ data: { companies: [], ...emptyMeta } }),
        });

        const result = await fetchCompanies("zzznomatch");

        expect(result.companies).toEqual([]);
        expect(result.totalCount).toBe(0);
        expect(result.totalPages).toBe(0);
      });
    });
});
