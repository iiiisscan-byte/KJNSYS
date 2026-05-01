"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  status: string;
  created_at: string;
}

export default function InquiryManagement() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inquiries:", error);
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from("inquiries")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      console.error("Error updating inquiry:", error);
      alert("상태 변경에 실패했습니다.");
    } else {
      fetchInquiries();
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
    }
  };

  const handleDelete = async (id: string) => {
    console.log("문의 삭제 시도 ID:", id);

    try {
      const { data, error } = await supabase
        .from("inquiries")
        .delete()
        .eq("id", id)
        .select();

      if (error) {
        console.error("Error deleting inquiry:", error);
        alert(`삭제에 실패했습니다: ${error.message}`);
      } else if (!data || data.length === 0) {
        alert("삭제할 대상을 찾지 못했습니다.");
      } else {
        alert("성공적으로 삭제되었습니다.");
        fetchInquiries();
        if (selectedInquiry && selectedInquiry.id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (err: any) {
      alert(`시스템 에러: ${err.message}`);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2>서비스 문의 관리</h2>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>고객이 홈페이지를 통해 접수한 문의 내역을 확인합니다.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selectedInquiry ? "1fr 1fr" : "1fr", gap: "2rem" }}>
        {/* 문의 목록 */}
        <div style={{ padding: "1.5rem", border: "1px solid #e0e0e0", borderRadius: "8px", backgroundColor: "#fff", height: "fit-content" }}>
          {loading ? (
            <p>로딩 중...</p>
          ) : inquiries.length === 0 ? (
            <p style={{ color: "#666", textAlign: "center", padding: "2rem 0" }}>접수된 문의가 없습니다.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #000", textAlign: "left" }}>
                  <th style={{ padding: "1rem 0.5rem" }}>상태</th>
                  <th style={{ padding: "1rem 0.5rem" }}>이름(회사)</th>
                  <th style={{ padding: "1rem 0.5rem" }}>접수일</th>
                  <th style={{ padding: "1rem 0.5rem", textAlign: "right" }}>상세</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq.id} style={{ borderBottom: "1px solid #eee", backgroundColor: selectedInquiry?.id === inq.id ? "#f5f5f5" : "transparent" }}>
                    <td style={{ padding: "1rem 0.5rem" }}>
                      <span style={{ 
                        padding: "0.3rem 0.6rem", 
                        borderRadius: "20px", 
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        backgroundColor: inq.status === "completed" ? "#e8f5e9" : "#fff3e0",
                        color: inq.status === "completed" ? "#2e7d32" : "#e65100"
                      }}>
                        {inq.status === "completed" ? "답변완료" : "대기중"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 0.5rem" }}>
                      <strong>{inq.name}</strong>
                      {inq.company && <span style={{ color: "#666", fontSize: "0.9rem", display: "block" }}>{inq.company}</span>}
                    </td>
                    <td style={{ padding: "1rem 0.5rem", color: "#666", fontSize: "0.9rem" }}>
                      {new Date(inq.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem 0.5rem", textAlign: "right" }}>
                      <button
                        onClick={() => setSelectedInquiry(inq)}
                        style={{ padding: "0.4rem 0.8rem", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.9rem", cursor: "pointer" }}
                      >
                        보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 상세 보기 패널 */}
        {selectedInquiry && (
          <div style={{ padding: "2rem", border: "1px solid #000", borderRadius: "8px", backgroundColor: "#fafafa", position: "sticky", top: "2rem", height: "fit-content" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <h3>문의 상세 내용</h3>
              <button 
                onClick={() => setSelectedInquiry(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#999" }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              <div>
                <span style={{ color: "#666", fontSize: "0.9rem", display: "block", marginBottom: "0.2rem" }}>보낸 사람</span>
                <strong>{selectedInquiry.name}</strong> {selectedInquiry.company && `(${selectedInquiry.company})`}
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <span style={{ color: "#666", fontSize: "0.9rem", display: "block", marginBottom: "0.2rem" }}>이메일</span>
                  <a href={`mailto:${selectedInquiry.email}`} style={{ color: "#0066cc" }}>{selectedInquiry.email || "-"}</a>
                </div>
                <div>
                  <span style={{ color: "#666", fontSize: "0.9rem", display: "block", marginBottom: "0.2rem" }}>연락처</span>
                  <a href={`tel:${selectedInquiry.phone}`} style={{ color: "#0066cc" }}>{selectedInquiry.phone || "-"}</a>
                </div>
              </div>

              <div>
                <span style={{ color: "#666", fontSize: "0.9rem", display: "block", marginBottom: "0.2rem" }}>접수일시</span>
                {new Date(selectedInquiry.created_at).toLocaleString()}
              </div>

              <div style={{ marginTop: "1rem" }}>
                <span style={{ color: "#666", fontSize: "0.9rem", display: "block", marginBottom: "0.5rem" }}>문의 내용</span>
                <div style={{ padding: "1rem", backgroundColor: "#fff", border: "1px solid #ddd", borderRadius: "4px", whiteSpace: "pre-wrap", minHeight: "150px" }}>
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", borderTop: "1px solid #eee", paddingTop: "1.5rem" }}>
              {selectedInquiry.status === "pending" ? (
                <button
                  onClick={() => handleUpdateStatus(selectedInquiry.id, "completed")}
                  style={{ flex: 1, padding: "1rem", backgroundColor: "#000", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
                >
                  답변 완료 처리
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateStatus(selectedInquiry.id, "pending")}
                  style={{ flex: 1, padding: "1rem", backgroundColor: "#fff", color: "#000", border: "1px solid #000", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
                >
                  대기중으로 되돌리기
                </button>
              )}
              
              <button
                onClick={() => handleDelete(selectedInquiry.id)}
                style={{ padding: "1rem 1.5rem", backgroundColor: "#fff", color: "#ff4d4f", border: "1px solid #ff4d4f", borderRadius: "4px", fontWeight: "bold", cursor: "pointer" }}
              >
                삭제
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
