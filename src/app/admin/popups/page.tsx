"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "../admin.module.css";

interface Popup {
  id: string;
  title: string;
  content: string;
  link_url: string | null;
  is_active: boolean;
  width: number;
  height: number;
  top_pos: number;
  left_pos: number;
  created_at: string;
}

export default function PopupManagement() {
  const [popups, setPopups] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);
  const [topPos, setTopPos] = useState(50);
  const [leftPos, setLeftPos] = useState(50);

  useEffect(() => {
    fetchPopups();
  }, []);

  async function fetchPopups() {
    try {
      const { data, error } = await supabase
        .from("popups")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setPopups(data);
    } catch (error) {
      console.error("Error fetching popups:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) {
      alert("공지 내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("popups").insert([
        {
          title,
          content,
          link_url: linkUrl || null,
          is_active: true,
          width,
          height,
          top_pos: topPos,
          left_pos: leftPos,
        },
      ]);

      if (error) throw error;

      alert("팝업이 성공적으로 등록되었습니다.");
      // Reset form
      setTitle("");
      setContent("");
      setLinkUrl("");
      fetchPopups();
    } catch (error: any) {
      alert(`팝업 등록 중 오류가 발생했습니다: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("popups")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      fetchPopups();
    } catch (error: any) {
      alert(`상태 변경 중 오류가 발생했습니다: ${error.message}`);
    }
  };

  const deletePopup = async (id: string) => {
    console.log("삭제 버튼 클릭됨! 즉시 삭제 시도 ID:", id);
    
    try {
      console.log("Supabase 서버에 삭제 요청 보내는 중...");
      const { data, error, status } = await supabase
        .from("popups")
        .delete()
        .eq("id", id)
        .select(); 

      console.log("Supabase 응답 상태 코드:", status);
      
      if (error) {
        console.error("Supabase 삭제 에러 발생:", error);
        alert(`삭제 에러: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        console.warn("삭제 요청은 성공했으나 지워진 데이터가 없습니다.");
        alert("삭제할 대상을 찾지 못했습니다.");
      } else {
        console.log("삭제 성공! 삭제된 데이터:", data);
        alert("팝업이 성공적으로 삭제되었습니다.");
      }
      
      fetchPopups(); 
    } catch (err: any) {
      console.error("삭제 과정 중 에러:", err);
      alert(`시스템 에러: ${err.message}`);
    }
  };

  if (loading) return <div className={styles.card}>로딩 중...</div>;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>텍스트 팝업 관리</h2>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>메인 페이지에 노출될 텍스트 공지사항 팝업들을 관리합니다.</p>
      </div>

      {/* 등록 폼 */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>새 공지 팝업 등록</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>공지 제목 (헤더에 표시됨)</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '0.6rem' }} placeholder="예: 근로자의 날 휴무 공지" />
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>공지 내용</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required style={{ width: '100%', padding: '0.6rem', minHeight: '100px' }} placeholder="공지 내용을 상세히 입력해주세요." />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>이동 링크 (선택)</label>
            <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} style={{ width: '100%', padding: '0.6rem' }} placeholder="/service 등" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>크기 (너비 x 높이 px)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} style={{ width: '100%', padding: '0.6rem' }} />
              <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} style={{ width: '100%', padding: '0.6rem' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.3rem' }}>위치 (상단 x 좌측 px)</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="number" value={topPos} onChange={(e) => setTopPos(Number(e.target.value))} style={{ width: '100%', padding: '0.6rem' }} />
              <input type="number" value={leftPos} onChange={(e) => setLeftPos(Number(e.target.value))} style={{ width: '100%', padding: '0.6rem' }} />
            </div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <button type="submit" disabled={isSubmitting} style={{ marginTop: '1rem', padding: '0.8rem 2rem', backgroundColor: '#004a99', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {isSubmitting ? "등록 중..." : "팝업 등록하기"}
            </button>
          </div>
        </form>
      </div>

      {/* 목록 */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
            <th style={{ padding: '1rem' }}>제목/내용</th>
            <th style={{ padding: '1rem' }}>설정 (위치/크기)</th>
            <th style={{ padding: '1rem' }}>상태</th>
            <th style={{ padding: '1rem' }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {popups.map((popup) => (
            <tr key={popup.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
              <td style={{ padding: '1rem' }}>
                <div style={{ fontWeight: '600' }}>{popup.title}</div>
                <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.3rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {popup.content}
                </div>
              </td>
              <td style={{ padding: '1rem', fontSize: '0.9rem' }}>
                Pos: {popup.top_pos}, {popup.left_pos}<br />
                Size: {popup.width} x {popup.height}
              </td>
              <td style={{ padding: '1rem' }}>
                <button 
                  onClick={() => toggleActive(popup.id, popup.is_active)}
                  style={{ 
                    padding: '0.4rem 0.8rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem',
                    border: 'none',
                    backgroundColor: popup.is_active ? '#e1f5fe' : '#ffebee',
                    color: popup.is_active ? '#01579b' : '#c62828',
                    cursor: 'pointer'
                  }}
                >
                  {popup.is_active ? "활성" : "비활성"}
                </button>
              </td>
              <td style={{ padding: '1rem' }}>
                <button onClick={() => deletePopup(popup.id)} style={{ color: '#c62828', border: 'none', background: 'none', cursor: 'pointer' }}>삭제</button>
              </td>
            </tr>
          ))}
          {popups.length === 0 && (
            <tr>
              <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: '#999' }}>등록된 팝업이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
