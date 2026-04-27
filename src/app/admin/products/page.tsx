"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string;
  title: string;
  category_id: string;
  is_active: boolean;
  created_at: string;
  categories?: { name: string; type: string };
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    // Join with categories to show category name
    const { data, error } = await supabase
      .from("products")
      .select(`
        id, 
        title, 
        category_id, 
        is_active, 
        created_at,
        categories (name, type)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data as any || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("정말 이 제품/솔루션을 삭제하시겠습니까? 복구할 수 없습니다.")) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      alert("삭제에 실패했습니다.");
    } else {
      fetchProducts();
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      alert("상태 변경에 실패했습니다.");
    } else {
      fetchProducts();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h2>제품 및 솔루션 관리</h2>
          <p style={{ color: "#666", marginTop: "0.5rem" }}>웹사이트에 표시될 제품과 솔루션을 관리합니다.</p>
        </div>
        <Link 
          href="/admin/products/create"
          style={{ padding: "0.8rem 1.5rem", backgroundColor: "#000", color: "#fff", textDecoration: "none", borderRadius: "4px", fontWeight: "bold" }}
        >
          + 신규 등록
        </Link>
      </div>

      <div style={{ padding: "1.5rem", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#fff" }}>
        {loading ? (
          <p>로딩 중...</p>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 0", color: "#666" }}>
            <p>등록된 제품이나 솔루션이 없습니다.</p>
            <Link href="/admin/products/create" style={{ color: "#000", fontWeight: "bold", textDecoration: "underline", marginTop: "1rem", display: "inline-block" }}>
              첫 번째 항목 등록하기
            </Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #000", textAlign: "left" }}>
                <th style={{ padding: "1rem 0.5rem" }}>상태</th>
                <th style={{ padding: "1rem 0.5rem" }}>분류</th>
                <th style={{ padding: "1rem 0.5rem" }}>제품/솔루션명</th>
                <th style={{ padding: "1rem 0.5rem" }}>등록일</th>
                <th style={{ padding: "1rem 0.5rem", textAlign: "right" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "1rem 0.5rem" }}>
                    <button 
                      onClick={() => handleToggleActive(item.id, item.is_active)}
                      style={{ 
                        padding: "0.3rem 0.6rem", 
                        borderRadius: "20px", 
                        border: "none",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        backgroundColor: item.is_active ? "#e8f5e9" : "#ffebee",
                        color: item.is_active ? "#2e7d32" : "#c62828"
                      }}
                    >
                      {item.is_active ? "표시됨" : "숨김"}
                    </button>
                  </td>
                  <td style={{ padding: "1rem 0.5rem" }}>
                    {item.categories ? (
                      <span style={{ color: "#666", fontSize: "0.9rem" }}>
                        {item.categories.type === "solution" ? "[솔루션] " : "[제품] "} 
                        {item.categories.name}
                      </span>
                    ) : (
                      <span style={{ color: "#999" }}>카테고리 없음</span>
                    )}
                  </td>
                  <td style={{ padding: "1rem 0.5rem", fontWeight: "bold" }}>{item.title}</td>
                  <td style={{ padding: "1rem 0.5rem", color: "#666", fontSize: "0.9rem" }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1rem 0.5rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <Link 
                        href={`/admin/products/${item.id}`}
                        style={{ padding: "0.4rem 0.8rem", backgroundColor: "#f5f5f5", color: "#333", textDecoration: "none", border: "1px solid #ddd", borderRadius: "4px", fontSize: "0.9rem" }}
                      >
                        수정
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{ padding: "0.4rem 0.8rem", backgroundColor: "#fff", color: "#ff4d4f", border: "1px solid #ff4d4f", borderRadius: "4px", fontSize: "0.9rem", cursor: "pointer" }}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
