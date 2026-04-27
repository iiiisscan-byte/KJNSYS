"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./LNB.module.css";

interface LNBProps {
  items: { label: string; href: string }[];
}

export default function LNB({ items }: LNBProps) {
  const pathname = usePathname();

  return (
    <div className={styles.lnbContainer}>
      <div className="container">
        <ul className={styles.navList}>
          {items.map((item) => (
            <li key={item.href} className={styles.navItem}>
              <Link 
                href={item.href} 
                className={`${styles.navLink} ${pathname === item.href ? styles.active : ""}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
