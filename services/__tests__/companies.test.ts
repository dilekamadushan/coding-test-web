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
    it("returns an array of companies with expected properties", async () => {
      const apiResponse = await fetchCompanies();

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

      expect(global.fetch).toHaveBeenCalledWith("/api/companies");
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
});
