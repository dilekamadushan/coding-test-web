import { useEffect, useRef, useState } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearchInputChanged: (value: string) => void;
  debounceInMilliSeconds?: number;
  loading: boolean;
}

export default function SearchBar({
  onSearchInputChanged,
  debounceInMilliSeconds = 300,
  loading,
}: SearchBarProps) {
  const [searchInput, setSearchInput] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clean up any pending timer on unmount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchInput(newValue);
    if (timerRef.current) clearTimeout(timerRef.current);
    // waits until the user pauses before hitting the API
    timerRef.current = setTimeout(() => {
      onSearchInputChanged(newValue.trim());
    }, debounceInMilliSeconds);
  };

  return (
    <div className={styles.wrapper}>
      <input
        readOnly={loading}
        className={styles.input}
        type="search"
        placeholder="Search companies…"
        value={searchInput}
        onChange={handleUserInput}
        aria-label="Search companies"
      />
    </div>
  );
}
