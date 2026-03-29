import { companies } from "../../data/companies";
import { fetchCompanies } from "../../services/companies";
import Home from "../../app/page";

import { render, screen, waitFor } from "@testing-library/react";

jest.mock("../../services/companies");

const mockedFetchCompanies = fetchCompanies as jest.MockedFunction<
  typeof fetchCompanies
>;

describe("Home Page", () => {
  beforeEach(() => {
    (fetchCompanies as jest.Mock).mockResolvedValue({
      data: companies,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Loading", () => {
    it("shows a loading indicator while fetching", () => {
      mockedFetchCompanies.mockReturnValue(new Promise(() => {}));

      render(<Home />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      // The list should not be rendered while loading
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  it("renders the list of companies after a successful fetch", async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getAllByText(/OKEA/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Magnora/)[0]).toBeInTheDocument();
  });

  describe("SearchBar", () => {
    it("renders the search input after a successful fetch", async () => {
      render(<Home />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      expect(
        screen.getByRole("searchbox", { name: /search companies/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("shows an error message when the fetch fails", async () => {
      mockedFetchCompanies.mockRejectedValue(
        new Error("Failed to load companies, Please try again"),
      );

      render(<Home />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      expect(
        screen.getByText(/Failed to load companies, Please try again/),
      ).toBeInTheDocument();
    });

  });
});
