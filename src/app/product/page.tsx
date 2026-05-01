"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  category_id: string;
}

export default function ProductPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = use(searchParams);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("전체 제품");

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      
      let query = supabase
        .from("products")
        .select("id, title, description, image_url, category_id")
        .eq("is_active", true);

      if (category) {
        query = query.eq("category_id", category);
        
        // 카테고리 이름 가져오기
        const { data: catData } = await supabase
          .from("categories")
          .select("name")
          .eq("id", category)
          .single();
        if (catData) setCategoryName(catData.name);
      } else {
        setCategoryName("전체 제품");
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading products:", error);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    }
    loadProducts();
  }, [category]);

  if (loading) return <div className="container mt-8 mb-8 text-center">로딩 중...</div>;

  return (
    <div className="container mt-4 mb-8">
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#333' }}>{categoryName}</h2>
      </div>
      
      {products.length === 0 ? (
        <div style={{ padding: '5rem 0', textAlign: 'center', color: '#999' }}>
          등록된 제품이 없습니다.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/product/${product.id}`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              className="product-card"
            >
              <div style={{ 
                backgroundColor: '#fff', 
                border: '1px solid #eee', 
                borderRadius: '12px', 
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                height: '100%'
              }}>
                <div style={{ width: '100%', height: '240px', backgroundColor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  ) : (
                    <div style={{ color: '#ccc' }}>이미지 없음</div>
                  )}
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem', color: '#1a1a1a' }}>{product.title}</h3>
                  <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description || "상세 설명을 보시려면 클릭하세요."}
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
        .product-card:hover > div {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
