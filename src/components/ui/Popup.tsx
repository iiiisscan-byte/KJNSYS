"use client";

import { useState } from "react";
import Link from "next/link";
import { FiX } from "react-icons/fi";

interface PopupProps {
  id: string;
  title: string;
  content: string;
  linkUrl: string | null;
  width: number;
  height: number;
  top: number;
  left: number;
  onClose: () => void;
}

export default function Popup({ id, title, content, linkUrl, width, height, top, left, onClose }: PopupProps) {
  const [dontShowToday, setDontShowToday] = useState(false);

  const handleClose = () => {
    if (dontShowToday) {
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0); // Next midnight
      localStorage.setItem(`popup_hide_${id}`, tomorrow.getTime().toString());
    }
    onClose();
  };

  const bodyContent = (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center',
      height: '100%',
      padding: '2rem',
      textAlign: 'center',
      fontSize: '1.1rem',
      lineHeight: '1.6',
      color: '#333',
      wordBreak: 'keep-all'
    }}>
      {content}
    </div>
  );

  return (
    <div style={{ 
      position: 'fixed', 
      top: `${top}px`, 
      left: `${left}px`, 
      width: `${width}px`, 
      height: `${height}px`, 
      zIndex: 1000, 
      boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
      borderRadius: '20px',
      overflow: 'hidden',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#e63946', 
        padding: '1.2rem 1.5rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        color: '#fff'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '800' }}>{title}</h3>
        <button onClick={onClose} style={{ color: '#fff', fontSize: '1.6rem', display: 'flex', alignItems: 'center' }}>
          <FiX />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {linkUrl ? (
          <Link href={linkUrl} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
            {bodyContent}
          </Link>
        ) : (
          bodyContent
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '1rem 1.5rem', 
        backgroundColor: '#f8f9fa', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderTop: '1px solid #eee'
      }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#666', fontSize: '0.9rem' }}>
          <input 
            type="checkbox" 
            checked={dontShowToday} 
            onChange={(e) => setDontShowToday(e.target.checked)} 
            style={{ marginRight: '8px', width: '16px', height: '16px' }}
          />
          오늘 하루 보지 않기
        </label>
        <button 
          onClick={handleClose} 
          style={{ 
            backgroundColor: '#1a1c23', 
            color: '#fff', 
            padding: '0.6rem 1.5rem', 
            borderRadius: '8px', 
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
