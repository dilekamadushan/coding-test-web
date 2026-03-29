import { useState } from "react";
import Image from "next/image";
import { Company } from "../../../types/companies";
import styles from "./CompanyAccordion.module.css";

interface CompanyAccordionProps {
  companies: Company[];
}

export default function CompanyAccordion({ companies }: CompanyAccordionProps) {
  
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function toggle(companyId: number) {
    setExpandedId((prev) => (prev === companyId ? null : companyId));
  }

  return (
    <ul className={styles.accordionList}>
      {companies.map((company) => {
        const isExpanded = expandedId === company.companyId;
        return (
          <li key={company.companyId} className={styles.accordionItem}>
            <button
              className={styles.accordionHeader}
              onClick={() => toggle(company.companyId)}
              aria-expanded={isExpanded}
              aria-controls={`accordion-panel-${company.companyId}`}
            >
              <span className={styles.accordionIconWrapper}>
                {company.iconUrl ? (
                  <Image
                    src={company.iconUrl}
                    alt={`${company.displayName} logo`}
                    className={styles.accordionIcon}
                    width={40}
                    height={40}
                  />
                ) : (
                  <span
                    className={styles.accordionIconPlaceholder}
                    style={{
                      backgroundColor: company.colorSettings.brandColor,
                    }}
                  >
                    {company.displayName.charAt(0)}
                  </span>
                )}
              </span>
              <span className={styles.accordionTitleGroup}>
                <span className={styles.accordionCompanyName}>
                  {company.displayName}
                </span>
                <span className={styles.accordionDescription}>
                  {company.description}
                </span>
              </span>
              <span
                className={`${styles.accordionChevron}${isExpanded ? ` ${styles.accordionChevronOpen}` : ""}`}
                aria-hidden="true"
              >
                ›
              </span>
            </button>

            <div
              id={`accordion-panel-${company.companyId}`}
              className={`${styles.accordionPanel}${isExpanded ? ` ${styles.accordionPanelOpen}` : ""}`}
            >
              <dl className={styles.accordionDetails}>
                <div className={styles.accordionDetailRow}>
                  <dt>Ticker</dt>
                  <dd>{company.companyTicker}</dd>
                </div>
                <div className={styles.accordionDetailRow}>
                  <dt>Country</dt>
                  <dd>{company.companyCountry}</dd>
                </div>
                <div className={styles.accordionDetailRow}>
                  <dt>Currency</dt>
                  <dd>{company.reportingCurrency}</dd>
                </div>
                {company.isins.length > 0 && (
                  <div className={styles.accordionDetailRow}>
                    <dt>ISINs</dt>
                    <dd>{company.isins.join(", ")}</dd>
                  </div>
                )}
                {company.infoUrl && (
                  <div className={styles.accordionDetailRow}>
                    <dt>Info</dt>
                    <dd>
                      <a
                        href={company.infoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.accordionLink}
                      >
                        {company.infoUrl}
                      </a>
                    </dd>
                  </div>
                )}
                {company.events.length > 0 && (
                  <div
                    className={`${styles.accordionDetailRow} ${styles.accordionDetailRowFull}`}
                  >
                    <dt>Events</dt>
                    <dd>
                      <ul className={styles.accordionEvents}>
                        {company.events.map((event) => (
                          <li
                            key={event.eventId}
                            className={styles.accordionEvent}
                          >
                            <span className={styles.accordionEventTitle}>
                              {event.eventTitle}
                            </span>
                            <span className={styles.accordionEventMeta}>
                              {event.eventDate} · {event.fiscalPeriod}{" "}
                              {event.fiscalYear}
                            </span>
                            {event.reportUrl && (
                              <a
                                href={event.reportUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.accordionLink}
                              >
                                Report
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
