"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FiArrowLeft, FiGrid, FiActivity } from "react-icons/fi";

interface Solution {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category_id: string;
  features: any[] | null;
  specifications: any[] | null;
  created_at: string;
  categories: { name: string };
}

export default function SolutionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSolution() {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          id, title, description, image_url, category_id, features, specifications, created_at,
          categories (name)
        `)
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error loading solution:", error);
        alert("존재하지 않는 솔루션이거나 삭제된 항목입니다.");
        router.push("/solution");
      } else {
        setSolution(data as any);
      }
      setLoading(false);
    }
    loadSolution();
  }, [id, router]);

  if (loading) return <div className="container mt-8 mb-8 text-center">정보를 불러오는 중...</div>;
  if (!solution) return null;

  return (
    <div style={{ width: '100%' }}>
      {/* 제품소개 섹션 */}
      <div style={{ backgroundColor: '#ffffff', paddingTop: '3rem', paddingBottom: '5rem' }}>
        <div className="container">
          {/* 상단 네비게이션 */}
      <div style={{ marginBottom: '2rem' }}>
        <button 
          onClick={() => router.back()} 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'none', 
            border: 'none', 
            color: '#004a99', 
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '600'
          }}
        >
          <FiArrowLeft /> 솔루션 목록보기
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', marginBottom: '4rem', alignItems: 'center' }}>
        {/* 솔루션 정보 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ color: '#004a99', fontSize: '1rem', fontWeight: '800' }}>
              {solution.categories.name}
            </span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1a1a1a', marginBottom: '1.5rem', lineHeight: '1.3', letterSpacing: '-0.02em' }}>
            {solution.title}
          </h1>
          
          <div style={{ fontSize: '1.1rem', color: '#555', lineHeight: '1.8', wordBreak: 'break-word', whiteSpace: 'pre-line', marginBottom: '3rem' }}>
            {solution.description || "본 솔루션에 대한 소개가 등록되지 않았습니다."}
          </div>
          
          <div>
            <Link href="/service/inquiry" style={{ 
              display: 'inline-block',
              padding: '1.2rem 3.5rem',
              backgroundColor: '#000',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '50px',
              fontWeight: '700',
              fontSize: '1.1rem',
              transition: 'transform 0.2s ease',
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
            }}>
              솔루션 도입 문의
            </Link>
          </div>
        </div>

        {/* 솔루션 메인 이미지 */}
        <div style={{ 
          position: 'relative',
          height: '500px',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
        }}>
          {solution.image_url ? (
            <img src={solution.image_url} alt={solution.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#004a99', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem' }}>
              KJNSYS SOLUTION
            </div>
          )}
        </div>
        </div>
      </div>
      </div>

      {/* 특장점 (Features) */}
      {solution.features && solution.features.length > 0 && (
        <div style={{ backgroundColor: '#f8f9fa', padding: '5rem 0' }}>
          <div className="container">
            <h3 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '3rem', color: '#004a99' }}>솔루션 특장점</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '3rem' 
          }}>
            {solution.features.map((feature: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '2rem', backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {feature.icon_url && (
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img src={feature.icon_url} alt={feature.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                  )}
                  <h4 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#1a1a1a', margin: 0 }}>
                    {feature.title}
                  </h4>
                </div>
                <p style={{ fontSize: '1.05rem', color: '#555', lineHeight: '1.7', wordBreak: 'keep-all', margin: 0 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          </div>
        </div>
      )}

      {/* 제품 사양 (Specifications) */}
      {solution.specifications && solution.specifications.length > 0 && (
        <div style={{ backgroundColor: '#ffffff', padding: '5rem 0', borderTop: '1px solid #eee' }}>
          <div className="container">
            <h3 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '3rem', color: '#004a99' }}>사양 및 요구사항</h3>
          <div style={{ maxWidth: '800px', margin: '0 auto', borderTop: '2px solid #004a99' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
              <tbody>
                {solution.specifications.map((spec: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ 
                      width: '30%', 
                      padding: '1.5rem', 
                      backgroundColor: '#f4f9ff', 
                      textAlign: 'left',
                      fontWeight: '700',
                      color: '#004a99',
                      fontSize: '1.05rem'
                    }}>
                      {spec.label}
                    </th>
                    <td style={{ 
                      padding: '1.5rem', 
                      color: '#444',
                      fontSize: '1.05rem',
                      lineHeight: '1.5'
                    }}>
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

    </div>
  );
}
