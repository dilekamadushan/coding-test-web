import { render, screen, fireEvent } from "@testing-library/react";
import CompanyList from "../../../components/CompanyList/CompanyList";
import { companies } from "../../../../data/companies";

describe("CompanyList", () => {
  describe("rendering", () => {
    it("renders the title and all company names", () => {
      render(<CompanyList companies={companies} />); // actual data is used for effective ui testing opposed to mocked data

      expect(screen.getByText("Trending companies")).toBeInTheDocument();
      companies.forEach((c) =>
        expect(
          screen.getAllByText(
            (_, el) => el?.textContent?.trim() === c.displayName.trim(),
          ).length,
        ).toBeGreaterThanOrEqual(1),
      );
    });
  });

  describe("expand / collapse", () => {
    it("expands an item when its button is clicked", () => {
      render(<CompanyList companies={companies} />);

      const [buttonA] = screen.getAllByRole("button");
      expect(buttonA).toHaveAttribute("aria-expanded", "false");
      fireEvent.click(buttonA);
      expect(buttonA).toHaveAttribute("aria-expanded", "true");
    });

    it("collapses an expanded item when its button is clicked again", () => {
      render(<CompanyList companies={companies} />);

      const [buttonA] = screen.getAllByRole("button");
      fireEvent.click(buttonA);
      expect(buttonA).toHaveAttribute("aria-expanded", "true");
      fireEvent.click(buttonA);
      expect(buttonA).toHaveAttribute("aria-expanded", "false");
    });

    it("only keeps one item expanded at a time", () => {
      render(<CompanyList companies={companies} />);

      const [buttonA, buttonB] = screen.getAllByRole("button");
      fireEvent.click(buttonA);
      expect(buttonA).toHaveAttribute("aria-expanded", "true");
      fireEvent.click(buttonB);
      expect(buttonA).toHaveAttribute("aria-expanded", "false");
      expect(buttonB).toHaveAttribute("aria-expanded", "true");
    });
  });
});
