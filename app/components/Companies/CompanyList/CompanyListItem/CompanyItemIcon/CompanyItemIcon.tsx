import Image from "next/image";
import styles from "./CompanyItemIcon.module.css";

interface CompanyItemIconProps {
  iconUrl: string | null;
  displayName: string;
  brandColor: string;
}

export default function CompanyItemIcon({
  iconUrl,
  displayName,
  brandColor,
}: CompanyItemIconProps) {
  return (
    <span className={styles.iconWrapper}>
      {iconUrl ? (
        <Image
          src={iconUrl}
          alt={`${displayName} logo`}
          className={styles.icon}
          width={40}
          height={40}
        />
      ) : (
        <span
          className={styles.iconPlaceholder}
          style={{ backgroundColor: brandColor }}
        >
          {displayName.charAt(0)}
        </span>
      )}
    </span>
  );
}
