"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "../admin.module.css";

interface BannerSlot {
  id?: string;
  title: string;
  description: string;
  link_url: string;
  image_url: string;
  imageFile: File | null;
  imagePreview: string | null;
}

const DEFAULT_BANNER: BannerSlot = {
  title: "",
  description: "",
  link_url: "/product",
  image_url: "",
  imageFile: null,
  imagePreview: null,
};

export default function BannerManagement() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  const [banners, setBanners] = useState<BannerSlot[]>([
    { ...DEFAULT_BANNER },
    { ...DEFAULT_BANNER },
    { ...DEFAULT_BANNER },
  ]);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const { data, error } = await supabase
          .from("banners")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: true })
          .limit(3);

        if (error) throw error;

        if (data && data.length > 0) {
          setBanners(prev => {
            const next = [...prev];
            data.forEach((item, index) => {
              if (index < 3) {
                next[index] = {
                  id: item.id,
                  title: item.title || "",
                  description: item.description || "",
                  link_url: item.link_url || "/product",
                  image_url: item.image_url || "",
                  imageFile: null,
                  imagePreview: item.image_url || null,
                };
              }
            });
            return next;
          });
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  const handleInputChange = (index: number, field: keyof BannerSlot, value: string) => {
    const newBanners = [...banners];
    newBanners[index] = { ...newBanners[index], [field]: value };
    setBanners(newBanners);
  };

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newBanners = [...banners];
      newBanners[index] = { 
        ...newBanners[index], 
        imageFile: file, 
        imagePreview: URL.createObjectURL(file) 
      };
      setBanners(newBanners);
    }
  };

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `hero_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
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
      const updatedBannersData = [];

      for (let i = 0; i < banners.length; i++) {
        const banner = banners[i];
        let finalImageUrl = banner.image_url;

        // 이미지가 새로 선택된 경우 업로드
        if (banner.imageFile) {
          finalImageUrl = await uploadImage(banner.imageFile);
        }

        // 제목이나 이미지 중 하나라도 있어야 유효한 배너로 간주
        if (finalImageUrl || banner.title) {
          updatedBannersData.push({
            title: banner.title,
            description: banner.description,
            link_url: banner.link_url,
            image_url: finalImageUrl,
            is_active: true,
            created_at: new Date(Date.now() + i * 1000).toISOString(), // 순서 유지를 위해 약간의 시차 부여
          });
        }
      }

      if (updatedBannersData.length === 0) {
        alert("최소 하나 이상의 배너 내용을 입력해주세요.");
        setIsSubmitting(false);
        return;
      }

      // 1. 기존 활성 배너들 비활성화
      const { error: updateError } = await supabase
        .from("banners")
        .update({ is_active: false })
        .eq("is_active", true);

      if (updateError) console.warn("Update error (can ignore if no active banners):", updateError);

      // 2. 새 배너들 등록
      const { error: insertError } = await supabase
        .from("banners")
        .insert(updatedBannersData);

      if (insertError) throw insertError;

      alert("히어로 배너 3구가 성공적으로 업데이트되었습니다.");
      window.location.reload(); // 최신 상태 반영을 위해 새로고침
    } catch (error: any) {
      console.error("Error saving banners:", error);
      alert(`배너 저장 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className={styles.card}>로딩 중...</div>;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>히어로 세션 관리 (3구)</h2>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>메인 페이지 상단 캐러셀에 표시될 최대 3개의 배너를 관리합니다.</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            style={{
              padding: '0.8rem 1.5rem',
              backgroundColor: activeTab === idx ? '#000' : '#f5f5f5',
              color: activeTab === idx ? '#fff' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
          >
            배너 {idx + 1}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "2rem" }}>
        <div key={activeTab}>
          <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>배너 {activeTab + 1} 설정</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>메인 타이틀</label>
            <textarea 
              value={banners[activeTab].title}
              onChange={(e) => handleInputChange(activeTab, 'title', e.target.value)}
              style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px", minHeight: "60px" }}
              placeholder="예: 최고의 IT 기기 및 솔루션 (줄바꿈 가능)"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>서브 설명</label>
            <textarea 
              value={banners[activeTab].description}
              onChange={(e) => handleInputChange(activeTab, 'description', e.target.value)}
              style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px", minHeight: "80px" }}
              placeholder="타이틀 아래에 표시될 상세 문구"
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>버튼 링크</label>
            <input 
              type="text" 
              value={banners[activeTab].link_url}
              onChange={(e) => handleInputChange(activeTab, 'link_url', e.target.value)}
              style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
              placeholder="/product"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>배너 이미지/GIF</label>
            <input 
              type="file" 
              accept="image/*,image/gif"
              onChange={(e) => handleImageChange(activeTab, e)}
              style={{ width: "100%", padding: "0.8rem", border: "1px solid #ccc", borderRadius: "4px" }}
            />
            {banners[activeTab].imagePreview && (
              <div style={{ marginTop: "1rem", position: "relative", width: "100%", height: "250px", borderRadius: "8px", overflow: "hidden", border: "1px solid #eee" }}>
                <img src={banners[activeTab].imagePreview!} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", top: "10px", left: "10px", background: "rgba(0,0,0,0.5)", color: "#fff", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>미리보기 (배너 {activeTab + 1})</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '2rem', marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button 
            type="submit"
            disabled={isSubmitting}
            style={{ 
              padding: "1rem 2.5rem", 
              backgroundColor: "#004a99", 
              color: "#fff", 
              border: "none", 
              borderRadius: "4px", 
              fontWeight: "bold",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "전체 저장 중..." : "3구 설정 일괄 저장하기"}
          </button>
        </div>
      </form>
    </div>
  );
}
