"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";
import { useEffect, useState } from "react";

const adminNav = [
  { label: "대시보드", href: "/admin" },
  { label: "카테고리 관리", href: "/admin/categories" },
  { label: "제품/솔루션 관리", href: "/admin/products" },
  { label: "히어로 배너 관리", href: "/admin/banner" },
  { label: "팝업 관리", href: "/admin/popups" },
  { label: "서비스 문의 관리", href: "/admin/inquiries" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 간단한 인증 모의 (실제 구현 시 Supabase Auth 활용)
  useEffect(() => {
    const isLogged = localStorage.getItem("kjnsys_admin_auth") === "true";
    setIsAuthenticated(isLogged);
    if (!isLogged && pathname !== "/admin/login") {
      window.location.href = "/admin/login";
    }
  }, [pathname]);

  if (!isAuthenticated && pathname !== "/admin/login") {
    return null; // 로딩 중 또는 리다이렉트 대기
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <Link href="/admin" className={styles.sidebarLogo}>KJNSYS ADMIN</Link>
        <nav style={{ display: 'flex', flexDirection: 'column' }}>
          {adminNav.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button 
          style={{ marginTop: 'auto', padding: '1rem', background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', textAlign: 'left' }}
          onClick={() => {
            localStorage.removeItem("kjnsys_admin_auth");
            window.location.href = "/admin/login";
          }}
        >
          로그아웃
        </button>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
