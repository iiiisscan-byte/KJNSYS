"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [categories, setCategories] = useState<{ id: string; name: string; type: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      // Load Categories
      const { data: catData } = await supabase.from("categories").select("*").order("name");
      if (catData) setCategories(catData);

      // Load Product
      const { data: prodData, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("제품 정보를 불러올 수 없습니다.");
        router.push("/admin/products");
      } else if (prodData) {
        setTitle(prodData.title);
        setCategoryId(prodData.category_id);
        setDescription(prodData.description || "");
        setContent(prodData.content || "");
        setImagePreview(prodData.image_url);
      }
      setIsLoading(false);
    }
    loadData();
  }, [id, router]);

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

    if (uploadError) throw uploadError;

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
      let imageUrl = imagePreview; 
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase.from("products").update({
        title,
        category_id: categoryId,
        description,
        content,
        image_url: imageUrl
      }).eq("id", id);

      if (error) throw error;
      
      alert("성공적으로 수정되었습니다.");
      router.push("/admin/products");
    } catch (error: any) {
      console.error("수정 에러:", error);
      alert(`오류가 발생했습니다: ${error.message || "알 수 없는 오류"}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div style={{ textAlign: "center", padding: "5rem" }}>데이터를 불러오는 중...</div>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem 5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
        <div>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#1a1a1a" }}>제품/솔루션 수정</h2>
          <p style={{ color: "#666", marginTop: "0.4rem" }}>기존 콘텐츠의 정보를 업데이트합니다.</p>
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
                required
              />
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "700", color: "#333" }}>카테고리 선택 *</label>
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
            </div>

            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "700", color: "#333" }}>짧은 설명 (목록 표시용)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", padding: "0.8rem 1rem", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "1rem", minHeight: "80px", resize: "vertical" }}
              />
            </div>
          </div>
        </section>

        {/* 이미지 섹션 */}
        <section style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #eee" }}>
          <label style={{ display: "block", marginBottom: "1rem", fontWeight: "700", color: "#333" }}>대표 이미지 변경</label>
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
              <p style={{ fontSize: "0.85rem", color: "#888" }}>{imageFile ? "새 파일이 선택되었습니다." : "현재 등록된 이미지입니다. 변경하려면 파일을 선택하세요."}</p>
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
            disabled={isSubmitting}
            style={{ 
              padding: "1rem 3rem", 
              backgroundColor: "#000", 
              color: "#fff", 
              border: "none", 
              borderRadius: "8px", 
              fontWeight: "700",
              fontSize: "1.1rem",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.6 : 1
            }}
          >
            {isSubmitting ? "저장 중..." : "수정 완료하기"}
          </button>
        </div>

      </form>
    </div>
  );
}
