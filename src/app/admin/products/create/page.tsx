"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CreateProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: string; name: string; type: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Features State
  const [features, setFeatures] = useState<{ id: string; title: string; description: string; icon_url: string | null; file: File | null; preview: string | null }[]>([]);
  
  // Specifications State
  const [specifications, setSpecifications] = useState<{ id: string; label: string; value: string }[]>([]);

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

  const addFeature = () => {
    setFeatures([...features, { id: Math.random().toString(), title: "", description: "", icon_url: null, file: null, preview: null }]);
  };

  const removeFeature = (id: string) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const handleFeatureChange = (id: string, field: string, value: any) => {
    setFeatures(features.map(f => {
      if (f.id === id) {
        if (field === "file" && value) {
          return { ...f, file: value, preview: URL.createObjectURL(value) };
        }
        return { ...f, [field]: value };
      }
      return f;
    }));
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { id: Math.random().toString(), label: "", value: "" }]);
  };

  const removeSpecification = (id: string) => {
    setSpecifications(specifications.filter(s => s.id !== id));
  };

  const handleSpecificationChange = (id: string, field: string, value: string) => {
    setSpecifications(specifications.map(s => s.id === id ? { ...s, [field]: value } : s));
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

      // 특장점 이미지 업로드 처리
      const processedFeatures = await Promise.all(features.map(async (f) => {
        let iconUrl = f.icon_url;
        if (f.file) {
          iconUrl = await uploadImage(f.file);
        }
        return { title: f.title, description: f.description, icon_url: iconUrl };
      }));

      // 제품사양 처리
      const processedSpecs = specifications.map(s => ({ label: s.label, value: s.value }));

      // DB 저장
      const { error } = await supabase.from("products").insert([
        {
          title,
          category_id: categoryId,
          manufacturer,
          description,
          features: processedFeatures,
          specifications: processedSpecs,
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
            <div style={{ gridColumn: "span 1" }}>
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

            <div style={{ gridColumn: "span 1" }}>
              <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "700", color: "#333" }}>제조사</label>
              <input 
                type="text" 
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                style={{ width: "100%", padding: "0.8rem 1rem", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "1rem" }}
                placeholder="예: MICROTEK"
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
              <label style={{ display: "block", marginBottom: "0.6rem", fontWeight: "700", color: "#333" }}>제품소개</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", padding: "0.8rem 1rem", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "1rem", minHeight: "80px", resize: "vertical" }}
                placeholder="제품 또는 솔루션에 대한 소개글을 작성하세요. (이 내용은 상세 페이지 상단과 목록에 노출됩니다.)"
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

        {/* 특장점(Features) 섹션 */}
        <section style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <label style={{ fontWeight: "700", color: "#333", margin: 0 }}>특장점 (Features)</label>
            <button 
              type="button" 
              onClick={addFeature}
              style={{ padding: "0.5rem 1rem", backgroundColor: "#004a99", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.9rem", cursor: "pointer", fontWeight: "bold" }}
            >
              + 특장점 추가하기
            </button>
          </div>
          
          {features.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", backgroundColor: "#f9f9f9", borderRadius: "8px", color: "#999" }}>
              등록된 특장점이 없습니다. 우측 상단의 버튼을 눌러 추가하세요.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {features.map((feature, index) => (
                <div key={feature.id} style={{ display: "flex", gap: "1.5rem", padding: "1.5rem", backgroundColor: "#fcfcfc", border: "1px solid #e0e0e0", borderRadius: "8px", position: "relative" }}>
                  <button 
                    type="button"
                    onClick={() => removeFeature(feature.id)}
                    style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "#ff4d4f", cursor: "pointer", fontSize: "1.2rem" }}
                    title="삭제"
                  >
                    ×
                  </button>
                  
                  {/* 아이콘 */}
                  <div style={{ width: "100px", flexShrink: 0 }}>
                    <div style={{ width: "80px", height: "80px", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      {feature.preview ? (
                        <img src={feature.preview} alt="Icon Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "#aaa" }}>아이콘</span>
                      )}
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFeatureChange(feature.id, "file", e.target.files?.[0])}
                      style={{ fontSize: "0.7rem", width: "100%" }}
                    />
                  </div>
                  
                  {/* 내용 */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <input 
                      type="text" 
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(feature.id, "title", e.target.value)}
                      placeholder={`특장점 ${index + 1} 제목`}
                      style={{ padding: "0.6rem", border: "1px solid #ddd", borderRadius: "6px", fontWeight: "bold" }}
                      required
                    />
                    <textarea 
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(feature.id, "description", e.target.value)}
                      placeholder="설명을 입력하세요."
                      style={{ padding: "0.6rem", border: "1px solid #ddd", borderRadius: "6px", minHeight: "60px", resize: "vertical" }}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 제품사양(Specifications) 섹션 */}
        <section style={{ backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", border: "1px solid #eee" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <label style={{ fontWeight: "700", color: "#333", margin: 0 }}>제품 사양 (Specifications)</label>
            <button 
              type="button" 
              onClick={addSpecification}
              style={{ padding: "0.5rem 1rem", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "6px", fontSize: "0.9rem", cursor: "pointer", fontWeight: "bold" }}
            >
              + 사양 추가하기
            </button>
          </div>
          
          {specifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", backgroundColor: "#f9f9f9", borderRadius: "8px", color: "#999" }}>
              등록된 사양이 없습니다.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {specifications.map((spec, index) => (
                <div key={spec.id} style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <input 
                    type="text" 
                    value={spec.label}
                    onChange={(e) => handleSpecificationChange(spec.id, "label", e.target.value)}
                    placeholder="항목 (예: 크기, 무게)"
                    style={{ flex: 1, padding: "0.8rem", border: "1px solid #ddd", borderRadius: "6px" }}
                    required
                  />
                  <input 
                    type="text" 
                    value={spec.value}
                    onChange={(e) => handleSpecificationChange(spec.id, "value", e.target.value)}
                    placeholder="값 (예: 114 x 132 mm)"
                    style={{ flex: 2, padding: "0.8rem", border: "1px solid #ddd", borderRadius: "6px" }}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => removeSpecification(spec.id)}
                    style={{ padding: "0.8rem 1rem", backgroundColor: "#ff4d4f", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
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
