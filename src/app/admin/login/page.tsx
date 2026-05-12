"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [dbPassword, setDbPassword] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function getAdminPassword() {
      const { data, error } = await supabase
        .from("admin_config")
        .select("value")
        .eq("key", "admin_password")
        .single();
      
      if (data) {
        setDbPassword(data.value);
      } else {
        // 테이블이 없거나 데이터가 없는 경우 기본값 사용 (SQL 실행 전 대비)
        setDbPassword("admin123");
      }
    }
    getAdminPassword();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === dbPassword) {
      localStorage.setItem("kjnsys_admin_auth", "true");
      router.push("/admin");
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '3rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#000' }}>KJNSYS ADMIN</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>비밀번호</label>
            <input 
              type="password" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }}
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          <button 
            type="submit"
            style={{ width: '100%', padding: '1rem', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer' }}
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
