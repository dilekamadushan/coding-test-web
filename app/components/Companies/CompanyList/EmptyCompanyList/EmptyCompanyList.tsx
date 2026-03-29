import styles from "./EmptyCompanyList.module.css";

export default function EmptyCompanyList() {
  return (
    <div className={styles.wrapper}>
      <p className={styles.message}>No results found</p>
    </div>
  );
}
