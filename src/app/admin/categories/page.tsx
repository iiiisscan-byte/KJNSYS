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
    try {
      const { error } = await supabase
        .from("categories")
        .insert([{ name, type }]);

      if (error) {
        console.error("Error adding category:", error);
        alert(`추가 실패: ${error.message}`);
      } else {
        setName("");
        fetchCategories();
      }
    } catch (err: any) {
      alert(`에러: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    // 확인창 없이 즉시 삭제 시도 (브라우저 차단 방지)
    console.log("카테고리 삭제 시도 ID:", id);

    try {
      const { data, error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        console.error("Error deleting category:", error);
        alert(`삭제 실패: ${error.message}`);
      } else if (!data || data.length === 0) {
        alert("삭제할 대상을 찾지 못했습니다.");
      } else {
        alert("성공적으로 삭제되었습니다.");
        fetchCategories();
      }
    } catch (err: any) {
      alert(`시스템 에러: ${err.message}`);
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === categories.length - 1)
    ) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentItem = categories[index];
    const targetItem = categories[targetIndex];

    try {
      // Swap created_at values to change the order
      const { error: error1 } = await supabase
        .from("categories")
        .update({ created_at: targetItem.created_at })
        .eq("id", currentItem.id);

      const { error: error2 } = await supabase
        .from("categories")
        .update({ created_at: currentItem.created_at })
        .eq("id", targetItem.id);

      if (error1 || error2) {
        console.error("Error moving category:", error1 || error2);
        alert("순서 변경에 실패했습니다.");
      } else {
        fetchCategories();
      }
    } catch (err: any) {
      alert(`시스템 에러: ${err.message}`);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>카테고리 관리</h2>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>제품 및 솔루션의 하위 메뉴(분류)를 관리합니다.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
        {/* 카테고리 추가 폼 */}
        <div style={{ padding: "1.5rem", border: "1px solid #e0e0e0", borderRadius: "12px", backgroundColor: "#fff", height: "fit-content" }}>
          <h3 style={{ marginBottom: "1.5rem", fontSize: "1.2rem", fontWeight: "700" }}>새 카테고리 추가</h3>
          <form onSubmit={handleAddCategory} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.9rem" }}>카테고리 이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "8px" }}
                placeholder="예: 평판 스캐너, 스마트 팩토리"
                required
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.9rem" }}>분류 (Type)</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#fff" }}
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
                borderRadius: "8px",
                fontWeight: "700",
                cursor: isSubmitting ? "not-allowed" : "pointer"
              }}
            >
              {isSubmitting ? "추가 중..." : "카테고리 추가하기"}
            </button>
          </form>
        </div>

        {/* 카테고리 목록 */}
        <div style={{ padding: "1.5rem", border: "1px solid #e0e0e0", borderRadius: "12px", backgroundColor: "#fff" }}>
          <h3 style={{ marginBottom: "1.5rem", fontSize: "1.2rem", fontWeight: "700" }}>등록된 카테고리 목록</h3>
          {loading ? (
            <p>로딩 중...</p>
          ) : categories.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
              등록된 카테고리가 없습니다. 왼쪽 폼에서 먼저 등록해 주세요.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                  <th style={{ padding: "1rem 0.5rem" }}>순서</th>
                  <th style={{ padding: "1rem 0.5rem" }}>타입</th>
                  <th style={{ padding: "1rem 0.5rem" }}>이름</th>
                  <th style={{ padding: "1rem 0.5rem", textAlign: "right" }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={cat.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <td style={{ padding: "1rem 0.5rem" }}>
                      <div style={{ display: "flex", gap: "0.2rem" }}>
                        <button
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          style={{
                            padding: "0.2rem 0.4rem",
                            cursor: index === 0 ? "not-allowed" : "pointer",
                            opacity: index === 0 ? 0.3 : 1,
                            backgroundColor: "#f0f0f0",
                            border: "none",
                            borderRadius: "4px"
                          }}
                          title="위로 이동"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === categories.length - 1}
                          style={{
                            padding: "0.2rem 0.4rem",
                            cursor: index === categories.length - 1 ? "not-allowed" : "pointer",
                            opacity: index === categories.length - 1 ? 0.3 : 1,
                            backgroundColor: "#f0f0f0",
                            border: "none",
                            borderRadius: "4px"
                          }}
                          title="아래로 이동"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 0.5rem" }}>
                      <span style={{ 
                        padding: "0.2rem 0.6rem", 
                        borderRadius: "4px", 
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        backgroundColor: cat.type === "solution" ? "#e3f2fd" : "#f5f5f5",
                        color: cat.type === "solution" ? "#1976d2" : "#555"
                      }}>
                        {cat.type === "solution" ? "솔루션" : "제품"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 0.5rem", fontWeight: "600" }}>{cat.name}</td>
                    <td style={{ padding: "1rem 0.5rem", textAlign: "right" }}>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        style={{ padding: "0.4rem 0.8rem", backgroundColor: "transparent", color: "#ff4d4f", border: "1px solid #ff4d4f", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}
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
