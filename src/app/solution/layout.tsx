"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import LNB from "@/components/layout/LNB";
import { FiLayers } from "react-icons/fi";

export default function SolutionLayout({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<{ label: string; href: string }[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .eq("type", "solution")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching solution categories:", error);
      } else if (data) {
        const navItems = data.map(cat => ({
          label: cat.name,
          href: `/solution?category=${cat.id}`
        }));
        setCategories([{ label: "전체", href: "/solution" }, ...navItems]);
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
              backgroundColor: '#004a99',
              color: '#fff',
              borderRadius: '8px',
              fontSize: '1.3rem'
            }}>
              <FiLayers />
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>솔루션</h1>
          </div>
          <p style={{ fontSize: '1rem', color: '#666', maxWidth: '600px', margin: '0 auto', wordBreak: 'keep-all', lineHeight: '1.6' }}>
            효율적인 디지털 전환과 보안 강화를 위한 <br />케이제이엔시스만의 최적화된 맞춤형 솔루션을 제공합니다.
          </p>
        </div>
      </div>
      <LNB items={categories.length > 0 ? categories : []} />
      {children}
    </>
  );
}
