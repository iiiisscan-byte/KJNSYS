"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { FiArrowLeft, FiClock, FiTag } from "react-icons/fi";

interface Product {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  image_url: string | null;
  category_id: string;
  created_at: string;
  categories: { name: string };
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
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
        console.error("Error loading product:", error);
        alert("존재하지 않는 제품이거나 삭제된 항목입니다.");
        router.push("/product");
      } else {
        setProduct(data as any);
      }
      setLoading(false);
    }
    loadProduct();
  }, [id, router]);

  if (loading) return <div className="container mt-8 mb-8 text-center">정보를 불러오는 중...</div>;
  if (!product) return null;

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
            color: '#666', 
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          <FiArrowLeft /> 목록으로 돌아가기
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', marginBottom: '4rem' }}>
        {/* 제품 이미지 */}
        <div style={{ 
          backgroundColor: '#fff', 
          border: '1px solid #eee', 
          borderRadius: '16px', 
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '450px'
        }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          ) : (
            <div style={{ color: '#ccc' }}>대표 이미지가 없습니다.</div>
          )}
        </div>

        {/* 기본 정보 */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ 
              backgroundColor: '#000', 
              color: '#fff', 
              padding: '0.3rem 0.8rem', 
              borderRadius: '4px', 
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              {product.categories.name}
            </span>
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '1.5rem', lineHeight: '1.2' }}>
            {product.title}
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.8', marginBottom: '2.5rem', wordBreak: 'keep-all' }}>
            {product.description || "본 제품에 대한 간략한 설명이 등록되지 않았습니다."}
          </p>
          
          <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', display: 'flex', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.9rem' }}>
              <FiClock /> 등록일: {new Date(product.created_at).toLocaleDateString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.9rem' }}>
              <FiTag /> 분류: 제품
            </div>
          </div>
          
          <div style={{ marginTop: '3rem' }}>
            <Link href="/service/inquiry" style={{ 
              display: 'inline-block',
              padding: '1.2rem 3rem',
              backgroundColor: '#004a99',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '1.1rem'
            }}>
              제품 문의하기
            </Link>
          </div>
        </div>
      </div>

      {/* 상세 내용 (에디터 출력물) */}
      <div style={{ borderTop: '2px solid #1a1a1a', paddingTop: '4rem', marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '3rem', textAlign: 'center' }}>상세 설명</h3>
        <div 
          className="rich-content"
          dangerouslySetInnerHTML={{ __html: product.content || '<p style="text-align:center; color:#999;">상세 설명이 등록되지 않았습니다.</p>' }}
          style={{ minHeight: '400px', lineHeight: '1.6' }}
        />
      </div>

      <style jsx global>{`
        .rich-content img {
          max-width: 100%;
          height: auto;
        }
        .rich-content h1, .rich-content h2, .rich-content h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .rich-content p {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
