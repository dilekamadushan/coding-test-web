import { useState } from "react";
import { Company } from "../../../types/companies";
import CompanyListItem from "./CompanyListItem/CompanyListItem";
import CompanyListTitle from "../CompanyListTitle/CompanyListTitle";
import styles from "./CompanyList.module.css";

interface CompanyListProps {
  companies: Company[];
}

export default function CompanyList({ companies }: CompanyListProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (companyId: number) =>
    setExpandedId((prev) => (prev === companyId ? null : companyId));

  return (
    <div>
      <CompanyListTitle />
      <ul className={styles.list}>
        {companies.map((company) => (
          <CompanyListItem
            key={company.companyId}
            company={company}
            isExpanded={expandedId === company.companyId}
            onToggle={toggle}
          />
        ))}
      </ul>
    </div>
  );
}
