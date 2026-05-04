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
  image_url: string | null;
  category_id: string;
  manufacturer: string | null;
  features: any[] | null;
  specifications: any[] | null;
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
          id, title, description, image_url, category_id, manufacturer, features, specifications, created_at,
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1a1a1a', marginBottom: '1.5rem', lineHeight: '1.3', letterSpacing: '-0.02em' }}>
            {product.title}
          </h1>
          
          <div style={{ fontSize: '1.05rem', color: '#555', lineHeight: '1.8', wordBreak: 'break-word', whiteSpace: 'pre-line', marginBottom: '2.5rem' }}>
            {product.description || "본 제품에 대한 소개가 등록되지 않았습니다."}
          </div>
          
          <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', display: 'flex', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.9rem' }}>
              <FiClock /> 제조사: {product.manufacturer || "-"}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#888', fontSize: '0.9rem' }}>
              <FiTag /> 분류: {product.categories.name}
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
              제품 및 서비스 문의하기
            </Link>
          </div>
        </div>
      </div>

      {/* 특장점 (Features) */}
      {product.features && product.features.length > 0 && (
        <div style={{ marginTop: '5rem', marginBottom: '4rem' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '3rem', color: '#1a1a1a' }}>특장점</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
            gap: '3rem' 
          }}>
            {product.features.map((feature: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
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
      )}

      {/* 제품 사양 (Specifications) */}
      {product.specifications && product.specifications.length > 0 && (
        <div style={{ marginTop: '5rem', marginBottom: '5rem' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: '800', textAlign: 'center', marginBottom: '3rem', color: '#1a1a1a' }}>제품 사양</h3>
          <div style={{ maxWidth: '800px', margin: '0 auto', borderTop: '2px solid #1a1a1a' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {product.specifications.map((spec: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ 
                      width: '30%', 
                      padding: '1.5rem', 
                      backgroundColor: '#f9f9f9', 
                      textAlign: 'left',
                      fontWeight: '700',
                      color: '#333',
                      fontSize: '1.05rem'
                    }}>
                      {spec.label}
                    </th>
                    <td style={{ 
                      padding: '1.5rem', 
                      color: '#555',
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
      )}


    </div>
  );
}
