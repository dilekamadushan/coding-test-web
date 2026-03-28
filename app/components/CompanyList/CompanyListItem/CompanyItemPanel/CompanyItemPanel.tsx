import { Company } from "../../../../../types/companies";
import CompanyEventList from "../CompanyEventList/CompanyEventList";
import styles from "./CompanyItemPanel.module.css";

interface CompanyItemPanelProps {
  company: Company;
  isExpanded: boolean;
  panelId: string;
}

export default function CompanyItemPanel({
  company,
  isExpanded,
  panelId,
}: CompanyItemPanelProps) {
  return (
    <div
      id={panelId}
      className={`${styles.panel}${isExpanded ? ` ${styles.panelOpen}` : ""}`}
    >
      <dl className={styles.details}>
        <div className={styles.detailRow}>
          <dt>Ticker</dt>
          <dd>{company.companyTicker}</dd>
        </div>
        <div className={styles.detailRow}>
          <dt>Country</dt>
          <dd>{company.companyCountry}</dd>
        </div>
        <div className={styles.detailRow}>
          <dt>Currency</dt>
          <dd>{company.reportingCurrency}</dd>
        </div>
        {company.isins.length > 0 && (
          <div className={styles.detailRow}>
            <dt>ISINs</dt>
            <dd>{company.isins.join(", ")}</dd>
          </div>
        )}
        {company.infoUrl && (
          <div className={styles.detailRow}>
            <dt>Info</dt>
            <dd>
              <a
                href={company.infoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {company.infoUrl}
              </a>
            </dd>
          </div>
        )}
        <CompanyEventList events={company.events} />
      </dl>
    </div>
  );
}
