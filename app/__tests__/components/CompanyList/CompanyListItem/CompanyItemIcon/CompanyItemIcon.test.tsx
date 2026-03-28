import { render, screen } from "@testing-library/react";
import CompanyItemIcon from "../../../../../components/CompanyList/CompanyListItem/CompanyItemIcon/CompanyItemIcon";

describe("CompanyItemIcon", () => {
  it("renders an img with alt text when iconUrl is provided", () => {
    render(
      <CompanyItemIcon
        iconUrl="https://example.com/icon.png"
        displayName="TestCo"
        brandColor="#ff0000"
      />,
    );
    expect(
      screen.getByRole("img", { name: "TestCo logo" }),
    ).toBeInTheDocument();
  });

  it("renders the first letter placeholder when iconUrl is null", () => {
    render(
      <CompanyItemIcon iconUrl={null} displayName="TestCo" brandColor="#ff0000" />,
    );
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("applies the brand colour to the placeholder background", () => {
    render(
      <CompanyItemIcon iconUrl={null} displayName="TestCo" brandColor="#ff0000" />,
    );
    expect(screen.getByText("T")).toHaveStyle({ backgroundColor: "#ff0000" });
  });
});
