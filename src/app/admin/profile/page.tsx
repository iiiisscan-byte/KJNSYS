"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import styles from "../admin.module.css";

export default function AdminProfilePage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dbPassword, setDbPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function getAdminPassword() {
      const { data } = await supabase
        .from("admin_config")
        .select("value")
        .eq("key", "admin_password")
        .single();
      
      if (data) {
        setDbPassword(data.value);
      } else {
        setDbPassword("admin123");
      }
      setLoading(false);
    }
    getAdminPassword();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentPassword !== dbPassword) {
      alert("현재 비밀번호가 일치하지 않습니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("새 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    if (newPassword.length < 4) {
      alert("비밀번호는 최소 4자 이상이어야 합니다.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("admin_config")
        .update({ value: newPassword, updated_at: new Date().toISOString() })
        .eq("key", "admin_password");

      if (error) throw error;

      alert("비밀번호가 성공적으로 변경되었습니다. 다음 로그인부터 적용됩니다.");
      setDbPassword(newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("비밀번호 변경 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className={styles.card}>불러오는 중...</div>;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>관리자 비밀번호 변경</h2>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>보안을 위해 정기적으로 비밀번호를 변경하는 것을 권장합니다.</p>
      </div>

      <form onSubmit={handleChangePassword} style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>현재 비밀번호</label>
          <input 
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>

        <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>새 비밀번호</label>
          <input 
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }}
            required
            placeholder="최소 4자 이상"
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>새 비밀번호 확인</label>
          <input 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>

        <button 
          type="submit"
          disabled={saving}
          style={{ 
            padding: '1rem', 
            backgroundColor: '#000', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '4px', 
            fontWeight: 'bold', 
            cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? 0.7 : 1
          }}
        >
          {saving ? "변경 중..." : "비밀번호 변경하기"}
        </button>
      </form>
    </div>
  );
}
