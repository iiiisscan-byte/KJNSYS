"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import styles from "./Header.module.css";

const navItems = [
  { label: "회사소개", href: "/#about" },
  { label: "제품", href: "/product" },
  { label: "솔루션", href: "/solution" },
  { label: "고객지원", href: "/service" },
  { label: "스토어", href: "https://smartstore.naver.com/kjnsys", external: true },
];

export default function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.container}`}>
        <Link href="/" className={styles.logo}>
          <img src="/logo.png" alt="케이제이엔시스 로고" style={{ height: "40px", width: "auto", display: "block" }} />
        </Link>
        
        <nav className={styles.nav}>
          {navItems.map((item) => (
            item.external ? (
              <a 
                key={item.label} 
                href={item.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.navLink}
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.label} href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            )
          ))}
        </nav>

        <button 
          className={styles.mobileMenuBtn}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      
      {/* TODO: Mobile Menu Implementation */}
    </header>
  );
}
