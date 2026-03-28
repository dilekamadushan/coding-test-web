// Real data from data/companies.ts is used — see CompanyListItem.test.tsx for rationale.
import { render, screen } from "@testing-library/react";
import CompanyItemPanel from "../../../../../components/CompanyList/CompanyListItem/CompanyItemPanel/CompanyItemPanel";
import { companies } from "../../../../../../data/companies";

const company = companies[0];

describe("CompanyItemPanel", () => {
  describe("company details", () => {
    it("renders ticker, country and currency", () => {
      render(
        <CompanyItemPanel
          company={company}
          isExpanded={true}
          panelId="panel-1"
        />,
      );
      expect(screen.getByText(company.companyTicker)).toBeInTheDocument();
      expect(screen.getByText(company.companyCountry)).toBeInTheDocument();
      expect(screen.getByText(company.reportingCurrency)).toBeInTheDocument();
    });

    it("renders the info link", () => {
      render(
        <CompanyItemPanel
          company={company}
          isExpanded={true}
          panelId="panel-1"
        />,
      );
      expect(
        screen.getByRole("link", { name: company.infoUrl }),
      ).toHaveAttribute("href", company.infoUrl);
    });
  });

  describe("ISINs", () => {
    it("renders ISINs when the array is non-empty", () => {
      const withIsins = { ...company, isins: ["NO0010268285", "NO0010268286"] };
      render(
        <CompanyItemPanel
          company={withIsins}
          isExpanded={true}
          panelId="panel-1"
        />,
      );
      expect(
        screen.getByText("NO0010268285, NO0010268286"),
      ).toBeInTheDocument();
    });

    it("does not render the ISINs row when the array is empty", () => {
      render(
        <CompanyItemPanel
          company={company}
          isExpanded={true}
          panelId="panel-1"
        />,
      );
      expect(screen.queryByText("ISINs")).not.toBeInTheDocument();
    });
  });

  describe("events", () => {
    it("renders the events section when events are present", () => {
      render(
        <CompanyItemPanel
          company={company}
          isExpanded={true}
          panelId="panel-1"
        />,
      );
      expect(
        screen.getByText(company.events[0].eventTitle),
      ).toBeInTheDocument();
    });

    it("does not render the events section when there are no events", () => {
      const noEvents = { ...company, events: [] };
      render(
        <CompanyItemPanel
          company={noEvents}
          isExpanded={true}
          panelId="panel-1"
        />,
      );
      expect(screen.queryByText("Events")).not.toBeInTheDocument();
    });
  });
});
