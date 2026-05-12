"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Solution {
  id: string;
  title: string;
  summary: string | null;
  description: string | null;
  image_url: string | null;
  category_id: string;
  created_at?: string;
}

export default function SolutionPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = use(searchParams);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("전체 솔루션");

  useEffect(() => {
    async function loadSolutions() {
      setLoading(true);
      
      try {
        let finalQuery;
        
        if (category) {
          // 특정 카테고리가 선택된 경우
          finalQuery = supabase
            .from("products")
            .select("id, title, summary, description, image_url, category_id, created_at")
            .eq("is_active", true)
            .eq("category_id", category);
          
          const { data: catData } = await supabase
            .from("categories")
            .select("name")
            .eq("id", category)
            .single();
          if (catData) setCategoryName(catData.name);
        } else {
          // 전체 솔루션 보기: 'solution' 타입 카테고리 ID들을 먼저 가져옴
          const { data: solCats } = await supabase
            .from("categories")
            .select("id")
            .eq("type", "solution")
            .order("created_at", { ascending: false });
          
          if (solCats && solCats.length > 0) {
            const catIds = solCats.map(c => c.id);
            finalQuery = supabase
              .from("products")
              .select("id, title, summary, description, image_url, category_id, created_at")
              .eq("is_active", true)
              .in("category_id", catIds);
          } else {
            // 솔루션 카테고리가 없는 경우 쿼리를 수행하지 않고 빈 배열 설정
            setSolutions([]);
            setCategoryName("전체 솔루션");
            setLoading(false);
            return;
          }
          setCategoryName("전체 솔루션");
        }

        const { data, error } = await finalQuery.order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading solutions:", error.message || JSON.stringify(error));
        } else {
          let fetchedSolutions = data || [];
          
          if (!category) {
            const { data: catsForOrder } = await supabase
              .from("categories")
              .select("id")
              .eq("type", "solution")
              .order("created_at", { ascending: false });
              
            if (catsForOrder) {
              const catOrderMap = new Map(catsForOrder.map((c, i) => [c.id, i]));
              fetchedSolutions.sort((a, b) => {
                const orderA = catOrderMap.get(a.category_id) ?? 999;
                const orderB = catOrderMap.get(b.category_id) ?? 999;
                if (orderA !== orderB) {
                  return orderA - orderB;
                }
                return 0;
              });
            }
          }

          setSolutions(fetchedSolutions);
        }
      } catch (err: any) {
        console.error("Unhandled error in loadSolutions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSolutions();
  }, [category]);

  if (loading) return <div className="container mt-8 mb-8 text-center">로딩 중...</div>;

  return (
    <div className="container mt-4 mb-8">
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#333' }}>{categoryName}</h2>
      </div>
      
      {solutions.length === 0 ? (
        <div style={{ padding: '5rem 0', textAlign: 'center', color: '#999' }}>
          등록된 솔루션이 없습니다.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
          {solutions.map((sol) => (
            <Link 
              key={sol.id} 
              href={`/solution/${sol.id}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              className="solution-card"
            >
              <div style={{ 
                backgroundColor: '#fff', 
                border: '1px solid #eee', 
                borderRadius: '12px', 
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                height: '100%'
              }}>
                <div style={{ width: '100%', height: '240px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {sol.image_url ? (
                    <img src={sol.image_url} alt={sol.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ color: '#ccc' }}>이미지 없음</div>
                  )}
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1a1a1a' }}>{sol.title}</h3>
                  <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {sol.summary || sol.description || "상세 설명을 보시려면 클릭하세요."}
                  </p>
                  <div style={{ marginTop: '1.5rem', color: '#004a99', fontWeight: '600', fontSize: '0.9rem' }}>
                    상세보기 +
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        .solution-card:hover > div {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
