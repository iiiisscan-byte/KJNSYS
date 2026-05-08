"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "../admin.module.css";
import Link from "next/link";

interface Promotion {
  id: string;
  title: string;
  category: string;
  badge: string;
  is_active: boolean;
  created_at: string;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  async function fetchPromotions() {
    try {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from("promotions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setPromotions(promotions.filter(p => p.id !== id));
      alert("삭제되었습니다.");
    } catch (error: any) {
      alert(`삭제 중 오류 발생: ${error.message}`);
    }
  }

  if (loading) return <div className={styles.card}>로딩 중...</div>;

  return (
    <div className={styles.card}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>프로모션 관리</h2>
          <p style={{ color: '#666', marginTop: '0.5rem' }}>메인 페이지의 "진행중인 특별 프로모션" 섹션을 관리합니다.</p>
        </div>
        <Link 
          href="/admin/promotions/new" 
          style={{ 
            padding: '0.8rem 1.5rem', 
            backgroundColor: '#004a99', 
            color: '#fff', 
            borderRadius: '4px', 
            textDecoration: 'none', 
            fontWeight: 'bold' 
          }}
        >
          새 프로모션 등록
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
            <th style={{ padding: '1rem' }}>카테고리/뱃지</th>
            <th style={{ padding: '1rem' }}>제목</th>
            <th style={{ padding: '1rem' }}>상태</th>
            <th style={{ padding: '1rem' }}>등록일</th>
            <th style={{ padding: '1rem', textAlign: 'right' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {promotions.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>등록된 프로모션이 없습니다.</td>
            </tr>
          ) : (
            promotions.map((promo) => (
              <tr key={promo.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', background: '#f0f0f0', padding: '2px 6px', borderRadius: '4px', marginRight: '4px' }}>{promo.category}</span>
                  {promo.badge && <span style={{ fontSize: '0.8rem', background: '#e63946', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{promo.badge}</span>}
                </td>
                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{promo.title}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ color: promo.is_active ? '#2e7d32' : '#d32f2f' }}>
                    {promo.is_active ? "활성" : "비활성"}
                  </span>
                </td>
                <td style={{ padding: '1rem', color: '#666', fontSize: '0.9rem' }}>
                  {new Date(promo.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                  <Link 
                    href={`/admin/promotions/${promo.id}`} 
                    style={{ color: '#004a99', marginRight: '1rem', textDecoration: 'none' }}
                  >
                    수정
                  </Link>
                  <button 
                    onClick={() => handleDelete(promo.id)}
                    style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer' }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
