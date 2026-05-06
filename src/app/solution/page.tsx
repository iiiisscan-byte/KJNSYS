"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Solution {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category_id: string;
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
            .select("id, title, description, image_url, category_id")
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
            .eq("type", "solution");
          
          if (solCats && solCats.length > 0) {
            const catIds = solCats.map(c => c.id);
            finalQuery = supabase
              .from("products")
              .select("id, title, description, image_url, category_id")
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
          setSolutions(data || []);
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
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#004a99' }}>{categoryName}</h2>
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
                backgroundColor: '#fcfcfc', 
                border: '1px solid #e0e0e0', 
                borderRadius: '16px', 
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ width: '100%', height: '200px', backgroundColor: '#fff', overflow: 'hidden' }}>
                  {sol.image_url ? (
                    <img src={sol.image_url} alt={sol.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', backgroundColor: '#f0f0f0' }}>이미지 없음</div>
                  )}
                </div>
                <div style={{ padding: '2rem', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1rem', color: '#1a1a1a' }}>{sol.title}</h3>
                  <p style={{ color: '#555', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {sol.description || "솔루션의 상세 정보를 확인해보세요."}
                  </p>
                  <div style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', color: '#004a99', fontWeight: '700', fontSize: '0.95rem' }}>
                    자세히 보기 
                    <span style={{ marginLeft: '0.5rem', transition: 'transform 0.2s ease' }}>→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        .solution-card:hover > div {
          border-color: #004a99;
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,74,153,0.1);
        }
        .solution-card:hover span {
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
}
