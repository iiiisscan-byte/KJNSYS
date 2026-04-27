"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./admin.module.css";

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const { count: pCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });
        
        const { count: iCount } = await supabase
          .from("inquiries")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        setProductCount(pCount || 0);
        setInquiryCount(iCount || 0);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>관리자 대시보드</h2>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>KJNSYS 홈페이지 콘텐츠 관리 시스템입니다.</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px', borderLeft: '4px solid #000', backgroundColor: '#fff' }}>
          <h3>등록된 제품/솔루션</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
            {loading ? "..." : productCount}
          </p>
        </div>
        <div style={{ padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px', borderLeft: '4px solid #f00', backgroundColor: '#fff' }}>
          <h3>새로운 서비스 문의</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#f00' }}>
            {loading ? "..." : inquiryCount}
          </p>
        </div>
      </div>
    </div>
  );
}
