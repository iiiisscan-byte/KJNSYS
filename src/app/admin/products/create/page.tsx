"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import "react-quill-new/dist/quill.snow.css";

// ReactQuill은 SSR에서 에러를 낼 수 있으므로 dynamic import 사용
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CreateProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string; type: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) {
        console.error("카테고리 로딩 에러:", error);
      } else if (data) {
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id);
      }
    }
    fetchCategories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('kjnsys_uploads')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('kjnsys_uploads')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !categoryId) return alert("제품명과 카테고리는 필수 항목입니다.");
    
    setIsSubmitting(true);
    try {
      let imageUrl = null;
      
      // 이미지 업로드 처리
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // DB 저장
      const { error } = await supabase.from("products").insert([
        {
          title,
          category_id: categoryId,
          description,
          content,
          image_url: imageUrl,
          is_active: true
        }
      ]);

      if (error) throw error;
      
      alert("성공적으로 등록되었습니다.");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("Error creating product:", error);
      alert(`오류가 발생했습니다: ${error.message || "알 수 없는 오류"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem 5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#1a1a1a" }}>새 제품/솔루션 등록</h2>
          <p style={{ color: "#666", marginTop: "0.4rem" }}>웹사이트에 노출될 새로운 콘텐츠를 생성합니다.</p>
        </div>
        <Link 
          href="/admin/products"
          style={{ padding: "0.6rem 1.2rem", border: "1px solid #ddd", color: "#666", textDecoration: "none", borderRadius: "6px", fontSize: "0.9rem", fontWeight: "600" }}
        >
          목록으로 돌아가기
        </Link>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        
        {/* 기본 정보 섹션 */}
        <section style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #eee", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "700", color: "#333" }}>제품/솔루션명 *</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "0.8rem 1rem", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "1rem" }}
                placeholder="예: KJ-Flatbed Pro 100"
                required
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "700", color: "#333" }}>카테고리 선택 *</label>
              {categories.length > 0 ? (
                <select 
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ width: "100%", padding: "0.8rem 1rem", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "1rem", backgroundColor: "#fff" }}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      [{cat.type === "solution" ? "솔루션" : "제품"}] {cat.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ padding: "1rem", backgroundColor: "#fff5f5", border: "1px solid #feb2b2", borderRadius: "8px", color: "#c53030", fontSize: "0.9rem" }}>
                  등록된 카테고리가 없습니다. <strong>[카테고리 관리]</strong> 메뉴에서 먼저 카테고리를 만들어주세요.
                </div>
              )}
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "700", color: "#333" }}>짧은 설명 (목록 표시용)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", padding: "0.8rem 1rem", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "1rem", minHeight: "80px", resize: "vertical" }}
                placeholder="검색 결과나 목록 페이지에서 보여질 짧은 소개글을 작성하세요."
              />
            </div>
          </div>
        </section>

        {/* 이미지 섹션 */}
        <section style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #eee" }}>
          <label style={{ display: "block", marginBottom: "1rem", fontWeight: "700", color: "#333" }}>대표 이미지 (썸네일)</label>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <div style={{ 
              width: "200px", 
              height: "200px", 
              backgroundColor: "#f9f9f9", 
              border: "2px dashed #ddd", 
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden"
            }}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              ) : (
                <span style={{ color: "#aaa", fontSize: "0.9rem" }}>이미지 없음</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginBottom: "0.5rem" }}
              />
              <p style={{ fontSize: "0.85rem", color: "#888" }}>최적 규격: 800x800px (JPG, PNG, WebP)</p>
            </div>
          </div>
        </section>

        {/* 상세 에디터 섹션 */}
        <section style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #eee" }}>
          <label style={{ display: "block", marginBottom: "1.5rem", fontWeight: "700", color: "#333" }}>상세 설명 및 기술 사양</label>
          <div style={{ height: "500px", marginBottom: "3rem" }}>
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              style={{ height: "100%" }}
              placeholder="제품의 상세 특징, 기술 사양, 아키텍처 등을 자유롭게 작성하세요."
            />
          </div>
        </section>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button 
            type="button" 
            onClick={() => router.back()}
            style={{ padding: "1rem 2rem", backgroundColor: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}
          >
            취소
          </button>
          <button 
            type="submit"
            disabled={isSubmitting || categories.length === 0}
            style={{ 
              padding: "1rem 3rem", 
              backgroundColor: "#000", 
              color: "#fff", 
              border: "none", 
              borderRadius: "8px", 
              fontWeight: "700",
              fontSize: "1.1rem",
              cursor: (isSubmitting || categories.length === 0) ? "not-allowed" : "pointer",
              opacity: (isSubmitting || categories.length === 0) ? 0.6 : 1
            }}
          >
            {isSubmitting ? "등록 중..." : "제품 등록하기"}
          </button>
        </div>

      </form>
    </div>
  );
}
