import { Event } from "../../../../../../types/companies";
import styles from "./CompanyEvent.module.css";

interface CompanyEventProps {
  event: Event;
}

export default function CompanyEvent({ event }: CompanyEventProps) {
  return (
    <li className={styles.event}>
      <span className={styles.eventTitle}>{event.eventTitle}</span>
      <span className={styles.eventMeta}>
        {event.eventDate} · {event.fiscalPeriod} {event.fiscalYear}
      </span>
      {event.reportUrl && (
        <a
          href={event.reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          View Report
        </a>
      )}
    </li>
  );
}
