import { render, screen, fireEvent } from "@testing-library/react";
import CompanyListItem from "../../../../components/Companies/CompanyList/CompanyListItem/CompanyListItem";
import { companies } from "../../../../../data/companies";

describe("CompanyListItem", () => {
  it("renders the company name and description", () => {
    render(
      <ul>
        <CompanyListItem
          company={companies[0]} // actual data is used for effective ui testing opposed to mocked data
          isExpanded={false}
          onToggle={jest.fn()}
        />
      </ul>,
    );
    expect(
      screen.getAllByText(companies[0].displayName).length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText(companies[0].description).length,
    ).toBeGreaterThanOrEqual(1);
  });

  describe("When collapsed", () => {
    it("button has aria-expanded=false", () => {
      render(
        <ul>
          <CompanyListItem
            company={companies[0]}
            isExpanded={false}
            onToggle={jest.fn()}
          />
        </ul>,
      );
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });
  });

  describe("When expanded", () => {
    it("button has aria-expanded=true", () => {
      render(
        <ul>
          <CompanyListItem
            company={companies[0]}
            isExpanded={true}
            onToggle={jest.fn()}
          />
        </ul>,
      );
      expect(screen.getByRole("button")).toHaveAttribute(
        "aria-expanded",
        "true",
      );
    });
  });

  describe("Toggle behaviour", () => {
    it("calls onToggle with the company id when clicked", () => {
      const onToggle = jest.fn();
      render(
        <ul>
          <CompanyListItem
            company={companies[0]}
            isExpanded={false}
            onToggle={onToggle}
          />
        </ul>,
      );
      fireEvent.click(screen.getByRole("button"));
      expect(onToggle).toHaveBeenCalledWith(companies[0].companyId);
      expect(onToggle).toHaveBeenCalledTimes(1);
    });
  });
});
