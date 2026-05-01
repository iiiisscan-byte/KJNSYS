"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FiDownload, FiSearch, FiFileText } from "react-icons/fi";

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

export default function ArchivePage() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const categories = ["전체", "드라이버", "매뉴얼", "카탈로그", "펌웨어", "기타"];

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

  const filteredDownloads = downloads.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = async (id: string, url: string, filename: string) => {
    // 다운로드 횟수 증가 (선택 사항)
    await supabase.rpc('increment_download_count', { row_id: id });
    
    // 새 창에서 파일 열기/다운로드
    window.open(url, '_blank');
  };

  return (
    <div className="container mt-8 mb-8">
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: "800", marginBottom: "1rem" }}>자료실</h2>
        <p style={{ color: "#666" }}>제품 사용에 필요한 드라이버, 매뉴얼, 최신 정보를 다운로드하실 수 있습니다.</p>
      </div>

      {/* 검색 및 필터 */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: "2rem",
        gap: "1rem",
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "0.6rem 1.2rem",
                borderRadius: "30px",
                border: "1px solid",
                borderColor: selectedCategory === cat ? "#004a99" : "#ddd",
                backgroundColor: selectedCategory === cat ? "#004a99" : "#fff",
                color: selectedCategory === cat ? "#fff" : "#666",
                fontSize: "0.9rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "300px" }}>
          <FiSearch style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#aaa" }} />
          <input 
            type="text" 
            placeholder="자료 명칭으로 검색하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "0.8rem 1rem 0.8rem 2.8rem", 
              borderRadius: "8px", 
              border: "1px solid #ddd",
              fontSize: "0.95rem"
            }}
          />
        </div>
      </div>

      {/* 자료 목록 */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "5rem" }}>자료를 불러오는 중입니다...</div>
      ) : filteredDownloads.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem", color: "#999", backgroundColor: "#f9f9f9", borderRadius: "12px" }}>
          검색 결과에 맞는 자료가 없습니다.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredDownloads.map((item) => (
            <div 
              key={item.id}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                padding: "1.5rem 2rem", 
                backgroundColor: "#fff", 
                border: "1px solid #eee", 
                borderRadius: "12px",
                transition: "transform 0.2s ease, box-shadow 0.2s ease"
              }}
              className="download-item"
            >
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <div style={{ 
                  width: "48px", 
                  height: "48px", 
                  borderRadius: "10px", 
                  backgroundColor: "#f0f7ff", 
                  color: "#004a99",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem"
                }}>
                  <FiFileText />
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.3rem" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#004a99", backgroundColor: "#e3f2fd", padding: "0.2rem 0.6rem", borderRadius: "4px" }}>
                      {item.category}
                    </span>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0 }}>{item.title}</h4>
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#888" }}>
                    등록일: {new Date(item.created_at).toLocaleDateString()} {item.version && `| 버전: ${item.version}`}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => handleDownload(item.id, item.file_url, item.title)}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  padding: "0.8rem 1.5rem", 
                  backgroundColor: "#000", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "8px", 
                  fontWeight: "700", 
                  cursor: "pointer",
                  transition: "background-color 0.2s ease"
                }}
                className="download-btn"
              >
                <FiDownload /> 다운로드
              </button>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .download-item:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.05);
          border-color: #004a99;
        }
        .download-btn:hover {
          background-color: #333;
        }
      `}</style>
    </div>
  );
}
