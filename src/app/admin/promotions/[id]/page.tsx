"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "../../admin.module.css";
import Link from "next/link";

export default function EditPromotionPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [badge, setBadge] = useState("");
  const [isActive, setIsActive] = useState(true);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchPromotion();
  }, [params.id]);

  async function fetchPromotion() {
    try {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      if (data) {
        setTitle(data.title);
        setDescription(data.description || "");
        setLinkUrl(data.link_url || "");
        setImageUrl(data.image_url || "");
        setImagePreview(data.image_url || null);
        setCategory(data.category || "");
        setBadge(data.badge || "");
        setIsActive(data.is_active);
      }
    } catch (error: any) {
      alert(`데이터를 가져오는 중 오류 발생: ${error.message}`);
      router.push("/admin/promotions");
    } finally {
      setLoading(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `promo_${Date.now()}.${fileExt}`;
    const filePath = `promotions/${fileName}`;

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
    setIsSubmitting(true);

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile);
      }

      const { error } = await supabase
        .from("promotions")
        .update({
          title,
          description,
          image_url: finalImageUrl,
          link_url: linkUrl,
          category,
          badge,
          is_active: isActive
        })
        .eq("id", params.id);

      if (error) throw error;

      alert("프로모션이 수정되었습니다.");
      router.push("/admin/promotions");
    } catch (error: any) {
      alert(`수정 중 오류 발생: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className={styles.card}>로딩 중...</div>;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>프로모션 수정</h2>
        <Link href="/admin/promotions" style={{ color: '#666', fontSize: '0.9rem', textDecoration: 'none' }}>&larr; 목록으로 돌아가기</Link>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>카테고리</label>
            <input 
              type="text" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
              placeholder="예: EVENT, PROMO, SERVICE"
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>뱃지 (선택)</label>
            <input 
              type="text" 
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
              placeholder="예: HOT, NEW, SALE"
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>제목</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
            placeholder="프로모션 제목"
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>설명</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px", minHeight: "100px" }}
            placeholder="상세 설명 문구"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>링크 URL</label>
            <input 
              type="text" 
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
              placeholder="/product"
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span style={{ fontWeight: 'bold' }}>활성화 상태</span>
            </label>
          </div>
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>프로모션 이미지</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          {imagePreview && (
            <div style={{ marginTop: "1rem", position: "relative", width: "300px", height: "200px", borderRadius: "8px", overflow: "hidden", border: "1px solid #eee" }}>
              <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          style={{ 
            padding: "1rem", 
            backgroundColor: "#004a99", 
            color: "#fff", 
            border: "none", 
            borderRadius: "4px", 
            fontWeight: "bold",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.7 : 1,
            marginTop: "1rem"
          }}
        >
          {isSubmitting ? "저장 중..." : "프로모션 수정하기"}
        </button>
      </form>
    </div>
  );
}
