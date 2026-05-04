"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LNB from "@/components/layout/LNB";
import { FiBox } from "react-icons/fi";

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<{ label: string; href: string }[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("type", "product")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching product categories:", error);
      } else if (data) {
        const navItems = data.map(cat => ({
          label: cat.name,
          href: `/product?category=${cat.id}`
        }));
        // 기본 '전체' 메뉴 추가 (필요시)
        setCategories([{ label: "전체", href: "/product" }, ...navItems]);
      }
    }
    fetchCategories();
  }, []);

  return (
    <>
      <div style={{ backgroundColor: '#f5f5f7', padding: '2.5rem 0', marginBottom: '0' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              backgroundColor: '#000',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '1.3rem'
            }}>
              <FiBox />
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>제품</h1>
          </div>
          <p style={{ fontSize: '1rem', color: '#666', maxWidth: '600px', margin: '0 auto', wordBreak: 'keep-all', lineHeight: '1.6' }}>
            최상의 비즈니스 파트너, 케이제이엔시스의 혁신적인 <br />이미지 프로세싱 및 스캐닝 제품군을 만나보세요.
          </p>
        </div>
      </div>
      <LNB items={categories.length > 0 ? categories : []} />
      {children}
    </>
  );
}
