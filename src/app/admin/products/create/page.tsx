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
      const { data } = await supabase.from("categories").select("*").order("name");
      if (data) {
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
    if (!title || !categoryId) return alert("필수 항목을 입력해주세요.");
    
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
    } catch (error) {
      console.error("Error creating product:", error);
      alert("오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h2>새 제품/솔루션 등록</h2>
        <Link 
          href="/admin/products"
          style={{ padding: "0.5rem 1rem", border: "1px solid #ccc", color: "#333", textDecoration: "none", borderRadius: "4px" }}
        >
          취소 및 목록으로
        </Link>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", backgroundColor: "#fff", padding: "2rem", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
        
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>제품/솔루션명 *</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
            placeholder="제품 또는 솔루션의 이름을 입력하세요"
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>카테고리 *</label>
          <select 
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
            required
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.type === "solution" ? "[솔루션]" : "[제품]"} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>짧은 설명 (목록 표시용)</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px" }}
            placeholder="목록에서 보여질 짧은 소개글을 작성해주세요."
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>대표 이미지 (썸네일)</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          {imagePreview && (
            <div style={{ marginTop: "1rem" }}>
              <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", border: "1px solid #eee", borderRadius: "4px" }} />
            </div>
          )}
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>상세 내용 (에디터)</label>
          <div style={{ height: "400px", marginBottom: "2rem" }}>
            <ReactQuill 
              theme="snow" 
              value={content} 
              onChange={setContent} 
              style={{ height: "100%" }}
            />
          </div>
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
            opacity: isSubmitting ? 0.7 : 1,
            marginTop: "1rem"
          }}
        >
          {isSubmitting ? "등록 중..." : "등록하기"}
        </button>

      </form>
    </div>
  );
}
