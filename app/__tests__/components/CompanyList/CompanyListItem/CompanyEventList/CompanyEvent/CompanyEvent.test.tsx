// Real data from data/companies.ts is used — see CompanyListItem.test.tsx for rationale.
import { render, screen } from "@testing-library/react";
import CompanyEvent from "../../../../../../components/CompanyList/CompanyListItem/CompanyEventList/CompanyEvent/CompanyEvent";
import { companies } from "../../../../../../../data/companies";

const event = companies[0].events[0];

describe("CompanyEvent", () => {
  it("renders expected data", () => {
    render(
      <ul>
        <CompanyEvent event={event} />
      </ul>,
    );
    expect(screen.getByText(event.eventTitle)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(event.eventDate))).toBeInTheDocument();
    expect(
      screen.getAllByText(new RegExp(event.fiscalPeriod)).length,
    ).toBeGreaterThan(0);

    // link should be rendered when reportUrl is set
    const link = screen.getByRole("link", { name: "View Report" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", event.reportUrl);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("does not render a report link when reportUrl is null", () => {
    render(
      <ul>
        <CompanyEvent event={{ ...event, reportUrl: null }} />
      </ul>,
    );
    expect(
      screen.queryByRole("link", { name: "View Report" }),
    ).not.toBeInTheDocument();
  });
});
