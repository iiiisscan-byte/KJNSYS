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
  content: string | null;
  image_url: string | null;
  category_id: string;
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
          id, title, description, content, image_url, category_id, created_at,
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
    <div className="container mt-8 mb-8">
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ 
              backgroundColor: '#e3f2fd', 
              color: '#004a99', 
              padding: '0.4rem 1rem', 
              borderRadius: '20px', 
              fontSize: '0.9rem',
              fontWeight: '700',
              border: '1px solid #bbdefb'
            }}>
              {solution.categories.name}
            </span>
          </div>
          <h1 style={{ fontSize: '3.2rem', fontWeight: '900', color: '#1a1a1a', marginBottom: '2rem', lineHeight: '1.2', letterSpacing: '-0.02em' }}>
            {solution.title}
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#444', lineHeight: '1.7', marginBottom: '3rem', wordBreak: 'keep-all' }}>
            {solution.description || "본 솔루션에 대한 핵심 소개가 등록되지 않았습니다."}
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ flex: '1', minWidth: '150px', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
              <div style={{ color: '#004a99', marginBottom: '0.5rem' }}><FiGrid size={24} /></div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>최적화 시스템</div>
              <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.3rem' }}>맞춤형 프로세스 제공</div>
            </div>
            <div style={{ flex: '1', minWidth: '150px', padding: '1.5rem', backgroundColor: '#f8f9fa', borderRadius: '12px' }}>
              <div style={{ color: '#004a99', marginBottom: '0.5rem' }}><FiActivity size={24} /></div>
              <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>고성능 보장</div>
              <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.3rem' }}>검증된 비즈니스 성능</div>
            </div>
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

      {/* 상세 내용 (에디터 출력물) */}
      <div style={{ backgroundColor: '#fff', padding: '5rem 0', borderTop: '1px solid #eee' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4rem', textAlign: 'center', color: '#004a99' }}>솔루션 상세 아키텍처 및 특징</h3>
          <div 
            className="rich-content"
            dangerouslySetInnerHTML={{ __html: solution.content || '<p style="text-align:center; color:#999;">상세 내용이 등록되지 않았습니다.</p>' }}
            style={{ minHeight: '400px', lineHeight: '1.7', fontSize: '1.1rem' }}
          />
        </div>
      </div>

      <style jsx global>{`
        .rich-content img {
          max-width: 100%;
          height: auto;
          border-radius: 12px;
          margin: 2rem 0;
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }
        .rich-content h1, .rich-content h2, .rich-content h3 {
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }
        .rich-content p {
          margin-bottom: 1.5rem;
        }
        .rich-content ul, .rich-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .rich-content li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </div>
  );
}
