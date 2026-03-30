import { render } from "@testing-library/react";
import * as stories from "./CompanyListItem.stories";
import { composeStories } from "@storybook/react";

describe("CompanyListItem stories", () => {
  const { Default, Expanded } = composeStories(stories);
  it("renders Default story", () => {
    const { container } = render(<Default />);
    expect(container).toMatchSnapshot();
  });
  it("renders Expanded story", () => {
    const { container } = render(<Expanded />);
    expect(container).toMatchSnapshot();
  });
});
