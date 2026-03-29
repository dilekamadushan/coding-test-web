import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "../../../../app/components/Pagination/Pagination";
import { DEFAULT_PAGE_SIZE } from "../../../../constants";

describe("Pagination", () => {
  const mockOnPageChange = jest.fn();
  const mockOnPageSizeChange = jest.fn();

  const defaultProps = {
    page: 1,
    totalCount: 15,
    totalPages: 3,
    pageSize: DEFAULT_PAGE_SIZE,
    onPageChange: mockOnPageChange,
    onPageSizeChange: mockOnPageSizeChange,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when totalPages is 0", () => {
    const { container } = render(
      <Pagination {...defaultProps} totalPages={0} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders when totalPages is 1", () => {
    render(<Pagination {...defaultProps} totalPages={1} />);
    expect(
      screen.getByRole("navigation", { name: /pagination/i }),
    ).toBeInTheDocument();
  });

  it("disables the Previous button on the first page", () => {
    render(<Pagination {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /previous page/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /next page/i }),
    ).not.toBeDisabled();
  });

  it("disables the Next button on the last page", () => {
    render(<Pagination {...defaultProps} page={3} totalPages={3} />);
    expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /previous page/i }),
    ).not.toBeDisabled();
  });

  it("displays the current page, total pages and result count", () => {
    render(<Pagination {...defaultProps} page={2} totalPages={5} totalCount={23} />);
    expect(screen.getByText("Page 2 of 5 (Total: 23)")).toBeInTheDocument();
  });

  it("calls onPageChange with page - 1 when clicking Previous", () => {
    render(<Pagination {...defaultProps} page={3} totalPages={5} />);
    fireEvent.click(screen.getByRole("button", { name: /previous page/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it("calls onPageChange with page + 1 when clicking Next", () => {
    render(<Pagination {...defaultProps} page={3} totalPages={5} />);
    fireEvent.click(screen.getByRole("button", { name: /next page/i }));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
  });

  it("disables both buttons when on the only page", () => {
    render(<Pagination {...defaultProps} page={1} totalPages={1} />);
    expect(
      screen.getByRole("button", { name: /previous page/i }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /next page/i }),
    ).toBeDisabled();
  });

  it("renders all page size options", () => {
    render(<Pagination {...defaultProps} />);
    const select = screen.getByRole("combobox", { name: /page size/i });
    const options = Array.from(select.querySelectorAll("option")).map(
      (o) => Number((o as HTMLOptionElement).value),
    );
    expect(options).toEqual([3, 5, 10]);
  });

  it("calls onPageSizeChange with the selected value", () => {
    render(<Pagination {...defaultProps} />);
    fireEvent.change(screen.getByRole("combobox", { name: /page size/i }), {
      target: { value: "5" },
    });
    expect(mockOnPageSizeChange).toHaveBeenCalledWith(5);
  });
});
