import { render } from "@testing-library/react";
import * as stories from "./LoadingIndicator.stories";
import { composeStories } from "@storybook/react";

describe("LoadingIndicator stories", () => {
  const { Default } = composeStories(stories);
  it("renders Default story", () => {
    const { container } = render(<Default />);
    expect(container).toMatchSnapshot();
  });
});
