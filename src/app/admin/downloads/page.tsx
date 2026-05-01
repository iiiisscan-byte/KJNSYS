"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "../admin.module.css";

interface Download {
  id: string;
  title: string;
  category: string;
  file_url: string;
  version: string | null;
  description: string | null;
  download_count: number;
  created_at: string;
}

export default function DownloadManagement() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("드라이버");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDownloads();
  }, []);

  async function fetchDownloads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("downloads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching downloads:", error);
    } else {
      setDownloads(data || []);
    }
    setLoading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `downloads/${fileName}`;

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
    if (!title || !file) return alert("제목과 파일을 모두 입력해주세요.");

    setIsSubmitting(true);
    try {
      const fileUrl = await uploadFile(file);

      const { error } = await supabase.from("downloads").insert([
        {
          title,
          category,
          file_url: fileUrl,
          version: version || null,
          description: description || null,
        },
      ]);

      if (error) throw error;

      alert("자료가 성공적으로 등록되었습니다.");
      setTitle("");
      setVersion("");
      setDescription("");
      setFile(null);
      fetchDownloads();
    } catch (error: any) {
      alert(`등록 중 오류 발생: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    console.log("자료 삭제 시도 ID:", id);
    try {
      const { data, error } = await supabase
        .from("downloads")
        .delete()
        .eq("id", id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        alert("삭제할 대상을 찾지 못했습니다.");
      } else {
        alert("자료가 삭제되었습니다.");
        fetchDownloads();
      }
    } catch (error: any) {
      alert(`삭제 중 오류 발생: ${error.message}`);
    }
  };

  if (loading && downloads.length === 0) return <div className={styles.card}>로딩 중...</div>;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>자료실 관리</h2>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>드라이버, 매뉴얼, 카탈로그 등의 기술 자료를 관리합니다.</p>
      </div>

      {/* 등록 폼 */}
      <div style={{ backgroundColor: "#f9f9f9", padding: "2rem", borderRadius: "12px", marginBottom: "3rem", border: "1px solid #eee" }}>
        <h3 style={{ marginBottom: "1.5rem", fontWeight: "700" }}>새 자료 등록</h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>자료 제목 *</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="예: KJ-Series 통합 드라이버 v1.2"
              style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }}
              required
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>분류 *</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#fff" }}
            >
              <option value="드라이버">드라이버</option>
              <option value="매뉴얼">매뉴얼</option>
              <option value="카탈로그">카탈로그/브로셔</option>
              <option value="펌웨어">펌웨어</option>
              <option value="기타">기타 자료</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>버전 (선택)</label>
            <input 
              type="text" 
              value={version} 
              onChange={(e) => setVersion(e.target.value)} 
              placeholder="예: v1.2.0"
              style={{ width: "100%", padding: "0.8rem", borderRadius: "8px", border: "1px solid #ddd" }}
            />
          </div>
          <div style={{ gridColumn: "span 2" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>파일 업로드 *</label>
            <input 
              type="file" 
              onChange={handleFileChange}
              style={{ width: "100%", padding: "0.8rem", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "8px" }}
              required
            />
            <p style={{ fontSize: "0.85rem", color: "#888", marginTop: "0.4rem" }}>PDF, ZIP, EXE 등 지원하는 파일 형식만 업로드해 주세요.</p>
          </div>
          <div style={{ gridColumn: "span 2" }}>
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
                cursor: isSubmitting ? "not-allowed" : "pointer",
                opacity: isSubmitting ? 0.7 : 1
              }}
            >
              {isSubmitting ? "업로드 중..." : "자료 등록하기"}
            </button>
          </div>
        </form>
      </div>

      {/* 목록 테이블 */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
              <th style={{ padding: "1rem" }}>분류</th>
              <th style={{ padding: "1rem" }}>제목 / 버전</th>
              <th style={{ padding: "1rem" }}>등록일</th>
              <th style={{ padding: "1rem", textAlign: "right" }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {downloads.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                <td style={{ padding: "1rem" }}>
                  <span style={{ 
                    padding: "0.3rem 0.7rem", 
                    backgroundColor: "#f0f0f0", 
                    borderRadius: "4px", 
                    fontSize: "0.85rem",
                    color: "#555"
                  }}>
                    {item.category}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ fontWeight: "600" }}>{item.title}</div>
                  {item.version && <div style={{ fontSize: "0.85rem", color: "#004a99", marginTop: "0.2rem" }}>{item.version}</div>}
                </td>
                <td style={{ padding: "1rem", color: "#888", fontSize: "0.9rem" }}>
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    style={{ background: "none", border: "1px solid #ff4d4f", color: "#ff4d4f", padding: "0.4rem 0.8rem", borderRadius: "6px", cursor: "pointer", fontSize: "0.85rem" }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {downloads.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "#999" }}>등록된 자료가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
