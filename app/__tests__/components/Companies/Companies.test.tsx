import { companies } from "../../../../data/companies";
import { fetchCompanies } from "../../../../services/companies";
import Companies from "../../../../app/components/Companies/Companies";

import { render, screen, waitFor, fireEvent } from "@testing-library/react";

jest.mock("../../../../services/companies");

const mockedFetchCompanies = fetchCompanies as jest.MockedFunction<
  typeof fetchCompanies
>;

describe("Companies", () => {
  beforeEach(() => {
    (fetchCompanies as jest.Mock).mockResolvedValue({
      companies,
      totalCount: 5,
      totalPages: 1,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Loading", () => {
    it("shows a loading indicator while fetching", () => {
      mockedFetchCompanies.mockReturnValue(new Promise(() => {}));

      render(<Companies />);

      expect(screen.getByText("Loading...")).toBeInTheDocument();
      // The list should not be rendered while loading
      expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
  });

  it("renders the list of companies after a successful fetch", async () => {
    render(<Companies />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getAllByText(/OKEA/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Magnora/)[0]).toBeInTheDocument();
  });

  describe("SearchBar", () => {
    it("renders the search input after a successful fetch", async () => {
      render(<Companies />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      expect(
        screen.getByRole("searchbox", { name: /search companies/i }),
      ).toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("renders pagination controls when totalPages > 1", async () => {
      (fetchCompanies as jest.Mock).mockResolvedValue({
        companies: companies.slice(0, 3),
        totalCount: 5,
        totalPages: 2,
      });

      render(<Companies />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      expect(
        screen.getByRole("navigation", { name: /pagination/i }),
      ).toBeInTheDocument();
      expect(screen.getByText("Page 1 of 2 (Total: 5)")).toBeInTheDocument();
    });

    it("renders pagination even when all results fit on one page", async () => {
      render(<Companies />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      expect(
        screen.getByRole("navigation", { name: /pagination/i }),
      ).toBeInTheDocument();
    });

    it("does not render pagination when there are no results", async () => {
      (fetchCompanies as jest.Mock).mockResolvedValue({
        companies: [],
        totalCount: 0,
        totalPages: 0,
      });

      render(<Companies />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      expect(
        screen.queryByRole("navigation", { name: /pagination/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("Search", () => {
    it("calls fetchCompanies with the search query when searching", async () => {
      render(<Companies />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      (fetchCompanies as jest.Mock).mockResolvedValueOnce({
        companies: companies.slice(0, 1),
        totalCount: 1,
        totalPages: 1,
      });

      fireEvent.change(
        screen.getByRole("searchbox", { name: /search companies/i }),
        { target: { value: "okea" } },
      );

      await waitFor(() => {
        expect(fetchCompanies).toHaveBeenCalledWith("okea", 1, expect.any(Number));
      });
    });
  });

  describe("Page navigation", () => {
    it("calls fetchCompanies with the next page when clicking Next", async () => {
      (fetchCompanies as jest.Mock).mockResolvedValue({
        companies: companies.slice(0, 3),
        totalCount: 5,
        totalPages: 2,
      });

      render(<Companies />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      (fetchCompanies as jest.Mock).mockResolvedValueOnce({
        companies: companies.slice(3),
        totalCount: 5,
        totalPages: 2,
      });

      fireEvent.click(screen.getByRole("button", { name: /next page/i }));

      await waitFor(() => {
        expect(fetchCompanies).toHaveBeenCalledWith(undefined, 2, expect.any(Number));
      });
    });

    it("resets to page 1 when the page size changes", async () => {
      (fetchCompanies as jest.Mock).mockResolvedValue({
        companies: companies.slice(0, 3),
        totalCount: 5,
        totalPages: 2,
      });

      render(<Companies />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      fireEvent.click(screen.getByRole("button", { name: /next page/i }));

      await waitFor(() => {
        expect(fetchCompanies).toHaveBeenCalledWith(undefined, 2, expect.any(Number));
      });

      (fetchCompanies as jest.Mock).mockResolvedValueOnce({
        companies,
        totalCount: 5,
        totalPages: 1,
      });

      fireEvent.change(screen.getByRole("combobox", { name: /page size/i }), {
        target: { value: "10" },
      });

      await waitFor(() => {
        expect(fetchCompanies).toHaveBeenCalledWith(undefined, 1, 10);
      });
    });
  });

  describe("Error Handling", () => {
    it("shows an error message when the fetch fails", async () => {
      mockedFetchCompanies.mockRejectedValue(
        new Error("Failed to load companies, Please try again"),
      );

      render(<Companies />);

      await waitFor(() => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      });

      expect(
        screen.getByText(/Failed to load companies, Please try again/),
      ).toBeInTheDocument();
    });
  });
});
