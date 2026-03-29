import { Company } from "../../../../../types/companies";
import CompanyItemIcon from "./CompanyItemIcon/CompanyItemIcon";
import CompanyItemPanel from "./CompanyItemPanel/CompanyItemPanel";
import styles from "./CompanyListItem.module.css";

interface CompanyListItemProps {
  company: Company;
  isExpanded: boolean;
  onToggle: (companyId: number) => void;
}

export default function CompanyListItem({
  company,
  isExpanded,
  onToggle,
}: CompanyListItemProps) {
  const panelId = `item-panel-${company.companyId}`;

  return (
    <li className={styles.item}>
      <button
        className={styles.header}
        onClick={() => onToggle(company.companyId)}
        aria-expanded={isExpanded}
        aria-controls={panelId}
      >
        <CompanyItemIcon
          iconUrl={company.iconUrl}
          displayName={company.displayName}
          brandColor={company.colorSettings.brandColor}
        />
        <span className={styles.titleGroup}>
          <span className={styles.companyName}>{company.displayName}</span>
          <span className={styles.description}>{company.description}</span>
        </span>
        <span
          className={`${styles.chevron}${isExpanded ? ` ${styles.chevronOpen}` : ""}`}
          aria-hidden="true"
        >
          ›
        </span>
      </button>

      <CompanyItemPanel
        company={company}
        isExpanded={isExpanded}
        panelId={panelId}
      />
    </li>
  );
}
