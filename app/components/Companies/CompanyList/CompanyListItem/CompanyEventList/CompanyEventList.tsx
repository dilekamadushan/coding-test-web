import { Event } from "../../../../../../types/companies";
import CompanyEvent from "./CompanyEvent/CompanyEvent";
import styles from "./CompanyEventList.module.css";

interface CompanyEventListProps {
  events: Event[];
}

export default function CompanyEventList({ events }: CompanyEventListProps) {
  if (events.length === 0) return null;

  return (
    <div className={styles.section}>
      <dt>Events</dt>
      <dd>
        <ul className={styles.events}>
          {events.map((event) => (
            <CompanyEvent key={event.eventId} event={event} />
          ))}
        </ul>
      </dd>
    </div>
  );
}
