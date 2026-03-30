import { render } from "@testing-library/react";
import * as stories from "./CompanyList.stories";
import { composeStories } from "@storybook/react";

describe("CompanyList stories", () => {
  const { Default, Empty } = composeStories(stories);
  it("renders Default story", () => {
    const { container } = render(<Default />);
    expect(container).toMatchSnapshot();
  });
  it("renders Empty story", () => {
    const { container } = render(<Empty />);
    expect(container).toMatchSnapshot();
  });
});
