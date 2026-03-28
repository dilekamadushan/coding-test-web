import styles from "./CompanyListTitle.module.css";

interface CompanyListTitleProps {
  title?: string;
}

export default function CompanyListTitle({
  title = "Trending companies",
}: CompanyListTitleProps) {
  return <p className={styles.title}>{title}</p>;
}
