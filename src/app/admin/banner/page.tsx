"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "../admin.module.css";

export default function BannerManagement() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Banner State
  const [bannerId, setBannerId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("/product");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBanner() {
      try {
        const { data } = await supabase
          .from("banners")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        if (data) {
          setBannerId(data.id);
          setTitle(data.title);
          setDescription(data.description);
          setLinkUrl(data.link_url || "/product");
          setImageUrl(data.image_url);
          setImagePreview(data.image_url);
        }
      } catch (error) {
        console.error("Error fetching banner:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBanner();
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
    const fileName = `hero_${Date.now()}.${fileExt}`;
    const filePath = `banners/${fileName}`;

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

      if (!finalImageUrl) {
        alert("배너 이미지를 등록해주세요.");
        setIsSubmitting(false);
        return;
      }

      // 1. 기존 배너들을 비활성화 (단일 히어로 세션이므로)
      const { error: updateError } = await supabase
        .from("banners")
        .update({ is_active: false })
        .is("is_active", true);

      // 업데이트 에러는 데이터가 없을 때 발생할 수 있으므로 무시해도 되지만, 
      // 테이블 자체가 없을 때는 에러가 발생합니다.

      // 2. 새 배너 등록
      const bannerData = {
        title,
        description,
        link_url: linkUrl,
        image_url: finalImageUrl,
        is_active: true,
      };

      const { error: insertError } = await supabase
        .from("banners")
        .insert([bannerData]);

      if (insertError) throw insertError;

      alert("히어로 배너가 성공적으로 업데이트되었습니다.");
    } catch (error: any) {
      console.error("Error saving banner:", error);
      const errorMessage = error.message || "알 수 없는 오류가 발생했습니다.";
      alert(`배너 저장 중 오류가 발생했습니다: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className={styles.card}>로딩 중...</div>;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>히어로 세션 관리</h2>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>메인 페이지 최상단에 표시될 GIF 또는 이미지와 문구를 관리합니다.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "2rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>메인 타이틀</label>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
            placeholder="예: 최고의 IT 기기 및 솔루션"
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>서브 설명</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px" }}
            placeholder="타이틀 아래에 표시될 상세 문구"
            required
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>버튼 링크</label>
          <input 
            type="text" 
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
            placeholder="/product"
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>배너 이미지/GIF</label>
          <input 
            type="file" 
            accept="image/*,image/gif"
            onChange={handleImageChange}
            style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
          {imagePreview && (
            <div style={{ marginTop: "1rem", position: "relative", width: "100%", height: "200px", borderRadius: "8px", overflow: "hidden", border: "1px solid #eee" }}>
              <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(0,0,0,0.5)", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>미리보기</div>
            </div>
          )}
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
          {isSubmitting ? "저장 중..." : "설정 저장하기"}
        </button>
      </form>
    </div>
  );
}
