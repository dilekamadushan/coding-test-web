import styles from "./Pagination.module.css";
import { PAGE_SIZE_OPTIONS } from "../../../constants";

interface PaginationProps {
  page: number;
  totalCount: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function Pagination({
  page,
  totalCount,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) =>
    onPageSizeChange(Number(event.target.value));

  if (totalPages === 0) return null;

  return (
    <nav aria-label="Pagination" className={styles.wrapper}>
      <button
        className={styles.button}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ← Prev
      </button>
      <span className={styles.pageInfo}>
        Page {page} of {totalPages} (Total: {totalCount})
      </span>
      <button
        className={styles.button}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
      <label className={styles.pageSizeLabel}>
        Page size
        <select
          className={styles.pageSizeSelect}
          value={pageSize}
          onChange={handlePageSizeChange}
          aria-label="Page size"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
    </nav>
  );
}
