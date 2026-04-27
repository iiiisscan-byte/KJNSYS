"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Category {
  id: string;
  name: string;
  type: string;
  created_at: string;
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState("product");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert("카테고리 이름을 입력하세요.");

    setIsSubmitting(true);
    const { error } = await supabase
      .from("categories")
      .insert([{ name, type }]);

    if (error) {
      console.error("Error adding category:", error);
      alert("카테고리 추가에 실패했습니다.");
    } else {
      setName("");
      fetchCategories();
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("정말 이 카테고리를 삭제하시겠습니까? 연결된 제품이 있다면 문제가 발생할 수 있습니다.")) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
      alert("카테고리 삭제에 실패했습니다.");
    } else {
      fetchCategories();
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2>카테고리 관리</h2>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>제품 및 솔루션의 카테고리를 관리합니다.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
        {/* 카테고리 추가 폼 */}
        <div style={{ padding: "1.5rem", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#fff", height: "fit-content" }}>
          <h3 style={{ marginBottom: "1.5rem" }}>새 카테고리 추가</h3>
          <form onSubmit={handleAddCategory} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>카테고리 이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
                placeholder="예: 스마트 팩토리, 머신비전"
                required
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>분류 (Type)</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
              >
                <option value="product">제품 (Product)</option>
                <option value="solution">솔루션 (Solution)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "1rem",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? "추가 중..." : "추가하기"}
            </button>
          </form>
        </div>

        {/* 카테고리 목록 */}
        <div style={{ padding: "1.5rem", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#fff" }}>
          <h3 style={{ marginBottom: "1.5rem" }}>카테고리 목록</h3>
          {loading ? (
            <p>로딩 중...</p>
          ) : categories.length === 0 ? (
            <p style={{ color: "#666" }}>등록된 카테고리가 없습니다.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #000", textAlign: "left" }}>
                  <th style={{ padding: "1rem 0.5rem" }}>타입</th>
                  <th style={{ padding: "1rem 0.5rem" }}>카테고리 이름</th>
                  <th style={{ padding: "1rem 0.5rem", textAlign: "right" }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "1rem 0.5rem" }}>
                      <span style={{ 
                        padding: "0.2rem 0.5rem", 
                        borderRadius: "4px", 
                        fontSize: "0.85rem",
                        backgroundColor: cat.type === "solution" ? "#e3f2fd" : "#f5f5f5",
                        color: cat.type === "solution" ? "#1976d2" : "#333"
                      }}>
                        {cat.type === "solution" ? "솔루션" : "제품"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 0.5rem", fontWeight: "bold" }}>{cat.name}</td>
                    <td style={{ padding: "1rem 0.5rem", textAlign: "right" }}>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        style={{ padding: "0.4rem 0.8rem", backgroundColor: "#ff4d4f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
