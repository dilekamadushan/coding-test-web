import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchBar from "../../../components/SearchBar/SearchBar";

const defaultProps = {
  onSearchInputChanged: jest.fn(),
  companiesCount: 5,
  loading: false,
  error: null,
};

describe("SearchBar", () => {
  beforeEach(() => jest.useFakeTimers());

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders a search input", () => {
      render(<SearchBar {...defaultProps} />);

      expect(
        screen.getByRole("searchbox", { name: /search companies/i }),
      ).toBeInTheDocument();
    });

    it("is not readOnly when loading is false", () => {
      render(<SearchBar {...defaultProps} loading={false} />);

      expect(screen.getByRole("searchbox")).not.toHaveAttribute("readonly");
    });

    it("is readOnly when loading is true", () => {
      render(<SearchBar {...defaultProps} loading={true} />);

      expect(screen.getByRole("searchbox")).toHaveAttribute("readonly");
    });
  });

  describe("debounced search", () => {
    it("does not call onSearchInputChanged before the debounce delay", () => {
      const onSearchInputChanged = jest.fn();
      render(
        <SearchBar
          {...defaultProps}
          onSearchInputChanged={onSearchInputChanged}
          debounceInMilliSeconds={300}
        />,
      );

      fireEvent.change(screen.getByRole("searchbox"), {
        target: { value: "okea" },
      });

      expect(onSearchInputChanged).not.toHaveBeenCalled();
    });

    it("calls onSearchInputChanged once after the debounce delay", () => {
      const onSearchInputChanged = jest.fn();
      render(
        <SearchBar
          {...defaultProps}
          onSearchInputChanged={onSearchInputChanged}
          debounceInMilliSeconds={300}
        />,
      );

      fireEvent.change(screen.getByRole("searchbox"), {
        target: { value: "okea" },
      });

      act(() => jest.advanceTimersByTime(300));

      expect(onSearchInputChanged).toHaveBeenCalledTimes(1);
      expect(onSearchInputChanged).toHaveBeenCalledWith("okea");
    });

    it("trims whitespace from the value before calling onSearchInputChanged", () => {
      const onSearchInputChanged = jest.fn();
      render(
        <SearchBar
          {...defaultProps}
          onSearchInputChanged={onSearchInputChanged}
          debounceInMilliSeconds={300}
        />,
      );

      fireEvent.change(screen.getByRole("searchbox"), {
        target: { value: "  okea  " },
      });

      act(() => jest.advanceTimersByTime(300));

      expect(onSearchInputChanged).toHaveBeenCalledWith("okea");
    });

    it("cancels the previous timer when the user types again", () => {
      const onSearchInputChanged = jest.fn();
      render(
        <SearchBar
          {...defaultProps}
          onSearchInputChanged={onSearchInputChanged}
          debounceInMilliSeconds={300}
        />,
      );

      fireEvent.change(screen.getByRole("searchbox"), {
        target: { value: "o" },
      });
      act(() => jest.advanceTimersByTime(100));

      fireEvent.change(screen.getByRole("searchbox"), {
        target: { value: "okea" },
      });
      act(() => jest.advanceTimersByTime(300));

      expect(onSearchInputChanged).toHaveBeenCalledTimes(1);
      expect(onSearchInputChanged).toHaveBeenCalledWith("okea");
    });
  });
});
