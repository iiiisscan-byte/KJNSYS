"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./inquiry.module.css";

export default function InquiryPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    category: "제품 구매",
    title: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullMessage = `[문의 유형: ${formData.category}]\n[제목: ${formData.title}]\n\n${formData.message}`;

    const { error } = await supabase.from("inquiries").insert([
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: fullMessage,
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Error submitting inquiry:", error);
      alert("문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } else {
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        category: "제품 구매",
        title: "",
        message: "",
      });
    }
    setIsSubmitting(false);
  };

  if (isSuccess) {
    return (
      <div className="container mt-4 mb-4 text-center">
        <div style={{ padding: '4rem 2rem', backgroundColor: '#f9f9f9', borderRadius: '12px' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#004a99' }}>문의가 성공적으로 접수되었습니다!</h2>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2.5rem' }}>
            보내주신 소중한 의견은 담당자 확인 후 기재하신 연락처로 답변 드리겠습니다. <br />
            케이제이엔시스를 이용해 주셔서 감사합니다.
          </p>
          <button 
            onClick={() => setIsSuccess(false)}
            style={{ 
              padding: '1rem 3rem', 
              backgroundColor: '#000', 
              color: '#fff', 
              border: 'none', 
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            추가 문의하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-2 mb-4">
      <h2 className="mb-2 text-center" style={{ fontSize: '2.2rem', fontWeight: '800' }}>서비스 문의</h2>
      <p className="text-center mb-4" style={{ color: '#666' }}>
        궁금하신 점을 남겨주시면 정성을 다해 답변해 드리겠습니다.
      </p>

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">성함 *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="성함을 입력해 주세요"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="company">회사명</label>
            <input 
              type="text" 
              id="company" 
              name="company" 
              value={formData.company} 
              onChange={handleChange} 
              placeholder="회사명을 입력해 주세요"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">이메일 *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="example@email.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">연락처 *</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              required 
              placeholder="010-0000-0000"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category">문의 유형</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange}>
            <option value="제품 구매">제품 구매 문의</option>
            <option value="A/S 신청">A/S 신청</option>
            <option value="기술 지원">기술 지원</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title">제목 *</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            placeholder="제목을 입력해 주세요"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message">문의 내용 *</label>
          <textarea 
            id="message" 
            name="message" 
            value={formData.message} 
            onChange={handleChange} 
            required 
            rows={8}
            placeholder="문의 내용을 상세히 적어주시면 정확한 답변에 도움이 됩니다."
          ></textarea>
        </div>

        <div className={styles.privacyBox}>
          <p>
            <strong>개인정보 수집 및 이용 동의</strong><br />
            회사는 문의 응대를 위해 성함, 이메일, 연락처 등의 개인정보를 수집합니다. 
            수집된 정보는 문의 답변 완료 후 법령에 따라 일정 기간 보관 후 파기됩니다.
          </p>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? "접수 중..." : "문의 접수하기"}
        </button>
      </form>
    </div>
  );
}
