import { fetchCompanies } from "../companies";
import { companies } from "../../data/companies";

describe("getCompanies", () => {
  beforeAll(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            data: companies,
          }),
      }),
    ) as jest.Mock;
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("when the API call is successful", () => {
    describe("when an empty string query is provided (initial load)", () => {
      it("calls the API without search params", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({ data: companies }),
        });

        const apiResponse = await fetchCompanies("");

        expect(global.fetch).toHaveBeenCalledWith("/api/companies");

        expect(Array.isArray(apiResponse.data)).toBe(true);
        expect(apiResponse.data.length).toEqual(5);

        for (const company of apiResponse.data) {
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
          json: () => Promise.resolve({ data: [] }),
        });

        await fetchCompanies("okea");

        expect(global.fetch).toHaveBeenCalledWith("/api/companies?search=okea");
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

      expect(global.fetch).toHaveBeenCalledWith("/api/companies");
      expect(jsonMock).not.toHaveBeenCalled();
    });
  });

    describe("when the API returns 404", () => {
      it("returns empty data without throwing", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: jest.fn(),
        });

        const result = await fetchCompanies("zzznomatch");

        expect(result).toEqual({ data: [] });
      });
    });
});
